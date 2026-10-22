"use client";

import { useSyncExternalStore } from "react";
import { getImageProps } from "next/image";
import {
  autoAmbiance,
  DEFAULT_LIGHT,
  DEFAULT_SEASON,
  LIGHTS,
  plateSrc,
  PLATE_H,
  PLATE_W,
  SEASONS,
  SESSION_KEY,
  STORAGE_KEY,
  type AmbianceMode,
  type Light,
  type Season,
} from "@/data/ambiances";

/* ──────────────────────────────────────────────────────────────
   État partagé de l'ambiance.
   La source de vérité visuelle est l'attribut data-* de <html>
   (posé avant le premier rendu par le script de démarrage) :
   toutes les couleurs du site en découlent via les variables CSS.
   Ce module synchronise React avec ces attributs.
   ────────────────────────────────────────────────────────────── */

export type Ambiance = { season: Season; light: Light; mode: AmbianceMode };
export type Change = { from: Ambiance; to: Ambiance; kind: "lumiere" | "saison" | "les-deux"; at: number };

const SERVER: Ambiance = { season: DEFAULT_SEASON, light: DEFAULT_LIGHT, mode: "manuel" };
let current: Ambiance = SERVER;
let lastChange: Change | null = null;
const listeners = new Set<() => void>();
let booted = false;

function readDom(): Ambiance {
  const d = document.documentElement;
  const s = d.getAttribute("data-season") as Season;
  const l = d.getAttribute("data-light") as Light;
  const m = d.getAttribute("data-ambiance-mode") as AmbianceMode;
  return {
    season: SEASONS.includes(s) ? s : DEFAULT_SEASON,
    light: LIGHTS.includes(l) ? l : DEFAULT_LIGHT,
    mode: m === "auto" ? "auto" : "manuel",
  };
}

function boot() {
  if (booted || typeof document === "undefined") return;
  booted = true;
  current = readDom();
  // n'active les transitions de couleurs qu'après le premier rendu
  requestAnimationFrame(() => requestAnimationFrame(() => document.documentElement.classList.add("ambiance-ready")));
}

function emit() {
  listeners.forEach((l) => l());
}

function persist(a: Ambiance) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(a.mode === "auto" ? { mode: "auto" } : { mode: "manuel", season: a.season, light: a.light }));
  } catch {
    /* stockage indisponible : l'ambiance reste valable pour la page en cours */
  }
}

function apply(next: Ambiance) {
  const prev = current;
  if (prev.season === next.season && prev.light === next.light && prev.mode === next.mode) return;
  const d = document.documentElement;
  d.setAttribute("data-season", next.season);
  d.setAttribute("data-light", next.light);
  d.setAttribute("data-ambiance-mode", next.mode);
  const kind = prev.season !== next.season && prev.light !== next.light ? "les-deux" : prev.season !== next.season ? "saison" : "lumiere";
  if (prev.season !== next.season || prev.light !== next.light) lastChange = { from: prev, to: next, kind, at: performance.now() };
  current = next;
  persist(next);
  emit();
}

/* ── préchargement : uniquement la photographie de la prochaine transition ── */
const preloaded = new Map<string, Promise<void>>();
export const PLATE_SIZES = "(max-aspect-ratio: 1672/941) 178vh, 100vw";
const sizes = PLATE_SIZES;

export function preloadPlate(season: Season, light: Light): Promise<void> {
  if (typeof window === "undefined") return Promise.resolve();
  const src = plateSrc(season, light);
  const hit = preloaded.get(src);
  if (hit) return hit;
  const { props } = getImageProps({ src, alt: "", width: PLATE_W, height: PLATE_H, sizes, quality: 80 });
  const p = new Promise<void>((resolve) => {
    const img = new window.Image();
    img.decoding = "async";
    img.sizes = sizes;
    if (props.srcSet) img.srcset = props.srcSet;
    img.src = props.src;
    const done = () => resolve();
    img.decode ? img.decode().then(done, done) : (img.onload = img.onerror = done);
  });
  preloaded.set(src, p);
  return p;
}

const timeout = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));

/** Change l'ambiance après avoir chargé la photographie concernée (au plus ~1,2 s d'attente) */
export async function setAmbiance(patch: Partial<Pick<Ambiance, "season" | "light">>) {
  boot();
  const next: Ambiance = { season: patch.season ?? current.season, light: patch.light ?? current.light, mode: "manuel" };
  if (document.querySelector("[data-hero-stage]")) await Promise.race([preloadPlate(next.season, next.light), timeout(1200)]);
  apply(next);
}

/** Active l'ambiance automatique : calculée une fois pour la session, jamais modifiée en cours de visite */
export async function setAuto(on: boolean) {
  boot();
  if (!on) {
    apply({ ...current, mode: "manuel" });
    return;
  }
  let a: { season: Season; light: Light } | null = null;
  try {
    a = JSON.parse(sessionStorage.getItem(SESSION_KEY) || "null");
  } catch {
    a = null;
  }
  if (!a || !SEASONS.includes(a.season) || !LIGHTS.includes(a.light)) {
    a = autoAmbiance();
    try {
      sessionStorage.setItem(SESSION_KEY, JSON.stringify(a));
    } catch {
      /* ignore */
    }
  }
  if (document.querySelector("[data-hero-stage]")) await Promise.race([preloadPlate(a.season, a.light), timeout(1200)]);
  apply({ season: a.season, light: a.light, mode: "auto" });
}

function subscribe(cb: () => void) {
  boot();
  listeners.add(cb);
  return () => listeners.delete(cb);
}

export function useAmbiance(): Ambiance {
  return useSyncExternalStore(
    subscribe,
    () => current,
    () => SERVER,
  );
}

export function useAmbianceChange(): Change | null {
  return useSyncExternalStore(
    subscribe,
    () => lastChange,
    () => null,
  );
}

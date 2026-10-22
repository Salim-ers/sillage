"use client";

import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";
import { DEFAULT_LIGHT, DEFAULT_SEASON, LIGHTS, PLATE_H, PLATE_W, SEASONS, plateSrc, type Light, type Season } from "@/data/ambiances";
import { PLATE_SIZES, useAmbiance, useAmbianceChange } from "@/lib/ambiance";
import { Particles } from "./Particles";

/* Coordonnées relevées sur la photographie maîtresse (px de la source 1672 × 941) */
const QUAY = [[1010, 432], [1065, 436], [1130, 438], [1205, 440], [1290, 437], [1360, 430], [1450, 428], [1530, 430]];
const SHIP = [[288, 432], [355, 436], [430, 428]];
const WINDOWS = [[1095, 372], [1150, 395], [1238, 352], [1262, 388], [1318, 330], [1345, 372], [1402, 290], [1440, 340], [1488, 318], [1505, 372], [1040, 400], [1180, 410]];
const SUN = [533, 357];
const MOON = [573, 150];

const pct = ([x, y]: number[]) => ({ left: `${(x / PLATE_W) * 100}%`, top: `${(y / PLATE_H) * 100}%` });

/** étoiles pseudo-aléatoires déterministes (identiques serveur / client) */
function useStars(n: number) {
  return useMemo(() => {
    let seed = 42;
    const rnd = () => ((seed = (seed * 16807) % 2147483647) - 1) / 2147483646;
    const out: { x: number; y: number; r: number; d: number; t: number }[] = [];
    while (out.length < n) {
      const x = rnd() * PLATE_W;
      const y = rnd() * 300;
      if (x > 1040 && y < 290) continue; // houppier de l'olivier
      if (Math.hypot(x - MOON[0], y - MOON[1]) < 70) continue;
      if (y > 250 && x > 880) continue; // reliefs
      out.push({ x, y, r: 0.6 + rnd() * 1.3, d: rnd() * 1.4, t: 2 + rnd() * 3 });
    }
    return out;
  }, [n]);
}

type Transition = { prev: string; next: string; kind: "aube" | "crepuscule" | "doree" | "saison"; id: number; ready: boolean } | null;

function kindOf(from: { season: Season; light: Light }, to: { season: Season; light: Light }): NonNullable<Transition>["kind"] {
  if (from.season !== to.season && from.light === to.light) return "saison";
  if (to.light === "nuit") return "crepuscule";
  if (to.light === "couchant") return "doree";
  return "aube";
}

export function HeroStage() {
  const amb = useAmbiance();
  const change = useAmbianceChange();
  const [tr, setTr] = useState<Transition>(null);
  const stars = useStars(70);
  const root = useRef<HTMLDivElement>(null);

  // l'ancienne photographie reste affichée tant que la nouvelle n'est pas prête (jamais d'écran noir)
  useEffect(() => {
    if (!change) return;
    const t = { prev: `${change.from.season}-${change.from.light}`, next: `${change.to.season}-${change.to.light}`, kind: kindOf(change.from, change.to), id: change.at, ready: false };
    setTr(t);
    let end = 0;
    let cancelled = false;
    const start = () => {
      if (cancelled) return;
      setTr((c) => (c?.id === t.id ? { ...c, ready: true } : c));
      end = window.setTimeout(() => setTr((c) => (c?.id === t.id ? null : c)), 1500);
    };
    const img = root.current?.querySelector<HTMLImageElement>(`.plate[data-key="${t.next}"] img`);
    if (!img || (img.complete && img.naturalWidth > 0)) start();
    else {
      const fallback = window.setTimeout(start, 4000);
      img.addEventListener("load", () => (window.clearTimeout(fallback), start()), { once: true });
      img.addEventListener("error", () => (window.clearTimeout(fallback), start()), { once: true });
    }
    return () => {
      cancelled = true;
      window.clearTimeout(end);
    };
  }, [change]);

  return (
    <div ref={root} className="hero-stage absolute inset-0" data-hero-stage aria-hidden>
      <div className="plate-box">
        {SEASONS.flatMap((s) =>
          LIGHTS.map((l) => {
            const key = `${s}-${l}`;
            const isPrev = tr?.prev === key;
            const isNext = tr?.next === key;
            return (
              <div
                key={key}
                data-key={key}
                className={`plate${isNext ? (tr!.ready ? ` plate-in plate-in-${tr!.kind}` : " plate-in plate-attente") : ""}${isPrev && tr!.ready ? ` plate-out plate-out-${tr!.kind}` : isPrev ? " plate-out" : ""}`}
                style={isPrev ? { display: "block" } : undefined}
              >
                <Image
                  src={plateSrc(s, l)}
                  alt=""
                  fill
                  sizes={PLATE_SIZES}
                  quality={80}
                  priority={s === DEFAULT_SEASON && l === DEFAULT_LIGHT}
                  className="object-fill"
                />
              </div>
            );
          }),
        )}

        {/* soleil couchant : halo qui respire */}
        <span className="hero-sun" style={pct(SUN)} />
        {/* nuit : lune, étoiles et lanternes qui s'allument une à une */}
        <span className="hero-moon" style={pct(MOON)} />
        <svg className="hero-stars" viewBox={`0 0 ${PLATE_W} ${PLATE_H}`} preserveAspectRatio="none">
          {stars.map((s, i) => (
            <circle key={i} cx={s.x} cy={s.y} r={s.r} style={{ transitionDelay: `${0.25 + s.d}s`, animationDuration: `${s.t}s`, animationDelay: `${s.d}s` }} />
          ))}
        </svg>
        {[...SHIP, ...QUAY, ...WINDOWS].map((p, i) => (
          <span
            key={i}
            className={i < SHIP.length + QUAY.length ? "hero-lantern" : "hero-lantern hero-window"}
            style={{ ...pct(p), transitionDelay: `${0.35 + i * 0.07}s`, animationDelay: `${(i * 0.37) % 2}s` }}
          />
        ))}
      </div>
      <Particles season={amb.season} light={amb.light} burst={change && change.kind !== "lumiere" ? change.at : 0} className="absolute inset-0 h-full w-full" />
    </div>
  );
}

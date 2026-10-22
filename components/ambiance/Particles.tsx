"use client";

import { useEffect, useRef } from "react";
import type { Light, Season } from "@/data/ambiances";
import { useReducedMotion } from "@/lib/useReduced";
import { cn } from "@/lib/utils";

/* Particules d'atmosphère dessinées sur un seul canvas :
   pétales (printemps), éclats de lumière ou lucioles (été), feuilles (automne), neige (hiver).
   Quantité réduite sur mobile, arrêt hors écran, aucune particule si mouvement réduit. */

type P = { x: number; y: number; vx: number; vy: number; r: number; a: number; va: number; ph: number; hue: number; life: number };

const COLORS: Record<Season, (light: Light, i: number) => string> = {
  printemps: (l, i) => (l === "nuit" ? ["#e7b8c4", "#f3dfe6"][i % 2] : ["#f2b8c6", "#fbe3ea", "#e99aae"][i % 3]),
  ete: (l) => (l === "nuit" ? "#ffe39a" : l === "jour" ? "#fff6dc" : "#ffd28a"),
  automne: (l, i) => (l === "nuit" ? ["#9a5a34", "#7a4a2a"][i % 2] : ["#c4612a", "#d98a34", "#a8441f", "#e0a64a"][i % 4]),
  hiver: (l) => (l === "nuit" ? "#cfdcf2" : "#ffffff"),
};

function spawn(season: Season, w: number, h: number, fromTop: boolean): P {
  const r = Math.random;
  const base: P = { x: r() * w, y: fromTop ? -20 - r() * h * 0.3 : r() * h, vx: 0, vy: 0, r: 2, a: r() * Math.PI * 2, va: 0, ph: r() * 10, hue: Math.floor(r() * 12), life: 0 };
  switch (season) {
    case "hiver":
      return { ...base, r: 0.8 + r() * 2.4, vy: 22 + r() * 38, vx: -6 + r() * 12 };
    case "printemps":
      return { ...base, r: 3 + r() * 3.5, vy: 16 + r() * 22, vx: 10 + r() * 22, va: (r() - 0.5) * 2.4 };
    case "automne":
      return { ...base, r: 4 + r() * 5, vy: 26 + r() * 30, vx: 6 + r() * 26, va: (r() - 0.5) * 3 };
    case "ete":
      return { ...base, y: fromTop ? h + 20 : r() * h, r: 0.8 + r() * 1.8, vy: -(4 + r() * 10), vx: -3 + r() * 6 };
  }
}

export function Particles({
  season,
  light,
  className,
  burst = 0,
  active = true,
  density = 1,
}: {
  season: Season;
  light: Light;
  className?: string;
  /** horodatage : intensifie brièvement la chute (changement de saison) */
  burst?: number;
  active?: boolean;
  density?: number;
}) {
  const ref = useRef<HTMLCanvasElement>(null);
  const reduce = useReducedMotion();
  const state = useRef({ season, light, burstUntil: 0 });
  state.current.season = season;
  state.current.light = light;

  useEffect(() => {
    if (burst) state.current.burstUntil = performance.now() + 2600;
  }, [burst]);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas || reduce || !active) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const mobile = window.matchMedia("(max-width: 767px)").matches;
    const dpr = Math.min(window.devicePixelRatio || 1, mobile ? 1.5 : 2);
    let w = 0;
    let h = 0;
    const resize = () => {
      const r = canvas.getBoundingClientRect();
      w = r.width;
      h = r.height;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    const baseCount = () => Math.round((mobile ? 22 : 56) * density * (state.current.season === "ete" ? 0.7 : 1));
    let parts: P[] = Array.from({ length: baseCount() }, () => spawn(state.current.season, w, h, false));
    let curSeason = state.current.season;
    let visible = true;
    const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting));
    io.observe(canvas);

    let raf = 0;
    let last = performance.now();
    const tick = (now: number) => {
      raf = requestAnimationFrame(tick);
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      if (!visible || document.hidden) return;
      const { season: s, light: l, burstUntil } = state.current;
      if (s !== curSeason) {
        curSeason = s;
        // les anciennes particules finissent leur course, les nouvelles arrivent par le haut
        parts = parts.slice(0, Math.floor(parts.length / 2)).concat(Array.from({ length: baseCount() }, () => spawn(s, w, h, true)));
      }
      const bursting = now < burstUntil;
      const target = baseCount() * (bursting ? 2.4 : 1);
      while (parts.length < target) parts.push(spawn(s, w, h, true));
      ctx.clearRect(0, 0, w, h);
      const col = COLORS[s];
      for (let i = parts.length - 1; i >= 0; i--) {
        const p = parts[i];
        p.life += dt;
        const sway = Math.sin(p.ph + p.life * 1.4);
        p.x += (p.vx + sway * (s === "hiver" ? 10 : 18)) * dt;
        p.y += p.vy * dt;
        p.a += p.va * dt;
        const out = s === "ete" ? p.y < -20 : p.y > h + 20 || p.x > w + 40;
        if (out) {
          if (parts.length > target) parts.splice(i, 1);
          else parts[i] = spawn(s, w, h, true);
          continue;
        }
        ctx.save();
        ctx.translate(p.x, p.y);
        if (s === "hiver") {
          ctx.globalAlpha = 0.55 + 0.35 * Math.sin(p.ph);
          ctx.fillStyle = col(l, p.hue);
          ctx.beginPath();
          ctx.arc(0, 0, p.r, 0, Math.PI * 2);
          ctx.fill();
        } else if (s === "ete") {
          const tw = 0.4 + 0.6 * Math.abs(Math.sin(p.ph + p.life * (l === "nuit" ? 2.2 : 1.2)));
          ctx.globalAlpha = (l === "nuit" ? 0.95 : 0.55) * tw;
          ctx.fillStyle = col(l, p.hue);
          ctx.shadowColor = col(l, p.hue);
          ctx.shadowBlur = l === "nuit" ? 10 : 6;
          ctx.beginPath();
          ctx.arc(0, 0, p.r, 0, Math.PI * 2);
          ctx.fill();
        } else {
          ctx.rotate(p.a);
          ctx.scale(1, 0.55 + 0.45 * Math.abs(Math.sin(p.life * 2 + p.ph)));
          ctx.globalAlpha = s === "printemps" ? 0.85 : 0.9;
          ctx.fillStyle = col(l, p.hue);
          ctx.beginPath();
          if (s === "printemps") {
            ctx.ellipse(0, 0, p.r, p.r * 0.62, 0, 0, Math.PI * 2);
          } else {
            ctx.moveTo(-p.r, 0);
            ctx.quadraticCurveTo(0, -p.r * 0.7, p.r, 0);
            ctx.quadraticCurveTo(0, p.r * 0.7, -p.r, 0);
          }
          ctx.fill();
        }
        ctx.restore();
      }
    };
    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
    };
  }, [reduce, active, density]);

  if (reduce || !active) return null;
  return <canvas ref={ref} aria-hidden className={cn("pointer-events-none", className)} />;
}

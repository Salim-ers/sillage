"use client";

import Image from "next/image";
import { useCallback, useEffect, useId, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { X } from "lucide-react";
import { LIGHTS, SEASONS, lightInfo, plateSrc, seasonInfo, type Light, type Season } from "@/data/ambiances";
import { preloadPlate, setAmbiance, setAuto, useAmbiance } from "@/lib/ambiance";
import { useReducedMotion } from "@/lib/useReduced";
import { cn } from "@/lib/utils";

const NEEDLE: Record<Season, number> = { hiver: 0, printemps: 90, ete: 180, automne: 270 };
const DISC: Record<Light, string> = { jour: "#8ec5e6", couchant: "#e9a35a", nuit: "#1d2b4d" };

/** Boussole : l'aiguille indique la saison, le cadran la lumière */
export function Compass({ season, light, className }: { season: Season; light: Light; className?: string }) {
  const reduce = useReducedMotion();
  const [angle, setAngle] = useState(NEEDLE[season]);
  useEffect(() => {
    setAngle((a) => {
      const target = NEEDLE[season];
      const delta = ((((target - a) % 360) + 540) % 360) - 180;
      return a + delta;
    });
  }, [season]);
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden>
      <circle cx="16" cy="16" r="14.2" fill="none" stroke="currentColor" strokeOpacity=".85" strokeWidth="1" />
      {Array.from({ length: 16 }, (_, i) => {
        const a = (i * Math.PI) / 8;
        const r1 = i % 4 === 0 ? 11.4 : 12.6;
        return <line key={i} x1={16 + Math.cos(a) * r1} y1={16 + Math.sin(a) * r1} x2={16 + Math.cos(a) * 14} y2={16 + Math.sin(a) * 14} stroke="currentColor" strokeOpacity=".7" strokeWidth=".7" />;
      })}
      <circle cx="16" cy="16" r="9.6" style={{ fill: DISC[light], transition: "fill 1s ease" }} />
      <g style={{ opacity: light === "nuit" ? 1 : 0, transition: "opacity .8s" }}>
        <circle cx="12.3" cy="12.6" r=".55" fill="#f4efe0" />
        <circle cx="19.6" cy="11.4" r=".45" fill="#f4efe0" />
        <circle cx="20.4" cy="19.8" r=".4" fill="#f4efe0" />
      </g>
      <motion.g
        initial={false}
        animate={{ rotate: angle }}
        transition={reduce ? { duration: 0 } : { type: "spring", stiffness: 140, damping: 13 }}
        style={{ originX: "16px", originY: "16px", transformBox: "view-box" }}
      >
        <path d="M16 5.2 L18.1 16 L16 16 Z" fill="#d6b27a" />
        <path d="M16 5.2 L13.9 16 L16 16 Z" fill="#b48a4f" />
        <path d="M16 26.8 L18.1 16 L13.9 16 Z" fill="currentColor" fillOpacity=".55" />
        <circle cx="16" cy="16" r="1.3" fill="#f4e8d0" stroke="#7a5528" strokeWidth=".5" />
      </motion.g>
    </svg>
  );
}

const ICONS: Record<Light | Season, React.ReactNode> = {
  jour: (
    <g>
      <circle cx="12" cy="12" r="4" />
      {Array.from({ length: 8 }, (_, i) => {
        const a = (i * Math.PI) / 4;
        return <line key={i} x1={12 + Math.cos(a) * 6.5} y1={12 + Math.sin(a) * 6.5} x2={12 + Math.cos(a) * 9} y2={12 + Math.sin(a) * 9} />;
      })}
    </g>
  ),
  couchant: <path d="M3 17h18M6 17a6 6 0 0 1 12 0M12 5v3M5.6 9.6l1.8 1.8M18.4 9.6l-1.8 1.8M8 21h8" />,
  nuit: <path d="M19 14.5A7.5 7.5 0 0 1 9.5 5a7.5 7.5 0 1 0 9.5 9.5Z" />,
  printemps: (
    <g>
      {Array.from({ length: 5 }, (_, i) => (
        <ellipse key={i} cx="12" cy="7.2" rx="2.6" ry="4" transform={`rotate(${i * 72} 12 12)`} />
      ))}
      <circle cx="12" cy="12" r="1.4" />
    </g>
  ),
  ete: <path d="M2 14c2.5-2.5 5-2.5 7.5 0s5 2.5 7.5 0 3.5-1.6 5-1M2 19c2.5-2.5 5-2.5 7.5 0s5 2.5 7.5 0 3.5-1.6 5-1M16 4a3 3 0 1 1 0 6 3 3 0 0 1 0-6Z" />,
  automne: <path d="M5 19c0-8 5-14 14-14 0 9-6 14-14 14Zm0 0 9-9M9 15h4M11 13V9" />,
  hiver: (
    <g>
      {[0, 60, 120].map((r) => (
        <g key={r} transform={`rotate(${r} 12 12)`}>
          <line x1="12" y1="3" x2="12" y2="21" />
          <path d="M9.5 5.5 12 8l2.5-2.5M9.5 18.5 12 16l2.5 2.5" />
        </g>
      ))}
    </g>
  ),
};

function Icon({ k }: { k: Light | Season }) {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      {ICONS[k]}
    </svg>
  );
}

function Group<T extends string>({
  label,
  options,
  value,
  onSelect,
  thumb,
  info,
  cols,
}: {
  label: string;
  options: readonly T[];
  value: T;
  onSelect: (v: T) => void;
  thumb: (v: T) => string;
  info: Record<T, { label: string; hint: string }>;
  cols: string;
}) {
  const refs = useRef<(HTMLButtonElement | null)[]>([]);
  const id = useId();
  const onKey = (e: React.KeyboardEvent, i: number) => {
    const d = e.key === "ArrowRight" || e.key === "ArrowDown" ? 1 : e.key === "ArrowLeft" || e.key === "ArrowUp" ? -1 : 0;
    if (!d) return;
    e.preventDefault();
    const n = (i + d + options.length) % options.length;
    refs.current[n]?.focus();
    onSelect(options[n]);
  };
  return (
    <div>
      <p id={id} className="mention mb-3 text-accent">
        {label}
      </p>
      <div role="radiogroup" aria-labelledby={id} className={cn("grid gap-2", cols)}>
        {options.map((o, i) => {
          const on = o === value;
          return (
            <button
              key={o}
              ref={(el) => {
                refs.current[i] = el;
              }}
              type="button"
              role="radio"
              aria-checked={on}
              tabIndex={on ? 0 : -1}
              data-option={o}
              onClick={() => onSelect(o)}
              onKeyDown={(e) => onKey(e, i)}
              title={info[o].hint}
              className={cn(
                "group relative overflow-hidden text-left outline-offset-2 transition",
                on ? "ring-1 ring-ink" : "opacity-80 hover:opacity-100",
              )}
            >
              <span className="relative block aspect-[4/3] overflow-hidden bg-paper-3">
                <Image src={thumb(o)} alt="" fill sizes="140px" quality={70} className="object-cover transition-transform duration-700 group-hover:scale-110" style={{ objectPosition: "22% 50%" }} />
                <span className="absolute inset-0 bg-gradient-to-t from-black/55 to-transparent" />
                <span className="absolute bottom-1.5 left-2 text-[#fff9ef]">
                  <Icon k={o as Light | Season} />
                </span>
                {on && <motion.span layoutId={`coche-${id}`} className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-[#fff9ef] shadow" />}
              </span>
              <span className="mt-1.5 block text-[0.78rem] font-medium leading-tight">{info[o].label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

/** Sélecteur d'ambiance : bouton boussole de l'en-tête + panneau (popover sur ordinateur, feuille sur mobile) */
export function AmbianceSwitcher({ tone = "ink" }: { tone?: "ink" | "photo" }) {
  const amb = useAmbiance();
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const wrap = useRef<HTMLDivElement>(null);
  const btn = useRef<HTMLButtonElement>(null);
  const reduce = useReducedMotion();

  const close = useCallback(() => {
    setOpen(false);
    btn.current?.focus();
  }, []);

  useEffect(() => {
    const onOpen = () => setOpen(true);
    window.addEventListener("ambiance:ouvrir", onOpen);
    return () => window.removeEventListener("ambiance:ouvrir", onOpen);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && close();
    const onDown = (e: PointerEvent) => {
      if (wrap.current && !wrap.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onDown);
    const t = window.setTimeout(() => wrap.current?.querySelector<HTMLElement>('[role="radio"][aria-checked="true"]')?.focus(), 80);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onDown);
      window.clearTimeout(t);
    };
  }, [open, close]);

  const choose = async (patch: { season?: Season; light?: Light }) => {
    setBusy(true);
    await setAmbiance(patch);
    setBusy(false);
  };

  // précharge la photographie de la prochaine transition au survol d'une option
  const onHover = (e: React.PointerEvent | React.FocusEvent) => {
    const o = (e.target as HTMLElement).closest<HTMLElement>("[data-option]")?.dataset.option;
    if (!o || !document.querySelector("[data-hero-stage]")) return;
    if ((LIGHTS as string[]).includes(o)) preloadPlate(amb.season, o as Light);
    else preloadPlate(o as Season, amb.light);
  };

  return (
    <div ref={wrap} className="relative">
      <button
        ref={btn}
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-controls="panneau-ambiance"
        aria-label={`Ambiance : ${seasonInfo[amb.season].label}, ${lightInfo[amb.light].label}${amb.mode === "auto" ? " (automatique)" : ""}. Changer l'ambiance`}
        className={cn(
          "relative grid h-11 w-11 place-items-center rounded-full transition hover:bg-current/10",
          tone === "photo" ? "text-[#fff9ef]" : "text-ink",
        )}
      >
        <Compass season={amb.season} light={amb.light} className={cn("h-[27px] w-[27px]", busy && "animate-[spin_1.2s_linear_infinite]")} />
        {amb.mode === "auto" && <span className="absolute bottom-1.5 right-1.5 h-1.5 w-1.5 rounded-full bg-gold" aria-hidden />}
      </button>

      <AnimatePresence>
        {open && (
          <>
            <motion.div
              className="fixed inset-0 z-[60] bg-black/35 md:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
              aria-hidden
            />
            <motion.div
              id="panneau-ambiance"
              role="dialog"
              aria-label="Choisir une ambiance"
              onPointerOver={onHover}
              onFocus={onHover}
              initial={reduce ? { opacity: 0 } : { opacity: 0, y: -10, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={reduce ? { opacity: 0 } : { opacity: 0, y: -8, scale: 0.98 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              className="papier fixed inset-x-0 bottom-0 z-[61] max-h-[86svh] overflow-y-auto rounded-t-xl bg-card p-5 pb-[max(1.25rem,env(safe-area-inset-bottom))] text-ink md:absolute md:inset-x-auto md:bottom-auto md:right-0 md:top-full md:mt-2 md:w-[25rem] md:rounded-sm"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="font-serif text-[1.7rem] leading-none">Ambiance</p>
                  <p className="mt-1.5 text-xs text-ink-soft">
                    {seasonInfo[amb.season].label} · {lightInfo[amb.light].label}
                    {amb.mode === "auto" ? " · automatique" : ""}
                  </p>
                </div>
                <button type="button" onClick={close} className="-mr-2 -mt-1 grid h-10 w-10 place-items-center rounded-full hover:bg-ink/5" aria-label="Fermer le sélecteur d'ambiance">
                  <X className="h-4 w-4" strokeWidth={1.5} />
                </button>
              </div>

              <div className="mt-5 space-y-5">
                <Group
                  label="Lumière"
                  options={LIGHTS}
                  value={amb.light}
                  onSelect={(l) => choose({ light: l })}
                  thumb={(l) => plateSrc(amb.season, l)}
                  info={lightInfo}
                  cols="grid-cols-3"
                />
                <Group
                  label="Saison"
                  options={SEASONS}
                  value={amb.season}
                  onSelect={(s) => choose({ season: s })}
                  thumb={(s) => plateSrc(s, amb.light)}
                  info={seasonInfo}
                  cols="grid-cols-4"
                />
              </div>

              <div className="mt-6 flex items-start justify-between gap-4 border-t border-ink/10 pt-4">
                <div>
                  <p id="auto-label" className="text-sm font-medium">
                    Ambiance automatique
                  </p>
                  <p className="mt-0.5 text-xs leading-relaxed text-ink-soft">Selon la saison et l&apos;heure de votre visite. Fixée à l&apos;arrivée, elle ne change pas pendant la navigation.</p>
                </div>
                <button
                  type="button"
                  role="switch"
                  aria-checked={amb.mode === "auto"}
                  aria-labelledby="auto-label"
                  onClick={async () => {
                    setBusy(true);
                    await setAuto(amb.mode !== "auto");
                    setBusy(false);
                  }}
                  className={cn("relative mt-0.5 h-6 w-11 shrink-0 rounded-full transition-colors", amb.mode === "auto" ? "bg-accent" : "bg-ink/20")}
                >
                  <motion.span
                    className="absolute top-0.5 h-5 w-5 rounded-full bg-surface shadow"
                    initial={false}
                    animate={{ left: amb.mode === "auto" ? 22 : 2 }}
                    transition={{ type: "spring", stiffness: 500, damping: 32 }}
                  />
                </button>
              </div>
              <p className="mt-4 text-[0.7rem] text-ink-soft/80">Vos préférences sont conservées sur cet appareil. Le contenu et la boutique restent identiques.</p>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

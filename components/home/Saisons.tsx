"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, type PanInfo } from "motion/react";
import { seasons } from "@/data/collections";
import { productsBySeason } from "@/data/products";
import { Photo } from "@/components/ui/Photo";
import { setAmbiance, useAmbiance } from "@/lib/ambiance";
import { useReducedMotion } from "@/lib/useReduced";
import { cn } from "@/lib/utils";
import type { SeasonId } from "@/lib/types";

const EASE = [0.22, 1, 0.36, 1] as const;

/* Section 4 — Quatre saisons : paysage plein cadre, collection au premier plan.
   Suit la saison choisie dans l'en-tête ; swipe sur mobile ; peut aussi imposer sa saison à tout le site. */
export function Saisons() {
  const amb = useAmbiance();
  const reduce = useReducedMotion();
  const [active, setActive] = useState<SeasonId>(amb.season);
  const [dir, setDir] = useState(1);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  useEffect(() => {
    setActive((cur) => {
      if (cur !== amb.season) setDir(seasons.findIndex((s) => s.id === amb.season) > seasons.findIndex((s) => s.id === cur) ? 1 : -1);
      return amb.season;
    });
  }, [amb.season]);

  const idx = seasons.findIndex((s) => s.id === active);
  const s = seasons[idx];
  const items = productsBySeason(active);
  const select = (i: number) => {
    const n = (i + seasons.length) % seasons.length;
    setDir(n > idx || (idx === seasons.length - 1 && n === 0) ? 1 : -1);
    setActive(seasons[n].id);
  };
  const onPanEnd = (_: unknown, info: PanInfo) => {
    if (Math.abs(info.offset.x) > 60 && Math.abs(info.offset.x) > Math.abs(info.offset.y)) select(idx + (info.offset.x < 0 ? 1 : -1));
  };

  return (
    <section className="relative isolate overflow-hidden bg-[#140e0a] text-[#fff9ef]" aria-labelledby="saisons-titre">
      {/* paysage de la saison, en fondu enchaîné */}
      <div className="absolute inset-0 -z-10">
        <AnimatePresence initial={false} mode="sync">
          <motion.div
            key={active}
            className="absolute inset-0"
            initial={reduce ? { opacity: 0 } : { opacity: 0, scale: 1.08 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.2, ease: EASE }}
          >
            <Photo k={s.landscape} reveal={false} sizes="100vw" />
          </motion.div>
        </AnimatePresence>
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(12,8,5,.78)_0%,rgba(12,8,5,.45)_45%,rgba(12,8,5,.15)_100%)]" />
        <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/50 to-transparent" />
      </div>

      <motion.div className="shell flex min-h-[100svh] flex-col py-24 md:py-28" onPanEnd={onPanEnd} style={{ touchAction: "pan-y" }}>
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="mention text-[#f1dfbd]">Les collections saisonnières</p>
            <h2 id="saisons-titre" className="titre mt-4 max-w-[13ch] text-[#fff9ef]">
              Quatre saisons. Une infinité d&apos;émotions.
            </h2>
          </div>
        </div>

        <div className="mt-12 grid flex-1 items-center gap-10 lg:grid-cols-12" role="tabpanel" id="panneau-saisons" aria-labelledby={`onglet-${active}`}>
          <div className="lg:col-span-6">
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={active}
                initial={reduce ? { opacity: 0 } : { opacity: 0, x: 30 * dir }}
                animate={{ opacity: 1, x: 0 }}
                exit={reduce ? { opacity: 0 } : { opacity: 0, x: -24 * dir }}
                transition={{ duration: 0.6, ease: EASE }}
              >
                <p className="flex items-baseline gap-4">
                  <span className="font-serif text-[clamp(4rem,9vw,8rem)] italic leading-none" style={{ color: s.accent }}>
                    {s.numeral}
                  </span>
                  <span className="font-serif text-xl italic text-[#fff9ef]/80">{s.chapter}</span>
                </p>
                <h3 className="mt-4 font-serif text-[clamp(2.2rem,4vw,4rem)] leading-[0.98]">{items[0]?.flavor}</h3>
                <p className="mt-5 max-w-lg text-[1.05rem] leading-relaxed text-[#fff9ef]/85">{s.intro}</p>
                <ul className="mt-6 flex flex-wrap gap-2" aria-label="Ambiance">
                  {s.ambiance.map((a) => (
                    <li key={a} className="border border-white/25 px-3 py-1 text-sm text-[#fff9ef]/90 backdrop-blur-sm">
                      {a}
                    </li>
                  ))}
                </ul>
                <div className="mt-9 flex flex-wrap gap-3">
                  <Link href={`/collections#${s.id}`} className="btn btn-photo">
                    La collection {s.name.toLowerCase()}
                  </Link>
                  {amb.season !== active && (
                    <button type="button" onClick={() => setAmbiance({ season: active })} className="btn btn-photo-trait">
                      Vivre le site en {s.name.toLowerCase()}
                    </button>
                  )}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
          <div className="relative hidden lg:col-span-4 lg:col-start-9 lg:block">
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={active}
                initial={reduce ? { opacity: 0 } : { clipPath: dir > 0 ? "inset(0% 0% 0% 100%)" : "inset(0% 100% 0% 0%)" }}
                animate={reduce ? { opacity: 1 } : { clipPath: "inset(0% 0% 0% 0%)" }}
                exit={reduce ? { opacity: 0 } : { opacity: 0, y: 20 }}
                transition={{ duration: 0.9, ease: [0.65, 0, 0.35, 1] }}
                className="shadow-[0_40px_80px_-30px_rgba(0,0,0,.7)]"
              >
                <Link href={`/produits/${items[0]?.slug ?? ""}`} aria-label={items[0]?.name}>
                  <Photo k={s.collection} ratio="aspect-[4/5]" reveal={false} sizes="30vw" />
                </Link>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* sélecteur */}
        <div role="tablist" aria-label="Choisir une saison" className="mt-12 grid grid-cols-4 border-t border-white/20">
          {seasons.map((x, i) => {
            const on = x.id === active;
            return (
              <button
                key={x.id}
                ref={(el) => {
                  tabs.current[i] = el;
                }}
                role="tab"
                id={`onglet-${x.id}`}
                aria-selected={on}
                aria-controls="panneau-saisons"
                tabIndex={on ? 0 : -1}
                onClick={() => select(i)}
                onKeyDown={(e) => {
                  const d = e.key === "ArrowRight" ? 1 : e.key === "ArrowLeft" ? -1 : 0;
                  if (!d) return;
                  e.preventDefault();
                  select(i + d);
                  tabs.current[(i + d + seasons.length) % seasons.length]?.focus();
                }}
                className={cn("relative pt-4 text-left transition-opacity", on ? "opacity-100" : "opacity-55 hover:opacity-85")}
              >
                {on && <motion.span layoutId="saison-actif" className="absolute -top-px left-0 h-0.5 w-full" style={{ background: x.accent }} transition={{ duration: 0.6, ease: EASE }} />}
                <span className="block font-serif text-sm italic text-[#fff9ef]/70">{x.numeral}</span>
                <span className="block font-serif text-lg md:text-2xl">{x.name}</span>
              </button>
            );
          })}
        </div>
        <p className="mt-4 text-xs text-[#fff9ef]/55 md:hidden">Faites glisser pour changer de saison.</p>
      </motion.div>
    </section>
  );
}

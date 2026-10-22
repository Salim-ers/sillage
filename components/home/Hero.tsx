"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { HeroStage } from "@/components/ambiance/HeroStage";
import { lightInfo, seasonInfo } from "@/data/ambiances";
import { useAmbiance } from "@/lib/ambiance";
import { useReducedMotion } from "@/lib/useReduced";

/* Section 1 — hero maritime plein écran.
   L'entrée est pilotée en CSS (visible avant même le chargement de JavaScript) ;
   au défilement, la photographie gagne en profondeur, le texte s'efface,
   et la section suivante glisse par-dessus comme une vague. */
export function Hero() {
  const reduce = useReducedMotion();
  const amb = useAmbiance();
  const [vh, setVh] = useState(900);
  useEffect(() => {
    const r = () => setVh(window.innerHeight);
    r();
    window.addEventListener("resize", r);
    return () => window.removeEventListener("resize", r);
  }, []);
  const { scrollY } = useScroll();
  const scale = useTransform(scrollY, [0, vh], reduce ? [1, 1] : [1, 1.09]);
  const textOpacity = useTransform(scrollY, [0, vh * 0.55], [1, 0]);
  const textY = useTransform(scrollY, [0, vh], reduce ? [0, 0] : [0, -90]);
  const shade = useTransform(scrollY, [0, vh], [0, 0.6]);
  const hidden = useTransform(scrollY, (v) => (v > vh * 1.6 ? "hidden" : "visible"));

  return (
    <motion.section
      className="sticky top-0 z-0 h-[100svh] min-h-[560px] overflow-hidden bg-[#1e140d] text-[#fff9ef]"
      style={{ visibility: hidden }}
      aria-labelledby="hero-titre"
    >
      <motion.div className="hero-entree absolute inset-0" style={{ scale }}>
        <HeroStage />
      </motion.div>
      <div className="hero-voile absolute inset-0" aria-hidden />
      <motion.div className="absolute inset-0 bg-black" style={{ opacity: shade }} aria-hidden />

      <motion.div style={{ opacity: textOpacity, y: textY }} className="shell relative flex h-full flex-col justify-end pb-[5.5rem] pt-[calc(var(--header-h)+5.5rem)] md:pb-[9.5svh] md:pt-0">
        {/* mobile : affiche — le titre au-dessus du navire, l'invitation en dessous */}
        <div className="flex h-full flex-col justify-between md:block md:h-auto lg:grid lg:grid-cols-12 lg:items-end lg:gap-10">
          <div className="lg:col-span-7">
            <p className="hero-ligne mention text-[#f1dfbd]" style={{ animationDelay: ".25s" }}>
              Maison Sillage <span className="hidden sm:inline">— Sirops &amp; créations gourmandes</span>
            </p>
            <h1 id="hero-titre" className="mt-3 font-serif text-[clamp(2.9rem,6.6vw,7.4rem)] md:mt-5 font-medium leading-[0.9] tracking-[-0.025em] text-[#fff9ef]">
              <span className="block overflow-hidden pb-[0.08em]">
                <span className="hero-ligne block" style={{ animationDelay: ".4s" }}>
                  Des saveurs qui
                </span>
              </span>
              <span className="block overflow-hidden pb-[0.08em]">
                <span className="hero-ligne block italic" style={{ animationDelay: ".55s" }}>
                  traversent le temps.
                </span>
              </span>
            </h1>
          </div>
          <div className="md:mt-6 lg:col-span-5 lg:mt-0 lg:pb-3">
            <p className="hero-fondu max-w-[30rem] text-[0.98rem] leading-relaxed text-[#fff9ef]/90 md:text-[1.12rem]" style={{ animationDelay: ".95s" }}>
              Inspirée par les grands voyages, Maison Sillage imagine des créations gourmandes pour sublimer cafés, lattes et boissons d&apos;exception.
            </p>
            <div className="hero-fondu mt-5 flex flex-col gap-2.5 xs:flex-row md:mt-7 md:gap-3" style={{ animationDelay: "1.15s" }}>
              <Link href="/boutique" className="btn btn-photo">
                Explorer nos créations
              </Link>
              <Link href="/maison" className="btn btn-photo-trait">
                Découvrir notre histoire
              </Link>
            </div>
          </div>
        </div>
      </motion.div>

      {/* bas de scène : invitation à défiler, ambiance en cours */}
      <motion.div style={{ opacity: textOpacity }} className="absolute inset-x-0 bottom-5 md:bottom-7">
        <div className="hero-fondu shell flex items-end justify-between" style={{ animationDelay: "1.6s" }}>
          <div className="flex items-center gap-3">
            <span className="relative block h-10 w-px overflow-hidden bg-white/20" aria-hidden>
              <span className="defile absolute inset-0 bg-[#fff9ef]" />
            </span>
            <span className="mention text-[#fff9ef]/75">Défiler pour explorer</span>
          </div>
          <button
            type="button"
            onClick={() => window.dispatchEvent(new Event("ambiance:ouvrir"))}
            className="hidden text-right md:block"
            aria-label={`Ambiance en cours : ${seasonInfo[amb.season].label}, ${lightInfo[amb.light].label}. Changer d'ambiance`}
          >
            <span className="mention block text-[#fff9ef]/65">Ambiance</span>
            <span className="lien font-serif text-lg italic text-[#fff9ef]">
              {seasonInfo[amb.season].label} · {lightInfo[amb.light].label}
            </span>
          </button>
        </div>
      </motion.div>
    </motion.section>
  );
}

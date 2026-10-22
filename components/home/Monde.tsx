"use client";

import Link from "next/link";
import { useRef } from "react";
import { motion, useScroll, useSpring, useTransform } from "motion/react";
import { Photo } from "@/components/ui/Photo";
import { RevealTitle, Rise } from "@/components/animations";
import { useReducedMotion } from "@/lib/useReduced";
import type { PhotoKey } from "@/data/images";

const UNIVERS: { k: PhotoKey; title: string; text: string; href: string; cta: string; ratio: string; col: string; offset: string }[] = [
  {
    k: "quatreSirops",
    title: "Les sirops signatures",
    text: "Quatre saisons, quatre flacons : un fruit, une note pâtissière ou florale, pour parfumer un café comme une boisson glacée.",
    href: "/sirops",
    cta: "Découvrir les sirops",
    ratio: "aspect-[4/5]",
    col: "md:col-span-5",
    offset: "",
  },
  {
    k: "chocolat",
    title: "Les poudres gourmandes",
    text: "Des préparations à fouetter dans le lait, qui donnent du corps aux lattes, aux chocolats et aux frappés.",
    href: "/poudres",
    cta: "Découvrir les poudres",
    ratio: "aspect-[3/4]",
    col: "md:col-span-4 md:col-start-7",
    offset: "md:mt-40",
  },
  {
    k: "portLattePoire",
    title: "Les recettes & créations",
    text: "Latte, iced latte, mocktail, chocolat, dessert : une même saveur, plusieurs façons de la déguster.",
    href: "/recettes",
    cta: "Voir les recettes",
    ratio: "aspect-[16/10]",
    col: "md:col-span-7 md:col-start-2",
    offset: "md:mt-20",
  },
];

/* Section 2 — le monde Maison Sillage : la page remonte sur le hero comme une vague */
export function Monde() {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "start 0.25"] });
  const draw = useSpring(useTransform(scrollYProgress, [0, 1], [0, 1]), { stiffness: 70, damping: 22 });
  return (
    <section ref={ref} className="relative bg-paper pb-28 pt-16 md:pb-40 md:pt-24" aria-labelledby="monde-titre">
      {/* lisière de vague et trait de sillage, à la jonction avec le hero */}
      <svg className="pointer-events-none absolute inset-x-0 -top-[59px] h-[60px] w-full text-paper" viewBox="0 0 1440 60" preserveAspectRatio="none" aria-hidden>
        <path d="M0 60 L0 34 C180 6 360 52 560 30 S920 4 1120 28 S1340 50 1440 22 L1440 60 Z" fill="currentColor" />
        {!reduce && (
          <motion.path
            d="M0 34 C180 6 360 52 560 30 S920 4 1120 28 S1340 50 1440 22"
            fill="none"
            stroke="var(--a-gold)"
            strokeWidth="1.2"
            vectorEffect="non-scaling-stroke"
            style={{ pathLength: draw }}
          />
        )}
      </svg>

      <div className="shell">
        <div className="mx-auto max-w-4xl text-center">
          <p className="mention text-accent">Le monde Maison Sillage</p>
          <RevealTitle id="monde-titre" text="L'art de donner une nouvelle dimension aux saveurs." className="titre mx-auto mt-5 max-w-[18ch]" />
          <Rise delay={0.2}>
            <p className="chapo mx-auto mt-7 italic text-ink-soft [font-family:var(--font-serif)] md:text-[1.4rem]">
              « Chaque création est une invitation à découvrir de nouveaux accords, à réinventer une boisson et à prolonger le plaisir d&apos;un instant. »
            </p>
          </Rise>
        </div>

        <div className="mt-20 grid gap-16 md:mt-28 md:grid-cols-12 md:gap-x-8 md:gap-y-0">
          {UNIVERS.map((u, i) => (
            <article key={u.title} className={`group ${u.col} ${u.offset}`}>
              <Link href={u.href} className="block" aria-label={u.cta}>
                <Photo k={u.k} ratio={u.ratio} parallax={i === 2 ? 6 : 4} reveal={i === 1 ? "top" : "bottom"} zoom sizes="(min-width:768px) 45vw, 100vw" />
              </Link>
              <div className="mt-6 max-w-md">
                <h3 className="font-serif text-[clamp(1.8rem,2.6vw,2.6rem)] leading-[1.02]">{u.title}</h3>
                <p className="mt-3 text-ink-soft">{u.text}</p>
                <Link href={u.href} className="lien-revele mt-4 inline-block text-sm font-semibold">
                  {u.cta}
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

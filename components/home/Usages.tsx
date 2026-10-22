"use client";

import Link from "next/link";
import { useState } from "react";
import { motion } from "motion/react";
import { Photo } from "@/components/ui/Photo";
import { RevealTitle } from "@/components/animations";
import type { PhotoKey } from "@/data/images";
import { cn } from "@/lib/utils";

const USAGES: { label: string; k: PhotoKey; recipe: string; line: string; pos?: string }[] = [
  { label: "Latte", k: "latteDatte", recipe: "latte-datte-creme-brulee", line: "Datte & Crème brûlée, éclats de caramel" },
  { label: "Iced latte", k: "icedLattePoire", recipe: "iced-latte-poire-vanille", line: "Poire fondante & Vanille, sur glace" },
  { label: "Café", k: "cafeGlace", recipe: "cafe-glace-poire", line: "Un allongé glacé, une note de poire" },
  { label: "Mocktail", k: "limonadePeche", recipe: "mocktail-petillant-peche-blanche", line: "Pêche blanche pétillante, sans alcool" },
  { label: "Chocolat chaud", k: "sceneHiver", recipe: "chocolat-chaud-datte", line: "Épais, à la datte, au coin du feu", pos: "34% 60%" },
  { label: "Milkshake", k: "milkshakeFraise", recipe: "milkshake-fraise-madeleine", line: "Fraise des bois & Madeleine dorée" },
  { label: "Dessert", k: "cremeBrulee", recipe: "creme-brulee-datte", line: "Crème brûlée au sirop de datte" },
];

/* Section 6 — une saveur, mille façons : panneaux qui s'ouvrent au survol (ordinateur), défilement tactile (mobile) */
export function Usages() {
  const [open, setOpen] = useState(0);
  return (
    <section className="bg-deep py-24 text-on-deep md:py-32" aria-labelledby="usages-titre">
      <div className="shell flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="mention text-gold">Usages & recettes</p>
          <RevealTitle id="usages-titre" text="Une saveur. Mille façons de la déguster." className="titre mt-4 max-w-[15ch]" />
        </div>
        <Link href="/recettes" className="btn btn-clair self-start md:self-end">
          Toutes les recettes
        </Link>
      </div>

      {/* ordinateur : accordéon horizontal */}
      <ul className="shell mt-14 hidden h-[34rem] gap-2 lg:flex" aria-label="Usages">
        {USAGES.map((u, i) => {
          const on = open === i;
          return (
            <motion.li
              key={u.label}
              className="relative min-w-0 overflow-hidden"
              animate={{ flexGrow: on ? 5.2 : 1 }}
              initial={false}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              style={{ flexBasis: 0 }}
              onMouseEnter={() => setOpen(i)}
              onFocusCapture={() => setOpen(i)}
            >
              <Link href={`/recettes/${u.recipe}`} className="group absolute inset-0 block" aria-label={`${u.label} — ${u.line}`}>
                <Photo k={u.k} reveal={false} pos={u.pos} sizes="(min-width:1024px) 45vw, 10vw" />
                <span className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-black/10" />
                <span className={cn("absolute bottom-6 left-6 right-6 transition-opacity duration-500", on ? "opacity-100" : "opacity-0")}>
                  <span className="mention block text-[#f1dfbd]">Recette</span>
                  <span className="mt-2 block font-serif text-4xl leading-none text-[#fff9ef]">{u.label}</span>
                  <span className="mt-2 block text-sm text-[#fff9ef]/80">{u.line}</span>
                </span>
                <span
                  className={cn(
                    "absolute bottom-6 left-1/2 origin-left -rotate-90 whitespace-nowrap font-serif text-xl text-[#fff9ef] transition-opacity duration-300",
                    on ? "opacity-0" : "opacity-100",
                  )}
                >
                  {u.label}
                </span>
              </Link>
            </motion.li>
          );
        })}
      </ul>

      {/* tablette & mobile : défilement horizontal */}
      <ul className="no-scrollbar mt-12 flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-px-[var(--gutter)] px-[var(--gutter)] lg:hidden" aria-label="Usages">
        {USAGES.map((u) => (
          <li key={u.label} className="w-[68vw] shrink-0 snap-start sm:w-[42vw]">
            <Link href={`/recettes/${u.recipe}`} className="block">
              <Photo k={u.k} ratio="aspect-[3/4]" reveal={false} pos={u.pos} sizes="70vw" />
              <span className="mt-3 block font-serif text-2xl">{u.label}</span>
              <span className="block text-sm text-on-deep/70">{u.line}</span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}

"use client";

import { useReducedMotion } from "@/lib/useReduced";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { recipes } from "@/data/recipes";
import { recipeCategoryLabels } from "@/data/collections";
import { getProduct } from "@/data/products";
import { Photo } from "@/components/ui/Photo";
import type { RecipeCategory } from "@/lib/types";
import { cn } from "@/lib/utils";

export function RecipeIndex({ initial }: { initial?: RecipeCategory }) {
  const [cat, setCat] = useState<RecipeCategory | "toutes">(initial ?? "toutes");
  const reduce = useReducedMotion();
  useEffect(() => {
    window.history.replaceState(null, "", cat === "toutes" ? window.location.pathname : `?usage=${cat}`);
  }, [cat]);
  const list = useMemo(() => (cat === "toutes" ? recipes : recipes.filter((r) => r.category === cat)), [cat]);
  const cats = Object.entries(recipeCategoryLabels) as [RecipeCategory, string][];

  return (
    <div className="shell pb-28">
      <div role="group" aria-label="Filtrer par type de boisson" className="flex flex-wrap gap-2 border-y border-ink-soft/10 py-4">
        {[["toutes", "Toutes"] as const, ...cats].map(([id, label]) => {
          const n = id === "toutes" ? recipes.length : recipes.filter((r) => r.category === id).length;
          return (
            <button
              key={id}
              type="button"
              aria-pressed={cat === id}
              onClick={() => setCat(id)}
              className={cn("min-h-10 border px-3.5 py-2 text-sm transition", cat === id ? "border-ink-soft bg-deep-2 text-on-deep" : "border-ink-soft/25 hover:border-ink-soft/70")}
            >
              {label} <span className="opacity-60">({n})</span>
            </button>
          );
        })}
      </div>
      <p className="mt-6 text-sm text-ink-soft/70" aria-live="polite">
        {list.length} recette{list.length > 1 ? "s" : ""} · dosages proposés à titre de démonstration
      </p>
      <motion.ul layout={!reduce} className="mt-8 grid gap-x-6 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
        <AnimatePresence mode="popLayout" initial={false}>
          {list.map((r) => {
            const p = getProduct(r.products[0]);
            return (
              <motion.li
                key={r.slug}
                layout={!reduce}
                initial={reduce ? false : { opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.96, transition: { duration: 0.25 } }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              >
                <Link href={`/recettes/${r.slug}`} className="group block">
                  <Photo k={r.image} ratio="aspect-[4/5]" reveal={false} zoom sizes="(min-width:1024px) 30vw, (min-width:640px) 45vw, 92vw" />
                  <p className="mt-4 text-[0.7rem] uppercase tracking-[0.16em] text-accent">
                    {recipeCategoryLabels[r.category]} · {r.temps}
                  </p>
                  <h2 className="mt-1 font-serif text-[1.7rem] leading-tight group-hover:text-ink-soft">{r.title}</h2>
                  {p && <p className="mt-1 text-sm text-ink-soft/75">Avec {p.name}</p>}
                </Link>
              </motion.li>
            );
          })}
        </AnimatePresence>
      </motion.ul>
    </div>
  );
}

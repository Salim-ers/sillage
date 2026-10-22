"use client";

import Image from "next/image";
import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { photos, type PhotoKey } from "@/data/images";
import { useReducedMotion } from "@/lib/useReduced";
import { cn } from "@/lib/utils";
import { MissingVisual } from "./ProductCard";

/** Galerie produit : photographies distinctes, vignettes accessibles, transition par masque */
export function Gallery({ views, name }: { views: { photo: PhotoKey; label: string; pos?: string }[]; name: string }) {
  const [i, setI] = useState(0);
  const reduce = useReducedMotion();
  if (!views.length)
    return (
      <div className="aspect-[4/5]">
        <MissingVisual label="Visuel en préparation — création à l'étude" />
      </div>
    );
  const v = views[i];
  const ph = photos[v.photo];
  return (
    <div>
      <div className="relative aspect-[4/5] overflow-hidden bg-paper-3" aria-live="polite">
        <AnimatePresence initial={false} mode="sync">
          <motion.div
            key={i}
            className="absolute inset-0"
            initial={reduce ? { opacity: 0 } : { clipPath: "inset(0% 0% 0% 100%)" }}
            animate={reduce ? { opacity: 1 } : { clipPath: "inset(0% 0% 0% 0%)" }}
            exit={{ opacity: 1 }}
            transition={{ duration: 0.9, ease: [0.65, 0, 0.35, 1] }}
          >
            <Image
              src={ph.src}
              alt={`${name} — ${v.label.toLowerCase()} : ${ph.alt}`}
              fill
              sizes="(min-width:1024px) 55vw, 100vw"
              priority={i === 0}
              quality={80}
              className="object-cover"
              style={{ objectPosition: v.pos ?? ph.pos ?? "50% 45%" }}
            />
            <span className="grade" aria-hidden />
          </motion.div>
        </AnimatePresence>
        <p className="absolute bottom-3 left-3 bg-surface/90 px-2.5 py-1 text-[0.7rem] uppercase tracking-[0.16em] text-ink">
          {v.label} · mise en scène de démonstration
        </p>
      </div>
      <div className="mt-3 grid grid-cols-4 gap-3" role="group" aria-label={`Vues de ${name}`}>
        {views.map((view, n) => {
          const t = photos[view.photo];
          return (
            <button
              key={view.photo}
              type="button"
              onClick={() => setI(n)}
              aria-pressed={n === i}
              aria-label={`Voir : ${view.label}`}
              className={cn("relative aspect-square overflow-hidden bg-paper-3 outline-offset-2 transition", n === i ? "ring-1 ring-ink" : "opacity-65 hover:opacity-100")}
            >
              <Image src={t.src} alt="" fill sizes="140px" quality={70} className="object-cover" style={{ objectPosition: view.pos ?? t.pos ?? "50% 45%" }} />
            </button>
          );
        })}
      </div>
    </div>
  );
}

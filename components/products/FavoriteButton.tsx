"use client";

import { useReducedMotion } from "@/lib/useReduced";
import { motion } from "motion/react";
import { Heart } from "lucide-react";
import { useStore } from "@/lib/store";
import { cn } from "@/lib/utils";

export function FavoriteButton({ slug, name, className, withLabel = false }: { slug: string; name: string; className?: string; withLabel?: boolean }) {
  const { isFavorite, toggleFavorite, ready } = useStore();
  const on = ready && isFavorite(slug);
  const reduce = useReducedMotion();
  return (
    <button
      type="button"
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        toggleFavorite(slug);
      }}
      aria-pressed={on}
      aria-label={on ? `Retirer ${name} des favoris` : `Ajouter ${name} aux favoris`}
      className={cn("inline-flex items-center gap-2 transition", withLabel ? "text-sm" : "grid h-10 w-10 place-items-center rounded-full bg-surface/80 hover:bg-surface", className)}
    >
      <motion.span key={String(on)} initial={reduce ? false : { scale: on ? 0.6 : 1 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 420, damping: 18 }}>
        <Heart className={cn("h-[18px] w-[18px]", on ? "fill-ink-soft text-ink-soft" : "text-ink-soft")} strokeWidth={1.4} />
      </motion.span>
      {withLabel && <span className="underline-offset-4 hover:underline">{on ? "Dans vos favoris" : "Ajouter aux favoris"}</span>}
    </button>
  );
}

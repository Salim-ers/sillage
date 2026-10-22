"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Check } from "lucide-react";
import { useStore } from "@/lib/store";
import { cn } from "@/lib/utils";

/** Bouton d'ajout avec retour visuel : le libellé glisse vers « Ajouté ». */
export function AddToCart({
  slug,
  formatId,
  qty = 1,
  className,
  label = "Ajouter au panier",
  variant = "encre",
  disabled = false,
}: {
  slug: string;
  formatId: string;
  qty?: number;
  className?: string;
  label?: string;
  variant?: "encre" | "trait" | "clair";
  disabled?: boolean;
}) {
  const { add } = useStore();
  const [done, setDone] = useState(0);
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        add(slug, formatId, qty);
        setDone(Date.now());
        window.setTimeout(() => setDone(0), 1800);
      }}
      className={cn("btn", `btn-${variant}`, className)}
    >
      <span className="relative block h-[1.2em] overflow-hidden">
        <AnimatePresence mode="popLayout" initial={false}>
          {done ? (
            <motion.span key="ok" className="flex items-center gap-2" initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "-100%" }} transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}>
              <Check className="h-3.5 w-3.5" strokeWidth={2} /> Ajouté
            </motion.span>
          ) : (
            <motion.span key="add" className="block" initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "-100%" }} transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}>
              {label}
            </motion.span>
          )}
        </AnimatePresence>
      </span>
    </button>
  );
}

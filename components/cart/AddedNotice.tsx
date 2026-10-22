"use client";

import { useReducedMotion } from "@/lib/useReduced";
import { useEffect } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Check, X } from "lucide-react";
import { useStore } from "@/lib/store";
import { getProduct } from "@/data/products";
import { ProductArt } from "@/components/products/ProductArt";
import { EASE } from "@/components/animations";

/** Confirmation instantanée sous l'icône panier */
export function AddedNotice() {
  const { lastAdded, dismissAdded, setDrawerOpen, drawerOpen } = useStore();
  const reduce = useReducedMotion();

  useEffect(() => {
    if (!lastAdded) return;
    const t = window.setTimeout(dismissAdded, 4200);
    return () => window.clearTimeout(t);
  }, [lastAdded, dismissAdded]);

  const product = lastAdded ? getProduct(lastAdded.slug) : null;
  const format = product?.formats.find((f) => f.id === lastAdded?.formatId);
  const visible = !!product && !!format && !drawerOpen;

  return (
    <div aria-live="polite" className="absolute right-0 top-full z-50 pt-2">
      <AnimatePresence>
        {visible && (
          <motion.div
            key={lastAdded!.at}
            initial={reduce ? { opacity: 0 } : { opacity: 0, y: -10, clipPath: "inset(0% 0% 100% 0%)" }}
            animate={{ opacity: 1, y: 0, clipPath: "inset(0% 0% 0% 0%)" }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.55, ease: EASE }}
            className="papier w-[min(21rem,calc(100vw-2rem))] p-4"
            role="status"
          >
            <div className="flex items-start gap-3.5">
              <div className="h-20 w-16 shrink-0 overflow-hidden">
                <ProductArt product={product!} />
              </div>
              <div className="min-w-0 flex-1">
                <p className="mention flex items-center gap-1.5 text-accent">
                  <Check className="h-3.5 w-3.5" strokeWidth={2} /> Ajouté au panier
                </p>
                <p className="mt-1.5 font-serif text-lg leading-tight">{product!.name}</p>
                <p className="text-xs text-ink-soft/75">
                  {format!.contenance} · quantité {lastAdded!.qty}
                </p>
              </div>
              <button type="button" onClick={dismissAdded} className="-mr-1 -mt-1 grid h-8 w-8 place-items-center" aria-label="Fermer la confirmation">
                <X className="h-4 w-4" strokeWidth={1.4} />
              </button>
            </div>
            <button
              type="button"
              onClick={() => {
                dismissAdded();
                setDrawerOpen(true);
              }}
              className="btn btn-encre mt-4 w-full min-h-11"
            >
              Voir le panier
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

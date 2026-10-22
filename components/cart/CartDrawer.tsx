"use client";

import { useReducedMotion } from "@/lib/useReduced";
import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import { X } from "lucide-react";
import { useStore } from "@/lib/store";
import { useDialog } from "@/lib/useDialog";
import { CartLines, CartTotals, DemoNotice } from "./CartLines";
import { WakeStroke } from "@/components/animations";

export function CartDrawer() {
  const { drawerOpen, setDrawerOpen, lines, count } = useStore();
  const close = () => setDrawerOpen(false);
  const ref = useDialog<HTMLDivElement>(drawerOpen, close);
  const reduce = useReducedMotion();

  return (
    <AnimatePresence>
      {drawerOpen && (
        <div className="fixed inset-0 z-[70]">
          <motion.div
            className="absolute inset-0 bg-deep/40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            onClick={close}
            aria-hidden
          />
          <motion.aside
            ref={ref}
            role="dialog"
            aria-modal="true"
            aria-label="Panier"
            className="absolute inset-y-0 right-0 flex w-full max-w-[29rem] flex-col bg-paper shadow-2xl"
            initial={reduce ? { opacity: 0 } : { x: "100%" }}
            animate={reduce ? { opacity: 1 } : { x: 0 }}
            exit={reduce ? { opacity: 0 } : { x: "100%" }}
            transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="flex items-center justify-between border-b border-ink-soft/10 px-6 py-5">
              <h2 className="font-serif text-3xl">
                Panier <span className="text-base text-ink-soft/60">({count})</span>
              </h2>
              <button type="button" onClick={close} className="-mr-2 grid h-11 w-11 place-items-center rounded-full hover:bg-deep-2/5" aria-label="Fermer le panier" data-autofocus>
                <X className="h-5 w-5" strokeWidth={1.4} />
              </button>
            </div>
            {lines.length === 0 ? (
              <div className="flex flex-1 flex-col items-center justify-center px-8 text-center">
                <WakeStroke className="w-40 text-accent" />
                <p className="mt-6 font-serif text-3xl">Votre panier attend sa première escale.</p>
                <p className="mt-3 max-w-xs text-sm text-ink-soft/80">Ajoutez une création depuis la boutique pour essayer le parcours de démonstration.</p>
                <Link href="/boutique" onClick={close} className="btn btn-encre mt-8">
                  Parcourir la boutique
                </Link>
              </div>
            ) : (
              <>
                <div className="flex-1 overflow-y-auto px-6">
                  <CartLines onNavigate={close} />
                </div>
                <div className="space-y-4 border-t border-ink-soft/10 px-6 py-5">
                  <CartTotals />
                  <DemoNotice />
                  <div className="grid gap-3 sm:grid-cols-2">
                    <Link href="/panier" onClick={close} className="btn btn-trait">
                      Voir le panier
                    </Link>
                    <Link href="/commande" onClick={close} className="btn btn-encre">
                      Simuler la commande
                    </Link>
                  </div>
                </div>
              </>
            )}
          </motion.aside>
        </div>
      )}
    </AnimatePresence>
  );
}

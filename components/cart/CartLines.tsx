"use client";

import { useReducedMotion } from "@/lib/useReduced";
import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import { useStore } from "@/lib/store";
import { formatPrice } from "@/lib/utils";
import { ProductArt } from "@/components/products/ProductArt";
import { QtyStepper } from "@/components/ui/QtyStepper";
import { EASE } from "@/components/animations";

export function CartLines({ onNavigate, large = false }: { onNavigate?: () => void; large?: boolean }) {
  const { lines, setQty, remove } = useStore();
  const reduce = useReducedMotion();
  return (
    <ul className="divide-y divide-ink-soft/10">
      <AnimatePresence initial={false}>
        {lines.map((l) => (
          <motion.li
            key={`${l.slug}-${l.formatId}`}
            layout={!reduce}
            initial={reduce ? false : { opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -24, transition: { duration: 0.3 } }}
            transition={{ duration: 0.5, ease: EASE }}
            className="flex gap-4 py-5"
          >
            <Link href={`/produits/${l.slug}`} onClick={onNavigate} className={`block shrink-0 overflow-hidden ${large ? "h-32 w-24" : "h-24 w-[4.5rem]"}`}>
              <ProductArt product={l.product} className="h-full w-full" />
            </Link>
            <div className="flex min-w-0 flex-1 flex-col">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <Link href={`/produits/${l.slug}`} onClick={onNavigate} className={`font-serif leading-tight hover:underline ${large ? "text-2xl" : "text-lg"}`}>
                    {l.product.name}
                  </Link>
                  <p className="mt-0.5 text-[0.8rem] text-ink-soft/75">
                    {l.format.label} · {formatPrice(l.format.price)} {l.format.tax}
                  </p>
                </div>
                <p className="shrink-0 font-serif text-lg tabular-nums">{formatPrice(l.total)}</p>
              </div>
              <div className="mt-auto flex items-center justify-between pt-3">
                <QtyStepper size="sm" value={l.qty} onChange={(n) => setQty(l.slug, l.formatId, n)} label={`Quantité de ${l.product.name}`} />
                <button type="button" onClick={() => remove(l.slug, l.formatId)} className="text-[0.8rem] text-ink-soft/75 underline-offset-4 hover:text-ink hover:underline">
                  Retirer
                </button>
              </div>
            </div>
          </motion.li>
        ))}
      </AnimatePresence>
    </ul>
  );
}

export function CartTotals() {
  const { totals } = useStore();
  return (
    <dl className="space-y-2 text-sm">
      {totals.TTC > 0 && (
        <div className="flex items-baseline justify-between">
          <dt>Sous-total particuliers</dt>
          <dd className="font-serif text-xl tabular-nums">{formatPrice(totals.TTC)} TTC</dd>
        </div>
      )}
      {totals.HT > 0 && (
        <div className="flex items-baseline justify-between">
          <dt>Sous-total formats professionnels</dt>
          <dd className="font-serif text-xl tabular-nums">{formatPrice(totals.HT)} HT</dd>
        </div>
      )}
      <div className="flex items-baseline justify-between text-ink-soft/75">
        <dt>Livraison</dt>
        <dd>Conditions non définies</dd>
      </div>
    </dl>
  );
}

export function DemoNotice({ className = "" }: { className?: string }) {
  return (
    <p className={`border-l-2 border-accent bg-paper-2/60 px-4 py-3 text-[0.82rem] leading-relaxed text-ink-soft ${className}`}>
      <strong className="font-semibold">Démonstration — aucune commande réelle.</strong> Les prix sont indicatifs, aucun paiement n&apos;est demandé et rien n&apos;est transmis.
    </p>
  );
}

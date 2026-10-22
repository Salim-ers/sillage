"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import type { Product } from "@/lib/types";
import { formatPrice, cn } from "@/lib/utils";
import { QtyStepper } from "@/components/ui/QtyStepper";
import { AddToCart } from "./AddToCart";
import { FavoriteButton } from "./FavoriteButton";
import { NewsletterForm } from "@/components/ui/NewsletterForm";

/** Choix du format, quantité, ajout au panier — et barre d'achat collante sur mobile */
export function ProductBuyBox({ product }: { product: Product }) {
  const [formatId, setFormatId] = useState(product.formats[0].id);
  const [qty, setQty] = useState(1);
  const [showBar, setShowBar] = useState(false);
  const anchor = useRef<HTMLDivElement>(null);
  const format = product.formats.find((f) => f.id === formatId)!;
  const upcoming = product.status === "a-venir";

  useEffect(() => {
    const el = anchor.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setShowBar(!e.isIntersecting && e.boundingClientRect.top < 0), { threshold: 0 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  if (upcoming) {
    return (
      <div className="mt-10 space-y-6">
        <p className="border border-ink-soft/25 px-5 py-4 text-sm">
          <strong className="font-semibold">Édition à venir — création à l&apos;étude.</strong> Cette saveur n&apos;est ni disponible ni réservable.
        </p>
        <div>
          <p className="font-serif text-xl">Être informé si elle rejoint la collection</p>
          <div className="mt-4">
            <NewsletterForm id="alerte-edition" />
          </div>
        </div>
        <FavoriteButton slug={product.slug} name={product.name} withLabel />
      </div>
    );
  }

  return (
    <div className="mt-10">
      <fieldset>
        <legend className="mention mb-3 text-accent">Format</legend>
        <div className="grid gap-2.5 sm:grid-cols-2">
          {product.formats.map((f) => {
            const on = f.id === formatId;
            return (
              <label
                key={f.id}
                className={cn(
                  "relative flex cursor-pointer flex-col border px-4 py-3.5 transition duration-300",
                  on ? "border-ink-soft bg-surface" : "border-ink-soft/20 hover:border-ink-soft/60",
                )}
              >
                <input type="radio" name="format" value={f.id} checked={on} onChange={() => setFormatId(f.id)} className="sr-only" />
                <span className="font-serif text-lg leading-tight">{f.label}</span>
                <span className="mt-1 text-sm text-ink-soft/75">
                  {formatPrice(f.price)} {f.tax} · {f.public === "professionnel" ? "Professionnels" : "Particuliers"}
                </span>
                {on && <motion.span layoutId={`format-${product.slug}`} className="absolute inset-y-0 left-0 w-[3px] bg-deep-2" />}
              </label>
            );
          })}
        </div>
      </fieldset>

      <div className="mt-7 flex items-baseline gap-3">
        <AnimatePresence mode="wait" initial={false}>
          <motion.p key={formatId} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.3 }} className="font-serif text-4xl tabular-nums">
            {formatPrice(format.price * qty)}
          </motion.p>
        </AnimatePresence>
        <p className="text-sm text-ink-soft/70">
          {format.tax} · prix indicatif{qty > 1 ? ` · ${qty} × ${formatPrice(format.price)}` : ""}
        </p>
      </div>

      <div ref={anchor} className="mt-6 flex flex-wrap gap-3">
        <QtyStepper value={qty} onChange={setQty} label={`Quantité de ${product.name}`} />
        <AddToCart slug={product.slug} formatId={formatId} qty={qty} className="flex-1" />
      </div>
      <div className="mt-5 flex flex-wrap items-center justify-between gap-4">
        <FavoriteButton slug={product.slug} name={product.name} withLabel />
        <p className="text-xs text-ink-soft/70">Panier de démonstration : aucune commande n&apos;est transmise.</p>
      </div>

      {/* barre d'achat mobile */}
      <AnimatePresence>
        {showBar && (
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-x-0 bottom-0 z-40 border-t border-ink-soft/15 bg-paper/95 px-4 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-3 backdrop-blur lg:hidden"
          >
            <div className="flex items-center gap-3">
              <div className="min-w-0 flex-1">
                <p className="truncate font-serif text-lg leading-tight">{product.name}</p>
                <p className="text-xs text-ink-soft/70">
                  {format.contenance} · {formatPrice(format.price)} {format.tax}
                </p>
              </div>
              <AddToCart slug={product.slug} formatId={formatId} qty={qty} label="Ajouter" className="min-h-12 px-5" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

"use client";

import { useReducedMotion } from "@/lib/useReduced";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Search, X } from "lucide-react";
import { useStore } from "@/lib/store";
import { useDialog } from "@/lib/useDialog";
import { searchAll } from "@/lib/search";
import { ProductArt } from "@/components/products/ProductArt";
import { categoryLabels } from "@/data/collections";

const SUGGESTIONS = ["Vanille", "Fleur d'oranger", "Latte glacé", "Chocolat", "Pistache", "Mocktail"];

export function SearchOverlay() {
  const { searchOpen, setSearchOpen } = useStore();
  const [q, setQ] = useState("");
  const close = () => setSearchOpen(false);
  const ref = useDialog<HTMLDivElement>(searchOpen, close);
  const router = useRouter();
  const reduce = useReducedMotion();
  const res = useMemo(() => searchAll(q), [q]);
  const total = res.products.length + res.recipes.length + res.articles.length;

  return (
    <AnimatePresence>
      {searchOpen && (
        <motion.div
          ref={ref}
          role="dialog"
          aria-modal="true"
          aria-label="Recherche"
          className="fixed inset-0 z-[75] overflow-y-auto bg-paper/[0.98]"
          initial={reduce ? { opacity: 0 } : { opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="shell max-w-4xl py-6 sm:py-10">
            <div className="flex justify-end">
              <button type="button" onClick={close} className="grid h-11 w-11 place-items-center rounded-full hover:bg-deep-2/5" aria-label="Fermer la recherche">
                <X className="h-5 w-5" strokeWidth={1.4} />
              </button>
            </div>
            <form
              role="search"
              onSubmit={(e) => {
                e.preventDefault();
                close();
                router.push(`/boutique?q=${encodeURIComponent(q)}`);
              }}
              className="mt-4 flex items-center gap-4 border-b border-ink-soft/40 pb-3"
            >
              <Search className="h-6 w-6 shrink-0 text-accent" strokeWidth={1.3} />
              <label htmlFor="recherche" className="sr-only">
                Rechercher une saveur, une recette, un article
              </label>
              <input
                id="recherche"
                data-autofocus
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Une saveur, une envie, une recette…"
                className="w-full bg-transparent font-serif text-3xl outline-none placeholder:text-ink-soft/40 sm:text-5xl"
                autoComplete="off"
              />
            </form>

            {!q && (
              <div className="mt-8">
                <p className="mention text-accent">Pistes de recherche</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {SUGGESTIONS.map((s) => (
                    <button key={s} type="button" onClick={() => setQ(s)} className="border border-ink-soft/20 px-4 py-2 text-sm transition hover:border-ink-soft hover:bg-surface">
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {q && (
              <div className="mt-8 space-y-10" aria-live="polite">
                <p className="text-sm text-ink-soft/75">{total === 0 ? "Aucun résultat. Essayez un fruit, une épice ou un type de boisson." : `${total} résultat${total > 1 ? "s" : ""}`}</p>
                {res.products.length > 0 && (
                  <section>
                    <h3 className="mention text-accent">Créations</h3>
                    <ul className="mt-4 grid gap-3 sm:grid-cols-2">
                      {res.products.map((p) => (
                        <li key={p.slug}>
                          <Link href={`/produits/${p.slug}`} onClick={close} className="flex items-center gap-4 bg-surface/70 p-3 transition hover:bg-surface">
                            <span className="block h-20 w-16 shrink-0 overflow-hidden">
                              <ProductArt product={p} />
                            </span>
                            <span>
                              <span className="block font-serif text-xl leading-tight">{p.name}</span>
                              <span className="text-xs text-ink-soft/70">{p.status === "a-venir" ? "Édition à venir" : categoryLabels[p.category]}</span>
                            </span>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </section>
                )}
                {res.recipes.length > 0 && (
                  <section>
                    <h3 className="mention text-accent">Recettes</h3>
                    <ul className="mt-3 divide-y divide-ink-soft/10">
                      {res.recipes.map((r) => (
                        <li key={r.slug}>
                          <Link href={`/recettes/${r.slug}`} onClick={close} className="flex items-baseline justify-between py-3 font-serif text-xl hover:text-ink-soft">
                            {r.title}
                            <span className="font-sans text-xs text-ink-soft/60">{r.temps}</span>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </section>
                )}
                {res.articles.length > 0 && (
                  <section>
                    <h3 className="mention text-accent">Journal</h3>
                    <ul className="mt-3 divide-y divide-ink-soft/10">
                      {res.articles.map((a) => (
                        <li key={a.slug}>
                          <Link href={`/journal/${a.slug}`} onClick={close} className="block py-3 font-serif text-xl hover:text-ink-soft">
                            {a.title}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </section>
                )}
              </div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

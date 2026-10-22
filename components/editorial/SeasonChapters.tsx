"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { seasons } from "@/data/collections";
import { productsBySeason } from "@/data/products";
import { recipes } from "@/data/recipes";
import { Photo } from "@/components/ui/Photo";
import { ProductMini } from "@/components/products/ProductMini";
import { RevealTitle, Rise } from "@/components/animations";
import { setAmbiance, useAmbiance } from "@/lib/ambiance";
import { cn } from "@/lib/utils";
import type { SeasonId } from "@/lib/types";

/* Les quatre chapitres : chacun s'ouvre sur son paysage plein cadre, puis présente sa collection */
export function SeasonChapters() {
  const [current, setCurrent] = useState<SeasonId>("printemps");
  const amb = useAmbiance();

  useEffect(() => {
    const els = seasons.map((s) => document.getElementById(s.id)).filter(Boolean) as HTMLElement[];
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setCurrent(e.target.id as SeasonId)),
      { rootMargin: "-45% 0px -50% 0px" },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  return (
    <div className="relative">
      <nav aria-label="Chapitres" className="sticky top-[var(--header-h)] z-20 border-b border-ink/10 bg-paper/92 backdrop-blur-md">
        <ul className="shell no-scrollbar flex gap-1 overflow-x-auto py-2">
          {seasons.map((s) => (
            <li key={s.id}>
              <a
                href={`#${s.id}`}
                aria-current={current === s.id ? "true" : undefined}
                className={cn("flex items-baseline gap-2 whitespace-nowrap px-3 py-2 transition-opacity", current === s.id ? "opacity-100" : "opacity-55 hover:opacity-90")}
              >
                <span className="font-serif text-sm italic" style={{ color: s.accent }}>
                  {s.numeral}
                </span>
                <span className="font-serif text-lg">{s.name}</span>
              </a>
            </li>
          ))}
        </ul>
      </nav>

      {seasons.map((s, idx) => {
        const items = productsBySeason(s.id);
        const recs = recipes.filter((r) => r.products.some((slug) => items.some((p) => p.slug === slug)));
        const flip = idx % 2 === 1;
        return (
          <section key={s.id} id={s.id} className="scroll-mt-32" aria-labelledby={`titre-${s.id}`}>
            {/* ouverture de chapitre : le paysage */}
            <div className="relative isolate flex min-h-[86svh] items-end overflow-hidden bg-[#140e0a] text-[#fff9ef]">
              <div className="absolute inset-0 -z-10">
                <Photo k={s.landscape} reveal={false} parallax={7} sizes="100vw" priority={idx === 0} />
                <div className="absolute inset-0 bg-[linear-gradient(0deg,rgba(12,8,5,.8)_0%,rgba(12,8,5,.25)_50%,rgba(12,8,5,.1)_100%)]" />
              </div>
              <div className={cn("shell pb-14 md:pb-20", flip && "md:text-right")}>
                <p className="font-serif text-[clamp(4.5rem,11vw,10rem)] italic leading-none" style={{ color: s.accent }} aria-hidden>
                  {s.numeral}
                </p>
                <p className="mention mt-2 text-[#f1dfbd]">
                  Chapitre {s.numeral} · {s.name}
                </p>
                <RevealTitle id={`titre-${s.id}`} text={s.chapter} className={cn("titre mt-3 max-w-[16ch] text-[#fff9ef]", flip && "md:ml-auto")} />
              </div>
            </div>

            {/* la collection */}
            <div className="py-20 md:py-28" style={{ background: `color-mix(in oklab, var(--a-paper) 92%, ${s.accent})` }}>
              <div className="shell grid gap-12 lg:grid-cols-12">
                <div className={cn("lg:col-span-5", flip && "lg:order-2 lg:col-start-8")}>
                  <Photo k={s.collection} ratio="aspect-[4/5]" reveal={flip ? "right" : "left"} sizes="(min-width:1024px) 40vw, 100vw" />
                </div>
                <div className={cn("lg:col-span-6", flip ? "lg:order-1" : "lg:col-start-7")}>
                  <Rise>
                    <p className="text-[1.08rem] leading-relaxed text-ink-soft">{s.intro}</p>
                  </Rise>
                  <Rise delay={0.1}>
                    <blockquote className="mt-8 border-l-2 pl-5 font-serif text-2xl italic leading-snug" style={{ borderColor: s.accent }}>
                      « {s.carnet} »
                    </blockquote>
                  </Rise>
                  <h3 className="mention mt-12 text-accent">Les créations du chapitre</h3>
                  <div className="mt-4 grid gap-3">
                    {items.map((p) => (
                      <ProductMini key={p.slug} product={p} />
                    ))}
                  </div>
                  {recs.length > 0 && (
                    <>
                      <h3 className="mention mt-10 text-accent">Recettes recommandées</h3>
                      <ul className="mt-3 divide-y divide-ink/12 border-y border-ink/12">
                        {recs.map((r) => (
                          <li key={r.slug}>
                            <Link href={`/recettes/${r.slug}`} className="flex items-baseline justify-between gap-4 py-3.5 font-serif text-xl transition-colors hover:text-accent">
                              {r.title}
                              <span className="font-sans text-xs text-ink-soft">{r.temps}</span>
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </>
                  )}
                  <div className="mt-10 grid grid-cols-2 gap-4">
                    {s.details.map((d, i) => (
                      <Photo key={d} k={d} ratio="aspect-square" reveal="bottom" parallax={i ? 4 : 0} sizes="(min-width:1024px) 22vw, 45vw" />
                    ))}
                  </div>
                  {amb.season !== s.id && (
                    <button type="button" onClick={() => setAmbiance({ season: s.id })} className="btn btn-trait mt-10">
                      Vivre le site en {s.name.toLowerCase()}
                    </button>
                  )}
                </div>
              </div>
            </div>
          </section>
        );
      })}
    </div>
  );
}

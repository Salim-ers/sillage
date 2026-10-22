"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { motion } from "motion/react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { signatureSirops, getProduct } from "@/data/products";
import { getSeason } from "@/data/collections";
import { Photo } from "@/components/ui/Photo";
import { RevealTitle } from "@/components/animations";
import { cn } from "@/lib/utils";

/* Section 3 — les quatre créations signatures, en défilement horizontal
   (glisser à la souris, swipe au doigt, flèches ou clavier). */
export function Creations() {
  const sirops = signatureSirops();
  const track = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0);
  const drag = useRef<{ x: number; left: number; moved: boolean } | null>(null);

  useEffect(() => {
    const el = track.current;
    if (!el) return;
    const onScroll = () => {
      const slides = Array.from(el.children) as HTMLElement[];
      const center = el.scrollLeft + el.clientWidth * 0.35;
      let best = 0;
      slides.forEach((s, i) => {
        if (s.offsetLeft <= center) best = i;
      });
      setIndex(best);
    };
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, []);

  const go = (i: number) => {
    const el = track.current;
    const target = el?.children[Math.max(0, Math.min(sirops.length - 1, i))] as HTMLElement | undefined;
    if (el && target) el.scrollTo({ left: target.offsetLeft - el.offsetLeft - parseFloat(getComputedStyle(el).paddingLeft || "0"), behavior: "smooth" });
  };

  return (
    <section className="bg-paper-2 py-24 md:py-32" aria-labelledby="creations-titre">
      <div className="shell flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="mention text-accent">Nos créations signatures</p>
          <RevealTitle id="creations-titre" text="Quatre saisons, quatre sillages." className="titre mt-4 max-w-[14ch]" />
        </div>
        <div className="flex items-center gap-6">
          <ol className="hidden gap-5 lg:flex" aria-label="Créations">
            {sirops.map((p, i) => (
              <li key={p.slug}>
                <button type="button" onClick={() => go(i)} aria-current={i === index ? "true" : undefined} className={cn("font-serif text-lg transition-opacity", i === index ? "opacity-100" : "opacity-45 hover:opacity-80")}>
                  {getSeason(p.season!).name}
                </button>
              </li>
            ))}
          </ol>
          <div className="flex gap-2">
            <button type="button" onClick={() => go(index - 1)} disabled={index === 0} className="grid h-12 w-12 place-items-center rounded-full border border-ink/25 transition hover:border-ink disabled:opacity-30" aria-label="Création précédente">
              <ArrowLeft className="h-4 w-4" strokeWidth={1.4} />
            </button>
            <button type="button" onClick={() => go(index + 1)} disabled={index === sirops.length - 1} className="grid h-12 w-12 place-items-center rounded-full border border-ink/25 transition hover:border-ink disabled:opacity-30" aria-label="Création suivante">
              <ArrowRight className="h-4 w-4" strokeWidth={1.4} />
            </button>
          </div>
        </div>
      </div>

      <div
        ref={track}
        className="no-scrollbar mt-14 flex snap-x snap-mandatory gap-6 overflow-x-auto scroll-px-[var(--gutter)] px-[var(--gutter)] md:gap-10 [&.dragging]:cursor-grabbing [&.dragging]:snap-none md:cursor-grab"
        role="region"
        aria-roledescription="carrousel"
        aria-label="Créations signatures"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "ArrowRight") (e.preventDefault(), go(index + 1));
          if (e.key === "ArrowLeft") (e.preventDefault(), go(index - 1));
        }}
        onPointerDown={(e) => {
          if (e.pointerType !== "mouse" || !track.current) return;
          drag.current = { x: e.clientX, left: track.current.scrollLeft, moved: false };
        }}
        onPointerMove={(e) => {
          const d = drag.current;
          const el = track.current;
          if (!d || !el) return;
          const dx = e.clientX - d.x;
          if (Math.abs(dx) > 5) {
            d.moved = true;
            el.classList.add("dragging");
          }
          el.scrollLeft = d.left - dx;
        }}
        onPointerUp={() => {
          const el = track.current;
          if (drag.current?.moved && el) {
            el.classList.remove("dragging");
            go(index);
          }
          setTimeout(() => (drag.current = null), 0);
        }}
        onPointerLeave={() => {
          if (drag.current?.moved) track.current?.classList.remove("dragging"), go(index);
          drag.current = null;
        }}
        onClickCapture={(e) => {
          if (drag.current?.moved) (e.preventDefault(), e.stopPropagation());
        }}
      >
        {sirops.map((p, i) => {
          const season = getSeason(p.season!);
          const poudre = p.twin ? getProduct(p.twin) : undefined;
          return (
            <article
              key={p.slug}
              className="group grid w-[84vw] shrink-0 snap-start gap-8 sm:w-[70vw] md:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)] md:items-center lg:w-[min(62rem,74vw)]"
              aria-roledescription="diapositive"
              aria-label={`${i + 1} sur ${sirops.length} : ${p.name}`}
            >
              <div className="relative pb-10 pr-10 md:pb-14 md:pr-14">
                <Link href={`/produits/${p.slug}`} draggable={false} aria-label={`${p.name}, sirop`}>
                  <Photo k={p.image!} ratio="aspect-[5/8]" reveal={false} zoom sizes="(min-width:1024px) 30rem, 80vw" />
                </Link>
                {poudre && (
                  <Link
                    href={`/produits/${poudre.slug}`}
                    draggable={false}
                    aria-label={`${poudre.name}`}
                    className="absolute bottom-0 right-0 w-[46%] shadow-[0_30px_60px_-30px_rgba(0,0,0,.6)] transition-transform duration-700 ease-[cubic-bezier(.22,1,.36,1)] group-hover:-translate-x-3 group-hover:-translate-y-3"
                  >
                    <Photo k={poudre.image!} ratio="aspect-[5/8]" reveal={false} sizes="(min-width:1024px) 14rem, 40vw" />
                  </Link>
                )}
              </div>
              <div className="pb-4">
                <p className="mention flex items-center gap-2 text-accent">
                  <span className="h-2 w-2 rounded-full" style={{ background: season.accent }} aria-hidden />
                  {season.name} · {season.chapter}
                </p>
                <h3 className="mt-4 font-serif text-[clamp(2.2rem,3.6vw,3.6rem)] leading-[0.98]">{p.name}</h3>
                <p className="mt-4 font-serif text-xl italic text-ink-soft">{p.tagline}</p>
                <p className="mt-5 max-w-md leading-relaxed text-ink-soft">{p.story[0]}</p>
                <ul className="mt-6 flex flex-wrap gap-2" aria-label="Notes">
                  {p.notes.map((n) => (
                    <li key={n} className="border border-ink/15 px-3 py-1 text-sm">
                      {n}
                    </li>
                  ))}
                </ul>
                <div className="mt-8 flex flex-wrap gap-x-6 gap-y-3 text-sm font-semibold">
                  <Link href={`/produits/${p.slug}`} className="lien" draggable={false}>
                    Le sirop
                  </Link>
                  {poudre && (
                    <Link href={`/produits/${poudre.slug}`} className="lien" draggable={false}>
                      La préparation en poudre
                    </Link>
                  )}
                </div>
              </div>
            </article>
          );
        })}
        <div className="w-[8vw] shrink-0" aria-hidden />
      </div>
      <div className="shell mt-10">
        <div className="h-px w-full bg-ink/12">
          <motion.div className="h-px bg-ink" animate={{ width: `${((index + 1) / sirops.length) * 100}%` }} transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }} />
        </div>
      </div>
    </section>
  );
}

import Link from "next/link";
import { signaturePoudres } from "@/data/products";
import { getSeason } from "@/data/collections";
import { Photo } from "@/components/ui/Photo";
import { RevealTitle, Rise } from "@/components/animations";

/* Section 8 — les préparations en poudre : matière, gamme, usages */
export function Poudres() {
  const poudres = signaturePoudres();
  return (
    <section className="relative overflow-hidden bg-paper-2 py-24 md:py-36" aria-labelledby="poudres-titre">
      <div className="shell grid gap-14 lg:grid-cols-12 lg:gap-x-10">
        <div className="relative lg:col-span-7">
          <Photo k="quatrePoudres" ratio="aspect-[4/3] md:aspect-[16/11]" parallax={6} reveal="left" sizes="(min-width:1024px) 55vw, 100vw" />
          <div className="absolute -bottom-12 right-4 hidden w-[34%] shadow-[0_30px_60px_-30px_rgba(0,0,0,.55)] md:block lg:-right-10">
            <Photo k="dattes" ratio="aspect-square" reveal="bottom" sizes="20vw" caption={undefined} />
          </div>
        </div>
        <div className="lg:col-span-5 lg:pt-6">
          <p className="mention text-accent">Les préparations en poudre</p>
          <RevealTitle id="poudres-titre" text="La gourmandise, dans sa plus belle expression." className="titre mt-4 max-w-[13ch]" />
          <Rise>
            <p className="mt-7 max-w-lg text-ink-soft">
              Chaque saveur signature existe aussi en préparation à fouetter dans le lait, chaud ou froid. Elle apporte de la matière et de
              l&apos;onctuosité aux lattes, aux chocolats, aux frappés et aux boissons créatives.
            </p>
          </Rise>
          <ul className="mt-10 divide-y divide-ink/12 border-y border-ink/12">
            {poudres.map((p, i) => (
              <Rise as="li" key={p.slug} delay={i * 0.05}>
                <Link href={`/produits/${p.slug}`} className="group flex items-baseline justify-between gap-4 py-4">
                  <span className="font-serif text-[1.5rem] leading-tight transition-colors group-hover:text-accent">{p.flavor}</span>
                  <span className="shrink-0 text-[0.7rem] uppercase tracking-[0.18em] text-ink-soft">{getSeason(p.season!).name}</span>
                </Link>
              </Rise>
            ))}
          </ul>
          <div className="mt-10 flex items-center gap-6">
            <Link href="/poudres" className="btn btn-encre">
              Explorer les poudres
            </Link>
          </div>
        </div>
      </div>
      <div className="shell mt-24 hidden md:block">
        <div className="grid grid-cols-12 items-end gap-8">
          <div className="col-span-3">
            <Photo k="chocolat" ratio="aspect-square" reveal="bottom" sizes="22vw" caption="Gros plan matière : cacao et chocolat noir." />
          </div>
          <Rise className="col-span-6 col-start-5">
            <p className="font-serif text-[1.9rem] italic leading-snug text-ink">
              « Une poudre bien fouettée devient une mousse fine, presque une crème. C&apos;est là que la saveur prend toute sa place. »
            </p>
          </Rise>
        </div>
      </div>
    </section>
  );
}

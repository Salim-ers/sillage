import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { products, getProduct } from "@/data/products";
import { recipesForProduct } from "@/data/recipes";
import { categoryLabels, getSeason, profileLabels, usageLabels, recipeCategoryLabels } from "@/data/collections";
import { Gallery } from "@/components/products/Gallery";
import { ProductBuyBox } from "@/components/products/ProductBuyBox";
import { ProductMini } from "@/components/products/ProductMini";
import { Photo } from "@/components/ui/Photo";
import { Accordion } from "@/components/ui/Accordion";
import { RevealTitle, Rise, DrawRule } from "@/components/animations";

export function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const p = getProduct(slug);
  if (!p) return {};
  return {
    title: p.name,
    description: p.seo,
    alternates: { canonical: `/produits/${p.slug}` },
    openGraph: { title: `${p.name} · Maison Sillage`, description: p.seo },
  };
}

export default async function ProduitPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const p = getProduct(slug);
  if (!p) notFound();

  const season = p.season ? getSeason(p.season) : null;
  const twin = p.twin ? getProduct(p.twin) : undefined;
  const inGallery = new Set(p.gallery.map((g) => g.photo));
  const linkedRecipes = p.contents ? p.contents.flatMap((s) => recipesForProduct(s)).filter((r, i, a) => a.findIndex((x) => x.slug === r.slug) === i) : recipesForProduct(p.slug);
  const complements = p.complements.filter((c) => c !== p.twin).map(getProduct).filter((x): x is NonNullable<typeof x> => !!x);
  const contents = (p.contents ?? []).map(getProduct).filter((x): x is NonNullable<typeof x> => !!x);
  const upcoming = p.status === "a-venir";

  return (
    <article>
      <div className="shell pt-[calc(var(--header-h)+1.5rem)]">
        <nav aria-label="Fil d'Ariane" className="text-[0.8rem] text-ink-soft/70">
          <ol className="flex flex-wrap gap-x-2">
            <li>
              <Link href="/boutique" className="hover:text-ink">
                Boutique
              </Link>
            </li>
            <li aria-hidden>/</li>
            <li>
              <Link href={p.category === "poudre" ? "/poudres" : p.category === "sirop" ? "/sirops" : "/boutique?categorie=coffret"} className="hover:text-ink">
                {p.category === "poudre" ? "Les Poudres" : p.category === "sirop" ? "Les Sirops" : "Coffret"}
              </Link>
            </li>
            <li aria-hidden>/</li>
            <li aria-current="page" className="text-ink">
              {p.name}
            </li>
          </ol>
        </nav>
      </div>

      <section className="shell grid gap-12 pb-20 pt-8 lg:grid-cols-12 lg:gap-14">
        <div className="lg:col-span-7">
          <div className="lg:sticky lg:top-[calc(var(--header-h)+1.5rem)]">
            <Gallery name={p.name} views={p.gallery} />
          </div>
        </div>

        <div className="lg:col-span-5">
          <div className="flex flex-wrap items-center gap-2">
            <span className="bg-deep px-2.5 py-1 text-[0.66rem] font-semibold uppercase tracking-[0.18em] text-on-deep">
              {upcoming ? "Édition à venir" : "Prototype — vente indisponible"}
            </span>
            <span className="border border-ink-soft/25 px-2.5 py-1 text-[0.66rem] font-semibold uppercase tracking-[0.18em] text-ink-soft">{categoryLabels[p.category]}</span>
            {season && (
              <span className="inline-flex items-center gap-1.5 border border-ink-soft/25 px-2.5 py-1 text-[0.66rem] font-semibold uppercase tracking-[0.18em]">
                <span className="h-2 w-2 rounded-full" style={{ background: season.accent }} aria-hidden />
                {season.name}
              </span>
            )}
          </div>
          <RevealTitle as="h1" text={p.name} immediate className="mt-6 font-serif text-[clamp(2.5rem,4.4vw,4rem)] leading-[0.98]" />
          <p className="mt-4 font-serif text-2xl italic text-ink-soft">{p.tagline}</p>

          <ul className="mt-8 flex flex-wrap gap-2" aria-label="Notes aromatiques">
            {p.notes.map((n) => (
              <li key={n} className="bg-paper-2/70 px-3 py-1.5 text-sm">
                {n}
              </li>
            ))}
          </ul>

          <ProductBuyBox product={p} />

          {twin && (
            <div className="mt-10">
              <h2 className="mention text-accent">{p.category === "sirop" ? "Existe aussi en préparation en poudre" : "Existe aussi en sirop"}</h2>
              <div className="mt-4">
                <ProductMini product={twin} />
              </div>
            </div>
          )}

          {contents.length > 0 && (
            <div className="mt-10">
              <h2 className="mention text-accent">Dans le coffret</h2>
              <div className="mt-4 space-y-2">
                {contents.map((c) => (
                  <ProductMini key={c.slug} product={c} />
                ))}
              </div>
            </div>
          )}

          <dl className="mt-10 divide-y divide-ink-soft/15 border-y border-ink-soft/15 text-sm">
            <div className="grid grid-cols-3 gap-4 py-4">
              <dt className="text-ink-soft/70">Profil</dt>
              <dd className="col-span-2">{p.profiles.map((x) => profileLabels[x]).join(", ")}</dd>
            </div>
            <div className="grid grid-cols-3 gap-4 py-4">
              <dt className="text-ink-soft/70">Usages envisagés</dt>
              <dd className="col-span-2">{p.usages.map((u) => usageLabels[u]).join(", ")}</dd>
            </div>
            <div className="grid grid-cols-3 gap-4 py-4">
              <dt className="text-ink-soft/70">Ingrédients</dt>
              <dd className="col-span-2">
                <strong className="font-semibold">Formulation en cours.</strong> La liste d&apos;ingrédients et les allergènes seront publiés avec la recette définitive.
              </dd>
            </div>
            <div className="grid grid-cols-3 gap-4 py-4">
              <dt className="text-ink-soft/70">Livraison</dt>
              <dd className="col-span-2">
                Conditions non définies à ce stade.{" "}
                <Link href="/livraison-retours" className="lien">
                  En savoir plus
                </Link>
              </dd>
            </div>
          </dl>
        </div>
      </section>

      {/* histoire & matières */}
      <section className="bg-paper-2/55 py-20 md:py-28" aria-labelledby="histoire-titre">
        <div className="shell grid gap-14 lg:grid-cols-12">
          <div className="lg:col-span-6">
            <p className="mention text-accent">L&apos;histoire gustative</p>
            <RevealTitle id="histoire-titre" text="Ce que raconte cette saveur." className="titre mt-4" />
            {p.story.map((para, i) => (
              <Rise key={i} delay={i * 0.08}>
                <p className={`mt-6 max-w-xl text-[1.05rem] leading-relaxed text-ink-soft ${i === 0 ? "lettrine" : ""}`}>{para}</p>
              </Rise>
            ))}
          </div>
          {season && !inGallery.has(season.landscape) && (
            <div className="lg:col-span-5 lg:col-start-8">
              <Photo k={season.landscape} ratio="aspect-[4/5]" parallax={5} reveal="right" sizes="(min-width:1024px) 38vw, 100vw" caption={`${season.name} : ${season.chapter.toLowerCase()}.`} />
            </div>
          )}
        </div>
      </section>

      {/* usages */}
      <section className="py-20 md:py-28" aria-labelledby="usages-titre">
        <div className="shell">
          <p className="mention text-accent">Suggestions d&apos;utilisation</p>
          <RevealTitle id="usages-titre" text="Une saveur, plusieurs boissons." className="titre mt-4" />
          <div className="mt-12 grid gap-10 md:grid-cols-3">
            {p.usageIdeas.map((u, i) => (
              <Rise key={u.title} delay={i * 0.08} className="border-t border-ink-soft/20 pt-6">
                <h3 className="font-serif text-2xl">{u.title}</h3>
                <p className="mt-2 text-ink-soft/85">{u.text}</p>
              </Rise>
            ))}
          </div>

          {linkedRecipes.length > 0 && (
            <>
              <DrawRule className="mt-20" />
              <h3 className="sous-titre mt-12">Recettes réalisables</h3>
              <ul className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {linkedRecipes.map((r) => (
                  <li key={r.slug}>
                    <Link href={`/recettes/${r.slug}`} className="group flex items-center gap-5 bg-card p-3 transition-colors duration-500 hover:bg-surface">
                      {!inGallery.has(r.image) && (
                        <span className="block h-24 w-20 shrink-0 overflow-hidden">
                          <Photo k={r.image} reveal={false} grade={false} sizes="80px" imgClassName="transition-transform duration-700 group-hover:scale-110" />
                        </span>
                      )}
                      <span>
                        <span className="block text-[0.68rem] uppercase tracking-[0.16em] text-accent">{recipeCategoryLabels[r.category]}</span>
                        <span className="mt-1 block font-serif text-xl leading-tight">{r.title}</span>
                        <span className="mt-1 block text-xs text-ink-soft/70">{r.temps}</span>
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>
      </section>

      {/* FAQ & compléments */}
      <section className="bg-deep py-20 text-on-deep md:py-28">
        <div className="shell grid gap-16 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <h2 className="titre">Questions fréquentes</h2>
            <div className="mt-10">
              <Accordion items={p.faq} tone="sombre" />
            </div>
          </div>
          {complements.length > 0 && (
            <div className="lg:col-span-4 lg:col-start-9">
              <h2 className="mention text-gold">À associer</h2>
              <div className="mt-6 space-y-3">
                {complements.map((c) => (
                  <ProductMini key={c.slug} product={c} tone="sombre" />
                ))}
              </div>
            </div>
          )}
        </div>
      </section>
    </article>
  );
}

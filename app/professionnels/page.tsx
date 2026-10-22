import type { Metadata } from "next";
import Link from "next/link";
import { Photo } from "@/components/ui/Photo";
import { DemoBanner } from "@/components/ui/PageIntro";
import { ProForm } from "@/components/editorial/ProForm";
import { recipes } from "@/data/recipes";
import { productsByCategory } from "@/data/products";
import { formatPrice } from "@/lib/utils";
import { RevealTitle, Rise, Stagger, StaggerItem } from "@/components/animations";

export const metadata: Metadata = {
  title: "Espace professionnels",
  description: "Coffee shops, salons de thé, hôtels, restaurants : Maison Sillage prépare une offre professionnelle de sirops 700 ml, poudres 1 kg et recettes signatures.",
  alternates: { canonical: "/professionnels" },
};

const PUBLICS = [
  ["Coffee shops", "Des lattes signatures qui changent avec les saisons."],
  ["Salons de thé", "Des chocolats, des chaïs et des boissons gourmandes à la tasse."],
  ["Restaurants", "Une carte de boissons chaudes et de mocktails pour accompagner le dessert."],
  ["Hôtels", "Du petit-déjeuner au bar du soir, une même signature aromatique."],
  ["Bars sans alcool", "Des bases parfumées pour des mocktails à la hauteur des cocktails."],
  ["Glaciers & pâtisseries", "Milkshakes, frappés, affogatos : la gourmandise à boire."],
];

const ARGUMENTS = [
  ["Créations originales", "Des associations que l'on ne trouve pas ailleurs, pour donner une identité à votre carte."],
  ["Formats professionnels", "Bouteilles de 700 ml et sachets de 1 kg, pensés pour le service."],
  ["Recettes signatures", "Des fiches recettes claires, prêtes à être reproduites par vos équipes."],
  ["Usages multiples", "Une même référence pour un latte, une limonade et un dessert : moins de stock, plus de propositions."],
  ["Réassort envisagé", "Un approvisionnement régulier fait partie de l'offre en préparation."],
  ["Échantillons envisagés", "Nous souhaitons proposer des échantillons aux établissements intéressés, dès que la production le permettra."],
];

export default function Professionnels() {
  const signatures = recipes.slice(0, 8);
  const sirop = productsByCategory("sirop")[0];
  const poudre = productsByCategory("poudre")[0];
  const proSirop = sirop.formats.find((f) => f.public === "professionnel")!;
  const proPoudre = poudre.formats.find((f) => f.public === "professionnel")!;
  return (
    <>
      <section className="relative isolate overflow-hidden bg-deep text-on-deep">
        <div className="shell grid gap-10 pb-16 pt-[calc(var(--header-h)+4rem)] lg:grid-cols-12 lg:items-end lg:pb-24">
          <div className="lg:col-span-7">
            <p className="mention text-gold">Espace professionnels</p>
            <RevealTitle as="h1" text="Des saveurs à mettre à la carte." immediate className="display mt-5 text-[clamp(2.8rem,6.4vw,6.4rem)]" />
          </div>
          <Rise className="lg:col-span-4 lg:col-start-9" delay={0.3}>
            <p className="text-on-deep/80">
              Maison Sillage prépare une offre dédiée aux établissements. Ce site en présente les grandes lignes : rien n&apos;est encore
              commercialisé, mais nous serions heureux d&apos;échanger dès maintenant.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="#demande" className="btn btn-clair">
                Demander des informations
              </Link>
              <Link href="#formats" className="btn btn-trait">
                Voir les formats
              </Link>
            </div>
          </Rise>
        </div>
        <Photo k="comptoir" ratio="aspect-[16/10] md:aspect-[21/9]" parallax={6} reveal="bottom" priority sizes="100vw" />
      </section>

      <section className="shell py-24 md:py-32" aria-labelledby="publics-titre">
        <p className="mention text-accent">Pour qui</p>
        <RevealTitle id="publics-titre" text="Pensé pour les lieux où l'on prend le temps." className="titre mt-4 max-w-3xl" />
        <Stagger className="mt-14 grid gap-px bg-deep-2/15 sm:grid-cols-2 lg:grid-cols-3">
          {PUBLICS.map(([t, d]) => (
            <StaggerItem key={t} className="bg-paper p-7">
              <h3 className="font-serif text-2xl">{t}</h3>
              <p className="mt-2 text-ink-soft/80">{d}</p>
            </StaggerItem>
          ))}
        </Stagger>
      </section>

      <section className="bg-paper-2/60 py-24 md:py-32" aria-labelledby="arguments-titre">
        <div className="shell grid gap-14 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <p className="mention text-accent">Ce que nous préparons</p>
            <RevealTitle id="arguments-titre" text="Une offre construite avec vous." className="titre mt-4" />
          </div>
          <dl className="grid gap-x-10 gap-y-10 sm:grid-cols-2 lg:col-span-7 lg:col-start-6">
            {ARGUMENTS.map(([t, d], i) => (
              <Rise key={t} delay={(i % 2) * 0.08} className="border-t border-ink-soft/20 pt-5">
                <dt className="font-serif text-2xl">{t}</dt>
                <dd className="mt-2 text-ink-soft/85">{d}</dd>
              </Rise>
            ))}
          </dl>
        </div>
      </section>

      <section id="formats" className="shell scroll-mt-28 py-24 md:py-32" aria-labelledby="formats-titre">
        <p className="mention text-accent">Formats professionnels</p>
        <RevealTitle id="formats-titre" text="Deux formats, toute la collection." className="titre mt-4" />
        <div className="mt-12 overflow-x-auto">
          <table className="w-full min-w-[34rem] text-left">
            <caption className="sr-only">Formats professionnels et tarifs indicatifs</caption>
            <thead>
              <tr className="border-b border-ink-soft/30 text-[0.72rem] uppercase tracking-[0.16em] text-accent">
                <th scope="col" className="py-3 font-semibold">Gamme</th>
                <th scope="col" className="py-3 font-semibold">Format</th>
                <th scope="col" className="py-3 font-semibold">Tarif indicatif</th>
                <th scope="col" className="py-3 font-semibold">Créations</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ink-soft/15">
              <tr>
                <th scope="row" className="py-5 font-serif text-2xl font-normal">Sirops signatures</th>
                <td className="py-5">{proSirop.contenance}</td>
                <td className="py-5 font-serif text-xl tabular-nums">{formatPrice(proSirop.price)} HT</td>
                <td className="py-5 text-sm text-ink-soft/80">4 saveurs saisonnières</td>
              </tr>
              <tr>
                <th scope="row" className="py-5 font-serif text-2xl font-normal">Préparations en poudre</th>
                <td className="py-5">{proPoudre.contenance}</td>
                <td className="py-5 font-serif text-xl tabular-nums">{formatPrice(proPoudre.price)} HT</td>
                <td className="py-5 text-sm text-ink-soft/80">4 saveurs saisonnières</td>
              </tr>
            </tbody>
          </table>
        </div>
        <DemoBanner className="mt-8 max-w-3xl">
          Tarifs purement indicatifs, sans valeur d&apos;offre commerciale. Conditions, minimums de commande et délais seront définis avant
          tout lancement.
        </DemoBanner>
      </section>

      <section className="bg-deep py-24 text-on-deep md:py-32" aria-labelledby="recettes-pro-titre">
        <div className="shell">
          <p className="mention text-gold">Recettes signatures</p>
          <RevealTitle id="recettes-pro-titre" text="Des boissons prêtes pour votre carte." className="titre mt-4 max-w-3xl" />
          <ul className="mt-12 grid gap-x-12 md:grid-cols-2">
            {signatures.map((r) => (
              <li key={r.slug}>
                <Link href={`/recettes/${r.slug}`} className="flex items-baseline justify-between gap-6 border-b border-on-deep/15 py-5 hover:text-gold">
                  <span className="font-serif text-2xl">{r.title}</span>
                  <span className="shrink-0 text-sm text-on-deep/60">{r.temps}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section id="demande" className="shell scroll-mt-28 py-24 md:py-32" aria-labelledby="demande-titre">
        <div className="grid gap-14 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <p className="mention text-accent">Demande d&apos;informations</p>
            <RevealTitle id="demande-titre" text="Parlons de votre carte." className="titre mt-4" />
            <p className="mt-6 text-ink-soft/85">
              Informations, devis indicatif, échantillons : décrivez votre projet. Ce formulaire vérifie vos réponses mais n&apos;envoie rien
              tant qu&apos;aucun service n&apos;est configuré.
            </p>
            <p className="mt-6 text-sm text-ink-soft/70">Nous ne citons aucune référence client : la Maison n&apos;en a pas encore.</p>
          </div>
          <div className="lg:col-span-7 lg:col-start-6">
            <ProForm />
          </div>
        </div>
      </section>
    </>
  );
}

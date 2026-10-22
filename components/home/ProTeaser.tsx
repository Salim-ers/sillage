import Link from "next/link";
import { Photo } from "@/components/ui/Photo";
import { RevealTitle, Rise } from "@/components/animations";

const LIEUX = ["Coffee shops", "Restaurants", "Hôtels", "Salons de thé", "Bars à mocktails", "Établissements gourmands"];

/* Section 9 — les professionnels */
export function ProTeaser() {
  return (
    <section className="relative isolate overflow-hidden bg-deep text-on-deep" aria-labelledby="pro-titre">
      <div className="grid lg:grid-cols-2">
        <div className="relative min-h-[60vh] lg:min-h-[52rem]">
          <Photo k="comptoir" reveal="left" parallax={5} pos="72% 45%" sizes="(min-width:1024px) 50vw, 100vw" />
        </div>
        <div className="flex items-center px-[var(--gutter)] py-20 lg:px-16 lg:py-24 xl:px-24">
          <div className="max-w-xl">
            <p className="mention text-gold">Espace professionnels</p>
            <RevealTitle id="pro-titre" text="Des créations pensées pour vos établissements." className="titre mt-4" />
            <Rise>
              <p className="mt-7 text-on-deep/80">
                « Enrichissez votre carte avec des associations gourmandes originales et des préparations imaginées pour inspirer de nouvelles boissons. »
              </p>
              <ul className="mt-8 flex flex-wrap gap-2" aria-label="Établissements">
                {LIEUX.map((l) => (
                  <li key={l} className="border border-on-deep/20 px-3 py-1.5 text-sm text-on-deep/85">
                    {l}
                  </li>
                ))}
              </ul>
              <p className="mt-8 text-sm text-on-deep/60">Formats 70 cl et 1 kg, recettes signatures. Offre en préparation : aucune livraison ni certification n&apos;est annoncée.</p>
              <Link href="/professionnels" className="btn btn-clair mt-10">
                Découvrir l&apos;espace professionnel
              </Link>
            </Rise>
          </div>
        </div>
      </div>
    </section>
  );
}

import Link from "next/link";
import { signatureSirops } from "@/data/products";
import { ProductCard } from "@/components/products/ProductCard";
import { RevealTitle, Stagger, StaggerItem } from "@/components/animations";
import type { PhotoKey } from "@/data/images";

const SCENE: Record<string, PhotoKey> = {
  printemps: "scenePrintempsPortrait",
  ete: "sceneEtePortrait",
  automne: "sceneAutomnePortrait",
  hiver: "sceneHiverPortrait",
};

/* Section 7 — les signatures de la Maison (sans faux avis ni faux volumes de vente) */
export function Selection() {
  const sirops = signatureSirops();
  return (
    <section className="bg-paper py-24 md:py-32" aria-labelledby="selection-titre">
      <div className="shell">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="mention text-accent">Nos signatures</p>
            <RevealTitle id="selection-titre" text="Les signatures de la Maison." className="titre mt-4" />
          </div>
          <p className="max-w-sm text-sm text-ink-soft">
            Boutique de démonstration : formats et prix indicatifs, panier enregistré sur votre appareil, aucune commande réelle.
          </p>
        </div>
        <Stagger className="mt-14 grid gap-x-6 gap-y-14 sm:grid-cols-2 xl:grid-cols-4">
          {sirops.map((p) => (
            <StaggerItem key={p.slug} className="flex">
              <ProductCard product={p} photo={SCENE[p.season!]} hoverPhoto={p.image} className="w-full" />
            </StaggerItem>
          ))}
        </Stagger>
        <div className="mt-14 flex flex-wrap items-center gap-x-8 gap-y-4">
          <Link href="/boutique" className="btn btn-encre">
            Toute la boutique
          </Link>
          <Link href="/produits/coffret-decouverte" className="lien text-sm font-semibold">
            Le Coffret Découverte, les quatre saisons réunies
          </Link>
        </div>
      </div>
    </section>
  );
}

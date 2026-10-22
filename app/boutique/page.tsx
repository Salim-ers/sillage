import type { Metadata } from "next";
import { PageIntro } from "@/components/ui/PageIntro";
import { ShopCatalog, type ShopInitial } from "@/components/products/ShopCatalog";
import { profileLabels } from "@/data/collections";
import type { Profile } from "@/lib/types";

export const metadata: Metadata = {
  title: "Boutique",
  description: "Toutes les créations Maison Sillage : sirops signatures, préparations en poudre et Coffret Découverte. Boutique de démonstration, prix indicatifs.",
  alternates: { canonical: "/boutique" },
};

const one = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v);

export default async function Boutique({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const sp = await searchParams;
  const cat = one(sp.categorie);
  const saison = one(sp.saison);
  const initial: ShopInitial = {
    categorie: cat === "sirop" || cat === "poudre" || cat === "coffret" ? cat : "tous",
    saison: saison === "printemps" || saison === "ete" || saison === "automne" || saison === "hiver" ? saison : "toutes",
    q: one(sp.q)?.slice(0, 80) ?? "",
    profils: (one(sp.profils) ?? "").split(",").filter((p): p is Profile => p in profileLabels),
  };
  return (
    <>
      <PageIntro kicker="La boutique" title="Toutes les créations de la Maison.">
        Sirops signatures, préparations en poudre et coffret : filtrez par saison ou par profil gustatif. Boutique de démonstration, prix
        indicatifs, aucune vente réelle.
      </PageIntro>
      <ShopCatalog initial={initial} />
    </>
  );
}

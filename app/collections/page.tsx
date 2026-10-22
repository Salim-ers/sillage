import type { Metadata } from "next";
import { PageIntro } from "@/components/ui/PageIntro";
import { SeasonChapters } from "@/components/editorial/SeasonChapters";

export const metadata: Metadata = {
  title: "Les collections des quatre saisons",
  description: "Printemps, été, automne, hiver : la collection Maison Sillage se lit comme un carnet de voyage en quatre chapitres.",
  alternates: { canonical: "/collections" },
};

export default function Collections() {
  return (
    <>
      <PageIntro kicker="Les collections" title="Un carnet de voyage en quatre chapitres.">
        Chaque saison a ses saveurs, ses boissons et sa lumière. Faites défiler la page : les couleurs changent avec les chapitres, comme le
        paysage au fil d&apos;une traversée.
      </PageIntro>
      <SeasonChapters />
    </>
  );
}

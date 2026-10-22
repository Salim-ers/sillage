import type { Metadata } from "next";
import { PageIntro } from "@/components/ui/PageIntro";
import { RecipeIndex } from "@/components/editorial/RecipeIndex";
import { Photo } from "@/components/ui/Photo";
import { recipeCategoryLabels } from "@/data/collections";
import type { RecipeCategory } from "@/lib/types";

export const metadata: Metadata = {
  title: "Recettes",
  description: "Latte, iced latte, café, chocolat chaud, mocktail sans alcool, milkshake, frappé et dessert : les recettes de démonstration Maison Sillage.",
  alternates: { canonical: "/recettes" },
};

export default async function Recettes({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const sp = await searchParams;
  const u = Array.isArray(sp.usage) ? sp.usage[0] : sp.usage;
  const initial = u && u in recipeCategoryLabels ? (u as RecipeCategory) : undefined;
  return (
    <>
      <PageIntro kicker="Recettes & usages" title="Une saveur, mille façons de la boire.">
        Chaque création de la Maison est pensée pour plusieurs boissons. Voici nos propositions : des recettes simples, chaudes ou glacées,
        dont les dosages sont indicatifs.
      </PageIntro>
      <div className="mb-14">
        <Photo k="paysageEte" ratio="aspect-[16/9] md:aspect-[21/9]" parallax={6} reveal="bottom" sizes="100vw" priority />
      </div>
      <RecipeIndex initial={initial} />
    </>
  );
}

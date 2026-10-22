import type { Metadata } from "next";
import { PageIntro } from "@/components/ui/PageIntro";
import { FavoritesList } from "@/components/products/FavoritesList";

export const metadata: Metadata = { title: "Mes favoris", description: "Les créations Maison Sillage que vous avez mises de côté.", robots: { index: false } };

export default function Favoris() {
  return (
    <>
      <PageIntro kicker="Favoris" title="Vos créations mises de côté." />
      <FavoritesList />
    </>
  );
}

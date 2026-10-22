import type { Metadata } from "next";
import { RangePage } from "@/components/products/RangePage";

export const metadata: Metadata = {
  title: "Les sirops signatures",
  description: "Quatre sirops saisonniers : Fraise des bois & Madeleine dorée, Pêche blanche & Fleur d'oranger, Poire fondante & Vanille Bourbon, Datte Medjool & Crème brûlée.",
  alternates: { canonical: "/sirops" },
};

export default function Sirops() {
  return (
    <RangePage
      category="sirop"
      kicker="Gamme Signature Syrups"
      title="Les sirops signatures."
      intro="Un fruit, une note pâtissière ou florale, une saison. Nos sirops sont imaginés pour le café et le latte, mais aussi pour les boissons glacées, les mocktails sans alcool et les desserts, selon des compatibilités qui restent à valider."
      photo="quatreSirops"
      points={[
        { title: "Deux formats", text: "Un flacon de 25 cl pour la maison, une bouteille de 70 cl pensée pour les professionnels. Tarifs indicatifs." },
        { title: "Une même étiquette", text: "Ivoire, gravée, un double filet et un cachet à la couleur de la saison : la famille se reconnaît sur un comptoir." },
        { title: "Formulation en cours", text: "Les compositions définitives seront publiées une fois les recettes finalisées et validées." },
      ]}
      other={{ href: "/poudres", label: "Découvrir aussi les préparations en poudre" }}
    />
  );
}

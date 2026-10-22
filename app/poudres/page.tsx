import type { Metadata } from "next";
import { RangePage } from "@/components/products/RangePage";

export const metadata: Metadata = {
  title: "Les préparations en poudre",
  description: "Les quatre saveurs signatures en préparation à fouetter dans le lait : pour lattes, frappés, chocolats et boissons créatives.",
  alternates: { canonical: "/poudres" },
};

export default function Poudres() {
  return (
    <RangePage
      category="poudre"
      kicker="Gamme Signature Powders"
      title="Les préparations en poudre."
      intro="Les quatre saveurs signatures, en préparation à fouetter dans le lait chaud ou froid : elles donnent du corps aux lattes, aux frappés et aux chocolats."
      photo="quatrePoudres"
      points={[
        { title: "Deux formats", text: "Un sachet de 250 g pour la maison, un sachet de 1 kg pour les établissements. Tarifs indicatifs." },
        { title: "Chaud ou froid", text: "Lattes, chocolats, frappés, milkshakes : la tenue à froid comme à chaud fait partie des essais à mener." },
        { title: "Formulation en cours", text: "Aucune composition ni valeur nutritionnelle n'est annoncée avant la finalisation des recettes." },
      ]}
      other={{ href: "/sirops", label: "Découvrir aussi les sirops signatures" }}
    />
  );
}

import type { Metadata } from "next";
import { TextPage, ACOMPLETER } from "@/components/editorial/TextPage";

export const metadata: Metadata = { title: "Livraison & retours", description: "Les conditions de livraison et de retour de Maison Sillage ne sont pas encore définies.", alternates: { canonical: "/livraison-retours" } };

export default function Livraison() {
  return (
    <TextPage
      kicker="Aide"
      title="Livraison & retours."
      intro="Aucune politique de livraison ou de retour n'est encore arrêtée. Cette page en prépare simplement l'emplacement."
      notice="Informations non définies : rien sur cette page ne constitue un engagement."
      sections={[
        { title: "Zones et délais de livraison", body: <p>Les zones desservies, transporteurs et délais seront précisés avant toute ouverture des ventes. {ACOMPLETER}</p> },
        { title: "Frais de port", body: <p>Les tarifs d&apos;expédition, pour les particuliers comme pour les professionnels, restent à établir. {ACOMPLETER}</p> },
        { title: "Retours et rétractation", body: <p>Les modalités de retour et l&apos;exercice du droit de rétractation applicable aux ventes à distance seront détaillés dans les conditions générales de vente. {ACOMPLETER}</p> },
      ]}
    />
  );
}

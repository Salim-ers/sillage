import type { Metadata } from "next";
import { TextPage, ACOMPLETER } from "@/components/editorial/TextPage";

export const metadata: Metadata = { title: "Conditions de vente", description: "Conditions générales de vente Maison Sillage (à rédiger).", robots: { index: false } };

export default function Cgv() {
  return (
    <TextPage
      kicker="Informations légales"
      title="Conditions générales de vente."
      notice="Aucune vente n'est ouverte. Les conditions générales de vente restent à rédiger, idéalement avec un conseil juridique."
      sections={[
        { title: "Objet et champ d'application", body: <p>{ACOMPLETER}</p> },
        { title: "Prix et paiement", body: <p>Les prix affichés sur ce site sont indicatifs et fictifs. Les modalités de paiement seront définies. {ACOMPLETER}</p> },
        { title: "Livraison", body: <p>{ACOMPLETER}</p> },
        { title: "Droit de rétractation", body: <p>{ACOMPLETER}</p> },
        { title: "Garanties et réclamations", body: <p>{ACOMPLETER}</p> },
        { title: "Conditions professionnelles", body: <p>Conditions spécifiques aux ventes entre professionnels (tarifs HT, minimums, délais de paiement). {ACOMPLETER}</p> },
      ]}
    />
  );
}

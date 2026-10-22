import type { Metadata } from "next";
import { TextPage, ACOMPLETER } from "@/components/editorial/TextPage";

export const metadata: Metadata = { title: "Mentions légales", description: "Mentions légales du site de démonstration Maison Sillage (à compléter).", robots: { index: false } };

export default function Mentions() {
  return (
    <TextPage
      kicker="Informations légales"
      title="Mentions légales."
      notice="Emplacement préparé : les mentions ci-dessous doivent être complétées avant toute mise en ligne commerciale."
      sections={[
        { title: "Éditeur du site", body: <p>Raison sociale, forme juridique, capital, siège, immatriculation et numéro de TVA : {ACOMPLETER}</p> },
        { title: "Directeur de la publication", body: <p>{ACOMPLETER}</p> },
        { title: "Hébergement", body: <p>Coordonnées de l&apos;hébergeur du site : {ACOMPLETER}</p> },
        { title: "Propriété intellectuelle", body: <p>Le nom, le logo et l&apos;univers graphique Maison Sillage sont présentés dans le cadre d&apos;un projet en conception. Les conditions d&apos;utilisation seront précisées. {ACOMPLETER}</p> },
      ]}
    />
  );
}

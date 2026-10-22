import type { Metadata } from "next";
import { TextPage, ACOMPLETER } from "@/components/editorial/TextPage";

export const metadata: Metadata = { title: "Confidentialité", description: "Politique de confidentialité du site de démonstration Maison Sillage.", robots: { index: false } };

export default function Confidentialite() {
  return (
    <TextPage
      kicker="Informations légales"
      title="Confidentialité."
      intro="Dans sa version de démonstration, ce site ne collecte aucune donnée personnelle."
      sections={[
        {
          title: "Ce que fait ce site aujourd'hui",
          body: (
            <>
              <p>Le panier et les favoris sont enregistrés uniquement dans le stockage local de votre navigateur, sur votre appareil. Ils ne sont envoyés à aucun serveur.</p>
              <p>Les formulaires (lettre de saison, demande professionnelle, commande simulée) vérifient vos saisies mais n&apos;envoient ni n&apos;enregistrent rien.</p>
              <p>Pour effacer ces données locales, il suffit de vider le panier, de retirer vos favoris ou d&apos;effacer les données du site dans votre navigateur.</p>
            </>
          ),
        },
        { title: "Politique définitive", body: <p>Responsable de traitement, finalités, durées de conservation, droits des personnes et cookies : {ACOMPLETER}</p> },
      ]}
    />
  );
}

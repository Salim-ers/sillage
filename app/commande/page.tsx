import type { Metadata } from "next";
import { PageIntro } from "@/components/ui/PageIntro";
import { Checkout } from "@/components/cart/Checkout";

export const metadata: Metadata = { title: "Commande simulée", description: "Parcours de commande de démonstration : aucune commande réelle.", robots: { index: false } };

export default function Commande() {
  return (
    <>
      <PageIntro kicker="Démonstration — aucune commande réelle" title="Commande simulée.">
        Ce parcours montre ce que sera la commande en ligne. Aucun paiement n&apos;est demandé et aucune information n&apos;est transmise.
      </PageIntro>
      <Checkout />
    </>
  );
}

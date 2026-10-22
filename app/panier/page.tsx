import type { Metadata } from "next";
import { PageIntro } from "@/components/ui/PageIntro";
import { CartPage } from "@/components/cart/CartPage";

export const metadata: Metadata = { title: "Panier", description: "Votre panier de démonstration Maison Sillage.", robots: { index: false } };

export default function Panier() {
  return (
    <>
      <PageIntro kicker="Panier de démonstration" title="Votre panier." />
      <CartPage />
    </>
  );
}

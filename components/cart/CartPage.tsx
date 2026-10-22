"use client";

import Link from "next/link";
import { useStore } from "@/lib/store";
import { CartLines, CartTotals, DemoNotice } from "./CartLines";
import { WakeStroke } from "@/components/animations";

export function CartPage() {
  const { lines, ready, clear } = useStore();
  if (!ready) return <div className="shell min-h-[40vh] py-20 text-ink-soft/60">Chargement du panier…</div>;
  if (lines.length === 0)
    return (
      <div className="shell flex flex-col items-start py-16 pb-32">
        <WakeStroke className="w-48 text-accent" />
        <p className="mt-6 font-serif text-4xl">Votre panier est vide.</p>
        <p className="mt-3 max-w-md text-ink-soft/80">Ajoutez une création depuis la boutique pour essayer le parcours d&apos;achat de démonstration.</p>
        <Link href="/boutique" className="btn btn-encre mt-8">
          Parcourir la boutique
        </Link>
      </div>
    );
  return (
    <div className="shell grid gap-14 pb-32 lg:grid-cols-12">
      <div className="lg:col-span-7">
        <div className="border-t border-ink-soft/15">
          <CartLines large />
        </div>
        <button type="button" onClick={clear} className="mt-6 text-sm text-ink-soft/75 underline-offset-4 hover:text-ink hover:underline">
          Vider le panier
        </button>
      </div>
      <aside className="lg:col-span-4 lg:col-start-9" aria-label="Récapitulatif">
        <div className="papier space-y-6 p-7 lg:sticky lg:top-[calc(var(--header-h)+1.5rem)]">
          <h2 className="font-serif text-3xl">Récapitulatif</h2>
          <CartTotals />
          <DemoNotice />
          <Link href="/commande" className="btn btn-encre w-full">
            Simuler la commande
          </Link>
          <Link href="/boutique" className="block text-center text-sm underline-offset-4 hover:underline">
            Continuer la visite
          </Link>
        </div>
      </aside>
    </div>
  );
}

"use client";

import Link from "next/link";
import { useStore } from "@/lib/store";
import { getProduct, startingPrice } from "@/data/products";
import { ProductMini } from "./ProductMini";
import { AddToCart } from "./AddToCart";
import { FavoriteButton } from "./FavoriteButton";
import { WakeStroke } from "@/components/animations";

export function FavoritesList() {
  const { favorites, ready } = useStore();
  if (!ready) return <div className="shell min-h-[30vh] text-ink-soft/60">Chargement…</div>;
  const list = favorites.map(getProduct).filter((p): p is NonNullable<typeof p> => !!p);
  if (!list.length)
    return (
      <div className="shell pb-32">
        <WakeStroke className="w-48 text-accent" />
        <p className="mt-6 font-serif text-4xl">Aucun favori pour l&apos;instant.</p>
        <p className="mt-3 max-w-md text-ink-soft/80">Touchez le cœur d&apos;une création pour la retrouver ici. Vos favoris restent enregistrés sur cet appareil.</p>
        <Link href="/boutique" className="btn btn-encre mt-8">
          Parcourir la boutique
        </Link>
      </div>
    );
  return (
    <ul className="shell grid gap-4 pb-32 md:grid-cols-2">
      {list.map((p) => (
        <li key={p.slug} className="flex flex-col gap-3 bg-surface/40 p-3 sm:flex-row sm:items-center">
          <div className="flex-1">
            <ProductMini product={p} />
          </div>
          <div className="flex items-center gap-2 px-2">
            {p.status !== "a-venir" && <AddToCart slug={p.slug} formatId={startingPrice(p).id} label="Ajouter" variant="trait" className="min-h-10 px-4 text-[0.66rem]" />}
            <FavoriteButton slug={p.slug} name={p.name} />
          </div>
        </li>
      ))}
    </ul>
  );
}

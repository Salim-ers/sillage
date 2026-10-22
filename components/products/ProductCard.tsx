import Link from "next/link";
import type { Product } from "@/lib/types";
import type { PhotoKey } from "@/data/images";
import { categoryLabels, getSeason } from "@/data/collections";
import { startingPrice } from "@/data/products";
import { formatPrice, cn } from "@/lib/utils";
import { Photo } from "@/components/ui/Photo";
import { Emblem } from "@/components/ui/Logo";
import { FavoriteButton } from "./FavoriteButton";
import { AddToCart } from "./AddToCart";

/** Visuel manquant : on le dit, sans illustration de remplacement */
export function MissingVisual({ label = "Visuel en préparation" }: { label?: string }) {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-4 bg-paper-3 p-6 text-center">
      <div className="w-16 opacity-60">
        <Emblem sizes="64px" className="only-clair" />
        <Emblem tone="sombre" sizes="64px" className="only-nuit" />
      </div>
      <p className="mention text-ink-soft">{label}</p>
    </div>
  );
}

export function ProductCard({
  product,
  className,
  headingLevel = "h3",
  photo,
  hoverPhoto,
  sizes = "(min-width:1280px) 22vw, (min-width:640px) 45vw, 92vw",
}: {
  product: Product;
  className?: string;
  headingLevel?: "h2" | "h3";
  photo?: PhotoKey;
  hoverPhoto?: PhotoKey | null;
  sizes?: string;
}) {
  const price = startingPrice(product);
  const upcoming = product.status === "a-venir";
  const H = headingLevel;
  const main = photo ?? product.image;
  const alt = hoverPhoto === null ? null : hoverPhoto ?? product.gallery.find((g) => g.photo !== main)?.photo ?? null;
  return (
    <article className={cn("group relative flex flex-col", className)}>
      <Link href={`/produits/${product.slug}`} className="relative block aspect-[4/5] overflow-hidden bg-card" aria-label={`${product.name} — voir la fiche`}>
        {main ? (
          <>
            <Photo k={main} reveal={false} sizes={sizes} imgClassName="transition-transform duration-[1.4s] ease-[cubic-bezier(.22,1,.36,1)] group-hover:scale-[1.06]" />
            {alt && (
              <div className="absolute inset-0 opacity-0 transition-opacity duration-700 group-hover:opacity-100">
                <Photo k={alt} reveal={false} sizes={sizes} />
              </div>
            )}
          </>
        ) : (
          <MissingVisual />
        )}
        <span className="absolute left-3 top-3 bg-surface/90 px-2.5 py-1 text-[0.66rem] font-semibold uppercase tracking-[0.18em] text-ink">
          {upcoming ? "Édition à venir" : product.season ? getSeason(product.season).name : "Coffret"}
        </span>
      </Link>
      <FavoriteButton slug={product.slug} name={product.name} className="absolute right-3 top-3" />
      <div className="flex flex-1 flex-col pt-4">
        <p className="text-[0.72rem] uppercase tracking-[0.16em] text-accent">{categoryLabels[product.category]}</p>
        <H className="mt-1.5 font-serif text-[1.55rem] leading-[1.08]">
          <Link href={`/produits/${product.slug}`} className="transition-colors hover:text-accent">
            {product.category === "poudre" ? product.flavor : product.name}
          </Link>
        </H>
        <p className="mt-1.5 text-sm text-ink-soft">{product.tagline}</p>
        <div className="mt-auto flex items-end justify-between gap-3 pt-4">
          {upcoming ? (
            <p className="text-sm italic text-ink-soft">Création à l&apos;étude, non disponible</p>
          ) : (
            <p className="text-sm">
              <span className="font-serif text-xl">{formatPrice(price.price)}</span>{" "}
              <span className="text-ink-soft">
                {price.tax} · {price.contenance}
              </span>
              <span className="block text-[0.7rem] text-ink-soft/80">Prix indicatif</span>
            </p>
          )}
          {!upcoming && <AddToCart slug={product.slug} formatId={price.id} label="Ajouter" variant="trait" className="min-h-10 px-4 py-2 text-[0.66rem]" />}
        </div>
      </div>
    </article>
  );
}

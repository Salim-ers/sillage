import Link from "next/link";
import type { Product } from "@/lib/types";
import { startingPrice } from "@/data/products";
import { categoryLabels } from "@/data/collections";
import { formatPrice } from "@/lib/utils";
import { ProductArt } from "./ProductArt";

/** Vignette compacte : le conditionnement seul, sans mise en scène (évite tout doublon de visuel) */
export function ProductMini({ product, tone = "clair" }: { product: Product; tone?: "clair" | "sombre" }) {
  const price = startingPrice(product);
  const dark = tone === "sombre";
  return (
    <Link
      href={`/produits/${product.slug}`}
      className={`group flex items-center gap-5 p-4 transition-colors duration-500 ${dark ? "bg-on-deep/[0.06] hover:bg-on-deep/[0.12]" : "bg-card hover:bg-surface"}`}
    >
      <span className="block h-28 w-20 shrink-0 overflow-hidden transition-transform duration-700 ease-[cubic-bezier(.22,1,.36,1)] group-hover:-translate-y-1">
        <ProductArt product={product} />
      </span>
      <span className="min-w-0">
        <span className={`block text-[0.68rem] uppercase tracking-[0.16em] ${dark ? "text-gold" : "text-accent"}`}>
          {product.status === "a-venir" ? "Édition à venir" : categoryLabels[product.category]}
        </span>
        <span className="mt-1 block font-serif text-[1.35rem] leading-tight">{product.name}</span>
        {product.status !== "a-venir" && (
          <span className={`mt-1 block text-sm ${dark ? "text-on-deep/65" : "text-ink-soft/70"}`}>
            {formatPrice(price.price)} {price.tax} · {price.contenance}
          </span>
        )}
      </span>
    </Link>
  );
}

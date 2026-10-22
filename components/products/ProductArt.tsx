import Image from "next/image";
import type { Product } from "@/lib/types";
import { photos } from "@/data/images";
import { cn } from "@/lib/utils";
import { Emblem } from "@/components/ui/Logo";

/** Vignette photographique d'un produit (panier, recherche, suggestions) */
export function ProductArt({ product, className }: { product: Product; className?: string; format?: string }) {
  const ph = product.image ? photos[product.image] : null;
  return (
    <span className={cn("relative block h-full w-full overflow-hidden bg-paper-3", className)}>
      {ph ? (
        <Image src={ph.src} alt="" fill sizes="120px" quality={70} className="object-cover" style={{ objectPosition: ph.pos ?? "50% 45%" }} />
      ) : (
        <span className="absolute inset-0 grid place-items-center p-3 opacity-60">
          <Emblem sizes="60px" className="only-clair" />
          <Emblem tone="sombre" sizes="60px" className="only-nuit" />
        </span>
      )}
    </span>
  );
}

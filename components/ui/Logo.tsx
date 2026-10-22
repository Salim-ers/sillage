import Image from "next/image";
import { cn } from "@/lib/utils";

/* Le logo officiel, détouré sans aucune retouche de dessin.
   Proportions d'origine : 1124 × 1203 (logo) · 582 × 691 (emblème). */

export function Logo({ tone = "clair", className, priority = false, sizes = "180px" }: { tone?: "clair" | "sombre"; className?: string; priority?: boolean; sizes?: string }) {
  return (
    <Image
      src={tone === "clair" ? "/brand/logo-light.png" : "/brand/logo-dark.png"}
      alt="Maison Sillage — L'empreinte d'une saveur"
      width={1124}
      height={1203}
      priority={priority}
      sizes={sizes}
      quality={90}
      className={cn("h-auto w-full select-none", className)}
      draggable={false}
    />
  );
}

export function Emblem({ tone = "clair", className, sizes = "64px", alt = "" }: { tone?: "clair" | "sombre"; className?: string; sizes?: string; alt?: string }) {
  return (
    <Image
      src={tone === "clair" ? "/brand/emblem-light.png" : "/brand/emblem-dark.png"}
      alt={alt}
      width={582}
      height={691}
      sizes={sizes}
      quality={90}
      className={cn("h-auto w-full select-none", className)}
      draggable={false}
    />
  );
}

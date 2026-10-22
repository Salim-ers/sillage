export function cn(...c: (string | false | null | undefined)[]) {
  return c.filter(Boolean).join(" ");
}

const eur = new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" });
export const formatPrice = (n: number) => eur.format(n).replace(/ /g, " ");

export const SITE = {
  name: "Maison Sillage",
  signature: "L'empreinte d'une saveur",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://maison-sillage.vercel.app",
  description:
    "Maison Sillage imagine des sirops signatures et des préparations en poudre pour réinventer cafés, lattes et boissons gourmandes. Site de démonstration précommerciale.",
};

/** id SVG sûr à partir de useId() */
export const svgId = (id: string) => id.replace(/[^a-zA-Z0-9_-]/g, "");

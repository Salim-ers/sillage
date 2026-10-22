import type { PhotoKey } from "@/data/images";

export type Category = "sirop" | "poudre" | "coffret";
export type SeasonId = "printemps" | "ete" | "automne" | "hiver";
export type Profile = "fruite" | "floral" | "patissier" | "fruits-secs";
export type Usage =
  | "latte"
  | "cafe"
  | "latte-glace"
  | "mocktail"
  | "limonade"
  | "chocolat"
  | "frappe"
  | "milkshake"
  | "dessert";

export interface Format {
  id: string;
  label: string;
  contenance: string;
  public: "particulier" | "professionnel";
  price: number;
  tax: "TTC" | "HT";
}

export interface Product {
  slug: string;
  name: string;
  /** nom de la saveur, commun au sirop et à la préparation */
  flavor: string;
  category: Category;
  season: SeasonId | null;
  status: "prototype" | "a-venir";
  profiles: Profile[];
  notes: string[];
  tagline: string;
  story: string[];
  usages: Usage[];
  usageIdeas: { title: string; text: string }[];
  formats: Format[];
  /** photographie principale, puis galerie de la fiche (aucune répétition) */
  image: PhotoKey | null;
  gallery: { photo: PhotoKey; label: string; pos?: string }[];
  contents?: string[];
  /** l'autre forme de la même saveur (sirop ↔ préparation) */
  twin?: string;
  complements: string[];
  faq: { q: string; a: string }[];
  seo: string;
}

export type RecipeCategory = "cafe" | "latte" | "latte-glace" | "chocolat" | "mocktail" | "milkshake" | "frappe" | "dessert";

export interface Recipe {
  slug: string;
  title: string;
  category: RecipeCategory;
  products: string[];
  intro: string;
  temps: string;
  service: string;
  ingredients: { qty: string; item: string; product?: string }[];
  steps: string[];
  final: string;
  conseil: string;
  image: PhotoKey;
}

export interface Season {
  id: SeasonId;
  name: string;
  numeral: string;
  chapter: string;
  accent: string;
  intro: string;
  carnet: string;
  ambiance: string[];
  landscape: PhotoKey;
  collection: PhotoKey;
  details: [PhotoKey, PhotoKey];
  scene: PhotoKey;
}

export interface Article {
  slug: string;
  title: string;
  rubrique: string;
  lecture: string;
  chapo: string;
  body: ({ type: "p"; text: string } | { type: "h2"; text: string } | { type: "quote"; text: string })[];
  image: PhotoKey;
}

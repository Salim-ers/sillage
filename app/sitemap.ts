import type { MetadataRoute } from "next";
import { products } from "@/data/products";
import { recipes } from "@/data/recipes";
import { articles } from "@/data/journal";
import { SITE } from "@/lib/utils";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const statics = ["", "/boutique", "/sirops", "/poudres", "/collections", "/maison", "/savoir-faire", "/recettes", "/professionnels", "/journal", "/faq", "/livraison-retours", "/contact"];
  return [
    ...statics.map((p) => ({ url: `${SITE.url}${p}`, lastModified: now, changeFrequency: "monthly" as const, priority: p === "" ? 1 : 0.7 })),
    ...products.map((p) => ({ url: `${SITE.url}/produits/${p.slug}`, lastModified: now, priority: 0.8 })),
    ...recipes.map((r) => ({ url: `${SITE.url}/recettes/${r.slug}`, lastModified: now, priority: 0.6 })),
    ...articles.map((a) => ({ url: `${SITE.url}/journal/${a.slug}`, lastModified: now, priority: 0.5 })),
  ];
}

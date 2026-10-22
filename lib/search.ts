import { products } from "@/data/products";
import { recipes } from "@/data/recipes";
import { articles } from "@/data/journal";
import { profileLabels, usageLabels, categoryLabels } from "@/data/collections";
import type { Product } from "@/lib/types";

export const normalize = (s: string) =>
  s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9\s]/g, " ");

export function productHaystack(p: Product) {
  return normalize(
    [p.name, p.tagline, p.notes.join(" "), p.profiles.map((x) => profileLabels[x]).join(" "), p.usages.map((u) => usageLabels[u]).join(" "), categoryLabels[p.category], p.season ?? ""].join(" "),
  );
}

export function matches(haystack: string, query: string) {
  const terms = normalize(query).split(/\s+/).filter(Boolean);
  return terms.every((t) => haystack.includes(t));
}

export function searchAll(query: string) {
  if (!query.trim()) return { products: [], recipes: [], articles: [] };
  return {
    products: products.filter((p) => matches(productHaystack(p), query)),
    recipes: recipes.filter((r) => matches(normalize(`${r.title} ${r.intro} ${r.ingredients.map((i) => i.item).join(" ")}`), query)),
    articles: articles.filter((a) => matches(normalize(`${a.title} ${a.chapo} ${a.rubrique}`), query)),
  };
}

"use client";

import { useReducedMotion } from "@/lib/useReduced";
import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { products, startingPrice } from "@/data/products";
import { profileLabels, seasons } from "@/data/collections";
import { productHaystack, matches } from "@/lib/search";
import type { Category, Profile, SeasonId } from "@/lib/types";
import { cn } from "@/lib/utils";
import { ProductCard } from "./ProductCard";

type Sort = "selection" | "prix-asc" | "prix-desc" | "nom";
export type ShopInitial = { categorie?: Category | "tous"; saison?: SeasonId | "toutes"; q?: string; profils?: Profile[] };

const CATS: { id: Category | "tous"; label: string }[] = [
  { id: "tous", label: "Toutes les créations" },
  { id: "sirop", label: "Sirops" },
  { id: "poudre", label: "Poudres" },
  { id: "coffret", label: "Coffret" },
];

const SORTS: { id: Sort; label: string }[] = [
  { id: "selection", label: "Sélection de la Maison" },
  { id: "prix-asc", label: "Prix croissant" },
  { id: "prix-desc", label: "Prix décroissant" },
  { id: "nom", label: "Nom, de A à Z" },
];

function Chip({ on, onClick, children }: { on: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      aria-pressed={on}
      onClick={onClick}
      className={cn(
        "min-h-10 border px-3.5 py-2 text-sm transition duration-300",
        on ? "border-ink-soft bg-deep-2 text-on-deep" : "border-ink-soft/25 hover:border-ink-soft/70",
      )}
    >
      {children}
    </button>
  );
}

export function ShopCatalog({ initial, lockedCategory }: { initial: ShopInitial; lockedCategory?: Category }) {
  const [cat, setCat] = useState<Category | "tous">(lockedCategory ?? initial.categorie ?? "tous");
  const [season, setSeason] = useState<SeasonId | "toutes">(initial.saison ?? "toutes");
  const [profils, setProfils] = useState<Profile[]>(initial.profils ?? []);
  const [q, setQ] = useState(initial.q ?? "");
  const [sort, setSort] = useState<Sort>("selection");
  const [panel, setPanel] = useState(false);
  const reduce = useReducedMotion();

  // l'URL reflète les filtres (partageable, retour arrière cohérent)
  useEffect(() => {
    if (lockedCategory) return;
    const sp = new URLSearchParams();
    if (cat !== "tous") sp.set("categorie", cat);
    if (season !== "toutes") sp.set("saison", season);
    if (profils.length) sp.set("profils", profils.join(","));
    if (q.trim()) sp.set("q", q.trim());
    const qs = sp.toString();
    window.history.replaceState(null, "", qs ? `?${qs}` : window.location.pathname);
  }, [cat, season, profils, q, lockedCategory]);

  const list = useMemo(() => {
    let l = products.filter((p) => (cat === "tous" ? true : p.category === cat));
    if (season !== "toutes") l = l.filter((p) => p.season === season);
    if (profils.length) l = l.filter((p) => profils.some((x) => p.profiles.includes(x)));
    if (q.trim()) l = l.filter((p) => matches(productHaystack(p), q));
    const price = (p: (typeof l)[number]) => (p.status === "a-venir" ? Infinity : startingPrice(p).price);
    if (sort === "prix-asc") l = [...l].sort((a, b) => price(a) - price(b));
    if (sort === "prix-desc") l = [...l].sort((a, b) => (price(b) === Infinity ? -1 : price(a) === Infinity ? 1 : price(b) - price(a)));
    if (sort === "nom") l = [...l].sort((a, b) => a.name.localeCompare(b.name, "fr"));
    return l;
  }, [cat, season, profils, q, sort]);

  const active = (cat !== "tous" && !lockedCategory ? 1 : 0) + (season !== "toutes" ? 1 : 0) + profils.length + (q.trim() ? 1 : 0);
  const reset = () => {
    if (!lockedCategory) setCat("tous");
    setSeason("toutes");
    setProfils([]);
    setQ("");
  };

  const filters = (
    <div className="space-y-8">
      {!lockedCategory && (
        <fieldset>
          <legend className="mention mb-3 text-accent">Gamme</legend>
          <div className="flex flex-wrap gap-2">
            {CATS.map((c) => (
              <Chip key={c.id} on={cat === c.id} onClick={() => setCat(c.id)}>
                {c.label}
              </Chip>
            ))}
          </div>
        </fieldset>
      )}
      <fieldset>
        <legend className="mention mb-3 text-accent">Saison</legend>
        <div className="flex flex-wrap gap-2">
          <Chip on={season === "toutes"} onClick={() => setSeason("toutes")}>
            Toutes
          </Chip>
          {seasons.map((s) => (
            <Chip key={s.id} on={season === s.id} onClick={() => setSeason(s.id)}>
              <span className="inline-flex items-center gap-2">
                <span className="h-2 w-2 rounded-full" style={{ background: s.accent }} aria-hidden />
                {s.name}
              </span>
            </Chip>
          ))}
        </div>
      </fieldset>
      <fieldset>
        <legend className="mention mb-3 text-accent">Profil gustatif</legend>
        <div className="flex flex-wrap gap-2">
          {(Object.entries(profileLabels) as [Profile, string][]).map(([id, label]) => (
            <Chip key={id} on={profils.includes(id)} onClick={() => setProfils((p) => (p.includes(id) ? p.filter((x) => x !== id) : [...p, id]))}>
              {label}
            </Chip>
          ))}
        </div>
      </fieldset>
    </div>
  );

  return (
    <div className="shell pb-28">
      {/* barre d'outils */}
      <div className="sticky top-[var(--header-h)] z-30 -mx-[var(--gutter)] border-y border-ink-soft/10 bg-paper/95 px-[var(--gutter)] py-3 backdrop-blur">
        <div className="flex flex-wrap items-center gap-3">
          <label className="relative flex min-w-0 flex-1 items-center sm:max-w-sm">
            <span className="sr-only">Rechercher dans la boutique</span>
            <Search className="pointer-events-none absolute left-0 h-4 w-4 text-ink-soft/60" strokeWidth={1.5} />
            <input
              type="search"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Rechercher une saveur…"
              className="champ py-2 pl-7"
            />
          </label>
          <button type="button" onClick={() => setPanel((v) => !v)} aria-expanded={panel} aria-controls="filtres" className="inline-flex min-h-10 items-center gap-2 border border-ink-soft/25 px-3.5 text-sm hover:border-ink-soft">
            <SlidersHorizontal className="h-4 w-4" strokeWidth={1.5} />
            Filtres{active ? ` (${active})` : ""}
          </button>
          <label className="ml-auto flex items-center gap-2 text-sm">
            <span className="hidden text-ink-soft/70 md:inline">Trier</span>
            <select value={sort} onChange={(e) => setSort(e.target.value as Sort)} className="min-h-10 border border-ink-soft/25 bg-transparent px-3 text-sm">
              {SORTS.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.label}
                </option>
              ))}
            </select>
          </label>
        </div>
        <AnimatePresence initial={false}>
          {panel && (
            <motion.div
              id="filtres"
              initial={reduce ? { opacity: 0 } : { height: 0, opacity: 0 }}
              animate={reduce ? { opacity: 1 } : { height: "auto", opacity: 1 }}
              exit={reduce ? { opacity: 0 } : { height: 0, opacity: 0 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="overflow-hidden"
            >
              <div className="max-h-[60vh] overflow-y-auto py-6">{filters}</div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="mt-8 flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-ink-soft/75" aria-live="polite">
          {list.length} création{list.length > 1 ? "s" : ""}
          {active > 0 && " correspondant à vos filtres"}
        </p>
        {active > 0 && (
          <button type="button" onClick={reset} className="inline-flex items-center gap-1.5 text-sm underline-offset-4 hover:underline">
            <X className="h-3.5 w-3.5" /> Effacer les filtres
          </button>
        )}
      </div>

      {list.length === 0 ? (
        <div className="mt-16 max-w-lg">
          <p className="font-serif text-3xl">Aucune création ne correspond à cette recherche.</p>
          <p className="mt-3 text-ink-soft/80">Essayez une saison, un fruit ou une épice, ou effacez les filtres pour revoir toute la collection.</p>
          <button type="button" onClick={reset} className="btn btn-encre mt-8">
            Voir toute la collection
          </button>
        </div>
      ) : (
        <motion.ul layout={!reduce} className="mt-8 grid grid-cols-1 gap-x-6 gap-y-14 xs:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          <AnimatePresence mode="popLayout" initial={false}>
            {list.map((p) => (
              <motion.li
                key={p.slug}
                layout={!reduce}
                initial={reduce ? false : { opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.96, transition: { duration: 0.25 } }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                className="flex"
              >
                <ProductCard product={p} className="w-full" />
              </motion.li>
            ))}
          </AnimatePresence>
        </motion.ul>
      )}
    </div>
  );
}

"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { getProduct, purchasable } from "@/data/products";
import type { Format, Product } from "@/lib/types";

/* ──────────────────────────────────────────────────────────────
   Panier & favoris — stockage local uniquement (démonstration).
   Aucune donnée n'est envoyée à un serveur.
   ────────────────────────────────────────────────────────────── */

export interface CartLine {
  slug: string;
  formatId: string;
  qty: number;
}

export interface ResolvedLine extends CartLine {
  product: Product;
  format: Format;
  total: number;
}

interface StoreValue {
  ready: boolean;
  lines: ResolvedLine[];
  count: number;
  totals: { TTC: number; HT: number };
  add: (slug: string, formatId: string, qty?: number) => void;
  setQty: (slug: string, formatId: string, qty: number) => void;
  remove: (slug: string, formatId: string) => void;
  clear: () => void;
  favorites: string[];
  toggleFavorite: (slug: string) => void;
  isFavorite: (slug: string) => boolean;
  drawerOpen: boolean;
  setDrawerOpen: (v: boolean) => void;
  searchOpen: boolean;
  setSearchOpen: (v: boolean) => void;
  lastAdded: { slug: string; formatId: string; qty: number; at: number } | null;
  dismissAdded: () => void;
}

const StoreContext = createContext<StoreValue | null>(null);
const CART_KEY = "maison-sillage:panier:v1";
const FAV_KEY = "maison-sillage:favoris:v1";
const MAX_QTY = 24;

function read<T>(key: string, fallback: T): T {
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function write(key: string, value: unknown) {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* stockage indisponible (navigation privée) : le panier reste en mémoire */
  }
}

function sanitize(lines: unknown): CartLine[] {
  if (!Array.isArray(lines)) return [];
  return lines
    .filter((l): l is CartLine => !!l && typeof l === "object" && typeof (l as CartLine).slug === "string")
    .filter((l) => {
      const p = getProduct(l.slug);
      return !!p && purchasable(p) && p.formats.some((f) => f.id === l.formatId);
    })
    .map((l) => ({ ...l, qty: Math.min(MAX_QTY, Math.max(1, Math.round(Number(l.qty) || 1))) }));
}

export function StoreProvider({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(false);
  const [raw, setRaw] = useState<CartLine[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [lastAdded, setLastAdded] = useState<StoreValue["lastAdded"]>(null);
  const hydrated = useRef(false);

  useEffect(() => {
    setRaw(sanitize(read(CART_KEY, [])));
    setFavorites(read<string[]>(FAV_KEY, []).filter((s) => typeof s === "string" && !!getProduct(s)));
    hydrated.current = true;
    setReady(true);
    const onStorage = (e: StorageEvent) => {
      if (e.key === CART_KEY) setRaw(sanitize(read(CART_KEY, [])));
      if (e.key === FAV_KEY) setFavorites(read<string[]>(FAV_KEY, []));
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  useEffect(() => {
    if (hydrated.current) write(CART_KEY, raw);
  }, [raw]);
  useEffect(() => {
    if (hydrated.current) write(FAV_KEY, favorites);
  }, [favorites]);

  const add = useCallback((slug: string, formatId: string, qty = 1) => {
    const p = getProduct(slug);
    if (!p || !purchasable(p) || !p.formats.some((f) => f.id === formatId)) return;
    setRaw((prev) => {
      const found = prev.find((l) => l.slug === slug && l.formatId === formatId);
      if (found) return prev.map((l) => (l === found ? { ...l, qty: Math.min(MAX_QTY, l.qty + qty) } : l));
      return [...prev, { slug, formatId, qty: Math.min(MAX_QTY, qty) }];
    });
    setLastAdded({ slug, formatId, qty, at: Date.now() });
  }, []);

  const setQty = useCallback((slug: string, formatId: string, qty: number) => {
    setRaw((prev) =>
      qty <= 0
        ? prev.filter((l) => !(l.slug === slug && l.formatId === formatId))
        : prev.map((l) => (l.slug === slug && l.formatId === formatId ? { ...l, qty: Math.min(MAX_QTY, qty) } : l)),
    );
  }, []);

  const remove = useCallback((slug: string, formatId: string) => {
    setRaw((prev) => prev.filter((l) => !(l.slug === slug && l.formatId === formatId)));
  }, []);

  const clear = useCallback(() => setRaw([]), []);

  const toggleFavorite = useCallback((slug: string) => {
    setFavorites((prev) => (prev.includes(slug) ? prev.filter((s) => s !== slug) : [...prev, slug]));
  }, []);

  const value = useMemo<StoreValue>(() => {
    const lines: ResolvedLine[] = raw.flatMap((l) => {
      const product = getProduct(l.slug);
      const format = product?.formats.find((f) => f.id === l.formatId);
      if (!product || !format) return [];
      return [{ ...l, product, format, total: Math.round(format.price * l.qty * 100) / 100 }];
    });
    const totals = lines.reduce(
      (acc, l) => {
        acc[l.format.tax] = Math.round((acc[l.format.tax] + l.total) * 100) / 100;
        return acc;
      },
      { TTC: 0, HT: 0 },
    );
    return {
      ready,
      lines,
      count: lines.reduce((n, l) => n + l.qty, 0),
      totals,
      add,
      setQty,
      remove,
      clear,
      favorites,
      toggleFavorite,
      isFavorite: (slug) => favorites.includes(slug),
      drawerOpen,
      setDrawerOpen,
      searchOpen,
      setSearchOpen,
      lastAdded,
      dismissAdded: () => setLastAdded(null),
    };
  }, [raw, ready, favorites, drawerOpen, searchOpen, lastAdded, add, setQty, remove, clear, toggleFavorite]);

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore doit être utilisé dans <StoreProvider>");
  return ctx;
}

"use client";

import { useReducedMotion } from "@/lib/useReduced";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Heart, Search, ShoppingBag, Menu } from "lucide-react";
import { mainNav } from "@/data/navigation";
import { useStore } from "@/lib/store";
import { cn } from "@/lib/utils";
import { Logo, Emblem } from "@/components/ui/Logo";
import { EASE } from "@/components/animations";
import { MobileMenu } from "./MobileMenu";
import { AddedNotice } from "@/components/cart/AddedNotice";
import { AmbianceSwitcher } from "@/components/ambiance/AmbianceSwitcher";

const LEFT = mainNav.slice(0, 5);
const RIGHT = mainNav.slice(5);

function NavLink({ href, label, photo }: { href: string; label: string; photo: boolean }) {
  const pathname = usePathname();
  const active = href === "/" ? pathname === "/" : pathname.startsWith(href);
  return (
    <Link
      href={href}
      aria-current={active ? "page" : undefined}
      className={cn(
        "lien-revele font-serif text-[1.04rem] leading-none tracking-[0.01em] transition-colors duration-500 2xl:text-[1.1rem]",
        photo ? "text-[#fff9ef]/90 hover:text-[#fff9ef]" : "text-ink/85 hover:text-ink",
      )}
    >
      {label}
    </Link>
  );
}

export function Header() {
  const pathname = usePathname();
  const { count, ready, favorites, setDrawerOpen, setSearchOpen } = useStore();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const reduce = useReducedMotion();
  const isHome = pathname === "/";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setMenuOpen(false), [pathname]);

  const compact = scrolled || !isHome;
  const photo = !compact;
  const iconCls = cn(
    "grid h-11 w-11 place-items-center rounded-full transition duration-500",
    photo ? "text-[#fff9ef] hover:bg-white/10" : "text-ink/85 hover:bg-ink/5 hover:text-ink",
  );

  const icons = (
    <div className="flex items-center gap-0.5">
      <AmbianceSwitcher tone={photo ? "photo" : "ink"} />
      <button type="button" onClick={() => setSearchOpen(true)} className={iconCls} aria-label="Rechercher">
        <Search className="h-[19px] w-[19px]" strokeWidth={1.4} />
      </button>
      <Link
        href="/favoris"
        className={cn(iconCls, "relative hidden sm:grid")}
        aria-label={`Favoris${ready && favorites.length ? ` (${favorites.length})` : ""}`}
      >
        <Heart className="h-[19px] w-[19px]" strokeWidth={1.4} />
        {ready && favorites.length > 0 && <span className="absolute right-2.5 top-2.5 h-1.5 w-1.5 rounded-full bg-accent" aria-hidden />}
      </Link>
      <div className="relative">
        <button
          type="button"
          onClick={() => setDrawerOpen(true)}
          className={cn(iconCls, "relative")}
          aria-label={`Panier, ${ready ? count : 0} article${count > 1 ? "s" : ""}`}
        >
          <ShoppingBag className="h-[19px] w-[19px]" strokeWidth={1.4} />
          <AnimatePresence>
            {ready && count > 0 && (
              <motion.span
                key={count}
                initial={reduce ? false : { scale: 0.4, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.4, opacity: 0 }}
                transition={{ duration: 0.45, ease: EASE }}
                className="absolute right-0.5 top-0.5 grid h-[18px] min-w-[18px] place-items-center rounded-full bg-gold px-1 text-[10px] font-semibold tabular-nums text-[#1e140d]"
              >
                {count}
              </motion.span>
            )}
          </AnimatePresence>
        </button>
        <AddedNotice />
      </div>
    </div>
  );

  return (
    <>
      <a href="#contenu" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[80] focus:bg-surface focus:px-4 focus:py-2">
        Aller au contenu
      </a>
      <header
        className={cn(
          "fixed inset-x-0 top-0 z-50 transition-[background-color,box-shadow,backdrop-filter] duration-500",
          compact ? "bg-paper/92 shadow-[0_1px_0_color-mix(in_oklab,var(--a-ink)_12%,transparent)] backdrop-blur-md" : "bg-transparent",
        )}
      >
        <div className="shell relative flex h-[var(--header-h)] items-center justify-between">
          {/* mobile / tablette */}
          <button
            type="button"
            className={cn(iconCls, "-ml-2 xl:hidden")}
            onClick={() => setMenuOpen(true)}
            aria-label="Ouvrir le menu"
            aria-expanded={menuOpen}
            aria-controls="menu-mobile"
          >
            <Menu className="h-5 w-5" strokeWidth={1.4} />
          </button>

          <nav aria-label="Navigation principale, première partie" className="hidden flex-1 items-center gap-6 xl:flex 2xl:gap-9">
            {LEFT.map((l) => (
              <NavLink key={l.href} {...l} photo={photo} />
            ))}
          </nav>

          {/* logo : complet en haut de l'accueil, emblème une fois la page défilée */}
          <Link
            href="/"
            aria-label="Maison Sillage, accueil"
            className="absolute left-1/2 top-0 flex h-[var(--header-h)] w-[96px] -translate-x-1/2 items-center justify-center sm:w-[116px] xl:w-[128px] 2xl:w-[146px]"
          >
            <motion.div
              className="absolute inset-x-0 top-0 pt-3"
              initial={isHome && !reduce ? { opacity: 0, y: -14, scale: 0.96 } : false}
              animate={compact ? { opacity: 0, y: -24, scale: 0.86 } : { opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: compact ? 0.6 : 1.1, ease: EASE }}
              style={{ pointerEvents: compact ? "none" : "auto", transformOrigin: "top center" }}
            >
              <Logo tone={photo ? "sombre" : "clair"} priority sizes="(min-width:1280px) 146px, 116px" />
            </motion.div>
            <motion.div
              className="w-[44px]"
              initial={false}
              animate={compact ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.6, ease: EASE }}
              aria-hidden
            >
              <Emblem sizes="44px" className="only-clair" />
              <Emblem tone="sombre" sizes="44px" className="only-nuit" />
            </motion.div>
          </Link>

          <div className="flex flex-1 items-center justify-end gap-5 2xl:gap-8">
            <nav aria-label="Navigation principale, seconde partie" className="hidden items-center gap-6 xl:flex 2xl:gap-9">
              {RIGHT.map((l) => (
                <NavLink key={l.href} {...l} photo={photo} />
              ))}
            </nav>
            <span className={cn("hidden h-5 w-px xl:block", photo ? "bg-white/30" : "bg-ink/20")} aria-hidden />
            <div className="-mr-2">{icons}</div>
          </div>
        </div>
      </header>
      <MobileMenu open={menuOpen} onClose={() => setMenuOpen(false)} />
    </>
  );
}

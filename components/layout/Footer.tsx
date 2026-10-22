import Link from "next/link";
import { footerNav } from "@/data/navigation";
import { Logo } from "@/components/ui/Logo";
import { NewsletterForm } from "@/components/ui/NewsletterForm";

const COLS = [
  {
    title: "Explorer",
    links: [
      { href: "/boutique", label: "La boutique" },
      { href: "/collections", label: "Les collections" },
      { href: "/recettes", label: "Les recettes" },
      { href: "/professionnels", label: "Professionnels" },
    ],
  },
  { title: "La Maison", links: footerNav.maison },
  { title: "Aide", links: footerNav.aide },
];

export function Footer() {
  return (
    <footer className="relative isolate overflow-hidden bg-deep text-on-deep/85">
      {/* éclairage d'ambiance : il suit la lumière choisie */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 opacity-70"
        style={{
          background:
            "radial-gradient(55% 60% at 18% 0%, color-mix(in oklab, var(--a-glow) 30%, transparent), transparent 70%), radial-gradient(40% 50% at 85% 100%, color-mix(in oklab, var(--a-accent) 22%, transparent), transparent 70%)",
          transition: "background 1.1s",
        }}
      />
      <div className="shell grid gap-16 pb-14 pt-24 lg:grid-cols-12 lg:pt-32">
        <div className="lg:col-span-5">
          <Link href="/" className="block w-[200px] sm:w-[240px]" aria-label="Maison Sillage, accueil">
            <Logo tone="sombre" sizes="240px" />
          </Link>
          <p className="mt-10 font-serif text-[clamp(2rem,3.4vw,3.2rem)] italic leading-[1.05] text-on-deep">L&apos;empreinte d&apos;une saveur.</p>
        </div>
        <div className="lg:col-span-6 lg:col-start-7">
          <p className="font-serif text-2xl text-on-deep">La lettre de saison</p>
          <p className="mt-2 max-w-md text-sm text-on-deep/65">Quatre lettres par an : les nouvelles créations, une recette, une histoire de voyage.</p>
          <div className="mt-6">
            <NewsletterForm tone="sombre" id="lettre-pied" />
          </div>
          <div className="mt-14 grid grid-cols-2 gap-10 sm:grid-cols-3">
            {COLS.map((c) => (
              <nav key={c.title} aria-label={c.title}>
                <h2 className="mention text-gold">{c.title}</h2>
                <ul className="mt-5 space-y-3 text-[0.95rem]">
                  {c.links.map((l) => (
                    <li key={l.href}>
                      <Link href={l.href} className="lien-revele hover:text-on-deep">
                        {l.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
            ))}
          </div>
        </div>
      </div>
      <div className="shell">
        <div className="border-t border-on-deep/15 py-6 text-[0.8rem] leading-relaxed text-on-deep/60">
          <p className="max-w-3xl">
            <strong className="font-semibold text-on-deep/90">Site de démonstration précommerciale.</strong> Maison Sillage est un projet en phase de conception :
            les produits, photographies de mise en scène, prix et disponibilités présentés sont fictifs. Aucune vente ni aucun paiement n&apos;est possible.
          </p>
          <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p>Maison Sillage · L&apos;empreinte d&apos;une saveur</p>
            <ul className="flex flex-wrap gap-x-6 gap-y-2">
              {footerNav.legal.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="hover:text-on-deep">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
}

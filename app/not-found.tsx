import type { Metadata } from "next";
import Link from "next/link";
import { WakeStroke } from "@/components/animations";

export const metadata: Metadata = { title: "Page introuvable", robots: { index: false } };

export default function NotFound() {
  return (
    <section className="shell flex min-h-[80vh] flex-col items-start justify-center pt-[var(--header-h)]">
      <WakeStroke className="w-56 text-accent" />
      <p className="mention mt-8 text-accent">Page introuvable</p>
      <h1 className="display mt-4 text-[clamp(2.8rem,6vw,5.6rem)]">Ce cap ne mène nulle part.</h1>
      <p className="chapo mt-6 text-ink-soft">La page que vous cherchez a peut-être changé d&apos;adresse, ou n&apos;a jamais existé. Reprenons la route.</p>
      <div className="mt-10 flex flex-wrap gap-3">
        <Link href="/" className="btn btn-encre">
          Revenir à l&apos;accueil
        </Link>
        <Link href="/boutique" className="btn btn-trait">
          Parcourir la boutique
        </Link>
      </div>
    </section>
  );
}

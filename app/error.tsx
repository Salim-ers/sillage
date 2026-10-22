"use client";

import Link from "next/link";

export default function Erreur({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <section className="shell flex min-h-[70vh] flex-col items-start justify-center pt-[var(--header-h)]">
      <p className="mention text-accent">Incident de traversée</p>
      <h1 className="display mt-4 text-[clamp(2.6rem,5.6vw,5rem)]">Cette page n&apos;a pas pu s&apos;afficher.</h1>
      <p className="chapo mt-6 text-ink-soft">Un problème technique a interrompu le chargement. Réessayez ; si cela persiste, revenez à l&apos;accueil.</p>
      <div className="mt-10 flex flex-wrap gap-3">
        <button type="button" onClick={reset} className="btn btn-encre">
          Réessayer
        </button>
        <Link href="/" className="btn btn-trait">
          Revenir à l&apos;accueil
        </Link>
      </div>
    </section>
  );
}

import type { Metadata } from "next";
import Link from "next/link";
import { PageIntro, DemoBanner } from "@/components/ui/PageIntro";
import { NewsletterForm } from "@/components/ui/NewsletterForm";

export const metadata: Metadata = { title: "Nous écrire", description: "Contacter Maison Sillage, projet en phase de conception.", alternates: { canonical: "/contact" } };

export default function Contact() {
  return (
    <>
      <PageIntro kicker="Contact" title="Nous écrire.">
        La Maison n&apos;a pas encore d&apos;adresse de contact publique. Voici comment suivre le projet en attendant.
      </PageIntro>
      <div className="shell grid max-w-5xl gap-14 pb-28 md:grid-cols-2">
        <section>
          <h2 className="font-serif text-3xl">Vous êtes un établissement</h2>
          <p className="mt-4 text-ink-soft/85">Le formulaire de l&apos;espace professionnels vous permet de décrire votre projet (démonstration, sans envoi pour l&apos;instant).</p>
          <Link href="/professionnels#demande" className="btn btn-encre mt-8">
            Formulaire professionnel
          </Link>
        </section>
        <section>
          <h2 className="font-serif text-3xl">Suivre le projet</h2>
          <p className="mt-4 text-ink-soft/85">Inscrivez-vous à la lettre de saison de démonstration.</p>
          <div className="mt-6">
            <NewsletterForm id="lettre-contact" />
          </div>
        </section>
        <DemoBanner className="md:col-span-2">Coordonnées de contact (adresse e-mail, téléphone, adresse postale) à compléter avant commercialisation.</DemoBanner>
      </div>
    </>
  );
}

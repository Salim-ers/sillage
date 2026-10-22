import type { Metadata } from "next";
import Link from "next/link";
import { PageIntro, DemoBanner } from "@/components/ui/PageIntro";
import { Photo } from "@/components/ui/Photo";
import { RevealTitle, Rise } from "@/components/animations";
import type { PhotoKey } from "@/data/images";

export const metadata: Metadata = {
  title: "Savoir-faire",
  description: "De l'inspiration à la future fabrication : la démarche de création de Maison Sillage, projet en phase de conception.",
  alternates: { canonical: "/savoir-faire" },
};

const STEPS: { title: string; text: string; icon: PhotoKey }[] = [
  { title: "Inspiration", text: "Un souvenir, une saison, une matière croisée en voyage : chaque création commence par une image notée dans le carnet de bord.", icon: "voilierCouchant" },
  { title: "Association gustative", text: "Nous cherchons l'accord : un fruit et une pâtisserie, une épice et une fleur. L'association doit fonctionner dans plusieurs boissons.", icon: "fleursBlanches" },
  { title: "Prototype", text: "Les premières versions sont préparées en petites quantités, pour vérifier que l'idée tient ses promesses.", icon: "quatreSirops" },
  { title: "Dégustation", text: "Chaque prototype est goûté dans un latte, une boisson glacée, un chocolat : c'est l'usage qui juge la saveur.", icon: "icedLattePoire" },
  { title: "Amélioration", text: "Équilibre du sucre, intensité, longueur en bouche : on ajuste, on recommence, jusqu'à ce que la finale s'attarde juste assez.", icon: "peches" },
  { title: "Future fabrication", text: "L'étape à venir : choisir les filières, les partenaires et le mode de production. Rien n'est encore arrêté.", icon: "quatrePoudres" },
];

export default function SavoirFaire() {
  return (
    <>
      <PageIntro kicker="Savoir-faire" title="De l'idée à la tasse, pas à pas." aside={<Photo k="cannelle" ratio="aspect-[4/3]" reveal="right" priority sizes="(min-width:1024px) 40vw, 100vw" />}>
        Voici la démarche que nous suivons pour imaginer nos créations. Le projet est en phase de conception : les dernières étapes restent
        devant nous.
      </PageIntro>

      <section className="shell pb-24" aria-labelledby="etapes-titre">
        <h2 id="etapes-titre" className="sr-only">
          Les étapes de création
        </h2>
        <ol className="relative">
          <span className="absolute bottom-6 left-[2.2rem] top-6 hidden w-px bg-deep-2/20 md:block" aria-hidden />
          {STEPS.map((s, i) => {
            const done = i < 4;
            return (
              <Rise as="li" key={s.title} className="relative grid gap-6 border-b border-ink-soft/12 py-10 md:grid-cols-[4.5rem_1fr_9rem] md:items-center md:gap-10">
                <span className={`relative z-10 grid h-[4.4rem] w-[4.4rem] place-items-center rounded-full border font-serif text-2xl ${done ? "border-ink-soft bg-deep-2 text-on-deep" : "border-ink-soft/40 bg-paper text-ink-soft"}`}>
                  {i + 1}
                </span>
                <div>
                  <h3 className="font-serif text-[2rem] leading-tight">{s.title}</h3>
                  <p className="mt-2 max-w-2xl text-ink-soft/85">{s.text}</p>
                  <p className="mt-3 text-[0.72rem] uppercase tracking-[0.16em] text-accent">{done ? "Étape en cours de travail" : "Étape à venir"}</p>
                </div>
                <div className="hidden h-28 w-36 md:block">
                  <Photo k={s.icon} reveal={false} sizes="150px" />
                </div>
              </Rise>
            );
          })}
        </ol>
        <DemoBanner className="mt-12 max-w-3xl">
          Nous ne présentons ni atelier, ni usine, ni partenaire industriel : ils n&apos;existent pas encore. Les informations de fabrication
          seront publiées lorsqu&apos;elles seront établies.
        </DemoBanner>
      </section>

      <section className="bg-deep py-24 text-on-deep">
        <div className="shell grid gap-10 md:grid-cols-2 md:items-end">
          <RevealTitle text="Vous êtes un établissement et souhaitez suivre le projet ?" className="titre" />
          <Rise>
            <p className="text-on-deep/80">Nous préparons une offre pour les professionnels : formats adaptés, recettes signatures, échantillons envisagés.</p>
            <Link href="/professionnels" className="btn btn-clair mt-8">
              Espace professionnels
            </Link>
          </Rise>
        </div>
      </section>
    </>
  );
}

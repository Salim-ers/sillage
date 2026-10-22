import Link from "next/link";
import { Photo } from "@/components/ui/Photo";
import { RevealTitle, Rise, WakeStroke } from "@/components/animations";

/* Section 5 — retour au large : l'histoire de la Maison */
export function Histoire() {
  return (
    <section className="relative overflow-hidden bg-paper py-24 md:py-36" aria-labelledby="histoire-titre">
      <div className="shell grid gap-12 lg:grid-cols-12 lg:gap-x-10">
        <div className="lg:col-span-8">
          <Photo k="terrasseVoilier" ratio="aspect-[16/10]" parallax={7} reveal="left" sizes="(min-width:1024px) 62vw, 100vw" />
        </div>
        <div className="flex flex-col justify-end lg:col-span-4">
          <Rise>
            <blockquote className="font-serif text-[clamp(1.6rem,2.3vw,2.2rem)] italic leading-snug text-ink">
              « Une saveur passe, son sillage demeure. »
            </blockquote>
          </Rise>
          <div className="mt-10 w-2/3 self-end lg:w-full">
            <Photo k="lanterneJasmin" ratio="aspect-[4/5]" parallax={5} reveal="right" sizes="(min-width:1024px) 26vw, 60vw" />
          </div>
        </div>
      </div>
      <div className="shell mt-16 grid gap-10 md:mt-24 lg:grid-cols-12">
        <div className="lg:col-span-6">
          <p className="mention text-accent">Notre histoire</p>
          <RevealTitle id="histoire-titre" text="Chaque grande histoire commence par un voyage." className="titre mt-4 max-w-[14ch]" />
        </div>
        <div className="lg:col-span-5 lg:col-start-8 lg:pt-14">
          <Rise>
            <p className="chapo text-ink-soft">
              « Un sillage est la trace qu&apos;un navire laisse derrière lui. Maison Sillage s&apos;inspire de cette empreinte pour imaginer des saveurs qui
              prolongent l&apos;expérience et restent en mémoire. »
            </p>
            <p className="mt-5 text-sm text-ink-soft/80">
              Une jeune maison, en phase de conception : nous empruntons aux grands voyages un imaginaire, pas un héritage.
            </p>
            <Link href="/maison" className="btn btn-encre mt-9">
              Notre histoire
            </Link>
          </Rise>
        </div>
      </div>
      <WakeStroke className="pointer-events-none absolute -left-24 bottom-16 hidden w-[34rem] text-gold/60 lg:block" />
    </section>
  );
}

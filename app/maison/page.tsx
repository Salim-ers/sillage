import type { Metadata } from "next";
import Link from "next/link";
import { DemoBanner } from "@/components/ui/PageIntro";
import { Photo } from "@/components/ui/Photo";
import { seasons } from "@/data/collections";
import { RevealTitle, Rise, WakeStroke, DrawRule } from "@/components/animations";

export const metadata: Metadata = {
  title: "Notre Maison",
  description: "L'origine du mot sillage, l'empreinte des saveurs, les voyages qui nous inspirent : l'histoire d'une jeune maison de créations aromatiques.",
  alternates: { canonical: "/maison" },
};

export default function Maison() {
  return (
    <>
      <header className="relative isolate flex min-h-[100svh] items-end overflow-hidden bg-[#140e0a] pb-16 text-[#fff9ef] md:pb-24">
        <div className="absolute inset-0 -z-10">
          <Photo k="voilierCouchant" reveal={false} priority parallax={6} sizes="100vw" />
          <div className="absolute inset-0 bg-[linear-gradient(15deg,rgba(12,8,5,.8)_0%,rgba(12,8,5,.35)_45%,rgba(12,8,5,0)_70%)]" />
        </div>
        <div className="shell">
          <p className="hero-fondu mention text-[#f1dfbd]">Notre Maison</p>
          <RevealTitle as="h1" text="La trace qu'une saveur laisse derrière elle." immediate delay={0.15} className="display mt-5 max-w-[13ch] text-[clamp(2.9rem,6.8vw,7rem)] text-[#fff9ef]" />
          <p className="hero-fondu mt-6 max-w-xl text-[1.05rem] leading-relaxed text-[#fff9ef]/85" style={{ animationDelay: ".5s" }}>
            Maison Sillage est une jeune maison française de créations aromatiques, en phase de conception. Son esthétique emprunte au XIXe siècle ;
            son histoire, elle, commence aujourd&apos;hui.
          </p>
        </div>
      </header>

      {/* 1 — le mot */}
      <section className="shell grid gap-14 py-20 md:py-28 lg:grid-cols-12" aria-labelledby="mot-titre">
        <div className="lg:col-span-5">
          <p className="mention text-accent">L&apos;origine du mot</p>
          <RevealTitle id="mot-titre" text="Un navire, un parfum." className="titre mt-4" />
        </div>
        <div className="space-y-6 text-[1.08rem] leading-relaxed text-ink-soft lg:col-span-6 lg:col-start-7">
          <Rise>
            <p className="lettrine">
              Le sillage, c&apos;est d&apos;abord la trace qu&apos;un bateau laisse derrière lui sur l&apos;eau : une ligne d&apos;écume qui
              s&apos;élargit puis s&apos;efface lentement, longtemps après le passage du navire.
            </p>
          </Rise>
          <Rise>
            <p>
              Les parfumeurs ont emprunté le mot pour désigner l&apos;empreinte qu&apos;un parfum laisse dans l&apos;air. On ne voit plus
              la personne, mais on sait qu&apos;elle est passée.
            </p>
          </Rise>
          <Rise>
            <p>
              Nous avons voulu transposer cette image dans l&apos;univers du goût. Une boisson réussie ne s&apos;arrête pas à la dernière
              gorgée : elle laisse un souvenir, une note qui revient. C&apos;est cela, pour nous, l&apos;empreinte d&apos;une saveur.
            </p>
          </Rise>
        </div>
      </section>

      <div className="py-6">
        <Photo k="quaiLanterne" ratio="aspect-[16/9] md:aspect-[21/9]" parallax={7} reveal="left" sizes="100vw" />
      </div>

      {/* 2 — l'empreinte */}
      <section className="bg-deep py-24 text-on-deep md:py-32" aria-labelledby="empreinte-titre">
        <div className="shell max-w-5xl text-center">
          <WakeStroke className="mx-auto w-56 text-gold" />
          <RevealTitle id="empreinte-titre" text="Ce qui reste, après la dernière gorgée." className="titre mt-8" />
          <Rise>
            <p className="chapo mx-auto mt-8 text-on-deep/80">
              Comme un parfum, chacune de nos créations est pensée en trois temps : une ouverture franche, souvent fruitée ; un cœur
              gourmand ou floral ; une finale qui s&apos;attarde. C&apos;est cette finale que nous travaillons le plus longtemps.
            </p>
          </Rise>
          <div className="mt-16 grid gap-10 text-left md:grid-cols-3">
            {[
              ["L'ouverture", "La première impression : la fraise, la pêche, la poire. Lisible dès la première gorgée."],
              ["Le cœur", "Ce qui donne du corps : le biscuit, la crème brûlée, la fleur d'oranger."],
              ["Le sillage", "Ce qui reste : une vanille, un caramel, une épice douce qui prolonge le souvenir."],
            ].map(([t, d], i) => (
              <Rise key={t} delay={i * 0.1} className="border-t border-on-deep/20 pt-6">
                <h3 className="font-serif text-2xl text-gold">{t}</h3>
                <p className="mt-3 text-on-deep/80">{d}</p>
              </Rise>
            ))}
          </div>
        </div>
      </section>

      {/* 3 — voyages & 4 — associations */}
      <section className="shell grid gap-16 py-24 md:py-32 lg:grid-cols-12" aria-labelledby="voyages-titre">
        <div className="lg:col-span-5">
          <div className="grid grid-cols-2 gap-4">
            <Photo k="cannelle" ratio="aspect-[3/4]" reveal="bottom" parallax={4} sizes="(min-width:1024px) 20vw, 45vw" />
            <Photo k="poires" ratio="aspect-[3/4]" reveal="bottom" className="mt-16" sizes="(min-width:1024px) 20vw, 45vw" />
          </div>
          <p className="mt-3 font-serif text-[0.95rem] italic text-ink-soft/80">Des matières qui ont voyagé avant d&apos;arriver dans la tasse.</p>
        </div>
        <div className="lg:col-span-6 lg:col-start-7">
          <p className="mention text-accent">Les voyages et la découverte aromatique</p>
          <RevealTitle id="voyages-titre" text="Des saveurs qui ont traversé des océans." className="titre mt-4" />
          <Rise>
            <p className="mt-8 text-[1.05rem] leading-relaxed text-ink-soft">
              La vanille, le cacao, la cannelle, la fleur d&apos;oranger : beaucoup des saveurs qui nous semblent familières ont voyagé
              longtemps avant d&apos;arriver dans nos tasses. Les anciennes routes maritimes, les comptoirs et les carnets de bord nous
              offrent un imaginaire, une manière de raconter les associations que nous composons.
            </p>
          </Rise>
          <DrawRule className="my-12" />
          <h3 className="sous-titre">La recherche d&apos;associations gourmandes</h3>
          <Rise>
            <p className="mt-5 text-[1.05rem] leading-relaxed text-ink-soft">
              Chaque création naît d&apos;une rencontre : un fruit et une pâtisserie, un fruit et une fleur, une épice et une douceur.
              Nous cherchons l&apos;accord qui fonctionne dans un latte comme dans une limonade, dans un chocolat comme dans un dessert.
              C&apos;est notre promesse : une seule création, plusieurs expériences.
            </p>
          </Rise>
          <Link href="/savoir-faire" className="btn btn-encre mt-10">
            Découvrir notre démarche
          </Link>
        </div>
      </section>

      {/* 5 — saisons */}
      <section className="bg-paper-2/60 py-24 md:py-32" aria-labelledby="saisons-titre">
        <div className="shell">
          <p className="mention text-accent">Les collections saisonnières</p>
          <RevealTitle id="saisons-titre" text="Quatre chapitres, une même traversée." className="titre mt-4 max-w-3xl" />
          <ol className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {seasons.map((s) => (
              <li key={s.id}>
                <Link href={`/collections#${s.id}`} className="group block h-full">
                  <Photo k={s.landscape} ratio="aspect-[4/5]" reveal="bottom" zoom sizes="(min-width:1024px) 22vw, 45vw" />
                  <span className="mt-5 block font-serif text-5xl italic" style={{ color: s.accent }}>
                    {s.numeral}
                  </span>
                  <h3 className="mt-4 font-serif text-2xl">{s.name}</h3>
                  <p className="mt-1 font-serif italic text-ink-soft/80">{s.chapter}</p>
                  <p className="mt-4 text-sm text-ink-soft/80">{s.ambiance.join(" · ")}</p>
                  <span className="lien-revele mt-6 inline-block text-sm font-semibold">Lire le chapitre</span>
                </Link>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="shell max-w-4xl py-24" aria-labelledby="honnete-titre">
        <h2 id="honnete-titre" className="sous-titre">Ce que nous sommes, et ce que nous ne sommes pas</h2>
        <DemoBanner className="mt-6">
          Maison Sillage ne revendique aucune date de fondation historique ni aucun héritage familial. L&apos;esthétique du XIXe siècle est
          un choix de style. Le projet est aujourd&apos;hui en phase de conception : les créations présentées sur ce site sont des
          prototypes et des pistes de travail, sans ateliers, partenaires ou circuits de fabrication établis à ce jour.
        </DemoBanner>
      </section>
    </>
  );
}

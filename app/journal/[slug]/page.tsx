import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { articles, getArticle } from "@/data/journal";
import { Photo } from "@/components/ui/Photo";
import { DemoBanner } from "@/components/ui/PageIntro";
import { RevealTitle, Rise, DrawRule } from "@/components/animations";

export function generateStaticParams() {
  return articles.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const a = getArticle(slug);
  if (!a) return {};
  return { title: a.title, description: a.chapo, alternates: { canonical: `/journal/${a.slug}` }, openGraph: { type: "article", title: a.title, description: a.chapo } };
}

export default async function Article({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const a = getArticle(slug);
  if (!a) notFound();
  const idx = articles.findIndex((x) => x.slug === a.slug);
  const next = articles[(idx + 1) % articles.length];
  return (
    <article>
      <header className="shell max-w-4xl pt-[calc(var(--header-h)+3.5rem)] text-center">
        <p className="mention text-accent">
          <Link href="/journal" className="hover:text-ink">
            Le Journal
          </Link>{" "}
          · {a.rubrique} · Article d&apos;exemple
        </p>
        <RevealTitle as="h1" text={a.title} immediate className="display mt-6 text-[clamp(2.6rem,5.6vw,5.4rem)]" />
        <Rise delay={0.3}>
          <p className="chapo mx-auto mt-7 text-ink-soft">{a.chapo}</p>
          <p className="mt-5 text-sm text-ink-soft/70">Lecture {a.lecture}</p>
        </Rise>
      </header>
      <div className="shell mt-14 max-w-6xl">
        <Photo k={a.image} ratio="aspect-[16/9]" priority reveal="bottom" parallax={5} sizes="(min-width:1200px) 72rem, 100vw" />
      </div>
      <div className="shell max-w-[44rem] py-16 md:py-24">
        <DemoBanner className="mb-12">Article d&apos;exemple rédigé pour la démonstration du site. Les faits historiques cités sont donnés à titre culturel.</DemoBanner>
        <div className="space-y-6 font-serif text-[1.3rem] leading-[1.7] text-ink">
          {a.body.map((b, i) =>
            b.type === "h2" ? (
              <h2 key={i} className="pt-8 font-serif text-[2rem] leading-tight">
                {b.text}
              </h2>
            ) : b.type === "quote" ? (
              <blockquote key={i} className="my-10 border-y border-accent/50 py-8 text-center text-[1.9rem] italic leading-snug text-ink-soft">
                « {b.text} »
              </blockquote>
            ) : (
              <p key={i} className={i === 0 ? "lettrine" : undefined}>
                {b.text}
              </p>
            ),
          )}
        </div>
        <DrawRule className="mt-16" />
        <Link href={`/journal/${next.slug}`} className="group mt-10 block">
          <span className="mention text-accent">Article suivant</span>
          <span className="mt-2 block font-serif text-3xl group-hover:text-ink-soft">{next.title}</span>
        </Link>
      </div>
    </article>
  );
}

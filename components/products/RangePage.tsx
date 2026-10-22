import Link from "next/link";
import type { Category } from "@/lib/types";
import type { PhotoKey } from "@/data/images";
import { Photo } from "@/components/ui/Photo";
import { ShopCatalog } from "./ShopCatalog";
import { RevealTitle, Rise } from "@/components/animations";

/** Page de gamme (sirops, poudres) : grande photographie, repères, puis catalogue filtré */
export function RangePage({
  category,
  kicker,
  title,
  intro,
  photo,
  points,
  other,
}: {
  category: Category;
  kicker: string;
  title: string;
  intro: string;
  photo: PhotoKey;
  points: { title: string; text: string }[];
  other: { href: string; label: string };
}) {
  return (
    <>
      <header className="relative isolate flex min-h-[78svh] items-end overflow-hidden bg-[#140e0a] pb-16 pt-[calc(var(--header-h)+4rem)] text-[#fff9ef] md:pb-20">
        <div className="absolute inset-0 -z-10">
          <Photo k={photo} reveal={false} priority parallax={6} sizes="100vw" />
          <div className="absolute inset-0 bg-[linear-gradient(0deg,rgba(14,9,6,.82)_0%,rgba(14,9,6,.35)_45%,rgba(14,9,6,.25)_100%)]" />
        </div>
        <div className="shell">
          <p className="hero-fondu mention text-[#f1dfbd]">{kicker}</p>
          <RevealTitle as="h1" text={title} immediate delay={0.1} className="display mt-5 max-w-[14ch] text-[clamp(2.8rem,6.6vw,6.6rem)] text-[#fff9ef]" />
          <p className="hero-fondu mt-6 max-w-xl text-[1.05rem] leading-relaxed text-[#fff9ef]/85" style={{ animationDelay: ".4s" }}>
            {intro}
          </p>
        </div>
      </header>
      <section className="shell py-16" aria-label="Repères">
        <div className="grid gap-10 md:grid-cols-3">
          {points.map((p, i) => (
            <Rise key={p.title} delay={i * 0.08} className="border-t border-ink/20 pt-6">
              <h2 className="font-serif text-2xl">{p.title}</h2>
              <p className="mt-2 text-ink-soft">{p.text}</p>
            </Rise>
          ))}
        </div>
      </section>
      <ShopCatalog initial={{}} lockedCategory={category} />
      <div className="shell -mt-12 pb-24">
        <Link href={other.href} className="lien text-sm font-semibold">
          {other.label}
        </Link>
      </div>
    </>
  );
}

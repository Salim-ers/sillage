import type { ReactNode } from "react";
import { PageIntro, DemoBanner } from "@/components/ui/PageIntro";

export function TextPage({ kicker, title, intro, notice, sections }: { kicker: string; title: string; intro?: string; notice?: ReactNode; sections: { title: string; body: ReactNode }[] }) {
  return (
    <>
      <PageIntro kicker={kicker} title={title}>
        {intro}
      </PageIntro>
      <div className="shell max-w-3xl pb-28">
        {notice && <DemoBanner className="mb-12">{notice}</DemoBanner>}
        <div className="space-y-12">
          {sections.map((s) => (
            <section key={s.title} className="border-t border-ink-soft/15 pt-8">
              <h2 className="font-serif text-3xl">{s.title}</h2>
              <div className="mt-4 space-y-4 leading-relaxed text-ink-soft">{s.body}</div>
            </section>
          ))}
        </div>
      </div>
    </>
  );
}

export const ACOMPLETER = <em className="not-italic font-semibold text-[#8a3a24]">[À compléter avant commercialisation]</em>;

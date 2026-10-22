import type { ReactNode } from "react";
import { RevealTitle, Rise } from "@/components/animations";
import { cn } from "@/lib/utils";

/** Ouverture éditoriale des pages intérieures */
export function PageIntro({
  kicker,
  title,
  children,
  aside,
  className,
  center = false,
}: {
  kicker?: string;
  title: string;
  children?: ReactNode;
  aside?: ReactNode;
  className?: string;
  center?: boolean;
}) {
  return (
    <header className={cn("shell pb-14 pt-[calc(var(--header-h)+3.5rem)] md:pb-20 md:pt-[calc(var(--header-h)+5.5rem)]", className)}>
      <div className={cn("grid gap-10", aside ? "lg:grid-cols-12 lg:items-end" : "", center && "text-center")}>
        <div className={cn(aside ? "lg:col-span-7" : "", center && "mx-auto max-w-3xl")}>
          {kicker && <p className="mention text-accent">{kicker}</p>}
          <RevealTitle as="h1" text={title} immediate delay={0.1} className="display mt-5 text-[clamp(2.7rem,6.2vw,6.2rem)]" />
          {children && (
            <Rise delay={0.35} className={cn("chapo mt-7 text-ink-soft", center && "mx-auto")}>
              {children}
            </Rise>
          )}
        </div>
        {aside && <div className="lg:col-span-5">{aside}</div>}
      </div>
    </header>
  );
}

export function DemoBanner({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div className={cn("border-l-2 border-accent bg-paper-2/60 px-5 py-4 text-sm leading-relaxed text-ink-soft", className)} role="note">
      {children}
    </div>
  );
}

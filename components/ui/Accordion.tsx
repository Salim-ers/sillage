"use client";

import { useReducedMotion } from "@/lib/useReduced";
import { useId, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Plus } from "lucide-react";

export function Accordion({ items, tone = "clair" }: { items: { q: string; a: string }[]; tone?: "clair" | "sombre" }) {
  const [open, setOpen] = useState<number | null>(null);
  const base = useId();
  const reduce = useReducedMotion();
  return (
    <div className={`divide-y border-y ${tone === "sombre" ? "divide-on-deep/15 border-on-deep/15" : "divide-ink-soft/15 border-ink-soft/15"}`}>
      {items.map((it, i) => {
        const on = open === i;
        const id = `${base}-${i}`;
        return (
          <div key={it.q}>
            <h3>
              <button
                type="button"
                aria-expanded={on}
                aria-controls={id}
                onClick={() => setOpen(on ? null : i)}
                className="flex w-full items-center justify-between gap-6 py-5 text-left font-serif text-xl leading-snug md:text-[1.4rem]"
              >
                {it.q}
                <motion.span animate={{ rotate: on ? 45 : 0 }} transition={{ duration: 0.35 }} className="shrink-0">
                  <Plus className="h-4 w-4" strokeWidth={1.4} />
                </motion.span>
              </button>
            </h3>
            <AnimatePresence initial={false}>
              {on && (
                <motion.div
                  id={id}
                  role="region"
                  initial={reduce ? { opacity: 0 } : { height: 0, opacity: 0 }}
                  animate={reduce ? { opacity: 1 } : { height: "auto", opacity: 1 }}
                  exit={reduce ? { opacity: 0 } : { height: 0, opacity: 0 }}
                  transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                  className="overflow-hidden"
                >
                  <p className="max-w-2xl pb-6 leading-relaxed opacity-85">{it.a}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}

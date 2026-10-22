"use client";

import { Minus, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

export function QtyStepper({
  value,
  onChange,
  min = 1,
  max = 24,
  label = "Quantité",
  size = "md",
}: {
  value: number;
  onChange: (n: number) => void;
  min?: number;
  max?: number;
  label?: string;
  size?: "sm" | "md";
}) {
  const h = size === "sm" ? "h-9" : "h-[3.25rem]";
  const w = size === "sm" ? "w-9" : "w-11";
  return (
    <div className={cn("inline-flex items-center border border-ink-soft/25", h)} role="group" aria-label={label}>
      <button type="button" className={cn("grid h-full place-items-center transition hover:bg-deep-2/5 disabled:opacity-35", w)} onClick={() => onChange(Math.max(min, value - 1))} disabled={value <= min} aria-label="Retirer un">
        <Minus className="h-3.5 w-3.5" strokeWidth={1.5} />
      </button>
      <output className={cn("grid h-full place-items-center tabular-nums", size === "sm" ? "w-7 text-sm" : "w-10")} aria-live="polite">
        {value}
      </output>
      <button type="button" className={cn("grid h-full place-items-center transition hover:bg-deep-2/5 disabled:opacity-35", w)} onClick={() => onChange(Math.min(max, value + 1))} disabled={value >= max} aria-label="Ajouter un">
        <Plus className="h-3.5 w-3.5" strokeWidth={1.5} />
      </button>
    </div>
  );
}

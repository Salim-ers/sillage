"use client";

import { useEffect, useState } from "react";
import { useAmbiance, useAmbianceChange } from "@/lib/ambiance";
import { useReducedMotion } from "@/lib/useReduced";
import { Particles } from "./Particles";

/* Transition globale : un voile de lumière traverse tout le site pendant que les couleurs évoluent ;
   au changement de saison, quelques particules traversent l'écran quand le hero n'est pas visible. */
export function AmbianceVeil() {
  const change = useAmbianceChange();
  const amb = useAmbiance();
  const reduce = useReducedMotion();
  const [burst, setBurst] = useState(0);

  useEffect(() => {
    if (!change || reduce || change.kind === "lumiere") return;
    const hero = document.querySelector("[data-hero-stage]");
    const heroVisible = hero ? hero.getBoundingClientRect().bottom > window.innerHeight * 0.35 : false;
    if (heroVisible) return;
    setBurst(change.at);
    const t = window.setTimeout(() => setBurst(0), 3200);
    return () => window.clearTimeout(t);
  }, [change, reduce]);

  if (!change || reduce) return null;
  const kind =
    change.from.light !== change.to.light ? (change.to.light === "nuit" ? "crepuscule" : change.to.light === "couchant" ? "doree" : "aube") : "saison";
  return (
    <>
      <div key={change.at} className={`veil veil-${kind}`} aria-hidden />
      {burst > 0 && (
        <Particles season={amb.season} light={amb.light} burst={burst} density={0.8} className="fixed inset-0 z-[44] h-full w-full" />
      )}
    </>
  );
}

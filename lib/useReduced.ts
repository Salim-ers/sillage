"use client";

import { useSyncExternalStore } from "react";

/* Préférence « mouvement réduit », sûre pour l'hydratation :
   le rendu serveur et la première hydratation supposent « non »,
   puis la vraie valeur s'applique immédiatement après. */
const QUERY = "(prefers-reduced-motion: reduce)";

function subscribe(cb: () => void) {
  const mq = window.matchMedia(QUERY);
  mq.addEventListener("change", cb);
  return () => mq.removeEventListener("change", cb);
}

export function useReducedMotion() {
  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia(QUERY).matches,
    () => false,
  );
}

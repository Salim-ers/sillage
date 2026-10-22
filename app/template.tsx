"use client";

import { useReducedMotion } from "@/lib/useReduced";
import { useEffect, useState } from "react";
import { motion } from "motion/react";

/* Transition de page : un sillage traverse l'écran, la page émerge.
   Courte (≈ 0,7 s), jamais bloquante. Au tout premier chargement,
   aucun masquage : le contenu est visible dès le HTML serveur. */

let firstLoad = true;

export default function Template({ children }: { children: React.ReactNode }) {
  const reduce = useReducedMotion();
  const [animated] = useState(() => !firstLoad);
  useEffect(() => {
    firstLoad = false;
  }, []);
  const play = animated && !reduce;

  return (
    <>
      {play && (
        <motion.svg
          aria-hidden
          className="pointer-events-none fixed inset-x-0 top-[40vh] z-[45] h-16 w-full text-accent"
          viewBox="0 0 1440 64"
          preserveAspectRatio="none"
          initial={{ opacity: 1 }}
          animate={{ opacity: 0 }}
          transition={{ duration: 0.35, delay: 0.6 }}
        >
          <motion.path
            d="M-20 34 C160 10 300 56 480 32 S800 8 980 32 S1300 54 1460 26"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.2"
            initial={{ pathLength: 0, pathOffset: 0 }}
            animate={{ pathLength: [0, 0.55, 0.15], pathOffset: [0, 0.3, 0.85] }}
            transition={{ duration: 0.9, ease: [0.65, 0, 0.35, 1] }}
          />
        </motion.svg>
      )}
      <motion.div initial={play ? { opacity: 0 } : false} animate={{ opacity: 1 }} transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1], delay: 0.08 }}>
        {children}
      </motion.div>
    </>
  );
}

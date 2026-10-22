"use client";

import { useReducedMotion } from "@/lib/useReduced";
import { useRef, type ElementType, type ReactNode } from "react";
import { motion, useInView, useScroll, useTransform, type Variants } from "motion/react";
import { cn } from "@/lib/utils";

/* ──────────────────────────────────────────────────────────────
   Bibliothèque de mouvements Maison Sillage
   Un seul vocabulaire : la houle (ease-sillage), réutilisé partout.
   Tous les effets s'effacent avec prefers-reduced-motion.
   ────────────────────────────────────────────────────────────── */

export const EASE = [0.22, 1, 0.36, 1] as const;
export const HOULE = [0.65, 0, 0.35, 1] as const;

/** Titre dévoilé mot à mot derrière un masque, comme une ligne qui sort de l'encre */
export function RevealTitle({
  text,
  as: Tag = "h2",
  className,
  delay = 0,
  stagger = 0.055,
  immediate = false,
  id,
}: {
  id?: string;
  text: string;
  as?: ElementType;
  className?: string;
  delay?: number;
  stagger?: number;
  immediate?: boolean;
}) {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -12% 0px" });
  const reduce = useReducedMotion();
  const show = immediate || inView;
  const words = text.split(" ");
  return (
    <Tag ref={ref} id={id} className={className} aria-label={text}>
      {words.map((w, i) => (
        <span key={i} aria-hidden className="inline-block overflow-hidden pb-[0.12em] -mb-[0.12em] align-bottom">
          <motion.span
            className="inline-block will-change-transform"
            initial={reduce ? false : { y: "108%" }}
            animate={show ? { y: "0%" } : undefined}
            transition={{ duration: 1.05, ease: EASE, delay: delay + i * stagger }}
          >
            {w}
            {i < words.length - 1 ? " " : ""}
          </motion.span>
        </span>
      ))}
    </Tag>
  );
}

const riseVariants: Variants = {
  hidden: { opacity: 0, y: 22 },
  show: { opacity: 1, y: 0 },
};

/** Apparition douce d'un bloc de texte (usage parcimonieux) */
export function Rise({
  children,
  className,
  delay = 0,
  as = "div",
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  as?: "div" | "p" | "li" | "section" | "span";
}) {
  const reduce = useReducedMotion();
  const Comp = motion[as];
  return (
    <Comp
      className={className}
      variants={riseVariants}
      initial={reduce ? false : "hidden"}
      whileInView="show"
      viewport={{ once: true, margin: "0px 0px -10% 0px" }}
      transition={{ duration: 0.9, ease: EASE, delay }}
    >
      {children}
    </Comp>
  );
}

/** Image révélée par un masque qui s'ouvre (clip-path) */
export function MaskReveal({
  children,
  className,
  from = "bottom",
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  from?: "bottom" | "left" | "right" | "top";
  delay?: number;
}) {
  const reduce = useReducedMotion();
  const start = {
    bottom: "inset(100% 0% 0% 0%)",
    top: "inset(0% 0% 100% 0%)",
    left: "inset(0% 100% 0% 0%)",
    right: "inset(0% 0% 0% 100%)",
  }[from];
  return (
    <motion.div
      className={cn("overflow-hidden", className)}
      initial={reduce ? false : { clipPath: start }}
      whileInView={{ clipPath: "inset(0% 0% 0% 0%)" }}
      viewport={{ once: true, margin: "0px 0px -8% 0px" }}
      transition={{ duration: 1.25, ease: HOULE, delay }}
    >
      <motion.div
        className="h-full w-full"
        initial={reduce ? false : { scale: 1.08 }}
        whileInView={{ scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.6, ease: EASE, delay }}
      >
        {children}
      </motion.div>
    </motion.div>
  );
}

/** Filet décoratif qui se dessine */
export function DrawRule({ className, delay = 0, ornament = true }: { className?: string; delay?: number; ornament?: boolean }) {
  const reduce = useReducedMotion();
  return (
    <div className={cn("flex items-center gap-3 text-accent", className)} aria-hidden>
      <motion.span
        className="h-px flex-1 origin-right bg-current opacity-60"
        initial={reduce ? false : { scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.1, ease: EASE, delay }}
      />
      {ornament && (
        <motion.svg
          viewBox="0 0 24 24"
          className="h-3.5 w-3.5"
          initial={reduce ? false : { opacity: 0, rotate: -45 }}
          whileInView={{ opacity: 1, rotate: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9, ease: EASE, delay: delay + 0.4 }}
        >
          <path d="M12 1 L14 10 L23 12 L14 14 L12 23 L10 14 L1 12 L10 10 Z" fill="currentColor" />
        </motion.svg>
      )}
      <motion.span
        className="h-px flex-1 origin-left bg-current opacity-60"
        initial={reduce ? false : { scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.1, ease: EASE, delay }}
      />
    </div>
  );
}

/** Trait de sillage : une houle qui se trace à l'entrée dans l'écran */
export function WakeStroke({ className, delay = 0, strokeWidth = 1.2 }: { className?: string; delay?: number; strokeWidth?: number }) {
  const reduce = useReducedMotion();
  return (
    <svg viewBox="0 0 400 40" className={className} aria-hidden fill="none">
      <motion.path
        d="M0 22 C40 8 70 34 110 20 S180 6 220 20 S300 34 340 18 S385 12 400 16"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        initial={reduce ? false : { pathLength: 0, opacity: 0 }}
        whileInView={{ pathLength: 1, opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.8, ease: EASE, delay }}
      />
      <motion.path
        d="M30 30 C70 22 100 36 140 28 S210 20 250 28"
        stroke="currentColor"
        strokeWidth={strokeWidth * 0.6}
        strokeLinecap="round"
        opacity={0.5}
        initial={reduce ? false : { pathLength: 0 }}
        whileInView={{ pathLength: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.6, ease: EASE, delay: delay + 0.35 }}
      />
    </svg>
  );
}

/** Parallaxe verticale douce (images, gravures) */
export function Parallax({ children, className, amount = 60 }: { children: ReactNode; className?: string; amount?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], reduce ? [0, 0] : [amount, -amount]);
  return (
    <div ref={ref} className={className}>
      <motion.div style={{ y }} className="h-full w-full will-change-transform">
        {children}
      </motion.div>
    </div>
  );
}

/** Groupe dont les enfants apparaissent en cascade */
export function Stagger({ children, className, gap = 0.08 }: { children: ReactNode; className?: string; gap?: number }) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={reduce ? false : "hidden"}
      whileInView="show"
      viewport={{ once: true, margin: "0px 0px -8% 0px" }}
      variants={{ hidden: {}, show: { transition: { staggerChildren: gap } } }}
    >
      {children}
    </motion.div>
  );
}

export function StaggerItem({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <motion.div className={className} variants={riseVariants} transition={{ duration: 0.85, ease: EASE }}>
      {children}
    </motion.div>
  );
}

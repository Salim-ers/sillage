"use client";

import Image from "next/image";
import { useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { photos, type PhotoKey } from "@/data/images";
import { useReducedMotion } from "@/lib/useReduced";
import { cn } from "@/lib/utils";
import { HOULE, EASE } from "@/components/animations";

type Reveal = "bottom" | "left" | "right" | "top" | false;

const CLIP: Record<Exclude<Reveal, false>, string> = {
  bottom: "inset(100% 0% 0% 0%)",
  top: "inset(0% 0% 100% 0%)",
  left: "inset(0% 100% 0% 0%)",
  right: "inset(0% 0% 0% 100%)",
};

/**
 * Photographie du site : ratio imposé (jamais étirée), point focal réglé à la main,
 * étalonnage selon la lumière ambiante, dévoilement par masque et parallaxe facultatifs.
 */
export function Photo({
  k,
  className,
  ratio,
  sizes = "100vw",
  priority = false,
  reveal = "bottom",
  parallax = 0,
  pos,
  alt,
  caption,
  grade = true,
  zoom = false,
  imgClassName,
}: {
  k: PhotoKey;
  className?: string;
  /** classe de ratio (ex. "aspect-[4/5]") ; sans ratio, la photo remplit son parent */
  ratio?: string;
  sizes?: string;
  priority?: boolean;
  reveal?: Reveal;
  /** amplitude de parallaxe en pourcentage de la hauteur (0 = aucune) */
  parallax?: number;
  pos?: string;
  alt?: string;
  caption?: string;
  grade?: boolean;
  /** léger zoom au survol du parent .group */
  zoom?: boolean;
  imgClassName?: string;
}) {
  const ph = photos[k];
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], reduce || !parallax ? ["0%", "0%"] : [`${-parallax}%`, `${parallax}%`]);
  const doReveal = reveal && !reduce;

  const img = (
    <Image
      src={ph.src}
      alt={alt ?? ph.alt}
      fill
      sizes={sizes}
      priority={priority}
      quality={80}
      className={cn(
        "object-cover",
        zoom && "transition-transform duration-[1.4s] ease-[cubic-bezier(.22,1,.36,1)] group-hover:scale-[1.05]",
        imgClassName,
      )}
      style={{ objectPosition: pos ?? ph.pos ?? "50% 50%" }}
    />
  );

  const box = (
    <div ref={ref} className={cn("relative overflow-hidden bg-paper-3", ratio ?? "h-full w-full")}>
      {parallax && !reduce ? (
        <motion.div className="absolute inset-x-0 -inset-y-[8%] will-change-transform" style={{ y }}>
          {img}
        </motion.div>
      ) : (
        img
      )}
      {grade && <span className="grade" aria-hidden />}
    </div>
  );

  const body = doReveal ? (
    <motion.div
      className={cn(!ratio && "h-full")}
      initial={{ clipPath: CLIP[reveal as Exclude<Reveal, false>] }}
      whileInView={{ clipPath: "inset(0% 0% 0% 0%)" }}
      viewport={{ once: true, margin: "0px 0px -8% 0px" }}
      transition={{ duration: 1.25, ease: HOULE }}
    >
      <motion.div className={cn(!ratio && "h-full")} initial={{ scale: 1.08 }} whileInView={{ scale: 1 }} viewport={{ once: true }} transition={{ duration: 1.6, ease: EASE }}>
        {box}
      </motion.div>
    </motion.div>
  ) : (
    box
  );

  if (!caption) return <div className={cn(!ratio && "h-full", className)}>{body}</div>;
  return (
    <figure className={className}>
      {body}
      <figcaption className="mt-3 font-serif text-[0.95rem] italic text-ink-soft/80">{caption}</figcaption>
    </figure>
  );
}

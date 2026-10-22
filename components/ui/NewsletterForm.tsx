"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { cn } from "@/lib/utils";

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/** Inscription simulée : validation réelle, aucun envoi. */
export function NewsletterForm({ tone = "clair", id = "newsletter" }: { tone?: "clair" | "sombre"; id?: string }) {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "error" | "done">("idle");
  const dark = tone === "sombre";
  return (
    <div>
      <AnimatePresence mode="wait" initial={false}>
        {state === "done" ? (
          <motion.p key="ok" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className={cn("font-serif text-2xl italic", dark ? "text-gold" : "text-ink-soft")} role="status">
            Merci. Dans la version finale, vous recevriez ici la lettre de saison. Pour l&apos;instant, rien n&apos;a été enregistré.
          </motion.p>
        ) : (
          <motion.form
            key="form"
            noValidate
            onSubmit={(e) => {
              e.preventDefault();
              setState(EMAIL.test(email.trim()) ? "done" : "error");
            }}
            className="flex flex-col gap-3 sm:flex-row sm:items-end"
          >
            <div className="flex-1">
              <label htmlFor={id} className={cn("mention block", dark ? "text-gold" : "text-accent")}>
                Adresse e-mail
              </label>
              <input
                id={id}
                type="email"
                inputMode="email"
                autoComplete="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (state === "error") setState("idle");
                }}
                placeholder="vous@exemple.fr"
                className={cn("champ", dark && "border-on-deep/35 text-on-deep placeholder:text-on-deep/45 focus:border-on-deep")}
                aria-invalid={state === "error"}
                aria-describedby={`${id}-aide`}
              />
            </div>
            <button type="submit" className={cn("btn", dark ? "btn-clair" : "btn-encre")}>
              S&apos;inscrire
            </button>
          </motion.form>
        )}
      </AnimatePresence>
      <p id={`${id}-aide`} className={cn("mt-3 text-xs", state === "error" ? (dark ? "text-[#f0b39a]" : "text-[#9b3b2a]") : dark ? "text-on-deep/60" : "text-ink-soft/70")}>
        {state === "error" ? "Cette adresse ne semble pas complète. Vérifiez le format, par exemple prenom@domaine.fr." : "Formulaire de démonstration : aucune adresse n'est collectée ni envoyée."}
      </p>
    </div>
  );
}

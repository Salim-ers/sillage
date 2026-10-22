"use client";

import Link from "next/link";
import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Check } from "lucide-react";
import { useStore } from "@/lib/store";
import { formatPrice, cn } from "@/lib/utils";
import { CartTotals, DemoNotice } from "./CartLines";
import { ProductArt } from "@/components/products/ProductArt";

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
type Contact = { prenom: string; nom: string; email: string; ville: string };
const STEPS = ["Coordonnées", "Livraison", "Vérification"];

/** Parcours de commande simulé : aucune donnée bancaire, aucun envoi. */
export function Checkout() {
  const { lines, ready, totals, clear } = useStore();
  const [step, setStep] = useState(0);
  const [c, setC] = useState<Contact>({ prenom: "", nom: "", email: "", ville: "" });
  const [errors, setErrors] = useState<Partial<Record<keyof Contact, string>>>({});
  const [done, setDone] = useState<{ ref: string; ttc: number; ht: number; n: number } | null>(null);

  if (!ready) return <div className="shell min-h-[40vh] py-16 text-ink-soft/60">Chargement…</div>;

  if (done)
    return (
      <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} className="shell max-w-3xl pb-32" role="status">
        <span className="grid h-14 w-14 place-items-center rounded-full bg-deep-2 text-on-deep">
          <Check className="h-6 w-6" />
        </span>
        <h2 className="mt-8 font-serif text-5xl leading-tight">Simulation terminée.</h2>
        <p className="mt-5 text-lg text-ink-soft">
          Référence de démonstration <strong className="font-semibold">{done.ref}</strong> · {done.n} article{done.n > 1 ? "s" : ""}
          {done.ttc > 0 && ` · ${formatPrice(done.ttc)} TTC`}
          {done.ht > 0 && ` · ${formatPrice(done.ht)} HT`}
        </p>
        <DemoNotice className="mt-8" />
        <p className="mt-6 text-ink-soft/80">
          Aucune commande n&apos;a été passée, aucun paiement n&apos;a été demandé et vos informations n&apos;ont été ni transmises ni conservées.
          Le panier a été vidé.
        </p>
        <div className="mt-10 flex flex-wrap gap-3">
          <Link href="/" className="btn btn-encre">
            Retour à l&apos;accueil
          </Link>
          <Link href="/recettes" className="btn btn-trait">
            Explorer les recettes
          </Link>
        </div>
      </motion.div>
    );

  if (lines.length === 0)
    return (
      <div className="shell pb-32">
        <p className="font-serif text-3xl">Aucun article à commander.</p>
        <Link href="/boutique" className="btn btn-encre mt-8">
          Parcourir la boutique
        </Link>
      </div>
    );

  const validate = () => {
    const e: typeof errors = {};
    if (c.prenom.trim().length < 2) e.prenom = "Indiquez un prénom.";
    if (c.nom.trim().length < 2) e.nom = "Indiquez un nom.";
    if (!EMAIL.test(c.email.trim())) e.email = "Indiquez une adresse e-mail complète.";
    if (c.ville.trim().length < 2) e.ville = "Indiquez une ville.";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const field = (k: keyof Contact, label: string, type = "text", auto?: string) => (
    <div>
      <label htmlFor={`co-${k}`} className="mention block text-accent">
        {label}
      </label>
      <input
        id={`co-${k}`}
        type={type}
        className="champ"
        value={c[k]}
        autoComplete={auto}
        aria-invalid={!!errors[k]}
        aria-describedby={errors[k] ? `co-${k}-err` : undefined}
        onChange={(e) => {
          setC({ ...c, [k]: e.target.value });
          if (errors[k]) setErrors({ ...errors, [k]: undefined });
        }}
      />
      {errors[k] && (
        <p id={`co-${k}-err`} className="mt-1.5 text-xs text-[#9b3b2a]">
          {errors[k]}
        </p>
      )}
    </div>
  );

  return (
    <div className="shell grid gap-14 pb-32 lg:grid-cols-12">
      <div className="lg:col-span-7">
        <ol className="flex gap-6 border-b border-ink-soft/15 pb-4" aria-label="Étapes">
          {STEPS.map((s, i) => (
            <li key={s} aria-current={i === step ? "step" : undefined} className={cn("flex items-center gap-2 text-sm", i === step ? "text-ink" : "text-ink-soft/50")}>
              <span className={cn("grid h-7 w-7 place-items-center rounded-full border text-xs", i < step ? "border-ink-soft bg-deep-2 text-on-deep" : i === step ? "border-ink-soft" : "border-ink-soft/30")}>
                {i < step ? <Check className="h-3.5 w-3.5" /> : i + 1}
              </span>
              <span className="hidden sm:inline">{s}</span>
            </li>
          ))}
        </ol>

        <AnimatePresence mode="wait">
          <motion.div key={step} initial={{ opacity: 0, x: 18 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -18 }} transition={{ duration: 0.4 }} className="pt-10">
            {step === 0 && (
              <form
                noValidate
                onSubmit={(e) => {
                  e.preventDefault();
                  if (validate()) setStep(1);
                }}
              >
                <h2 className="font-serif text-3xl">Vos coordonnées</h2>
                <p className="mt-2 text-sm text-ink-soft/75">Démonstration : vous pouvez saisir des informations fictives. Rien n&apos;est envoyé.</p>
                <div className="mt-8 grid gap-7 sm:grid-cols-2">
                  {field("prenom", "Prénom", "text", "given-name")}
                  {field("nom", "Nom", "text", "family-name")}
                  {field("email", "E-mail", "email", "email")}
                  {field("ville", "Ville", "text", "address-level2")}
                </div>
                <button type="submit" className="btn btn-encre mt-10">
                  Continuer vers la livraison
                </button>
              </form>
            )}
            {step === 1 && (
              <div>
                <h2 className="font-serif text-3xl">Livraison</h2>
                <fieldset className="mt-8 space-y-3" disabled>
                  <legend className="sr-only">Mode de livraison</legend>
                  {["Livraison à domicile", "Retrait en point relais", "Livraison professionnelle"].map((m) => (
                    <label key={m} className="flex items-center justify-between border border-ink-soft/20 px-5 py-4 opacity-70">
                      <span className="flex items-center gap-3">
                        <input type="radio" name="livraison" className="accent-[#4b3020]" />
                        {m}
                      </span>
                      <span className="text-sm italic">Non défini</span>
                    </label>
                  ))}
                </fieldset>
                <p className="mt-4 text-sm text-ink-soft/75">
                  Les modes, délais et tarifs de livraison ne sont pas encore définis.{" "}
                  <Link href="/livraison-retours" className="lien">
                    En savoir plus
                  </Link>
                </p>
                <div className="mt-10 flex flex-wrap gap-3">
                  <button type="button" onClick={() => setStep(0)} className="btn btn-trait">
                    Retour
                  </button>
                  <button type="button" onClick={() => setStep(2)} className="btn btn-encre">
                    Vérifier la commande
                  </button>
                </div>
              </div>
            )}
            {step === 2 && (
              <div>
                <h2 className="font-serif text-3xl">Vérification</h2>
                <dl className="mt-8 divide-y divide-ink-soft/15 border-y border-ink-soft/15 text-sm">
                  <div className="grid grid-cols-3 gap-4 py-4">
                    <dt className="text-ink-soft/70">Contact</dt>
                    <dd className="col-span-2">
                      {c.prenom} {c.nom} · {c.email} · {c.ville}
                    </dd>
                  </div>
                  <div className="grid grid-cols-3 gap-4 py-4">
                    <dt className="text-ink-soft/70">Livraison</dt>
                    <dd className="col-span-2">Non définie</dd>
                  </div>
                  <div className="grid grid-cols-3 gap-4 py-4">
                    <dt className="text-ink-soft/70">Paiement</dt>
                    <dd className="col-span-2">Aucun : ce parcours ne demande ni ne traite aucune donnée bancaire.</dd>
                  </div>
                </dl>
                <DemoNotice className="mt-8" />
                <div className="mt-10 flex flex-wrap gap-3">
                  <button type="button" onClick={() => setStep(1)} className="btn btn-trait">
                    Retour
                  </button>
                  <button
                    type="button"
                    className="btn btn-encre"
                    onClick={() => {
                      const ref = `DEMO-${Math.random().toString(36).slice(2, 7).toUpperCase()}`;
                      setDone({ ref, ttc: totals.TTC, ht: totals.HT, n: lines.reduce((n, l) => n + l.qty, 0) });
                      clear();
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    }}
                  >
                    Terminer la simulation
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      <aside className="lg:col-span-4 lg:col-start-9" aria-label="Récapitulatif">
        <div className="papier p-7 lg:sticky lg:top-[calc(var(--header-h)+1.5rem)]">
          <h2 className="font-serif text-2xl">Votre panier</h2>
          <ul className="mt-5 space-y-4">
            {lines.map((l) => (
              <li key={`${l.slug}-${l.formatId}`} className="flex items-center gap-3">
                <span className="block h-16 w-12 shrink-0 overflow-hidden">
                  <ProductArt product={l.product} />
                </span>
                <span className="min-w-0 flex-1 text-sm">
                  <span className="block truncate font-serif text-base">{l.product.name}</span>
                  {l.format.contenance} × {l.qty}
                </span>
                <span className="text-sm tabular-nums">{formatPrice(l.total)}</span>
              </li>
            ))}
          </ul>
          <div className="mt-6 border-t border-ink-soft/15 pt-5">
            <CartTotals />
          </div>
        </div>
      </aside>
    </div>
  );
}

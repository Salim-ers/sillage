"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

const TYPES = ["Coffee shop", "Salon de thé", "Restaurant", "Hôtel", "Bar à boissons sans alcool", "Glacier", "Autre établissement"];
const NEEDS = ["Sirops 700 ml", "Poudres 1 kg", "Recettes signatures", "Échantillons", "Présentation de la Maison"];
const VOLUMES = ["Je ne sais pas encore", "Moins de 10 bouteilles par mois", "10 à 30 bouteilles par mois", "Plus de 30 bouteilles par mois"];
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const PHONE = /^[+\d][\d\s.-]{7,}$/;

type Values = {
  etablissement: string;
  type: string;
  nom: string;
  email: string;
  telephone: string;
  ville: string;
  besoins: string[];
  volume: string;
  message: string;
  accord: boolean;
};

const EMPTY: Values = { etablissement: "", type: "", nom: "", email: "", telephone: "", ville: "", besoins: [], volume: VOLUMES[0], message: "", accord: false };

function validate(v: Values) {
  const e: Partial<Record<keyof Values, string>> = {};
  if (v.etablissement.trim().length < 2) e.etablissement = "Indiquez le nom de l'établissement.";
  if (!v.type) e.type = "Choisissez le type d'établissement.";
  if (v.nom.trim().length < 2) e.nom = "Indiquez votre nom.";
  if (!EMAIL.test(v.email.trim())) e.email = "Indiquez une adresse e-mail complète, par exemple nom@domaine.fr.";
  if (v.telephone.trim() && !PHONE.test(v.telephone.trim())) e.telephone = "Ce numéro semble incomplet.";
  if (v.ville.trim().length < 2) e.ville = "Indiquez la ville de l'établissement.";
  if (v.besoins.length === 0) e.besoins = "Sélectionnez au moins un sujet.";
  if (v.message.trim().length < 10) e.message = "Décrivez votre projet en quelques mots (10 caractères minimum).";
  if (!v.accord) e.accord = "Cochez cette case pour envoyer la demande de démonstration.";
  return e;
}

function Field({ id, label, error, children, hint }: { id: string; label: string; error?: string; children: React.ReactNode; hint?: string }) {
  return (
    <div>
      <label htmlFor={id} className="mention block text-accent">
        {label}
      </label>
      {children}
      {(error || hint) && (
        <p id={`${id}-msg`} className={cn("mt-1.5 text-xs", error ? "text-[#9b3b2a]" : "text-ink-soft/65")}>
          {error ?? hint}
        </p>
      )}
    </div>
  );
}

export function ProForm() {
  const [v, setV] = useState<Values>(EMPTY);
  const [errors, setErrors] = useState<ReturnType<typeof validate>>({});
  const [sent, setSent] = useState(false);
  const set = <K extends keyof Values>(k: K, val: Values[K]) => {
    setV((p) => ({ ...p, [k]: val }));
    if (errors[k]) setErrors((e) => ({ ...e, [k]: undefined }));
  };
  const inv = (k: keyof Values) => ({ "aria-invalid": !!errors[k], "aria-describedby": errors[k] ? `${k}-msg` : undefined });

  return (
    <AnimatePresence mode="wait" initial={false}>
      {sent ? (
        <motion.div key="ok" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="papier p-8 md:p-12" role="status">
          <span className="grid h-12 w-12 place-items-center rounded-full bg-deep-2 text-on-deep">
            <Check className="h-5 w-5" />
          </span>
          <h3 className="mt-6 font-serif text-3xl">Demande validée — mode démonstration.</h3>
          <p className="mt-4 max-w-xl text-ink-soft/85">
            Merci {v.nom.split(" ")[0]}. Le formulaire fonctionne, mais aucun service d&apos;envoi n&apos;est encore configuré : votre demande
            n&apos;a été ni transmise ni enregistrée. Une fois le projet lancé, ce formulaire sera relié à la Maison.
          </p>
          <button
            type="button"
            className="btn btn-trait mt-8"
            onClick={() => {
              setV(EMPTY);
              setSent(false);
            }}
          >
            Remplir une nouvelle demande
          </button>
        </motion.div>
      ) : (
        <motion.form
          key="form"
          noValidate
          onSubmit={(e) => {
            e.preventDefault();
            const errs = validate(v);
            setErrors(errs);
            const first = Object.keys(errs)[0];
            if (first) {
              document.getElementById(first === "besoins" ? "besoins-0" : first)?.focus();
              return;
            }
            setSent(true);
          }}
          className="grid gap-7 md:grid-cols-2"
        >
          <Field id="etablissement" label="Établissement" error={errors.etablissement}>
            <input id="etablissement" className="champ" value={v.etablissement} onChange={(e) => set("etablissement", e.target.value)} autoComplete="organization" {...inv("etablissement")} />
          </Field>
          <Field id="type" label="Type d'établissement" error={errors.type}>
            <select id="type" className="champ" value={v.type} onChange={(e) => set("type", e.target.value)} {...inv("type")}>
              <option value="">Choisir…</option>
              {TYPES.map((t) => (
                <option key={t}>{t}</option>
              ))}
            </select>
          </Field>
          <Field id="nom" label="Nom et prénom" error={errors.nom}>
            <input id="nom" className="champ" value={v.nom} onChange={(e) => set("nom", e.target.value)} autoComplete="name" {...inv("nom")} />
          </Field>
          <Field id="email" label="E-mail professionnel" error={errors.email}>
            <input id="email" type="email" inputMode="email" className="champ" value={v.email} onChange={(e) => set("email", e.target.value)} autoComplete="email" {...inv("email")} />
          </Field>
          <Field id="telephone" label="Téléphone (facultatif)" error={errors.telephone}>
            <input id="telephone" type="tel" inputMode="tel" className="champ" value={v.telephone} onChange={(e) => set("telephone", e.target.value)} autoComplete="tel" {...inv("telephone")} />
          </Field>
          <Field id="ville" label="Ville" error={errors.ville}>
            <input id="ville" className="champ" value={v.ville} onChange={(e) => set("ville", e.target.value)} autoComplete="address-level2" {...inv("ville")} />
          </Field>
          <fieldset className="md:col-span-2" aria-describedby={errors.besoins ? "besoins-msg" : undefined}>
            <legend className="mention text-accent">Sujets de la demande</legend>
            <div className="mt-3 flex flex-wrap gap-2">
              {NEEDS.map((n, i) => {
                const on = v.besoins.includes(n);
                return (
                  <label key={n} className={cn("cursor-pointer border px-3.5 py-2 text-sm transition focus-within:outline focus-within:outline-1", on ? "border-ink-soft bg-deep-2 text-on-deep" : "border-ink-soft/25 hover:border-ink-soft/70")}>
                    <input
                      id={`besoins-${i}`}
                      type="checkbox"
                      className="sr-only"
                      checked={on}
                      onChange={() => set("besoins", on ? v.besoins.filter((x) => x !== n) : [...v.besoins, n])}
                    />
                    {n}
                  </label>
                );
              })}
            </div>
            {errors.besoins && (
              <p id="besoins-msg" className="mt-1.5 text-xs text-[#9b3b2a]">
                {errors.besoins}
              </p>
            )}
          </fieldset>
          <Field id="volume" label="Volume envisagé" hint="Une estimation suffit, elle nous aide à préparer l'offre.">
            <select id="volume" className="champ" value={v.volume} onChange={(e) => set("volume", e.target.value)}>
              {VOLUMES.map((t) => (
                <option key={t}>{t}</option>
              ))}
            </select>
          </Field>
          <div className="md:col-span-2">
            <Field id="message" label="Votre projet" error={errors.message}>
              <textarea id="message" rows={5} className="champ resize-y" value={v.message} onChange={(e) => set("message", e.target.value)} {...inv("message")} />
            </Field>
          </div>
          <div className="md:col-span-2">
            <label className="flex items-start gap-3 text-sm">
              <input id="accord" type="checkbox" checked={v.accord} onChange={(e) => set("accord", e.target.checked)} className="mt-1 h-4 w-4 accent-[#4b3020]" {...inv("accord")} />
              <span>J&apos;ai compris que ce formulaire est une démonstration : aucune donnée n&apos;est transmise ni conservée.</span>
            </label>
            {errors.accord && (
              <p id="accord-msg" className="mt-1.5 text-xs text-[#9b3b2a]">
                {errors.accord}
              </p>
            )}
          </div>
          <div className="md:col-span-2">
            <button type="submit" className="btn btn-encre">
              Envoyer la demande (démonstration)
            </button>
          </div>
        </motion.form>
      )}
    </AnimatePresence>
  );
}

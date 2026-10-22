/* ──────────────────────────────────────────────────────────────
   Système d'ambiances Maison Sillage
   Deux axes indépendants : la lumière (jour, couchant, nuit)
   et la saison. Chaque combinaison définit une palette complète ;
   le hero dispose d'une photographie recomposée pour chacune.
   ────────────────────────────────────────────────────────────── */

export type Season = "printemps" | "ete" | "automne" | "hiver";
export type Light = "jour" | "couchant" | "nuit";
export type AmbianceMode = "manuel" | "auto";

export const SEASONS: Season[] = ["printemps", "ete", "automne", "hiver"];
export const LIGHTS: Light[] = ["jour", "couchant", "nuit"];

export const DEFAULT_SEASON: Season = "ete";
export const DEFAULT_LIGHT: Light = "couchant";

export const seasonInfo: Record<Season, { label: string; hint: string; particles: "petales" | "eclats" | "feuilles" | "neige" }> = {
  printemps: { label: "Printemps", hint: "Fleurs, verdure, lumière douce", particles: "petales" },
  ete: { label: "Été", hint: "Mer turquoise, soleil méditerranéen", particles: "eclats" },
  automne: { label: "Automne", hint: "Feuilles orangées, tons caramel", particles: "feuilles" },
  hiver: { label: "Hiver", hint: "Neige, intérieurs illuminés", particles: "neige" },
};

export const lightInfo: Record<Light, { label: string; hint: string }> = {
  jour: { label: "Jour", hint: "Lumière naturelle, ciel bleu" },
  couchant: { label: "Coucher de soleil", hint: "Lumière dorée, reflets chauds" },
  nuit: { label: "Nuit", hint: "Clair de lune et lanternes" },
};

export const plateSrc = (s: Season, l: Light) => `/images/hero/ambiance-${s}-${l}.jpg`;
export const PLATE_W = 1672;
export const PLATE_H = 941;

/* Lumière : surfaces, encres, sections profondes, boutons */
type LightTokens = {
  paper: string;
  paper2: string;
  paper3: string;
  surface: string;
  ink: string;
  inkSoft: string;
  deep: string;
  deep2: string;
  onDeep: string;
  gold: string;
  btn: string;
  btnInk: string;
  glow: string;
};

const LIGHT_TOKENS: Record<Light, LightTokens> = {
  jour: {
    paper: "#fbfaf6",
    paper2: "#eef2f0",
    paper3: "#e2e8e6",
    surface: "#ffffff",
    ink: "#13202d",
    inkSoft: "#33475a",
    deep: "#0e2738",
    deep2: "#173a52",
    onDeep: "#f4f6f3",
    gold: "#c79a55",
    btn: "#0e2738",
    btnInk: "#ffffff",
    glow: "#9fd0e6",
  },
  couchant: {
    paper: "#f6eddc",
    paper2: "#ecdfc6",
    paper3: "#e3d2b3",
    surface: "#fffaf1",
    ink: "#22170f",
    inkSoft: "#4b3020",
    deep: "#1e140d",
    deep2: "#3b2618",
    onDeep: "#f6eddc",
    gold: "#cfa868",
    btn: "#3b2618",
    btnInk: "#fff7ea",
    glow: "#f0a85a",
  },
  nuit: {
    paper: "#0e1522",
    paper2: "#131c2c",
    paper3: "#1a2537",
    surface: "#162033",
    ink: "#efe6d6",
    inkSoft: "#c7bba6",
    deep: "#060a12",
    deep2: "#1c2840",
    onDeep: "#efe6d6",
    gold: "#dcb877",
    btn: "#dcb877",
    btnInk: "#10131c",
    glow: "#f3b664",
  },
};

/* Saison : accent typographique (lisible sur le fond de la lumière choisie) et teinte des surfaces */
const SEASON_TOKENS: Record<Season, Record<Light, { accent: string; tint: string }>> = {
  printemps: {
    jour: { accent: "#a8435a", tint: "#f5dde2" },
    couchant: { accent: "#a14f5f", tint: "#f1d6d4" },
    nuit: { accent: "#eaa7b5", tint: "#2b2030" },
  },
  ete: {
    jour: { accent: "#0b7186", tint: "#d3ebea" },
    couchant: { accent: "#1b6d78", tint: "#d6e6dd" },
    nuit: { accent: "#6fc7d1", tint: "#0f262d" },
  },
  automne: {
    jour: { accent: "#a24c17", tint: "#f2dcc2" },
    couchant: { accent: "#9c4d1b", tint: "#efd3ad" },
    nuit: { accent: "#e69d60", tint: "#2a1d15" },
  },
  hiver: {
    jour: { accent: "#3a6590", tint: "#dde6ef" },
    couchant: { accent: "#4d6585", tint: "#e3dde3" },
    nuit: { accent: "#a8c4e2", tint: "#17202f" },
  },
};

export const VARS = [
  "paper",
  "paper2",
  "paper3",
  "surface",
  "ink",
  "inkSoft",
  "deep",
  "deep2",
  "onDeep",
  "gold",
  "btn",
  "btnInk",
  "glow",
  "accent",
  "tint",
] as const;

const cssName = (k: string) => `--a-${k.replace(/[A-Z0-9]/g, (m) => `-${m.toLowerCase()}`)}`;

export function tokensFor(s: Season, l: Light): Record<(typeof VARS)[number], string> {
  return { ...LIGHT_TOKENS[l], ...SEASON_TOKENS[s][l] };
}

/** Feuille de style des ambiances : variables animables (@property) + une règle par combinaison */
export function ambianceCss() {
  const props = VARS.map(
    (k) => `@property ${cssName(k)} { syntax: "<color>"; inherits: true; initial-value: ${tokensFor(DEFAULT_SEASON, DEFAULT_LIGHT)[k]}; }`,
  ).join("\n");
  const def = tokensFor(DEFAULT_SEASON, DEFAULT_LIGHT);
  const base = `:root { ${VARS.map((k) => `${cssName(k)}: ${def[k]};`).join(" ")} }`;
  const rules = SEASONS.flatMap((s) =>
    LIGHTS.map((l) => {
      const t = tokensFor(s, l);
      return `:root[data-season="${s}"][data-light="${l}"] { ${VARS.map((k) => `${cssName(k)}: ${t[k]};`).join(" ")} }`;
    }),
  ).join("\n");
  const plates = SEASONS.flatMap((s) => LIGHTS.map((l) => `:root[data-season="${s}"][data-light="${l}"] .plate[data-key="${s}-${l}"]{display:block}`)).join("\n");
  const scheme = `:root[data-light="nuit"] { color-scheme: dark; }`;
  const transition = `:root.ambiance-ready { transition: ${VARS.map((k) => `${cssName(k)} var(--ambiance-duree, 1.1s) cubic-bezier(.45,0,.25,1)`).join(", ")}; }`;
  return [props, base, rules, plates, scheme, transition].join("\n");
}

/** Ambiance « automatique » : déduite de l'heure et de la date locales du visiteur */
export function autoAmbiance(d = new Date()): { season: Season; light: Light } {
  const m = d.getMonth();
  const season: Season = m >= 2 && m <= 4 ? "printemps" : m >= 5 && m <= 7 ? "ete" : m >= 8 && m <= 10 ? "automne" : "hiver";
  const h = d.getHours() + d.getMinutes() / 60;
  // heures de couchant approximatives selon la saison (latitudes européennes)
  const dusk = { printemps: [18.5, 21], ete: [19.5, 22], automne: [17.5, 20], hiver: [16.5, 18.5] }[season];
  const dawn = { printemps: 6.5, ete: 6, automne: 7.5, hiver: 8 }[season];
  const light: Light = h >= dusk[0] && h < dusk[1] ? "couchant" : h >= dawn && h < dusk[0] ? "jour" : "nuit";
  return { season, light };
}

export const STORAGE_KEY = "maison-sillage:ambiance:v1";
export const SESSION_KEY = "maison-sillage:ambiance-auto:v1";

/** Script synchrone placé dans <head> : applique l'ambiance mémorisée avant le premier rendu */
export function ambianceBootScript() {
  const fn = autoAmbiance.toString();
  return `(function(){try{
var S=${JSON.stringify(SEASONS)},L=${JSON.stringify(LIGHTS)},d=document.documentElement;
var p=null;try{p=JSON.parse(localStorage.getItem(${JSON.stringify(STORAGE_KEY)})||"null")}catch(e){}
var s=${JSON.stringify(DEFAULT_SEASON)},l=${JSON.stringify(DEFAULT_LIGHT)},mode="manuel";
if(p&&p.mode==="auto"){mode="auto";var a=null;try{a=JSON.parse(sessionStorage.getItem(${JSON.stringify(SESSION_KEY)})||"null")}catch(e){}
if(!a||S.indexOf(a.season)<0||L.indexOf(a.light)<0){a=(${fn})(new Date());try{sessionStorage.setItem(${JSON.stringify(SESSION_KEY)},JSON.stringify(a))}catch(e){}}
s=a.season;l=a.light}else if(p&&S.indexOf(p.season)>=0&&L.indexOf(p.light)>=0){s=p.season;l=p.light}
d.setAttribute("data-season",s);d.setAttribute("data-light",l);d.setAttribute("data-ambiance-mode",mode);
}catch(e){}})();`;
}

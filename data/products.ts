import type { Format, Product } from "@/lib/types";

/* ──────────────────────────────────────────────────────────────
   Catalogue de démonstration — Maison Sillage
   Quatre recettes signatures saisonnières, chacune déclinée en
   sirop et en préparation en poudre ; un coffret ; une édition à venir.
   Produits, formats et tarifs fictifs et indicatifs. Aucune
   composition, valeur nutritionnelle ou certification n'est avancée.
   ────────────────────────────────────────────────────────────── */

const SIROP: Format[] = [
  { id: "25cl", label: "Flacon 25 cl", contenance: "25 cl", public: "particulier", price: 12.9, tax: "TTC" },
  { id: "70cl", label: "Bouteille professionnelle 70 cl", contenance: "70 cl", public: "professionnel", price: 14.9, tax: "HT" },
];

const POUDRE: Format[] = [
  { id: "250g", label: "Sachet 250 g", contenance: "250 g", public: "particulier", price: 13.9, tax: "TTC" },
  { id: "1kg", label: "Sachet professionnel 1 kg", contenance: "1 kg", public: "professionnel", price: 28.9, tax: "HT" },
];

const FAQ = [
  {
    q: "Puis-je commander cette création aujourd'hui ?",
    a: "Pas encore. Maison Sillage est en phase de conception : cette fiche présente un prototype, et le panier fonctionne uniquement à titre de démonstration. Aucune commande n'est transmise et aucun paiement n'est demandé.",
  },
  {
    q: "Quelle est la composition exacte ?",
    a: "La formulation est en cours de développement. La liste d'ingrédients, les allergènes et les informations nutritionnelles seront publiés lorsque la recette aura été finalisée et validée.",
  },
  {
    q: "Les photographies montrent-elles le produit réel ?",
    a: "Ce sont des mises en scène de démonstration qui présentent l'univers et le futur conditionnement. Le produit définitif pourra différer.",
  },
];

type Flavor = {
  key: "fraise" | "peche" | "poire" | "datte";
  slug: string;
  flavor: string;
  season: "printemps" | "ete" | "automne" | "hiver";
  profiles: Product["profiles"];
  notes: string[];
  tagline: string;
  story: [string, string];
};

const FLAVORS: Flavor[] = [
  {
    key: "fraise",
    slug: "fraise-des-bois-madeleine-doree",
    flavor: "Fraise des bois & Madeleine dorée",
    season: "printemps",
    profiles: ["fruite", "patissier"],
    notes: ["Fraise des bois", "Biscuit doré", "Vanille"],
    tagline: "Le goûter d'un jardin au mois de mai.",
    story: [
      "Une fraise des bois trouvée au bord d'un sentier, une madeleine encore tiède posée sur le rebord de la fenêtre. Cette création cherche l'instant précis où l'éclat acidulé du fruit rencontre la rondeur beurrée du biscuit.",
      "La fraise ouvre, vive et parfumée ; la madeleine prend le relais, puis une vanille douce prolonge la gorgée comme un souvenir qui s'attarde.",
    ],
  },
  {
    key: "peche",
    slug: "peche-blanche-fleur-oranger",
    flavor: "Pêche blanche & Fleur d'oranger",
    season: "ete",
    profiles: ["fruite", "floral"],
    notes: ["Pêche juteuse", "Fleur d'oranger", "Douceur miellée"],
    tagline: "Une fin d'après-midi sous la tonnelle.",
    story: [
      "Une pêche blanche si mûre qu'elle se partage au-dessus de l'assiette, et l'ombre fraîche d'un oranger en fleur. L'été, chez Maison Sillage, est une affaire de délicatesse.",
      "La chair juteuse du fruit domine d'abord ; la fleur d'oranger arrive ensuite, lumineuse, sans jamais prendre le dessus.",
    ],
  },
  {
    key: "poire",
    slug: "poire-fondante-vanille-bourbon",
    flavor: "Poire fondante & Vanille Bourbon",
    season: "automne",
    profiles: ["fruite", "patissier"],
    notes: ["Poire compotée", "Vanille ronde", "Sucre blond"],
    tagline: "Le verger à l'heure des premières brumes.",
    story: [
      "Les poires tombées de l'arbre qu'on laisse fondre doucement dans une casserole, une gousse de vanille fendue au milieu. Notre création d'automne tient de la compote du dimanche et du café de l'après-midi.",
      "La poire est tendre, presque confite ; la vanille l'enveloppe d'une rondeur chaude qui appelle le lait et l'espresso.",
    ],
  },
  {
    key: "datte",
    slug: "datte-medjool-creme-brulee",
    flavor: "Datte Medjool & Crème brûlée",
    season: "hiver",
    profiles: ["patissier", "fruits-secs"],
    notes: ["Datte caramélisée", "Sucre grillé", "Crème vanillée"],
    tagline: "La croûte de sucre qui cède sous la cuillère.",
    story: [
      "Une datte charnue, presque confite, et le bruit sec d'une crème brûlée qu'on entame au coin du feu. Notre création d'hiver est la plus profonde de la collection.",
      "La datte apporte son caramel naturel, la crème brûlée sa note de sucre grillé et sa douceur lactée : une saveur pensée pour les boissons chaudes qui se boivent lentement.",
    ],
  },
];

const SIROP_USAGES: Record<Flavor["key"], Pick<Product, "usages" | "usageIdeas">> = {
  fraise: {
    usages: ["latte", "milkshake", "limonade", "dessert"],
    usageIdeas: [
      { title: "Latte de printemps", text: "Avec un lait entier bien moussé, pour retrouver le goût d'un goûter d'enfance." },
      { title: "Milkshake", text: "Mixé avec une glace vanille et un trait de lait froid." },
      { title: "Limonade rosée", text: "Allongé d'eau pétillante très fraîche et de quelques feuilles de menthe." },
    ],
  },
  peche: {
    usages: ["latte-glace", "mocktail", "limonade", "dessert"],
    usageIdeas: [
      { title: "Iced latte", text: "Sur un espresso court et un lait froid, versé lentement sur la glace." },
      { title: "Mocktail pétillant", text: "Avec une eau pétillante, un zeste de citron et une tranche de pêche." },
      { title: "Salade de fruits", text: "Quelques gouttes sur des fruits blancs, pour souligner leur parfum." },
    ],
  },
  poire: {
    usages: ["latte", "cafe", "latte-glace", "dessert"],
    usageIdeas: [
      { title: "Latte glacé", text: "Notre recette signature : espresso, lait froid, chantilly et une note de poire." },
      { title: "Café crème", text: "Une cuillère suffit à arrondir un café filtre du matin." },
      { title: "Tarte fine", text: "En nappage sur une pâte feuilletée, à la sortie du four." },
    ],
  },
  datte: {
    usages: ["chocolat", "latte", "cafe", "dessert"],
    usageIdeas: [
      { title: "Chocolat chaud", text: "Un chocolat épais relevé d'une note de caramel et de datte." },
      { title: "Latte d'hiver", text: "Avec un lait d'avoine pour une texture encore plus ronde." },
      { title: "Crème brûlée", text: "Une cuillère dans l'appareil avant cuisson, pour un dessert signature." },
    ],
  },
};

const POUDRE_USAGES: Record<Flavor["key"], Pick<Product, "usages" | "usageIdeas">> = {
  fraise: {
    usages: ["milkshake", "frappe", "latte"],
    usageIdeas: [
      { title: "Milkshake onctueux", text: "Mixée avec une glace vanille et du lait froid, pour une texture dense." },
      { title: "Frappé", text: "Avec de la glace pilée et un lait froid, coiffé de chantilly." },
      { title: "Latte rosé", text: "Fouettée dans un lait chaud jusqu'à obtenir une mousse fine." },
    ],
  },
  peche: {
    usages: ["frappe", "latte-glace", "milkshake"],
    usageIdeas: [
      { title: "Frappé d'été", text: "Mixée avec de la glace pilée et un lait d'avoine froid." },
      { title: "Latte glacé", text: "Délayée dans un fond de lait tiède, puis versée sur glace." },
      { title: "Milkshake", text: "Avec une glace vanille, pour un milkshake doux et parfumé." },
    ],
  },
  poire: {
    usages: ["latte", "latte-glace", "frappe"],
    usageIdeas: [
      { title: "Latte chaud", text: "Fouettée dans un lait chaud, avec un espresso pour plus de caractère." },
      { title: "Latte glacé", text: "Délayée puis versée sur glace avec un lait froid." },
      { title: "Frappé", text: "Mixée finement avec de la glace et une pointe de cannelle." },
    ],
  },
  datte: {
    usages: ["chocolat", "latte", "dessert"],
    usageIdeas: [
      { title: "Chocolat d'hiver", text: "Délayée dans un lait chaud avec un carré de chocolat noir." },
      { title: "Latte crème brûlée", text: "Fouettée dans le lait, coiffée d'éclats de caramel." },
      { title: "Mousse minute", text: "Incorporée à une crème fouettée pour un dessert à l'assiette." },
    ],
  },
};

const PHOTOS = {
  fraise: { sirop: "siropFraise", poudre: "poudreFraise", collection: "collectionPrintemps", scene: "scenePrintempsPortrait", detail: "fraises", recette: "milkshakeFraise", inspi: "fleursBlanches", pos: "2% 50%" },
  peche: { sirop: "siropPeche", poudre: "poudrePeche", collection: "collectionEte", scene: "sceneEtePortrait", detail: "peches", recette: "limonadePeche", inspi: "fleursAgrumes", pos: "36% 50%" },
  poire: { sirop: "siropPoire", poudre: "poudrePoire", collection: "collectionAutomne", scene: "sceneAutomnePortrait", detail: "poires", recette: "icedLattePoire", inspi: "cannelle", pos: "68% 50%" },
  datte: { sirop: "siropDatte", poudre: "poudreDatte", collection: "collectionHiver", scene: "sceneHiverPortrait", detail: "dattes", recette: "latteDatte", inspi: "chocolat", pos: "100% 50%" },
} as const;

const poudreSlug = (f: Flavor) => `preparation-${f.slug}`;

const sirops: Product[] = FLAVORS.map((f) => ({
  slug: f.slug,
  name: f.flavor,
  flavor: f.flavor,
  category: "sirop",
  season: f.season,
  status: "prototype",
  profiles: f.profiles,
  notes: f.notes,
  tagline: f.tagline,
  story: [...f.story],
  ...SIROP_USAGES[f.key],
  formats: SIROP,
  image: PHOTOS[f.key].sirop,
  gallery: [
    { photo: PHOTOS[f.key].sirop, label: "Le flacon" },
    { photo: PHOTOS[f.key].collection, label: "La collection" },
    { photo: PHOTOS[f.key].scene, label: "En situation" },
    { photo: PHOTOS[f.key].detail, label: "La matière" },
  ],
  twin: poudreSlug(f),
  complements: [poudreSlug(f), "coffret-decouverte"],
  faq: [
    ...FAQ,
    { q: "Quelle différence avec la préparation en poudre ?", a: "Le sirop parfume une boisson sans en changer la texture ; la préparation en poudre apporte en plus de l'onctuosité aux boissons lactées. Les deux partagent la même saveur." },
  ],
  seo: `Sirop de démonstration ${f.flavor}, création ${f.season === "ete" ? "d'été" : f.season === "hiver" ? "d'hiver" : f.season === "automne" ? "d'automne" : "de printemps"} Maison Sillage pour cafés, lattes et boissons gourmandes.`,
}));

const poudres: Product[] = FLAVORS.map((f) => ({
  slug: poudreSlug(f),
  name: `Préparation ${f.flavor}`,
  flavor: f.flavor,
  category: "poudre",
  season: f.season,
  status: "prototype",
  profiles: f.profiles,
  notes: f.notes,
  tagline: f.tagline,
  story: [
    `La même saveur que notre sirop ${f.flavor}, sous une forme qui apporte de la matière : une préparation gourmande à fouetter dans le lait, chaud ou froid.`,
    f.story[1],
  ],
  ...POUDRE_USAGES[f.key],
  formats: POUDRE,
  image: PHOTOS[f.key].poudre,
  gallery: [
    { photo: PHOTOS[f.key].poudre, label: "Le sachet" },
    { photo: PHOTOS[f.key].recette, label: "En recette" },
    { photo: "quatrePoudres", label: "La gamme", pos: PHOTOS[f.key].pos },
    { photo: PHOTOS[f.key].inspi, label: "L'inspiration" },
  ],
  twin: f.slug,
  complements: [f.slug, "coffret-decouverte"],
  faq: [
    ...FAQ,
    { q: "Se dissout-elle dans une boisson froide ?", a: "La dissolution à froid fait partie des critères de développement. Elle sera testée et précisée avant toute commercialisation." },
  ],
  seo: `Préparation en poudre de démonstration ${f.flavor}, pour lattes, frappés et boissons gourmandes Maison Sillage.`,
}));

export const products: Product[] = [
  ...sirops,
  ...poudres,
  {
    slug: "coffret-decouverte",
    name: "Coffret Découverte",
    flavor: "Les quatre saisons",
    category: "coffret",
    season: null,
    status: "prototype",
    profiles: ["fruite", "floral", "patissier", "fruits-secs"],
    notes: ["Quatre saisons", "Quatre sillages", "Une table"],
    tagline: "Quatre flacons pour faire le tour de la Maison.",
    story: [
      "Le Coffret Découverte réunit les quatre sirops de la collection dans leur format de 25 cl : un printemps gourmand, un été floral, un automne vanillé, un hiver caramélisé.",
      "De quoi comparer, associer et imaginer ses propres recettes, une saison après l'autre.",
    ],
    usages: ["latte", "latte-glace", "mocktail", "milkshake"],
    usageIdeas: [
      { title: "Une dégustation à quatre", text: "Quatre lattes identiques, quatre sirops : la meilleure façon de découvrir la collection." },
      { title: "Un cadeau", text: "Accompagné d'un livret de recettes de démonstration." },
    ],
    formats: [{ id: "coffret", label: "Coffret 4 × 25 cl", contenance: "4 × 25 cl", public: "particulier", price: 46.9, tax: "TTC" }],
    image: "coffret",
    gallery: [
      { photo: "coffret", label: "Les quatre flacons" },
      { photo: "quatreSirops", label: "Sur la table" },
      { photo: "portLattePoire", label: "En situation" },
    ],
    contents: sirops.map((s) => s.slug),
    complements: [poudres[0].slug, poudres[3].slug],
    faq: [...FAQ, { q: "Peut-on composer son propre coffret ?", a: "C'est une idée à l'étude. Pour cette démonstration, le coffret réunit les quatre sirops de la collection." }],
    seo: "Coffret Découverte de démonstration Maison Sillage : les quatre sirops saisonniers en 25 cl.",
  },
  {
    slug: "pistache-fleur-de-sel",
    name: "Pistache & Fleur de sel",
    flavor: "Pistache & Fleur de sel",
    category: "sirop",
    season: null,
    status: "a-venir",
    profiles: ["fruits-secs", "patissier"],
    notes: ["Pistache torréfiée", "Pointe de sel", "Beurre noisette"],
    tagline: "Une création encore dans le carnet de bord.",
    story: [
      "Une pistache juste torréfiée et quelques cristaux de sel qui réveillent la gourmandise. Cette création est à l'étude : elle rejoindra peut-être la collection lors d'une prochaine édition.",
      "Elle est présentée ici pour montrer la direction aromatique explorée, pas comme un produit disponible.",
    ],
    usages: ["latte", "frappe", "dessert"],
    usageIdeas: [{ title: "Latte salé-sucré", text: "L'idée de départ : un latte où la pistache rencontre une pointe de sel." }],
    formats: SIROP,
    image: null,
    gallery: [],
    complements: ["poire-fondante-vanille-bourbon", "coffret-decouverte"],
    faq: [{ q: "Quand cette édition sera-t-elle disponible ?", a: "Aucune date n'est fixée. Il s'agit d'une piste de création, qui pourra évoluer ou ne pas être retenue." }, ...FAQ.slice(1, 2)],
    seo: "Pistache & Fleur de sel, future édition à l'étude chez Maison Sillage.",
  },
];

export const getProduct = (slug: string) => products.find((p) => p.slug === slug);
export const productsByCategory = (c: Product["category"]) => products.filter((p) => p.category === c);
export const productsBySeason = (s: Product["season"]) => products.filter((p) => p.season === s);
export const signatureSirops = () => sirops;
export const signaturePoudres = () => poudres;
export const purchasable = (p: Product) => p.status !== "a-venir";
export const startingPrice = (p: Product) => p.formats.filter((f) => f.public === "particulier")[0] ?? p.formats[0];
export const categoryShort = { sirop: "Sirop", poudre: "Préparation en poudre", coffret: "Coffret" } as const;

import type { Profile, Season, SeasonId, Usage, RecipeCategory } from "@/lib/types";

export const seasons: Season[] = [
  {
    id: "printemps",
    name: "Printemps",
    numeral: "I",
    chapter: "Le jardin au retour du large",
    accent: "#c27a88",
    intro:
      "On rentre au port, les vergers sont en fleurs. Le printemps de Maison Sillage a le goût des goûters retrouvés : fruits rouges, biscuits encore tièdes, vanille douce.",
    carnet: "Premier jour à terre. Des fraises dans un cornet de papier, et l'odeur du beurre qui dore.",
    ambiance: ["Jardin fleuri", "Lumière douce", "Fruits rouges"],
    landscape: "paysagePrintemps",
    collection: "collectionPrintemps",
    details: ["fleursBlanches", "fraises"],
    scene: "scenePrintemps",
  },
  {
    id: "ete",
    name: "Été",
    numeral: "II",
    chapter: "Les terrasses de la Méditerranée",
    accent: "#2a8a95",
    intro:
      "Le soleil de l'après-midi, l'ombre d'un oranger, un verre qui perle. L'été se boit glacé, pétillant, floral, avec des fruits à chair blanche.",
    carnet: "Escale à midi. Pêches au marché, fleurs d'oranger sur le quai : tout embaume.",
    ambiance: ["Mer bleue", "Soleil doré", "Boissons glacées"],
    landscape: "paysageEte",
    collection: "collectionEte",
    details: ["peches", "fleursAgrumes"],
    scene: "sceneEte",
  },
  {
    id: "automne",
    name: "Automne",
    numeral: "III",
    chapter: "Le verger aux premières brumes",
    accent: "#b4652a",
    intro:
      "Les jours raccourcissent, on revient aux boissons chaudes. L'automne réunit les poires fondantes, la vanille et les épices d'un comptoir lointain.",
    carnet: "Brume sur l'estuaire. Dans la cale, des sacs de cannelle ; à bord, une poire qui compote doucement.",
    ambiance: ["Feuilles dorées", "Bois chaleureux", "Café gourmand"],
    landscape: "paysageAutomne",
    collection: "collectionAutomne",
    details: ["poires", "cannelle"],
    scene: "sceneAutomne",
  },
  {
    id: "hiver",
    name: "Hiver",
    numeral: "IV",
    chapter: "La veillée au coin du feu",
    accent: "#7a5a48",
    intro:
      "Dehors la neige, dedans les tasses fument. L'hiver est la saison des saveurs profondes : dattes caramélisées, cacao, sucre brûlé.",
    carnet: "Port d'hiver. Un chocolat épais, une crème brûlée qu'on partage : la traversée peut attendre.",
    ambiance: ["Cheminée", "Lumière feutrée", "Boissons chaudes"],
    landscape: "paysageHiver",
    collection: "collectionHiver",
    details: ["dattes", "chocolat"],
    scene: "sceneHiver",
  },
];

export const getSeason = (id: SeasonId) => seasons.find((s) => s.id === id)!;

export const profileLabels: Record<Profile, string> = {
  fruite: "Fruité",
  floral: "Floral",
  patissier: "Pâtissier",
  "fruits-secs": "Fruits secs & caramel",
};

export const usageLabels: Record<Usage, string> = {
  latte: "Latte",
  cafe: "Café",
  "latte-glace": "Iced latte",
  mocktail: "Mocktail sans alcool",
  limonade: "Limonade",
  chocolat: "Chocolat chaud",
  frappe: "Frappé",
  milkshake: "Milkshake",
  dessert: "Dessert",
};

export const recipeCategoryLabels: Record<RecipeCategory, string> = {
  cafe: "Café",
  latte: "Latte",
  "latte-glace": "Iced latte",
  chocolat: "Chocolat chaud",
  mocktail: "Mocktail sans alcool",
  milkshake: "Milkshake",
  frappe: "Frappé",
  dessert: "Dessert",
};

export const categoryLabels = {
  sirop: "Sirop signature",
  poudre: "Préparation en poudre",
  coffret: "Coffret",
} as const;

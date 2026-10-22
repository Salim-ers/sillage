/* ──────────────────────────────────────────────────────────────
   Registre central des photographies.
   Chaque emplacement du site pioche ici : un seul endroit pour
   attribuer, remplacer ou recadrer une image.
   Sources : packs « Produits 4 saisons », « Ambiances 4 saisons »
   et série maritime (MS.zip), intégrés par scripts/assets.py.
   Toutes sont des mises en scène de démonstration.
   ────────────────────────────────────────────────────────────── */

export type Photo = {
  src: string;
  w: number;
  h: number;
  alt: string;
  /** point focal pour object-position (ex. "50% 30%") */
  pos?: string;
};

const p = (src: string, w: number, h: number, alt: string, pos?: string): Photo => ({ src, w, h, alt, pos });

export const photos = {
  /* ── histoire / voyage (sans produit) ── */
  terrasseVoilier: p("/images/story/terrasse-voilier.jpg", 1672, 941, "Trois-mâts au large d'un village côtier, vu depuis une terrasse de pierre au soleil couchant", "40% 50%"),
  voilierCouchant: p("/images/story/voilier-couchant.jpg", 1672, 941, "Grand voilier glissant vers le soleil couchant, côte rocheuse et village ancien", "30% 55%"),
  quaiLanterne: p("/images/story/quai-lanterne.jpg", 1672, 941, "Quai de pierre, lanterne et jasmin, un trois-mâts dans la lumière du soir", "45% 45%"),
  lanterneJasmin: p("/images/story/lanterne-jasmin.jpg", 736, 920, "Lanterne ancienne et jasmin en fleurs devant la mer au couchant", "50% 40%"),

  /* ── scènes de marque ── */
  portLattePoire: p("/images/lifestyle/port-latte-poire.jpg", 1672, 941, "Latte glacé à la poire, flacon et sachet Maison Sillage sur un muret face au port", "62% 55%"),
  quatreSirops: p("/images/lifestyle/quatre-sirops.jpg", 1672, 941, "Les quatre sirops saisonniers alignés sur une planche, face à la mer", "50% 55%"),
  quatrePoudres: p("/images/lifestyle/quatre-poudres.jpg", 1672, 941, "Les quatre préparations en poudre et leurs matières premières", "50% 50%"),
  comptoir: p("/images/lifestyle/comptoir-port.jpg", 1090, 613, "Comptoir de bar face au port : latte glacé, boisson pétillante et flacon Maison Sillage", "45% 55%"),
  scenePrintemps: p("/images/lifestyle/scene-printemps.jpg", 1672, 941, "Printemps : milkshake fraise, flacon et sachet parmi les fleurs de cerisier", "62% 55%"),
  sceneEte: p("/images/lifestyle/scene-ete.jpg", 1672, 941, "Été : boisson glacée à la pêche, flacon et sachet face à la baie", "62% 55%"),
  sceneAutomne: p("/images/lifestyle/scene-automne.jpg", 1672, 941, "Automne : latte à la poire, flacon et sachet parmi les feuilles dorées", "62% 55%"),
  sceneHiver: p("/images/lifestyle/scene-hiver.jpg", 1672, 941, "Hiver : latte à la crème brûlée, flacon et sachet près d'une cheminée", "55% 55%"),
  scenePrintempsPortrait: p("/images/lifestyle/scene-printemps-portrait.jpg", 753, 941, "Milkshake fraise et madeleines, flacon et sachet Fraise des bois & Madeleine dorée"),
  sceneEtePortrait: p("/images/lifestyle/scene-ete-portrait.jpg", 753, 941, "Boisson glacée à la pêche, flacon et sachet Pêche blanche & Fleur d'oranger"),
  sceneAutomnePortrait: p("/images/lifestyle/scene-automne-portrait.jpg", 753, 941, "Latte à la poire, flacon et sachet Poire fondante & Vanille Bourbon"),
  sceneHiverPortrait: p("/images/lifestyle/scene-hiver-portrait.jpg", 753, 941, "Latte à la crème brûlée, flacon et sachet Datte Medjool & Crème brûlée"),

  /* ── produits ── */
  siropFraise: p("/images/products/sirop-fraise-madeleine.webp", 585, 960, "Flacon Fraise des bois & Madeleine dorée, fraises et madeleines", "50% 40%"),
  siropPeche: p("/images/products/sirop-peche-fleur-oranger.webp", 585, 960, "Flacon Pêche blanche & Fleur d'oranger, pêches et fleurs blanches", "50% 40%"),
  siropPoire: p("/images/products/sirop-poire-vanille.webp", 585, 960, "Flacon Poire fondante & Vanille Bourbon, poires et gousses de vanille", "50% 40%"),
  siropDatte: p("/images/products/sirop-datte-creme-brulee.webp", 585, 960, "Flacon Datte Medjool & Crème brûlée, dattes et crème brûlée", "50% 40%"),
  poudreFraise: p("/images/products/poudre-fraise-madeleine.webp", 555, 870, "Sachet de préparation Fraise des bois & Madeleine dorée et milkshake", "55% 40%"),
  poudrePeche: p("/images/products/poudre-peche-fleur-oranger.webp", 555, 870, "Sachet de préparation Pêche blanche & Fleur d'oranger et boisson glacée", "55% 40%"),
  poudrePoire: p("/images/products/poudre-poire-vanille.webp", 555, 870, "Sachet de préparation Poire fondante & Vanille Bourbon et latte", "55% 40%"),
  poudreDatte: p("/images/products/poudre-datte-creme-brulee.webp", 555, 870, "Sachet de préparation Datte Medjool & Crème brûlée et crème brûlée", "55% 40%"),
  coffret: p("/images/products/coffret-quatre-saisons.jpg", 1000, 901, "Les quatre flacons du Coffret Découverte", "50% 55%"),

  /* ── collections saisonnières ── */
  collectionPrintemps: p("/images/seasons/collection-printemps.webp", 1122, 1402, "Collection printemps sous les cerisiers en fleurs, face à la mer"),
  collectionEte: p("/images/seasons/collection-ete.webp", 1122, 1402, "Collection été sur une terrasse méditerranéenne"),
  collectionAutomne: p("/images/seasons/collection-automne.webp", 1122, 1402, "Collection automne parmi les feuilles et les poires"),
  collectionHiver: p("/images/seasons/collection-hiver.webp", 1122, 1402, "Collection hiver au coin du feu"),
  paysagePrintemps: p("/images/seasons/paysage-printemps.webp", 1920, 1080, "Terrasse d'une maison de pierre en fleurs dominant une baie", "50% 50%"),
  paysageEte: p("/images/seasons/paysage-ete.webp", 1920, 1080, "Terrasse côtière lumineuse avec panorama sur la mer", "50% 50%"),
  paysageAutomne: p("/images/seasons/paysage-automne.webp", 1920, 1080, "Village et vallée sous un grand arbre aux feuilles d'automne", "50% 50%"),
  paysageHiver: p("/images/seasons/paysage-hiver.webp", 1920, 1080, "Fenêtre enneigée, lanterne et tasse fumante", "55% 50%"),
  fleursBlanches: p("/images/seasons/detail-fleurs-blanches.webp", 607, 607, "Fleurs roses et blanches dans une lumière douce"),
  fraises: p("/images/seasons/detail-fraises.webp", 603, 603, "Fraises parmi des fleurs blanches"),
  peches: p("/images/seasons/detail-peches.webp", 605, 605, "Pêches gorgées de soleil dans un panier"),
  fleursAgrumes: p("/images/seasons/detail-fleurs-agrumes.webp", 740, 810, "Floraison blanche dans la lumière d'été"),
  poires: p("/images/seasons/detail-poires.webp", 627, 627, "Poires mûres dans le verger"),
  cannelle: p("/images/seasons/detail-cannelle.webp", 627, 627, "Cannelle, badiane et épices sur une planche ancienne"),
  dattes: p("/images/seasons/detail-dattes.webp", 627, 627, "Dattes dans une coupe de laiton ciselé"),
  chocolat: p("/images/seasons/detail-chocolat.webp", 627, 627, "Carrés de chocolat noir et poudre de cacao"),

  /* ── recettes ── */
  milkshakeFraise: p("/images/recipes/milkshake-fraise.webp", 520, 690, "Milkshake fraise et madeleine, chantilly et fraise fraîche"),
  limonadePeche: p("/images/recipes/limonade-peche.webp", 520, 690, "Boisson pétillante à la pêche blanche, glaçons et fleur d'oranger"),
  icedLattePoire: p("/images/recipes/iced-latte-poire.webp", 520, 690, "Latte glacé à la poire et à la vanille, chantilly et caramel"),
  latteDatte: p("/images/recipes/latte-datte.webp", 520, 690, "Latte à la datte, éclats de crème brûlée"),
  cafeGlace: p("/images/recipes/cafe-glace-poire.jpg", 380, 475, "Café glacé poire-vanille servi au comptoir"),
  cremeBrulee: p("/images/recipes/creme-brulee-datte.jpg", 480, 581, "Crème brûlée à la datte, cuillère et éclats de caramel", "50% 75%"),
  lattePort: p("/images/recipes/latte-port.jpg", 440, 550, "Café crème glacé à la poire, servi face au port"),
} satisfies Record<string, Photo>;

export type PhotoKey = keyof typeof photos;

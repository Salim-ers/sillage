import type { Article } from "@/lib/types";

/* Articles d'exemple : ils illustrent la ligne éditoriale du futur Journal. */

export const articles: Article[] = [
  {
    slug: "petite-histoire-du-sirop",
    title: "Petite histoire du sirop",
    rubrique: "Histoire",
    lecture: "5 min",
    image: "quatreSirops",
    chapo:
      "Avant d'être versé dans un latte, le sirop a longtemps vécu dans les officines. Retour sur un mot venu de loin et sur une préparation qui a beaucoup voyagé.",
    body: [
      { type: "p", text: "Le mot « sirop » a traversé la Méditerranée. Il vient de l'arabe sharāb, qui désigne une boisson, passé en latin médiéval sous la forme siropus avant de s'installer dans le français. Dès son origine, il raconte donc un voyage : celui des savoirs et des saveurs entre les rives." },
      { type: "h2", text: "Une affaire d'apothicaires" },
      { type: "p", text: "Pendant des siècles, le sirop appartient d'abord aux apothicaires. Le sucre, rare et coûteux, sert à conserver les plantes et à adoucir les remèdes. Les pots en faïence alignés sur les étagères des officines portent des étiquettes calligraphiées : c'est de cet univers que s'inspirent, aujourd'hui, nos propres étiquettes." },
      { type: "p", text: "À mesure que le sucre devient plus accessible, la préparation quitte peu à peu le domaine du soin pour celui du plaisir. On parfume l'eau, on rafraîchit les étés, on invente des boissons de comptoir." },
      { type: "quote", text: "Un sirop est une saveur mise en réserve, pour plus tard." },
      { type: "h2", text: "Du comptoir à la tasse" },
      { type: "p", text: "Au fil du XIXe et du XXe siècle, les sirops s'invitent dans les cafés et les débits de boissons, puis dans les cuisines. Plus récemment, la culture des coffee shops leur a offert un nouveau terrain de jeu : le latte, le cappuccino, les boissons glacées." },
      { type: "p", text: "C'est cette histoire que Maison Sillage veut prolonger, en traitant le sirop comme une création à part entière : une saveur composée, pensée pour plusieurs usages, et assez singulière pour laisser une empreinte." },
    ],
  },
  {
    slug: "l-art-du-latte",
    title: "L'art du latte, sans machine de bar",
    rubrique: "Technique",
    lecture: "6 min",
    image: "icedLattePoire",
    chapo:
      "Un bon latte tient en trois gestes : un café juste, un lait bien texturé, et une saveur dosée avec retenue. Quelques principes pour y parvenir à la maison.",
    body: [
      { type: "p", text: "Le latte est une boisson d'équilibre. Le café doit rester présent, le lait apporter de la rondeur sans tout couvrir, et la saveur ajoutée se deviner plutôt que s'imposer. C'est pour cette raison que nos recettes proposent des dosages modérés, à ajuster selon votre goût." },
      { type: "h2", text: "Le lait, d'abord" },
      { type: "p", text: "Une mousse réussie est fine, brillante, presque liquide : on parle de micro-mousse. Elle s'obtient en incorporant un peu d'air au début du chauffage, puis en faisant tourner le lait sur lui-même. Au-delà d'environ 65 °C, le lait perd en douceur et la mousse se dégrade." },
      { type: "p", text: "Sans buse vapeur, un mousseur électrique ou même un bocal fermé, secoué puis passé quelques secondes au micro-ondes, donnent un résultat honnête." },
      { type: "h2", text: "L'ordre des gestes" },
      { type: "p", text: "Versez la saveur en premier, au fond de la tasse, puis le café : la chaleur aide les arômes à se lier. Le lait vient ensuite, d'abord en filet haut pour plonger sous la crème du café, puis plus près de la surface pour déposer la mousse." },
      { type: "quote", text: "Le meilleur dosage est celui qu'on oublie : on goûte la boisson, pas le sirop." },
      { type: "p", text: "Enfin, préchauffez toujours la tasse. Ce détail, que les baristas connaissent bien, change la tenue de la mousse et la température de la première gorgée." },
    ],
  },
  {
    slug: "boissons-gourmandes-de-saison",
    title: "Quatre saisons, quatre façons de boire",
    rubrique: "Saisons",
    lecture: "4 min",
    image: "paysageAutomne",
    chapo:
      "Pourquoi une collection saisonnière ? Parce que nos envies changent avec la lumière, et qu'une boisson réussie est d'abord une boisson qui tombe au bon moment.",
    body: [
      { type: "p", text: "Les pâtissiers le savent depuis longtemps : une fraise n'a pas le même sens en mai et en décembre. Nous avons construit la collection Maison Sillage sur ce principe simple, en associant chaque création à la saison où elle se boit le plus naturellement." },
      { type: "h2", text: "Du fruité au profond" },
      { type: "p", text: "Le printemps appelle les fruits rouges et les biscuits ; l'été, les fruits blancs, les fleurs et la glace ; l'automne, les fruits compotés et les épices ; l'hiver, le caramel et le cacao. D'une saison à l'autre, les saveurs gagnent en profondeur, comme la lumière baisse." },
      { type: "quote", text: "Une saison n'est pas une contrainte, c'est une humeur." },
      { type: "p", text: "Cela ne signifie pas qu'une création soit réservée à son trimestre : une poire vanillée peut très bien se boire glacée en juillet. Les saisons sont une manière de raconter la collection, pas une règle." },
    ],
  },
  {
    slug: "imaginer-une-carte-de-boissons",
    title: "Comment imaginer une carte de boissons originale",
    rubrique: "Professionnels",
    lecture: "7 min",
    image: "comptoir",
    chapo:
      "Pour un coffee shop, un salon de thé ou un hôtel, la carte des boissons est souvent la première chose qu'on lit. Quelques pistes pour la rendre singulière sans la compliquer.",
    body: [
      { type: "p", text: "Une carte de boissons mémorable n'est pas forcément longue. Elle a une colonne vertébrale (les classiques bien exécutés) et quelques signatures qui donnent envie de revenir. C'est sur ces signatures que des créations aromatiques peuvent faire la différence." },
      { type: "h2", text: "Une saveur, plusieurs usages" },
      { type: "p", text: "Le principe que nous défendons est simple : une même création doit pouvoir servir plusieurs boissons. Un sirop pensé pour le latte peut aussi parfumer une limonade maison, un milkshake ou un dessert. Cela limite le nombre de références, tout en multipliant les propositions." },
      { type: "h2", text: "Raconter, sans en faire trop" },
      { type: "p", text: "Une boisson signature gagne à porter un nom évocateur et une description courte, qui parle de goût plutôt que de technique. « Latte poire & vanille, comme une tarte d'automne » en dit plus qu'une liste d'ingrédients." },
      { type: "quote", text: "Une bonne signature se commande une fois par curiosité, puis par habitude." },
      { type: "p", text: "Enfin, la saisonnalité est un excellent prétexte pour renouveler la carte sans tout changer : deux ou trois boissons qui tournent avec les saisons suffisent à créer un rendez-vous avec la clientèle." },
    ],
  },
  {
    slug: "l-inspiration-des-routes-maritimes",
    title: "Sur la trace des anciennes routes maritimes",
    rubrique: "Inspirations",
    lecture: "6 min",
    image: "voilierCouchant",
    chapo:
      "Vanille, cannelle, cacao, fleur d'oranger : beaucoup des saveurs qui nous sont familières ont d'abord traversé des océans. Une promenade dans l'imaginaire qui a donné son nom à la Maison.",
    body: [
      { type: "p", text: "Le sillage, c'est la trace qu'un navire laisse derrière lui sur l'eau. C'est aussi, en parfumerie, l'empreinte qu'un parfum laisse dans l'air après le passage de celui qui le porte. Nous avons voulu transposer cette double image dans l'univers du goût." },
      { type: "h2", text: "Des saveurs voyageuses" },
      { type: "p", text: "La vanille est originaire du Mexique. Pendant longtemps, elle n'a pu être cultivée ailleurs faute de pollinisation : c'est en 1841, à La Réunion, qu'un jeune homme de douze ans, Edmond Albius, met au point la pollinisation manuelle encore pratiquée aujourd'hui. La cannelle, le cacao, la cardamome ont eux aussi changé de continent au gré des routes commerciales." },
      { type: "p", text: "Ces histoires nous inspirent un vocabulaire visuel — cartes anciennes, gravures, carnets de bord — mais Maison Sillage ne prétend pas en être l'héritière. Nous sommes une jeune maison, en phase de conception, qui emprunte à cet imaginaire sa curiosité et son goût du lointain." },
      { type: "quote", text: "Chaque saveur a fait un voyage avant d'arriver dans la tasse." },
      { type: "p", text: "C'est cette curiosité que nous voulons partager : rappeler que derrière une note de vanille ou d'épice, il y a des paysages, des mains et des siècles d'échanges." },
    ],
  },
];

export const getArticle = (slug: string) => articles.find((a) => a.slug === slug);

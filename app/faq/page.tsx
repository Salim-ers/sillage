import type { Metadata } from "next";
import { PageIntro } from "@/components/ui/PageIntro";
import { Accordion } from "@/components/ui/Accordion";

export const metadata: Metadata = { title: "Questions fréquentes", description: "Disponibilité, composition, formats, professionnels : les réponses aux questions fréquentes sur Maison Sillage.", alternates: { canonical: "/faq" } };

const GROUPS = [
  {
    title: "Le projet",
    items: [
      { q: "Maison Sillage existe-t-elle déjà ?", a: "Maison Sillage est un projet en phase de conception. Ce site est une démonstration précommerciale : il présente l'univers de la marque et des produits à l'état de prototypes." },
      { q: "Depuis quand la Maison existe-t-elle ?", a: "Le projet est récent. L'esthétique du XIXe siècle est un choix de style : nous ne revendiquons aucune date de fondation historique ni aucun héritage." },
      { q: "Les visuels sont-ils des photographies des produits ?", a: "Non. Les visuels sont des illustrations de démonstration qui présentent le futur système de packaging. Ils seront remplacés par de vraies prises de vue." },
    ],
  },
  {
    title: "Les produits",
    items: [
      { q: "Puis-je acheter une création ?", a: "Pas encore. Le panier et la commande fonctionnent en démonstration uniquement : aucun paiement n'est demandé et aucune commande n'est transmise." },
      { q: "Quelle est la composition des sirops et des poudres ?", a: "Les formulations sont en cours de développement. Les ingrédients, allergènes et informations nutritionnelles seront publiés lorsque les recettes seront finalisées." },
      { q: "Les produits sont-ils bio, halal ou d'origine contrôlée ?", a: "Aucune certification ni origine n'est annoncée à ce stade. Ces informations ne seront communiquées que si elles sont établies et vérifiables." },
      { q: "Les prix affichés sont-ils définitifs ?", a: "Non, ce sont des tarifs indicatifs destinés à la démonstration. Ils ne constituent pas une offre commerciale." },
    ],
  },
  {
    title: "Les professionnels",
    items: [
      { q: "Proposez-vous des formats pour les établissements ?", a: "Une bouteille de 700 ml pour les sirops et un sachet de 1 kg pour les poudres sont envisagés, avec des recettes signatures." },
      { q: "Peut-on recevoir des échantillons ?", a: "C'est prévu dès que la production le permettra. Vous pouvez déjà signaler votre intérêt via le formulaire de l'espace professionnels (démonstration, sans envoi pour l'instant)." },
    ],
  },
];

export default function Faq() {
  return (
    <>
      <PageIntro kicker="Aide" title="Questions fréquentes." />
      <div className="shell max-w-4xl space-y-16 pb-28">
        {GROUPS.map((g) => (
          <section key={g.title}>
            <h2 className="mention text-accent">{g.title}</h2>
            <div className="mt-4">
              <Accordion items={g.items} />
            </div>
          </section>
        ))}
      </div>
    </>
  );
}

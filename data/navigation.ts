export const mainNav = [
  { href: "/", label: "Accueil" },
  { href: "/boutique", label: "Boutique" },
  { href: "/sirops", label: "Les Sirops" },
  { href: "/poudres", label: "Les Poudres" },
  { href: "/collections", label: "Collections" },
  { href: "/maison", label: "Notre Maison" },
  { href: "/recettes", label: "Recettes" },
  { href: "/professionnels", label: "Professionnels" },
] as const;

export const footerNav = {
  maison: [
    { href: "/maison", label: "Notre Maison" },
    { href: "/savoir-faire", label: "Savoir-faire" },
    { href: "/journal", label: "Le Journal" },
    { href: "/collections", label: "Les quatre saisons" },
  ],
  boutique: [
    { href: "/boutique", label: "Toute la boutique" },
    { href: "/sirops", label: "Sirops signatures" },
    { href: "/poudres", label: "Préparations en poudre" },
    { href: "/produits/coffret-decouverte", label: "Coffret Découverte" },
    { href: "/favoris", label: "Mes favoris" },
  ],
  aide: [
    { href: "/faq", label: "Questions fréquentes" },
    { href: "/livraison-retours", label: "Livraison & retours" },
    { href: "/professionnels#demande", label: "Contact professionnel" },
    { href: "/contact", label: "Nous écrire" },
  ],
  legal: [
    { href: "/mentions-legales", label: "Mentions légales" },
    { href: "/cgv", label: "Conditions de vente" },
    { href: "/confidentialite", label: "Confidentialité" },
  ],
};

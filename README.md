# Maison Sillage — site de démonstration précommerciale

> Des saveurs qui traversent le temps.

Site e-commerce **fictif** d'une future maison française de sirops et de préparations en poudre. Aucun produit n'est en vente, aucun paiement n'est possible : panier, favoris et commande fonctionnent uniquement en local, à titre de démonstration. Les photographies sont des **mises en scène générées** pour la démonstration (packs « Produits 4 saisons », « Ambiances 4 saisons » et série maritime fournis) : elles ne prouvent ni l'existence des produits, ni ateliers, ni ingrédients, ni certifications.

## Démarrer

```bash
npm install
npm run dev        # http://localhost:3000
npm run build && npm start
```

Déploiement : importer le dossier dans Vercel (aucune variable d'environnement requise). Pour des URL canoniques et un sitemap exacts, définir `NEXT_PUBLIC_SITE_URL` (ex. `https://maison-sillage.fr`).

## Pile technique

- Next.js 16 (App Router, Turbopack), React 19, TypeScript
- Tailwind CSS 4 — jetons sémantiques (`paper`, `ink`, `deep`, `gold`, `accent`…) branchés sur les variables d'ambiance
- Motion pour les animations ; Lucide pour quelques icônes fonctionnelles
- `next/image` (AVIF/WebP, tailles adaptées) pour toutes les photographies
- Polices auto-hébergées (`@fontsource`) : Cormorant Garamond + Manrope

## Catalogue

Quatre saveurs saisonnières, chacune en **sirop** et en **préparation en poudre** :

| Saison | Saveur | Sirop | Poudre |
|---|---|---|---|
| Printemps | Fraise des bois & Madeleine dorée | 25 cl · 12,90 € TTC / 70 cl · 14,90 € HT | 250 g · 13,90 € TTC / 1 kg · 28,90 € HT |
| Été | Pêche blanche & Fleur d'oranger | idem | idem |
| Automne | Poire fondante & Vanille Bourbon | idem | idem |
| Hiver | Datte Medjool & Crème brûlée | idem | idem |

Plus le **Coffret Découverte** (4 × 25 cl, 46,90 € TTC) et « Pistache & Fleur de sel », édition à venir, non achetable et sans visuel. Prix indicatifs.

## Système d'ambiances & saisons

La boussole de l'en-tête règle deux sélecteurs indépendants — **lumière** (jour, coucher de soleil, nuit) et **saison** (printemps, été, automne, hiver) — soit 12 combinaisons. Par défaut : été au coucher de soleil.

- `data/ambiances.ts` — palettes par lumière et accents par saison ; génère le CSS (`ambianceCss()`) : variables `@property` animables (`--a-paper`, `--a-ink`, `--a-deep`, `--a-gold`, `--a-accent`…) et une règle par combinaison `:root[data-season][data-light]`. Tout le site (en-tête, boutons, fonds, cartes, pied de page) se recolore en 0,8–1,1 s.
- Script d'amorçage en ligne dans `<head>` : applique le choix enregistré (`localStorage`) **avant le premier rendu**, sans flash.
- `lib/ambiance.tsx` — état partagé (`useSyncExternalStore`), persistance, mode **automatique** (selon l'heure locale, calculé une fois par session : l'ambiance ne change jamais pendant la navigation), préchargement de la seule photographie de la prochaine transition.
- `components/ambiance/HeroStage.tsx` — 12 plaques photographiques superposées ; seule l'active est chargée. Fondu enchaîné entre vraies photos, attendu jusqu'au chargement de la nouvelle image (jamais d'écran noir), avec effets calés sur la photo : halo du soleil, lune, étoiles et lanternes qui s'allument une à une la nuit.
- `Particles.tsx` — pétales, lucioles, feuilles ou neige selon la saison ; allégé sur mobile, suspendu hors écran, absent en mouvement réduit.
- `AmbianceSwitcher.tsx` — boussole (aiguille par saison, cadran par lumière), panneau accessible au clavier (radiogroupes, flèches), feuille basse sur mobile.
- `prefers-reduced-motion` : transitions remplacées par un changement immédiat, aucune particule.

**Origine des 12 plaques du hero** : la photographie « été · coucher de soleil » est l'originale (légère retouche de la mer). Les 11 autres sont des **recompositions** de cette même photo maîtresse (ciel remplacé, feuillage recoloré, étalonnage nuit, neige sur les surfaces, lune, étoiles, lanternes) produites par `scripts/ambiance/` (Python/OpenCV). Ce ne sont pas 12 prises de vue distinctes.

## Photographies

- `public/images/{hero,products,seasons,lifestyle,recipes,story}` — fichiers intégrés et recadrés par `scripts/assets.py`.
- `data/images.ts` — **registre central** : chaque emplacement du site pioche une clé (source, dimensions, texte alternatif, point focal). Remplacer une photo = changer une ligne.
- `components/ui/Photo.tsx` — ratio imposé (jamais d'image étirée), point focal, révélation par masque, parallaxe, voile de lumière selon l'ambiance.

### Visuels manquants ou insuffisants

- **Chocolat chaud** : aucune photo de boisson finie ; la recette utilise un détail cacao/chocolat.
- **Frappé** : aucune photo ; la recette utilise un détail fraises.
- **Café chaud / espresso** : aucune photo dédiée (café glacé utilisé pour « café »).
- **Pistache & Fleur de sel** : aucun visuel (« Visuel en préparation » affiché).
- Photo de comptoir (ms07) : les flacons portent des étiquettes génériques (« Caramel fleur de sel », « Vanille Poire ») ; elle est recadrée pour les écarter.
- Résolution : les sources font 1 672 px de large ; le hero mobile et certains recadrages en sont limités (les exports « 4K » fournis sont des agrandissements).

## Arborescence

```
app/                       routes (accueil, boutique, sirops, poudres, produits/[slug], collections, maison,
                           savoir-faire, recettes/[slug], professionnels, journal/[slug], panier, commande,
                           favoris, faq, pages légales, sitemap, robots)
components/ambiance/       boussole, scène du hero, particules, voile de transition, script d'amorçage
components/home/           sections de l'accueil (hero, monde, créations, saisons, histoire, usages, sélection, poudres, pro)
components/products/       carte produit, catalogue filtrable, fiche, galerie, favoris
components/cart/           tiroir panier, commande simulée
components/editorial/      chapitres saisonniers, recettes, formulaire pro, pages texte
components/ui/             logo, Photo, accordéon, quantité, newsletter
data/                      ambiances.ts, images.ts, products.ts, collections.ts, recipes.ts, journal.ts, navigation.ts
lib/                       ambiance, panier & favoris (localStorage), recherche, mouvement réduit
public/brand/              logo officiel détouré (clair / sombre), emblème compact
public/images/             photographies (voir ci-dessus)
scripts/                   intégration des images, génération des ambiances, audits Playwright
```

## Logo

Le logo fourni n'a pas été redessiné : `scripts/process_logo.py` retire seulement le fond papier et produit `logo-light`, `logo-dark` (même tracé recoloré ivoire et or) et `emblem-*`, un recadrage du médaillon existant.

## Contenus fictifs et garde-fous

- Ingrédients marqués « formulation en cours » ; aucune valeur nutritionnelle, certification, origine ou mention halal.
- Aucune fausse date de fondation, aucun faux avis, aucune référence client inventée.
- Pages légales, livraison et retours : emplacements préparés, « à compléter avant commercialisation ».

## Vérifications

Avec un serveur lancé (`scripts/serve-prod.sh` démarre une version de production sur le port 3100) :

```bash
python3 scripts/audit.py http://localhost:3100 ./captures         # 44 routes ordinateur + mobile : liens, images, débordements, console
python3 scripts/check-images.py http://localhost:3100              # chaque photo visible est réellement chargée
python3 scripts/interactions.py http://localhost:3100 ./captures  # ambiances, panier, filtres, recherche, favoris, commande, pro, mobile, mouvement réduit
python3 scripts/perf.py http://localhost:3100                      # LCP, CLS, poids du premier chargement (indicatif)
```

## Pour passer en production réelle

1. Remplacer les mises en scène par de vraies photographies (une ligne par image dans `data/images.ts`), en priorité les visuels manquants ci-dessus.
2. Brancher une solution e-commerce (Shopify Hydrogen, Medusa, Stripe…) derrière `lib/store.tsx`.
3. Relier les formulaires (newsletter, demande pro) à un service d'envoi.
4. Compléter mentions légales, CGV, politique de confidentialité, livraison et retours.

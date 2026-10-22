"""Intègre les photographies fournies dans public/images/ (recadrages manuels, aucune déformation).

usage : python3 scripts/assets.py dossier_sources
  dossier_sources/
    src/ms00.png … ms11.png             (archive MS.zip, renommée dans l'ordre)
    produits/public/images/…            (pack produits 4 saisons)
    ambiances/<saison>/…                (pack ambiances 4 saisons)
Les plaques d'ambiance du hero sont produites par scripts/ambiance/generate.py.
"""
import sys, os, shutil
from PIL import Image

SRC = sys.argv[1]
OUT = os.path.join(os.path.dirname(__file__), "..", "public", "images")

# (source, boîte x0,y0,x1,y1 ou None, destination)
MS = lambda n: f"{SRC}/src/ms{n:02d}.png"
JOBS = [
    # ── histoire / maritime (sans produit) ──
    (MS(10), None, "story/terrasse-voilier.jpg"),
    (MS(9), None, "story/voilier-couchant.jpg"),
    (MS(8), None, "story/quai-lanterne.jpg"),
    (MS(8), (0, 0, 736, 920), "story/lanterne-jasmin.jpg"),
    # ── scènes de marque ──
    (MS(0), None, "lifestyle/port-latte-poire.jpg"),
    (MS(1), None, "lifestyle/quatre-sirops.jpg"),
    (MS(2), None, "lifestyle/quatre-poudres.jpg"),
    (MS(7), (0, 150, 1090, 763), "lifestyle/comptoir-port.jpg"),
    (MS(3), None, "lifestyle/scene-printemps.jpg"),
    (MS(4), None, "lifestyle/scene-ete.jpg"),
    (MS(5), None, "lifestyle/scene-automne.jpg"),
    (MS(6), None, "lifestyle/scene-hiver.jpg"),
    (MS(3), (740, 0, 1493, 941), "lifestyle/scene-printemps-portrait.jpg"),
    (MS(4), (660, 0, 1413, 941), "lifestyle/scene-ete-portrait.jpg"),
    (MS(5), (760, 0, 1513, 941), "lifestyle/scene-automne-portrait.jpg"),
    (MS(6), (640, 0, 1393, 941), "lifestyle/scene-hiver-portrait.jpg"),
    (MS(1), (330, 40, 1330, 941), "products/coffret-quatre-saisons.jpg"),
    # ── recettes (gros plans) ──
    (MS(7), (380, 300, 760, 775), "recipes/cafe-glace-poire.jpg"),
    (MS(6), (960, 360, 1440, 941), "recipes/creme-brulee-datte.jpg"),
    (MS(0), (640, 255, 1080, 805), "recipes/latte-port.jpg"),
]

PACK = {
    "products/sirop-fraise-madeleine.webp": "produits/public/images/sirops/fraise-madeleine.webp",
    "products/sirop-peche-fleur-oranger.webp": "produits/public/images/sirops/peche-fleur-oranger.webp",
    "products/sirop-poire-vanille.webp": "produits/public/images/sirops/poire-vanille.webp",
    "products/sirop-datte-creme-brulee.webp": "produits/public/images/sirops/datte-creme-brulee.webp",
    "products/poudre-fraise-madeleine.webp": "produits/public/images/poudres/fraise-madeleine.webp",
    "products/poudre-peche-fleur-oranger.webp": "produits/public/images/poudres/peche-fleur-oranger.webp",
    "products/poudre-poire-vanille.webp": "produits/public/images/poudres/poire-vanille.webp",
    "products/poudre-datte-creme-brulee.webp": "produits/public/images/poudres/datte-creme-brulee.webp",
    "seasons/collection-printemps.webp": "produits/public/images/collections/printemps-fraise-madeleine.webp",
    "seasons/collection-ete.webp": "produits/public/images/collections/ete-peche-fleur-oranger.webp",
    "seasons/collection-automne.webp": "produits/public/images/collections/automne-poire-vanille.webp",
    "seasons/collection-hiver.webp": "produits/public/images/collections/hiver-datte-creme-brulee.webp",
    "recipes/milkshake-fraise.webp": "produits/public/images/recettes/fraise-madeleine.webp",
    "recipes/limonade-peche.webp": "produits/public/images/recettes/peche-fleur-oranger.webp",
    "recipes/iced-latte-poire.webp": "produits/public/images/recettes/poire-vanille.webp",
    "recipes/latte-datte.webp": "produits/public/images/recettes/datte-creme-brulee.webp",
    "seasons/paysage-printemps.webp": "ambiances/printemps/hero-printemps-terrasse.webp",
    "seasons/paysage-ete.webp": "ambiances/ete/hero-ete-vue-mer.webp",
    "seasons/paysage-automne.webp": "ambiances/automne/hero-automne-paysage.webp",
    "seasons/paysage-hiver.webp": "ambiances/hiver/hero-hiver-fenetre.webp",
    "seasons/detail-fleurs-blanches.webp": "ambiances/printemps/fleurs-blanches.webp",
    "seasons/detail-fraises.webp": "ambiances/printemps/fraises-des-bois.webp",
    "seasons/detail-peches.webp": "ambiances/ete/peches-soleil.webp",
    "seasons/detail-fleurs-agrumes.webp": "ambiances/ete/fleurs-agrumes.jpg",
    "seasons/detail-poires.webp": "ambiances/automne/poires-du-verger.webp",
    "seasons/detail-cannelle.webp": "ambiances/automne/cannelle-epices.webp",
    "seasons/detail-dattes.webp": "ambiances/hiver/dattes-naturelles.webp",
    "seasons/detail-chocolat.webp": "ambiances/hiver/chocolat-noir.webp",
}

# Les détails carrés du pack ambiances contiennent un bandeau parasite (bord de planche) en haut :
# on le retire par recadrage carré sur la partie basse.
TRIM_TOP = {"seasons/detail-fleurs-blanches.webp", "seasons/detail-fraises.webp", "seasons/detail-peches.webp",
            "seasons/detail-poires.webp", "seasons/detail-cannelle.webp",
            "seasons/detail-dattes.webp", "seasons/detail-chocolat.webp"}


def save(im, dest):
    path = os.path.join(OUT, dest)
    os.makedirs(os.path.dirname(path), exist_ok=True)
    if dest.endswith(".jpg"):
        im.convert("RGB").save(path, quality=90, optimize=True, progressive=True, subsampling=0)
    else:
        im.convert("RGB").save(path, quality=90, method=6)
    return im.size


def main():
    manifest = []
    for src, box, dest in JOBS:
        im = Image.open(src).convert("RGB")
        if box:
            im = im.crop(box)
        manifest.append((dest, save(im, dest)))
    for dest, src in PACK.items():
        im = Image.open(os.path.join(SRC, src)).convert("RGB")
        if dest == "seasons/detail-fleurs-agrumes.webp":
            # la source est une planche de quatre vignettes : on isole la floraison
            im = im.crop((460, 390, 1200, 1200))
        elif dest in TRIM_TOP:
            w, h = im.size
            # détecte le liseré blanc qui sépare les vignettes de la planche d'origine
            import numpy as np
            g = np.asarray(im.convert("L"), dtype=np.float32)
            rows = [y for y in range(int(h * 0.3)) if g[y].mean() > 215 and g[y].std() < 28]
            top = (max(rows) + 4) if rows else int(h * 0.13)
            top = max(top, int(h * 0.13))
            side = h - top
            left = (w - side) // 2
            im = im.crop((left, top, left + side, h))
        manifest.append((dest, save(im, dest)))
    for d, s in manifest:
        print(f"{s[0]}x{s[1]}  {d}")


if __name__ == "__main__":
    main()

"""Détourage fidèle du logo Maison Sillage (aucun redessin) :
- version fonds clairs : couleurs d'origine, fond papier retiré par démélange alpha
- version fonds sombres : même tracé, recoloré ivoire / or vieilli
- emblème compact : recadrage du médaillon existant
"""
import sys, numpy as np, cv2
from PIL import Image

src = sys.argv[1]; out = sys.argv[2]
img = np.asarray(Image.open(src).convert("RGB")).astype(np.float32)
h, w, _ = img.shape

# Estimation locale du papier : fermeture morphologique (le papier est plus clair que l'encre)
k = cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (41, 41))
bg0 = cv2.GaussianBlur(cv2.dilate(img, k), (0, 0), 25)
r0 = ((bg0 - img) / np.maximum(bg0, 1)).max(axis=2)
ink = cv2.dilate((r0 > 0.22).astype(np.uint8), np.ones((5, 5), np.uint8)).astype(bool)
fill = img.copy(); fill[ink] = bg0[ink] * 0.965
bg = cv2.GaussianBlur(fill, (0, 0), 18)
bg = np.maximum(bg, img * 0 + bg)

# Alpha par canal le plus "encré"
ratio = (bg - img) / np.maximum(bg, 1)
a = ratio.max(axis=2)
a = np.clip((a - 0.085) / (0.80 - 0.085), 0, 1)     # supprime le grain du papier
a[a < 0.04] = 0
# retire les poussières isolées du papier (petites composantes faibles)
n, lab, stats, _ = cv2.connectedComponentsWithStats((a > 0).astype(np.uint8), 8)
maxa = np.zeros(n); np.maximum.at(maxa, lab.ravel(), a.ravel())
kill = (stats[:, cv2.CC_STAT_AREA] < 30) & (maxa < 0.55)
kill[0] = False
a[kill[lab]] = 0
fg = (img - (1 - a[..., None]) * bg) / np.maximum(a[..., None], 1e-3)
fg = np.clip(fg, 0, 255)

def save(rgb, alpha, name, box=None):
    rgba = np.dstack([rgb, alpha * 255]).astype(np.uint8)
    im = Image.fromarray(rgba, "RGBA")
    if box: im = im.crop(box)
    im.save(f"{out}/{name}.png", optimize=True)
    im.save(f"{out}/{name}.webp", quality=90, method=4)
    return im

# boîte englobante du logo
ys, xs = np.where(a > 0.08)
pad = 18
# cadrage symétrique autour de l'axe du médaillon (x≈627) pour un centrage optique exact
bbox = (627 - 562, int(max(ys.min()-pad,0)), 627 + 562, int(min(ys.max()+pad,h)))
a[:, :bbox[0]] = 0; a[:, bbox[2]:] = 0
print("bbox", bbox)

light = save(fg, a, "logo-light", bbox)

# Version fonds sombres : ivoire pour l'encre, or vieilli pour les dorures (selon saturation d'origine)
hsv = cv2.cvtColor(np.clip(fg,0,255).astype(np.uint8), cv2.COLOR_RGB2HSV).astype(np.float32)
sat = hsv[..., 1] / 255.0
val = hsv[..., 2] / 255.0
gold_w = np.clip((sat - 0.35) / 0.35, 0, 1) * np.clip(val / 0.45, 0, 1)
ivory = np.array([243, 232, 212], np.float32)
gold = np.array([205, 172, 116], np.float32)
dark_rgb = ivory * (1 - gold_w[..., None]) + gold * gold_w[..., None]
save(dark_rgb, np.clip(a * 1.05, 0, 1), "logo-dark", bbox)

# Emblème compact : médaillon (étoile + cercle) issu du logo existant
cx, cy, r = 627, 440, 255
yy, xx = np.mgrid[0:h, 0:w]
R = 287
emb_mask = (((xx-cx)**2 + (yy-cy)**2) < R**2) | ((xx > 545) & (xx < 710) & (yy > 40) & (yy < 200))
emb_mask = cv2.GaussianBlur(emb_mask.astype(np.float32), (0, 0), 1.2)
emb_box = (cx-R-4, 40, cx+R+4, cy+R+4)
save(fg, a*emb_mask, "emblem-light", emb_box)
save(dark_rgb, np.clip(a*1.05,0,1)*emb_mask, "emblem-dark", emb_box)
# Gravure seule (intérieur du médaillon) pour usages décoratifs
mask = ((xx-cx)**2 + (yy-cy)**2) < r**2
save(fg, a*mask, "engraving-ship", (cx-r, cy-r, cx+r, cy+r))
save(dark_rgb, np.clip(a*1.05,0,1)*mask, "engraving-ship-dark", (cx-r, cy-r, cx+r, cy+r))

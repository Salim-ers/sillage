"""Génère les 12 variantes du hero (4 saisons × 3 lumières) à partir de la plaque maîtresse.
Ce ne sont pas des filtres : chaque variante est une image recomposée
(ciel remplacé, mer relustrée, végétation recolorée, neige posée, lumières ajoutées).

usage : python3 scripts/ambiance/generate.py source.png public/images/hero [clé…]
(un dossier se terminant par « hero » reçoit les JPEG du site, tout autre dossier des PNG de contrôle)
"""
import sys, os, numpy as np, cv2
from PIL import Image
sys.path.insert(0, os.path.dirname(__file__))
from plate import build_masks, poly_mask, W, H, HORIZON, SUN, WINDOW_ZONES, QUAY_LAMPS, SHIP_LIGHTS, MOUNTAIN_SNOW, TREE

RNG = np.random.default_rng(7)
YY, XX = np.mgrid[0:H, 0:W].astype(np.float32)


def srgb_to_lin(c):
    return np.where(c <= 0.04045, c / 12.92, ((c + 0.055) / 1.055) ** 2.4)


def lin_to_srgb(c):
    c = np.clip(c, 0, None)
    return np.where(c <= 0.0031308, c * 12.92, 1.055 * np.power(c, 1 / 2.4) - 0.055)


def lab(f):
    return cv2.cvtColor(f.astype(np.float32), cv2.COLOR_RGB2LAB)


def rgb(l):
    return np.clip(cv2.cvtColor(l.astype(np.float32), cv2.COLOR_LAB2RGB), 0, 1)


def mix(a, b, t):
    t = t[..., None] if t.ndim == 2 else t
    return a * (1 - t) + b * t


def smoothstep(e0, e1, x):
    t = np.clip((x - e0) / (e1 - e0), 0, 1)
    return t * t * (3 - 2 * t)


def gradient(top, bottom, y0=0, y1=HORIZON, gamma=1.0):
    t = np.clip((YY - y0) / (y1 - y0), 0, 1) ** gamma
    top, bottom = np.array(top, np.float32) / 255, np.array(bottom, np.float32) / 255
    return top * (1 - t[..., None]) + bottom * t[..., None]


def glow(cx, cy, r, color, strength=1.0, sx=1.0, sy=1.0):
    d2 = ((XX - cx) / sx) ** 2 + ((YY - cy) / sy) ** 2
    g = np.exp(-d2 / (2 * r * r)) * strength
    return g[..., None] * (np.array(color, np.float32) / 255)


def cloud_detail(f, m):
    """Relief des nuages : luminance du ciel moins un ciel lissé."""
    L = lab(f)[..., 0] / 100
    w = m["sky"]
    base = cv2.GaussianBlur(L * w, (0, 0), 40) / (cv2.GaussianBlur(w, (0, 0), 40) + 1e-4)
    d = (L - base) * w
    return d, L


# ───────────────────────────── SAISONS (sur la plaque au couchant) ─────────────────────────────

def season_pass(f, m, season):
    out = f.copy()
    veg = m["veg"]
    hsv = cv2.cvtColor((f * 255).astype(np.uint8), cv2.COLOR_RGB2HSV).astype(np.float32)
    noise = cv2.GaussianBlur(RNG.random((H, W)).astype(np.float32), (0, 0), 6)
    noise = (noise - noise.min()) / (noise.max() - noise.min() + 1e-6)
    if season == "printemps":
        # feuillage tendre (sans excès), floraison rose et blanche dense dans l'olivier et les massifs
        h2 = hsv.copy()
        h2[..., 0] = np.clip(hsv[..., 0] * 0.7 + 40 * 0.3, 0, 179)
        h2[..., 1] = np.clip(hsv[..., 1] * 0.95, 0, 255)
        h2[..., 2] = np.clip(hsv[..., 2] * 1.06 + 4, 0, 255)
        fresh = cv2.cvtColor(h2.astype(np.uint8), cv2.COLOR_HSV2RGB).astype(np.float32) / 255
        out = mix(out, fresh, veg * 0.7)
        # floraison : grappes douces le long des rameaux de l'olivier et sur les massifs
        tree = poly_mask(TREE, 0) * (1 - m["sky"])
        edge = cv2.dilate(m["sky"], np.ones((7, 7), np.uint8)) * tree * (YY < 360)
        shrub = (YY > 540) * (XX > 1360) * veg
        zone = np.clip(edge + shrub, 0, 1)
        ys, xs = np.nonzero(zone > 0.5)
        pick = RNG.choice(len(xs), size=min(1300, len(xs)), replace=False)
        layer = np.zeros((H, W, 3), np.float32); alpha = np.zeros((H, W), np.float32)
        for i in pick:
            cx, cy = int(xs[i]), int(ys[i])
            pink = RNG.random() < 0.7
            base = np.array((0.97, 0.7, 0.8) if pink else (1.0, 0.95, 0.93), np.float32)
            for _ in range(int(RNG.integers(2, 6))):
                x = int(cx + RNG.normal(0, 5)); y = int(cy + RNG.normal(0, 4))
                if not (2 <= x < W - 2 and 2 <= y < H - 2):
                    continue
                r = float(RNG.uniform(2.2, 4.4))
                c = np.clip(base * RNG.uniform(0.88, 1.04), 0, 1)
                stamp = np.zeros((H, W), np.float32)
                x0, x1, y0, y1 = max(0, x - 6), min(W, x + 7), max(0, y - 6), min(H, y + 7)
                d = np.hypot(XX[y0:y1, x0:x1] - x, YY[y0:y1, x0:x1] - y)
                a = smoothstep(r, r * 0.45, d)
                alpha[y0:y1, x0:x1] = np.maximum(alpha[y0:y1, x0:x1], a)
                core = smoothstep(r * 0.3, 0, d)[..., None] * (1.0 if r > 3.6 else 0.0)
                col = c * (0.92 + 0.08 * smoothstep(r, 0, d))[..., None] * (1 - 0.3 * core) + np.array([0.95, 0.8, 0.5], np.float32) * 0.3 * core
                layer[y0:y1, x0:x1] = layer[y0:y1, x0:x1] * (1 - a[..., None]) + col * a[..., None]
        lit = (0.62 + 0.5 * m["lum"])[..., None]
        out = mix(out, np.clip(layer * lit, 0, 1), alpha * 0.9)
    elif season == "automne":
        # le feuillage vire au cuivre, à l'ocre et au rouge ; même les feuilles à contre-jour s'allument
        h2 = hsv.copy()
        h2[..., 0] = 4 + noise * 18
        h2[..., 1] = np.clip(hsv[..., 1] * 1.1 + 70, 0, 255)
        h2[..., 2] = np.clip(np.maximum(hsv[..., 2] * 1.35, 70), 0, 255)
        rust = cv2.cvtColor(h2.astype(np.uint8), cv2.COLOR_HSV2RGB).astype(np.float32) / 255
        out = mix(out, rust, veg * 0.95)
        # feuilles tombées sur les rochers
        leaves = np.zeros((H, W, 3), np.float32); la = np.zeros((H, W), np.float32)
        for cx, cy in (RNG.random((2600, 2)) * [W, H]).astype(int):
            if m["rocks"][cy, cx] < 0.6 or cy < 520:
                continue
            col = tuple(float(v) for v in (np.array((0.78, 0.36, 0.1)) * RNG.uniform(0.7, 1.15)))
            ax = int(RNG.integers(2, 5)); ay = int(RNG.integers(1, 3))
            cv2.ellipse(la, (cx, cy), (ax, ay), float(RNG.uniform(0, 180)), 0, 360, 1.0, -1, lineType=cv2.LINE_AA)
            cv2.ellipse(leaves, (cx, cy), (ax, ay), float(RNG.uniform(0, 180)), 0, 360, col, -1, lineType=cv2.LINE_AA)
        out = mix(out, leaves * (0.7 + 0.5 * m["lum"])[..., None], la * 0.85)
        # brume dorée sur les lointains
        out = mix(out, out * 0.75 + np.array([0.95, 0.72, 0.45], np.float32) * 0.25, m["distant"] * 0.5)
        out = out * np.array([1.04, 0.98, 0.9], np.float32)
    elif season == "hiver":
        # froid : désaturation, balance bleutée, mer acier
        g = out @ np.array([0.3, 0.59, 0.11], np.float32)
        out = mix(out, np.repeat(g[..., None], 3, 2), np.full((H, W), 0.45, np.float32))
        out = out * np.array([0.93, 0.98, 1.08], np.float32)
        veg_dark = mix(out, out * np.array([0.55, 0.6, 0.62], np.float32), veg * 0.6)
        out = veg_dark
    elif season == "ete":
        # mer plus turquoise au premier plan
        sea_low = m["sea"] * smoothstep(560, 860, YY)
        turq = out * np.array([0.82, 1.06, 1.08], np.float32)
        out = mix(out, turq, sea_low * 0.6)
    return np.clip(out, 0, 1)


# ───────────────────────────── LUMIÈRES ─────────────────────────────

def light_couchant(f, m, season):
    out = f.copy()
    if season == "hiver":
        # couchant d'hiver : ciel rose-mauve plus froid
        sky_tint = gradient((120, 128, 168), (246, 180, 150), 0, HORIZON, 1.2)
        d, L = cloud_detail(f, m)
        new_sky = sky_tint * (0.75 + 0.5 * L[..., None]) + np.clip(d, 0, 1)[..., None] * 0.6
        out = mix(out, np.clip(new_sky, 0, 1), m["sky"] * 0.75)
    return np.clip(out, 0, 1)


def light_jour(f, m, season):
    lab_ = lab(f)
    L, A, B = lab_[..., 0], lab_[..., 1], lab_[..., 2]
    # balance des blancs : on retire l'essentiel de la dominante orangée, on éclaircit les tons moyens
    A2 = A * 0.55
    B2 = B * 0.35 + 2
    L2 = np.clip(100 * (L / 100) ** 0.82 + 4, 0, 100)
    land = rgb(np.dstack([L2, A2, B2]))
    if season in ("automne", "printemps"):
        # la couleur propre du feuillage (rouille ou floraison) résiste à la balance des blancs
        keep = rgb(np.dstack([L2, A * 0.9, B * 0.8]))
        land = mix(land, keep, m["veg"] * 0.85)
    else:
        land = mix(land, land * np.array([0.92, 1.06, 0.92], np.float32), m["veg"] * 0.6)

    # ciel bleu de Méditerranée avec nuages blancs
    top = {"printemps": (92, 150, 214), "ete": (44, 118, 204), "automne": (98, 140, 190), "hiver": (150, 172, 196)}[season]
    bot = {"printemps": (214, 232, 244), "ete": (190, 222, 244), "automne": (222, 226, 226), "hiver": (226, 232, 238)}[season]
    sky = gradient(top, bot, 0, HORIZON, 0.85)
    d, Ls = cloud_detail(f, m)
    clouds = smoothstep(0.0, 0.12, d) + smoothstep(0.55, 0.95, Ls) * 0.35 * (YY < 330)
    clouds = cv2.GaussianBlur(np.clip(clouds, 0, 1), (0, 0), 1.2)
    shade = np.clip(0.88 + d * 2, 0.7, 1.05)
    cloud_col = np.dstack([shade, shade, shade * 1.02]) * np.array([0.98, 0.98, 1.0], np.float32)
    sky = mix(sky, cloud_col, clouds * (0.95 if season == "hiver" else 0.85))
    # soleil haut, voilé : le disque bas devient une lueur blanche
    sky = sky + glow(SUN[0], SUN[1] - 10, 38, (255, 250, 235), 0.22)
    out = mix(land, np.clip(sky, 0, 1), m["sky"])

    # mer : les reflets orangés deviennent bleu azur, le scintillement devient blanc
    sea = m["sea"]
    l3 = lab(out)
    hi = smoothstep(70, 92, lab_[..., 0])
    water = rgb(np.dstack([l3[..., 0] * 0.95, np.full((H, W), -6, np.float32), np.full((H, W), -24, np.float32)]))
    deep = gradient((40, 96, 150), (24, 120, 140), HORIZON, H, 1.0)
    water = mix(water, deep * (0.6 + 0.8 * (l3[..., 0][..., None] / 100)), np.full((H, W), 0.45, np.float32))
    sparkle = np.ones_like(out) * np.array([0.95, 0.98, 1.0], np.float32)
    water = mix(water, sparkle, hi * 0.8)
    out = mix(out, water, sea * 0.88)

    # lointains bleutés (perspective atmosphérique)
    haze = np.array([0.66, 0.75, 0.86], np.float32)
    dist_l = (lab(out)[..., 0] / 100)[..., None]
    out = mix(out, haze * (0.55 + 0.6 * dist_l), m["distant"] * 0.7)
    return np.clip(out, 0, 1)


def light_nuit(f, m, season):
    lin = srgb_to_lin(f)
    # « nuit américaine » : sous-exposition, désaturation, bascule bleue
    g = lin @ np.array([0.2126, 0.7152, 0.0722], np.float32)
    lin = mix(lin, np.repeat(g[..., None], 3, 2), np.full((H, W), 0.65, np.float32))
    lin = lin * np.array([0.42, 0.58, 1.0], np.float32) * 0.16
    out = lin_to_srgb(lin)

    # ciel nocturne
    sky = gradient((6, 10, 28), (30, 44, 82), 0, HORIZON, 1.4)
    d, Ls = cloud_detail(f, m)
    moon = (SUN[0] + 40, 150)
    sky = sky + glow(*moon, 150, (70, 90, 140), 0.55) + glow(*moon, 28, (170, 180, 210), 0.35)
    # nuages éclairés par la lune
    cl = smoothstep(0.0, 0.1, d)
    sky = mix(sky, sky + np.array([0.16, 0.18, 0.24], np.float32), cl * 0.75)
    # étoiles
    stars = np.zeros((H, W), np.float32)
    n = 1300 if season != "hiver" else 1600
    pts = RNG.random((n, 2)) * [W, HORIZON]
    for x, y in pts.astype(int):
        b = RNG.power(0.35) * (1 - y / HORIZON * 0.7)
        stars[y, x] = max(stars[y, x], b)
    stars = cv2.GaussianBlur(stars, (0, 0), 0.6) * 2.4
    big = RNG.random((40, 2)) * [W, HORIZON * 0.75]
    for x, y in big.astype(int):
        cv2.circle(stars, (x, y), 1, 1.6, -1, lineType=cv2.LINE_AA)
    stars = stars * (1 - cl) * (1 - smoothstep(0, 120, 160 - np.hypot(XX - moon[0], YY - moon[1])))
    sky = sky + stars[..., None] * np.array([0.95, 0.97, 1.0], np.float32)
    # la lune
    md = np.hypot(XX - moon[0], YY - moon[1])
    disc = smoothstep(15.5, 13.5, md)
    crater = cv2.GaussianBlur(RNG.random((H, W)).astype(np.float32), (0, 0), 3) * 0.12
    sky = mix(sky, np.dstack([0.96 - crater, 0.95 - crater, 0.9 - crater]), disc)
    out = mix(out, np.clip(sky, 0, 1), m["sky"])

    # chemin de lune sur la mer (à l'aplomb de la lune)
    sea = m["sea"]
    L0 = lab(f)[..., 0] / 100
    path = np.exp(-((XX - moon[0]) ** 2) / (2 * (40 + (YY - HORIZON) * 0.55) ** 2)) * (YY > HORIZON)
    spark = smoothstep(0.55, 0.85, L0) * sea
    out = out + (spark * (0.25 + 0.75 * path))[..., None] * np.array([0.55, 0.62, 0.78], np.float32)
    out = out + (path * sea * 0.06)[..., None] * np.array([0.6, 0.7, 0.9], np.float32)

    # fenêtres, réverbères, lanternes
    warm = np.zeros((H, W, 3), np.float32)
    win = np.zeros((H, W), np.float32)
    village = m["village"]
    for (x0, y0, x1, y1) in WINDOW_ZONES:
        k = int((x1 - x0) * (y1 - y0) / 520)
        for _ in range(k):
            x = int(RNG.uniform(x0, x1)); y = int(RNG.uniform(y0, y1))
            if village[y, x] < 0.5 or RNG.random() < 0.35:
                continue
            ww, hh = RNG.integers(2, 4), RNG.integers(3, 6)
            cv2.rectangle(win, (x, y), (x + ww, y + hh), float(RNG.uniform(0.6, 1.0)), -1)
    winglow = cv2.GaussianBlur(win, (0, 0), 2.5) * 0.9 + cv2.GaussianBlur(win, (0, 0), 0.6)
    warm += winglow[..., None] * np.array([1.0, 0.72, 0.36], np.float32)
    for (x, y) in QUAY_LAMPS:
        warm += glow(x, y, 3, (255, 205, 130), 1.3) + glow(x, y, 16, (255, 170, 90), 0.35)
        # reflet vertical sur l'eau
        warm += glow(x, y + 22, 1.6, (255, 170, 90), 0.18, sx=1.0, sy=6) * sea[..., None]
    for (x, y) in SHIP_LIGHTS:
        warm += glow(x, y, 2.2, (255, 210, 140), 1.4) + glow(x, y, 10, (255, 170, 90), 0.3)
        warm += glow(x, y + 30, 1.8, (255, 180, 100), 0.3, sy=10) * sea[..., None]
    out = out + warm
    # vignettage nocturne
    vign = 1 - 0.35 * smoothstep(0.55, 1.1, np.hypot((XX - W / 2) / (W / 2), (YY - H / 2) / (H / 2)))
    out = out * vign[..., None]
    return np.clip(out, 0, 1)


# ───────────────────────────── NEIGE (après la lumière) ─────────────────────────────

def snow_pass(f, src, m, light):
    """Neige posée sur les faces supérieures : rochers, sommets, toits, branches."""
    L = lab(src)[..., 0] / 100
    Lb = cv2.GaussianBlur(L, (0, 0), 3)
    up = cv2.Sobel(Lb, cv2.CV_32F, 0, 1, ksize=5)          # dérivée verticale : négative au sommet éclairé des volumes
    top_faces = smoothstep(0.05, -0.25, up)
    flat = smoothstep(0.35, 0.05, np.abs(cv2.Sobel(Lb, cv2.CV_32F, 1, 0, ksize=5)))
    tex = cv2.GaussianBlur(RNG.random((H, W)).astype(np.float32), (0, 0), 1.2)
    tex = (tex - tex.min()) / (tex.max() - tex.min())
    big = cv2.GaussianBlur(RNG.random((H, W)).astype(np.float32), (0, 0), 7)
    big = smoothstep(0.38, 0.6, (big - big.min()) / (big.max() - big.min()))
    rocks = m["rocks"] * smoothstep(0.1, 0.35, L)
    peaks = poly_mask(MOUNTAIN_SNOW, 3) * (1 - m["sky"]) * smoothstep(330, 190, YY)
    branches = m["veg"] * smoothstep(0.2, 0.55, L) * top_faces
    roofs = m["village"] * smoothstep(-0.1, -0.35, up) * 0.75
    a = rocks * np.clip(0.55 * top_faces + 0.35 * flat + 0.35 * big, 0, 1) * (0.75 + 0.25 * tex)
    a = np.clip(a * 1.6 + peaks * (0.8 + 0.2 * tex) + branches * 0.9 + roofs * 0.9, 0, 1)
    a = cv2.GaussianBlur(a, (0, 0), 0.9)
    col = {"jour": (0.96, 0.98, 1.0), "couchant": (1.0, 0.9, 0.86), "nuit": (0.46, 0.54, 0.72)}[light]
    shade = (0.82 + 0.18 * tex)[..., None] * (0.85 + 0.15 * top_faces)[..., None]
    return np.clip(mix(f, np.array(col, np.float32) * shade, a * 0.94), 0, 1)


def render(img, m, season, light):
    f = img.astype(np.float32) / 255
    s = season_pass(f, m, season)
    out = {"couchant": light_couchant, "jour": light_jour, "nuit": light_nuit}[light](s, m, season)
    if season == "hiver":
        out = snow_pass(out, s, m, light)
    return out


def main():
    src, outdir = sys.argv[1], sys.argv[2]
    only = sys.argv[3:] if len(sys.argv) > 3 else None
    os.makedirs(outdir, exist_ok=True)
    img = np.asarray(Image.open(src).convert("RGB"))
    m = build_masks(img)
    for season in ["printemps", "ete", "automne", "hiver"]:
        for light in ["jour", "couchant", "nuit"]:
            key = f"{season}-{light}"
            if only and key not in only:
                continue
            out = render(img, m, season, light)
            im = Image.fromarray((out * 255 + 0.5).astype(np.uint8))
            if outdir.rstrip("/").endswith("hero"):
                im.save(f"{outdir}/ambiance-{key}.jpg", quality=88, optimize=True, progressive=True, subsampling=0)
            else:
                im.save(f"{outdir}/{key}.png")
            print("ok", key)


if __name__ == "__main__":
    main()

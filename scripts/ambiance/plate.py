"""Plaque maîtresse du hero (voilier au couchant) : géométrie relevée à la main
et masques affinés sur l'image. Coordonnées en pixels de la source 1672 × 941."""
import numpy as np, cv2

W, H = 1672, 941
HORIZON = 445
SUN = (533, 357)

SKYLINE = [(0, 388), (80, 390), (160, 396), (230, 405), (272, 424), (296, 441), (446, 446), (452, 404), (520, 374), (570, 365),
           (640, 361), (700, 366), (760, 360), (820, 356), (880, 346), (915, 322), (940, 295), (990, 288), (1050, 268), (1090, 262),
           (1130, 270), (1180, 262), (1230, 245), (1270, 215), (1300, 196), (1350, 180), (1400, 174), (1450, 183), (1510, 198),
           (1560, 214), (1600, 228), (1672, 240)]

SHIP_BOX = (272, 290, 446, 458)  # x0, y0, x1, y1
# silhouette grossière du trois-mâts (voiles, mâts, coque) : borne le masque fin
SHIP_CORE = [(282, 452), (276, 428), (290, 408), (300, 336), (322, 328), (340, 300), (360, 296), (370, 312), (380, 300), (392, 316),
             (398, 336), (412, 360), (426, 378), (440, 412), (446, 430), (436, 452)]

VILLAGE = [(990, 336), (1060, 322), (1180, 330), (1250, 315), (1290, 300), (1380, 268), (1388, 245), (1412, 245), (1420, 280),
           (1480, 285), (1560, 268), (1610, 300), (1610, 452), (990, 452)]

SEA = [(0, 446), (1672, 446), (1672, 462), (1600, 478), (1540, 490), (1350, 545), (1318, 590), (1300, 680), (1180, 700),
       (1040, 712), (800, 725), (765, 790), (700, 850), (600, 862), (470, 875), (330, 858), (200, 890), (90, 870), (0, 860),
       (0, 760), (150, 735), (245, 700), (250, 640), (200, 600), (120, 560), (60, 535), (0, 530)]

TREE = [(1050, 0), (1672, 0), (1672, 560), (1560, 560), (1550, 330), (1480, 250), (1300, 170), (1150, 90), (1050, 40)]
SHRUBS = [(1380, 610), (1500, 560), (1672, 540), (1672, 800), (1420, 790), (1370, 700)]

MOUNTAIN_SNOW = [(915, 322), (940, 295), (990, 288), (1050, 268), (1090, 262), (1130, 270), (1180, 262), (1230, 245), (1270, 215),
                 (1300, 196), (1350, 180), (1400, 174), (1450, 183), (1510, 198), (1560, 214), (1560, 262), (1450, 250),
                 (1380, 240), (1300, 250), (1200, 290), (1100, 300), (1000, 318), (940, 340)]
LEFT_HILLS = [(0, 388), (80, 390), (160, 396), (230, 405), (272, 424), (296, 441), (296, 446), (0, 446)]
MID_HILLS = [(446, 446), (452, 404), (520, 374), (570, 365), (640, 361), (700, 366), (760, 360), (820, 356), (880, 346),
             (915, 322), (990, 336), (990, 446)]

# fenêtres allumées la nuit (façades du village), réverbères du quai, lanternes du navire
WINDOW_ZONES = [(1060, 335, 1180, 425), (1200, 330, 1290, 420), (1300, 300, 1380, 420), (1390, 265, 1415, 330),
                (1420, 290, 1530, 425), (1000, 360, 1060, 430)]
QUAY_LAMPS = [(1010, 432), (1065, 436), (1130, 438), (1205, 440), (1290, 437), (1360, 430), (1450, 428), (1530, 430)]
SHIP_LIGHTS = [(288, 432), (355, 436), (430, 428)]


def smoothstep_np(e0, e1, x):
    t = np.clip((x - e0) / (e1 - e0 + 1e-6), 0, 1)
    return t * t * (3 - 2 * t)


def poly_mask(points, blur=1.5):
    m = np.zeros((H, W), np.float32)
    cv2.fillPoly(m, [np.array(points, np.int32)], 1.0)
    return cv2.GaussianBlur(m, (0, 0), blur) if blur else m


def sky_polygon():
    return SKYLINE + [(W, 0), (0, 0)]


def refine(mask, guide, r=6, eps=1e-3):
    g = cv2.cvtColor(guide, cv2.COLOR_RGB2GRAY).astype(np.float32) / 255
    return np.clip(cv2.ximgproc.guidedFilter(g, mask.astype(np.float32), r, eps), 0, 1)


def build_masks(img):
    f = img.astype(np.float32) / 255
    lum = f @ np.array([0.299, 0.587, 0.114], np.float32)
    hsv = cv2.cvtColor(img, cv2.COLOR_RGB2HSV).astype(np.float32)
    sat = hsv[..., 1] / 255

    sky = poly_mask(sky_polygon(), 1.0)
    # feuillage de l'olivier dans le ciel : plus sombre que le ciel lissé
    clean = cv2.GaussianBlur(lum, (0, 0), 25)
    foliage_in_sky = ((lum < clean * 0.78) & (sky > 0.5)).astype(np.float32)
    foliage_in_sky = cv2.morphologyEx(foliage_in_sky, cv2.MORPH_OPEN, np.ones((2, 2), np.uint8))
    # le navire (voiles claires et peu saturées, coque sombre)
    x0, y0, x1, y1 = SHIP_BOX
    ship = np.zeros((H, W), np.float32)
    # ciel reconstitué sous le navire (inpainting), puis écart de couleur
    pad = 30
    sub = img[y0 - pad:y1 + 4, x0 - pad:x1 + pad].copy()
    hole = np.zeros(sub.shape[:2], np.uint8)
    hole[pad:pad + (y1 - y0), pad:pad + (x1 - x0)] = 255
    est = cv2.inpaint(sub, hole, 12, cv2.INPAINT_TELEA).astype(np.float32)
    diff = np.abs(sub.astype(np.float32) - cv2.GaussianBlur(est, (0, 0), 6)).sum(2) / 255
    s_lab = cv2.cvtColor(sub, cv2.COLOR_RGB2LAB).astype(np.float32)
    e_lab = cv2.cvtColor(est.astype(np.uint8), cv2.COLOR_RGB2LAB).astype(np.float32)
    dchroma = np.hypot(s_lab[..., 1] - e_lab[..., 1], s_lab[..., 2] - e_lab[..., 2])
    shipsub = ((diff > 0.34) | (dchroma > 18)).astype(np.uint8)
    shipsub[:pad] = 0; shipsub[:, :pad] = 0; shipsub[:, -pad:] = 0
    shipsub = cv2.morphologyEx(shipsub, cv2.MORPH_CLOSE, np.ones((3, 3), np.uint8))
    n, labs, st, _ = cv2.connectedComponentsWithStats(shipsub, 8)
    core = np.zeros(sub.shape[:2], np.uint8)
    cv2.fillPoly(core, [np.array([(p[0] - x0 + pad, p[1] - y0 + pad) for p in SHIP_CORE], np.int32)], 1)
    keep = np.zeros(n, bool)
    for i in range(1, n):
        if st[i][4] > 12 and (core[labs == i] > 0).mean() > 0.6:
            keep[i] = True
    shipm = keep[labs].astype(np.uint8) * core
    ship[y0 - pad:y1 + 4, x0 - pad:x1 + pad] = shipm.astype(np.float32)
    sky = np.clip(sky - foliage_in_sky - ship, 0, 1)
    sky = refine(sky, img, 2, 1e-3)
    # à l'intérieur du houppier : pixel dont la couleur prolonge le ciel voisin (et non une feuille éclairée)
    lab_img = cv2.cvtColor(img, cv2.COLOR_RGB2LAB).astype(np.float32)
    sure = (sky > 0.95).astype(np.float32)
    field = cv2.GaussianBlur(lab_img * sure[..., None], (0, 0), 30) / (cv2.GaussianBlur(sure, (0, 0), 30)[..., None] + 1e-4)
    dist = np.linalg.norm(lab_img - field, axis=2)
    tree_zone = poly_mask(TREE, 0) * poly_mask(sky_polygon(), 0)
    skyish = smoothstep_np(16.0, 7.0, dist) * tree_zone
    skyish = cv2.morphologyEx(skyish, cv2.MORPH_OPEN, np.ones((2, 2), np.uint8))
    sky = np.maximum(sky, skyish * (1 - ship))

    sea = poly_mask(SEA, 2)
    sea = refine(sea, img, 8, 4e-3) * (1 - sky)

    tree = poly_mask(TREE, 2) * (1 - sky)
    shrubs = poly_mask(SHRUBS, 4)
    rgb = f
    greenish = ((rgb[..., 1] > rgb[..., 2] * 1.02) & (lum < 0.75)).astype(np.float32)
    veg = np.clip(tree * np.maximum(greenish, (lum < 0.45).astype(np.float32)) + shrubs * greenish, 0, 1)
    veg = cv2.GaussianBlur(veg, (0, 0), 1)

    village = poly_mask(VILLAGE, 2) * (1 - sky)
    land = np.clip(1 - sky - sea, 0, 1)
    rocks = np.clip(land - village - veg, 0, 1) * (np.arange(H)[:, None] > HORIZON)
    distant = np.clip(poly_mask(LEFT_HILLS, 1) + poly_mask(MID_HILLS, 1) + poly_mask(MOUNTAIN_SNOW, 1), 0, 1) * (1 - village * 0.7)
    distant = cv2.GaussianBlur(distant, (0, 0), 18) * (1 - sky) * (1 - ship)
    return dict(sky=sky, sea=sea, veg=veg, village=village, rocks=rocks, distant=distant, ship=ship, lum=lum)

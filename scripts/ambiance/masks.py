"""Masques de la plaque maîtresse : ciel, mer, végétation, bâti, surfaces supérieures."""
import numpy as np, cv2

def smooth(m, k=9):
    return cv2.GaussianBlur(m.astype(np.float32), (0, 0), k)

def sky_mask(img, horizon):
    """Ciel = région haute, lisse, connexe au bord supérieur, séparée des reliefs par les contours."""
    h, w, _ = img.shape
    lab = cv2.cvtColor(img, cv2.COLOR_RGB2LAB).astype(np.float32)
    L = lab[..., 0]
    gx = cv2.Sobel(L, cv2.CV_32F, 1, 0, ksize=3); gy = cv2.Sobel(L, cv2.CV_32F, 0, 1, ksize=3)
    grad = cv2.GaussianBlur(np.hypot(gx, gy), (0, 0), 2)
    # texture locale
    var = cv2.GaussianBlur(L * L, (0, 0), 4) - cv2.GaussianBlur(L, (0, 0), 4) ** 2
    cand = (grad < 14) & (var < 60)
    cand[horizon:] = False
    cand = cv2.morphologyEx(cand.astype(np.uint8), cv2.MORPH_OPEN, np.ones((3, 3), np.uint8))
    n, lab_, st, _ = cv2.connectedComponentsWithStats(cand, 8)
    keep = np.zeros(n, bool)
    for i in range(1, n):
        x, y, ww, hh, a = st[i]
        if a > 2000 and y < horizon * 0.5:
            keep[i] = True
    m = keep[lab_]
    # comble les nuages texturés enclavés dans le ciel
    m = cv2.morphologyEx(m.astype(np.uint8), cv2.MORPH_CLOSE, cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (25, 25)))
    # remplissage des trous
    inv = (1 - m).astype(np.uint8)
    n, lab2, st2, _ = cv2.connectedComponentsWithStats(inv, 8)
    for i in range(1, n):
        x, y, ww, hh, a = st2[i]
        if a < 6000 and y + hh < horizon:
            m[lab2 == i] = 1
    return m.astype(np.float32)

def veg_mask(img, exclude):
    hsv = cv2.cvtColor(img, cv2.COLOR_RGB2HSV).astype(np.float32)
    H, S, V = hsv[..., 0], hsv[..., 1] / 255, hsv[..., 2] / 255
    rgb = img.astype(np.float32) / 255
    g_rel = rgb[..., 1] - 0.5 * (rgb[..., 0] + rgb[..., 2])
    m = ((H > 22) & (H < 85) & (S > 0.18) & (V > 0.06) & (V < 0.85)) | ((g_rel > 0.02) & (V < 0.8))
    m &= exclude < 0.5
    m = cv2.morphologyEx(m.astype(np.uint8), cv2.MORPH_OPEN, np.ones((2, 2), np.uint8))
    return m.astype(np.float32)

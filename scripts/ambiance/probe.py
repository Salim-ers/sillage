import sys, numpy as np, cv2
from PIL import Image
sys.path.insert(0, 'scripts/ambiance')
from masks import sky_mask, veg_mask
src, out, horizon = sys.argv[1], sys.argv[2], int(sys.argv[3])
img = np.asarray(Image.open(src).convert('RGB'))
sky = sky_mask(img, horizon)
veg = veg_mask(img, sky)
vis = img.astype(np.float32).copy()
vis[sky > 0.5] = vis[sky > 0.5] * 0.4 + np.array([0, 90, 255]) * 0.6
vis[veg > 0.5] = vis[veg > 0.5] * 0.3 + np.array([255, 0, 200]) * 0.7
Image.fromarray(vis.clip(0, 255).astype(np.uint8)).resize((1200, int(img.shape[0] * 1200 / img.shape[1]))).save(out)
print('sky frac', sky.mean(), 'veg frac', veg.mean())

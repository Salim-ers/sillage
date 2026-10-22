import sys, numpy as np
from PIL import Image
sys.path.insert(0, 'scripts/ambiance')
from plate import build_masks
img = np.asarray(Image.open(sys.argv[1]).convert('RGB'))
m = build_masks(img)
cols = dict(sky=(40, 110, 255), sea=(0, 220, 200), veg=(255, 0, 200), village=(255, 220, 0), rocks=(255, 90, 0), distant=(150, 80, 255))
vis = img.astype(np.float32) * 0.45
for k, c in cols.items():
    a = m[k][..., None] * 0.55
    vis = vis * (1 - a) + np.array(c, np.float32) * a + img * a * 0
Image.fromarray(vis.clip(0, 255).astype(np.uint8)).resize((1254, 706)).save(sys.argv[2])

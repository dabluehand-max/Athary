"""Generate original paper textures, tape pieces and transparent logos."""
import glob, os
import numpy as np
import cv2
from PIL import Image

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(ROOT, "assets/processed/textures")
LOGOS = os.path.join(ROOT, "assets/processed/logos")
os.makedirs(OUT, exist_ok=True)
rng = np.random.default_rng(11)


def blotch(h, w, scale, seed):
    r = np.random.default_rng(seed)
    small = r.normal(0, 1, (max(2, h // scale), max(2, w // scale))).astype(np.float32)
    return cv2.GaussianBlur(cv2.resize(small, (w, h), interpolation=cv2.INTER_CUBIC), (0, 0), scale / 3)


def paper(h, w, base, seed, fibers=True, strength=1.0):
    img = np.ones((h, w, 3), np.float32) * np.array(base, np.float32) / 255
    tone = blotch(h, w, 220, seed) * 0.035 + blotch(h, w, 40, seed + 1) * 0.015
    grain = np.random.default_rng(seed + 2).normal(0, 0.022, (h, w))
    img += ((tone + grain) * strength)[..., None]
    if fibers:
        r = np.random.default_rng(seed + 3)
        f = np.zeros((h, w), np.float32)
        for _ in range(900):
            x, y = r.integers(0, w), r.integers(0, h)
            a, L = r.uniform(0, np.pi), r.integers(8, 40)
            cv2.line(f, (x, y), (int(x + L * np.cos(a)), int(y + L * np.sin(a))), float(r.uniform(0.3, 1)), 1)
        img -= (cv2.GaussianBlur(f, (0, 0), 0.8) * 0.03 * strength)[..., None]
    return (np.clip(img, 0, 1) * 255).astype(np.uint8)


def save(a, name):
    Image.fromarray(a).save(os.path.join(OUT, name), optimize=True)
    print(name, a.shape[1], "x", a.shape[0])


save(paper(1920, 1080, (238, 233, 222), 1), "paper_offwhite.jpg")
save(paper(1920, 1080, (24, 23, 22), 2, strength=0.6), "paper_black.jpg")
save(paper(1400, 1000, (226, 218, 198), 3, strength=1.4), "newsprint.jpg")

for i in range(3):
    h, w = 90, int(rng.integers(260, 380))
    m = np.zeros((h, w), np.uint8)
    top, bot = 12, h - 12
    pts = [(0, top)]
    pts += [(w * t, top + rng.normal(0, 1.2)) for t in np.linspace(0.05, 0.95, 12)]
    pts += [(w, top)] + [(w - rng.uniform(0, 10), y) for y in np.linspace(top, bot, 7)]
    pts += [(w, bot)] + [(w * t, bot + rng.normal(0, 1.2)) for t in np.linspace(0.95, 0.05, 12)]
    pts += [(0, bot)] + [(rng.uniform(0, 10), y) for y in np.linspace(bot, top, 7)]
    cv2.fillPoly(m, [np.array(pts, np.int32)], 255)
    col = paper(h, w, (232, 222, 190), 20 + i, fibers=False, strength=0.8)
    alpha = (m.astype(np.float32) * 0.78).astype(np.uint8)
    save(np.dstack([col, alpha]), f"tape_{i}.png")


def ink_alpha(path, out, threshold=200):
    im = np.array(Image.open(path).convert("RGB")).astype(np.float32)
    im = im[40:-40, 40:-40]  # the supplied file is a screenshot with dark side bars
    lum = im.mean(axis=2)
    a = np.clip((threshold - lum) / (threshold - 40), 0, 1)
    ys, xs = np.where(a > 0.05)
    pad = 10
    y0, y1 = max(ys.min() - pad, 0), ys.max() + pad
    x0, x1 = max(xs.min() - pad, 0), xs.max() + pad
    rgb = np.zeros_like(im); rgb[:] = (27, 30, 45)
    out_a = np.dstack([rgb, a * 255]).astype(np.uint8)[y0:y1, x0:x1]
    Image.fromarray(out_a, "RGBA").save(out, optimize=True)
    print(os.path.basename(out), x1 - x0, "x", y1 - y0)


ink_alpha(os.path.join(LOGOS, "bayt-althaqafa-logo.jpg"), os.path.join(LOGOS, "bayt_althaqafa.png"))
lam = glob.glob(os.path.join(ROOT, "assets/provided/5.png"))
if lam:
    Image.open(lam[0]).save(os.path.join(LOGOS, "lam_alqamariya.png"))

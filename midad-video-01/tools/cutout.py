"""Turn a photo into a physical-looking collage cut-out (RGBA PNG).

usage: python cutout.py <in> <out> [--crop x0,y0,x1,y1] [--mode silhouette|rect] [--color]
"""
import argparse
import numpy as np
import cv2
from PIL import Image

PAPER = np.array([240, 236, 226], np.float32)


def vintage_bw(rgb: np.ndarray, keep_color: bool) -> np.ndarray:
    f = rgb.astype(np.float32) / 255.0
    if keep_color:
        g = f.mean(axis=2, keepdims=True)
        f = g + (f - g) * 0.45  # faded print
    else:
        g = (f @ np.array([0.3, 0.59, 0.11], np.float32))[..., None]
        f = np.repeat(g, 3, axis=2)
    f = np.clip((f - 0.5) * 1.18 + 0.52, 0, 1)  # contrast, lifted blacks
    f = f * np.array([1.0, 0.975, 0.93], np.float32)  # warm paper tint
    rng = np.random.default_rng(7)
    f += rng.normal(0, 0.035, f.shape[:2])[..., None]  # print grain
    return (np.clip(f, 0, 1) * 255).astype(np.uint8)


def scissor_mask(mask: np.ndarray, border: int, seed: int) -> np.ndarray:
    k = cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (border * 2 + 1, border * 2 + 1))
    grown = cv2.dilate(mask, k)
    cnts, _ = cv2.findContours(grown, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_NONE)
    out = np.zeros_like(mask)
    rng = np.random.default_rng(seed)
    for c in cnts:
        if cv2.contourArea(c) < 2000:
            continue
        poly = cv2.approxPolyDP(c, border * 0.9, True).reshape(-1, 2).astype(np.float32)
        poly += rng.normal(0, border * 0.18, poly.shape)  # hand-cut wobble
        cv2.fillPoly(out, [poly.astype(np.int32)], 255)
    return out


def torn_rect_mask(h: int, w: int, seed: int) -> np.ndarray:
    rng = np.random.default_rng(seed)
    m = np.zeros((h, w), np.uint8)
    pts, n, amp = [], 60, max(4, min(h, w) // 120)
    for side in range(4):
        for i in range(n):
            t = i / n
            p = [(t * w, 0), (w, t * h), ((1 - t) * w, h), (0, (1 - t) * h)][side]
            pts.append((p[0] + rng.normal(0, amp), p[1] + rng.normal(0, amp)))
    inset = amp * 3
    pts = np.array(pts, np.float32)
    pts[:, 0] = np.clip(pts[:, 0], inset, w - inset)
    pts[:, 1] = np.clip(pts[:, 1], inset, h - inset)
    cv2.fillPoly(m, [pts.astype(np.int32)], 255)
    return m


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("src"); ap.add_argument("dst")
    ap.add_argument("--crop"); ap.add_argument("--mode", default="silhouette")
    ap.add_argument("--color", action="store_true"); ap.add_argument("--max", type=int, default=1400)
    a = ap.parse_args()

    im = Image.open(a.src).convert("RGB")
    if a.crop:
        im = im.crop(tuple(int(v) for v in a.crop.split(",")))
    im.thumbnail((a.max, a.max))
    rgb = np.array(im)
    h, w = rgb.shape[:2]
    seed = abs(hash(a.src)) % 10_000
    photo = vintage_bw(rgb, a.color)

    if a.mode == "silhouette":
        from rembg import remove, new_session
        cut = remove(im, session=new_session("u2net"), post_process_mask=True)
        subj = (np.array(cut)[..., 3] > 127).astype(np.uint8) * 255
        n, lab, stats, _ = cv2.connectedComponentsWithStats(subj)
        if n > 1:
            subj = np.where(lab == 1 + np.argmax(stats[1:, cv2.CC_STAT_AREA]), 255, 0).astype(np.uint8)
        pad = 60
        subj = cv2.copyMakeBorder(subj, pad, pad, pad, pad, cv2.BORDER_CONSTANT)
        photo = cv2.copyMakeBorder(photo, pad, pad, pad, pad, cv2.BORDER_CONSTANT)
        outer = scissor_mask(subj, border=max(10, w // 70), seed=seed)
        paper = np.empty_like(photo); paper[:] = PAPER.astype(np.uint8)
        a3 = (cv2.GaussianBlur(subj, (3, 3), 0).astype(np.float32) / 255)[..., None]
        rgb_out = (photo * a3 + paper * (1 - a3)).astype(np.uint8)
        alpha = outer
    else:
        alpha = torn_rect_mask(h, w, seed)
        rgb_out = photo

    alpha = cv2.GaussianBlur(alpha, (3, 3), 0)
    ys, xs = np.where(alpha > 0)
    y0, y1, x0, x1 = ys.min(), ys.max() + 1, xs.min(), xs.max() + 1
    out = np.dstack([rgb_out, alpha])[y0:y1, x0:x1]
    Image.fromarray(out, "RGBA").save(a.dst, optimize=True)
    print(a.dst, out.shape[1], "x", out.shape[0])


if __name__ == "__main__":
    main()

"""Synthesize original foley (scissor snips, paper rustle, tape) and lay it on the video timeline."""
import os
import numpy as np
from scipy.io import wavfile
from scipy.signal import butter, sosfilt

SR = 48000
DUR = 60.0
rng = np.random.default_rng(3)


def bp(x, lo, hi, order=4):
    return sosfilt(butter(order, [lo, hi], btype="band", fs=SR, output="sos"), x)


def env(n, attack, decay):
    t = np.arange(n) / SR
    return np.minimum(t / max(attack, 1e-4), 1) * np.exp(-t / decay)


def snip(gain=1.0):
    n = int(0.12 * SR)
    click = bp(rng.normal(0, 1, n), 2500, 9000) * env(n, 0.0005, 0.008)
    ring = sum(np.sin(2 * np.pi * f * np.arange(n) / SR + rng.uniform(0, 6)) for f in (3120, 4710, 6630)) * env(n, 0.0005, 0.03) * 0.15
    shear = bp(rng.normal(0, 1, n), 1500, 6000) * env(n, 0.01, 0.025) * 0.5
    return (click + ring + shear) * gain


def rustle(length=0.35, gain=0.5):
    n = int(length * SR)
    x = bp(rng.normal(0, 1, n), 400, 5000)
    crackle = (rng.random(n) < 0.004) * rng.normal(0, 3, n)
    x = x + bp(crackle, 1500, 8000)
    shape = np.sin(np.pi * np.arange(n) / n) ** 1.5
    return x * shape * gain


def tape(gain=0.5):
    n = int(0.28 * SR)
    t = np.arange(n) / SR
    rip = bp(rng.normal(0, 1, n), 800, 7000) * (0.6 + 0.4 * np.sin(2 * np.pi * 90 * t)) * env(n, 0.02, 0.12)
    return rip * gain


out = np.zeros(int(DUR * SR))


def place(t, sig):
    i = int(t * SR)
    j = min(len(out), i + len(sig))
    out[i:j] += sig[: j - i]


# Scene 1: snip on frame 1, then the cut around the year, then the piece lifts.
place(0.0, snip(1.3))
for k in range(1, 9):
    place(k * 0.16 + rng.uniform(-0.02, 0.02), snip(0.7))
place(1.5, rustle(0.5, 0.7))
# Scene 2: shapes land faster and faster, scissors mid-scene.
for i in range(30):
    place(6 + (18 + 200 * (i / 30) ** 0.75) / 30, rustle(0.12, 0.25))
for k in range(5):
    place(8.0 + k * 0.2, snip(0.6))
# Scene transitions and piece entrances.
for t in (6, 14, 22, 30, 40, 47, 54):
    place(t - 0.05, rustle(0.45, 0.6))
for i in range(6):
    place(14 + i * 11 / 30, rustle(0.2, 0.35))
    place(14 + (i * 11 + 9) / 30, tape(0.35))
for i in range(9):
    place(40 + (6 + i * 9) / 30, rustle(0.16, 0.3))
    place(40 + (6 + i * 9 + 7) / 30, tape(0.3))
for t in (49.3, 50.3, 51.3):
    place(t, tape(0.4))

out = out / (np.abs(out).max() + 1e-9) * 0.8
dst = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "audio", "foley.wav")
wavfile.write(dst, SR, (out * 32767).astype(np.int16))
print(dst)

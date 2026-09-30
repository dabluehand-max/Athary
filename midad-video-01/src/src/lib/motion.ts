import { interpolate, random, Easing } from "remotion";

export const FPS = 30;
export const STEP = FPS / 12; // animate on 12fps inside the 30fps timeline

export const INK = "#1f3fa8";
export const PAPER = "#eee9de";
export const BLACK = "#171615";

export const stepped = (frame: number) => Math.floor(frame / STEP) * STEP;

// Held-frame wobble, like paper that was touched between exposures.
const JITTER_SCALE = 0.25;

export const jitter = (seed: string, frame: number, amount = 1) => {
  const s = Math.floor(frame / (STEP * 2));
  amount *= JITTER_SCALE;
  return {
    x: (random(`${seed}x${s}`) - 0.5) * 3 * amount,
    y: (random(`${seed}y${s}`) - 0.5) * 3 * amount,
    r: (random(`${seed}r${s}`) - 0.5) * 0.8 * amount,
  };
};

export const progress = (frame: number, start: number, dur: number, ease = Easing.out(Easing.cubic)) =>
  interpolate(stepped(frame), [start, start + dur], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: ease,
  });

export const toArabicDigits = (s: string) => s.replace(/[0-9]/g, (d) => "٠١٢٣٤٥٦٧٨٩"[Number(d)]);

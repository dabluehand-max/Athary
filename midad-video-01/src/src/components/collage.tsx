import React from "react";
import { AbsoluteFill, Img, interpolate, random, staticFile, useCurrentFrame } from "remotion";
import { BLACK, INK, PAPER, jitter, progress, stepped } from "../lib/motion";
import { FONT_BLOCK, FONT_CUT, FONT_NASKH, FONT_TYPE } from "../fonts";

export const img = (p: string) => staticFile(`img/${p}`);

export const Paper: React.FC<{ variant?: "offwhite" | "black" | "newsprint" }> = ({ variant = "offwhite" }) => (
  <AbsoluteFill style={{ backgroundColor: variant === "black" ? BLACK : PAPER }}>
    <Img src={img(`textures/${variant === "newsprint" ? "newsprint" : `paper_${variant}`}.jpg`)} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
  </AbsoluteFill>
);

type From = "top" | "bottom" | "left" | "right" | "drop" | "none";

const offscreen = (from: From): [number, number] =>
  ({ top: [0, -1500], bottom: [0, 1500], left: [-1300, 0], right: [1300, 0], drop: [0, 0], none: [0, 0] })[from] as [number, number];

export type PieceProps = {
  x: number; // center, canvas px
  y: number;
  w: number;
  rot?: number;
  at?: number; // frame the piece starts entering (scene-relative)
  dur?: number;
  from?: From;
  exitAt?: number;
  exitTo?: From;
  seed?: string;
  lift?: number; // 0 = flat on the table, 1 = held above it
  z?: number;
  children: React.ReactNode;
};

// A physical piece of paper: enters on 12fps steps, lands with a settling shadow, then wobbles on held frames.
export const Piece: React.FC<PieceProps> = ({ x, y, w, rot = 0, at = 0, dur = 10, from = "drop", exitAt, exitTo = "right", seed = "p", lift = 0, z, children }) => {
  const f = useCurrentFrame();
  if (f < at) return null;
  const p = progress(f, at, dur);
  const [ox, oy] = offscreen(from);
  let dx = ox * (1 - p);
  let dy = oy * (1 - p);
  let scale = from === "drop" ? interpolate(p, [0, 1], [1.12, 1]) : 1;
  let r = rot + (1 - p) * (random(seed) - 0.5) * 24;
  if (exitAt !== undefined && f >= exitAt) {
    const q = progress(f, exitAt, dur);
    const [ex, ey] = offscreen(exitTo);
    dx += ex * q;
    dy += ey * q;
    r += q * (random(seed + "e") - 0.5) * 20;
  }
  const settle = 1 - p;
  const hover = Math.max(lift, settle);
  scale *= 1 + hover * 0.03;
  const j = jitter(seed, f, p < 1 ? 0.3 : 1);
  const sh = 4 + hover * 26;
  return (
    <div
      style={{
        position: "absolute",
        left: x - w / 2,
        top: y,
        width: w,
        zIndex: z,
        transform: `translate(${dx + j.x}px, ${dy + j.y}px) translateY(-50%) rotate(${r + j.r}deg) scale(${scale})`,
        filter: `drop-shadow(${sh * 0.35}px ${sh * 0.6}px ${sh * 0.8}px rgba(0,0,0,${0.28 + hover * 0.12}))`,
      }}
    >
      {children}
    </div>
  );
};

export const Cut: React.FC<Omit<PieceProps, "children"> & { src: string }> = ({ src, ...p }) => (
  <Piece {...p}>
    <Img src={img(src)} style={{ width: "100%", display: "block" }} />
  </Piece>
);

export const Tape: React.FC<{ x: number; y: number; w?: number; rot?: number; at?: number; v?: number }> = ({ x, y, w = 150, rot = 0, at = 0, v = 0 }) => {
  const f = useCurrentFrame();
  if (f < at) return null;
  return (
    <Img
      src={img(`textures/tape_${v % 3}.png`)}
      style={{ position: "absolute", left: x - w / 2, top: y - w * 0.16, width: w, transform: `rotate(${rot}deg)`, zIndex: 50, opacity: 0.92 }}
    />
  );
};

// Hand enters from the top holding whatever is at its fingertips, lets go, and leaves.
export const Hand: React.FC<{ x: number; y: number; at: number; release: number; w?: number; rot?: number; seed?: string }> = ({ x, y, at, release, w = 330, rot = 0, seed = "h" }) => {
  const f = useCurrentFrame();
  if (f < at || f > release + 14) return null;
  const inP = progress(f, at, release - at > 12 ? 10 : release - at);
  const outP = progress(f, release, 12);
  const dy = -1400 * (1 - inP) - 1400 * outP;
  const j = jitter(seed, f, 1.4);
  const h = w * (686 / 407);
  // fingertip sits at ~(0.46, 0.83) of the image
  return (
    <div
      style={{
        position: "absolute",
        left: x - w * 0.46,
        top: y - h * 0.83,
        width: w,
        zIndex: 80,
        transformOrigin: "46% 83%",
        transform: `translate(${j.x}px, ${dy + j.y}px) rotate(${rot + j.r}deg)`,
        filter: "drop-shadow(14px 22px 18px rgba(0,0,0,0.35))",
      }}
    >
      <Img src={img("props/hand_reach.png")} style={{ width: "100%" }} />
    </div>
  );
};

// Original paper-cut scissors; `open` 0..1.
export const Scissors: React.FC<{ x: number; y: number; size?: number; rot?: number; open: number }> = ({ x, y, size = 360, rot = 0, open }) => {
  const a = 4 + open * 18;
  const blade = "M0,0 C60,-10 190,-14 250,-2 C190,6 70,10 0,8 Z";
  const ring = (cx: number, cy: number) => (
    <g>
      <ellipse cx={cx} cy={cy} rx={52} ry={34} fill={BLACK} />
      <ellipse cx={cx} cy={cy} rx={34} ry={19} fill="none" stroke="#3a3836" strokeWidth={2} />
    </g>
  );
  return (
    <svg
      viewBox="-150 -120 420 240"
      width={size}
      style={{ position: "absolute", left: x - size * (150 / 420), top: y - size * (120 / 420), transformOrigin: `${(150 / 420) * 100}% 50%`, transform: `rotate(${rot}deg)`, zIndex: 70, filter: "drop-shadow(8px 14px 10px rgba(0,0,0,0.45))", overflow: "visible" }}
    >
      <g transform={`rotate(${-a})`}>
        <path d={blade} fill="#cfcac0" stroke="#6b675f" strokeWidth={2} />
        <path d="M0,4 L-70,40" stroke={BLACK} strokeWidth={22} strokeLinecap="round" />
        {ring(-100, 58)}
      </g>
      <g transform={`rotate(${a}) scale(1,-1)`}>
        <path d={blade} fill="#dcd7cd" stroke="#6b675f" strokeWidth={2} />
        <path d="M0,4 L-70,40" stroke={BLACK} strokeWidth={22} strokeLinecap="round" />
        {ring(-100, 58)}
      </g>
      <circle r={9} fill="#8a857c" stroke={BLACK} strokeWidth={3} />
    </svg>
  );
};

const NON_LEFT_JOINING = new Set("اأإآدذرزوؤةءى".split(""));
const isArabic = (c: string) => /[ء-ي]/.test(c);
const ZWJ = "‍";
const MARKS = /[ً-ْ]/;

// Split an Arabic word into letters that keep their contextual (joined) shapes.
export const shapedLetters = (word: string): string[] => {
  const units: string[] = [];
  for (const ch of word) {
    if (MARKS.test(ch) && units.length) units[units.length - 1] += ch;
    else units.push(ch);
  }
  return units.map((u, i) => {
    const c = u[0];
    const prev = units[i - 1]?.[0];
    const next = units[i + 1]?.[0];
    const joinsPrev = prev && isArabic(prev) && isArabic(c) && !NON_LEFT_JOINING.has(prev);
    const joinsNext = next && isArabic(next) && isArabic(c) && !NON_LEFT_JOINING.has(c) && c !== "ء";
    return (joinsPrev ? ZWJ : "") + u + (joinsNext ? ZWJ : "");
  });
};

const groupUnits = (u: string[], n: number) => {
  if (n <= 1) return u;
  const out: string[] = [];
  for (let i = 0; i < u.length; i += n) out.push(u.slice(i, i + n).join(""));
  return out;
};

const CHIP_STYLES = [
  { bg: "#f3efe4", fg: BLACK, font: FONT_BLOCK },
  { bg: BLACK, fg: "#f3efe4", font: FONT_CUT },
  { bg: INK, fg: "#f3efe4", font: FONT_BLOCK },
  { bg: "#d9cfb8", fg: BLACK, font: FONT_NASKH },
  { bg: "#f3efe4", fg: INK, font: FONT_CUT },
];

// Ransom-note word: each letter on its own cut paper chip.
export const RansomWord: React.FC<{ text: string; x: number; y: number; size: number; at?: number; per?: number; seed?: string; palette?: number[]; group?: number }> = ({ text, x, y, size, at = 0, per = 2.5, seed = "r", palette, group = 1 }) => {
  const f = useCurrentFrame();
  const words = text.split(" ");
  let k = 0;
  return (
    <div style={{ position: "absolute", left: 0, right: 0, top: y, transform: "translateY(-50%)", display: "flex", justifyContent: "center", direction: "rtl", gap: size * 0.28, marginLeft: x - 540, zIndex: 60, flexWrap: "wrap" }}>
      {words.map((w, wi) => (
        <div key={wi} style={{ display: "flex", direction: "rtl" }}>
          {(/[\u0621-\u064A]/.test(w) ? groupUnits(shapedLetters(w), group) : [w]).map((l, li) => {
            const idx = k++;
            const start = at + idx * per;
            if (f < start) return <span key={li} style={{ visibility: "hidden", fontSize: size, fontFamily: FONT_BLOCK, padding: `0 ${size * 0.08}px` }}>{l}</span>;
            const s = `${seed}${idx}`;
            const pool = palette ?? [0, 1, 2, 3, 4];
            const st = CHIP_STYLES[pool[Math.floor(random(s) * pool.length)]];
            const p = progress(f, start, 5);
            const j = jitter(s, f, 1);
            return (
              <span
                key={li}
                style={{
                  display: "inline-block",
                  fontFamily: st.font,
                  fontSize: size * (0.9 + random(s + "z") * 0.25),
                  lineHeight: 1.25,
                  color: st.fg,
                  backgroundColor: st.bg,
                  padding: `${size * 0.02}px ${size * 0.1}px ${size * 0.08}px`,
                  margin: `0 ${-size * 0.01}px`,
                  transform: `translate(${j.x}px, ${(random(s + "y") - 0.5) * size * 0.14 + j.y}px) rotate(${(random(s + "r") - 0.5) * 9 + j.r}deg) scale(${interpolate(p, [0, 1], [1.25, 1])})`,
                  clipPath: `polygon(${random(s + "a") * 6}% ${random(s + "b") * 6}%, ${100 - random(s + "c") * 6}% 0%, 100% ${100 - random(s + "d") * 6}%, ${random(s + "e") * 5}% 100%)`,
                  boxShadow: "3px 5px 0 rgba(0,0,0,0.18)",
                  opacity: p > 0 ? 1 : 0,
                }}
              >
                {l}
              </span>
            );
          })}
        </div>
      ))}
    </div>
  );
};

// Typed text on a torn paper strip, revealed right-to-left.
export const TypedStrip: React.FC<{ text: string; x: number; y: number; size?: number; at?: number; rot?: number; bg?: string; fg?: string; font?: string; maxW?: number; seed?: string; wipe?: number }> = ({
  text, x, y, size = 40, at = 0, rot = 0, bg = "#f5f1e8", fg = BLACK, font = FONT_TYPE, maxW = 900, seed = "t", wipe = 8,
}) => {
  const f = useCurrentFrame();
  if (f < at) return null;
  const p = progress(f, at, wipe);
  const j = jitter(seed, f, 0.8);
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        transform: `translate(-50%, -50%) translate(${j.x}px, ${j.y}px) rotate(${rot + j.r}deg)`,
        width: "max-content",
        maxWidth: maxW,
        zIndex: 65,
        filter: "drop-shadow(3px 6px 5px rgba(0,0,0,0.3))",
      }}
    >
      <div
        style={{
          direction: "rtl",
          whiteSpace: "pre-line",
          fontFeatureSettings: '"liga" 0, "dlig" 0, "clig" 0',
          fontFamily: font,
          fontWeight: font === FONT_TYPE ? 600 : 400,
          fontSize: size,
          lineHeight: 1.45,
          color: fg,
          background: bg,
          padding: `${size * 0.18}px ${size * 0.5}px ${size * 0.26}px`,
          textAlign: "center",
          clipPath: `polygon(${100 - p * 100}% 0, 100% ${random(seed) * 8}%, 100% 100%, ${100 - p * 100}% ${100 - random(seed + "q") * 8}%)`,
        }}
      >
        {text}
      </div>
    </div>
  );
};

// A hand-drawn ink circle (blue ballpoint) that draws itself.
export const InkCircle: React.FC<{ x: number; y: number; w: number; h: number; at: number; dur?: number; color?: string }> = ({ x, y, w, h, at, dur = 14, color = INK }) => {
  const f = useCurrentFrame();
  const p = interpolate(stepped(f), [at, at + dur], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const d = `M ${w * 0.92} ${h * 0.3} C ${w * 1.05} ${h * 0.75}, ${w * 0.55} ${h * 1.02}, ${w * 0.22} ${h * 0.9} C ${-w * 0.04} ${h * 0.8}, ${-w * 0.02} ${h * 0.2}, ${w * 0.3} ${h * 0.06} C ${w * 0.6} ${-h * 0.05}, ${w * 0.95} ${h * 0.08}, ${w * 0.98} ${h * 0.42} C ${w * 1.0} ${h * 0.6}, ${w * 0.9} ${h * 0.72}, ${w * 0.8} ${h * 0.8}`;
  return (
    <svg width={w} height={h} style={{ position: "absolute", left: x - w / 2, top: y - h / 2, overflow: "visible", zIndex: 75 }}>
      <path d={d} fill="none" stroke={color} strokeWidth={7} strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - p} opacity={0.9} />
    </svg>
  );
};

// Spreading ink stain: an irregular blob that grows on 12fps steps.
export const InkStain: React.FC<{ x: number; y: number; r: number; at: number; dur?: number; seed?: string; color?: string }> = ({ x, y, r, at, dur = 24, seed = "ink", color = INK }) => {
  const f = useCurrentFrame();
  if (f < at) return null;
  const p = progress(f, at, dur);
  const n = 28;
  const pts = Array.from({ length: n }, (_, i) => {
    const a = (i / n) * Math.PI * 2;
    const rr = r * p * (0.78 + random(`${seed}${i}`) * 0.4 + (i % 7 === 0 ? random(`${seed}s${i}`) * 0.35 : 0));
    return `${(Math.cos(a) * rr).toFixed(1)},${(Math.sin(a) * rr).toFixed(1)}`;
  });
  const drops = Array.from({ length: 9 }, (_, i) => {
    const a = random(`${seed}d${i}`) * Math.PI * 2;
    const dd = r * p * (1.05 + random(`${seed}dd${i}`) * 0.35);
    return <circle key={i} cx={Math.cos(a) * dd} cy={Math.sin(a) * dd} r={r * 0.03 * p * (0.5 + random(`${seed}dr${i}`))} fill={color} />;
  });
  return (
    <svg width={r * 3} height={r * 3} viewBox={`${-r * 1.5} ${-r * 1.5} ${r * 3} ${r * 3}`} style={{ position: "absolute", left: x - r * 1.5, top: y - r * 1.5, zIndex: 5, opacity: 0.93 }}>
      <defs>
        <filter id={`f${seed}`}>
          <feTurbulence type="fractalNoise" baseFrequency="0.018" numOctaves={3} seed={7} />
          <feDisplacementMap in="SourceGraphic" scale={r * 0.18} />
        </filter>
      </defs>
      <g filter={`url(#f${seed})`}>
        <polygon points={pts.join(" ")} fill={color} />
        {drops}
      </g>
    </svg>
  );
};

// Hand placed so its fingertip sits at (x, y); for props that move along a path.
export const HandAt: React.FC<{ x: number; y: number; w?: number; rot?: number; seed?: string }> = ({ x, y, w = 330, rot = 0, seed = "ha" }) => {
  const f = useCurrentFrame();
  const h = w * (686 / 407);
  const j = jitter(seed, f, 1.2);
  return (
    <div style={{ position: "absolute", left: x - w * 0.46, top: y - h * 0.83, width: w, zIndex: 85, transformOrigin: "46% 83%", transform: `translate(${j.x}px, ${j.y}px) rotate(${rot + j.r}deg)`, filter: "drop-shadow(14px 22px 18px rgba(0,0,0,0.4))" }}>
      <Img src={img("props/hand_reach.png")} style={{ width: "100%" }} />
    </div>
  );
};

export const LogoTab: React.FC<{ src: string; x: number; y: number; w: number; at: number; from?: From; rot?: number; seed?: string; pad?: number }> = ({ src, x, y, w, at, from = "bottom", rot = 0, seed = "lg", pad = 26 }) => (
  <Piece x={x} y={y} w={w} at={at} from={from} rot={rot} seed={seed} dur={9}>
    <div style={{ background: "#f5f1e8", padding: pad, clipPath: "polygon(1% 3%, 99% 0, 100% 97%, 0 100%)" }}>
      <Img src={img(src)} style={{ width: "100%", display: "block" }} />
    </div>
  </Piece>
);

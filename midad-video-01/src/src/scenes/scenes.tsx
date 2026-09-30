import React from "react";
import { AbsoluteFill, Img, interpolate, random, staticFile, useCurrentFrame } from "remotion";
import { BLACK, INK, PAPER, progress, stepped } from "../lib/motion";
import { FONT_BLOCK, FONT_NASKH } from "../fonts";
import { Cut, HandAt, InkCircle, InkStain, LogoTab, Paper, Piece, RansomWord, Scissors, Tape, TypedStrip } from "../components/collage";

export type Cue = (needle: string, fallback: number) => number; // scene-relative frame of a spoken word

export type LogoSet = { studio: string; lam: string; bayt: string };

// ─── 1. HOOK ───────────────────────────────────────────────
export const HookScene: React.FC<{ year: string; lines: [string, string]; cue: Cue }> = ({ year, lines, cue }) => {
  const f = useCurrentFrame();
  const bx = 540, by = 690, bw = 540, bh = 270;
  const cutEnd = 42;
  const s = interpolate(stepped(f), [1, cutEnd], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const corners: [number, number][] = [
    [bx + bw / 2, by - bh / 2], [bx - bw / 2, by - bh / 2], [bx - bw / 2, by + bh / 2], [bx + bw / 2, by + bh / 2], [bx + bw / 2, by - bh / 2],
  ];
  const seg = (t: number) => {
    const L = [bw, bh, bw, bh];
    let d = t * (2 * bw + 2 * bh);
    for (let i = 0; i < 4; i++) {
      if (d <= L[i] || i === 3) {
        const k = Math.min(1, d / L[i]);
        const [x0, y0] = corners[i], [x1, y1] = corners[i + 1];
        return { x: x0 + (x1 - x0) * k, y: y0 + (y1 - y0) * k, ang: Math.atan2(y1 - y0, x1 - x0), i };
      }
      d -= L[i];
    }
    return { x: 0, y: 0, ang: 0, i: 0 };
  };
  const tip = seg(s);
  const trail: string[] = [];
  for (let t = 0; t <= s; t += 0.01) {
    const p = seg(t);
    trail.push(`${(p.x + (random(`c${t.toFixed(2)}`) - 0.5) * 5).toFixed(1)},${(p.y + (random(`d${t.toFixed(2)}`) - 0.5) * 5).toFixed(1)}`);
  }
  const size = 380, sc = size / 420;
  const pivot = { x: tip.x - Math.cos(tip.ang) * 180 * sc, y: tip.y - Math.sin(tip.ang) * 180 * sc };
  const deg = (tip.ang * 180) / Math.PI;
  const rr = (Math.PI * deg) / 180;
  const ring = { x: pivot.x + (-100 * Math.cos(rr) - 58 * Math.sin(rr)) * sc, y: pivot.y + (-100 * Math.sin(rr) + 58 * Math.cos(rr)) * sc };
  const snip = Math.abs(Math.sin(Math.floor(f / 2.5) * 1.7));
  const lifted = f >= cutEnd + 3;
  const lp = progress(f, cutEnd + 3, 12);
  const toolsOut = progress(f, cutEnd + 2, 10);

  return (
    <AbsoluteFill>
      <Paper variant="black" />
      <Piece x={540} y={700} w={900} rot={-2.5} from="none" seed="news" exitAt={cutEnd + 8} exitTo="left" dur={12}>
        <Newspaper year={year} hole={lifted} />
      </Piece>
      {!lifted && (
        <svg width={1080} height={1920} style={{ position: "absolute", zIndex: 40, transform: "rotate(-2.5deg)", transformOrigin: "540px 700px" }}>
          <polyline points={trail.join(" ")} fill="none" stroke={BLACK} strokeWidth={6} strokeLinejoin="round" />
        </svg>
      )}
      {lifted && (
        <div style={{ position: "absolute", left: bx - bw / 2, top: by - bh / 2, width: bw, height: bh, zIndex: 60,
          transform: `translate(0, ${-230 * lp}px) rotate(${-2.5 - 3 * lp}deg) scale(${1 + 0.28 * lp})`,
          filter: `drop-shadow(${6 + 10 * lp}px ${10 + 18 * lp}px ${12 + 12 * lp}px rgba(0,0,0,0.55))` }}>
          <YearChip year={year} />
        </div>
      )}
      {toolsOut < 1 && (
        <div style={{ position: "absolute", inset: 0, transform: `translate(${900 * toolsOut}px, ${-900 * toolsOut}px)`, zIndex: 90 }}>
          <Scissors x={pivot.x} y={pivot.y} size={size} rot={deg} open={f < cutEnd ? snip : 0.8} />
          <HandAt x={ring.x} y={ring.y} w={300} rot={deg * 0.15} />
        </div>
      )}
      <TypedStrip text={lines[0]} x={600} y={1130} size={84} font={FONT_BLOCK} bg={BLACK} fg={PAPER} rot={-2} wipe={1} seed="h1" />
      <InkCircle x={365} y={1282} w={330} h={180} at={cue("ثلاث", 75) + 4} dur={12} />
      <TypedStrip text={lines[1]} x={520} y={1275} size={100} font={FONT_BLOCK} bg={PAPER} fg={INK} rot={1.5} wipe={1} seed="h2" maxW={1000} />
    </AbsoluteFill>
  );
};

const YearChip: React.FC<{ year: string }> = ({ year }) => (
  <div style={{ width: "100%", height: "100%", position: "relative", clipPath: "polygon(0.5% 1%, 99% 0, 99.6% 98.5%, 0 99.4%)" }}>
    <Img src={staticFile("img/textures/newsprint.jpg")} style={{ position: "absolute", width: "100%", height: "100%", objectFit: "cover" }} />
    <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: FONT_NASKH, fontWeight: 700, fontSize: 200, color: BLACK, lineHeight: 1 }}>{year}</div>
  </div>
);

const Newspaper: React.FC<{ year: string; hole: boolean }> = ({ year, hole }) => {
  const bars = (seed: string, n: number) =>
    Array.from({ length: n }, (_, i) => (
      <div key={i} style={{ height: 9, marginBottom: 11, background: "#5a554c", opacity: 0.55, width: `${70 + random(seed + i) * 30}%`, marginLeft: "auto" }} />
    ));
  return (
    <div style={{ position: "relative", width: 900, height: 1180, overflow: "hidden", clipPath: "polygon(0 1%, 3% 0, 97% 0.6%, 100% 2%, 99.4% 98%, 96% 100%, 2% 99.3%, 0.4% 96%)" }}>
      <Img src={staticFile("img/textures/newsprint.jpg")} style={{ position: "absolute", width: "100%", height: "100%", objectFit: "cover" }} />
      <div style={{ position: "absolute", inset: "40px 50px", direction: "rtl" }}>
        <div style={{ fontFamily: FONT_NASKH, fontWeight: 700, fontSize: 92, textAlign: "center", color: BLACK, borderBottom: `5px double ${BLACK}`, paddingBottom: 8 }}>الفنون</div>
        <div style={{ display: "flex", justifyContent: "space-between", fontFamily: FONT_NASKH, fontSize: 26, color: "#3b372f", padding: "6px 0", borderBottom: `2px solid ${BLACK}` }}>
          <span>العدد ٢١٧</span><span>صحيفة أسبوعية</span>
        </div>
        <div style={{ display: "flex", gap: 26, marginTop: 30 }}>
          <div style={{ flex: 1 }}>{bars("a", 9)}</div>
          <div style={{ flex: 1 }}>{bars("b", 9)}</div>
          <div style={{ flex: 1 }}>{bars("c", 9)}</div>
        </div>
        <div style={{ height: 290 }} />
        <div style={{ display: "flex", gap: 26 }}>
          <div style={{ flex: 1 }}>{bars("d", 16)}</div>
          <div style={{ flex: 1 }}>{bars("e", 16)}</div>
          <div style={{ flex: 1 }}>{bars("f", 16)}</div>
        </div>
      </div>
      <div style={{ position: "absolute", left: 450 - 270, top: 580 - 135, width: 540, height: 270, display: "flex", alignItems: "center", justifyContent: "center",
        fontFamily: FONT_NASKH, fontWeight: 700, fontSize: 200, color: BLACK, lineHeight: 1, background: hole ? BLACK : "transparent" }}>
        {hole ? null : year}
      </div>
    </div>
  );
};

// ─── 2. STORY (original cut-paper shapes, not reproductions) ────────────
const SHAPE_COLORS = [INK, "#e2572b", "#2f8f5b", "#f2c230", "#d9577d", BLACK, INK, "#e2572b"];
const SHAPES = [
  "M50,0 C70,20 64,40 80,52 C60,56 66,78 50,100 C34,78 40,56 20,52 C36,40 30,20 50,0 Z",
  "M0,60 C15,30 30,30 45,60 C60,90 75,90 90,60 C100,45 100,40 100,40 L100,70 C85,100 60,100 45,75 C30,50 15,55 0,80 Z",
  "M50,0 L58,30 L85,12 L70,40 L100,50 L70,60 L85,88 L58,70 L50,100 L42,70 L15,88 L30,60 L0,50 L30,40 L15,12 L42,30 Z",
  "M40,0 C60,0 60,20 50,26 C75,30 95,20 100,32 C92,44 72,40 60,48 C66,70 80,86 74,100 L60,100 C58,82 50,70 44,62 C38,74 30,88 20,100 L8,96 C18,78 28,60 36,48 C22,44 8,52 0,44 C6,32 26,32 40,26 C30,20 26,0 40,0 Z",
  "M20,0 C40,10 30,30 50,36 C70,42 60,10 80,6 C100,16 88,40 96,56 C100,76 80,100 56,94 C36,90 44,70 24,70 C4,70 0,50 6,32 C10,18 8,6 20,0 Z",
  "M46,0 C54,20 44,34 54,50 C64,66 50,84 58,100 L44,100 C38,84 50,68 40,52 C30,36 40,18 34,0 Z",
];

export const StoryScene: React.FC<{ cue: Cue }> = ({ cue }) => {
  const f = useCurrentFrame();
  const n = 42;
  const bedAt = 0;
  const scissorsAt = cue("مقص", 60);
  return (
    <AbsoluteFill>
      <Paper variant="offwhite" />
      {Array.from({ length: n }, (_, i) => {
        const at = 18 + Math.round(200 * Math.pow(i / n, 0.75));
        const col = i % 6, row = Math.floor(i / 6);
        const x = 120 + col * 168 + (random(`sx${i}`) - 0.5) * 90;
        const y = 170 + row * 150 + (random(`sy${i}`) - 0.5) * 80;
        const w = 150 + random(`sw${i}`) * 130;
        const from = (["left", "right", "top", "drop"] as const)[Math.floor(random(`sf${i}`) * 4)];
        return (
          <Piece key={i} x={x} y={y} w={w} rot={(random(`sr${i}`) - 0.5) * 70} at={at} from={from} dur={7} seed={`sh${i}`} z={10 + i}>
            <svg viewBox="0 0 100 100" width="100%" style={{ display: "block", overflow: "visible" }}>
              <path d={SHAPES[i % SHAPES.length]} fill={SHAPE_COLORS[(i * 5) % SHAPE_COLORS.length]} />
            </svg>
          </Piece>
        );
      })}
      <Piece x={540} y={1240} w={860} at={bedAt} from="bottom" dur={9} seed="bed" z={60}>
        <svg viewBox="0 0 860 420" width="100%" style={{ display: "block" }}>
          <path d="M40,40 C40,8 200,0 250,4 L250,300 L40,300 Z" fill="#cfc4ac" />
          <path d="M20,230 L840,236 L846,330 L16,324 Z" fill={BLACK} />
          <path d="M250,170 C420,150 700,160 820,196 L826,262 L246,258 Z" fill="#f4f0e6" stroke="#bfb6a3" strokeWidth={3} />
          <path d="M300,196 C330,150 420,150 460,190 Z" fill="#e7e1d3" />
          <path d="M40,324 L60,410 L84,410 L86,326 Z M790,330 L800,410 L824,410 L830,330 Z" fill={BLACK} />
        </svg>
      </Piece>
      {f >= scissorsAt - 4 && f < scissorsAt + 40 && (
        <>
          <Scissors x={800 - progress(f, scissorsAt - 4, 30) * 200} y={950} size={320} rot={200} open={Math.abs(Math.sin(Math.floor(f / 2.5) * 1.7))} />
          <HandAt x={880 - progress(f, scissorsAt - 4, 30) * 200} y={1000} w={260} rot={-20} seed="sh" />
        </>
      )}
    </AbsoluteFill>
  );
};

// ─── 3. ARTISTS ────────────────────────────────────────────
export const ArtistsScene: React.FC<{ prints: { src: string; x: number; y: number; w: number; rot: number }[]; words: string[]; cue: Cue }> = ({ prints, words, cue }) => (
  <AbsoluteFill>
    <Paper variant="newsprint" />
    {prints.map((p, i) => (
      <React.Fragment key={p.src}>
        <Cut src={p.src} x={p.x} y={p.y} w={p.w} rot={p.rot} at={i * 11} from={(["left", "right", "bottom", "top"] as const)[i % 4]} seed={p.src} z={10 + i} dur={8} />
      </React.Fragment>
    ))}
    {prints.map((p, i) => (
      <Tape key={`t${i}`} x={p.x + (i % 2 ? 40 : -40)} y={p.y - p.w * 0.72} rot={(i % 2 ? 1 : -1) * (6 + i * 3)} w={150} at={i * 11 + 9} v={i} />
    ))}
    {words.map((w, i) => (
      <RansomWord key={w} text={w} x={540} y={[420, 820, 1200][i]} size={150} at={cue(["وجع", "أسئل", "ضيق"][i], 120 + i * 35)} per={2} seed={`w${i}`} />
    ))}
  </AbsoluteFill>
);

// ─── 4. PROGRAM INTRO ──────────────────────────────────────
export const ProgramScene: React.FC<{ title: string; counter: string; logos: LogoSet; cue: Cue }> = ({ title, counter, logos, cue }) => {
  const logoAt = cue("حداد", 90);
  return (
    <AbsoluteFill>
      <Paper variant="offwhite" />
      <InkStain x={540} y={640} r={400} at={0} dur={cue("مِداد", 20) + 30} seed="midad" />
      <RansomWord text={title} x={540} y={620} size={250} at={cue("مِداد", 20) - 6} per={5} seed="title" palette={[0, 1, 3]} />
      <LogoTab src={logos.studio} x={850} y={1060} w={250} at={logoAt} rot={3} seed="l1" pad={20} />
      <LogoTab src={logos.lam} x={520} y={1080} w={290} at={logoAt + 6} rot={-2} seed="l2" />
      <LogoTab src={logos.bayt} x={210} y={1060} w={380} at={cue("الثقافة", logoAt + 12)} rot={2} seed="l3" pad={22} />
      <RansomWord text={counter} x={540} y={1260} size={82} at={cue("تسعة", 180)} per={1.5} seed="cnt" palette={[1, 2]} />
    </AbsoluteFill>
  );
};

// ─── 5. INNER / OUTER SPLIT ────────────────────────────────
type SplitItem = { label: string; cue: string; src?: string; swatches?: boolean; tag?: boolean; x: number; y: number; w: number; rot: number };

export const SplitScene: React.FC<{ inner: SplitItem[]; outer: SplitItem[]; innerTitle: string; outerTitle: string; cue: Cue }> = ({ inner, outer, innerTitle, outerTitle, cue }) => {
  const f = useCurrentFrame();
  const edge = Array.from({ length: 40 }, (_, i) => `${540 + (random(`tear${i}`) - 0.5) * 34},${(i / 39) * 1920}`).join(" ");
  const tearP = progress(f, 0, 8);
  const render = (it: SplitItem, i: number, side: "in" | "out") => {
    const at = cue(it.cue, 20 + i * 25);
    return (
      <React.Fragment key={side + i}>
        {it.src && <Cut src={it.src} x={it.x} y={it.y} w={it.w} rot={it.rot} at={at - 3} from={side === "in" ? "right" : "left"} seed={side + i} z={10 + i} dur={6} />}
        {it.swatches && (
          <Piece x={it.x} y={it.y} w={it.w} rot={it.rot} at={at - 3} from="left" seed="sw" z={10 + i} dur={6}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
              {[INK, "#e2572b", "#2f8f5b", "#f2c230", "#d9577d", BLACK].map((c) => (
                <div key={c} style={{ background: c, aspectRatio: "1", clipPath: `polygon(${random(c) * 8}% 0, 100% ${random(c + 1) * 8}%, ${100 - random(c + 2) * 8}% 100%, 0 ${100 - random(c + 3) * 8}%)` }} />
              ))}
            </div>
          </Piece>
        )}
        {it.tag && (
          <Piece x={it.x} y={it.y} w={it.w} rot={it.rot} at={at - 3} from="left" seed="tag" z={10 + i} dur={6}>
            <svg viewBox="0 0 200 110" width="100%" style={{ display: "block" }}>
              <path d="M40,0 L200,0 L200,110 L40,110 L0,55 Z" fill="#e9dfc6" />
              <circle cx={34} cy={55} r={9} fill={BLACK} />
              <text x={122} y={72} textAnchor="middle" fontFamily={FONT_BLOCK} fontSize={50} fill={INK} direction="rtl">سوق</text>
            </svg>
          </Piece>
        )}
        <TypedStrip text={it.label} x={it.x + (side === "in" ? -60 : 60)} y={it.y + it.w * 0.45} size={46} at={at} rot={(random(it.label) - 0.5) * 8} seed={it.label}
          bg={side === "in" ? PAPER : BLACK} fg={side === "in" ? BLACK : PAPER} />
      </React.Fragment>
    );
  };
  return (
    <AbsoluteFill>
      <Paper variant="offwhite" />
      <svg width={1080} height={1920} style={{ position: "absolute", zIndex: 2, transform: `translateX(${(1 - tearP) * 600}px)` }}>
        <polygon points={`1080,0 ${edge} 1080,1920`} fill={BLACK} />
      </svg>
      <div style={{ position: "absolute", inset: 0, zIndex: 3, transform: `translateX(${(1 - tearP) * 600}px)` }}>
        <Img src={staticFile("img/textures/paper_black.jpg")} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", clipPath: `polygon(100% 0, ${edge.split(" ").map((p) => p.split(",").map((v, k) => (k === 0 ? `${(Number(v) / 1080) * 100}%` : `${(Number(v) / 1920) * 100}%`)).join(" ")).join(", ")}, 100% 100%)` }} />
      </div>
      <TypedStrip text={innerTitle} x={810} y={250} size={58} at={4} bg={PAPER} fg={INK} rot={-2} seed="it" />
      <TypedStrip text={outerTitle} x={270} y={250} size={58} at={cue(outer[0].cue, 150) - 10} bg={INK} fg={PAPER} rot={2} seed="ot" />
      {inner.map((it, i) => render(it, i, "in"))}
      {outer.map((it, i) => render(it, i, "out"))}
    </AbsoluteFill>
  );
};

// ─── 6. MENTORS WALL ───────────────────────────────────────
export const MentorsScene: React.FC<{ mentors: { name: string; photo?: string }[] }> = ({ mentors }) => {
  const cols = [860, 540, 220];
  const rows = [400, 790, 1180];
  return (
    <AbsoluteFill>
      <Paper variant="offwhite" />
      {mentors.map((m, i) => {
        const x = cols[i % 3] + (random(`mx${i}`) - 0.5) * 30;
        const y = rows[Math.floor(i / 3)] + (random(`my${i}`) - 0.5) * 30;
        const rot = (random(`mr${i}`) - 0.5) * 9;
        const at = 6 + i * 9;
        const from = (["right", "bottom", "left"] as const)[i % 3];
        return (
          <React.Fragment key={m.name}>
            {m.photo ? (
              <Cut src={m.photo} x={x} y={y - 20} w={290} rot={rot} at={at} from={from} seed={`m${i}`} z={10 + i} dur={7} />
            ) : (
              <Piece x={x} y={y - 20} w={260} rot={rot} at={at} from={from} seed={`m${i}`} z={10 + i} dur={7}>
                <div style={{ height: 300, background: "#f7f3ea", border: `2px solid ${BLACK}`, outline: "10px solid #f7f3ea", display: "flex", alignItems: "center", justifyContent: "center", direction: "rtl" }}>
                  <div style={{ fontFamily: FONT_NASKH, fontWeight: 700, fontSize: 52, color: INK, textAlign: "center", lineHeight: 1.3, padding: 16 }}>{m.name}</div>
                </div>
              </Piece>
            )}
            <Tape x={x + (i % 2 ? 50 : -50)} y={y - 185} w={130} rot={(i % 2 ? 1 : -1) * 12} at={at + 7} v={i} />
            {m.photo && <TypedStrip text={m.name} x={x} y={y + 150} size={32} at={at + 8} rot={-rot * 0.6} seed={`n${i}`} />}
          </React.Fragment>
        );
      })}
    </AbsoluteFill>
  );
};

// ─── 7. DATES & PRICES ─────────────────────────────────────
export const DatesScene: React.FC<{ start: string; end: string; stickers: string[]; cue: Cue }> = ({ start, end, stickers, cue }) => {
  const circleAt = cue("ستة", 90);
  return (
    <AbsoluteFill>
      <Paper variant="offwhite" />
      <Piece x={540} y={500} w={1000} rot={-1.5} at={0} from="right" dur={9} seed="cal">
        <div style={{ background: "#f7f3ea", display: "flex", direction: "rtl", alignItems: "center", justifyContent: "space-between", padding: "40px 60px", clipPath: "polygon(0 4%, 3% 0, 20% 3%, 45% 0, 70% 4%, 100% 1%, 99% 96%, 70% 100%, 40% 97%, 10% 100%, 1% 95%)", borderTop: `14px solid ${BLACK}` }}>
          <DateBlock text={start} />
          <div style={{ fontFamily: FONT_BLOCK, fontSize: 110, color: BLACK }}>←</div>
          <DateBlock text={end} />
        </div>
      </Piece>
      <InkCircle x={270} y={520} w={380} h={250} at={circleAt} dur={14} />
      {stickers.map((s, i) => (
        <TypedStrip key={s} text={s} x={i === 0 ? 540 : i === 1 ? 530 : 600} y={[850, 1060, 1250][i]} size={i === 0 ? 50 : i === 1 ? 44 : 54} maxW={1000}
          at={[70, 100, 130][i]} rot={[-2, 1.5, -3][i]} bg={i === 0 ? INK : i === 1 ? PAPER : BLACK} fg={i === 1 ? BLACK : PAPER} seed={`st${i}`} wipe={6} />
      ))}
    </AbsoluteFill>
  );
};

const DateBlock: React.FC<{ text: string }> = ({ text }) => {
  const [d, ...m] = text.split(" ");
  return (
    <div style={{ textAlign: "center", lineHeight: 1 }}>
      <div style={{ fontFamily: FONT_NASKH, fontWeight: 700, fontSize: 150, color: BLACK }}>{d}</div>
      <div style={{ fontFamily: FONT_NASKH, fontWeight: 700, fontSize: 64, color: BLACK }}>{m.join(" ")}</div>
    </div>
  );
};

// ─── 8. CTA ────────────────────────────────────────────────
export const CtaScene: React.FC<{ question: string; action: string; logos: LogoSet }> = ({ question, action, logos }) => (
  <AbsoluteFill>
    <Paper variant="black" />
    <RansomWord text={question} x={540} y={620} size={140} at={2} per={3} seed="q" palette={[0, 2, 3, 4]} group={2} />
    <TypedStrip text={action} x={540} y={960} size={120} font={FONT_BLOCK} bg={INK} fg={PAPER} at={40} rot={-2} seed="cta" wipe={6} />
    <LogoTab src={logos.studio} x={850} y={1230} w={230} at={62} rot={3} seed="c1" pad={18} />
    <LogoTab src={logos.lam} x={530} y={1240} w={270} at={68} rot={-2} seed="c2" />
    <LogoTab src={logos.bayt} x={215} y={1230} w={370} at={74} rot={2} seed="c3" pad={20} />
  </AbsoluteFill>
);


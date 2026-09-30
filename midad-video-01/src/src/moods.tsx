import React from "react";
import { AbsoluteFill, Img } from "remotion";
import { img } from "./components/collage";
import { FONT_BLOCK, FONT_NASKH, FONT_TYPE } from "./fonts";

export const MIDAD = {
  cream: "#F6F1E5",
  creamDeep: "#ECE4D3",
  green: "#006549",
  greenDeep: "#004B35",
  sky: "#B7DAED",
  orange: "#F74F00",
  pink: "#E3BEE1",
  acid: "#CEE224",
  blue: "#009BD4",
  ink: "#18201A",
};

const Tinted: React.FC<{ color: string }> = ({ color }) => (
  <AbsoluteFill style={{ backgroundColor: color }}>
    <Img src={img("textures/paper_offwhite.jpg")} style={{ width: "100%", height: "100%", objectFit: "cover", mixBlendMode: "multiply", opacity: 0.55 }} />
  </AbsoluteFill>
);

const Label: React.FC<{ text: string; x: number; y: number; bg: string; fg: string; size?: number; rot?: number }> = ({ text, x, y, bg, fg, size = 40, rot = 0 }) => (
  <div style={{ position: "absolute", left: x, top: y, transform: `translate(-50%,-50%) rotate(${rot}deg)`, background: bg, color: fg, fontFamily: FONT_TYPE, fontWeight: 600, fontSize: size, padding: `${size * 0.2}px ${size * 0.55}px`, direction: "rtl", whiteSpace: "nowrap", boxShadow: "2px 4px 8px rgba(0,0,0,0.12)" }}>
    {text}
  </div>
);

const Photo: React.FC<{ src: string; x: number; y: number; w: number; rot?: number; shadow?: number }> = ({ src, x, y, w, rot = 0, shadow = 14 }) => (
  <Img src={img(src)} style={{ position: "absolute", left: x - w / 2, top: y, width: w, transform: `translateY(-50%) rotate(${rot}deg)`, filter: `drop-shadow(${shadow * 0.4}px ${shadow * 0.7}px ${shadow}px rgba(0,0,0,0.22))` }} />
);

// A. Artist's notebook: cream page, one cut-out, a single hand-drawn green line, lots of air.
export const MoodNotebook: React.FC = () => (
  <AbsoluteFill>
    <Tinted color={MIDAD.cream} />
    <div style={{ position: "absolute", top: 230, width: "100%", textAlign: "center", fontFamily: FONT_NASKH, fontWeight: 700, fontSize: 104, color: MIDAD.greenDeep, direction: "rtl" }}>هل أعمالك تشبهك؟</div>
    <Photo src="portraits/hafsa_alkhudairi.png" x={600} y={930} w={620} rot={-1.5} />
    <svg width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
      <path d="M 250 1330 C 180 1200, 190 1060, 300 1000 S 330 820, 250 760" fill="none" stroke={MIDAD.green} strokeWidth={5} strokeLinecap="round" />
      <circle cx={250} cy={760} r={11} fill={MIDAD.orange} />
    </svg>
    <Label text="اللون بوصفه لغة" x={330} y={1380} bg="transparent" fg={MIDAD.greenDeep} size={46} />
    <div style={{ position: "absolute", bottom: 150, width: "100%", textAlign: "center", fontFamily: FONT_TYPE, fontWeight: 600, fontSize: 34, color: MIDAD.green, direction: "rtl" }}>مِداد · حدّاد استديو</div>
  </AbsoluteFill>
);

// B. Coloured paper: two or three flat sheets in the brand colours, B&W photo on top.
export const MoodPaper: React.FC = () => (
  <AbsoluteFill>
    <Tinted color={MIDAD.cream} />
    <svg width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
      <path d="M 0 760 L 1080 700 L 1080 1920 L 0 1920 Z" fill={MIDAD.green} />
      <circle cx={230} cy={690} r={150} fill={MIDAD.orange} />
      <path d="M 90 1540 C 150 1440, 260 1430, 300 1520 C 250 1560, 170 1600, 90 1540 Z" fill={MIDAD.acid} />
    </svg>
    <div style={{ position: "absolute", top: 250, right: 90, fontFamily: FONT_BLOCK, fontSize: 118, lineHeight: 1.15, color: MIDAD.ink, direction: "rtl", textAlign: "right" }}>هل أعمالك<br />تشبهك؟</div>
    <Photo src="portraits/hafsa_alkhudairi.png" x={520} y={1120} w={640} rot={1.5} shadow={22} />
    <Label text="اللون بوصفه لغة" x={560} y={1520} bg={MIDAD.pink} fg={MIDAD.ink} size={46} rot={-2} />
  </AbsoluteFill>
);

// C. Quiet archive: sky paper, small taped prints in a loose grid, typed labels, one green ink circle.
export const MoodArchive: React.FC = () => (
  <AbsoluteFill>
    <Tinted color={MIDAD.sky} />
    <div style={{ position: "absolute", top: 230, width: "100%", textAlign: "center", fontFamily: FONT_TYPE, fontWeight: 600, fontSize: 88, color: MIDAD.ink, direction: "rtl" }}>هل أعمالك تشبهك؟</div>
    <Photo src="prints/inking.png" x={330} y={880} w={360} rot={-3} shadow={10} />
    <Photo src="portraits/hafsa_alkhudairi.png" x={760} y={820} w={400} rot={2} shadow={10} />
    <Img src={img("textures/tape_1.png")} style={{ position: "absolute", left: 250, top: 540, width: 150, transform: "rotate(-8deg)" }} />
    <Img src={img("textures/tape_2.png")} style={{ position: "absolute", left: 700, top: 590, width: 150, transform: "rotate(6deg)" }} />
    <Label text="الرسم كطريقة للرؤية" x={330} y={1260} bg={MIDAD.cream} fg={MIDAD.ink} size={36} rot={-1} />
    <Label text="اللون بوصفه لغة" x={760} y={1200} bg={MIDAD.cream} fg={MIDAD.ink} size={36} rot={1.5} />
    <svg width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
      <ellipse cx={760} cy={1200} rx={210} ry={70} fill="none" stroke={MIDAD.green} strokeWidth={5} transform="rotate(-4 760 1200)" />
    </svg>
  </AbsoluteFill>
);

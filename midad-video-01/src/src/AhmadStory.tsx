import React from "react";
import { AbsoluteFill, Audio, Img, Sequence, interpolate, random, staticFile, useCurrentFrame } from "remotion";
import { FPS, progress } from "./lib/motion";
import { MIDAD } from "./moods";
import { Cut, Piece, Tape, img } from "./components/collage";
import { FONT_BLOCK, FONT_NASKH, FONT_TYPE } from "./fonts";

const s = (sec: number) => Math.round(sec * FPS);
export const AHMAD_STORY_FRAMES = s(73.5);

const Page: React.FC<{ color?: string; sheet?: string; sheetTop?: number }> = ({ color = MIDAD.cream, sheet, sheetTop = 1100 }) => (
  <AbsoluteFill style={{ backgroundColor: color }}>
    <Img src={img("textures/paper_offwhite.jpg")} style={{ width: "100%", height: "100%", objectFit: "cover", mixBlendMode: "multiply", opacity: 0.5 }} />
    {sheet && (
      <svg width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
        <path d={`M 0 ${sheetTop + 40} L 1080 ${sheetTop - 30} L 1080 1920 L 0 1920 Z`} fill={sheet} />
      </svg>
    )}
  </AbsoluteFill>
);

// Words arrive one by one, right to left, then hold.
const Say: React.FC<{ text: string; at: number; x?: number; y: number; size?: number; color?: string; font?: string; width?: number; bg?: string; align?: "center" | "right" }> = ({
  text, at, x = 540, y, size = 72, color = MIDAD.ink, font = FONT_BLOCK, width = 940, bg, align = "center",
}) => {
  const f = useCurrentFrame();
  if (f < at) return null;
  const words = text.split(" ");
  return (
    <div style={{ position: "absolute", left: x - width / 2, top: y, width, transform: "translateY(-50%)", display: "flex", flexWrap: "wrap", justifyContent: align === "center" ? "center" : "flex-start", direction: "rtl", gap: `${size * 0.1}px ${size * 0.28}px`, zIndex: 60 }}>
      {words.map((w, i) => {
        const p = progress(f, at + i * 2, 6);
        return (
          <span key={i} style={{ fontFamily: font, fontWeight: font === FONT_TYPE ? 600 : font === FONT_NASKH ? 700 : 400, fontSize: size, lineHeight: 1.3, color, opacity: p, transform: `translateY(${(1 - p) * size * 0.35}px)`, background: bg, padding: bg ? `0 ${size * 0.18}px` : 0 }}>
            {w}
          </span>
        );
      })}
    </div>
  );
};

const Chip: React.FC<{ text: string; at: number; x: number; y: number; bg: string; fg: string; size?: number; rot?: number }> = ({ text, at, x, y, bg, fg, size = 44, rot = 0 }) => {
  const f = useCurrentFrame();
  if (f < at) return null;
  const p = progress(f, at, 6);
  return (
    <div style={{ position: "absolute", left: x, top: y, transform: `translate(-50%,-50%) rotate(${rot}deg) scale(${interpolate(p, [0, 1], [1.15, 1])})`, opacity: p, background: bg, color: fg, fontFamily: FONT_TYPE, fontWeight: 600, fontSize: size, padding: `${size * 0.18}px ${size * 0.5}px`, whiteSpace: "nowrap", direction: "rtl", boxShadow: "3px 6px 12px rgba(0,0,0,0.15)", zIndex: 70 }}>
      {text}
    </div>
  );
};

const Stat: React.FC<{ value: string; label: string; at: number; x: number; y: number; color: string }> = ({ value, label, at, x, y, color }) => {
  const f = useCurrentFrame();
  if (f < at) return null;
  const p = progress(f, at, 7);
  return (
    <div style={{ position: "absolute", left: x, top: y, transform: `translate(-50%,-50%) translateY(${(1 - p) * 40}px)`, opacity: p, textAlign: "center", direction: "rtl", zIndex: 70 }}>
      <div style={{ fontFamily: FONT_BLOCK, fontSize: 150, lineHeight: 1, color }}>{value}</div>
      <div style={{ fontFamily: FONT_TYPE, fontWeight: 600, fontSize: 44, color: MIDAD.ink, marginTop: 8 }}>{label}</div>
    </div>
  );
};

const Blob: React.FC<{ x: number; y: number; r: number; color: string; at?: number; shape?: "circle" | "leaf" }> = ({ x, y, r, color, at = 0, shape = "circle" }) => {
  const f = useCurrentFrame();
  const p = progress(f, at, 8);
  return (
    <svg width={r * 2} height={r * 2} style={{ position: "absolute", left: x - r, top: y - r, transform: `scale(${p})`, zIndex: 3 }}>
      {shape === "circle" ? <circle cx={r} cy={r} r={r} fill={color} /> : <path d={`M 0 ${r} C ${r * 0.4} ${r * 0.1}, ${r * 1.4} ${r * 0.05}, ${r * 2} ${r} C ${r * 1.4} ${r * 1.5}, ${r * 0.5} ${r * 1.6}, 0 ${r} Z`} fill={color} />}
    </svg>
  );
};

const PORTRAITS = [
  ["لاما المدني", "portraits/lama_almadani.png"],
  ["سامية المهدلي", "portraits/samia_almahdali.png"],
  ["حذيفة حجازي", "portraits/hudhaifa_hijazi.png"],
  ["حفصة الخضيري", "portraits/hafsa_alkhudairi.png"],
  ["أحمد سلام", "portraits/ahmad_salam.png"],
  ["رؤى صحاف", "portraits/ruaa_sahhaf.png"],
  ["نورة شقير", ""],
  ["خيرية رفعت", "portraits/khairia_rifaat.png"],
] as const;

const INNER = ["الحياة كاستديو", "الإدراك الداخلي", "الاستديو كحياة", "كيف تُشكّل معتقداتك ممارستك؟", "اكتشف نمطك", "المحرك الداخلي", "تجسيد: جسّد قيمك وآلامك"];
const OUTER: [string, string[]][] = [
  ["بناء اللغة البصرية", ["اللون بوصفه لغة", "الرسم كطريقة للرؤية", "الخيال في الممارسة الثقافية السعودية", "عين المخرج الفني"]],
  ["من الحوار إلى الأثر", ["أنا والخمسة عشر فنانًا", "قصة واحدة ومئتا فنان"]],
  ["استكشاف المواد", ["تبادل الأدوات الفنية", "من أنت كمادة؟"]],
  ["الممارسة المهنية", ["الملف الفني", "من السؤال إلى البحث الفني", "العمل الفني في السوق", "كيف تُلاحَظ في المشهد الفني"]],
];

const Beat: React.FC<{ from: number; to: number; children: React.ReactNode }> = ({ from, to, children }) => (
  <Sequence from={s(from)} durationInFrames={s(to) - s(from)}>
    {children}
  </Sequence>
);

const LOGOS = ["logos/haddad_studio.png", "logos/lam_alqamariya.png", "logos/bayt_althaqafa.png"];
const LogoRow: React.FC<{ at: number; y: number }> = ({ at, y }) => (
  <>
    {LOGOS.map((src, i) => (
      <Piece key={src} x={[850, 540, 215][i]} y={y} w={[210, 250, 330][i]} at={at + i * 4} from="bottom" dur={8} seed={`lg${i}`} rot={[2, -1.5, 1][i]}>
        <div style={{ background: "#fbf8f1", padding: 20 }}>
          <Img src={img(src)} style={{ width: "100%", display: "block" }} />
        </div>
      </Piece>
    ))}
  </>
);

export const AhmadStory: React.FC<{ withVoice: boolean }> = ({ withVoice }) => {
  // Timings (seconds) come from the edited voiceover audio/vo_ahmad_edit.mp3.
  return (
    <AbsoluteFill style={{ backgroundColor: MIDAD.cream }}>
      <Beat from={0} to={9.9}>
        <Page />
        <Say text="٢٠١٤، جدة" at={s(0.2)} y={260} size={120} color={MIDAD.greenDeep} />
        <Say text="وريت أعمالي لبروفيسور ناقد فني" at={s(2.1)} y={420} size={54} font={FONT_TYPE} />
        <Cut src="prints/inking.png" x={360} y={900} w={380} rot={-5} at={s(2.3)} from="right" seed="sk1" />
        <Cut src="prints/drawing_topdown.png" x={720} y={950} w={360} rot={4} at={s(2.8)} from="left" seed="sk2" />
        <Chip text="قال لي: حلوة…" at={s(5.0)} x={540} y={1330} bg={MIDAD.pink} fg={MIDAD.ink} size={56} rot={-2} />
        <Say text="بس هذي سكتشات، ما تنعرض في معارض فنية" at={s(7.05)} y={1520} size={52} font={FONT_TYPE} color={MIDAD.greenDeep} />
        <Blob x={900} y={1780} r={90} color={MIDAD.orange} at={s(7.05)} />
      </Beat>

      <Beat from={9.9} to={13.9}>
        <Page color={MIDAD.greenDeep} />
        <Say text="«لو ما رسمت زيّي،" at={s(0.25)} y={760} size={100} color={MIDAD.cream} />
        <Say text="ما في أحد راح ياخذك بجدية.»" at={s(1.6)} y={960} size={100} color={MIDAD.acid} />
      </Beat>

      <Beat from={13.9} to={19.1}>
        <Page sheet={MIDAD.green} sheetTop={1250} />
        <Blob x={250} y={560} r={150} color={MIDAD.orange} at={s(0.2)} />
        <Cut src="portraits/ahmad_full.png" x={600} y={900} w={430} at={s(0.1)} from="bottom" seed="af" dur={9} />
        <Say text="خلال هذه السنين" at={s(0.15)} y={250} size={60} font={FONT_TYPE} />
        <Say text="أفهم نفسي، وما أكون مكرّر" at={s(1.75)} y={1480} size={80} color={MIDAD.cream} />
      </Beat>

      <Beat from={19.1} to={25.6}>
        <Page />
        <Cut src="prints/ahmad_red_artwork.png" x={540} y={900} w={660} rot={-2} at={s(0.1)} from="drop" seed="red" dur={8} />
        <Chip text="حياتي" at={s(0.2)} x={250} y={340} bg={MIDAD.green} fg={MIDAD.cream} rot={-3} />
        <Chip text="صدماتي النفسية" at={s(1.2)} x={760} y={420} bg={MIDAD.pink} fg={MIDAD.ink} rot={2} />
        <Chip text="اللحظات السعيدة والحزينة" at={s(2.9)} x={540} y={1400} bg={MIDAD.acid} fg={MIDAD.ink} rot={-1.5} />
        <Say text="كمادة فنية أرسم من خلالها" at={s(4.3)} y={1600} size={68} color={MIDAD.greenDeep} />
      </Beat>

      <Beat from={25.6} to={35.9}>
        <Page sheet={MIDAD.sky} sheetTop={1180} />
        <Say text="وبعد فترة انعرفت في الساحة الفنية" at={s(0.2)} y={250} size={64} />
        <Cut src="prints/ahmad_drawing.png" x={540} y={720} w={820} rot={1.5} at={s(0.3)} from="right" seed="drw" />
        <Tape x={540} y={440} w={170} rot={-4} at={s(0.6)} v={1} />
        <Chip text="معارض" at={s(2.5)} x={300} y={1260} bg={MIDAD.green} fg={MIDAD.cream} rot={-2} size={50} />
        <Chip text="إقامات محلية وعالمية" at={s(3.6)} x={680} y={1380} bg={MIDAD.cream} fg={MIDAD.ink} rot={1.5} size={50} />
        <Chip text="بعت أعمال" at={s(7.0)} x={330} y={1530} bg={MIDAD.orange} fg={MIDAD.cream} rot={2} size={50} />
        <Chip text="مقتنون محليون ودوليون" at={s(8.0)} x={660} y={1660} bg={MIDAD.pink} fg={MIDAD.ink} rot={-1.5} size={50} />
      </Beat>

      <Beat from={35.9} to={44.1}>
        <Page />
        <Cut src="prints/ahmad_teaching.png" x={540} y={560} w={880} rot={-1.5} at={s(0.1)} from="left" seed="tch" />
        <Tape x={220} y={290} w={160} rot={-10} at={s(0.4)} v={2} />
        <Stat value="+١٢٠٠" label="ساعة تدريب" at={s(0.35)} x={760} y={1150} color={MIDAD.green} />
        <Stat value="١٦" label="مدينة حول المملكة" at={s(3.1)} x={300} y={1150} color={MIDAD.orange} />
        <Stat value="+٣٨٠٠" label="مستفيد" at={s(5.2)} x={540} y={1560} color={MIDAD.greenDeep} />
      </Beat>

      <Beat from={44.1} to={52.2}>
        <Page sheet={MIDAD.greenDeep} sheetTop={1500} />
        <Say text="صغت كل هذا مع أقوى الأسماء الفنية" at={s(0.25)} y={200} size={60} />
        {PORTRAITS.map(([name, src], i) => {
          const col = i % 4, row = Math.floor(i / 4);
          const x = 925 - col * 257;
          const y = 530 + row * 450;
          const at = s(1.9) + i * 5;
          return (
            <React.Fragment key={name}>
              {src ? (
                <Cut src={src} x={x} y={y} w={235} rot={(random(name) - 0.5) * 6} at={at} from="drop" seed={name} dur={7} />
              ) : (
                <Piece x={x} y={y} w={225} at={at} from="drop" seed={name} dur={7}>
                  <div style={{ height: 250, background: "#fbf8f1", border: `2px solid ${MIDAD.green}`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: FONT_NASKH, fontWeight: 700, fontSize: 44, color: MIDAD.green, textAlign: "center", direction: "rtl", lineHeight: 1.3 }}>{name}</div>
                </Piece>
              )}
              {src && <Chip text={name} at={at + 5} x={x} y={y + 160} bg={MIDAD.cream} fg={MIDAD.ink} size={28} />}
            </React.Fragment>
          );
        })}
        <Say text="في برنامج واحد اسمه" at={s(6.6)} y={1600} size={56} font={FONT_TYPE} color={MIDAD.cream} />
        <Say text="مِداد" at={s(7.2)} y={1740} size={140} color={MIDAD.acid} />
      </Beat>

      <Beat from={52.2} to={57.9}>
        <Page />
        <Blob x={200} y={380} r={120} color={MIDAD.pink} />
        <Blob x={880} y={1500} r={110} color={MIDAD.acid} shape="leaf" />
        <Say text="١٩ ورشة" at={s(0.2)} y={560} size={170} color={MIDAD.green} />
        <Say text="في ٥ فصول" at={s(1.95)} y={790} size={110} color={MIDAD.orange} />
        <Say text="من حدّاد استديو بالتعاون مع بيت الثقافة في الرياض" at={s(2.6)} y={1000} size={48} font={FONT_TYPE} width={860} />
        <LogoRow at={s(3.0)} y={1260} />
      </Beat>

      <Beat from={57.9} to={63.6}>
        <Page />
        <WorkshopMap />
      </Beat>

      <Beat from={63.6} to={65.2}>
        <Page sheet={MIDAD.green} sheetTop={1200} />
        <Say text="نبدأ" at={s(0.1)} y={620} size={90} font={FONT_TYPE} />
        <Say text="١٠ أكتوبر" at={s(0.35)} y={860} size={190} color={MIDAD.orange} />
      </Beat>

      <Beat from={65.2} to={70.45}>
        <Page />
        <Say text="المقاعد محدودة" at={s(0.4)} y={520} size={120} color={MIDAD.greenDeep} />
        <Chip text="خصم التسجيل المبكر حتى ٥ أكتوبر" at={s(2.1)} x={540} y={900} bg={MIDAD.orange} fg={MIDAD.cream} size={54} rot={-2} />
        <Chip text="خصم الطلاب" at={s(3.8)} x={540} y={1090} bg={MIDAD.pink} fg={MIDAD.ink} size={60} rot={1.5} />
      </Beat>

      <Beat from={70.45} to={73.5}>
        <Page sheet={MIDAD.greenDeep} sheetTop={1050} />
        <Say text="سجّل الآن" at={s(0.05)} y={520} size={150} color={MIDAD.green} />
        <Say text="الرابط في البايو" at={s(0.35)} y={760} size={64} font={FONT_TYPE} />
        <LogoRow at={s(0.5)} y={1400} />
      </Beat>

      {withVoice && <Audio src={staticFile("audio/vo.mp3")} />}
    </AbsoluteFill>
  );
};

// The whole programme on one page: inner training on the right, outer training (four chapters) on the left.
const WorkshopMap: React.FC = () => {
  const f = useCurrentFrame();
  const col = (at: number) => progress(f, at, 8);
  const item = (t: string, i: number, base: number, color: string) => {
    const p = progress(f, base + i * 2, 5);
    return (
      <div key={t} style={{ fontFamily: FONT_TYPE, fontWeight: 600, fontSize: 31, lineHeight: 1.45, color, opacity: p, transform: `translateX(${(1 - p) * -20}px)` }}>
        {t}
      </div>
    );
  };
  return (
    <>
      <div style={{ position: "absolute", top: 150, width: "100%", textAlign: "center", fontFamily: FONT_BLOCK, fontSize: 64, color: MIDAD.ink, direction: "rtl" }}>تبدأ من الداخل، وتنتهي في الخارج</div>
      <div style={{ position: "absolute", top: 290, right: 50, width: 440, bottom: 190, background: MIDAD.green, padding: "34px 30px", direction: "rtl", opacity: col(0), boxShadow: "6px 10px 24px rgba(0,0,0,0.18)" }}>
        <div style={{ fontFamily: FONT_BLOCK, fontSize: 52, color: MIDAD.acid }}>التدريب الداخلي</div>
        <div style={{ fontFamily: FONT_TYPE, fontWeight: 600, fontSize: 28, color: MIDAD.cream, opacity: 0.85, marginBottom: 20 }}>الفصل الأول · ٧ ورش</div>
        {INNER.map((t, i) => item(t, i, 6, MIDAD.cream))}
      </div>
      <div style={{ position: "absolute", top: 290, left: 50, width: 500, bottom: 190, background: "#fbf8f1", padding: "34px 30px", direction: "rtl", opacity: col(s(0.9)), boxShadow: "6px 10px 24px rgba(0,0,0,0.12)" }}>
        <div style={{ fontFamily: FONT_BLOCK, fontSize: 52, color: MIDAD.orange }}>التدريب الخارجي</div>
        <div style={{ fontFamily: FONT_TYPE, fontWeight: 600, fontSize: 28, color: MIDAD.ink, opacity: 0.7, marginBottom: 12 }}>الفصول ٢–٥ · ١٢ ورشة</div>
        {OUTER.map(([chapter, items], ci) => (
          <div key={chapter} style={{ marginTop: 10 }}>
            <div style={{ fontFamily: FONT_TYPE, fontWeight: 600, fontSize: 27, color: MIDAD.green }}>{chapter}</div>
            {items.map((t, i) => item(t, i, s(0.9) + 8 + ci * 8, MIDAD.ink))}
          </div>
        ))}
      </div>
    </>
  );
};

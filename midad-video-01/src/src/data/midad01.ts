import { FPS } from "../lib/motion";

export type SceneKey = "hook" | "story" | "artists" | "program" | "split" | "mentors" | "dates" | "cta";

// Seconds, from the locked script.
export const SCENES: { key: SceneKey; start: number; end: number; vo: string }[] = [
  { key: "hook", start: 0, end: 6, vo: "١٩٤١. قالوا لماتيس: باقي لك ثلاث سنين على الأكثر." },
  { key: "story", start: 6, end: 14, vo: "ما عاد يقدر يوقف قدّام اللوحة. فمسك مقص، وصار يرسم من سريره. وطلعت منها أعمال من أهم اللي سوّاها في حياته." },
  { key: "artists", start: 14, end: 22, vo: "الفنانين الكبار يشتغلون باللي بين أيديهم: وجعهم، أسئلتهم، وحتى ضيقهم." },
  { key: "program", start: 22, end: 30, vo: "عشان كذا سوّينا مِداد. برنامج تطويري من حداد استديو وبيت الثقافة. تسعة عشر ورشة، في خمسة فصول." },
  { key: "split", start: 30, end: 40, vo: "تبدأ من جوّا: تلاحظ جسمك، تفهم معتقداتك، وترسم من اللاواعي. وبعدين تطلع برّا: لون، وخط، ومواد، وملف فني، وسوق، ومعرض." },
  { key: "mentors", start: 40, end: 47, vo: "معك ممارسين ومرشدين، وساعات استشارية وجهاً لوجه." },
  { key: "dates", start: 47, end: 54, vo: "نبدأ عشرة أكتوبر، ونختم بمعرض يوم ستة وعشرين ديسمبر." },
  { key: "cta", start: 54, end: 60, vo: "المقاعد محدودة. سجّل الحين، والرابط في البايو." },
];

export const TOTAL_FRAMES = 60 * FPS;
export const sceneFrames = (k: SceneKey) => {
  const s = SCENES.find((x) => x.key === k)!;
  return { from: Math.round(s.start * FPS), dur: Math.round((s.end - s.start) * FPS) };
};

export const MENTORS: { name: string; photo?: string }[] = [
  { name: "لاما المدني", photo: "portraits/lama_almadani.png" },
  { name: "سامية المهدلي", photo: "portraits/samia_almahdali.png" },
  { name: "حذيفة حجازي", photo: "portraits/hudhaifa_hijazi.png" },
  { name: "حفصة الخضيري", photo: "portraits/hafsa_alkhudairi.png" },
  { name: "أحمد سلام", photo: "portraits/ahmad_salam.png" },
  { name: "رؤى صحاف", photo: "portraits/ruaa_sahhaf.png" },
  { name: "نورة شقير" },
  { name: "ماريا ميان", photo: "portraits/maria_mian.png" },
  { name: "خيرية رفعت", photo: "portraits/khairia_rifaat.png" },
];

export const PRICE_STICKERS = [
  "المسار الكامل ٦٬٨٥٠ ريال بدل ٧٬٥٠٠ —\nحتى ٥ أكتوبر",
  "خصم الطلاب: ٦٬٠٠٠ ريال —\n١٠ مقاعد، بإثبات قيد جامعي",
  "أو اختر ورشة وحدة",
];

export type CaptionWord = { text: string; start: number; end: number }; // seconds

// Placeholder word timing (even spread inside each scene) until the VO timestamps exist.
export const placeholderWords = (): CaptionWord[] =>
  SCENES.flatMap((s) => {
    const words = s.vo.split(/\s+/);
    const t0 = s.start + 0.25;
    const t1 = s.end - 0.35;
    const weights = words.map((w) => w.length + 2);
    const total = weights.reduce((a, b) => a + b, 0);
    let t = t0;
    return words.map((w, i) => {
      const d = ((t1 - t0) * weights[i]) / total;
      const out = { text: w, start: t, end: t + d };
      t += d;
      return out;
    });
  });

// Group words into short caption lines (max ~4 words, break after punctuation).
export const toLines = (words: CaptionWord[]) => {
  const lines: CaptionWord[] = [];
  let cur: CaptionWord[] = [];
  const flush = () => {
    if (!cur.length) return;
    lines.push({ text: cur.map((w) => w.text).join(" "), start: cur[0].start, end: cur[cur.length - 1].end });
    cur = [];
  };
  for (const w of words) {
    cur.push(w);
    if (/[.،:؟]$/.test(w.text) || cur.length >= 4) flush();
  }
  flush();
  return lines.map((l, i) => ({ ...l, end: Math.max(l.end, (lines[i + 1]?.start ?? l.end) - 0.05) }));
};

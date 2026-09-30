import React from "react";
import { AbsoluteFill, Audio, Sequence, staticFile, useCurrentFrame } from "remotion";
import { FPS, toArabicDigits } from "./lib/motion";
import { CaptionWord, MENTORS, PRICE_STICKERS, SCENES, SceneKey, placeholderWords, sceneFrames, toLines } from "./data/midad01";
import voWords from "./data/vo_words.json";
import { ArtistsScene, CtaScene, Cue, DatesScene, HookScene, LogoSet, MentorsScene, ProgramScene, SplitScene, StoryScene } from "./scenes/scenes";
import { TypedStrip } from "./components/collage";

export type Midad01Props = { withMusic: boolean; hasVoice: boolean; hasMusic: boolean; hasFoley: boolean };

const WORDS: CaptionWord[] = (voWords as CaptionWord[]).length ? (voWords as CaptionWord[]) : placeholderWords();
const LINES = toLines(WORDS);

const cueFor = (k: SceneKey): Cue => {
  const s = SCENES.find((x) => x.key === k)!;
  return (needle, fallback) => {
    const w = WORDS.find((w) => w.start >= s.start - 0.05 && w.start < s.end && w.text.includes(needle));
    return w ? Math.round((w.start - s.start) * FPS) : fallback;
  };
};

const LOGOS: LogoSet = { studio: "logos/haddad_studio.png", lam: "logos/lam_alqamariya.png", bayt: "logos/bayt_althaqafa.png" };

const Captions: React.FC = () => {
  const t = useCurrentFrame() / FPS;
  const line = LINES.find((l) => t >= l.start && t < l.end);
  if (!line) return null;
  const k = LINES.indexOf(line);
  return (
    <TypedStrip key={k} text={line.text} x={500} y={1460} size={46} maxW={820} at={Math.round(line.start * FPS)} wipe={3} rot={(k % 3) - 1} seed={`cap${k}`} bg="#f7f3ea" />
  );
};

export const Midad01: React.FC<Midad01Props> = ({ withMusic, hasVoice, hasMusic, hasFoley }) => {
  const seq = (k: SceneKey, node: React.ReactNode) => {
    const { from, dur } = sceneFrames(k);
    return (
      <Sequence key={k} from={from} durationInFrames={dur} name={k}>
        {node}
      </Sequence>
    );
  };
  return (
    <AbsoluteFill style={{ backgroundColor: "#171615" }}>
      {seq("hook", <HookScene cue={cueFor("hook")} year="١٩٤١" lines={["قالوا له:", "باقي لك ٣ سنين."]} />)}
      {seq("story", <StoryScene cue={cueFor("story")} />)}
      {seq(
        "artists",
        <ArtistsScene
          cue={cueFor("artists")}
          words={["وجع", "سؤال", "ضيق"]}
          prints={[
            { src: "prints/painting_blue.png", x: 290, y: 560, w: 400, rot: -6 },
            { src: "prints/inking.png", x: 800, y: 500, w: 380, rot: 5 },
            { src: "prints/hands_face.png", x: 560, y: 900, w: 430, rot: -2 },
            { src: "prints/scribble_collage.png", x: 260, y: 1120, w: 380, rot: 7 },
            { src: "prints/photomontage.png", x: 820, y: 1100, w: 420, rot: -5 },
            { src: "prints/painted_portrait.png", x: 540, y: 620, w: 340, rot: 3 },
          ]}
        />,
      )}
      {seq("program", <ProgramScene cue={cueFor("program")} title="مِداد" counter={toArabicDigits("19 ورشة · 5 فصول")} logos={LOGOS} />)}
      {seq(
        "split",
        <SplitScene
          cue={cueFor("split")}
          innerTitle="من الداخل"
          outerTitle="إلى الخارج"
          inner={[
            { label: "جسمك", cue: "جسمك", src: "prints/body_exercise.png", x: 830, y: 560, w: 360, rot: -4 },
            { label: "معتقداتك", cue: "معتقداتك", src: "prints/body_map.png", x: 790, y: 930, w: 340, rot: 5 },
            { label: "اللاواعي", cue: "اللاواعي", src: "prints/scribble_collage.png", x: 830, y: 1230, w: 330, rot: -3 },
          ]}
          outer={[
            { label: "لون", cue: "لون", swatches: true, x: 170, y: 470, w: 260, rot: -5 },
            { label: "خط", cue: "خط", src: "prints/inking.png", x: 390, y: 560, w: 270, rot: 6 },
            { label: "مواد", cue: "مواد", src: "prints/materials.png", x: 160, y: 830, w: 270, rot: 3 },
            { label: "ملف فني", cue: "ملف", src: "prints/ipad_portfolio.png", x: 400, y: 950, w: 260, rot: -6 },
            { label: "سوق", cue: "سوق", tag: true, x: 160, y: 1200, w: 260, rot: -8 },
            { label: "معرض", cue: "معرض", src: "prints/studio_wall.png", x: 390, y: 1250, w: 280, rot: 4 },
          ]}
        />,
      )}
      {seq("mentors", <MentorsScene mentors={MENTORS} />)}
      {seq("dates", <DatesScene cue={cueFor("dates")} start="١٠ أكتوبر" end="٢٦ ديسمبر" stickers={PRICE_STICKERS} />)}
      {seq("cta", <CtaScene question="هل أعمالك تشبهك؟" action="سجّل الآن" logos={LOGOS} />)}
      <Captions />
      {hasVoice && <Audio src={staticFile("audio/vo.mp3")} />}
      {hasFoley && <Audio src={staticFile("audio/foley.wav")} />}
      {withMusic && hasMusic && <Audio src={staticFile("audio/music.mp3")} volume={0.18} />}
    </AbsoluteFill>
  );
};

import React from "react";
import { Composition, Still, continueRender, delayRender, getStaticFiles } from "remotion";
import { MoodArchive, MoodNotebook, MoodPaper } from "./moods";
import { Midad01, Midad01Props } from "./Midad01";
import { AHMAD_STORY_FRAMES, AhmadStory } from "./AhmadStory";
import { TOTAL_FRAMES } from "./data/midad01";
import { fontsReady } from "./fonts";

const fontHandle = delayRender("fonts");
fontsReady.then(() => continueRender(fontHandle));

const has = (name: string) => getStaticFiles().some((f) => f.name === name);

export const RemotionRoot: React.FC = () => {
  const base: Midad01Props = { withMusic: true, hasVoice: has("audio/vo.mp3"), hasMusic: has("audio/music.mp3"), hasFoley: has("audio/foley.wav") };
  return (
    <>
      <Composition id="Midad01" component={Midad01} durationInFrames={TOTAL_FRAMES} fps={30} width={1080} height={1920} defaultProps={base} />
      <Composition id="Midad01NoMusic" component={Midad01} durationInFrames={TOTAL_FRAMES} fps={30} width={1080} height={1920} defaultProps={{ ...base, withMusic: false }} />
      <Composition id="AhmadStory" component={AhmadStory} durationInFrames={AHMAD_STORY_FRAMES} fps={30} width={1080} height={1920} defaultProps={{ withVoice: true }} />
      <Still id="MoodNotebook" component={MoodNotebook} width={1080} height={1920} />
      <Still id="MoodPaper" component={MoodPaper} width={1080} height={1920} />
      <Still id="MoodArchive" component={MoodArchive} width={1080} height={1920} />
    </>
  );
};

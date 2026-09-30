import React from "react";
import { Composition, continueRender, delayRender, getStaticFiles } from "remotion";
import { Midad01, Midad01Props } from "./Midad01";
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
    </>
  );
};

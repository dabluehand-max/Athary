import React from "react";
import { Composition } from "remotion";
import { ArabicTest } from "./ArabicTest";
import "./fonts";
export const RemotionRoot: React.FC = () => (
  <>
    <Composition id="ArabicTest" component={ArabicTest} durationInFrames={30} fps={30} width={1080} height={1920} />
  </>
);

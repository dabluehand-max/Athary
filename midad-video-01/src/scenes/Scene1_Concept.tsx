import React from "react";
import { useCurrentFrame } from "remotion";
import { BaseScene } from "../components/BaseScene";
import { ArabicText, TextStyles } from "../components/ArabicText";
import { VOCaption } from "../components/VOCaption";
import { getScene, TIMELINE } from "../Timeline";

/**
 * Scene 1: مفهوم البرنامج (Program Concept)
 * Duration: 6 seconds (180 frames @ 30fps)
 *
 * Visual: Typography + collage metaphor
 * VO: "مِداد برنامج تطوري يجمع فن الخط والرسم والوعي الجسدي..."
 */
export const Scene1_Concept: React.FC<{ width: number; height: number }> = ({
  width,
  height,
}) => {
  const frame = useCurrentFrame();
  const scene = getScene("scene1");

  // Relative frame within scene (0-180)
  const sceneFrame = frame - scene.start;

  // Title animation: fade in + scale
  const titleOpacity = Math.min(1, sceneFrame / 30); // 1s fade
  const titleScale = 0.9 + titleOpacity * 0.1; // 0.9 → 1.0

  // Body text: stagger, line by line
  const bodyDelay = 60; // Start 2s after title
  const bodyOpacity = Math.max(0, Math.min(1, (sceneFrame - bodyDelay) / 30));

  return (
    <BaseScene
      width={width}
      height={height}
      fps={30}
      durationInFrames={scene.duration}
      backgroundColor="#EFE6D6"
    >
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          textAlign: "center",
          gap: 40,
        }}
      >
        {/* Title */}
        <div
          style={{
            opacity: titleOpacity,
            transform: `scale(${titleScale})`,
            transition: "none",
          }}
        >
          <ArabicText
            text="مفهوم البرنامج"
            fontSize={56}
            fontFamily="amiri"
            weight={700}
            color="#0B1A3A"
          />
        </div>

        {/* Body text */}
        <div
          style={{
            opacity: bodyOpacity,
            maxWidth: "85%",
            transition: "none",
          }}
        >
          <ArabicText
            text="برنامج تطويري يجمع فن الخط والرسم والوعي الجسدي والتقنيات المعاصرة"
            fontSize={24}
            fontFamily="ibm-plex"
            weight={400}
            color="#0B1A3A"
            lineHeight={1.8}
          />
        </div>
      </div>

      {/* VO Caption (bottom overlay) */}
      <VOCaption
        text="مِداد برنامج تطويري يجمع فن الخط والرسم والوعي الجسدي..."
        frameStart={scene.voiceStart || 0}
        frameEnd={scene.voiceEnd || 180}
        position="bottom"
        animationStyle="fade"
      />

      {/* TODO: Add collage background imagery when CATALOG images are processed */}
    </BaseScene>
  );
};

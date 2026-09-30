import React from "react";
import { interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { ArabicText } from "./ArabicText";

interface VOCaptionProps {
  text: string; // Arabic text to display
  frameStart: number; // When caption enters
  frameEnd: number; // When caption exits
  position?: "bottom" | "top" | "center";
  backgroundColor?: string;
  textColor?: string;
  animationStyle?: "fade" | "slide-up" | "slide-down";
}

/**
 * VOCaption: Animated subtitle/caption for voice-over sync
 *
 * Syncs with ElevenLabs VO timing. Built on Remotion's useCurrentFrame.
 */
export const VOCaption: React.FC<VOCaptionProps> = ({
  text,
  frameStart,
  frameEnd,
  position = "bottom",
  backgroundColor = "rgba(11, 26, 58, 0.8)", // Deep navy, semi-transparent
  textColor = "#EFE6D6", // Cream text
  animationStyle = "fade",
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Calc visibility
  const isVisible = frame >= frameStart && frame <= frameEnd;
  const progressIn = Math.max(0, Math.min(1, (frame - frameStart) / 15)); // 0.5s fade-in
  const progressOut = Math.max(0, Math.min(1, (frameEnd - frame) / 15)); // 0.5s fade-out
  const opacity = isVisible ? Math.min(progressIn, progressOut) : 0;

  // Animation styles
  let transform = "translateY(0)";
  if (animationStyle === "slide-up" && isVisible) {
    transform = `translateY(${interpolate(progressIn, [0, 1], [40, 0])}px)`;
  } else if (animationStyle === "slide-down" && isVisible) {
    transform = `translateY(${interpolate(progressIn, [0, 1], [-40, 0])}px)`;
  }

  const positionStyles = {
    bottom: { bottom: 60 },
    top: { top: 60 },
    center: { top: "50%" },
  };

  return (
    <div
      style={{
        position: "absolute",
        ...positionStyles[position],
        left: 0,
        right: 0,
        zIndex: 10,
        opacity,
        transform,
        transition: "none", // Remotion handles timing
      }}
    >
      <div
        style={{
          backgroundColor,
          padding: "16px 32px",
          borderRadius: 8,
          maxWidth: "90%",
          margin: "0 auto",
          textAlign: "center",
        }}
      >
        <ArabicText
          text={text}
          fontSize={20}
          fontFamily="ibm-plex"
          color={textColor}
          weight={400}
          align="center"
        />
      </div>
    </div>
  );
};

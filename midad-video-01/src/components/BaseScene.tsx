import React from "react";
import { Composition } from "remotion";

interface BaseSceneProps {
  width: number;
  height: number;
  fps: number;
  durationInFrames: number;
  children: React.ReactNode;
  backgroundColor?: string;
}

/**
 * BaseScene: Reusable scene wrapper with cream background + safe area
 *
 * - 9:16 vertical (1080×1920 / reframe to 1080×1350 for 4:5 feed)
 * - 12 fps jitter effect on top (stop-motion feel within 30 fps timeline)
 * - Safe margins for text/content
 */
export const BaseScene: React.FC<BaseSceneProps> = ({
  width,
  height,
  fps,
  durationInFrames,
  children,
  backgroundColor = "#EFE6D6", // Cream (#EFE6D6) from brand
}) => {
  return (
    <div
      style={{
        width,
        height,
        backgroundColor,
        position: "relative",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
      }}
    >
      {/* Safe area for content (margins) */}
      <div
        style={{
          width: width * 0.9, // 90% width, 5% margin each side
          height: height * 0.9, // 90% height
          position: "relative",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {children}
      </div>
    </div>
  );
};

/**
 * Jitter effect helper for 12 fps stop-motion feel
 * Maps 30 fps timeline to 12 fps steps with random jitter
 */
export const applyStopMotionJitter = (frame: number, fps: number = 30, stopMotionFps: number = 12) => {
  const stepSize = fps / stopMotionFps; // 30/12 = 2.5 frames per step
  const step = Math.floor(frame / stepSize);
  const jitterX = (Math.random() - 0.5) * 2; // ±1px
  const jitterY = (Math.random() - 0.5) * 2;

  return {
    scaleX: 1 + jitterX * 0.001,
    scaleY: 1 + jitterY * 0.001,
    transform: `translate(${jitterX}px, ${jitterY}px)`,
  };
};

// Composition registration helper
export const registerScene = (
  sceneKey: string,
  Component: React.ComponentType<any>,
  durationInFrames: number
) => {
  return {
    id: sceneKey,
    component: Component,
    durationInFrames,
    width: 1080,
    height: 1920,
    fps: 30,
  };
};

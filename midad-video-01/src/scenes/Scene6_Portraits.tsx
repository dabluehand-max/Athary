import React from "react";
import { useCurrentFrame, interpolate } from "remotion";
import { BaseScene } from "../components/BaseScene";
import { ArabicText } from "../components/ArabicText";
import { VOCaption } from "../components/VOCaption";
import { getScene, TIMELINE } from "../Timeline";

interface Portrait {
  id: string;
  name: string;
  role: string;
  imagePath?: string; // Will be filled from CATALOG
}

/**
 * Scene 6: الفريق (Team Portraits)
 * Duration: 8 seconds (240 frames @ 30fps)
 *
 * Visual: 7-8 portrait cards arranged in collage grid
 * Each portrait enters with stagger effect
 * Names animate in sequentially
 *
 * Portraits from CATALOG.md (rows 14-28, excluding missing 2):
 * - IMG_0090.JPG: Alaa Alsheikh, Studio Resident
 * - IMG_0091.JPG: Ahmad Salam, Director & Writer
 * - IMG_0092.JPG: Abdulhadi Abdulfattah
 * - IMG_0093.JPG: Beny W Baynaha
 * - IMG_0094.JPG: Ruaa Sahhaf, Heritage Fashion Designer
 * - IMG_0099.JPG: Khairia Rifaat, Curator & Writer, Guide
 * - IMG_0100.JPG: Lama Al-Madani, Partner
 * - IMG_0101.JPG: Ahmad Haddad, Founder
 *
 * TODO: Confirm actual names + portraits from user at checkpoint 1
 */

const PLACEHOLDER_PORTRAITS: Portrait[] = [
  { id: "1", name: "الاسم الأول", role: "الدور" },
  { id: "2", name: "الاسم الثاني", role: "الدور" },
  { id: "3", name: "الاسم الثالث", role: "الدور" },
  { id: "4", name: "الاسم الرابع", role: "الدور" },
  { id: "5", name: "الاسم الخامس", role: "الدور" },
  { id: "6", name: "الاسم السادس", role: "الدور" },
  { id: "7", name: "الاسم السابع", role: "الدور" },
  { id: "8", name: "الاسم الثامن", role: "الدور" },
];

export const Scene6_Portraits: React.FC<{ width: number; height: number }> = ({
  width,
  height,
}) => {
  const frame = useCurrentFrame();
  const scene = getScene("scene6");
  const sceneFrame = frame - scene.start;

  // Grid layout: 4 columns × 2 rows
  const cols = 4;
  const rows = 2;
  const portraitWidth = (width * 0.85) / cols; // 85% width, divided into 4 cols
  const portraitHeight = portraitWidth * 1.2; // Slightly taller for headroom

  // Stagger: each portrait enters 30 frames apart (1 second)
  const staggerInterval = 30;

  const getPortraitOpacity = (index: number) => {
    const portraitStart = 30 + index * staggerInterval; // 1s + stagger
    return Math.max(0, Math.min(1, (sceneFrame - portraitStart) / 20)); // 0.67s fade
  };

  const getPortraitScale = (index: number) => {
    const portraitStart = 30 + index * staggerInterval;
    const progress = Math.max(0, Math.min(1, (sceneFrame - portraitStart) / 20));
    return 0.8 + progress * 0.2; // 0.8 → 1.0 scale
  };

  return (
    <BaseScene
      width={width}
      height={height}
      fps={30}
      durationInFrames={scene.duration}
      backgroundColor="#EFE6D6"
    >
      <div style={{ width: "100%", height: "100%", position: "relative" }}>
        {/* Title */}
        <div
          style={{
            position: "absolute",
            top: 40,
            width: "100%",
            textAlign: "center",
            opacity: Math.max(0, Math.min(1, (sceneFrame - 0) / 30)),
          }}
        >
          <ArabicText text="الفريق" fontSize={48} fontFamily="amiri" weight={700} />
        </div>

        {/* Portrait Grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: `repeat(${cols}, 1fr)`,
            gap: 16,
            width: "85%",
            height: "auto",
            margin: "80px auto 0",
            justifyItems: "center",
          }}
        >
          {PLACEHOLDER_PORTRAITS.map((portrait, index) => (
            <div
              key={portrait.id}
              style={{
                width: portraitWidth,
                height: portraitHeight,
                backgroundColor: "#D9D0C0",
                borderRadius: 8,
                border: "2px solid #0B1A3A",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                opacity: getPortraitOpacity(index),
                transform: `scale(${getPortraitScale(index)})`,
                transition: "none",
                position: "relative",
              }}
            >
              {/* Image placeholder (will be replaced with actual portrait) */}
              <div
                style={{
                  width: "100%",
                  height: "70%",
                  backgroundColor: "#C0B5A0",
                  borderRadius: "4px 4px 0 0",
                }}
              />

              {/* Name + Role */}
              <div
                style={{
                  width: "100%",
                  height: "30%",
                  padding: "8px 12px",
                  textAlign: "center",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  borderTop: "1px solid #0B1A3A",
                }}
              >
                <ArabicText
                  text={portrait.name}
                  fontSize={12}
                  fontFamily="ibm-plex"
                  weight={700}
                  color="#0B1A3A"
                />
                <ArabicText
                  text={portrait.role}
                  fontSize={8}
                  fontFamily="ibm-plex"
                  weight={400}
                  color="#0B1A3A"
                  opacity={0.7}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* VO Caption */}
      <VOCaption
        text="الفريق من الفنانين والمدرسين والمرشدين..."
        frameStart={scene.voiceStart || 0}
        frameEnd={scene.voiceEnd || 240}
        position="bottom"
      />

      {/* TODO: Replace placeholder portraits with actual images from assets/residency-portraits */}
      {/* TODO: Fill PLACEHOLDER_PORTRAITS with real names + roles from checkpoint 1 */}
    </BaseScene>
  );
};

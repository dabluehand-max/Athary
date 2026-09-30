import React from "react";

interface ArabicTextProps {
  text: string;
  fontSize: number;
  fontFamily?: "amiri" | "ibm-plex"; // "amiri" serif (classical), "ibm-plex" sans (clean)
  color?: string;
  weight?: 400 | 700;
  align?: "right" | "center" | "left"; // RTL-aware
  lineHeight?: number;
  maxWidth?: number;
  opacity?: number;
  style?: React.CSSProperties;
}

/**
 * ArabicText: Handles Arabic typography with proper RTL shaping
 *
 * Font selection:
 * - Amiri: Serif, classical, header-weight. Dropped Reem Kufi due to ligature bug (قالوا → الله).
 * - IBM Plex Sans Arabic: Clean, body-weight, accessible.
 *
 * Both support Arabic-Indic numerals (١٢٣) and proper shaping.
 */
export const ArabicText: React.FC<ArabicTextProps> = ({
  text,
  fontSize,
  fontFamily = "ibm-plex",
  color = "#0B1A3A", // Deep navy
  weight = 400,
  align = "right",
  lineHeight = 1.4,
  maxWidth,
  opacity = 1,
  style,
}) => {
  const fontFamilyMap = {
    amiri: `"Amiri", serif`,
    "ibm-plex": `"IBM Plex Sans Arabic", sans-serif`,
  };

  return (
    <div
      style={{
        fontFamily: fontFamilyMap[fontFamily],
        fontSize,
        fontWeight: weight,
        color,
        textAlign: align,
        lineHeight,
        maxWidth,
        opacity,
        direction: "rtl", // RTL for Arabic
        unicodeBidi: "embed",
        fontFeatureSettings: `"dlig" 1`, // Standard ligatures
        WebkitFontSmoothing: "antialiased",
        MozOsxFontSmoothing: "grayscale",
        ...style,
      }}
    >
      {text}
    </div>
  );
};

// Preset text styles
export const TextStyles = {
  title: {
    fontSize: 48,
    fontFamily: "amiri" as const,
    weight: 700,
    color: "#0B1A3A",
  },
  body: {
    fontSize: 24,
    fontFamily: "ibm-plex" as const,
    weight: 400,
    color: "#0B1A3A",
  },
  caption: {
    fontSize: 16,
    fontFamily: "ibm-plex" as const,
    weight: 400,
    color: "#0B1A3A",
  },
  cta: {
    fontSize: 28,
    fontFamily: "ibm-plex" as const,
    weight: 700,
    color: "#FFFFFF",
  },
};

import { loadFont } from "@remotion/fonts";
import { staticFile } from "remotion";
export const FONT_KUFI = "Reem Kufi";
export const FONT_NASKH = "Amiri";
export const FONT_TYPE = "IBM Plex Sans Arabic";
export const fontsReady = Promise.all([
  loadFont({ family: FONT_KUFI, url: staticFile("fonts/reem-kufi-arabic-700-normal.woff2"), weight: "700" }),
  loadFont({ family: FONT_NASKH, url: staticFile("fonts/amiri-arabic-400-normal.woff2"), weight: "400" }),
  loadFont({ family: FONT_NASKH, url: staticFile("fonts/amiri-arabic-700-normal.woff2"), weight: "700" }),
  loadFont({ family: FONT_TYPE, url: staticFile("fonts/ibm-plex-sans-arabic-arabic-500-normal.woff2"), weight: "500" }),
]);

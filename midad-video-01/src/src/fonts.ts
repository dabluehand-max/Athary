import { loadFont } from "@remotion/fonts";
import { staticFile } from "remotion";

export const FONT_NASKH = "Amiri";
export const FONT_TYPE = "Noto Naskh Arabic";
export const FONT_CUT = "Rakkas";
export const FONT_BLOCK = "Lalezar";

export const fontsReady = Promise.all([
  loadFont({ family: FONT_NASKH, url: staticFile("fonts/amiri-arabic-400-normal.woff2"), weight: "400" }),
  loadFont({ family: FONT_NASKH, url: staticFile("fonts/amiri-arabic-700-normal.woff2"), weight: "700" }),
  loadFont({ family: FONT_TYPE, url: staticFile("fonts/noto-naskh-arabic-arabic-600-normal.woff2"), weight: "600" }),
  loadFont({ family: FONT_CUT, url: staticFile("fonts/rakkas-arabic-400-normal.woff2"), weight: "400" }),
  loadFont({ family: FONT_BLOCK, url: staticFile("fonts/lalezar-arabic-400-normal.woff2"), weight: "400" }),
]);

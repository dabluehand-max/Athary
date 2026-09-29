import React from "react";
import { AbsoluteFill } from "remotion";
import { FONT_KUFI, FONT_NASKH, FONT_TYPE } from "./fonts";
export const ArabicTest: React.FC = () => (
  <AbsoluteFill style={{ background: "#EFE6D6", direction: "rtl", alignItems: "center", justifyContent: "center", gap: 40, color: "#0B1A3A" }}>
    <div style={{ fontFamily: FONT_KUFI, fontSize: 110 }}>قالوا له: باقي لك ٣ سنين.</div>
    <div style={{ fontFamily: FONT_KUFI, fontSize: 110, fontFeatureSettings: '"liga" 0, "dlig" 0, "clig" 0' }}>قالوا له: باقي لك ٣ سنين.</div>
    <div style={{ fontFamily: FONT_NASKH, fontWeight: 700, fontSize: 110 }}>قالوا له: باقي لك ٣ سنين.</div>
    <div style={{ fontFamily: FONT_NASKH, fontSize: 220, fontWeight: 700 }}>مِداد</div>
    <div style={{ fontFamily: FONT_TYPE, fontSize: 56 }}>المسار الكامل ٦٬٨٥٠ ريال بدل ٧٬٥٠٠ — حتى ٥ أكتوبر</div>
    <div style={{ fontFamily: FONT_TYPE, fontSize: 48 }}>لاما المدني · حذيفة حجازي · خيرية رفعت</div>
  </AbsoluteFill>
);

/**
 * Midad Video Timeline (55-60 seconds, 9:16 vertical, 30fps)
 *
 * Total Duration: 1800 frames @ 30fps = 60 seconds
 * Scene breakdown: 8 scenes + intro/outro
 */

export interface Scene {
  name: string;
  start: number; // frame
  duration: number; // frames
  durationMs: number; // frames / 30
  description: string;
  voiceStart?: number;
  voiceEnd?: number;
}

export const TIMELINE: Record<string, Scene> = {
  // Intro: 0-150 (5 sec)
  intro: {
    name: "Intro: مِداد Logo + Midan Wordmark",
    start: 0,
    duration: 150,
    durationMs: 5000,
    description: "Fade in cream background, Midad logo enters via cut-out, wordmark appears",
    voiceStart: 30,
  },

  // Scene 1: 150-330 (6 sec) - Concept
  scene1: {
    name: "Scene 1: مفهوم البرنامج (Program Concept)",
    start: 150,
    duration: 180,
    durationMs: 6000,
    description: "Typography + collage metaphor: cut figures, sketches, textile pieces layer in",
    voiceStart: 150,
    voiceEnd: 330,
  },

  // Scene 2: 330-510 (6 sec) - Process
  scene2: {
    name: "Scene 2: الخط والرسم (Drawing & Line Work)",
    start: 330,
    duration: 180,
    durationMs: 6000,
    description: "Workshop footage: hand inking (1cafbd0f…), figure on paper, continuous line",
    voiceStart: 330,
    voiceEnd: 510,
  },

  // Scene 3: 510-720 (7 sec) - Body Awareness
  scene3: {
    name: "Scene 3: تلاحظ جسمك (Body Awareness)",
    start: 510,
    duration: 210,
    durationMs: 7000,
    description: "Group exercise moment (33d929bb…), facilitator hands, participant backbend silhouette cut-out",
    voiceStart: 510,
    voiceEnd: 720,
  },

  // Scene 4: 720-900 (6 sec) - Map Your Body
  scene4: {
    name: "Scene 4: خريطة الجسم (Body Map)",
    start: 720,
    duration: 180,
    durationMs: 6000,
    description: "Blue body canvas (d5189b1a…), ink smear moment (cc00a9b5…), visceral texture",
    voiceStart: 720,
    voiceEnd: 900,
  },

  // Scene 5: 900-1080 (6 sec) - Materials & Craft
  scene5: {
    name: "Scene 5: مواد وأدوات (Materials)",
    start: 900,
    duration: 180,
    durationMs: 6000,
    description: "Sewing machine, fabrics, paints table (e1fd39f0…), scissors cutting paper (12b1456e…)",
    voiceStart: 900,
    voiceEnd: 1080,
  },

  // Scene 6: 1080-1320 (8 sec) - Portraits
  scene6: {
    name: "Scene 6: الفريق (Team Portraits)",
    start: 1080,
    duration: 240,
    durationMs: 8000,
    description: "7-8 portrait cards, names enter one by one, arranged as collage grid",
    voiceStart: 1080,
    voiceEnd: 1320,
  },

  // Scene 7: 1320-1530 (7 sec) - Artworks
  scene7: {
    name: "Scene 7: الأعمال (Artworks Gallery)",
    start: 1320,
    duration: 210,
    durationMs: 7000,
    description: "Collage pieces (a29fe3de…, 4d542ce4…), photomontage (fdc5b74a…), flowing transitions",
    voiceStart: 1320,
    voiceEnd: 1530,
  },

  // Scene 8: 1530-1680 (5 sec) - CTA
  scene8: {
    name: "Scene 8: الدعوة للتسجيل (Registration CTA)",
    start: 1530,
    duration: 150,
    durationMs: 5000,
    description: "Date + link + Haddad Studio + Lam Al-Qamariya + Bayt Al-Thaqafa logos",
    voiceStart: 1530,
    voiceEnd: 1680,
  },

  // Outro: 1680-1800 (4 sec)
  outro: {
    name: "Outro: Fade to cream",
    start: 1680,
    duration: 120,
    durationMs: 4000,
    description: "Fade to cream background, final logo holds",
  },
};

// Helper: Get scene by name
export const getScene = (name: keyof typeof TIMELINE): Scene => TIMELINE[name];

// Helper: Total duration
export const TOTAL_DURATION = 1800; // frames @ 30fps = 60 seconds
export const TOTAL_MS = TOTAL_DURATION / 30 * 1000; // 60000 ms

// Voice timing array for VO sync
export const VOICE_SEGMENTS = Object.values(TIMELINE)
  .filter((s) => s.voiceStart !== undefined)
  .map((s) => ({
    sceneKey: Object.keys(TIMELINE).find((k) => TIMELINE[k as keyof typeof TIMELINE] === s),
    frameStart: s.voiceStart!,
    frameEnd: s.voiceEnd!,
    durationFrames: (s.voiceEnd! - s.voiceStart!),
  }));

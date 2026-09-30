# Handoff prompt: Midad video, Lama / Frida Kahlo version

Paste everything below the line into a Claude Code session running on Ahmad's laptop (Claude desktop app → Code, or `claude` in a terminal). That session has normal network access, which the cloud session did not.

---

You are continuing a video project for Ahmad Haddad (Haddad Studio, Riyadh). Talk to him in casual Gulf Arabic/English. He has ADHD: short steps, no long recaps. Any Arabic text for third parties is clean formal Arabic; the voiceover itself is white Saudi dialect.

## The project
- Promo reels for «مِداد», a developmental art programme by Haddad Studio and Lam Al-Qamariya, in partnership with Bayt Al-Thaqafa, Riyadh. It starts 10 October 2026. The early-bird price ends 5 October, so it must be published by 3 October.
- Code: GitHub repo `dabluehand-max/athary`, branch `midad-video-01`, folder `midad-video-01/`. It's a Remotion project in `midad-video-01/src` (`npm install` there). Render with `npx remotion render src/index.ts <CompositionId> ../out/<name>.mp4`.
- Compositions: `AhmadStory` (done; Ahmad's own voice, 73.5 s) and `Midad01` (the older Matisse draft). Build the new one next to them.
- Photos and derived images are gitignored. Recreate them:
  - Original assets: Google Drive folder `1EIf4T95UjJi40rGFgdcpfZR6vyvAdxPq` (and its «بوستات» subfolder) → `assets/provided/`.
  - Then run `python3 tools/cutout.py` (portraits, prints), `tools/textures.py`, and copy `assets/processed/*` into `src/public/img/`. See `assets/CATALOG.md` for which file is what.
  - Mentor portraits map by the names printed on the studio's own cards (IMG_0091 أحمد سلام, 0094 رؤى صحاف, 0099 خيرية رفعت, 0100 لاما المدني, 0126 أحمد حدّاد, 0130 حذيفة حجازي, 0133 سامية المهدلي). Hafsa's photo is `HAFSA_DSC5481-2500px.jpg` in Drive. Noura Shuqair's photo is only in the Midad site admin (Lovable project `1c445dc4-d01f-400d-a6b4-0fb9513fc31c`, `people` table, private `media` bucket); get it from Ahmad or the admin. Do **not** show Maria Mian.

## New recordings to use
Drive folder `1lF556ZSNscVEq2bxqXpuLsxjpB88HrBh`:
- `IMG_7810.MOV` (192 MB) and `IMG_7808.MOV` (150 MB): long takes, Lama speaking. Her full audio can be the voiceover.
- A take about **Frida Kahlo** (find which file; transcribe them all first).
- `IMG_7809`–`IMG_7829`: short clips. Use any piece, audio or video.
- `13736 3.m4a`: Ahmad's story, used by the `AhmadStory` video. The edited file is not in git. Rebuild it into `src/public/audio/vo.mp3`:
  ```
  ffmpeg -i "13736 3.m4a" -filter_complex "
  [0:a]atrim=0.45:10.45,asetpts=PTS-STARTPTS,afade=t=out:st=9.9:d=0.1[a];
  [0:a]atrim=15.30:57.55,asetpts=PTS-STARTPTS,afade=t=in:d=0.08,afade=t=out:st=42.15:d=0.1[b];
  [0:a]atrim=59.70:68.60,asetpts=PTS-STARTPTS,afade=t=in:d=0.08,afade=t=out:st=8.8:d=0.1[c];
  anullsrc=r=48000:cl=mono,atrim=0:2.5[p];
  [0:a]atrim=68.75:76.95,asetpts=PTS-STARTPTS,afade=t=in:d=0.08,afade=t=out:st=8.0:d=0.2[d];
  anullsrc=r=48000:cl=mono,atrim=0:1.6[e];
  [a][b][c][p][d][e]concat=n=6:v=0:a=1,highpass=f=80,afftdn=nf=-30,loudnorm=I=-16:TP=-1.5:LRA=9[out]" -map "[out]" -ar 48000 -ac 1 -b:a 192k src/public/audio/vo.mp3
  ```
  This drops the first take of «لو ما رسمت زيي…» (10.45–15.30 s) and the slip «تسعطعشر وردة» (57.55–59.70 s, verified by transcription), and adds a 2.5 s pause after «تدريب خارجي» so viewers can read the workshop map. Result: 73.5 s. Every beat time in `AhmadStory.tsx` is set against this file.
  Also cut these for `AhmadStory`: `IMG_9332.PNG` (crop 600,255,2130,1792, `--mode rect --color`) → `prints/ahmad_red_artwork.png`; `IMG_6414.JPG` → `prints/ahmad_teaching.png`; `86a68668-….jpg` → `prints/ahmad_drawing.png` (both `--mode rect`); `IMG_0101.JPG` (crop 0,120,1080,1030) → `portraits/ahmad_full.png`.
- `IMG_9634.PNG`, `IMG_9698.PNG` (12 MB each): not yet seen; probably artworks.

Steps:
1. Download everything, transcribe it (ElevenLabs Scribe or Whisper), and write a transcript with timestamps per file.
2. Pick the best takes. Cut stumbles, repeats and slips (Ahmad's take had «تسعطعشر وردة»; listen for the same kind of thing). Tell Ahmad exactly what you cut.
3. Build the Lama version around her voice. Keep the same structure as `AhmadStory`: hook → story (Frida) → why مِداد → 19 workshops / 5 chapters → inner vs outer training with the real workshop names → mentors wall → 10 October → limited seats, early-bird and student discount → سجّل الآن + three logos.

## Ahmad's notes (all must hold)
- Mood **B «ورق ملوّن»**: site palette, cream `#F6F1E5`, green `#006549`, deep green `#004B35`, orange `#F74F00`, pink `#E3BEE1`, acid `#CEE224`, sky `#B7DAED`. B&W photo cut-outs on coloured paper, few elements, calm, artistic. Stills: `MoodPaper` in `src/src/moods.tsx`.
- No captions. Moving text (`Say` in `AhmadStory.tsx`) carries the key words.
- Very little shake: jitter is already scaled down in `src/src/lib/motion.ts`. Don't raise it.
- The story must say who it is about and **show** it: the artist's photo, birth and death years, and a few famous works. Explanatory, detailed collage, never just «تدريب داخلي/خارجي» without the workshop names.
- Never use the word «وجع».
- Use real images: Ahmad's artworks and photos, the artists' works, historical photos. Use YouTube, Vimeo and Pinterest for **references only** (look, timing, edges); never put their footage in the video.
- Music: Ahmad picks it later. Deliver a version without music. Four ElevenLabs options are in `out/music/`.

## Rights, before you use any Frida Kahlo image
- Frida Kahlo died in 1954. Her paintings are public domain in Saudi Arabia (50 years after death) and the EU (70 years). **Mexico protects them for 100 years (until 2054)**, and her name and image are commercially managed. For a paid promo on Instagram, prefer:
  - public-domain photographs of her (e.g. those by her father Guillermo Kahlo, who died in 1941), from Wikimedia Commons or the Library of Congress;
  - short, clearly credited views of works, as commentary.
- Log every sourced file in `LICENSES.md` (URL + licence), and tell Ahmad the risk in one line.
- The Matisse version has the same issue for the US (late cut-outs are still under copyright there).

## Facts to keep straight
- 19 workshops in 5 chapters. First: 10 Oct «الحياة كاستديو». Last: 24 Dec «كيف تُلاحَظ في المشهد الفني». The exhibition date (26 Dec) is from the first brief, not on the site. The full list is in the `workshops` table and in `AhmadStory.tsx` (`INNER`, `OUTER`).
- Prices are waiting on Hudhaifa and Sahar. Show no amounts until Ahmad confirms. Current site values: guided track 7,500 SAR; early bird 6,850 until 5 Oct (brief only); student 6,000, 10 seats (brief only).
- Three new workshops, prices to come: الأناتومي وتحريك الرأس، الكولاج والكولاج الرقمي، نظرية الألوان. Ahmad wants them sold separately, as a bundle of the three, and as a bundle with the developmental programme at a discount.
- Ahmad says «+١٢٠٠ ساعة تدريب» in his recording; his portfolio slide says 2,200. Ask which to show.
- Ahmad wants the site admin to let him edit prices, discounts, dates, and add or remove workshops. Check what `src/components/admin/*` in the Lovable project already covers before building anything. Changes there use Lovable credits: ask first.

## Before showing Ahmad anything
- Render, pull a frame every 0.5 s, and look at them. Check: Arabic shaping (watch mixed English inside Arabic words, and IBM Plex drawing «تى» like «ق»), names, numbers and dates exact, nothing in the bottom 20%, sync with the voice.
- Deliver 9:16 1080×1920 with and without music, a 4:5 reframe, and tell him what's left.

# REVIEW: مِداد video 01, draft 1 (no voice yet)

## What was checked
Rendered the full 60 s draft, pulled frames at 1/s across every scene, and checked at full resolution where text was small.

| Check | Result |
|---|---|
| Arabic joined correctly, not reversed, nothing cut off | Pass after fixes (below) |
| Names spelled as in the brief | Pass: لاما المدني · سامية المهدلي · حذيفة حجازي · حفصة الخضيري · أحمد سلام · رؤى صحاف · نورة شقير · ماريا ميان · خيرية رفعت |
| Numbers, prices and dates exactly as written | Pass, Arabic-Indic digits throughout |
| Text clear of the bottom 20% and right edge | Pass: captions sit at y≈1460 of 1920, left of centre |
| Scissor snip on frame 1 | Pass: first snip placed at t=0 in the foley track |
| Handmade feel (edges, shadows, 12 fps jitter) | Pass: scissor-cut borders, torn prints, tape, settling shadows |
| First 3 s stop the scroll | Newspaper + scissors + big hook line from frame 0, ink circle on «٣ سنين» |
| Voice and visuals in sync | **Not testable yet: no voice** |

## Fixed during review
- «١٩ ورشة» showed as «٩١»: digits were split into separate right-to-left chips. Numbers now stay on one chip.
- «حتى» read as «حق» in IBM Plex Sans Arabic (how that font draws the pair, not a ligature). All typed text moved to Noto Naskh Arabic.
- CTA ransom letters grouped in pairs: single-letter chips made «أعمالك تشبهك» hard to read on a phone.
- Typed strips were wrapping into narrow columns (CSS shrink-to-fit); fixed with `max-content`.
- Price stickers broke with an orphaned «أكتوبر»; now two deliberate lines, wording unchanged (dash kept at the end of line one).
- The مِداد scene opened on 1.5 s of empty paper; the ink stain now spreads from the first frame.
- Matisse-style shapes filled only the top half of the wall; now 42 shapes across the whole wall.
- Inner/outer split items were too small with empty space below; enlarged and re-spaced.

## Open risks
1. **No voice.** `api.elevenlabs.io` is blocked by the environment's network policy. Caption timing is an even spread per scene; it switches to real word timing automatically once `src/src/data/vo_words.json` is filled from the ElevenLabs timestamps.
2. **No music.** No CC0 source reachable. Foley is synthesized (original, no licence issue) and should be swapped for real recordings when possible.
3. **No reference videos or public-domain images** (YouTube, Wikimedia, museums blocked). All textures, the newspaper, scissors and colour shapes are original and generated.
4. **Noura Shuqair** has no photo: hers is only in the site's private storage. She has a typed name card, as the brief allows. Her profile (and Maria Mian's) is set to *unpublished* on the Midad site; please confirm both are fine to show publicly.
5. **Portrait identity** follows the names printed on the studio's own cards, plus Hafsa's photo, which she shared on Drive (`HAFSA_DSC5481-2500px.jpg`). Ruaa confirmed by Ahmad.
6. The Bayt Al-Thaqafa logo is used as supplied, including the Altaawun Public Library lockup. The source is a low-resolution screenshot (≈900 px wide): fine on a tab, soft if shown large.

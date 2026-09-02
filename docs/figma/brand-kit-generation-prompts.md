# Field Guide brand-kit — Imagen picture prompts

Paste-ready **image-model** briefs for a plant brand kit. Each asset is a **PNG picture** (thick-ink sticker illustration on paper), in the same spirit as the Gargar icon generations — not SVG path dumps, not Codex-in-code, not the Youth CLAP landing, not Pokémon.

Save each picture onto the live kit path with the **same filename, `.png` instead of `.svg`**: `web-forest/src/asset/…`.

No Gargar *prompt sheet* lives under `~/Codex/gargar` or `~/Warp/gargar-icons` (that folder is arranged PNGs only). Craft below is read off the live Gargar pictures in `~/Codex/gargar/src/asset/`. The paste shape follows the house A/B/C image-prompt pattern (shared style + framing, then one subject).

---

## 1. How to paste (five lines)

1. Open **Gemini** (gemini.google.com → create image) or **Google AI Studio** / **Vertex** with the current Google raster model.
2. Paste **§2 once** at the top of the session. Do not re-explain the brand each time.
3. Paste **one §3 block**. Generate **one square PNG**. Save it to the filename in that block.
4. Approve three pilots before the rest: `mark/plant.png`, `icon/journal.png`, `species/narra.png`.
5. Repeat step 3 for the next asset. Never ask the model for a zip or a whole set in one go.

**Model id (looked up 2026-08-27).** Imagen 4 publisher slugs (`imagen-4.0-generate-001`, `imagen-4.0-fast-generate-001`, `imagen-4.0-ultra-generate-001`) were discontinued mid-2026 and often 404. The current public Google **picture** generator is **`gemini-3.1-flash-image`** (Nano Banana 2). Higher-finish if you have it: **`gemini-3-pro-image`**. In the Gemini app, pick the image / Nano Banana control — that is the Imagen-kind tool (photoreal-capable raster). We still force a **sticker illustration**, not a photo. Do not invent a newer `imagen-*` slug.

**Output every time:** 1024×1024, 1:1, solid paper `#FBFAF1` (or `#F9F9F9`). No mockup, no phone, no Figma frame, no text, no watermark.

---

## 2. Master system prompt

Paste this once. It is the style (A) + framing (B). Every later block is only the subject (C).

```
Paint one Ateneo Field Guide sticker picture — ink-outline, flat-fill, paper-notebook craft — for a student PWA about noticing trees on the Ateneo de Manila Loyola Heights campus.

THIS IS A PICTURE, NOT A VECTOR FILE
- Square PNG, 1024×1024, 1:1.
- Solid cream paper background #FBFAF1. Never black, never transparent checker, never a photographed desk.
- No mockup, no phone, no browser chrome, no Figma frame, no drop shadow under the canvas.
- No text, no letters, no numbers, no watermark, no signature.
- One subject, optically centered, 10–12% padding. One file. Stop.

BRAND, ONE SENTENCE
A paper field notebook with a thick ink pen and three leaf greens — campus trees as friendly stickers, not a nature documentary and not a startup icon pack.

PRODUCT
Walking the campus and logging a sighting is “catching.” There is no XP, no CP, no leaderboard, no gym, no raid, no Pokémon creature, no prize orb. The reward is a private journal filling in. Restricted groves stay off-limits.

LOCKED PALETTE (hex only)
- paper canvas: #FBFAF1 · paper fill inside objects: #F9F9F9
- ink outlines: #1F2022 (every major shape)
- leaf: #3F8A1F body · #45C223 lit/young · #008653 deep/shade
- sack-blue: #57A8E8 glass / Lagundi flower · #058CD6 PWA blue
- mustard: #E1A036 seed/fruit · #F6B22D flower
- red #FF3920 on the restricted slash only
- vivid lime #00E800 on the player disc only

PICTURE CRAFT (copy Gargar icons, not Gargar subjects)
Look at how Gargar’s PNGs are built: a closed sticker, heavy dark outline, round caps and joins, chunky enough to read at 24 px. Nested pin is teardrop → paper well → tiny subject. Check is a fat ink tick with a green stroke on top. Spots sit on a soft green grounding ellipse. Two to four fills plus ink. Volume from stacked greens, not airbrush.

FILL
Flat color, one fill per shape. No mesh, no clay, no photographic bark, no plastic sticker sheen. Mustard is a fruit, flower, seed, or one spark — never a wash. Sack-blue is lens glass or Lagundi flowers only.

ANGLE
UI glyphs: straight-on (slight 3/4 only if a lid is needed). Species: elevation portrait, trunk from the bottom third, canopy in the top two-thirds. No horizon, no sky, no campus buildings on a species plate.

REJECT FROM GARGAR
Trash, scrap, PET bottles, sachets, haul-sacks, junk-shop trucks, weigh scales, payout coins, collector characters, the jumping-collector hero, the “gg” sack mark, black square tiles (Gargar sat on black; this kit is paper-safe).

REJECT FROM EVERYWHERE
Phosphor / Lucide / Material hairlines. 3D C4D plants. Photoreal botany. Pokémon, pokéballs, XP, rank, coins. Isometric city. The four-person Youth CLAP logo (program chrome, not this kit). Any wordmark or scientific name in the art.

SPECIES DISCIPLINE
One plant per plate, identifiable without a caption. Habit first, then one diagnostic (flower / fruit / leaf / roots). Lagundi is a multi-stem shrub with blue spikes. Molave is a threatened hardwood TREE. Same genus, never the same picture.
```

---

## 3. Per-asset picture briefs

Copy-paste **one** block after §2. Each block is a picture, not a path list.

### 3.1 UI glyphs + plant mark

#### `icon/home.png`

```
PICTURE: icon/home.png — a small house sticker, straight-on, on paper #FBFAF1.

COMPOSE: Friendly cottage mass, optically centered, chunky enough for a 24 px tab. Paper walls, green roof, deep-green door under the peak (a door, not a garage). One tiny two-leaf sprout at the top-right eave — the “we notice plants” tell. Do not grow a second tree.

COLOR: walls #F9F9F9 · roof #3F8A1F · door #008653 · sprout #45C223 · ink #1F2022.

COPY: Gargar sticker weight — thick ink, round joins, flat fills.

REJECT: window grid, chimney, people, mailbox, Phosphor house, 3D cottage, black tile.
```

#### `icon/map.png`

```
PICTURE: icon/map.png — a map-pin sticker, point down, on paper #FBFAF1.

COMPOSE: Classic teardrop, rounded point (not a needle). Nested well: teardrop → paper circle in the bulb → tiny two-leaf plant inside. Same plant language as mark/plant, scaled down.

COLOR: pin #45C223 · well #F9F9F9 · plant #3F8A1F · ink #1F2022.

COPY: Gargar’s nested pin construction (teardrop / well / subject).

REJECT: folded paper map, GPS arrow, PET bottles or haul-sack in the well (that is Gargar’s old pin.png), compass, street grid.
```

#### `icon/journal.png`

```
PICTURE: icon/journal.png — a closed field notebook, portrait sticker, on paper #FBFAF1.

COMPOSE: Bound journal, not a clipboard. Deep-green spine on the LEFT. Three short ruled ink lines on the cream page, not edge-to-edge. One young sprout peeking off the top-right corner.

COLOR: body #F9F9F9 · spine #008653 · sprout #45C223 · ink #1F2022.

COPY: Gargar sticker outline; quiet object, no scene.

REJECT: open spread, fountain pen, Pokédex clamshell, legal pad, spiral coil, letters on the page.
```

#### `icon/plan.png`

```
PICTURE: icon/plan.png — one sheet of paper with a dog-ear, on paper #FBFAF1.

COMPOSE: Single document, folded top-right corner. A green check on the upper third (“this is a plan”). One short ink rule under the check. Optional tiny leaf at the dog-ear.

COLOR: sheet #F9F9F9 · check #008653 · leaf #3F8A1F · ink #1F2022.

COPY: Same chunky ink as the journal; check is a stroke, not a badge.

REJECT: kanban, Gantt, clipboard, calendar grid, strategy pyramid, people.
```

#### `icon/pin.png`

```
PICTURE: icon/pin.png — the map pin again, slightly larger well, on paper #FBFAF1.

COMPOSE: Nested pin only: teardrop → paper well → two-leaf plant. Same family as icon/map.png.

COLOR: pin #45C223 · well #F9F9F9 · plant #3F8A1F · ink #1F2022.

COPY: Gargar pin *craft* (nested well).

REJECT: Gargar pin *subject* — no blue haul-sack, no PET bottles in the well. No red Google pin, pushpin, flag, or crosshair.
```

#### `icon/camera.png`

```
PICTURE: icon/camera.png — a compact field camera sticker, on paper #FBFAF1.

COMPOSE: One rounded body, slight 3/4 only if it still reads as a single brick. Green viewfinder hump on top. Big circular lens (glass, not an eye). One mustard shutter-bead at the top-right.

COLOR: body #F9F9F9 · viewfinder #008653 · lens #57A8E8 · inner glass #F9F9F9 · bead #E1A036 · ink #1F2022.

COPY: Gargar object-as-sticker; limited palette.

REJECT: DSLR kit, phone frame, AR reticle, face, lightning-bolt flash as the hero.
```

#### `icon/encounter.png`

```
PICTURE: icon/encounter.png — a map encounter disc, on paper #FBFAF1.

COMPOSE: A filled circle with a white ring (reads on a satellite map). Inside: the tiny two-leaf plant + mustard seed. A disc with a plant — not a creature, not a face, not a split ball.

COLOR: disc #008653 · ring white · leaves #45C223 · seed #E1A036 · ink #1F2022.

COPY: Plant language from mark/plant, scaled into a circle.

REJECT: pokéball, radar pulse, XP star, exclamation, animal, rank badge, coins.
```

#### `icon/player.png`

```
PICTURE: icon/player.png — you-are-here disc, on paper #FBFAF1.

COMPOSE: Lime circle, thick white ring, faint ink ring so it still reads on pale paper. Inside: the same two-leaf plant. A position mark, not an avatar.

COLOR: disc #00E800 (the only place this lime is allowed) · plant #3F8A1F · ink #1F2022.

COPY: Same plant-in-a-disc idea as encounter, different fill.

REJECT: blue Google-dot, pedestrian, bearing chevron, character sprite.
```

#### `icon/restricted.png`

```
PICTURE: icon/restricted.png — a restricted-grove sticker, on paper #FBFAF1.

COMPOSE: Rounded square, paper fill, light hatch (a few ink lines — “observed from the path”). Small plant in the middle so the hatch is about a grove. One diagonal red slash, corner to corner, round cap. The slash is the only red in the kit.

COLOR: fill #F9F9F9 · plant #3F8A1F · slash #FF3920 · ink #1F2022.

COPY: Paper-safe; no black prohibition tile.

REJECT: skull, lock, barbed wire, stop-hand, cone, trash.
```

#### `icon/canopy.png`

```
PICTURE: icon/canopy.png — canopy sitting on two campus blocks, on paper #FBFAF1.

COMPOSE: Two small rounded buildings at the bottom (mustard blocks, one paper window each). One connected green canopy lobe over them — shade on buildings, not a separate tree sticker. A brighter green edge along the top of the canopy.

COLOR: blocks #E1A036 and #F6B22D · canopy #3F8A1F · lit edge #45C223 · ink #1F2022.

COPY: Flat stacked fills, not an isometric toy city.

REJECT: skyline clipart, sun, isometric city, full forest, heat-map colors.
```

#### `icon/check.png`

```
PICTURE: icon/check.png — a double-stroke tick on paper #FBFAF1.

COMPOSE: One rounded check mark, drawn twice: fat ink underneath, bright green on top. No circle, no box, no badge.

COLOR: under-stroke #1F2022 · over-stroke #45C223 · background #FBFAF1.

COPY: Gargar icon/check.png craft (chunky rounded tick, double stroke).

REJECT: Gargar check’s black rounded-square tile. White Material “done.” Seal badge.
```

#### `icon/close.png`

```
PICTURE: icon/close.png — a quiet X, on paper #FBFAF1.

COMPOSE: Two thick ink strokes, round caps, crossing. No circle, no box, no fill. Quiet chrome.

COLOR: ink #1F2022 only.

COPY: Same stroke weight as the rest of the kit.

REJECT: filled X badge, grey Material close, hamburger.
```

#### `mark/plant.png`

```
PICTURE: mark/plant.png — the Field Guide symbol: two asymmetric leaves on one stem, plus a mustard seed. Paper #FBFAF1.

COMPOSE: Stem from the bottom, ink only — no pot, no soil. Left leaf is a comma-shaped lobe up-left (#3F8A1F). Right leaf is a longer lobe up-right (#45C223). The two leaves MUST be different shapes. Short vein suggestions, not a midrib diagram. Mustard seed at the fork. Must still read at 16 px as “a plant,” not a blob.

COLOR: left #3F8A1F · right #45C223 · seed #E1A036 · ink #1F2022.

COPY: Gargar sticker silhouette — thick ink, friendly, centered.

REJECT: four-person Youth CLAP logo, Gargar sack mark, tree-in-circle app icon, laurel, seedling-in-a-pot, heart-leaf.
```

---

### 3.2 Species plates

One plant, elevation portrait, paper `#FBFAF1`. No labels. Identifiable by habit + one diagnostic.

#### `species/narra.png`

```
PICTURE: species/narra.png — Narra (Pterocarpus indicus), the campus shade tree with yellow flowers.

COMPOSE: Spreading mid-canopy tree, not a column. Trunk from the bottom third, slightly forked. Three stacked pairs of wide, slightly drooping canopy lobes (shade tree, not a pine). Diagnostic: a cluster of three round yellow pea-flowers at the top; the top flower has a paper-dot center. Flowers, not fruits, not stars.

COLOR: lobes alternating #3F8A1F / #008653 / #45C223 · flowers #F6B22D and #E1A036 · ink #1F2022.

COPY: Stacked greens for volume, Gargar outline weight.

REJECT: mahogany’s mustard leaflets, rain-tree umbrella, photoreal bark, flag of the Philippines.
```

#### `species/molave.png`

```
PICTURE: species/molave.png — Molave (Vitex parviflora), a threatened hardwood TREE.

COMPOSE: Tougher and slower than Narra. One thick trunk, two short Y-branches under a dense opposite crown. Small upright tuft at the top (palmate hint). Two tiny mustard specks in the crown — not Narra’s big pea-flowers.

CRITICAL: not Lagundi. One bole. Canopy-tree height. No multi-stem shrub. No blue flowers.

COLOR: crown #008653 and #3F8A1F · tuft #45C223 · specks #F6B22D · ink #1F2022.

REJECT: the Lagundi shrub silhouette, Narra flower cluster, pharmacy clipart.
```

#### `species/katmon.png`

```
PICTURE: species/katmon.png — Katmon (Dillenia philippinensis), endemic understory.

COMPOSE: Shorter than Narra/Dao, slightly off-center. One leaning trunk. Two huge simple leaves (the habit) with one ink midrib each — not pinnate. Diagnostic on the right: a showy sepal-flower / sour fruit, mustard center, paper/ink petal tips. That flower is the eye-catcher.

COLOR: leaves #45C223 and #3F8A1F · flower disc #008653 · center #F6B22D · ink #1F2022.

REJECT: generic three-lobe tree, mango, hibiscus photo.
```

#### `species/mahogany.png`

```
PICTURE: species/mahogany.png — Mahogany (Swietenia macrophylla), exotic fast shade.

COMPOSE: Tall, regular plantation tree. Straight center trunk. Three stacked pairs of pinnate-looking leaflets in mustard — “exotic” must read before anyone reads a caption. A small green seed-capsule / shoot at the apex (the only green besides trunk ink). Honesty, not villainy: no skull, no red X.

COLOR: leaflets #E1A036 and #F6B22D · apex #008653 / #3F8A1F · ink #1F2022.

REJECT: Narra’s yellow flowers pasted onto mustard leaves. Chilean pine. Frowning face.
```

#### `species/lagundi.png`

```
PICTURE: species/lagundi.png — Lagundi (Vitex negundo), a medicinal SHRUB. Not Molave.

COMPOSE: Two or three thin stems from the bottom — not one bole. Four or five palmate leaflet ellipses at mid-height, radiating, not stacked as a tree crown. Diagnostic: sack-blue flower spikes / dots at the top of one stem. The whole plant is shorter and wider than Molave. If you can swap this file with molave.png and nobody notices, you failed.

COLOR: leaflets #45C223 / #3F8A1F / #008653 · flowers #57A8E8 / #058CD6 · ink #1F2022.

REJECT: single trunk, forest tree, yellow Narra flowers, Molave mustard specks, mortar-and-pestle.
```

#### `species/dao.png`

```
PICTURE: species/dao.png — Dao (Dracontomelon dao), a big native canopy.

COMPOSE: Thick trunk, two structural branches, one wide heavy dome (not Narra’s three stacked pairs). Brighter green highlight along the top edge. Diagnostic: three hanging round mustard fruits on the crown — fruit, not flowers.

COLOR: crown #008653 · highlight #45C223 · fruits #F6B22D / #E1A036 · ink #1F2022.

REJECT: rain-tree pancake, Narra flower cluster, teak’s giant leaves.
```

#### `species/raintree.png`

```
PICTURE: species/raintree.png — Rain tree (Samanea saman), exotic wide shade.

COMPOSE: The widest canopy in the kit. Short bole — low and broad, the quad tree. Umbrella lobe almost wall-to-wall. Deep-green edge to show the “rain” spread. Two short arms under the umbrella. Three small mustard beads sitting on the canopy (puff-flower hint), not Narra’s large pea-flowers.

COLOR: umbrella #45C223 · edge #008653 · beads #E1A036 · ink #1F2022.

REJECT: tall forest emergent, acacia thorns, photoreal bipinnate lace.
```

#### `species/teak.png`

```
PICTURE: species/teak.png — Teak (Tectona grandis), exotic timber.

COMPOSE: Tall and leafy, not a dome. Straight trunk almost to the top. Two huge simple opposite leaves left and right of mid-trunk — oversized, papery, one ink midrib each. Small upright tuft at the top. No fruit cluster. The leaves are the species.

COLOR: leaves #3F8A1F and #45C223 · tuft #008653 · ink #1F2022.

REJECT: plantation rows, furniture, Narra flowers.
```

#### `species/balete.png`

```
PICTURE: species/balete.png — Balete (Ficus), strangler fig, a landmark.

COMPOSE: Several trunks: three vertical stems plus two thinner aerial roots. One broad, slightly irregular dark crown connecting them. Brighter green highlight along the top. Optional short hanging roots from crown into trunks. A fig, not folklore.

COLOR: crown #008653 · highlight #45C223 · ink #1F2022.

REJECT: single-trunk Narra, banyan photograph, haunted-tree face, shrine, ghost.
```

#### `species/silhouette.png`

```
PICTURE: species/silhouette.png — the “not yet” journal tile. A tree ghost on paper #FBFAF1.

COMPOSE: Generic trunk + dome, same elevation as dao, but a faint ink wash only. No mustard, no blue, no second green, no diagnostic organ. No question mark, no dashed mystery outline, no name spoiler.

COLOR: #1F2022 at about 15% on #FBFAF1.

REJECT: a specific species, a lock, a pokéball silhouette, “???”.
```

---

### 3.3 Spots

#### `spot/empty_journal.png`

```
PICTURE: spot/empty_journal.png — an open field notebook waiting, on paper #FBFAF1.

COMPOSE: Open book, slight 3/4, sitting on a soft green grounding ellipse. Left page deep green, right page cream, spine down the middle. Three dashed rules on the right — empty. Small two-leaf plant + mustard seed growing behind the top-right corner. Quiet. No mascot. No “0/12”.

COLOR: left page #008653 · right #F9F9F9 · ellipse #45C223 (soft) · plant #3F8A1F · seed #E1A036 · ink #1F2022.

COPY: Gargar spot *staging* (object on a grounding ellipse). Gargar empty_rates is a still-life to reject, not to copy.

REJECT: sad face, Pokémon empty box, trash still-life, jumping collector.
```

#### `spot/success_log.png`

```
PICTURE: spot/success_log.png — the same open notebook, now holding a sighting.

COMPOSE: Same staging as empty_journal. Right page now has a tiny two-leaf plant and a double-stroke check (fat ink under, green on top). One mustard four-point spark outside the top-right — the only sparkle in the kit. This is “Narra added to your journal,” not a level-up.

COLOR: same as empty_journal · check #45C223 over #1F2022 · spark #E1A036.

COPY: Gargar check craft + notebook sentence. Not Gargar spot/success.png (jumping collector).

REJECT: confetti cannon, XP toast, trophies, coins, jumping hero.
```

#### `spot/log_sighting.png`

```
PICTURE: spot/log_sighting.png — camera-sheet still life, on paper #FBFAF1 (not a night wash).

COMPOSE: One Narra-like tree on the left/center and the camera sticker hovering at the right as if taking a memory photo. Soft green grounding ellipses — grass, not a black stage. No live-camera UI, no shutter splash, no AR box.

COLOR: leaf stack #3F8A1F / #45C223 / #008653 · camera as icon/camera.png · paper #FBFAF1.

REJECT: dark wash #33512b, rainforest stock photo, selfie, Pokémon camera, trash still-life.
```

---

## 4. Batch prompt

Use only after the three pilots are approved. Still **one picture per message**. Paste §2, then:

```
Next Field Guide sticker picture. Same paper #FBFAF1, same ink #1F2022, same flat stacked greens. One 1024×1024 PNG. No text, no mockup, no black tile, no trash, no Pokémon.

Do the next filename from this list (skip the three approved pilots):
icon/home.png
icon/map.png
icon/plan.png
icon/pin.png
icon/camera.png
icon/encounter.png
icon/player.png
icon/restricted.png
icon/canopy.png
icon/check.png
icon/close.png
species/molave.png
species/katmon.png
species/mahogany.png
species/lagundi.png
species/dao.png
species/raintree.png
species/teak.png
species/balete.png
species/silhouette.png
spot/empty_journal.png
spot/success_log.png
spot/log_sighting.png

Follow the picture brief already in this conversation for that filename. If a brief is missing, stop — do not invent a new metaphor.
```

---

## 5. Inspo inventory

Searched 2026-08-27. Close names (`brand-kit`, `brand_kit`, `Brand Kit`, `gargar icons`) under Warp / Codex / Grok / Documents / Desktop.

| Path | What is there | Use |
|------|----------------|-----|
| `/Users/angelonrevelo/Code/gargar icons` | **Missing.** | — |
| `/Users/angelonrevelo/Code/gargar-icons/` | Arranged Gargar PNG workspace (`asset/`, `review/`, `source-magenta/`). No prompt sheet. | Craft to look at; subjects to reject. |
| `/Users/angelonrevelo/Code/gargar/src/asset/` | Live Gargar kit. PNGs (icons, materials, heroes, spots, sack mark) + 3 residual SVGs. `kit.js` is the manifest. | **Craft to copy, subjects to reject.** |
| `/Users/angelonrevelo/Code/yclap/web/public/brand/` | Youth CLAP four-person logo + motifs. | Program chrome only. |
| `/Users/angelonrevelo/Code/yclap/web/src/brand/` | Token README + `token.json`. | Color + type lock. |
| `/Users/angelonrevelo/Code/yclap/web-forest/src/asset/` | Current Field Guide draft (SVG filenames + hex). | Keep names and language; generate **pictures**. |
| `/Users/angelonrevelo/Code/brand-kit/doc/PROMPT-STRUCTURE.md` | House A/B/C image-prompt pattern. | How to paste (shared style, then one subject). |
| `/Users/angelonrevelo/Code/profstopick/docs/illustration-prompt.md` | Codex/Imagen picture briefs (global block + per-asset). | Process cousin — not the look. |
| `/Users/angelonrevelo/Code/profstopick-asset/ui-icon/PROMPTS.md` | Painted PNG icon sheet for a different product. | Process cousin — not the look. |

Gargar pictures actually opened: `icon/check.png`, `icon/pin.png`, `icon/haul_sack.png`, `icon/collector.png`, `icon/scale.png`, `mark/sack.png`, `hero/walk.png`, `spot/success.png`. Residual SVGs: `sachet.svg`, `film.svg`, `styro.svg` (viewBox 128, stroke `#2E3A16` at 4.5, flat paper/mustard/leaf fills).

### Visual rules (copy vs reject)

1. **Ink first.** Closed sticker, `#1F2022`, round caps/joins, survives 24 px.
2. **Flat fills, stacked greens** `#3F8A1F` / `#45C223` / `#008653` — not airbrush, not clay.
3. **Paper-safe.** Never a black tile. Page is `#F9F9F9` / `#FBFAF1`.
4. **Nested pin:** teardrop → paper well → two-leaf plant. Never a haul-sack or PET in the well.
5. **Chunky, not clay.** Leaves pointed or lobed; trunks round-capped.
6. **One diagnostic per species.** If two plates can swap filenames, redraw.
7. **Lagundi ≠ Molave.** Shrub + blue spikes vs hardwood tree.
8. **No trash, no jumping collector.** Notebook + plant + check.
9. **No economy art.** Encounter and player are discs with a plant. No XP, pokéball, rank, coin.
10. **Program logo stays out.** Four-person mark is not this kit. Symbol is `mark/plant.png`.

---

## 6. SVG-in-code (last resort)

Only if a 20–32 px nav glyph must be vectors *after* the PNG is approved. Trace the picture; do not start here. The PWA already loads kit art as `<img src>`. Prefer shipping the PNG.

---

*Briefs written against Field Guide / Youth CLAP tokens and a read-only pass of `~/Codex/gargar/src/asset`. Generate PNG replacements; do not ship Gargar files. Current Google raster model id (2026-08-27): `gemini-3.1-flash-image`.*

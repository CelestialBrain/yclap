# Build spec — biome pivot + 3D character, Field Guide

Sequenced for a single implementer. Every task carries a falsifiable acceptance
test; nothing is "done" without a fresh command exit code.

**Repo:** `web-forest/` · react + react-dom · Vite · port 4177 dev / 4178 preview
**Live:** https://yclap-field-guide.marangelonrevelo.workers.dev
**Deadline:** pitch deck Sat 09-05 · AIS inventory Wed 09-09 · build week 09-10 → 09-11 · **Showcase 12 Sep**

Context: [`../plaud/2026-09-02-pulong-website-biome-showcase.md`](../plaud/2026-09-02-pulong-website-biome-showcase.md) ·
[`biome-gamification-brief.md`](biome-gamification-brief.md) · `ROADMAP.md` §2026-09-03

---

## 0. Standing rules — violating one fails the task

These are the repo's existing invariants. They are enforced by tests and by
copy on screen; they survive this rewrite.

1. **AIS's numbers are AIS's.** 1,809 / 101 / ~⅔ carry a source and a year. Nothing is "our survey."
2. **iNaturalist identifies, not this app.** No model weights ship. Token-less builds say the reply was recorded.
3. **Biome rings are our delineation.** Any polygon with `is_placeholder: true` must say so on screen. Never label a ring surveyed.
4. **OSM geometry is credited.** ODbL line renders whenever OSM-derived geometry is drawn.
5. **Restricted ground stays hatched** and spawns nothing.
6. **No cross-user comparison.** See §3 — the rule changes shape, it does not disappear.
7. **Singular naming everywhere**, including collections: `biome`, `species_code`, `stage`, not their plurals. Match `campus-biome.json`, which already follows this.
8. **No new runtime dependency** except the one named in §5. If a task seems to need another, stop and ask.

Gate command, run before any completion claim:

```bash
cd web-forest && npm run build && npm test && npm run lint
```

`npm run build` is `tsc --noEmit && vite build` — it typechecks. 65 tests pass
today across 21 suites; that number only goes up.

---

## 1. What already exists (do not rebuild)

| Thing | Where | Note |
|---|---|---|
| Slippy map, pan/zoom, Web Mercator | `src/tile-map.tsx` (~270 lines) | Hand-written on purpose. `project(latlon) → px` + `meter_per_pixel` render-prop |
| Four key-free basemaps + per-preset theme | `src/basemap.ts` (`SOURCE[layer].theme`) | The hook for biome colour |
| Encounters, haversine, 25 m / 8 m | `src/data.ts`, `src/nearby.ts` | Radius logic is sound; the *unit* changes |
| Camera → canvas → JPEG ≤1024 px | `src/camera.tsx` | Tears the stream down on capture and unmount |
| iNat client + recorded fallback | `src/inat.ts` (`scorePlantImage`) | |
| Journal, localStorage, GeoJSON/CSV export | `src/journal.ts` (`summarize`) | |
| UI kit — the only species-rendering path | `src/ui.tsx` | `TaxonThumb` `TaxonName` `PrimaryPill` `Chip` `Fab` `GlyphDisc` `Card` |
| Service worker, precache + tile cache cap 1400 | `public/sw.js` | Production only |
| **Biome seed, 10 biomes** | `src/asset/campus-biome.json` | **New.** 7 with real OSM rings, 3 with `ring: null` |
| 186 OSM footways, campus rings | `src/asset/campus-path.json`, `campus-boundary.json` | |

Two kit rules learned by shipping the bug first, still binding:
**every glyph is drawn green-on-ink for a paper ground** (so `Chip` is always
paper-backed, `Fab` is a paper disc, anything on dark wraps in `GlyphDisc`), and
**threatened outranks origin** (`accentFor` — a red ring never sits beside a
green "Native" badge).

---

## 2. T1 — Biomes replace trees as the unit of play

### T1.1 Extend `CAMPUS_BOX`
`src/geo.ts`. Current box clips the real biome extent by ~137 m south, ~216 m
north, ~131 m east.

```
north: 14.6455   south: 14.6330   west: 121.0740   east: 121.0840
```

**Accept:** every ring point in `campus-biome.json` falls inside the box (assert
this in `geo.test.ts` as a new case). `npm test` green. The demo walk still
never enters `RESTRICTED_POLYGON`.
**Watch:** `percentToLatLon` is linear and seeded encounter coordinates came
from it — changing the box moves every existing `x_percent`/`y_percent`
encounter. Either migrate them to explicit lat/lon or re-derive. `geo.test.ts`
asserts the linear and Mercator projections disagree; that assertion must survive.

### T1.2 Load and draw biomes
New `src/biome.ts` + a `BiomeLayer` in `src/campus-map.tsx`.

- Parse `campus-biome.json`. A biome may have `ring: null` — it must be skipped
  cleanly, not crash, and be listed as "not yet drawn" on `/plan`.
- Each biome is one or more `part`, each with a `point` ring. Fill with the
  green ramp (§4), stroke a touch darker.
- Subtract `RESTRICTED_POLYGON` visually — hatch wins over biome fill.

**Accept:** 7 biomes render; the 3 with `ring: null` render nothing and appear
on `/plan` as blocked. No crash with a null ring. ODbL line shows.

### T1.3 Point-in-biome replaces nearest-tree
`src/nearby.ts`.

- Ray-casting point-in-polygon. Entering a biome opens its card; leaving closes it.
- Card shows **top three species only** (`59:29`), rest one tap deeper.
- Keep the 25 m / 8 m haversine logic for the *species within* a biome — it is
  correct and tested; it just no longer decides which card is open.

**Accept:** a unit test with a known inside-point and outside-point per biome
with geometry. Entering Bellarmine opens Bellarmine. Existing haversine tests
still pass. Fail if the biome is recomputed from distance rather than containment.

### T1.4 Draw the three missing rings
`sunken-forest`, `academic-core`, `katipunan-edge` have **no geometry at all**.
This is a blocking human task, not a coding one. The academic core alone holds
5 of the 8 existing encounters.

**Accept:** `ring: null` count reaches 0, each new ring carries
`is_placeholder: true` and a `ring_source` saying who drew it and when.

---

## 3. T2 — Gamification, and the rule that guards it

### The decision this depends on

`test/journal.test.ts` currently fails the build if `rank`, `score`, `points`,
`streak`, `level` or `xp` appears in the journal summary, sourced to Sophie in
`docs/roadmap-rejected.md`. The owner has directed that gamification ship.

**Implement option (b): personal progression, no cross-user comparison.**
Everything asked for in the pulong — spawns, levels, the egg→tree character,
blind boxes, rarity — is personal. Only a public leaderboard and a "race"
require comparison, and both were the least-defended ideas in the transcript.

**Rewrite the test, do not delete it.** The new assertion:

- **Forbidden:** any field naming another user, any `leaderboard`, `rank`,
  `percentile`, or aggregate over other people's data.
- **Allowed:** per-user `level`, `stage`, `progress`, `seen_count`.

**Accept:** `journal.test.ts` still exists, still fails on a planted
`leaderboard` field, and passes with `level`. A comment in the file names this
spec and the date. Fail if the file is deleted or its assertion weakened to nothing.

### T2.1 Per-biome progress
`src/journal.ts`. `/journal` reads `2 of 3 seen` **per biome**.
**Accept:** count is per biome, total is that biome's `species_code` length —
never a campus-wide claim. Summary object carries no forbidden field.

### T2.2 Two ways to earn
Per `29:45` / `33:36`, kept as **two separate counters**, never summed into one score:
1. **Badge** — photograph a species representative inside its biome, verified by iNat.
2. **Contribution** — report a species/location the guide does not have.

**Accept:** the two are displayed separately and exported separately in the
GeoJSON as distinct feature types. No photo enters the export. No screen claims
a report was sent to AIS or anyone.

### T2.3 Level gating
Early levels expose fewer biomes; progression unlocks more.
**Accept:** level is per-user and persisted locally; no screen compares it.
Fail if level is derived from anything but this user's own journal.

### T2.4 Rarity without an invented clock
`33:04` asked for rarity/urgency. Derive from real data: a species not
photographed in that biome for N days reads "not seen lately."
**Accept:** the phrase traces to a real timestamp in the journal. Fail if a
respawn timer is invented.

### T2.5 The duplicate and easiest-tree problems
Answers already reasoned out — implement them, don't re-derive:
- Badge is **per species per biome**, so a second photo of the same tree grants
  no badge but still records a contribution (`44:36`).
- Surface the **un-photographed** species in the biome, so the incentive points
  at the gap rather than the nearest trunk (`46:27`).

---

## 4. T3 — The look: less wordy, Pokémon-GO ground

### T3.1 Species card front and back
`src/ui.tsx`. Ivan (`1:00:34`): *"don't overfeed too much… cocomelon, not an
informational video."* Nothing sourced may be deleted — only moved.

- **Front:** thumbnail, common name, one origin pill, the action. **≤4 elements.**
- **Back (one tap):** scientific name, note, citation, AIS line, the
  Lagundi/Molave caution, iNat attribution.

**Accept:** front renders ≤4 elements; every citation reachable in one tap; a
grep proves no sourced string was removed from `data.ts`.

### T3.2 Green ramp + quieter basemap
`src/tile-map.tsx`, `src/basemap.ts`. Ivan (`1:03:48`): one green, **not**
rainbow. Sophia asked for teal (`1:02:13`) — teal is water and interactive
state, not a biome fill.

Reference palette (Pokémon GO, community-documented): landscape `#AFFFA0`,
POI `#EAFFE5`, man-made `#affe9f` stroke `#7eedbe`, roads `#59A499` stroke
`#F0FF8D`, water `#1A87D6`. Tune toward the repo's existing greens
(`#45c223`, `#008653`) rather than adopting these raw.

- CSS filter on the raster tile layer (`saturate` + slight `hue-rotate`), biome
  fills on top in one green ramp.
- **Drop `PathNetwork` to a whisper or off by default** — 186 footways *is* the
  "a lot of lines" complaint (`1:01:25`). The `Paper` preset already proves it.

**Accept:** 7 biomes distinguishable **in greyscale** by fill value alone (not
hue). ODbL credit still renders whenever the path layer is on. No kit glyph
sits on a filled dark surface.

### T3.3 Pin family by biome type
Re-aimed from the 09-02 row: `wood` / `open-field` / `cultivated` /
`residential-canopy` / `planted-walk` / restricted / you-are-here.
**Accept:** distinguishable in greyscale by shape or ring weight, not colour
alone. A cluster renders one count pin. The walker's own mark is never occluded at 390 px.

---

## 5. T4 — The 3D character and the unboxing

**This is the only place a new dependency enters the app.**

### T4.1 Renderer
`<model-viewer>`, **self-hosted from `node_modules`**, bundled by Vite. Not
three.js directly. Not a CDN — model-viewer's tracker documents models failing
to load when served from unpkg, and this app must work offline.

**Accept:** no network request to a third-party origin for the viewer or the
model. Verified with devtools offline, using a harness that auto-attaches to the
service worker target (`Target.setAutoAttach`, flatten) — emulating the network
on the *page* target only is the trap that already burned this repo once, and it
proves nothing.

### T4.2 Bundle ceiling — a hard gate
App is **92 kB gzipped** today. 3D is the largest thing ever added.

- **Ceiling: 320 kB gzipped total JS.** If the build exceeds it, the task fails
  and the model or the viewer must be trimmed — not the ceiling raised.
- Add a build-time check that reads the emitted bundle size and exits non-zero
  above the ceiling. Commit it; a ceiling nobody measures is not a ceiling.

**Accept:** `npm run build` fails on a deliberately oversized model.

### T4.3 The model
Four stages: **egg → seedling → sapling → tree** (`1:05:55`).

- Source CC0 or generate; if sourcing, [Quaternius 150+ LowPoly Nature](https://quaternius.itch.io/150-lowpoly-nature-models) (CC0), [Poly Pizza](https://poly.pizza/explore/Nature) (GLTF, CC0 filter), [Kenney](https://kenney.nl) (CC0).
- **Style is the risk.** The app's art is heavy ink contour, flat fills, three
  leaf greens, one mustard accent. A realistic or differently-stylised model
  will read as an asset flip. Match flat-shaded, low-poly, the same greens.
- Optimise with [glTF-Transform](https://gltf-transform.dev/): Draco or Meshopt
  + KTX2, **texture cap 1024 px**. Draco is documented at up to 10× geometry
  reduction; assume nothing ships uncompressed.
- Prefer **one model with four swappable stages** over four models.

**Accept:** total `.glb` payload ≤ **600 kB** across all stages. Renders 60 fps
on a mid-range Android. Licence recorded in `README.md` — CC0 needs no
attribution but the provenance must be written down.

### T4.4 Stage progression + leaf loss
Stage advances on biome completion. `1:08:20`: leaves fall if unvisited that day.

**This is a streak in everything but name.** Under option (b) it is acceptable
because it is private and reversible — so **make it recover, never punish**.
Appearance changes; progress is never lost.

**Accept:** a test that advances a stage, simulates 7 days of absence, and
asserts the stage integer is unchanged. Fail if absence can reduce stage.

### T4.5 Unboxing
`1:04:45`, Pop Mart style. Completing a biome grants a cosmetic variant.

- Sequence: shake → crack → burst → the character scales in. The **anticipation
  beat matters more than the fidelity**.
- Reveal in 3D since the model is already loaded; the surrounding frame is
  CSS/keyframes, not a second engine.
- References: [Magic UI Box Reveal](https://v3.magicui.design/docs/components/box-reveal), [FreeFrontend CSS reveals](https://freefrontend.com/css-reveal-animations/).

**Accept:** nothing purchasable, no currency, no scarcity mechanic, no
loot-box odds — a variant is granted deterministically on completion. Respects
`prefers-reduced-motion`. Fail if a random-odds pull ships.

---

## 6. T5 — Data and truth

### T5.1 AIS inventory (due Wed 09-09)
When it lands, it supersedes the provisional `species_code` in
`campus-biome.json` (currently lifted from demo encounter seeds).
**Accept:** every superseded assignment's `species_source` is updated to cite
AIS with a year. Anything still provisional keeps saying so.

### T5.2 CFMO off-limits (Ivan owns)
`RESTRICTED_POLYGON` is a placeholder; `app.tsx:1200` says so on screen.
**Accept:** when the real boundary arrives, the placeholder wording comes out
*in the same commit* as the geometry. Restricted ground is subtracted from
biome rings, not drawn over them.

### T5.3 The website name
Still "Field Guide" (`19:48`, deferred). One decision, then a rename across
`index.html`, `manifest.webmanifest`, README, and the Worker name.

---

## 7. Sequence, and what blocks what

```
T1.1 box ──▶ T1.2 draw ──▶ T1.3 point-in-biome ──▶ T2.1 per-biome progress
                  │                                        │
              T1.4 draw 3 missing rings (HUMAN, blocking)   │
                                                            ▼
T3.2 green ramp ──▶ T3.3 pins            T2.2 two counters ─┴─▶ T2.3 levels
T3.1 card front/back  (independent)                              │
                                                                 ▼
T4.1 viewer ─▶ T4.2 ceiling ─▶ T4.3 model ─▶ T4.4 stages ─▶ T4.5 unboxing
```

**Critical path to the Sat 09-05 deck:** T1.1 → T1.2 → one biome visibly
working, plus one character stage rendering. Everything else is build-week.

**Hard blockers not solvable in code:** the three missing rings (T1.4), the AIS
inventory (T5.1), the CFMO boundary (T5.2), the name (T5.3).

---

## 8. Explicitly out of scope

| Not this tier | Why |
|---|---|
| 3D trees on the map | Map stays 2D raster + fills. Much larger job |
| three.js directly | `<model-viewer>` is the chosen path; one dependency, not a framework |
| Public leaderboard, race, cross-user comparison | Rejected with named sources; option (b) stands |
| Deriving biomes from OSM landuse | The data does not exist inside campus — verified by Overpass sweep |
| Invented spawn timers | Rarity derives from real observation gaps |
| Vector basemap tiles | Correct eventually, not before 12 Sep |
| Rebuilding Seek / shipping model weights | Standing rejection |
| Loot-box odds, currency, purchases | The unboxing is deterministic and cosmetic |

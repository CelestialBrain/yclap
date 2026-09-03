# The species-model pack — a cute 3D model for every campus species

Shipped 2026-09-04. One animated `.glb` per species known from the Ateneo
Loyola Heights campus, in a single chibi/flat-shaded art style, plus the
companion character's four growth stages and a gallery to view them all.

**Numbers:** 1,098 species models (48.0 MB total, largest file 95 kB) +
5 character files. 357 species carry hand-written real-world colors; the rest
pick deterministically from tuned palette pools.

## Where the species list comes from (read this before quoting it)

- **iNaturalist sweep.** Every taxon iNaturalist holds inside the campus box
  (north 14.6455, south 14.6330, west 121.0740, east 121.0840 — the extended
  `CAMPUS_BOX` from the 3D build spec), fetched **2026-09-03** with
  `quality_grade=any` and cached raw under
  `web-forest/script/data/inat-species/`. Observations are © iNaturalist
  users (CC-BY-NC). Rank `species`/`hybrid`/`complex` rows are modeled;
  genus-and-above rows (240) are not species, so they are not — the manifest
  counts say so.
- **The curated guide list** in `src/data.ts` (the 9 trees). Curated codes
  win: *Samanea saman* is `raintree`, not `samanea-saman`. Scientific name is
  the join key.
- **Homo sapiens is excluded.**
- **The AIS inventory (due 09-09) supersedes all of this** the day it lands.
  Nothing here claims to be a survey. The manifest's `_comment` says so in
  the same breath as the sources, and `test/species-model.test.ts` asserts
  the provenance fields exist.

## How the models are made

`script/build-species-model.mjs` routes each species through a taxonomy-based
archetype table (63 archetypes — bird, frog, ant, ladybird, hawkmoth, palm,
aroid, bracket fungus, …) and composes the model from a shared kit
(`script/species-model/kit.mjs` + `fauna.mjs` + `flora.mjs`) onto a
hand-rolled, zero-dependency glTF 2.0 writer (`script/species-model/glb.mjs`).

The style contract matches the app's art (and the "asset flip" warning in
`biome-gamification-brief.md`): flat-shaded low-poly, no textures — vertex
colors only, the repo's leaf greens, one mustard accent, ink for the eyes.
Chibi proportions on purpose: big glossy eyes, tangent eye discs, a smile,
stubby limbs. Every file carries exactly one looping **`idle`** clip
(breathe + a per-archetype gesture: wing flaps, eyestalk sway, millipede
ripple, canopy sway, blink).

**Color honesty:** `palette_source: "known"` = colors written from the
species' real appearance (357 species — all the birds, mammals, herps, fish,
the campus-celebrity plants). `palette_source: "derived"` = a deterministic
pick from tuned pools by name hash, so the long tail stays on-style without
pretending anyone observed it.

## Regenerating

```bash
cd web-forest
node script/fetch-inat-species.mjs     # refresh the iNat sweep (cached per day)
node script/build-species-model.mjs    # rebuild all species models + manifest
node script/build-character-model.mjs  # rebuild the companion's four stages
npm test                               # test/species-model.test.ts guards all of it
```

## Viewing

The model gallery is a standalone page with a hand-rolled WebGL2 glTF viewer
(`public/model-gallery.html` + `model-gallery.js`) — searchable, filterable,
auto-play. `npm run dev`, then open `/model-gallery.html`. It ships in
`public/`, so it never touches the app bundle. `?shot=<species_code>` renders
one model full-bleed for screenshots.

## What this is NOT

- **Not wired into the app.** Rendering inside the Field Guide still goes
  through spec task T4.1 (self-hosted `<model-viewer>`) and the T4.2 bundle
  ceiling — deliberately untouched here.
- **Not precached.** The pack is served on demand from `public/model/`;
  the service worker's runtime cache absorbs it per view. Nothing in the
  startup precache list changed.
- **Not a survey.** Counts are iNaturalist observation counts inside a box on
  a date; `display_scale_m` is a suggested real-world height hint for AR, not
  a measurement.

## Render proof

`docs/spec/model-shots/` — `model-pack-sweep.png` (32 species across every
archetype group), `character-stages.png` (egg → seedling → sapling → tree),
and a handful of single-species renders. Regenerate any of them with the
`?shot=` mode.

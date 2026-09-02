# Biome + gamification brief — Field Guide after the 09-02 pulong

Written 2026-09-03 for the Saturday (09-05) meeting, from
[`docs/plaud/2026-09-02-pulong-website-biome-showcase.md`](../plaud/2026-09-02-pulong-website-biome-showcase.md)
cross-referenced against the running app.

The 09-02 pulong changed the project's objective on the record (`51:20`,
Ivan: *"originally ang plan natin is to single out lahat… baka pwede natin to
change that objective"*). This brief turns that decision into a cut of the
campus, a gamification design, an asset plan, and a tiered roadmap with
acceptance tests. Program clock: **pitch deck Sat 09-05 · tree inventory Wed
09-09 · website week 09-10 → 09-11 · Innovation Showcase 12 Sep.**

---

## 1. What the pivot invalidates

The app ships **per-tree encounters**: 9 seeded discs, a nearest-follow card, a
25 m / 8 m proximity rule. The meeting replaced that unit of play with the
**area**. Four consequences, all of them work:

| Shipped thing | Status after the pivot |
|---|---|
| 9 encounter discs at fixed coordinates | **Re-scope.** Discs become *area* fills, not tree points |
| `ENCOUNTER_RADIUS_M` 25 / `AT_TREE_RADIUS_M` 8 | **Keep, re-aim.** The radius test becomes a polygon test (`point in biome`) |
| P1 row "ordered stops with a progress rail" | **Obsolete as written.** Stops were trees; now they are biomes |
| P1 row "`4 of 9 species seen`" | **Survives, re-based.** Becomes `n of N` *per biome* |
| P1 row "pin glyph family per encounter type" | **Survives.** Now it distinguishes biome types, not tree types |
| Restricted-grove hatch (placeholder extent) | **Becomes load-bearing.** It is now one biome among several, and Ivan owns getting the real boundary from CFMO (`1:12:00`) |

The `journal.test.ts` invariant is a separate problem — §3.

---

## 2. The biome cut

### The finding that decides the approach

I queried Overpass for every `landuse` / `natural` / `leisure` polygon inside
`CAMPUS_BOX`. **The biomes the team named do not exist in OpenStreetMap.**

- 40 polygons inside the box. Zero `natural=wood`. Zero `landuse=forest`.
- The only `landuse=forest` nearby is **"Mini-forest"** at `14.64386, 121.07732`
  — which is **north of `CAMPUS_BOX.north` (14.6425)**, i.e. our own rectangle
  currently clips it out. Every other forest polygon sits west of `121.073`,
  off-campus in the Marikina valley.
- **Sunken Forest is not tagged in OSM at all.** Neither is the SOM grove.

So: **biomes must be hand-drawn by the team, not derived.** This is the single
biggest scoping fact for next week, and it is good news — hand-drawing 6–8
polygons is an afternoon, whereas waiting on an OSM import that does not exist
is a dead end. It also means the boundaries are *ours* and must be labelled as
our own delineation, not surveyed ground (the standing honesty rule).

### What OSM *does* give us, free and already credited

These are real, named, and usable as biome seeds today:

| OSM name | Tag | Use as |
|---|---|---|
| **Bellarmine Field** | `landuse=recreation_ground` | Open-field biome (already an encounter site) |
| **Cervini Field** | `landuse=greenfield` | Open field |
| **Moro Lorenzo Football Field** · **Ocampo Field** · **Matteo Field** | `leisure=pitch` / `park` | Open field |
| **Science Education Complex Field** | `leisure=park` | Field edge / planted |
| **Zen Garden** | `leisure=garden` | Cultivated / ornamental biome |
| **University Dorms** · **De La Costa Housing** | `landuse=residential` | Residential-canopy biome |
| **West Valley Faultline** | `natural=faultline` | Not a biome — but a genuinely striking overlay for the pitch |
| 7 × `landuse=grass`, 1 × `natural=grassland`, 1 × `landuse=meadow`, 1 × `natural=water` | | Fill and edges |

Anchor buildings for the two biomes the user named:
**JG School of Management** `14.63843, 121.07625` · **Loyola School of Theology**
`14.63744, 121.08161`.

### Proposed cut — 7 biomes

Sized so each is walkable in one session and visibly distinct at 390 px:

1. **Sunken Forest** — agreed in the room as its own biome (`52:46`)
2. **SOM grove** — around JG School of Management
3. **LST / Theology woods** — the east edge, around Loyola School of Theology
4. **Bellarmine & the fields** — Bellarmine, Cervini, Moro Lorenzo, Ocampo, Matteo
5. **The academic core** — Gonzaga / CTC / Berchmans / Rizal Library lawns (where 7 of the 9 current encounters already sit)
6. **Dorm side** — University Dorms, De La Costa Housing, Eliazo
7. **Katipunan edge** — the gate yard and the western walks

Two jobs this forces, both small: **extend `CAMPUS_BOX` north** past 14.6425 so
Mini-forest and the northern campus stop being clipped (the README already flags
57 of 118 boundary points falling outside), and get the **CFMO off-limits list**
so restricted ground is subtracted from these polygons rather than drawn over
them.

---

## 3. Gamification — and the invariant standing in its path

### Read this first

`journal.test.ts` **fails the build** if `rank`, `score`, `points`, `streak`,
`level` or `xp` appears in the journal summary. `docs/roadmap-rejected.md`
rejects leaderboards and points-for-photos, sourced to **Sophie** (against
incentivising advocacy) and **Ivan** (no prize budget).

In the 09-02 pulong, **Sophie herself is choosing between mechanics**
(`1:10:09`: *"magdecide din tayo if level basha or if may mga unlock na yun ng
blind box"*), and Ivan defers the decision rather than vetoing it (`1:10:38`).
The objection that justified the rule has softened — **but nobody said the rule
is lifted, and no meeting minute records a reversal.** Saturday should state one
of these out loud:

- **(a) Lift it.** Points and levels ship; the test is rewritten on purpose to
  assert the *new* rule (see below), not deleted.
- **(b) Keep it, narrow.** Personal progression ships; nothing compares two
  students. This is the "counting is fine, comparing is not" line the app is
  already built on, and it accommodates almost everything asked for in the
  meeting.
- **(c) Defer again.** Then the character and the reward system cannot be built
  next week, because both depend on the answer.

**Recommendation: (b).** Everything the room actually got excited about —
spawns, the egg→tree character, blind boxes, rarity, "bounty hunting" — is
*personal progression*, not ranking. Only two asks genuinely require comparison
(a public leaderboard, and a race), and both were the least-defended ideas in
the transcript. Taking (b) lets the team ship the fun parts on Saturday's
timeline without reopening a decision that has research and a named objector
behind it, and the pitch gets a *stronger* line: **"we gamified engagement
without gamifying competition."** That is a differentiator in front of judges,
not a limitation.

The test then becomes the guard for the new rule: forbid `rank` and
`leaderboard` fields and any cross-user comparison; **allow** per-user `level`
and `progress`.

### The mechanics, mapped to what was actually said

| Mechanic | Transcript | Design |
|---|---|---|
| **Two ways to earn** | `29:45`, `33:36` Cathy | (1) Photograph a species representative in its biome → badge. (2) Contribute a location the guide does not have → **contribution**, a separate counter. Keeping them separate answers Ivan's monitoring question (`49:04`) without a single "score" |
| **Spawns per biome** | `48:04` Gelo (Minecraft framing) | A biome declares which species *can* appear in it. Entering the biome pops its top three (`59:29`) |
| **Top three only** | `59:29` Gelo, `1:00:34` Ivan | Hard cap. The rest are reachable one tap deeper — this is the main anti-overload lever |
| **Level gating** | `32:40`, `34:27` | Early levels expose few biomes; progression unlocks more. Per-user, never compared |
| **Rarity / urgency** | `33:04` Cathy | Derive from data we *have*: a species not photographed in the current biome for N days reads "not seen lately." Never invent a spawn timer we cannot justify |
| **Character** | `1:05:55`, `1:08:20` | Egg → seedling → sapling → tree. Loses leaves on an unvisited day — **note this is a streak in everything but name.** Under (b) it is fine because it is private and reversible; make it recover, not punish |
| **Blind box** | `1:04:45` Sophia | Unlock a character variant on biome completion. Cosmetic only, no scarcity purchase, no currency |
| **iNat verifies the badge** | `59:42`→`1:00:01` | **Already shipped.** `scorePlantImage` + camera sheet |

Two problems the room raised and did not solve, with answers:

- **Duplicate photos of the same tree** (`44:36`) → the badge is per *species per
  biome*, not per tree. A second photo of the same tree in the same biome adds
  no badge but still counts as a contribution record. The duplicate problem
  dissolves once the unit is the area.
- **Everyone photographs the easiest tree by the path** (`46:27`) → surface the
  *un-photographed* species in the biome ("2 of 3 seen here"), so the incentive
  points at the gap rather than the nearest trunk.

---

## 4. Assets — the 3D question, answered honestly

### The recommendation: do not go 3D for the trees

The app's art is a **hand-drawn field-guide language** — heavy ink contour, flat
fills, three leaf greens, one mustard accent, shared with Gargar. Dropping CC0
low-poly 3D models into it produces the exact "asset-flip" look that reads as
unfinished to a judge. It also costs a dependency: the repo runs **react +
react-dom and nothing else** on purpose, and adding three.js is **~168 kB
gzipped** against a current bundle of 92 kB gzipped — it would nearly triple the
payload of an app whose whole offline story is a hand-written service worker.

**Do this instead:** keep the map 2D, and make the character and species art
**2D sprites in the existing style**, produced by the image pipeline already on
this machine (`/codex image`, per the brand-kit skill's contract). The species
plates in `web-forest/src/asset/` were made this way — the character should
match them, not fight them.

**One place 3D genuinely earns its keep:** the *pitch*, not the product. A
single rotating 3D tree in the deck or on the booth laptop is a strong visual
and costs nothing at runtime. Ivan already framed it that way (`1:07:02`: *"try
na lang, if every prototype then let's just emphasise it during the pitch"*).

### If the team overrules that — the actual sources

All CC0, all free, all commercially usable with no attribution required:

| Source | What | License | Note |
|---|---|---|---|
| [Quaternius — 150+ LowPoly Nature](https://quaternius.itch.io/150-lowpoly-nature-models) | 150 models: trees, palms, plants, bushes, rocks, logs; seasonal variants | **CC0 1.0** | `.blend` `.fbx` `.obj`, name-your-own-price (free). The closest thing to a drop-in "Pokémon tree" set |
| [Poly Pizza](https://poly.pizza/explore/Nature) | Thousands of low-poly nature models, individually downloadable | mixed, **CC0 filter available** | No login. `OBJ` / `FBX` / **`GLTF`** — GLTF is the web-ready one |
| [Kenney](https://kenney.nl) | Tens of thousands of assets, 3D + sprites + UI, consistent style | **CC0** | The most style-consistent library; mixing packs actually works |
| [awesome-cc0](https://github.com/madjin/awesome-cc0) | Index of CC0 asset sources | — | Use to find more without licence risk |

Rendering path if you do: **`<model-viewer>`**, not raw three.js — it is a web
component built for exactly one rotating model, minimal setup, and it keeps
three.js out of the app bundle. Optimise the `.glb` (texture size, poly count)
— that matters more for performance than the library choice does.

### Unboxing / blind box

No 3D needed. This is a CSS/JS animation problem:

| Reference | Use |
|---|---|
| [Magic UI — Box Reveal](https://v3.magicui.design/docs/components/box-reveal) | Open-source React + Motion reveal component; closest ready-made primitive |
| [FreeFrontend — 20+ CSS reveal animations](https://freefrontend.com/css-reveal-animations/) | Pure-CSS reveals, no dependency |
| GSAP gacha-machine pattern | The full capsule-drop sequence (insert → turn → dispense) if a bigger moment is wanted for the booth |

Build it as: shake → crack → burst → the character card scales in. Three
keyframes and a sprite is enough; the anticipation beat matters more than the
fidelity.

---

## 5. UI direction — less wordy, Pokémon GO's actual lesson

Ivan's brief (`1:00:34`, `1:01:25`): *"as much as possible, some users don't
overfeed too much image… instead of giving them an informational video, we give
them cocomelon"* — and *"it will discourage them to use the website."*

What Pokémon GO actually does, and what to copy:

- **One subject per screen.** The catch screen is the creature and the ball.
  Everything else is a tab at the bottom or an icon down the right edge. Our
  encounter card currently carries name, scientific name, three pills, a note
  and a sourced caption **at once** — that is five information classes competing.
- **Recognition over recall.** One consistent visual language for a species
  everywhere it appears. `src/ui.tsx` already owns this (`TaxonThumb`,
  `PrimaryPill`); the fix is to *use less of it per screen*, not to add.
- **Confirmations are stripped.** Background simplified, one concise question,
  two clear options.

### The concrete rule: bio-education goes on the back

This is the design that satisfies both Ivan's "less wordy" and the project's
non-negotiable sourcing. **Every species card gets a front and a back.**

- **Front:** thumbnail, common name, one origin pill, and the action. Nothing else.
- **Back (one tap):** scientific name, the note, the citation, the AIS line, the
  Lagundi/Molave caution, the iNaturalist attribution.

Nothing is deleted — the sourcing invariants all survive, they just stop being
the first thing a student reads. That is the honest way to be less wordy, and
it is defensible to a judge in one sentence: *"the evidence is one tap away, not
removed."*

---

## 6. Map look — Pokémon GO shading, in our engine

`src/tile-map.tsx` is ours, ~270 lines, with a per-preset theme
(`SOURCE[layer].theme` driving path, step, halo, outline, `path_opacity`). That
is already the hook for this.

### Palette

The community-documented Pokémon GO map palette:

| Feature | Hex |
|---|---|
| Landscape / natural | `#AFFFA0` |
| POI green | `#EAFFE5` |
| Man-made green | `#affe9f`, stroke `#7eedbe` |
| Roads | `#59A499`, stroke `#F0FF8D` |
| Water | `#1A87D6` |

Ivan's constraint (`1:03:48`): biomes in **shades of one green, not rainbow** —
*"kung iba't iba na parang rainbow, parang ang sakit"*. Sophia asked for teal
(`1:02:13`), which the roadmap's own C15 finding already points at (deep green +
cream + one warm accent). These agree: **one green ramp across the 7 biomes,
teal reserved for water and interactive state, mustard for the one accent.**

### Two ways to get there

1. **Cheap, this week.** Keep raster tiles, apply a CSS filter to the tile layer
   (`saturate` + `hue-rotate` + slight `contrast`), and draw biome polygons as
   translucent fills on top in the green ramp. Drop the `PathNetwork`'s 186
   footways down to a whisper or off entirely — that *is* Ivan's "there's a lot
   of lines" complaint, and the `Paper` preset already proves the app looks
   better with fewer. **Zero new dependencies, ~a day.**
2. **Proper, later.** Vector tiles with a real style. Correct, and out of scope
   before 12 Sep.

Do (1). The biome fills are what sells the look; the basemap only has to stop
competing with them.

---

## 7. Roadmap — tiered, with acceptance tests

House rule: no row lands without a falsifiable test.

### P0 — before Sat 09-05 (pitch deck)

| Item | Surface | Benchmark | Status |
|---|---|---|---|
| Decide the ranking question (a/b/c above) | meeting minute | A written line in the minutes naming which option and who agreed. PASS iff `docs/roadmap-rejected.md` is updated to match — reversal or re-affirmation, dated | **open** |
| One biome rendered on the map | `campus-map.tsx` | Sunken Forest draws as a filled polygon in the green ramp; entering it pops its top-three species. PASS iff the fill is labelled "our delineation, not surveyed" | **open** |
| Character concept, one frame | `docs/figma/` | Egg → seedling → sapling → tree, in the existing ink-contour style, sized to sit on the journal screen | **open** |

### P1 — website week 09-10 → 09-11

| Item | Surface | Benchmark | Status |
|---|---|---|---|
| All 7 biomes drawn and named | `src/asset/campus-biome.json` | Every polygon has a name, a species list, and a source note. PASS iff restricted ground is *subtracted*, not overdrawn, and no polygon claims to be surveyed | **open** |
| Extend `CAMPUS_BOX` north | `geo.ts` | Mini-forest (`14.64386`) falls inside the box. PASS iff `geo.test.ts` still passes and the demo walk stays on legal ground | **open** |
| Point-in-biome replaces nearest-tree | `nearby.ts` | Entering a biome pops its card; leaving clears it. PASS iff the haversine encounter test still passes for within-biome species | **open** |
| Species card front/back split | `ui.tsx` | Front shows ≤4 elements; every citation still reachable in one tap. PASS iff no sourced claim is deleted, only moved | **open** |
| Biome green ramp + quieter basemap | `tile-map.tsx`, `basemap.ts` | 7 biomes distinguishable in greyscale by fill value; footway layer at whisper or off by default | **open** |
| Per-biome progress, personal only | `journal.ts` | `/journal` reads `2 of 3 seen` per biome. PASS iff the summary object still carries no cross-user field and the rewritten `journal.test.ts` asserts the *new* rule | **open** |
| Character with 4 stages | `ui.tsx` | Stage advances on biome completion; regresses visually on absence but never loses progress | **open** |
| Blind-box reveal | camera → journal | Completing a biome plays a reveal and grants a cosmetic variant. PASS iff nothing purchasable and nothing scarce | **open** |

### Rejected / deferred here

- **Public leaderboard, race, cross-user comparison** — pending the §3 decision;
  currently still rejected with named sources.
- **three.js in the app bundle** — 168 kB against a 92 kB app; `<model-viewer>` or a deck render instead.
- **CC0 low-poly trees inside the product** — style clash with the field-guide art.
- **Spawn timers we cannot justify** — rarity must derive from real observation gaps.
- **Deriving biomes from OSM** — the data does not exist; hand-draw.

---

## 8. Open questions for Saturday

1. **The ranking decision** — (a), (b) or (c). Everything in P1 depends on it.
2. **The exact 7 cuts.** The list in §2 is a proposal, not a survey. Bio needs to confirm the SOM and LST wood extents.
3. **The name.** Still "Field Guide" (`19:48` — deferred to Saturday).
4. **Who does the brand design** (`1:02:48`) — and whether teal enters the palette or stays a state colour.
5. **Replayability** (`32:40`, Gelo: *"if you collected all the trees, what will you get?"*) — the blind box is a partial answer; seasonal re-verification of a biome is a better one.
6. **Does the AIS tree inventory (due Wed 09-09) change the cut?** If it carries per-tree locations after all, biomes stay the play layer and the inventory becomes the monitoring layer underneath.

---

## Sources

- [Quaternius — 150+ LowPoly Nature Models](https://quaternius.itch.io/150-lowpoly-nature-models) · [Poly Pizza](https://poly.pizza/explore/Nature) · [Kenney](https://kenney.nl) · [awesome-cc0](https://github.com/madjin/awesome-cc0)
- [Magic UI Box Reveal](https://v3.magicui.design/docs/components/box-reveal) · [FreeFrontend CSS reveal animations](https://freefrontend.com/css-reveal-animations/)
- [Snazzy Maps — Pokémon GO map style](https://snazzymaps.com/style/71168/pokemon-go-map-style) · [Mapbox — Design your own Pokémon GO map](https://medium.com/@Mapbox/design-your-own-pokemon-go-map-61c7ddb869cd) · [SNiLD/PokemonGoBiomes](https://github.com/SNiLD/PokemonGoBiomes)
- [Pokémon GO Hub — does it meet UI principles](https://pokemongohub.net/post/article/lets-talk-does-pokemon-go-meet-the-principles-of-ui-design/) · [Game UI Database — Pokémon GO](https://www.gameuidatabase.com/gameData.php?id=1317)
- [Three.js vs Babylon.js vs Model Viewer](https://www.coohom.com/article/three.js-vs-model-viewer-vs-babylon.js-for-website-3d-integration)
- OSM land-use query: Overpass `z` mirror, `CAMPUS_BOX` bbox, 2026-09-03. Raw counts in §2.

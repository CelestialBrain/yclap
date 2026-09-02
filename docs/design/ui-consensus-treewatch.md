# UI consensus — the `treewatch` reference set

**Read date:** 2026-09-02 · **Target:** `web-forest/` (Field Guide PWA) ·
**Source:** [`dribbble.com/angelo-revelo-gelo/collections/7931269-treewatch`](https://dribbble.com/angelo-revelo-gelo/collections/7931269-treewatch)
plus the 29 shot links given with it.

All **29 shots were opened and looked at**, not summarised from their titles.
The roadmap rows this produced are in `ROADMAP.md`
§ *2026-09-02 — UI consensus from the treewatch reference set*.

## How they were read (and why it took a workaround)

Individual `dribbble.com/shots/…` pages answer **HTTP 202 with a JS bot
challenge** to every fetcher tried here (curl with a browser UA, WebFetch,
TinyFish's headless renderer). The **collection** page is not challenged, and
carries each shot's CDN image URL in order:

```
page 1 → 24 shots   page 2 → the remaining 5
cdn.dribbble.com/userupload/<id>/file/<hash>.png?resize=1400x0
```

So the set was read from the collection listing, downscaled to 1100 px, and
viewed. Consequence worth knowing: **only the cover frame of each shot was
seen.** Multi-attachment shots (a full case study behind one cover) and every
animated shot (`still-*.png` frames) contributed one image, not the whole story.
Nothing below rests on a screen that was not actually on the cover.

The images are **not committed** — they are other people's work. They live in the
session scratchpad (`…/scratchpad/dribbble/`, ephemeral) and the URL list is
`docs/design/treewatch-shot.txt` for a refetch.

## The 29 shots

| # | Shot | By | What it is | The thing worth taking |
|---|------|----|-----------|------------------------|
| 1 | MOSS — Plant Identification | Alisa Sorokina | Guided nature walks + ID | The closest thing to our product that exists. Walk = ordered discoveries with a `3 of 5` progress rail; ends in a **Walk complete** receipt (2.8 km / 46 min / 7 species) that pushes new species into the journal |
| 2 | 🐚 Nautilus — Naturalist Journal | Yana | Specimen archive + journal | Specimen **№0231** numbering; `HABITAT / REGION / MORPHOLOGY` as labelled rows; journal entries headed `17 Mar 2024 · Seychelles · 220 m` |
| 3 | FIELD — Travel Journal | Yana | Journey log | Route with **named waypoints on the line** (`Finish`, `Viewpoint`, `You are here`); `8.4 km wandered / 4 places saved / 2 field notes`; Save place · Add note · Add photo as three peer actions |
| 4 | Hikeable \| Map | Milan Petronjević | Trail map | Draws the bottom sheet's **three rest states** in one shot: peek → one card → full list |
| 5 | Trail Finder Community | Mahima Mahajan | Social hiking | Community feed, stories, star reviews — the shape we are refusing |
| 6 | Bird discovery (Birdie) | Ioana Andreea | Bird guide | `Life history` and `Habitat` as 3-up icon tiles; call playback with a waveform |
| 7 | Nature UI #001 — Bird Card | Chloe Thompson | One species card | Conservation status as a pill *over* the photo (`least concern`); `Recent sightings` as place · month · count rows; `log sighting` + `field notes` as the two card actions |
| 8 | Walkguide | Yaroslav H. | City walks | Walks authored *by other people*; taste chips (`Nature & Parks`, `Quiet Walk`) as the filter grammar |
| 9 | Foragely | Orely | Edible-plant foraging | **Look-alike warning callout** above the fold (`Watch out for … poisonous look-alike`); 2×2 characteristic tiles; `Distribution & Habitat` prose block |
| 10 | Park — nearby park finder | voxy St | Park finder | Map pin → compact sheet → detail, with amenities as ticked rows |
| 11–12 | The Arboretum Adventure ×2 | Hana H. Malinova | Arboretum trail game | Numbered stops **1–8** with walking-minutes on each pin, a stop stepper, QR scan at the tree, completion screen. Also the only shot with points (`0 b → 100 b`) |
| 13 | Insect Explorer | Geex Arts | Species browser | `My collection · 47 SPECIES` — the collection *is* the reward; specimen index `01`, category count `218 SPECIES` |
| 14 | GreenTrack | Sanaa Asri | Tree mapping (desktop) | Left icon rail · map centre · right stat + attribute column. Tree attributes as `Name / Species / Height / Lat / Lon` fields — literally our AIS record |
| 15 | UniNav | Desty E. Syawfitri | Campus navigation | The campus analog: buildings with `Open 07.00–16.00 · 200 m · 5 min · Walking`, and **`Go` / `Report` / `Save`** as the three per-item actions |
| 16 | Margin — Journaling | sleek.design | Journal | The entry **prompt** (`What did you notice this morning?`), mood chips, tags, word count in the gutter |
| 17 | Nature Observation App | Norde | Citizen-science observation (2015) | Species picked from a **short curated list** before the camera opens — the same order of operations we use |
| 18 | ForestDrop — Tree Donation | Paperpillar | Donation | `124,800 trees planted · 62% to goal`, `CO2 Offset 3.2k`, `Survival Rate 92%`, "Secured by Impact Protocol" — the claim style our invariants ban |
| 19 | TrailBlazer | Wil Murillo | Route discovery | `TODAY'S ROUTE` as one hero card with difficulty · distance · time · temperature inline |
| 20 | Museum / Orangery | Darina Yefymova | Botanical museum site | Editorial serif over full-bleed botanical photography; numbered sections `/01 /02` |
| 21 | WildWander | Shoghi Bagul | Trail booking | Topographic contour map as the base texture; deep green + amber |
| 22 | Whistler Hiking | nørm | Hike tracking | Track recording → `SUMMARY` (duration / distance / pace / steps); filter chips `Hiking · Trail · Biking`; pale-mint map with a dark route |
| 23 | Wanderly | Dellustria Studio | Travel community (desktop) | Left rail · feed · right sidebar of "what's hot" |
| 24 | Botanical — Card Interaction | Ajith Chandran | Micro-interaction | Slide-to-reveal `VIEW DETAILS` behind a species card |
| 25 | Folio — Book Club | — | Social library | Shelf grid as identity; creator tipping (not for us) |
| 26 | Weagle — Ops Dashboard | Meya Lab Studio | Operations (desktop) | **Status-labelled map pins** (`Delivered`, `On the Way`, `Delayed`) — pins carrying state, not just position |
| 27 | Travel Website (Find) | Nixtio | Map social | Avatar pins for people on a map — the thing we explicitly refuse |
| 28 | Edu Club Student Dashboard | Shameem Ali | Student dashboard | The counted-tiles header (`04 pending / 10 completed / 06 certificates`) |
| 29 | asklepios v3 — Map Pin Component | strangehelix | **A pin component set** | Pins as a *family*: dot · count (`5`) · brand · home · avatar · hover. The strongest single answer to our open "one glyph per encounter type" row |

## What the set agrees on

Counts are of the 29 covers actually seen, so each line is checkable.

| # | Consensus | Evidence | Our state |
|---|-----------|----------|-----------|
| C1 | **Persistent bottom nav, four labelled tabs** | 13 of 22 mobile shots carry a bottom nav; 8 of those have exactly four labelled tabs (MOSS, Nautilus, FIELD, Hikeable, TrailFinder, Margin, UniNav, Folio-5). Nobody hides navigation behind a hamburger on mobile | ✅ already four — `/` `/map` `/journal` `/plan` |
| C2 | **Full-bleed map, detail in a bottom sheet with a resting peek state** | 9 of the 11 map-bearing mobile shots. Hikeable draws all three rest states | ✅ `NearbyBar` → sheet, shipped 09-02 |
| C3 | **A walk is an ordered route with numbered stops and progress — not a scatter of pins** | MOSS (`3 of 5 discoveries`), Arboretum ×2 (`1–8` stepper), FIELD (named waypoints), Whistler, TrailBlazer — 6 shots | ❌ **gap.** Our `/map` is discs + nearest-follow. Start/End walk exists; the walk has no shape |
| C4 | **Finishing produces a receipt** | MOSS, Whistler, Arboretum, FIELD — 4 shots | ❌ **gap.** `End walk` just stops |
| C5 | **Distance is quoted in walking minutes** | Arboretum ×2 (per-pin `3 min` `23 min`), MOSS, UniNav (`200 m · 5 min · Walking`), Walkguide — 5 shots | ⚠️ we print metres + compass only |
| C6 | **Common name over an italic scientific name** | 7 shots (MOSS, Nautilus, Foragely, Bird Card, Birdie, Insect Explorer, Nature Observation) | ✅ `TaxonName` |
| C7 | **Species facts as a tile grid + a habitat/distribution block** | Foragely (2×2 + `Distribution & Habitat`), Birdie (2 × 3-up), Nautilus (labelled rows), Insect Explorer — 4 shots | ❌ we have pills only |
| C8 | **A safety / look-alike caution when misidentification matters** | Foragely, above the species name | ❌ and we have a documented confusion pair (Lagundi *Vitex negundo* vs Molave *V. parviflora*) |
| C9 | **The personal collection is the reward — counted, numbered, never ranked** | Insect Explorer (`47 SPECIES`), Nautilus (`Specimens catalogued: 128`, `№0231`), MOSS (`Your discoveries`), Birdie — 4 shots. **No shot in the set ranks people against each other.** The only reward mechanics anywhere are Arboretum's `100 b` and ForestDrop's badge toast | ✅ grid ships; ⚠️ no `seen / total` framing, no specimen index |
| C10 | **The journal is dated, placed entries with a writing prompt** | Margin (`What did you notice this morning?` + tags), Nautilus (`17 Mar 2024 · Seychelles · 220 m`), FIELD (field notes) — 3 shots | ⚠️ we store a note but never ask for one |
| C11 | **Filter chips sit above the map/list** | Whistler, Walkguide, UniNav, Nautilus, Weagle — 5 shots | ⚠️ only the canopy/built toggle |
| C12 | **Pins are a component family carrying state and counts** | asklepios (6 variants), Weagle (status labels), Arboretum (numbered / `?` / visited) — 3 shots | ❌ every disc is the same plant mark |
| C13 | **Desktop = left rail · centre map · right data column** | 5 of 6 desktop shots (GreenTrack, Weagle, Wanderly, Edu Club, Find) | ⚠️ we use a top bar; the Sep 12 kiosk is a 1440 px projector |
| C14 | **A stat triad, sourced and dated** | MOSS, FIELD, Whistler, ForestDrop, Nautilus (`Last updated: March 2024`), Edu Club — 6 shots | ✅ AIS 1,809 / 101 / ⅔ with source; ⚠️ no "as of" date in the strip |
| C15 | **Deep forest green + cream/pale ground + exactly one warm accent** | 8 shots anchor there (MOSS, Arboretum ×2, WildWander, Whistler, FIELD, Nautilus, Foragely). The outliers are all travel/social products (Walkguide purple, TrailFinder purple, Park blue, Birdie pastel) | ⚠️ our green is `#45c223` (vivid, mid-value) on `#f9f9f9` (grey-white). Nearer the outliers than the field guides |
| C16 | **Editorial serif for specimen and journal headings** | Nautilus, Margin, FIELD, Museum Orangery — 4 shots, and they are the four most "collected-object" designs in the set | ❌ Montserrat everywhere (that is YCLAP brand chrome, so this is a decision, not a defect) |
| C17 | **One real photograph of the actual place carries the home screen** | 9 shots | ❌ we are fully illustrated. Needs photos we have rights to |

## Adopt · defer · refuse

**Adopt** (rows written into `ROADMAP.md`): C3 walk shape, C4 receipt, C5 walking
minutes, C7 attribute tiles + habitat block, C8 look-alike caution, C9 `seen /
total` framing, C10 entry prompt, C11 filter chips, C12 pin family, C13 desktop
rail, C14 dated stat strip, plus UniNav's **Report** action — a student
reporting a tree the guide does not have is precisely the count-and-location gap
Cathy named (`2:12:12`), and the GeoJSON export already exists to carry it out.

**Defer to a decision** (they touch brand or need an input nobody has yet):

| Deferred | Why it is a decision, not a task |
|---|---|
| C15 palette shift to a deeper forest anchor + cream paper | The current values are Gargar's brand, shared with a sibling product. Changing them is a brand call, and every `Chip`/`Fab` contrast rule was tuned against them |
| C16 display serif for specimen + journal headings | YCLAP chrome is Montserrat. A second family is defensible for *specimen* type only; the team should say so out loud |
| C17 real campus photography | Blocked on photos we have rights to — Ateneo Wild's catalogue is a partner ask (`2:11:32`), not a download |
| Arboretum's QR-at-the-tree | Depends on physical plaques and CFMO/AIS cooperation. Real, not two-weeks real |
| Birdie's audio playback | We have no recordings. Shipping a play button with nothing behind it is the kind of claim this repo bans |

**Refuse** — named here because they came in with the reference set, not because
nobody thought of them:

| Refused | Shot | Reason |
|---|---|---|
| Community feed, follows, stories, star reviews | TrailFinder, Wanderly, Folio | No accounts, no public activity. Already the standing call (`docs/roadmap-rejected.md` public-leaderboard row) |
| Avatar pins showing where other people are | Find (Nixtio), asklepios | Student GPS never leaves the device — an explicit prior rejection |
| Points / coins per stop | Arboretum `100 b`, Folio `300` | Sophie against incentivised advocacy (`20:20`) |
| Impact dashboard: CO₂ offset, survival rate, "secured by protocol" | ForestDrop | Unearned numbers and a carbon claim. Two prior rejections at once (planting-as-flagship, carbon product) |
| Booking, payments, creator tips | WildWander, Folio | No commerce in this product |
| Steps, calories, weather | Whistler | We do not measure them. Printing them would be fabrication |

## Notes for whoever builds these

- **The kit rule still governs.** Every glyph is green-on-ink for a paper ground,
  so a new pin variant or chip must stay paper-backed or wrap in `GlyphDisc` —
  see `web-forest/README.md` § Look. Colour alone must not carry pin meaning
  (C12): vary the shape or the ring, and check it in greyscale.
- **Progress is not a score.** C3/C4/C9 all count things (`3 of 5`, `4 of 9
  species`, `2.8 km`). That is compatible with the no-rank rule as long as the
  number is about *this walk* or *my journal* and is never compared to another
  person. The journal-summary test asserting the absence of
  `rank/score/points/streak/level/xp` should be extended to cover the new walk
  summary rather than worked around.
- **Every new fact needs a source line.** The attribute tiles (C7) are the
  riskiest row in this document: four tidy tiles per species invite filling
  twelve fields with plausible botany. Ship fewer tiles with citations rather
  than a full grid without.

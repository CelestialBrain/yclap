# Pitch deck notes — Ateneo CCC campus-forest PWA

For the Saturday 2026-09-05 deck. Numbers here are the ones the app actually
computes; every figure below can be re-derived by running the three scripts in
`web-forest/README.md`. **Nothing in this file is a survey claim** — that
distinction is the strongest thing we have, so please keep it in the deck.

Screens to drop in: [`2026-09-05-asset/`](2026-09-05-asset/).

---

## The one line

> A campus forest you walk into, cut along the paths you already use, and
> coloured by what the satellite actually sees growing there.

## The three numbers

| Number | What it is | Where it comes from |
|---|---|---|
| **94 sectors · 35.0 ha** | The campus cut into areas | Faces of the OpenStreetMap road + footway network (ODbL) |
| **68 biomes · 24.0 ha** | Sectors green enough to walk into and look at a plant | Measured, ≥45% vegetation |
| **1,809 campus trees · 101 arboretum** | Inventory context | **AIS, SY 2025–2026** — theirs, not ours |

Method, if asked: 660 campus ways → 2,759 segments → a planar arrangement of
2,455 vertices and 2,813 edges → 371 faces, filtered to 94 real sectors.
Vegetation from 60 Esri World Imagery tiles at z18, excess-green index
`ExG = 2G − R − B`, threshold 18.

## The story that should carry the deck

We built the map, and then **we checked ourselves and found we were wrong.**

The first version coloured each sector by how much of it was covered by
buildings. It looked right. It wasn't: a car park has no building on it, so it
scored as 100% green, and the map cheerfully painted the Areté parking deck and
the JSEC service aisles as lawn.

So we stopped inferring and looked at the satellite. Every sector is now
sampled against real imagery:

| Sector | Buildings on it | What the satellite sees |
|---|---|---|
| SOM grove (south) | 0% | **9% vegetation** |
| Walk by Hoffner Social Training Center | 0% | **10%** |
| Walk by Covered Court | 0% | **14%** |
| Seismic Vault grounds | 1% | **14%** |

Those four are paved. They are still drawn — leaving holes would be its own
lie — but as the asphalt they are: no species, not tappable, out of the green
palette entirely. 26 sectors were demoted this way.

**Why this matters for a biodiversity pitch:** the failure mode of every
green-tech project in the room is a number nobody checked. Ours is checkable,
and the first thing it caught was us.

## What we can honestly claim

- The boundary of every sector is a line somebody traced from imagery, under
  ODbL, not a shape we drew.
- How green each sector is, is measured, and the sample count is on screen.
- The journal is personal. There is no leaderboard, no points, no rank — a
  deliberate decision (`20:20`, Sophie), and the tests fail if one appears.
- The play view needs **no tile server at all**. It draws its own ground, so it
  survives a hall with dead wifi.

## What we must NOT claim

- ❌ That we surveyed anything. We did not count or locate a single tree.
- ❌ That the species shown are where those trees are. They are demo-map
  positions from the 09-03 seed; the app says so on the card.
- ❌ That 1,809 is our figure. It is AIS's, labelled AIS everywhere it appears.
- ❌ That we have consulted anyone yet. `/plan` lists who we hope to ask and who
  is asking them — Charisse and Clariz (Manila Observatory / AIS), Sophie
  (student orgs), Ivan (CFMO) — and every row still reads "not yet".
- ⚠️ **50 of 94 sector names are ours**, chosen where OSM has none. They carry
  `is_named_by_us` and the card admits it. Don't present them as official.

## The honest gap, if a judge pushes

We have areas but thin content: only 6 sectors currently name something to find,
because we refuse to invent assignments. **The AIS inventory lands Wed 09-09**
and is what fills this — AIS has the species list; what it is missing is the
count and the location of each tree (Cathy, `2:12:12`), and that gap is exactly
what a walk like this could help close. That is the ask, and it is a better ask
than a finished-looking map would be.

## Asset index

| File | Use it for |
|---|---|
| `play-mobile.png` | The hero. Raked camera, character, sectors, a find pin |
| `play-rotated.png` | Proof the camera swings 360° around the walker |
| `play-desktop.png` | Projector / kiosk slide |
| `field-mobile.png`, `field-desktop.png` | "We kept the sources" slide — layers and citations |
| `plan-mobile.png` | The consultation slide — unanswered, with owners named |
| `journal-mobile.png` | Personal record, no leaderboard |
| `home-mobile.png` | Opening slide, AIS-labelled stats |

Regenerate any of them with
`node script/shot.mjs <url> <out.png> <width> <height>` from `web-forest/`
(with the dev server running). Use that rather than a normal headless
screenshot — Chrome clamps its window to ~500 px on Windows, so a "390 px"
capture taken any other way is not 390 px.

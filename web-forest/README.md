# Field Guide — Ateneo Loyola Heights

The student-led campus-forest PWA for the Ateneo CCC team. Four surfaces:
`/` · `/map` · `/journal` · `/plan`. Sibling to `../web/` (the YCLAP landing),
which it does not replace.

```bash
npm install
npm run dev        # http://127.0.0.1:4177
npm run build      # tsc --noEmit && vite build
npm run preview    # http://127.0.0.1:4178 — use this to test the service worker
npm test           # node --test, 36 cases
npm run lint
```

## What it does on stage

| Capability | How it works |
|---|---|
| **Map** | Real raster tiles — satellite (Esri World Imagery) or street (OpenStreetMap), switchable. `src/tile-map.tsx` is a slippy map written here rather than pulled in: pan, zoom-about-cursor, and a projection. No map library. |
| **Position** | `navigator.geolocation.watchPosition`, projected through **Web Mercator** (`toWorld`), the same projection the tile server drew with, so a marker stays on its feature at every zoom. The accuracy ring is a real radius in real metres. |
| **Demo campus** | A scripted 42 s loop over the drawn paths (`DEMO_WALK`). Default **on** — a hall off Katipunan has no useful fix, and the demo must not depend on one. Toggle it off to use the real device. |
| **Encounters** | True haversine metres, not pixel distance. Inside `ENCOUNTER_RADIUS_M` (25 m) an encounter is pinned and gets an arrival ring; inside `AT_TREE_RADIUS_M` (8 m) the card stops hedging. The card follows the nearest tree until you tap one to pin it. |
| **Camera** | Live rear-facing `getUserMedia` viewfinder → canvas frame → JPEG at ≤1024 px (`src/camera.tsx`). Falls back to a file picker when permission is denied, no camera exists, or the page is not on HTTPS. The stream is torn down on capture and on unmount. |
| **Identification** | POSTs the frame to iNaturalist's `computervision/score_image`. This app runs no model. |
| **Journal** | localStorage. Each sighting carries species, photo, note, walk id, lat/lon, accuracy, and whether the fix was real or the demo walk. Summary is counts and groupings only — no score, no rank, no leaderboard. |
| **Export** | GeoJSON and CSV of the located sightings. Photos are deliberately excluded. |
| **Map presets** | Four **key-free** grounds, cycled by the one layer chip: **Guide** (OSM standard — the default; most campus detail, footways as dashes), **Trail** (CyclOSM — greener, path-forward), **Paper** (Esri World Topo — pale, named buildings, draws no footway), **Satellite** (Esri imagery). Each preset carries the overlay palette that reads on it — `SOURCE[layer].theme` drives path, step, halo, outline and `path_opacity`, so a stroke tuned for imagery is not reused on a pale basemap, and a ground that already draws footways gets ours as a whisper. |
| **Walkable paths** | `src/asset/campus-path.json` — **186** footway / steps / path / pedestrian ways inside `CAMPUS_BOX` with full OSM node geometry, cut from `~/Code/sisia-app` (campus.sisia.app) by `script/extract-campus-path.mjs`. Five are named on campus: EDSA Walk, College Lane, Paseo de Reily, Rainbow Bridge, Saint Ignatius Street. Drawn by `PathNetwork`. |
| **Campus outline** | `src/asset/campus-boundary.json` — the OSM landuse rings for the university, both schools and Eliazo, drawn by `CampusOutline`. **57 of the university ring's 118 points fall outside `CAMPUS_BOX`**: our rectangle clips the campus north and east. |
| **Offline** | `public/sw.js` precaches the shell, cache-firsts `/assets/` (Vite content-hashes it) and map tiles (a z/x/y URL is equally immutable), capped at 1400 with oldest-first eviction. Everything else is network-first with a cache fallback. Production builds only. **Tap "Save offline" once before you go on stage** — it warms the campus at z17–19 for the layer you are on *plus* Satellite. |

## Why these four tile hosts

Every preset was probed **without a key** at the campus tile (z18/219238/120294)
before it was allowed into `SOURCE`, because HTTP 200 is not proof a tile is
usable:

| Rejected | What it actually returned |
|---|---|
| CARTO Voyager / Positron | HTTP 200, valid PNG, with **"API KEY REQUIRED — carto.com/basemaps/apikey"** printed across the image |
| Esri Light Gray Canvas | HTTP 200, "Map data not yet available" above zoom 16 — below the zoom this walk happens at |
| OSM Humanitarian (`tile.openstreetmap.fr/hot`) | HTTP 404 |

The four that ship all render real campus content at z18 with no key, no token
and no referer gate. They remain other people's servers under other people's
attribution: a public deployment needs its own tile host.

## Warming tiles before a demo

`Warm campus` prefetches zoom 17–19 over `CAMPUS_BOX` for the **preset that is
currently showing**, not for all four. If the plan is to switch grounds on stage
with no wifi, warm each preset you intend to show — or stay on `Guide`, which is
what the app opens on.

## iNaturalist token

Without a token the camera sheet **replays a recorded iNat reply** and says so on
screen in capitals — it never claims to have looked at your photo, and a recorded
reply is never applied to the student's pick or saved as attribution.

To run live computer vision, copy `.env.example` to `.env` and fill in
`VITE_INAT_API_TOKEN` with a JWT from
<https://www.inaturalist.org/users/api_token>. It expires in about a day, so
refresh it before a demo. Vite inlines the value into the bundle — use a
throwaway account.

## Honesty invariants

Things that must survive any edit to this app:

- **AIS's numbers are AIS's.** 1,809 trees / 101 arboretum / ~⅔ green carry a
  source and a year on screen. Nothing is labelled "our survey."
- **The AIS gap is said out loud.** AIS has a species database; what it lacks is
  the count and location per tree. That sentence appears on `/`, `/map` and
  `/plan`.
- **Encounter coordinates are positions on this demo map**, projected through
  `CAMPUS_BOX`. They are not surveyed tree locations.
- **iNaturalist identifies, not this app.** No model weights ship here.
- **No leaderboard, no points, no rank, no streak** — the journal summary is
  tested for the absence of those fields.
- **Restricted ground stays hatched** and spawns no encounters.
- **The landmark story is not invented.** The card states what is documented and
  names the oral history as not yet collected.
- **The paths and the outline are OSM's.** `campus-path.json` and
  `campus-boundary.json` are OpenStreetMap community mapping — **not** the
  ADMUNAV graph, not a survey, and not a cadastral boundary. The geometry is
  every node OSM has (`out geom tags` via sisia), so nothing here is
  interpolated; what is uncertain is OSM's own completeness, not our redraw.
  Running the extractor with `--from maphy` instead falls back to maphy's
  Overture routing graph, whose lines are rebuilt from connectors at **94.9 %**
  of declared length — the file records which source it came from.
- **ODbL credit is not optional chrome.** Whenever the path layer is on, the map
  reads `Paths & campus outline © OpenStreetMap contributors`.
- **The e-jeep traces are rides, not walks.** `sisia-app` also holds recorded
  GPS traces (`phone-traces.json`), but they are shuttle rides pulled from the
  public e-jeep API. They are not a student walking, so they are not the demo
  loop.

## The map

`src/tile-map.tsx` is ~270 lines and replaces Leaflet / MapLibre on purpose: the
repo runs on react + react-dom and nothing else, and the offline story is a
hand-written service worker. Handing both to a map library to get pan, a few
zoom steps and correctly-placed markers was the worse trade.

What it does: tiles for the viewport, drag to pan, wheel/buttons to zoom **about
the cursor**, a centre clamped to the campus so a stage demo cannot get lost, an
attribution line that is not optional chrome, and a render-prop that hands
overlays a `project(latlon) → pixel` plus `meter_per_pixel`.

**Both projections exist, and that is deliberate.** `percentToLatLon` is linear
in latitude — fine for placing a drawing over 830 m, and it is what the seeded
encounter coordinates came from. `toWorld` is Web Mercator, which is what a tile
server actually draws; overlay a linear projection on Mercator tiles and the
markers walk off their features as you pan. `geo.test.ts` asserts the two
disagree, so nobody "simplifies" one into the other.

Tile endpoints are public and used under each provider's attribution
requirement. A real deployment should move to its own tile host or key rather
than lean on them.

### What using real imagery changed, honestly

A hand-drawn base hides invented geography; a satellite photo does not.

- **The dummy footpaths are gone.** They existed because the ADMUNAV walkable
  graph was never shared. On real imagery the paths are simply visible, which is
  better than a labelled guess. The ask for that graph stays on `/plan`.
- **The canopy choropleth is gone.** It was fabricated green-vs-built data drawn
  over a cartoon. The layer toggle is now Satellite ⇄ Street: the canopy you see
  is the photograph. The Llorin et al. 2024 citation stays attached to the
  *claim* about urban canopy and heat, not to a layer we computed.
- **The restricted grove moved, and is labelled a placeholder.** Carried over
  from the drawing's percentages it landed on top of houses north-east of
  campus. It now sits on the wooded block inside the campus and says
  "placeholder extent, not surveyed" on the map, because nobody has given us the
  real boundary.
- **Trail (CyclOSM) is a volunteer server and answers a share of requests with
  502 under load.** It is one tap away, never the default, and "Save offline"
  deliberately does not bulk-warm it — their usage policy asks people not to,
  and a smoother demo is not a cost worth passing to them.
- **The demo walk was re-routed.** The new geofence sat across the old loop, so
  the scripted walk marched a student through off-limits ground. `geo.test.ts`
  fails if that ever comes back.

## Look

The visual language is Gargar's — heavy ink contour, flat fills, three leaf
greens, one mustard accent — pointed at a field guide instead of a scrap
marketplace. The interaction language is iNaturalist / Seek: a circular taxon
thumbnail whose ring carries the taxon's own colour, a name over an italic
scientific name, a collection grid of badges, and one big round shutter.

`src/ui.tsx` owns that vocabulary — `TaxonThumb`, `TaxonName`, `PrimaryPill`,
`Chip`, `Fab`, `GlyphDisc`, `Card`. Change it there, not per screen.

Two rules the kit forces, both learned by shipping the bug first:

- **Every kit glyph is drawn green-on-ink for a paper ground.** Dropping one
  onto a filled green button or pill makes it vanish. `Chip` is therefore always
  paper-backed and signals "on" with its border and label colour; `Fab` is a
  paper disc with a green ring; anything on a dark surface wraps in `GlyphDisc`.
- **Threatened outranks origin.** `accentFor` and `PrimaryPill` both apply that
  rule, so a red ring never sits beside a green "Native" badge.

### The plate, and why there is a script for it

The generated art shipped **fully opaque**, with a cream rectangle behind every
drawing — three different creams (`#FBFAF1`, `#EBE5CF`, `#E7E3CB`), none of them
matching. That is why encounter discs rendered as cream **squares** on the map
and the nav glyphs sat on tiles.

Keying the cream by colour is the wrong fix: the same cream is a legitimate
*fill* inside the artwork — the journal page, the camera body, the pin's paper
well — so a colour key punches holes in the drawing. `script/deplate.py`
flood-fills only the region **connected to the border**, with proportional alpha
on the rim so the ink contour keeps its antialiasing.

```bash
python3 script/deplate.py --check    # report
python3 script/deplate.py            # rewrite; originals kept in script/asset-with-plate/
```

It is idempotent — an asset that already has transparency is skipped.

### Testing offline is harder than it looks

`Network.emulateNetworkConditions` on the **page** target does not cover the
service worker. `navigator.onLine` flips to false, the page looks offline, and
every tile still arrives over the wire — so an "offline proof" run that way
proves nothing. It has to auto-attach to every target (`Target.setAutoAttach`,
flatten) and apply the emulation per session, then assert that a
*never-cached* URL actually fails before trusting anything else.

Verified 2026-09-02 with that harness: uncached fetch BLOCKED before and after
reload, app renders, 6 encounter discs, 242 path segments, all four basemaps
draw from cache, journal reachable, 0 exceptions.

### One bug worth remembering

The v2 service worker cache-firsted **every** same-origin GET. Under `vite dev`
that meant it cached all 198 dev modules — `/src/app.tsx`, `/src/data.ts`, every
asset — and then served them forever. Adding an export to `data.ts` produced a
white screen and `does not provide an export named 'AT_TREE_RADIUS_M'`, with
`tsc` and `vite build` both green, because the browser was reading a build from
an hour earlier.

Cache-first is only safe for a URL that cannot change, which here means
content-hashed `/assets/` and nothing else. `app.tsx` additionally refuses to
register the worker outside a production build, and unregisters any worker a
previous dev session left behind before clearing its caches.

### Generating a new glyph

`docs/figma/field-guide-ui-icon.spec.json` (repo root) is the `$codex` spec for
this kit: block A is the ban list, block B pins canvas and minimum feature size,
and only the per-item subject changes. It generates **opaque on `#FF00FF`** and
keys afterwards, because `gpt-image-2` cannot emit transparency and magenta
cannot collide with a palette colour the way cream did.

```bash
node ~/.claude/skills/codex/scripts/imagen.mjs docs/figma/field-guide-ui-icon.spec.json --resume
```

Provenance of the current five: `leaf_scan` (the style anchor), `locate` and
`walk` from **codex**; `shutter` and `export` from **grok** after codex returned
"Selected model is at capacity" twice. The seam is mild — the grok two read a
little heavier — and all five met the contract at 1024×1024 within the declared
six-colour palette.

## Layout

```
src/geo.ts        both projections (linear box + web mercator), haversine, demo walk
src/tile-map.tsx  the slippy map: tiles, pan, zoom, attribution, campus prefetch
src/use-geo.ts    one position source (watchPosition or the demo loop)
src/nearby.ts     encounter ranking by true metres
src/camera.tsx    viewfinder, frame capture, file fallback
src/inat.ts       iNaturalist nearby + computer vision client
src/journal.ts    sightings, walks, summary, GeoJSON/CSV export
src/data.ts       curated species, encounters, landmark, consult list
src/campus-map.tsx  imagery base, path network, discs, restricted hatch, walker
src/asset/campus-path.json      186 walkable ways, full OSM geometry (ODbL)
src/asset/campus-boundary.json  the four campus landuse rings (ODbL)
script/extract-campus-path.mjs  re-cuts both from ~/Code/sisia-app, or --from maphy
src/ui.tsx        taxon thumb / name / pill / chip / fab — the shared surface language
src/app.tsx       the four surfaces
script/deplate.py keys the baked paper plate off a generated asset
```

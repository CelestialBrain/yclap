# Field Guide — web-forest

The campus-forest PWA for Ateneo Loyola Heights. Four surfaces: `/` `/map`
`/journal` `/plan`.

## The unit of play

A **sector**: the ground enclosed by the roads and footpaths around it, the way
a city block is defined by its streets. Sectors are not drawn — they are
computed as faces of the real OpenStreetMap way network over campus. 94 of
them, 38.8 ha.

How green each sector is, is **measured off satellite imagery**, not inferred
from the absence of a building. That distinction is the whole point: a car park
has no building on it, so inference painted the Areté deck as lawn. Ground
below 45% measured vegetation is drawn as the asphalt it is, carries no species
and cannot be tapped to log a tree.

Nothing here is a survey. Boundaries are ODbL OpenStreetMap geometry, species
lists are provisional until the AIS inventory (due 2026-09-09), and any name we
chose ourselves is flagged `is_named_by_us`.

## Run it

```
npm install
npm run dev        # http://127.0.0.1:4177
npm run build      # tsc --noEmit && vite build
npm test           # node --test
npm run lint
```

Port 4177 is claimed with `strictPort`, so a collision fails loudly rather than
silently moving.

## Two map views

- **Play** (default) — raked camera, sector fills on one green ramp, your
  character standing in it, ambient canopy and birds. Draws its own vector
  ground from `campus-shape.json`, so it needs **no tile server at all**.
- **Field** — the same sectors over four real basemaps, with the path network,
  every layer control and every citation. The reference surface.

Two fingers (or shift-drag) swing the camera 360°; the compass returns north.
`?bearing=62` seeds an angle for a projector demo or a reproducible screenshot.

## Regenerating the map data

Three stages, in order. The first two need network; the third needs the dev
server running (it borrows Chrome's image decoder over CDP rather than adding a
JPEG dependency to a repo that runs on react and react-dom alone).

```
node script/fetch-osm-way.mjs        # OSM roads, paths, buildings → script/data/ (cached)
node script/build-sector.mjs         # planar arrangement → campus-sector.json + campus-shape.json
npm run dev &                        # measure-vegetation needs a real origin
node script/measure-vegetation.mjs   # Esri imagery → vegetation_ratio, kind, is_biome
```

`script/shot.mjs <url> <out.png> [w] [h]` screenshots a route at an **exact**
viewport. Use it rather than `chrome --headless --window-size`, which clamps to
a ~500 px minimum on Windows and silently invalidates any 390 px check.

## Attribution

Sector boundaries, basemap geometry and the path network are
© OpenStreetMap contributors, ODbL. Vegetation is measured from Esri World
Imagery (© Esri, Maxar, Earthstar Geographics). Inventory figures are AIS,
SY 2025–2026. These credits are licence terms, not chrome — they render.

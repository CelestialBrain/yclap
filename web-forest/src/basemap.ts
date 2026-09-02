
/**
 * The basemap table.
 *
 * Kept in a plain `.ts` rather than inside `tile-map.tsx` for one concrete
 * reason: the service worker's tile-host allowlist is a hand-kept copy of these
 * hosts, and `test/sw.test.ts` has to import them to prove the two have not
 * drifted. Node's type stripping cannot load a `.tsx`, so a table living beside
 * JSX is a table no test can read.
 */

export type Layer = "guide" | "trail" | "paper" | "satellite";

/** Presets are cycled in this order by the map's one layer control. */
export const LAYER_ORDER: Layer[] = ["guide", "trail", "paper", "satellite"];

interface Source {
  label: string;
  attribution: string;
  url: (z: number, x: number, y: number) => string;
  max_zoom: number;
  /**
   * The overlay palette that reads on this ground. A path drawn in vivid green
   * over imagery disappears over a pale basemap, and vice versa, so the theme
   * travels with the tiles rather than being fixed in the overlay.
   */
  theme: {
    path: string;
    step: string;
    halo: string;
    outline: string;
    /** A ground that already draws footways needs our overlay to whisper. */
    path_opacity: number;
    is_dark_ground: boolean;
  };
}

/**
 * Four presets. **Every one of them was probed without a key** at the campus
 * tile (z18/219238/120294) before it was allowed in here, because CARTO's
 * raster basemaps answer HTTP 200 with a real PNG that has "API KEY REQUIRED"
 * printed across it — a 200 is not proof a tile is usable. Esri's Light Gray
 * Canvas was dropped the same way: it returns "Map data not yet available"
 * above zoom 16, which is below the zoom this walk happens at.
 *
 * They are still other people's servers, used under each provider's attribution
 * requirement, which is why the credit line is not optional chrome. A public
 * deployment should move to its own tile host rather than lean on them.
 *
 * `guide` is the default: OSM standard draws this campus in the most detail —
 * named buildings, the cafeteria, the Zen Garden, footways as dashes — where
 * imagery renders a footway as a grey smear under a tree. `satellite` stays one
 * tap away, because the canopy claim on `/map` points at the imagery itself.
 */
export const SOURCE: Record<Layer, Source> = {
  guide: {
    label: "Guide",
    attribution: "© OpenStreetMap contributors",
    url: (z, x, y) => `https://tile.openstreetmap.org/${z}/${x}/${y}.png`,
    max_zoom: 19,
    theme: {
      path: "#00694A",
      step: "#B26A00",
      halo: "rgba(249,249,249,0.85)",
      outline: "#1F2022",
      /* OSM draws the footways itself here — ours is a whisper on top. */
      path_opacity: 0.4,
      is_dark_ground: false,
    },
  },
  trail: {
    label: "Trail",
    attribution: "© OpenStreetMap contributors · CyclOSM",
    url: (z, x, y) => `https://a.tile-cyclosm.openstreetmap.fr/cyclosm/${z}/${x}/${y}.png`,
    max_zoom: 20,
    theme: {
      path: "#00694A",
      step: "#B26A00",
      halo: "rgba(249,249,249,0.8)",
      outline: "#1F2022",
      path_opacity: 0.38,
      is_dark_ground: false,
    },
  },
  paper: {
    label: "Paper",
    attribution: "© Esri, HERE, Garmin, © OpenStreetMap contributors",
    url: (z, x, y) =>
      `https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/${z}/${y}/${x}`,
    max_zoom: 19,
    theme: {
      path: "#008653",
      step: "#C97A00",
      halo: "rgba(249,249,249,0.95)",
      outline: "#1F2022",
      /* This ground draws no footway at all, so ours is the only one. */
      path_opacity: 0.85,
      is_dark_ground: false,
    },
  },
  satellite: {
    label: "Satellite",
    attribution: "Imagery © Esri, Maxar, Earthstar Geographics",
    url: (z, x, y) =>
      `https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/${z}/${y}/${x}`,
    max_zoom: 19,
    /* Paper-white and quiet: 12.6 km of bright stroke over imagery reads as a
       net and hides the thing the walk is about. */
    theme: {
      path: "#F9F9F9",
      step: "#F6B22D",
      halo: "rgba(31,32,34,0.3)",
      outline: "#F9F9F9",
      path_opacity: 0.62,
      is_dark_ground: true,
    },
  },
};

/** Next preset in `LAYER_ORDER`, wrapping — the map has one layer control. */
export function nextLayer(layer: Layer): Layer {
  return LAYER_ORDER[(LAYER_ORDER.indexOf(layer) + 1) % LAYER_ORDER.length];
}


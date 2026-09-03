import campus_biome from "./asset/campus-biome.json" with { type: "json" };
import type { LatLon } from "./geo.ts";

/**
 * The biome layer — the unit of play since the 09-02 pivot.
 *
 * The unit changed on the record (`51:20`, Ivan: singling out every tree is
 * "imposible"): not per-tree encounters but areas, each with species
 * representatives. The seed in `campus-biome.json` was cut from a live Overpass
 * sweep on 2026-09-03 and it found **no `natural=wood` / `landuse=forest`
 * inside the old campus box** — so biomes are hand-drawn or OSM-adjacent, and
 * every ring flagged `is_placeholder` is OUR delineation, never surveyed ground.
 *
 * Ring geometry that IS from OSM carries the ODbL credit via
 * `BIOME_ATTRIBUTION`, which must render whenever this layer draws.
 *
 * Point order differs from `campus-path.json` on purpose-free accident: here a
 * point is `[lat, lon]`, there it is `[lon, lat]`. `biome.test.ts` pins that so
 * nobody "unifies" one into the other and redraws the campus.
 */

export const BIOME_ATTRIBUTION = "Biome rings © OpenStreetMap contributors, ODbL";

export interface BiomePart {
  part_name: string;
  osm_way_id: number | null;
  /** [lat, lon] pairs. */
  point: [number, number][];
}

export interface Biome {
  biome_code: string;
  name: string;
  kind: string;
  /** True means OUR delineation or invented padding — the map says so on screen. */
  is_placeholder: boolean;
  /** One or more parts; a biome with none is real but undrawn (human-blocked). */
  ring: BiomePart[];
  ring_source: string | null;
  /** Provisional until the AIS inventory (due 2026-09-09) supersedes them. */
  species_code: string[];
  species_source: string | null;
  note: string | null;
}

interface BiomeFile {
  _comment: string;
  generated_at: string;
  generated_by: string;
  attribution: string;
  biome: (Omit<Biome, "ring"> & { ring: BiomePart[] | null })[];
}

const file = campus_biome as BiomeFile;

/** Every biome in the seed, drawn or not. The undrawn stay listed — on `/plan`. */
export const biome: Biome[] = file.biome.map((row) => ({
  ...row,
  ring: row.ring ?? [],
}));

/** Biomes with geometry — the only ones that render or can contain a point. */
export const drawn_biome: Biome[] = biome.filter((row) => row.ring.length > 0);

/** Real biomes nobody has drawn yet — human-blocked, surfaced on `/plan`. */
export const undrawn_biome: Biome[] = biome.filter((row) => row.ring.length === 0);

/** Ray casting against one closed ring of [lat, lon] pairs. */
function ringContains(ring: [number, number][], point: LatLon): boolean {
  let inside = false;
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i, i += 1) {
    const [lat_i, lon_i] = ring[i];
    const [lat_j, lon_j] = ring[j];
    const hits = lat_i > point.lat !== lat_j > point.lat &&
      point.lon < ((lon_j - lon_i) * (point.lat - lat_i)) / (lat_j - lat_i) + lon_i;
    if (hits) inside = !inside;
  }
  return inside;
}

/** True when the point falls inside any part of this biome. */
export function biomeContains(row: Biome, point: LatLon): boolean {
  return row.ring.some((part) => ringContains(part.point, point));
}

/** First biome (seed order = priority) whose ring contains the point, if any. */
export function biomeAt(point: LatLon, row: Biome[] = drawn_biome): Biome | null {
  return row.find((b) => biomeContains(b, point)) ?? null;
}

/**
 * Where an on-map label sits: the centroid of the part with the most vertices,
 * which is the part a person means by the biome's name.
 */
export function biomeLabelPoint(row: Biome): LatLon | null {
  const parts = [...row.ring].sort((a, b) => b.point.length - a.point.length);
  const ring = parts[0]?.point;
  if (!ring || ring.length === 0) return null;
  let lat = 0;
  let lon = 0;
  for (const [a, b] of ring) {
    lat += a;
    lon += b;
  }
  return { lat: lat / ring.length, lon: lon / ring.length };
}

/**
 * The biome green ramp — ONE green family, separated by fill VALUE, not hue.
 * Ivan (`1:03:48`): one green, not rainbow. Luminance steps are ≥ 20 apart so
 * the biomes stay distinguishable when the map is read in greyscale, which is
 * the T3.2 acceptance test.
 */
export const BIOME_FILL: Record<string, string> = {
  wood: "#17573B", // darkest — the thing the project is about
  "open-field": "#58B33A",
  cultivated: "#8FBE62",
  "residential-canopy": "#B9DCA0",
  "planted-walk": "#D7ECC4", // lightest — planted rows along paved ground
};

export function biomeFill(kind: string): string {
  return BIOME_FILL[kind] ?? BIOME_FILL["planted-walk"];
}

/** Stroke = the fill darkened toward ink, so the ring reads without a second palette. */
export function biomeStroke(kind: string): string {
  const hex = biomeFill(kind);
  const n = parseInt(hex.slice(1), 16);
  const channel = (v: number) => Math.max(0, Math.round(v * 0.62));
  const r = channel((n >> 16) & 255);
  const g = channel((n >> 8) & 255);
  const b = channel(n & 255);
  return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, "0")}`;
}

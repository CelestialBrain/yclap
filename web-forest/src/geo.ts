/**
 * Real geography for the walk.
 *
 * The map SVG is a hand-drawn handoff base, not a survey raster. To make GPS
 * real anyway we declare one explicit bounding box over Loyola Heights and
 * project both ways through it: a live `watchPosition` fix lands at the right
 * percent on the drawing, and an encounter's percent yields a lat/lon we can
 * measure a true metre distance against.
 *
 * Honesty line that must survive any edit: an encounter coordinate is a
 * position on THIS demo map, not a surveyed tree location. AIS holds the
 * inventory; they have species but not count and location per tree.
 */

export interface LatLon {
  lat: number;
  lon: number;
}

export interface Fix extends LatLon {
  accuracy_m: number;
  at: number;
  source: "gps" | "demo";
}

/** Campus frame. y=0% is the north edge, x=0% the west edge. */
export const CAMPUS_BOX = {
  north: 14.6425,
  south: 14.635,
  west: 121.074,
  east: 121.082,
} as const;

export const EARTH_RADIUS_M = 6371008.8;

export function percentToLatLon(x_percent: number, y_percent: number): LatLon {
  const lat = CAMPUS_BOX.north - (y_percent / 100) * (CAMPUS_BOX.north - CAMPUS_BOX.south);
  const lon = CAMPUS_BOX.west + (x_percent / 100) * (CAMPUS_BOX.east - CAMPUS_BOX.west);
  return { lat, lon };
}

export function latLonToPercent(point: LatLon): { x_percent: number; y_percent: number } {
  const y = ((CAMPUS_BOX.north - point.lat) / (CAMPUS_BOX.north - CAMPUS_BOX.south)) * 100;
  const x = ((point.lon - CAMPUS_BOX.west) / (CAMPUS_BOX.east - CAMPUS_BOX.west)) * 100;
  return { x_percent: x, y_percent: y };
}

export function isInsideCampus(point: LatLon): boolean {
  return (
    point.lat <= CAMPUS_BOX.north &&
    point.lat >= CAMPUS_BOX.south &&
    point.lon >= CAMPUS_BOX.west &&
    point.lon <= CAMPUS_BOX.east
  );
}

/** Great-circle metres. Haversine — good to centimetres at campus scale. */
export function distanceMeter(a: LatLon, b: LatLon): number {
  const to_rad = Math.PI / 180;
  const d_lat = (b.lat - a.lat) * to_rad;
  const d_lon = (b.lon - a.lon) * to_rad;
  const lat_a = a.lat * to_rad;
  const lat_b = b.lat * to_rad;
  const h =
    Math.sin(d_lat / 2) ** 2 + Math.cos(lat_a) * Math.cos(lat_b) * Math.sin(d_lon / 2) ** 2;
  return 2 * EARTH_RADIUS_M * Math.asin(Math.min(1, Math.sqrt(h)));
}

/** Compass bearing a → b, degrees clockwise from north. */
export function bearingDegree(a: LatLon, b: LatLon): number {
  const to_rad = Math.PI / 180;
  const lat_a = a.lat * to_rad;
  const lat_b = b.lat * to_rad;
  const d_lon = (b.lon - a.lon) * to_rad;
  const y = Math.sin(d_lon) * Math.cos(lat_b);
  const x = Math.cos(lat_a) * Math.sin(lat_b) - Math.sin(lat_a) * Math.cos(lat_b) * Math.cos(d_lon);
  return (Math.atan2(y, x) * (180 / Math.PI) + 360) % 360;
}

const COMPASS = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"] as const;

export function compassPoint(degree: number): string {
  return COMPASS[Math.round(((degree % 360) + 360) % 360 / 45) % 8];
}

export function formatMeter(meter: number): string {
  if (meter < 10) return `${meter.toFixed(1)} m`;
  if (meter < 1000) return `${Math.round(meter)} m`;
  return `${(meter / 1000).toFixed(2)} km`;
}

/** 5 decimals ≈ 1.1 m — enough for a tree, short enough to read on a slide. */
export function formatLatLon(point: LatLon): string {
  return `${point.lat.toFixed(5)}, ${point.lon.toFixed(5)}`;
}

export type GeoStatus = "idle" | "prompting" | "watching" | "denied" | "unavailable" | "demo";

export interface GeoState {
  status: GeoStatus;
  fix: Fix | null;
  message: string | null;
}

/**
 * A looping walk for the stage, past the encounter discs, so a projector demo
 * moves without granting geolocation. It stays inside CAMPUS_BOX and outside
 * the restricted grove — both asserted in `geo.test.ts`.
 */
export const DEMO_WALK_PERCENT: { x_percent: number; y_percent: number }[] = [
  { x_percent: 22, y_percent: 74 },
  { x_percent: 27, y_percent: 62 },
  { x_percent: 33, y_percent: 52 },
  { x_percent: 39, y_percent: 46 },
  { x_percent: 44, y_percent: 50 },
  { x_percent: 49, y_percent: 70 },
  { x_percent: 58, y_percent: 33 },
  { x_percent: 70, y_percent: 55 },
  { x_percent: 78, y_percent: 40 },
  /* Routed north of the restricted grove rather than straight back across it —
     a demo that walks a student through off-limits ground teaches the wrong
     thing, and `geo.test.ts` fails if this route ever re-enters the polygon. */
  { x_percent: 66, y_percent: 20 },
  { x_percent: 40, y_percent: 22 },
  { x_percent: 33, y_percent: 30 },
];

export const DEMO_WALK: LatLon[] = DEMO_WALK_PERCENT.map((p) => percentToLatLon(p.x_percent, p.y_percent));

/** Position along the demo loop at `progress` ∈ [0,1), linearly interpolated. */
export function demoWalkAt(progress: number): LatLon {
  const count = DEMO_WALK.length;
  const t = ((progress % 1) + 1) % 1;
  const scaled = t * count;
  const i = Math.floor(scaled) % count;
  const next = (i + 1) % count;
  const frac = scaled - Math.floor(scaled);
  return {
    lat: DEMO_WALK[i].lat + (DEMO_WALK[next].lat - DEMO_WALK[i].lat) * frac,
    lon: DEMO_WALK[i].lon + (DEMO_WALK[next].lon - DEMO_WALK[i].lon) * frac,
  };
}

/* ── Web Mercator ────────────────────────────────────────────────────────
 *
 * Raster tiles are Web Mercator (EPSG:3857). The CAMPUS_BOX projection above
 * is linear in latitude, which is close enough over 830 m to place a drawing,
 * but it is NOT what a tile server draws — overlaying a linear projection on
 * Mercator tiles walks the markers off their features as you pan or zoom.
 * Anything that has to sit on real imagery goes through here instead.
 */

export const TILE_SIZE = 256;

export interface WorldPoint {
  x: number;
  y: number;
}

/** lat/lon → absolute pixel on the world map at `zoom`. */
export function toWorld(point: LatLon, zoom: number): WorldPoint {
  const span = TILE_SIZE * 2 ** zoom;
  const lat_rad = (Math.max(-85.05112878, Math.min(85.05112878, point.lat)) * Math.PI) / 180;
  return {
    x: ((point.lon + 180) / 360) * span,
    y: ((1 - Math.log(Math.tan(lat_rad) + 1 / Math.cos(lat_rad)) / Math.PI) / 2) * span,
  };
}

/** Absolute world pixel → lat/lon. Exact inverse of `toWorld`. */
export function fromWorld(world: WorldPoint, zoom: number): LatLon {
  const span = TILE_SIZE * 2 ** zoom;
  const lon = (world.x / span) * 360 - 180;
  const n = Math.PI - 2 * Math.PI * (world.y / span);
  const lat = (180 / Math.PI) * Math.atan(0.5 * (Math.exp(n) - Math.exp(-n)));
  return { lat, lon };
}

/** Ground metres covered by one screen pixel at this latitude and zoom. */
export function meterPerPixel(lat: number, zoom: number): number {
  return (Math.cos((lat * Math.PI) / 180) * 2 * Math.PI * EARTH_RADIUS_M) / (TILE_SIZE * 2 ** zoom);
}

/** Zoom at which the campus box fits inside a viewport, capped to sane tiles. */
export function fitZoom(width_px: number, height_px: number, pad = 0.9): number {
  for (let zoom = MAX_ZOOM; zoom >= MIN_ZOOM; zoom -= 1) {
    const nw = toWorld({ lat: CAMPUS_BOX.north, lon: CAMPUS_BOX.west }, zoom);
    const se = toWorld({ lat: CAMPUS_BOX.south, lon: CAMPUS_BOX.east }, zoom);
    if (se.x - nw.x <= width_px * pad && se.y - nw.y <= height_px * pad) return zoom;
  }
  return MIN_ZOOM;
}

export const MIN_ZOOM = 15;
export const MAX_ZOOM = 19;

/** Keep the stage demo on campus: a centre may not leave the box by much. */
export const PAN_MARGIN_DEGREE = 0.004;

export function clampCenter(point: LatLon): LatLon {
  return {
    lat: Math.max(
      CAMPUS_BOX.south - PAN_MARGIN_DEGREE,
      Math.min(CAMPUS_BOX.north + PAN_MARGIN_DEGREE, point.lat),
    ),
    lon: Math.max(
      CAMPUS_BOX.west - PAN_MARGIN_DEGREE,
      Math.min(CAMPUS_BOX.east + PAN_MARGIN_DEGREE, point.lon),
    ),
  };
}

export const CAMPUS_CENTER: LatLon = {
  lat: (CAMPUS_BOX.north + CAMPUS_BOX.south) / 2,
  lon: (CAMPUS_BOX.west + CAMPUS_BOX.east) / 2,
};

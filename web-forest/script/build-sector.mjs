/**
 * Cut the campus into SECTORS along the paths and roads.
 *
 * The 09-02 pivot moved the unit of play from a single tree to an area
 * (`51:20`, Ivan: singling out every tree is "imposible"). The 09-03 seed drew
 * those areas as hand-made rings — boxes, effectively, and three of them had no
 * ring at all. The owner's correction on 09-03: sectors are separated **by the
 * paths and roads**, not by boxes we drew.
 *
 * So this does not draw anything. It takes the real OSM way network over the
 * extended campus box and computes the PLANAR ARRANGEMENT of it: node every
 * road and footway where it crosses another, then walk the graph's faces. A
 * face bounded by paths *is* a sector, in the same sense that a city block is
 * bounded by its streets. The boundary of every sector is therefore a surveyed
 * line somebody traced from imagery, not our delineation.
 *
 * What each sector then gets, all measured rather than asserted:
 *   - `built_ratio`   — fraction covered by OSM building footprints (1497 of
 *                       them), sampled on a grid. This is what separates a
 *                       grove from a quad from an academic block.
 *   - `kind`          — derived from that ratio plus any green tag (leisure=
 *                       park/pitch/garden, natural=wood/grassland, landuse=
 *                       grass/forest) whose polygon covers the face.
 *   - `name`          — from a covering green tag, else the largest building
 *                       inside, else the 09-03 biome seed, else `Sector N`.
 *
 * Honesty rules carried from the build spec:
 *   - Nothing here claims to be a survey. Every ring is ODbL OSM geometry.
 *   - A sector whose name we could only guess carries `is_named_by_us: true`.
 *   - Restricted ground stays SUBTRACTED by the app's own hatch, never
 *     overdrawn here.
 *
 * Run: node script/build-sector.mjs   (needs .osm-cache from fetch-osm-way.mjs)
 */
import { readFileSync, writeFileSync } from "node:fs";

const raw = JSON.parse(readFileSync(new URL("./data/osm-way-raw.json", import.meta.url), "utf8"));

/* ── projection ──────────────────────────────────────────────────────────────
 * Local equirectangular metres about the campus centre. Over ~1.4 km the error
 * against a proper projection is centimetres, and working in metres means an
 * area is an area and a tolerance is a real distance.
 */
const LAT0 = 14.6393;
const LON0 = 121.0785;
const M_PER_DEG_LAT = 110574;
const M_PER_DEG_LON = 111320 * Math.cos((LAT0 * Math.PI) / 180);

const toM = (lat, lon) => [(lon - LON0) * M_PER_DEG_LON, (lat - LAT0) * M_PER_DEG_LAT];
const toLatLon = ([x, y]) => [y / M_PER_DEG_LAT + LAT0, x / M_PER_DEG_LON + LON0];

/* ── geometry helpers ────────────────────────────────────────────────────── */

function signedArea(ring) {
  let sum = 0;
  for (let i = 0; i < ring.length; i += 1) {
    const [x1, y1] = ring[i];
    const [x2, y2] = ring[(i + 1) % ring.length];
    sum += x1 * y2 - x2 * y1;
  }
  return sum / 2;
}

function pointInRing(ring, [px, py]) {
  let inside = false;
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i, i += 1) {
    const [xi, yi] = ring[i];
    const [xj, yj] = ring[j];
    if (yi > py !== yj > py && px < ((xj - xi) * (py - yi)) / (yj - yi) + xi) inside = !inside;
  }
  return inside;
}

function bbox(ring) {
  let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity;
  for (const [x, y] of ring) {
    if (x < x0) x0 = x; if (x > x1) x1 = x;
    if (y < y0) y0 = y; if (y > y1) y1 = y;
  }
  return [x0, y0, x1, y1];
}

/** Douglas–Peucker, so a 400-point face does not ship as 400 points. */
function simplify(ring, tolerance) {
  /* A CLOSED ring (first point repeated at the end) must lose that repeat
   * first: with identical endpoints every perpendicular distance is measured
   * against a zero-length baseline, nothing clears the tolerance, and the
   * whole polygon collapses to two points. Building footprints are all
   * closed, which is exactly how they silently vanished the first time. */
  const closed =
    ring.length > 3 && ring[0][0] === ring[ring.length - 1][0] && ring[0][1] === ring[ring.length - 1][1];
  if (closed) return simplify(ring.slice(0, -1), tolerance);
  if (ring.length < 4) return ring;
  const keep = new Uint8Array(ring.length);
  keep[0] = 1;
  keep[ring.length - 1] = 1;
  const stack = [[0, ring.length - 1]];
  while (stack.length) {
    const [a, b] = stack.pop();
    let worst = 0;
    let at = -1;
    const [ax, ay] = ring[a];
    const [bx, by] = ring[b];
    const dx = bx - ax;
    const dy = by - ay;
    const len = Math.hypot(dx, dy) || 1;
    for (let i = a + 1; i < b; i += 1) {
      const [px, py] = ring[i];
      const d = Math.abs(dy * px - dx * py + bx * ay - by * ax) / len;
      if (d > worst) { worst = d; at = i; }
    }
    if (worst > tolerance && at > 0) {
      keep[at] = 1;
      stack.push([a, at], [at, b]);
    }
  }
  return ring.filter((_, i) => keep[i]);
}

/* ── 1. gather the lines that may bound a sector ─────────────────────────── */

const BOUNDING_HIGHWAY = new Set([
  "motorway", "trunk", "primary", "secondary", "tertiary", "unclassified",
  "residential", "service", "living_street", "pedestrian", "footway", "path",
  "steps", "cycleway", "track",
]);

const way = raw.element;
const building = [];
const green = [];
let play_area = null;

const line = [];
for (const w of way) {
  const t = w.tags ?? {};
  const ring = w.geometry.map((g) => toM(g.lat, g.lon));
  if (t.building) { building.push({ ring, name: t.name ?? null, area: Math.abs(signedArea(ring)) }); continue; }
  if (t.amenity === "university" && /Ateneo de Manila University/i.test(t.name ?? "")) {
    if (!play_area || Math.abs(signedArea(ring)) > Math.abs(signedArea(play_area))) play_area = ring;
  }
  const green_tag = t.leisure ?? t.natural ?? (["grass", "forest", "meadow", "village_green", "recreation_ground"].includes(t.landuse) ? t.landuse : null);
  if (green_tag && ring.length > 3) green.push({ ring, tag: green_tag, name: t.name ?? null, area: Math.abs(signedArea(ring)) });
  if (t.highway && BOUNDING_HIGHWAY.has(t.highway)) line.push(ring);
}

if (!play_area) throw new Error("no Ateneo de Manila University ring in the fetch — cannot fence the play area");

/* The play-area ring is itself a bounding line: it closes the faces at the
 * campus edge, so a sector on the rim is bounded by the campus outline rather
 * than running off to infinity. */
line.push([...play_area, play_area[0]]);

const PLAY_BOX = bbox(play_area);
const PAD = 40;

/** Only lines that actually touch the campus matter; the fetch box is wider. */
const near = line.filter((ring) =>
  ring.some(([x, y]) => x > PLAY_BOX[0] - PAD && x < PLAY_BOX[2] + PAD && y > PLAY_BOX[1] - PAD && y < PLAY_BOX[3] + PAD),
);

console.log(`bounding lines: ${near.length} of ${line.length} ways touch the campus`);

/* ── 2. node the arrangement ──────────────────────────────────────────────
 * Every segment is split wherever another segment crosses it. Without this the
 * graph has no vertex at a crossing and the faces are wrong: two paths that
 * visibly cross would not divide the ground between them.
 */

const segment = [];
for (const ring of near) {
  for (let i = 0; i + 1 < ring.length; i += 1) {
    const a = ring[i];
    const b = ring[i + 1];
    if (a[0] === b[0] && a[1] === b[1]) continue;
    segment.push([a, b]);
  }
}
console.log(`segments: ${segment.length}`);

/* Uniform grid so this is not O(n²) over 20k segments. */
const CELL = 25;
const bucket = new Map();
const cellKey = (cx, cy) => `${cx}|${cy}`;
segment.forEach((s, idx) => {
  const [x0, y0, x1, y1] = bbox(s);
  for (let cx = Math.floor(x0 / CELL); cx <= Math.floor(x1 / CELL); cx += 1) {
    for (let cy = Math.floor(y0 / CELL); cy <= Math.floor(y1 / CELL); cy += 1) {
      const key = cellKey(cx, cy);
      let list = bucket.get(key);
      if (!list) { list = []; bucket.set(key, list); }
      list.push(idx);
    }
  }
});

const split = segment.map(() => []);
const EPS = 1e-9;
let crossing = 0;
const seen_pair = new Set();
for (const list of bucket.values()) {
  for (let i = 0; i < list.length; i += 1) {
    for (let j = i + 1; j < list.length; j += 1) {
      const a = list[i];
      const b = list[j];
      const pair = a < b ? `${a},${b}` : `${b},${a}`;
      if (seen_pair.has(pair)) continue;
      seen_pair.add(pair);
      const [p, p2] = segment[a];
      const [q, q2] = segment[b];
      const rx = p2[0] - p[0], ry = p2[1] - p[1];
      const sx = q2[0] - q[0], sy = q2[1] - q[1];
      const denom = rx * sy - ry * sx;
      if (Math.abs(denom) < EPS) continue;
      const t = ((q[0] - p[0]) * sy - (q[1] - p[1]) * sx) / denom;
      const u = ((q[0] - p[0]) * ry - (q[1] - p[1]) * rx) / denom;
      if (t <= EPS || t >= 1 - EPS || u <= EPS || u >= 1 - EPS) continue;
      split[a].push(t);
      split[b].push(u);
      crossing += 1;
    }
  }
}
console.log(`crossings noded: ${crossing}`);

/* ── 3. build the graph ──────────────────────────────────────────────────── */

const SNAP = 0.30; // metres — merges vertices OSM traced twice
const vertex = [];
const vertex_at = new Map();
function vertexId(x, y) {
  const key = `${Math.round(x / SNAP)}|${Math.round(y / SNAP)}`;
  let id = vertex_at.get(key);
  if (id === undefined) {
    id = vertex.length;
    vertex.push([x, y]);
    vertex_at.set(key, id);
  }
  return id;
}

const edge_key = new Set();
const adjacency = new Map();
function addEdge(u, v) {
  if (u === v) return;
  const key = u < v ? `${u},${v}` : `${v},${u}`;
  if (edge_key.has(key)) return;
  edge_key.add(key);
  for (const [a, b] of [[u, v], [v, u]]) {
    let list = adjacency.get(a);
    if (!list) { list = []; adjacency.set(a, list); }
    list.push(b);
  }
}

segment.forEach(([a, b], idx) => {
  const cut = [...new Set(split[idx])].sort((m, n) => m - n);
  let prev = vertexId(a[0], a[1]);
  for (const t of cut) {
    const id = vertexId(a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t);
    addEdge(prev, id);
    prev = id;
  }
  addEdge(prev, vertexId(b[0], b[1]));
});

console.log(`graph: ${vertex.length} vertices, ${edge_key.size} edges`);

/* Prune dead ends. A path that stops in the middle of a lawn bounds nothing;
 * left in, it puts a zero-area spike in whatever face swallows it. */
let pruned = 0;
for (;;) {
  const leaf = [];
  for (const [v, list] of adjacency) if (list.length === 1) leaf.push(v);
  if (!leaf.length) break;
  for (const v of leaf) {
    const list = adjacency.get(v);
    if (!list || list.length !== 1) continue;
    const other = list[0];
    adjacency.set(v, []);
    const back = adjacency.get(other);
    if (back) adjacency.set(other, back.filter((n) => n !== v));
    pruned += 1;
  }
}
console.log(`pruned ${pruned} dead-end vertices`);

/* ── 4. walk the faces ───────────────────────────────────────────────────── */

/* Outgoing half-edges at each vertex, sorted by bearing — the face walk needs
 * the neighbour order around a vertex, not just the set. */
const fan = new Map();
for (const [v, list] of adjacency) {
  if (!list.length) continue;
  const [vx, vy] = vertex[v];
  const sorted = [...new Set(list)]
    .map((n) => ({ n, angle: Math.atan2(vertex[n][1] - vy, vertex[n][0] - vx) }))
    .sort((a, b) => a.angle - b.angle);
  fan.set(v, sorted);
}

const visited = new Set();
const face = [];
for (const [v, list] of fan) {
  for (const { n } of list) {
    const start = `${v}>${n}`;
    if (visited.has(start)) continue;
    const ring_id = [];
    let from = v;
    let to = n;
    let guard = 0;
    let ok = true;
    for (;;) {
      const key = `${from}>${to}`;
      if (visited.has(key)) { ok = key === start && ring_id.length > 2; break; }
      visited.add(key);
      ring_id.push(from);
      const around = fan.get(to);
      if (!around || around.length === 0) { ok = false; break; }
      /* Turn as far clockwise as possible from the way we came in. That choice
       * is what makes every traversal close a minimal face rather than loop the
       * whole component. */
      const back = Math.atan2(vertex[from][1] - vertex[to][1], vertex[from][0] - vertex[to][0]);
      let at = around.findIndex((e) => e.n === from);
      if (at === -1) {
        let best = Infinity;
        around.forEach((e, i) => {
          const d = Math.abs(((e.angle - back + Math.PI * 3) % (Math.PI * 2)) - Math.PI);
          if (d < best) { best = d; at = i; }
        });
      }
      const next = around[(at - 1 + around.length) % around.length].n;
      from = to;
      to = next;
      guard += 1;
      if (guard > 20000) { ok = false; break; }
      if (from === v && to === n) { ring_id.push(from); break; }
    }
    if (!ok || ring_id.length < 3) continue;
    const ring = ring_id.map((id) => vertex[id]);
    const area = signedArea(ring);
    if (area > 0) face.push({ ring, area });
  }
}
console.log(`faces found: ${face.length}`);

/* ── 5. keep the ones that are real sectors ──────────────────────────────── */

const MIN_AREA_M2 = 700;
/**
 * A face larger than this is not a sector, it is unmapped ground: the grade-
 * school end has few footways in OSM, so the arrangement hands back one 16.7 ha
 * blob there. Showing that as "a sector" would be a lie of resolution, so it is
 * dropped and the gap is reported instead.
 */
const MAX_AREA_M2 = 40000;

function centroidOf(ring) {
  let cx = 0, cy = 0, a = 0;
  for (let i = 0; i < ring.length; i += 1) {
    const [x1, y1] = ring[i];
    const [x2, y2] = ring[(i + 1) % ring.length];
    const cross = x1 * y2 - x2 * y1;
    a += cross;
    cx += (x1 + x2) * cross;
    cy += (y1 + y2) * cross;
  }
  a *= 0.5;
  if (!a) return ring[0];
  return [cx / (6 * a), cy / (6 * a)];
}

/** A point guaranteed inside — a coarse pole of inaccessibility for the label. */
function interiorPoint(ring) {
  const c = centroidOf(ring);
  if (pointInRing(ring, c)) return c;
  const [x0, y0, x1, y1] = bbox(ring);
  let best = null;
  let best_d = -1;
  for (let i = 1; i < 12; i += 1) {
    for (let j = 1; j < 12; j += 1) {
      const p = [x0 + ((x1 - x0) * i) / 12, y0 + ((y1 - y0) * j) / 12];
      if (!pointInRing(ring, p)) continue;
      let d = Infinity;
      for (let k = 0; k < ring.length; k += 1) {
        const q = ring[k];
        d = Math.min(d, Math.hypot(q[0] - p[0], q[1] - p[1]));
      }
      if (d > best_d) { best_d = d; best = p; }
    }
  }
  return best ?? c;
}

/**
 * Polsby-Popper compactness, 4piA / P^2. A circle is 1; a long thin ribbon
 * tends to 0.
 *
 * The arrangement happily returns the 3 m strip between two parking aisles as a
 * "sector". It is a face of the network, technically, but it is not ground
 * anybody walks into, and painting it green was one of the things the owner
 * flagged on 09-03. Anything this thin is drainage between roads, not a place.
 */
function compactness(ring) {
  let perimeter = 0;
  for (let i = 0; i < ring.length; i += 1) {
    const [x1, y1] = ring[i];
    const [x2, y2] = ring[(i + 1) % ring.length];
    perimeter += Math.hypot(x2 - x1, y2 - y1);
  }
  if (!perimeter) return 0;
  return (4 * Math.PI * Math.abs(signedArea(ring))) / (perimeter * perimeter);
}

const MIN_COMPACTNESS = 0.14;

let sliver = 0;
const kept = face.filter((f) => {
  if (f.area < MIN_AREA_M2 || f.area > MAX_AREA_M2) return false;
  if (compactness(f.ring) < MIN_COMPACTNESS) { sliver += 1; return false; }
  return pointInRing(play_area, interiorPoint(f.ring));
});
console.log(`dropped ${sliver} slivers below ${MIN_COMPACTNESS} compactness`);
console.log(`sectors inside campus, ${MIN_AREA_M2}–${MAX_AREA_M2} m²: ${kept.length}`);

/* Deduplicate: the arrangement can walk the same ground twice when a way is
 * traced as two coincident ways (OSM does this at kerbs). */
const unique = [];
for (const f of kept) {
  const p = interiorPoint(f.ring);
  if (unique.some((u) => Math.abs(u.area - f.area) < 1 && Math.hypot(...[0, 1].map((i) => u.point[i] - p[i])) < 3)) continue;
  unique.push({ ...f, point: p });
}
console.log(`after dedupe: ${unique.length}`);

/* ── 6. measure each sector ──────────────────────────────────────────────── */

const build_bucket = new Map();
building.forEach((b, idx) => {
  const [x0, y0, x1, y1] = bbox(b.ring);
  for (let cx = Math.floor(x0 / 50); cx <= Math.floor(x1 / 50); cx += 1) {
    for (let cy = Math.floor(y0 / 50); cy <= Math.floor(y1 / 50); cy += 1) {
      const key = cellKey(cx, cy);
      let list = build_bucket.get(key);
      if (!list) { list = []; build_bucket.set(key, list); }
      list.push(idx);
    }
  }
});

function builtRatio(ring) {
  const [x0, y0, x1, y1] = bbox(ring);
  const step = Math.max(2.5, Math.min((x1 - x0) / 26, (y1 - y0) / 26));
  let inside = 0;
  let covered = 0;
  for (let x = x0; x <= x1; x += step) {
    for (let y = y0; y <= y1; y += step) {
      if (!pointInRing(ring, [x, y])) continue;
      inside += 1;
      const list = build_bucket.get(cellKey(Math.floor(x / 50), Math.floor(y / 50)));
      if (list && list.some((i) => pointInRing(building[i].ring, [x, y]))) covered += 1;
    }
  }
  return inside ? covered / inside : 0;
}

function greenCover(ring, point) {
  let best = null;
  for (const g of green) {
    if (!pointInRing(g.ring, point)) continue;
    if (!best || g.area < best.area) best = g;
  }
  return best;
}

/** Nearest named building to a label point — the last resort before "Sector N". */
function nearestNamed(point, limit_m) {
  let best = null;
  let best_d = limit_m;
  for (const b of building) {
    if (!b.name) continue;
    const c = centroidOf(b.ring);
    const d = Math.hypot(c[0] - point[0], c[1] - point[1]);
    if (d < best_d) { best_d = d; best = b; }
  }
  return best;
}

function biggestBuildingIn(ring) {
  const [x0, y0, x1, y1] = bbox(ring);
  let best = null;
  for (const b of building) {
    if (!b.name) continue;
    const c = centroidOf(b.ring);
    if (c[0] < x0 || c[0] > x1 || c[1] < y0 || c[1] > y1) continue;
    if (!pointInRing(ring, c)) continue;
    if (!best || b.area > best.area) best = b;
  }
  return best;
}

const GREEN_LABEL = {
  park: "park", garden: "garden", pitch: "field", playground: "playground",
  wood: "wood", scrub: "scrub", grassland: "lawn", grass: "lawn",
  forest: "forest", meadow: "meadow", village_green: "green",
  recreation_ground: "recreation ground", water: "water",
};

const seed = JSON.parse(readFileSync(new URL("../src/asset/campus-biome.json", import.meta.url), "utf8"));
function seedBiomeAt(point) {
  for (const b of seed.biome) {
    for (const part of b.ring ?? []) {
      const ring = part.point.map(([lat, lon]) => toM(lat, lon));
      if (pointInRing(ring, point)) return b;
    }
  }
  return null;
}

const sector = unique
  .sort((a, b) => b.area - a.area)
  .map((f, index) => {
    const point = f.point;
    const built_ratio = builtRatio(f.ring);
    const cover = greenCover(f.ring, point);
    const seeded = seedBiomeAt(point);
    const host = biggestBuildingIn(f.ring);

    let name = null;
    let named_by_us = false;
    if (cover?.name) name = cover.name;
    else if (seeded) name = seeded.name;
    else if (cover) name = `The ${GREEN_LABEL[cover.tag] ?? cover.tag}`;
    else if (host?.name) name = `${host.name} grounds`;
    if (!name) {
      const near_by = nearestNamed(point, 90);
      name = near_by ? `Walk by ${near_by.name}` : `Sector ${index + 1}`;
      named_by_us = true;
    }

    /* Kind is measured, not asserted: buildings first, then a green tag, then
     * the open-ground default. `wood` is only claimed when OSM says wood. */
    /* Kind is measured, not asserted. Buildings decide first, then a green tag,
     * and open ground with no tag is called open ground rather than promoted to
     * "wood" — only OSM may say wood. */
    let kind;
    if (built_ratio >= 0.35) kind = "built";
    else if (cover && ["wood", "scrub", "forest"].includes(cover.tag)) kind = "wood";
    else if (cover && ["pitch", "playground", "recreation_ground"].includes(cover.tag)) kind = "open-field";
    else if (cover && ["garden"].includes(cover.tag)) kind = "cultivated";
    else if (cover && ["park", "grass", "grassland", "meadow", "village_green"].includes(cover.tag)) kind = "open-field";
    else if (built_ratio >= 0.12) kind = "planted-walk";
    else kind = "open-ground";

    const ring = simplify(f.ring, 1.2);

    return {
      sector_code: `s${String(index + 1).padStart(2, "0")}`,
      name,
      kind,
      area_m2: Math.round(f.area),
      built_ratio: Number(built_ratio.toFixed(3)),
      /** True only when we could not find any OSM or seed name for it. */
      is_named_by_us: named_by_us,
      /** Which OSM tag, if any, covers this face. null = bounded only by ways. */
      green_tag: cover?.tag ?? null,
      seed_biome_code: seeded?.biome_code ?? null,
      species_code: seeded?.species_code ?? [],
      label_point: toLatLon(point).map((n) => Number(n.toFixed(5))),
      point: ring.map((p) => toLatLon(p).map((n) => Number(n.toFixed(5)))),
    };
  });

/* Two faces can legitimately sit on the same named ground (the SOM grove is cut
 * in half by its own service road). Disambiguate by compass position within the
 * duplicate group rather than by a bare number, so the label still means
 * something on the ground. */
const by_name = new Map();
for (const s of sector) {
  const list = by_name.get(s.name) ?? [];
  list.push(s);
  by_name.set(s.name, list);
}
const COMPASS = ["south", "south-west", "west", "north-west", "north", "north-east", "east", "south-east"];
for (const [name, list] of by_name) {
  if (list.length < 2) continue;
  const mid_lat = list.reduce((a, s) => a + s.label_point[0], 0) / list.length;
  const mid_lon = list.reduce((a, s) => a + s.label_point[1], 0) / list.length;
  for (const s of list) {
    const dy = s.label_point[0] - mid_lat;
    const dx = s.label_point[1] - mid_lon;
    const octant = Math.round((Math.atan2(dx, dy) + Math.PI) / (Math.PI / 4)) % 8;
    s.name = `${name} (${COMPASS[octant]})`;
  }
}

const out = {
  _comment:
    "Sectors are FACES of the OSM road+path network inside the campus ring — ground bounded by real ways, " +
    "not rings we drew. Every boundary is OSM geometry under ODbL. `built_ratio` is measured by grid sampling " +
    "against 1497 OSM building footprints; `kind` follows from it plus any covering green tag. A sector with " +
    "is_named_by_us=true has no OSM or seed name and carries a number. Nothing here is a survey, and species " +
    "assignments inherited from the 09-03 seed stay provisional until the AIS inventory (due 2026-09-09).",
  generated_at: new Date().toISOString(),
  generated_by: "script/build-sector.mjs from script/fetch-osm-way.mjs",
  attribution: "Sector boundaries © OpenStreetMap contributors, ODbL",
  method: {
    bounding_way_count: near.length,
    segment_count: segment.length,
    crossing_noded: crossing,
    vertex_count: vertex.length,
    edge_count: edge_key.size,
    face_count: face.length,
    min_area_m2: MIN_AREA_M2,
    max_area_m2: MAX_AREA_M2,
    building_sampled: building.length,
  },
  sector,
};

/* Compact, not pretty-printed. This file ships in the bundle and every space
 * is a byte against the offline budget — indenting 830 coordinate pairs cost
 * more than the coordinates themselves. Read it with `node -e` or a formatter,
 * not by eye. */
writeFileSync(new URL("../src/asset/campus-sector.json", import.meta.url), JSON.stringify(out));

console.log(`\nwrote ${sector.length} sectors`);
const by_kind = {};
for (const s of sector) by_kind[s.kind] = (by_kind[s.kind] || 0) + 1;
console.log("kind:", by_kind);
console.log(`named by us: ${sector.filter((s) => s.is_named_by_us).length}`);
console.log(`with species from the seed: ${sector.filter((s) => s.species_code.length).length}`);
console.log(`total sector area: ${(sector.reduce((a, s) => a + s.area_m2, 0) / 10000).toFixed(1)} ha`);
console.log("\nlargest:");
for (const s of sector.slice(0, 14)) {
  console.log(`  ${s.sector_code}  ${String(s.area_m2).padStart(6)} m²  built ${String(Math.round(s.built_ratio * 100)).padStart(3)}%  ${s.kind.padEnd(13)} ${s.name}`);
}


/* -- 7. a stylised basemap to draw instead of raster tiles -------------------
 *
 * The play view does not use imagery. OSM's raster style bakes every kerb,
 * parking aisle and building label into the PNG, and no CSS filter removes
 * text that is already pixels -- the 09-03 note ("a lot of lines", `1:01:25`)
 * survives desaturation. So the play view renders its OWN ground from the same
 * geometry the sectors were cut from: paths as soft cream lines, buildings as
 * flat blocks, everything else green.
 *
 * The bonus is offline. A vector ground needs no tile server, which was the
 * last dependency the "works on a dead hall projector" story still carried.
 */
const shape_path = [];
for (const w of way) {
  const t = w.tags ?? {};
  if (!t.highway || !BOUNDING_HIGHWAY.has(t.highway)) continue;
  const ring = w.geometry.map((g) => toM(g.lat, g.lon));
  /* Ways OUTSIDE campus are kept too, but flagged and drawn faded.
   *
   * Cutting them entirely left the campus floating in a void, which reads as
   * isolation rather than as a boundary (owner, 09-03). Keeping them at a
   * whisper says "the city continues, you just do not play there" without
   * inviting anyone to walk into Katipunan traffic. They are simplified harder
   * than campus ways because nobody reads them closely. */
  const inside = ring.some((pt) => pointInRing(play_area, pt));
  const near_box =
    ring.some(([x, y]) => x > PLAY_BOX[0] - 260 && x < PLAY_BOX[2] + 260 && y > PLAY_BOX[1] - 260 && y < PLAY_BOX[3] + 260);
  if (!inside && !near_box) continue;
  const thin = simplify(ring, inside ? 3.0 : 7.0);
  if (thin.length < 2) continue;
  const is_road = !["footway", "path", "steps", "cycleway", "track"].includes(t.highway);
  /* Off-campus footpaths are noise at a whisper; keep only the road skeleton. */
  if (!inside && !is_road) continue;
  shape_path.push({ is_road, is_outside: !inside, point: thin.map((p) => toLatLon(p).map((n) => Number(n.toFixed(5)))) });
}

const shape_building = [];
for (const b of building) {
  /* Only what is actually on campus, and only what is big enough to read as a
   * block at walking zoom. The wider fetch box pulls in half of Katipunan; the
   * play view is a campus walk, and every kB here is a kB against the offline
   * budget. */
  if (b.area < 160) continue;
  const c = centroidOf(b.ring);
  if (!pointInRing(play_area, c)) continue;
  const thin = simplify(b.ring, 2.2);
  if (thin.length < 3) continue;
  shape_building.push({ point: thin.map((p) => toLatLon(p).map((n) => Number(n.toFixed(5)))) });
}

writeFileSync(new URL("../src/asset/campus-shape.json", import.meta.url), JSON.stringify({
  _comment:
    "The play view's own ground, so it needs no tile server: OSM ways as soft lines and OSM building " +
    "footprints as flat blocks, simplified to 2 m. Same ODbL source as the sectors. Not a survey.",
  generated_at: new Date().toISOString(),
  attribution: "Basemap geometry (c) OpenStreetMap contributors, ODbL",
  path: shape_path,
  building: shape_building,
}));
console.log(`shape: ${shape_path.length} ways (${shape_path.filter((p) => p.is_outside).length} outside), ${shape_building.length} buildings`);

#!/usr/bin/env node
/**
 * Cut the campus walkable-path network out of a sibling repo.
 *
 * Two sources, both OpenStreetMap underneath, both ODbL. The script prefers the
 * first it finds:
 *
 *   sisia  ~/Code/sisia-app/apps/campus/scripts/osm-ways.json
 *          The Overpass `out geom tags` answer for the campus bbox that powers
 *          campus.sisia.app. **Full node geometry** — every vertex OSM has,
 *          plus the way's name, surface and foot/bicycle access.
 *
 *   maphy  ~/Code/maphy/data/routing/overture/{segment,connector}-<release>.jsonl
 *          maphy's Overture Maps transportation extract for Metro Manila.
 *          maphy ingested it for *routing*, so it kept the graph and dropped the
 *          linestrings: a line here is rebuilt by joining connectors in order —
 *          exact at junctions, chorded across an unconnected curve, measured at
 *          94.9 % of Overture's declared length. Fallback, not first choice.
 *
 * Either way the output records which source it came from, and anything drawn
 * from it must credit "© OpenStreetMap contributors".
 *
 *   node script/extract-campus-path.mjs [--from sisia|maphy] [--sisia <repo>]
 *                                       [--maphy <repo>] [--out <file>]
 */
import { createReadStream, existsSync, readFileSync, writeFileSync } from "node:fs";
import { createInterface } from "node:readline";
import { homedir } from "node:os";
import { join } from "node:path";

const BOX = { north: 14.6425, south: 14.635, west: 121.074, east: 121.082 };
const MARGIN_DEGREE = 0.0015;
const WALKABLE = new Set(["footway", "path", "steps", "pedestrian", "living_street", "track", "cycleway"]);
const OVERTURE_RELEASE = "2026-08-19.0-120.900_14.400_121.200_14.800";
const EARTH_RADIUS_M = 6371008.8;

const arg = process.argv.slice(2);
const flag = (name, fallback) => {
  const i = arg.indexOf(name);
  return i === -1 ? fallback : arg[i + 1];
};
const sisia_script_dir = join(flag("--sisia", join(homedir(), "Code", "sisia-app")), "apps", "campus", "scripts");
const sisia_way_file = join(sisia_script_dir, "osm-ways.json");
const sisia_boundary_file = join(sisia_script_dir, "campus-boundary.json");
const overture_dir = join(flag("--maphy", join(homedir(), "Code", "maphy")), "data", "routing", "overture");
const out_file = flag("--out", join(process.cwd(), "src", "asset", "campus-path.json"));
const want = flag("--from", existsSync(sisia_way_file) ? "sisia" : "maphy");

const inBox = (lon, lat, margin = 0) =>
  lat >= BOX.south - margin && lat <= BOX.north + margin && lon >= BOX.west - margin && lon <= BOX.east + margin;

function metreBetween(a, b) {
  const rad = (d) => (d * Math.PI) / 180;
  const p1 = rad(a[1]);
  const p2 = rad(b[1]);
  const dp = p2 - p1;
  const dl = rad(b[0] - a[0]);
  const h = Math.sin(dp / 2) ** 2 + Math.cos(p1) * Math.cos(p2) * Math.sin(dl / 2) ** 2;
  return 2 * EARTH_RADIUS_M * Math.asin(Math.sqrt(h));
}

const drawnMetre = (line) => {
  let total = 0;
  for (let i = 0; i < line.length - 1; i += 1) total += metreBetween(line[i], line[i + 1]);
  return total;
};

async function* jsonLine(file) {
  const stream = createInterface({ input: createReadStream(file), crlfDelay: Infinity });
  for await (const row of stream) if (row) yield JSON.parse(row);
}

/** sisia keeps every OSM node, in [lat, lon] order. */
function fromSisia() {
  const way = JSON.parse(readFileSync(sisia_way_file, "utf8"));
  const feature = [];
  for (const row of way) {
    if (!WALKABLE.has(row.highway)) continue;
    const line = row.line.map(([lat, lon]) => [Number(lon.toFixed(6)), Number(lat.toFixed(6))]);
    if (line.length < 2 || !line.some((p) => inBox(p[0], p[1]))) continue;
    feature.push({
      path_id: String(row.osm_id),
      path_class: row.highway,
      path_name: row.name ?? null,
      surface: row.surface ?? null,
      length_m: Number(drawnMetre(line).toFixed(1)),
      line,
    });
  }
  return {
    source: "OpenStreetMap via ~/Code/sisia-app (campus.sisia.app) apps/campus/scripts/osm-ways.json",
    release: "Overpass `out geom tags`, campus bbox 14.632–14.647 N, 121.0725–121.0832 E",
    geometry_note:
      "Full OSM node geometry — every vertex the way has. Community mapping, not a survey, and not the ADMUNAV graph.",
    length_retained_percent: 100,
    feature,
  };
}

/** maphy keeps the routing graph; geometry is rebuilt from connectors. */
async function fromMaphy() {
  const connector = new Map();
  for await (const row of jsonLine(join(overture_dir, `connector-${OVERTURE_RELEASE}.jsonl`))) {
    if (inBox(row.lon, row.lat, MARGIN_DEGREE)) {
      connector.set(row.id, [Number(row.lon.toFixed(6)), Number(row.lat.toFixed(6))]);
    }
  }
  const feature = [];
  let declared = 0;
  let drawn = 0;
  for await (const row of jsonLine(join(overture_dir, `segment-${OVERTURE_RELEASE}.jsonl`))) {
    if (!WALKABLE.has(row.class)) continue;
    const line = row.connectors.map((c) => connector.get(c.connector_id)).filter(Boolean);
    if (line.length < 2 || !line.some((p) => inBox(p[0], p[1]))) continue;
    declared += row.length_m;
    drawn += drawnMetre(line);
    feature.push({
      path_id: row.id,
      path_class: row.class,
      path_name: null,
      surface: null,
      length_m: Number(row.length_m.toFixed(1)),
      line,
    });
  }
  return {
    source: "Overture Maps transportation, via ~/Code/maphy data/routing/overture",
    release: OVERTURE_RELEASE,
    geometry_note:
      "Lines are reconstructed by joining each segment's connectors in order — maphy ingested these files for routing and kept the graph, not the linestrings. Exact at junctions, chorded across an unconnected curve.",
    length_retained_percent: Number(((100 * drawn) / declared).toFixed(1)),
    feature,
  };
}

const cut = want === "maphy" ? await fromMaphy() : fromSisia();
const out = {
  ...cut,
  licence: "ODbL — © OpenStreetMap contributors",
  generated_on: new Date().toISOString().slice(0, 10),
  box: BOX,
  feature_count: cut.feature.length,
};
delete out.feature;
out.feature = cut.feature;
writeFileSync(out_file, `${JSON.stringify(out)}\n`);
/**
 * The campus outline, so "on campus" stops being a rectangle.
 *
 * `CAMPUS_BOX` in src/geo.ts is a bounding box we picked. The real Ateneo de
 * Manila University way is a 118-point ring, and **57 of those points fall
 * outside that box** — the box clips the campus north and east. Drawing the
 * ring makes that visible instead of implied.
 */
if (want !== "maphy" && existsSync(sisia_boundary_file)) {
  const ring = JSON.parse(readFileSync(sisia_boundary_file, "utf8"));
  const boundary = ring.map((row) => {
    const line = row.ring.map(([lat, lon]) => [Number(lon.toFixed(6)), Number(lat.toFixed(6))]);
    return {
      boundary_id: String(row.id),
      boundary_name: row.name,
      point_count: line.length,
      point_inside_box: line.filter((p) => inBox(p[0], p[1])).length,
      ring: line,
    };
  });
  const boundary_out = join(out_file, "..", "campus-boundary.json");
  writeFileSync(
    boundary_out,
    `${JSON.stringify({
      source: "OpenStreetMap via ~/Code/sisia-app (campus.sisia.app) apps/campus/scripts/campus-boundary.json",
      licence: "ODbL — © OpenStreetMap contributors",
      generated_on: new Date().toISOString().slice(0, 10),
      note: "OSM landuse rings for the four school grounds. Not a cadastral boundary, and not the restricted-grove geofence, which is ours and still approximate.",
      box: BOX,
      boundary,
    })}\n`,
  );
  const admu = boundary.find((row) => row.boundary_name === "Ateneo de Manila University");
  console.log(
    `boundary: ${boundary.length} rings → ${boundary_out}` +
      (admu ? ` (ADMU ${admu.point_inside_box}/${admu.point_count} points inside CAMPUS_BOX)` : ""),
  );
}

console.log(
  `${want}: ${cut.feature.length} walkable segments · ${Math.round(
    cut.feature.reduce((sum, row) => sum + drawnMetre(row.line), 0),
  )} m drawn · ${cut.length_retained_percent}% of true length → ${out_file}`,
);

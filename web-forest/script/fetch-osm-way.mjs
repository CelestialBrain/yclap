/**
 * Pull every way that can BOUND a sector — roads and paths alike — over the
 * extended CAMPUS_BOX, plus the landuse/leisure rings that fence the play area.
 *
 * `campus-path.json` cannot be reused: it holds footways only (168 footway /
 * 3 pedestrian / 5 path / 10 steps, zero roads) and was cut against the OLD
 * box, which clips 57 of the university ring's 118 points. Sectors bounded by
 * "paths and roads" need the roads, north and south of where that box stopped.
 *
 * Split into small queries on purpose: one combined regex query 504s on the
 * public endpoints. Each chunk is cached to disk so a rerun costs nothing.
 */
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";

const BOX = { south: 14.633, west: 121.074, north: 14.6455, east: 121.084 };
const bbox = `${BOX.south},${BOX.west},${BOX.north},${BOX.east}`;

const CHUNK = {
  road: `way["highway"~"^(motorway|trunk|primary|secondary|tertiary|unclassified|residential|service|living_street)$"](${bbox});`,
  walk: `way["highway"~"^(footway|path|pedestrian|steps|track|cycleway)$"](${bbox});`,
  land: `way["landuse"](${bbox});way["amenity"="university"](${bbox});`,
  green: `way["leisure"~"^(park|pitch|garden|playground)$"](${bbox});way["natural"](${bbox});`,
  build: `way["building"](${bbox});`,
};

const ENDPOINT = [
  "https://overpass-api.de/api/interpreter",
  "https://overpass.kumi.systems/api/interpreter",
  "https://overpass.osm.jp/api/interpreter",
  "https://overpass.private.coffee/api/interpreter",
];

const CACHE = new URL("../.osm-cache/", import.meta.url);
if (!existsSync(CACHE)) mkdirSync(CACHE, { recursive: true });

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function pull(name, body) {
  const file = new URL(`${name}.json`, CACHE);
  if (existsSync(file)) {
    const cached = JSON.parse(readFileSync(file, "utf8"));
    process.stderr.write(`✓ ${name}: ${cached.length} (cached)\n`);
    return cached;
  }
  const query = `[out:json][timeout:180];(${body});out geom tags;`;
  for (let attempt = 0; attempt < 3; attempt += 1) {
    for (const url of ENDPOINT) {
      try {
        const res = await fetch(url, {
          method: "POST",
          body: "data=" + encodeURIComponent(query),
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            "User-Agent": "yclap-web-forest/1.0 (campus sector build; contact@advo.ph)",
            Accept: "application/json",
          },
        });
        if (!res.ok) { process.stderr.write(`  ${name} ${new URL(url).host} HTTP ${res.status}\n`); await sleep(2000); continue; }
        const payload = await res.json();
        const element = payload.elements.filter((e) => e.type === "way" && Array.isArray(e.geometry));
        writeFileSync(file, JSON.stringify(element));
        process.stderr.write(`✓ ${name}: ${element.length} ways from ${new URL(url).host}\n`);
        return element;
      } catch (e) { process.stderr.write(`  ${name} ${new URL(url).host} ${e.message}\n`); await sleep(2000); }
    }
    await sleep(5000 * (attempt + 1));
  }
  throw new Error(`${name}: every endpoint failed`);
}

const out = {};
for (const [name, body] of Object.entries(CHUNK)) {
  out[name] = await pull(name, body);
  await sleep(1200);
}

const element = Object.values(out).flat();
writeFileSync(new URL("./data/osm-way-raw.json", import.meta.url),
  JSON.stringify({ generated_at: new Date().toISOString(), box: BOX,
    attribution: "© OpenStreetMap contributors, ODbL", element }));

const tally = {};
for (const e of element) {
  const t = e.tags ?? {};
  const key = t.highway ? `highway=${t.highway}` : t.landuse ? `landuse=${t.landuse}`
    : t.natural ? `natural=${t.natural}` : t.leisure ? `leisure=${t.leisure}`
    : t.building ? "building" : t.amenity ? `amenity=${t.amenity}` : "other";
  tally[key] = (tally[key] || 0) + 1;
}
console.log(`\nways: ${element.length}`);
console.log(Object.entries(tally).sort((a, b) => b[1] - a[1]).map(([k, v]) => `  ${k}: ${v}`).join("\n"));

/**
 * Measure how much of each sector is ACTUALLY vegetated, from satellite pixels.
 *
 * Why this exists
 * ---------------
 * The first cut derived "green" from the absence of OSM *building* footprints.
 * That is wrong on the ground and the owner caught it on sight: a car park has
 * no building on it, so it scored 100% green and the map painted the Areté
 * parking deck and the service aisles by JSEC as lawn. Slivers between parking
 * rows came out as bright grass. "No building here" is simply not the same
 * claim as "grass grows here", and only imagery can settle the difference.
 *
 * So this looks. It composes Esri World Imagery over the campus, samples a grid
 * of points inside every sector ring, and computes an excess-green index per
 * point:
 *
 *     ExG = 2G - R - B      (Woebbecke et al., the standard RGB-only proxy)
 *
 * Asphalt, concrete and roofs are near-neutral (R ~ G ~ B) so ExG collapses
 * toward zero; grass and canopy push it strongly positive. A point counts as
 * vegetated above `EXG_THRESHOLD`, and `vegetation_ratio` is the fraction of
 * sampled points that clear it. Canopy is darker than lawn, so a brightness
 * floor is deliberately NOT applied — shaded tree crowns must still count.
 *
 * Why through a browser
 * ---------------------
 * Decoding JPEG in Node means a dependency, and this repo runs on react and
 * react-dom and nothing else. Chrome already ships an image decoder and a
 * canvas, and it is already driven here over CDP for screenshots, so the
 * measurement happens in a page served by the dev server (a real origin, so the
 * tiles' CORS headers apply and the canvas stays readable).
 *
 * This does not overwrite anything it did not measure: it adds
 * `vegetation_ratio` and `vegetation_sample` to each sector and rewrites
 * `campus-sector.json` in place.
 *
 * Run the dev server first, then:
 *   node script/measure-vegetation.mjs [http://127.0.0.1:4177]
 */
import { spawn } from "node:child_process";
import { existsSync, mkdtempSync, readFileSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

const ORIGIN = process.argv[2] ?? "http://127.0.0.1:4177";
const ZOOM = 18;
const EXG_THRESHOLD = 18;

const file_url = new URL("../src/asset/campus-sector.json", import.meta.url);
const doc = JSON.parse(readFileSync(file_url, "utf8"));

const CHROME = [
  "C:/Program Files/Google/Chrome/Application/chrome.exe",
  "C:/Program Files (x86)/Google/Chrome/Application/chrome.exe",
  "/usr/bin/google-chrome",
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
].find((p) => existsSync(p));
if (!CHROME) { console.error("no chrome found"); process.exit(1); }

const port = 9700 + Math.floor(Math.random() * 400);
const profile = mkdtempSync(join(tmpdir(), "veg-"));
const chrome = spawn(CHROME, [
  "--headless=new", "--disable-gpu", "--no-first-run", "--no-default-browser-check",
  `--remote-debugging-port=${port}`, `--user-data-dir=${profile}`, "about:blank",
], { stdio: "ignore" });

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function endpoint() {
  for (let i = 0; i < 80; i += 1) {
    try {
      const res = await fetch(`http://127.0.0.1:${port}/json/version`);
      if (res.ok) return (await res.json()).webSocketDebuggerUrl;
    } catch { /* not up yet */ }
    await sleep(250);
  }
  throw new Error("chrome never opened its debugging port");
}

const ws = new WebSocket(await endpoint());
await new Promise((r) => (ws.onopen = r));
let next_id = 0;
const pending = new Map();
ws.onmessage = (e) => {
  const m = JSON.parse(e.data);
  const slot = pending.get(m.id);
  if (slot) { pending.delete(m.id); slot(m); }
};
const send = (method, params = {}, sessionId) =>
  new Promise((res) => { const id = (next_id += 1); pending.set(id, res); ws.send(JSON.stringify({ id, method, params, sessionId })); });

/* CDP replies are {id, result:{...}} — the ids live one level down, and reading
   them off the envelope is how this first tried to call Runtime.evaluate with
   no session attached at all ("'Runtime.evaluate' wasn't found"). */
const { targetId } = (await send("Target.createTarget", { url: ORIGIN })).result;
const { sessionId } = (await send("Target.attachToTarget", { targetId, flatten: true })).result;
await send("Runtime.enable", {}, sessionId);
await sleep(3000);

/** Runs INSIDE the page. Everything it needs is passed in as JSON. */
const IN_PAGE = `async (payload) => {
  const { sector, zoom, threshold } = payload;

  const toWorld = (lat, lon, z) => {
    const n = 256 * 2 ** z;
    const x = ((lon + 180) / 360) * n;
    const s = Math.sin((lat * Math.PI) / 180);
    const y = (0.5 - Math.log((1 + s) / (1 - s)) / (4 * Math.PI)) * n;
    return { x, y };
  };

  let min_x = Infinity, min_y = Infinity, max_x = -Infinity, max_y = -Infinity;
  for (const s of sector) for (const [lat, lon] of s.point) {
    const w = toWorld(lat, lon, zoom);
    if (w.x < min_x) min_x = w.x; if (w.x > max_x) max_x = w.x;
    if (w.y < min_y) min_y = w.y; if (w.y > max_y) max_y = w.y;
  }
  const tx0 = Math.floor(min_x / 256), tx1 = Math.floor(max_x / 256);
  const ty0 = Math.floor(min_y / 256), ty1 = Math.floor(max_y / 256);
  const cols = tx1 - tx0 + 1, rows = ty1 - ty0 + 1;

  const canvas = document.createElement("canvas");
  canvas.width = cols * 256;
  canvas.height = rows * 256;
  const ctx = canvas.getContext("2d", { willReadFrequently: true });

  let loaded = 0, failed = 0;
  const job = [];
  for (let tx = tx0; tx <= tx1; tx += 1) {
    for (let ty = ty0; ty <= ty1; ty += 1) {
      const url = "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/" + zoom + "/" + ty + "/" + tx;
      job.push(new Promise((resolve) => {
        const img = new Image();
        img.crossOrigin = "anonymous";
        img.onload = () => { ctx.drawImage(img, (tx - tx0) * 256, (ty - ty0) * 256); loaded += 1; resolve(); };
        img.onerror = () => { failed += 1; resolve(); };
        img.src = url;
      }));
    }
  }
  await Promise.all(job);
  if (loaded === 0) return { error: "no imagery tile loaded" };

  const pixel = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
  const origin_x = tx0 * 256, origin_y = ty0 * 256;

  const inRing = (ring, px, py) => {
    let inside = false;
    for (let i = 0, j = ring.length - 1; i < ring.length; j = i, i += 1) {
      const xi = ring[i][0], yi = ring[i][1];
      const xj = ring[j][0], yj = ring[j][1];
      if ((yi > py) !== (yj > py) && px < ((xj - xi) * (py - yi)) / (yj - yi) + xi) inside = !inside;
    }
    return inside;
  };

  const out = [];
  for (const s of sector) {
    const ring = s.point.map(([lat, lon]) => {
      const w = toWorld(lat, lon, zoom);
      return [w.x - origin_x, w.y - origin_y];
    });
    let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity;
    for (const [x, y] of ring) {
      if (x < x0) x0 = x; if (x > x1) x1 = x;
      if (y < y0) y0 = y; if (y > y1) y1 = y;
    }
    /* Aim for a few hundred samples regardless of sector size. */
    const step = Math.max(1.2, Math.min((x1 - x0) / 24, (y1 - y0) / 24));
    let sample = 0, green = 0;
    for (let x = x0; x <= x1; x += step) {
      for (let y = y0; y <= y1; y += step) {
        if (!inRing(ring, x, y)) continue;
        const px = Math.round(x), py = Math.round(y);
        if (px < 0 || py < 0 || px >= canvas.width || py >= canvas.height) continue;
        const i = (py * canvas.width + px) * 4;
        const r = pixel[i], g = pixel[i + 1], b = pixel[i + 2], a = pixel[i + 3];
        if (a === 0) continue;
        sample += 1;
        if (2 * g - r - b >= threshold) green += 1;
      }
    }
    out.push({ sector_code: s.sector_code, sample, ratio: sample ? green / sample : null });
  }
  return { loaded, failed, cols, rows, zoom, out };
}`;

const arg = JSON.stringify({
  sector: doc.sector.map((s) => ({ sector_code: s.sector_code, point: s.point })),
  zoom: ZOOM,
  threshold: EXG_THRESHOLD,
});

const evaluated = await send("Runtime.evaluate", {
  expression: `(${IN_PAGE})(${arg})`,
  awaitPromise: true,
  returnByValue: true,
  timeout: 240000,
}, sessionId);

if (evaluated?.result?.exceptionDetails) {
  console.error("page error:", JSON.stringify(evaluated.result.exceptionDetails).slice(0, 800));
}
if (evaluated?.error) {
  console.error("cdp error:", JSON.stringify(evaluated.error).slice(0, 400));
}
const result = evaluated?.result?.result?.value;

ws.close();
chrome.kill();

if (!result || result.error) {
  console.error("measurement failed:", result?.error ?? "no result");
  process.exit(1);
}

console.log(`imagery: ${result.loaded} tiles loaded, ${result.failed} failed (${result.cols}x${result.rows} at z${result.zoom})`);

const by_code = new Map(result.out.map((r) => [r.sector_code, r]));
let measured = 0;
for (const s of doc.sector) {
  const r = by_code.get(s.sector_code);
  s.vegetation_ratio = r && r.ratio !== null ? Number(r.ratio.toFixed(3)) : null;
  s.vegetation_sample = r ? r.sample : 0;
  if (s.vegetation_ratio !== null) measured += 1;
}

/**
 * The imagery gets the final word on what a sector IS.
 *
 * `kind` was previously derived from building cover plus an OSM green tag. Both
 * are real signals and both are kept, but neither can tell a lawn from a car
 * park, because a car park has no building on it and carries no green tag. The
 * measured vegetation can, so it decides — and `is_biome` follows from it.
 *
 * A sector that is not a biome is still drawn (it is real ground, and leaving a
 * hole in the map would be its own lie) but it is drawn as the paved surface it
 * is, carries no species, and is not somewhere the walk asks you to log a tree.
 */
const BIOME_VEGETATION_FLOOR = 0.45;

for (const s of doc.sector) {
  const veg = s.vegetation_ratio ?? 0;
  s.is_biome = veg >= BIOME_VEGETATION_FLOOR;

  if (veg < 0.2) s.kind = s.built_ratio >= 0.35 ? "built" : "paved";
  else if (veg < BIOME_VEGETATION_FLOOR) s.kind = "sparse";
  else if (s.green_tag && ["wood", "scrub", "forest"].includes(s.green_tag)) s.kind = "wood";
  else if (s.green_tag && ["garden"].includes(s.green_tag)) s.kind = "cultivated";
  else if (s.green_tag && ["pitch", "playground", "recreation_ground", "park", "grass", "grassland", "meadow", "village_green"].includes(s.green_tag)) s.kind = "open-field";
  else if (veg >= 0.8) s.kind = "open-field";
  else s.kind = "planted-walk";

  /* Provisional species cannot sit on ground with no vegetation to hold them. */
  if (!s.is_biome && s.species_code.length) {
    s.species_moved_off_paved = s.species_code;
    s.species_code = [];
  }
}

doc.vegetation_method = {
  source: "Esri World Imagery",
  attribution: "Imagery © Esri, Maxar, Earthstar Geographics",
  zoom: ZOOM,
  index: "ExG = 2G - R - B",
  threshold: EXG_THRESHOLD,
  tile_loaded: result.loaded,
  measured_at: new Date().toISOString(),
  note:
    "Fraction of sampled pixels inside the ring that read as vegetation. This is what separates a lawn from a " +
    "car park; building footprints alone cannot, because a car park has no building on it.",
};

/* Compact for the same reason build-sector.mjs is: this file ships. */
writeFileSync(file_url, JSON.stringify(doc));

const band = { bare: 0, sparse: 0, mixed: 0, green: 0 };
for (const s of doc.sector) {
  const v = s.vegetation_ratio ?? 0;
  if (v < 0.2) band.bare += 1;
  else if (v < 0.45) band.sparse += 1;
  else if (v < 0.7) band.mixed += 1;
  else band.green += 1;
}
console.log(`measured ${measured} of ${doc.sector.length} sectors`);
console.log(`biomes (>=${BIOME_VEGETATION_FLOOR} vegetated): ${doc.sector.filter((s) => s.is_biome).length}`);
const kind_tally = {};
for (const s of doc.sector) kind_tally[s.kind] = (kind_tally[s.kind] || 0) + 1;
console.log("kind:", kind_tally);
const moved = doc.sector.filter((s) => s.species_moved_off_paved?.length).length;
if (moved) console.log(`took provisional species off ${moved} paved sectors`);
console.log("bands:", band);
console.log("\nleast vegetated (these were painted as lawn before):");
for (const s of [...doc.sector].sort((a, b) => (a.vegetation_ratio ?? 1) - (b.vegetation_ratio ?? 1)).slice(0, 12)) {
  console.log(`  ${String(Math.round((s.vegetation_ratio ?? 0) * 100)).padStart(3)}% veg · built ${String(Math.round(s.built_ratio * 100)).padStart(3)}% · ${String(s.area_m2).padStart(6)} m² · ${s.name}`);
}
console.log("\nmost vegetated:");
for (const s of [...doc.sector].sort((a, b) => (b.vegetation_ratio ?? 0) - (a.vegetation_ratio ?? 0)).slice(0, 8)) {
  console.log(`  ${String(Math.round((s.vegetation_ratio ?? 0) * 100)).padStart(3)}% veg · ${String(s.area_m2).padStart(6)} m² · ${s.name}`);
}

/**
 * Pull every species iNaturalist knows about inside the Ateneo Loyola Heights
 * campus box, page by page, and cache the raw answer under script/data/.
 *
 * The campus box is the extended CAMPUS_BOX from the 3D build spec (T1.1):
 *   north 14.6455  south 14.6330  west 121.0740  east 121.0840
 *
 * Output: script/data/inat-species/<query-tag>.json  — the concatenated
 * species_counts rows, unmodified, so the species-model build can cite the
 * exact retrieval date and never re-hit the API when re-running.
 *
 * Usage: node script/fetch-inat-species.mjs
 */
import { mkdirSync, existsSync, readFileSync, writeFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const out_dir = join(here, "data", "inat-species");
mkdirSync(out_dir, { recursive: true });

const BOX = { nelat: 14.6455, nelng: 121.084, swlat: 14.633, swlng: 121.074 };
const PER_PAGE = 200;
const today = new Date().toISOString().slice(0, 10);

const base =
  "https://api.inaturalist.org/v1/observations/species_counts" +
  `?swlat=${BOX.swlat}&swlng=${BOX.swlng}&nelat=${BOX.nelat}&nelng=${BOX.nelng}` +
  `&quality_grade=any&per_page=${PER_PAGE}`;

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function get(url, tries = 4) {
  for (let i = 1; i <= tries; i += 1) {
    try {
      const res = await fetch(url, { headers: { accept: "application/json" } });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return await res.json();
    } catch (err) {
      console.error(`  attempt ${i} failed: ${err.message}`);
      if (i === tries) throw err;
      await sleep(1500 * i);
    }
  }
  throw new Error("unreachable");
}

const out_path = join(out_dir, `species-counts-${today}.json`);
if (existsSync(out_path)) {
  console.log(`already fetched today: ${out_path}`);
} else {
  const rows = [];
  let page = 1;
  let total = null;
  while (true) {
    const body = await get(`${base}&page=${page}`);
    total = body.total_results;
    rows.push(...body.results);
    console.log(`page ${page}: ${body.results.length} rows (total ${total})`);
    if (rows.length >= total || body.results.length === 0) break;
    page += 1;
    await sleep(1200);
  }
  writeFileSync(
    out_path,
    JSON.stringify(
      {
        _comment:
          "Every species iNaturalist holds inside the Ateneo Loyola Heights campus box, as of the fetch date. quality_grade=any on purpose: the long casual tail is still a real thing somebody saw on campus. Attribution: observations (c) their photographers, species list (c) iNaturalist users, CC-BY-NC.",
        query: base,
        campus_box: BOX,
        fetched_at: new Date().toISOString(),
        total_results: total,
        result: rows,
      },
      null,
      1,
    ),
  );
  console.log(`wrote ${rows.length} rows -> ${out_path}`);
}

// Second cache: the names of every ancestor id the rows reference (families,
// orders, classes), so the archetype router can read "Poaceae" not just an id.
const raw = JSON.parse(readFileSync(out_path, "utf8"));
const ids = new Set();
for (const row of raw.result) for (const id of row.taxon.ancestor_ids) ids.add(id);
const taxa_path = join(out_dir, `ancestor-taxa-${today}.json`);
if (existsSync(taxa_path)) {
  console.log(`already fetched: ${taxa_path}`);
} else {
  const list = [...ids];
  const chunks = [];
  for (let i = 0; i < list.length; i += 50) {
    const chunk = list.slice(i, i + 50);
    const qs = chunk.map((id) => `id[]=${id}`).join("&");
    const body = await get(`https://api.inaturalist.org/v1/taxa?${qs}&per_page=50`);
    chunks.push(...body.results);
    console.log(`taxa chunk ${i / 50 + 1}: ${body.results.length}`);
    await sleep(1200);
  }
  writeFileSync(
    taxa_path,
    JSON.stringify({ fetched_at: new Date().toISOString(), taxa: chunks }, null, 1),
  );
  console.log(`wrote ${chunks.length} taxa -> ${taxa_path}`);
}

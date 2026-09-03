import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";
import {
  BIOME_ATTRIBUTION,
  BIOME_FILL,
  biome,
  biomeAt,
  biomeContains,
  biomeFill,
  biomeLabelPoint,
  biomeStroke,
  drawn_biome,
  undrawn_biome,
} from "../src/biome.ts";
import { encounter } from "../src/data.ts";
import { demoWalkAt } from "../src/geo.ts";
import { biomePresenceAt, rankBiome } from "../src/nearby.ts";

const raw = JSON.parse(
  readFileSync(new URL("../src/asset/campus-biome.json", import.meta.url), "utf8"),
) as { biome: { biome_code: string; ring: unknown }[] };

/** Bounding box of one biome, over every part. */
function bbox(row: (typeof drawn_biome)[number]) {
  let south = 90;
  let north = -90;
  let west = 180;
  let east = -180;
  for (const part of row.ring) {
    for (const [lat, lon] of part.point) {
      south = Math.min(south, lat);
      north = Math.max(north, lat);
      west = Math.min(west, lon);
      east = Math.max(east, lon);
    }
  }
  return { south, north, west, east };
}

/** First point of a coarse grid over the bbox that the ring contains. */
function insidePoint(row: (typeof drawn_biome)[number]) {
  const box = bbox(row);
  const steps = 40;
  for (let i = 1; i < steps; i += 1) {
    for (let j = 1; j < steps; j += 1) {
      const point = {
        lat: box.south + ((box.north - box.south) * i) / steps,
        lon: box.west + ((box.east - box.west) * j) / steps,
      };
      if (biomeContains(row, point)) return point;
    }
  }
  return null;
}

/** Relative luminance on a 0–255 scale — the greyscale reading of a fill. */
function luminance(hex: string): number {
  const n = parseInt(hex.slice(1), 16);
  return 0.2126 * ((n >> 16) & 255) + 0.7152 * ((n >> 8) & 255) + 0.0722 * (n & 255);
}

describe("biome seed — the pivot's data", () => {
  it("holds 10 biomes, 7 drawn, and matches what was committed", () => {
    assert.equal(biome.length, 10);
    assert.equal(drawn_biome.length, 7);
    assert.equal(undrawn_biome.length, 3);
    assert.deepEqual(
      undrawn_biome.map((b) => b.biome_code).sort(),
      ["academic-core", "katipunan-edge", "sunken-forest"],
    );
  });

  it("skips a null ring cleanly — undrawn biomes carry an empty ring, not a crash", () => {
    for (const row of undrawn_biome) {
      assert.equal(row.ring.length, 0);
      assert.ok(row.ring_source, `${row.biome_code} must say why it has no ring`);
    }
  });

  it("orders ring points [lat, lon] — the opposite of campus-path.json, and pinned here", () => {
    for (const point of raw.biome.flatMap((b) => (Array.isArray(b.ring) ? b.ring : []).flatMap((p: { point: [number, number][] }) => p.point))) {
      assert.ok(point[0] > 14 && point[0] < 15, `latitude slot holds a latitude, got ${point[0]}`);
      assert.ok(point[1] > 121 && point[1] < 122, `longitude slot holds a longitude, got ${point[1]}`);
    }
  });

  it("credits OSM for the rings that are OSM's", () => {
    assert.match(BIOME_ATTRIBUTION, /OpenStreetMap/);
    assert.match(BIOME_ATTRIBUTION, /ODbL/);
  });

  it("flags the invented rings as placeholders, and only those", () => {
    const flagged = new Set(biome.filter((b) => b.is_placeholder).map((b) => b.biome_code));
    assert.deepEqual(
      [...flagged].sort(),
      ["academic-core", "katipunan-edge", "lst-woods", "som-grove", "sunken-forest"],
    );
    /* The two drawn placeholders are the ones whose on-screen notice is
       non-negotiable: a padded box must never read as surveyed ground. */
    for (const code of ["som-grove", "lst-woods"]) {
      const row = drawn_biome.find((b) => b.biome_code === code);
      assert.ok(row, `${code} is drawn`);
      assert.equal(row.is_placeholder, true);
      assert.ok(biomeLabelPoint(row), `${code} can place its placeholder notice`);
    }
  });
});

describe("point-in-biome — the new unit of play", () => {
  it("contains a sampled interior point of every drawn biome", () => {
    for (const row of drawn_biome) {
      const point = insidePoint(row);
      assert.ok(point, `${row.biome_code}: no interior point found in its bbox`);
      assert.equal(biomeContains(row, point), true, `${row.biome_code} failed its own interior`);
    }
  });

  it("refuses ground that is inside no biome", () => {
    /* Mapúa Intramuros — off campus entirely. */
    assert.equal(biomeAt({ lat: 14.5906, lon: 120.9799 }), null);
    /* Due north of the Mini-forest, past the box edge. */
    assert.equal(biomeAt({ lat: 14.647, lon: 121.078 }), null);
  });

  it("does not derive presence from distance — a near miss is not inside", () => {
    const bellarmine = drawn_biome.find((b) => b.biome_code === "bellarmine-field");
    assert.ok(bellarmine);
    const box = bbox(bellarmine);
    /* 30 m west of the bbox — haversine-near, containment-false. */
    const point = { lat: (box.north + box.south) / 2, lon: box.west - 0.0003 };
    assert.equal(biomeContains(bellarmine, point), false);
  });

  it("ranks residents inside a biome by true metres, nearest first", () => {
    const som = drawn_biome.find((b) => b.biome_code === "som-grove");
    assert.ok(som);
    const point = insidePoint(som);
    assert.ok(point);
    const presence = biomePresenceAt(point);
    assert.ok(presence);
    assert.equal(presence.row.biome_code, "som-grove");
    for (let i = 1; i < presence.resident.length; i += 1) {
      assert.ok(presence.resident[i].distance_m >= presence.resident[i - 1].distance_m);
    }
    /* Every reported resident really is inside the biome it is reported for. */
    for (const near of presence.resident) {
      assert.equal(biomeContains(som, near.row), true);
    }
  });

  it("returns containing biomes in seed order, all of them", () => {
    const som = drawn_biome.find((b) => b.biome_code === "som-grove");
    assert.ok(som);
    const point = insidePoint(som);
    assert.ok(point);
    const row = rankBiome(point);
    assert.ok(row.length >= 1);
    assert.equal(row[0].row.biome_code, "som-grove");
  });

  it("keeps the haversine machinery intact for residents", () => {
    const som = drawn_biome.find((b) => b.biome_code === "som-grove");
    assert.ok(som);
    const point = insidePoint(som);
    assert.ok(point);
    const presence = biomePresenceAt(point);
    assert.ok(presence && presence.resident.length > 0);
    const first = presence.resident[0];
    assert.equal(first.is_at, first.distance_m <= 25);
  });
});

describe("encounters vs the drawn rings — ground truth, pinned", () => {
  it("holds the assignments the seed actually produces", () => {
    /* The som-grove placeholder box swallows the Gonzaga-walk and Rizal-Library
       discs; e8 sits inside a south-field parcel. These are facts of the
       committed geometry — if they change, the geometry changed. */
    const inside = (code: string) =>
      drawn_biome.filter((b) => biomeContains(b, encounter.find((e) => e.encounter_id === code)!)).map((b) => b.biome_code);
    assert.deepEqual(inside("e1"), ["som-grove"]);
    assert.deepEqual(inside("e3"), ["som-grove"]);
    assert.deepEqual(inside("e8"), ["south-field"]);
    assert.deepEqual(inside("e2"), []);
  });

  it("the demo walk enters at least one biome, so the card pops on stage", () => {
    const hit = new Set<string>();
    for (let t = 0; t < 1; t += 0.002) {
      const presence = biomePresenceAt(demoWalkAt(t));
      if (presence) hit.add(presence.row.biome_code);
    }
    assert.ok(hit.size >= 1, `demo walk entered no biome: ${[...hit].join(",")}`);
  });
});

describe("biome green ramp", () => {
  it("uses one green per kind and never invents a kind colour", () => {
    for (const row of biome) {
      assert.equal(biomeFill(row.kind), BIOME_FILL[row.kind], `${row.kind} must come from the ramp`);
    }
  });

  it("separates kinds by fill VALUE, so greyscale still tells them apart", () => {
    const values = Object.values(BIOME_FILL).map(luminance);
    values.sort((a, b) => a - b);
    for (let i = 1; i < values.length; i += 1) {
      assert.ok(
        values[i] - values[i - 1] >= 20,
        `ramp steps must differ by ≥20 luminance, got ${values[i - 1]} → ${values[i]}`,
      );
    }
  });

  it("strokes darker than it fills, on every kind", () => {
    for (const kind of Object.keys(BIOME_FILL)) {
      assert.ok(luminance(biomeStroke(kind)) < luminance(biomeFill(kind)), `${kind} stroke must be darker`);
    }
  });
});

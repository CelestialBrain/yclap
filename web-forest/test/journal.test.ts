import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  summarize,
  toCsv,
  toGeoJson,
  trackMeter,
  walkReceipt,
  nextEntryIndex,
  withEntryIndex,
  type Sighting,
  type Walk,
  type WalkFix,
} from "../src/journal.ts";
import { sector } from "../src/sector.ts";
import { picker_order, journal_order } from "../src/data.ts";
import { distanceMeter } from "../src/geo.ts";

function make(over: Partial<Sighting>): Sighting {
  return {
    sighting_id: "narra-1",
    species_code: "narra",
    photo_data: null,
    created_at: "2026-09-02T01:00:00.000Z",
    inat_scientific_name: null,
    inat_common_name: null,
    lat: null,
    lon: null,
    accuracy_m: null,
    fix_source: null,
    note: null,
    walk_id: null,
    entry_kind: "badge",
    reported_name: null,
    entry_index: 1,
    ...over,
  };
}

const row: Sighting[] = [
  make({ sighting_id: "a", species_code: "narra", lat: 14.64, lon: 121.078, accuracy_m: 8, fix_source: "gps" }),
  make({ sighting_id: "b", species_code: "narra", created_at: "2026-09-03T02:00:00.000Z", photo_data: "data:image/jpeg;base64,xx" }),
  make({ sighting_id: "c", species_code: "molave", lat: 14.641, lon: 121.079, accuracy_m: 5, fix_source: "demo", note: "beside the walk" }),
];

describe("summarize", () => {
  it("counts sightings, species, located and photo rows", () => {
    const s = summarize(row);
    assert.equal(s.sighting_count, 3);
    assert.equal(s.species_count, 2);
    assert.equal(s.located_count, 2);
    assert.equal(s.photo_count, 1);
    assert.equal(s.day_count, 2);
  });

  it("groups by species, biggest first", () => {
    const s = summarize(row);
    assert.deepEqual(s.by_species, [
      { key: "narra", count: 2 },
      { key: "molave", count: 1 },
    ]);
  });

  it("groups by day and reports the span", () => {
    const s = summarize(row);
    assert.deepEqual(
      s.by_day.map((d) => d.key).sort(),
      ["2026-09-02", "2026-09-03"],
    );
    assert.equal(s.first_at, "2026-09-02T01:00:00.000Z");
    assert.equal(s.last_at, "2026-09-03T02:00:00.000Z");
  });

  it("exposes no rank, score, streak or points field", () => {
    const key = Object.keys(summarize(row));
    for (const banned of ["rank", "score", "point", "points", "streak", "level", "xp"]) {
      assert.equal(key.includes(banned), false, `summary must not carry a ${banned}`);
    }
  });

  it("handles an empty journal", () => {
    const s = summarize([]);
    assert.equal(s.sighting_count, 0);
    assert.equal(s.first_at, null);
    assert.deepEqual(s.by_species, []);
  });
});

describe("toGeoJson", () => {
  it("emits only located rows, lon-first, with the source of the fix", () => {
    const fc = toGeoJson(row);
    assert.equal(fc.type, "FeatureCollection");
    assert.equal(fc.features.length, 2);
    const first = fc.features[0];
    assert.deepEqual(first.geometry.coordinates, [121.078, 14.64]);
    assert.equal(first.properties.fix_source, "gps");
    assert.equal(fc.features[1].properties.note, "beside the walk");
  });

  it("never carries a photo data-URL into the export", () => {
    const text = JSON.stringify(toGeoJson([...row, make({ sighting_id: "d", lat: 14.64, lon: 121.078, photo_data: "data:image/jpeg;base64,zz" })]));
    assert.equal(text.includes("base64"), false);
  });

  it("returns an empty collection when nothing has a position", () => {
    assert.deepEqual(toGeoJson([make({})]).features, []);
  });
});

/**
 * Column INDEX is not the rule — the column's presence and its emptiness are.
 * These read the header and look the cell up by name, so adding a field (as the
 * biome pivot added `entry_kind` / `reported_name`) cannot silently pass a test
 * that was really asserting "lat happens to be 5th".
 */
function cellOf(csv: string, line_index: number, column: string): string {
  const line = csv.split("\n");
  const at = line[0].split(",").indexOf(column);
  assert.notEqual(at, -1, `CSV has no ${column} column`);
  return line[line_index].split(",")[at];
}

describe("toCsv", () => {
  it("writes a header plus one line per sighting", () => {
    const line = toCsv(row).split("\n");
    assert.equal(line.length, 4);
    assert.equal(line[0].split(",")[0], "sighting_id");
    for (const column of ["species_code", "created_at", "lat", "lon"]) {
      assert.ok(line[0].split(",").includes(column), `header is missing ${column}`);
    }
  });

  it("quotes a note containing a comma or a quote", () => {
    const csv = toCsv([make({ note: 'flowering, and "tall"' })]);
    assert.ok(csv.includes('"flowering, and ""tall"""'));
  });

  it("leaves a missing position empty rather than writing a zero", () => {
    const csv = toCsv([make({})]);
    assert.equal(cellOf(csv, 1, "lat"), "");
    assert.equal(cellOf(csv, 1, "lon"), "");
    assert.equal(cellOf(csv, 1, "accuracy_m"), "");
  });

  it("writes a position that IS present", () => {
    const csv = toCsv([make({ lat: 14.64, lon: 121.078 })]);
    assert.equal(cellOf(csv, 1, "lat"), "14.64");
    assert.equal(cellOf(csv, 1, "lon"), "121.078");
  });
});

/* ── walk receipt ─────────────────────────────────────────────────────────
 *
 * A walk that ends with nothing on screen is a stop, not a walk. These assert
 * the receipt is computed from the recorded trail rather than estimated, and
 * that it stays inside the same no-ranking rule the journal summary follows.
 */

/** A sector we know exists, with a point guaranteed to be inside it. */
const a_sector = sector.find((s) => s.is_biome)!;
const b_sector = sector.find((s) => s.is_biome && s.sector_code !== a_sector.sector_code)!;

function fixAt(lat: number, lon: number, at: number, source: "gps" | "demo" = "gps"): WalkFix {
  return { lat, lon, at, source };
}

function walkOf(over: Partial<Walk> = {}): Walk {
  return {
    walk_id: "walk-1",
    started_at: "2026-09-05T01:00:00.000Z",
    ended_at: null,
    track: [],
    ...over,
  };
}

describe("trackMeter", () => {
  it("is the haversine sum of the trail, not the straight line end to end", () => {
    /* Out 0.001° north then back — a real walker covers both legs. */
    const there = fixAt(14.6386, 121.0785, 1);
    const away = fixAt(14.6396, 121.0785, 2);
    const back = fixAt(14.6386, 121.0785, 3);
    const one_leg = distanceMeter(there, away);
    assert.ok(Math.abs(trackMeter([there, away, back]) - one_leg * 2) < 0.5);
    /* The straight line from first to last is zero. The trail is not. */
    assert.ok(trackMeter([there, away, back]) > 200);
  });

  it("is zero for a trail too short to measure", () => {
    assert.equal(trackMeter([]), 0);
    assert.equal(trackMeter([fixAt(14.6386, 121.0785, 1)]), 0);
  });
});

describe("walkReceipt", () => {
  it("counts species seen on this walk and which were new to the journal", () => {
    const journal = [
      make({ sighting_id: "old", species_code: "narra", walk_id: null }),
      make({ sighting_id: "x", species_code: "narra", walk_id: "walk-1" }),
      make({ sighting_id: "y", species_code: "molave", walk_id: "walk-1" }),
      make({ sighting_id: "z", species_code: "teak", walk_id: "walk-other" }),
    ];
    const got = walkReceipt(walkOf(), journal);
    assert.deepEqual(got.species_code.sort(), ["molave", "narra"]);
    assert.equal(got.species_count, 2);
    /* Narra was already in the journal before this walk; molave was not. */
    assert.deepEqual(got.new_species_code, ["molave"]);
    assert.equal(got.new_species_count, 1);
  });

  it("names the sectors the trail actually passed through, in entry order", () => {
    const [a_lat, a_lon] = a_sector.label_point;
    const [b_lat, b_lon] = b_sector.label_point;
    const got = walkReceipt(
      walkOf({ track: [fixAt(a_lat, a_lon, 1), fixAt(b_lat, b_lon, 2), fixAt(a_lat, a_lon, 3)] }),
      [],
    );
    assert.deepEqual(got.sector_code, [a_sector.sector_code, b_sector.sector_code]);
    assert.equal(got.sector_count, 2);
    for (const code of got.sector_code) {
      assert.ok(sector.some((s) => s.sector_code === code), `${code} is not a real sector`);
    }
  });

  it("says the distance is unknown rather than printing a confident zero", () => {
    const got = walkReceipt(walkOf({ track: [] }), []);
    assert.equal(got.is_distance_unknown, true);
    assert.equal(got.distance_meter, 0);

    const walked = walkReceipt(
      walkOf({ track: [fixAt(14.6386, 121.0785, 1), fixAt(14.6396, 121.0785, 2)] }),
      [],
    );
    assert.equal(walked.is_distance_unknown, false);
    assert.ok(walked.distance_meter > 100);
  });

  it("admits on the receipt when the demo loop drove the walk", () => {
    const demo = walkReceipt(walkOf({ track: [fixAt(14.6386, 121.0785, 1, "demo")] }), []);
    assert.equal(demo.fix_source, "demo");
    assert.equal(demo.is_demo, true);

    const real = walkReceipt(walkOf({ track: [fixAt(14.6386, 121.0785, 1, "gps")] }), []);
    assert.equal(real.is_demo, false);
  });

  it("reports elapsed minutes from the two timestamps", () => {
    const got = walkReceipt(walkOf(), [], "2026-09-05T01:37:00.000Z");
    assert.equal(got.elapsed_minute, 37);
  });

  it("carries no rank, score, streak, points, level or xp — at any depth", () => {
    const got = walkReceipt(
      walkOf({ track: [fixAt(14.6386, 121.0785, 1)] }),
      [make({ walk_id: "walk-1" })],
    );
    /* Deliberately deeper and stricter than the shallow key check above: this
       walks the whole serialized object, so a nested `{ rank: 3 }` cannot slip
       past the way it could through Object.keys on the top level alone. */
    const banned = ["rank", "score", "point", "points", "streak", "level", "xp", "leaderboard"];
    const walkKey = (value: unknown, path: string): void => {
      if (!value || typeof value !== "object") return;
      for (const [key, child] of Object.entries(value)) {
        assert.equal(
          banned.includes(key),
          false,
          `walk receipt must not carry a ${key} (at ${path}.${key})`,
        );
        walkKey(child, `${path}.${key}`);
      }
    };
    walkKey(got, "receipt");
  });
});

describe("seen of total", () => {
  it("counts against the curated list, not the padded journal grid", () => {
    const got = summarize([make({ species_code: "narra" }), make({ species_code: "molave" })]);
    assert.equal(got.species_count, 2);
    assert.equal(got.species_total, picker_order.length);
    /* The grid pads with empty slots to fill a row. Those are not findable
       species and must never inflate the denominator. */
    assert.ok(journal_order.length > picker_order.length);
    assert.notEqual(got.species_total, journal_order.length);
  });

  it("reads n of N where N is the real starter list", () => {
    const got = summarize([make({ species_code: "narra" })]);
    assert.equal(`${got.species_count} of ${got.species_total} species seen`, "1 of 9 species seen");
  });

  it("still exposes no rank, score, streak or points field", () => {
    const key = Object.keys(summarize([make({})]));
    for (const banned of ["rank", "score", "point", "points", "streak", "level", "xp"]) {
      assert.equal(key.includes(banned), false, `summary must not carry a ${banned}`);
    }
  });
});

describe("stable catalogue number", () => {
  it("never reuses a number, even after the highest entry is deleted", () => {
    const row = [make({ sighting_id: "a", entry_index: 1 }), make({ sighting_id: "b", entry_index: 2 })];
    assert.equal(nextEntryIndex(row), 3);
    const after_delete = row.filter((s) => s.sighting_id !== "b");
    /* Naive length+1 would hand out 2 again and two entries would share a
       number. The highest ever issued is what matters. */
    assert.equal(nextEntryIndex(after_delete), 2);
    assert.equal(nextEntryIndex([]), 1);
  });

  it("does not renumber surviving entries when an earlier one is deleted", () => {
    const row = [
      make({ sighting_id: "a", entry_index: 1 }),
      make({ sighting_id: "b", entry_index: 2 }),
      make({ sighting_id: "c", entry_index: 3 }),
    ];
    const after = withEntryIndex(row.filter((s) => s.sighting_id !== "a"));
    assert.deepEqual(after.map((s) => s.entry_index), [2, 3]);
  });

  it("backfills legacy rows from their fixed stored position, and is idempotent", () => {
    const legacy = [
      make({ sighting_id: "a", entry_index: 0 }),
      make({ sighting_id: "b", entry_index: 0 }),
    ];
    const once = withEntryIndex(legacy);
    assert.deepEqual(once.map((s) => s.entry_index), [1, 2]);
    assert.deepEqual(withEntryIndex(once).map((s) => s.entry_index), [1, 2]);
  });

  it("leaves already-numbered rows alone while filling the gaps around them", () => {
    const mixed = [
      make({ sighting_id: "a", entry_index: 5 }),
      make({ sighting_id: "b", entry_index: 0 }),
    ];
    assert.deepEqual(withEntryIndex(mixed).map((s) => s.entry_index), [5, 6]);
  });
});

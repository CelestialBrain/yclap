import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { summarize, toCsv, toGeoJson, type Sighting } from "../src/journal.ts";

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

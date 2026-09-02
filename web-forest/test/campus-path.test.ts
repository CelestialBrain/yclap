import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";
import { CAMPUS_BOX, distanceMeter } from "../src/geo.ts";

interface PathFeature {
  path_id: string;
  path_class: string;
  length_m: number;
  line: [number, number][];
}

const data = JSON.parse(readFileSync(new URL("../src/asset/campus-path.json", import.meta.url), "utf8")) as {
  source: string;
  release: string;
  licence: string;
  box: typeof CAMPUS_BOX;
  geometry_note: string;
  length_retained_percent: number;
  feature_count: number;
  feature: PathFeature[];
};

const WALKABLE = new Set(["footway", "path", "steps", "pedestrian", "living_street", "track", "cycleway"]);

describe("campus path — the walkable network cut from a sibling repo", () => {
  it("carries its provenance and its ODbL credit", () => {
    assert.match(data.source, /sisia|maphy/, "the file must name the sibling repo it was cut from");
    assert.match(data.source, /OpenStreetMap|Overture/);
    assert.match(data.licence, /ODbL/);
    assert.match(data.licence, /OpenStreetMap/);
  });

  it("says what the geometry is, and never implies a survey", () => {
    assert.match(data.geometry_note, /survey|connector/i);
    assert.doesNotMatch(data.geometry_note, /surveyed by us|our survey/i);
    assert.ok(data.length_retained_percent > 90 && data.length_retained_percent <= 100);
  });

  it("has a feature count that matches the declared one", () => {
    assert.equal(data.feature.length, data.feature_count);
    assert.ok(data.feature.length > 0);
  });

  it("only carries classes a student can actually walk", () => {
    for (const row of data.feature) assert.ok(WALKABLE.has(row.path_class), `${row.path_class} is not walkable`);
  });

  it("draws every line with at least two points, each near the campus box", () => {
    const margin = 0.002;
    for (const row of data.feature) {
      assert.ok(row.line.length >= 2, `${row.path_id} has ${row.line.length} point`);
      for (const [lon, lat] of row.line) {
        assert.ok(lat >= CAMPUS_BOX.south - margin && lat <= CAMPUS_BOX.north + margin, `${lat} outside box`);
        assert.ok(lon >= CAMPUS_BOX.west - margin && lon <= CAMPUS_BOX.east + margin, `${lon} outside box`);
      }
    }
  });

  it("touches the campus box with at least one point per feature", () => {
    for (const row of data.feature) {
      const inside = row.line.some(
        ([lon, lat]) =>
          lat >= CAMPUS_BOX.south && lat <= CAMPUS_BOX.north && lon >= CAMPUS_BOX.west && lon <= CAMPUS_BOX.east,
      );
      assert.ok(inside, `${row.path_id} never enters the campus box`);
    }
  });

  it("draws close to the length Overture declares — the chording stays bounded", () => {
    let drawn = 0;
    let declared = 0;
    for (const row of data.feature) {
      declared += row.length_m;
      for (let i = 0; i < row.line.length - 1; i += 1) {
        drawn += distanceMeter(
          { lat: row.line[i][1], lon: row.line[i][0] },
          { lat: row.line[i + 1][1], lon: row.line[i + 1][0] },
        );
      }
    }
    const percent = (100 * drawn) / declared;
    assert.ok(percent > 90, `only ${percent.toFixed(1)}% of declared length is drawn`);
    assert.ok(Math.abs(percent - data.length_retained_percent) < 0.5, "the stated retention no longer matches");
  });
});

const boundary_data = JSON.parse(
  readFileSync(new URL("../src/asset/campus-boundary.json", import.meta.url), "utf8"),
) as {
  source: string;
  licence: string;
  note: string;
  boundary: { boundary_id: string; boundary_name: string; point_count: number; point_inside_box: number; ring: [number, number][] }[];
};

describe("campus boundary — the real outline, not our rectangle", () => {
  it("credits OSM and refuses to pass itself off as cadastral or as the geofence", () => {
    assert.match(boundary_data.licence, /ODbL/);
    assert.match(boundary_data.note, /[Nn]ot a cadastral boundary/);
    assert.match(boundary_data.note, /restricted/i);
  });

  it("carries a closed ring per ground, university included", () => {
    assert.ok(boundary_data.boundary.length >= 1);
    for (const row of boundary_data.boundary) {
      assert.equal(row.ring.length, row.point_count);
      assert.ok(row.ring.length >= 3, `${row.boundary_name} is not a ring`);
    }
    const admu = boundary_data.boundary.find((row) => row.boundary_name === "Ateneo de Manila University");
    assert.ok(admu, "the university ring must be present");
  });

  it("records that CAMPUS_BOX clips the campus, rather than hiding it", () => {
    const admu = boundary_data.boundary.find((row) => row.boundary_name === "Ateneo de Manila University");
    assert.ok(admu);
    assert.ok(
      admu.point_inside_box < admu.point_count,
      "if the whole ring ever fits the box, widen this test rather than deleting it",
    );
  });
});

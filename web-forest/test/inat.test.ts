import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";
import {
  campusCodeForScientific,
  loadInatNearby,
  mapNearbyObservation,
  mapScoreImage,
  nearbyObservationUrl,
  scoreImageUrl,
  scorePlantImage,
  type InatObservation,
} from "../src/inat.ts";

const dir = dirname(fileURLToPath(import.meta.url));
const nearby_path = join(dir, "fixture/nearby-observation.json");
const score_path = join(dir, "fixture/score-image.json");
const png_path = join(dir, "fixture/pterocarpus-indicus.png");

const nearby_body = JSON.parse(readFileSync(nearby_path, "utf8")) as {
  results: InatObservation[];
};
const score_body = JSON.parse(readFileSync(score_path, "utf8")) as {
  results: { taxon?: { name?: string }; combined_score?: number }[];
};
const plant_png = readFileSync(png_path);

describe("mapNearbyObservation", () => {
  it("ranks campus scientific names first, collapses duplicate taxa, caps at five, and keeps required fields", () => {
    const nearby = mapNearbyObservation(nearby_body.results);
    assert.ok(nearby.length <= 5);
    assert.ok(nearby.length >= 1);

    const campus_first = nearby.filter((row) => row.is_campus_species);
    const rest = nearby.filter((row) => !row.is_campus_species);
    assert.ok(campus_first.length >= 1);
    assert.equal(
      nearby.slice(0, campus_first.length).every((row) => row.is_campus_species),
      true,
    );
    if (rest.length) {
      assert.equal(nearby[campus_first.length]?.is_campus_species, false);
    }

    const taxon_key = nearby.map((row) => row.scientific_name.toLowerCase());
    assert.equal(taxon_key.length, new Set(taxon_key).size);

    const saman_count = nearby_body.results.filter(
      (row) => row.taxon?.name === "Samanea saman",
    ).length;
    assert.ok(saman_count >= 2, "fixture must include a duplicate taxon");
    assert.equal(nearby.filter((row) => row.scientific_name === "Samanea saman").length, 1);

    const campus_name = nearby_body.results
      .map((row) => row.taxon?.name?.trim() ?? "")
      .find((name) => name === "Pterocarpus indicus");
    assert.equal(campus_name, "Pterocarpus indicus");
    assert.equal(nearby[0]?.scientific_name, campus_name);
    assert.equal(nearby[0]?.is_campus_species, true);

    for (const row of nearby) {
      assert.equal(typeof row.observation_id, "number");
      assert.ok(row.common_name.length > 0);
      assert.ok(row.scientific_name.length > 0);
      assert.ok(row.quality_grade.length > 0);
      assert.ok(row.url.length > 0);
    }

    const skipped_empty = nearby.some((row) => row.scientific_name === "");
    assert.equal(skipped_empty, false);
  });
});

describe("mapScoreImage", () => {
  it("reads scientific_name from taxon.name and a numeric score from the fixture CV JSON", () => {
    const suggestion = mapScoreImage(score_body);
    assert.ok(suggestion.length >= 1);
    const expected_name = score_body.results[0]?.taxon?.name;
    assert.ok(typeof expected_name === "string" && expected_name.length > 0);
    assert.equal(suggestion[0]?.scientific_name, expected_name);
    assert.equal(typeof suggestion[0]?.score, "number");
    assert.ok(Number.isFinite(suggestion[0]!.score));
    assert.equal(suggestion[0]?.rank, 1);
    assert.equal(campusCodeForScientific(expected_name!), "narra");
  });
});

describe("scorePlantImage", () => {
  it("POSTs the plant PNG to score_image and maps the recorded CV JSON", async () => {
    let saw_post = false;
    let saw_image = false;
    const fetch_impl: typeof fetch = async (url, init) => {
      saw_post = init?.method === "POST" && String(url) === scoreImageUrl();
      const body = init?.body;
      saw_image = typeof FormData !== "undefined" && body instanceof FormData && body.has("image");
      return new Response(JSON.stringify(score_body), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    };
    const state = await scorePlantImage({
      image: plant_png,
      filename: "pterocarpus-indicus.png",
      token: "test-jwt",
      fetch: fetch_impl,
    });
    assert.equal(saw_post, true);
    assert.equal(saw_image, true);
    assert.equal(state.status, "ready");
    if (state.status !== "ready") return;
    const expected_name = score_body.results[0]?.taxon?.name;
    assert.equal(state.suggestion[0]?.scientific_name, expected_name);
    assert.equal(typeof state.suggestion[0]?.score, "number");
    assert.ok(Number.isFinite(state.suggestion[0]!.score));
  });

  it("returns needs_token when no JWT is provided", async () => {
    const state = await scorePlantImage({
      image: plant_png,
      fetch: async () => {
        throw new Error("fetch must not run without a token");
      },
    });
    assert.equal(state.status, "needs_token");
  });

  it("returns offline when injected fetch rejects or HTTP-fails", async () => {
    const rejected = await scorePlantImage({
      image: plant_png,
      token: "test-jwt",
      fetch: async () => {
        throw new Error("network down");
      },
    });
    assert.equal(rejected.status, "offline");

    const http_fail = await scorePlantImage({
      image: plant_png,
      token: "test-jwt",
      fetch: async () => new Response("nope", { status: 500 }),
    });
    assert.equal(http_fail.status, "offline");
  });
});

describe("loadInatNearby", () => {
  it("maps a recorded observations body through the shipped fetch wrapper", async () => {
    const state = await loadInatNearby({
      now: () => 0,
      fetch: async () =>
        new Response(JSON.stringify(nearby_body), {
          status: 200,
          headers: { "Content-Type": "application/json" },
        }),
    });
    assert.equal(state.status, "ready");
    if (state.status !== "ready") return;
    assert.ok(state.nearby.length <= 5);
    assert.equal(state.nearby[0]?.scientific_name, "Pterocarpus indicus");
  });

  it("returns offline on HTTP fail or thrown fetch", async () => {
    const http_fail = await loadInatNearby({
      now: () => 1,
      fetch: async () => new Response("nope", { status: 503 }),
    });
    assert.equal(http_fail.status, "offline");
    const thrown = await loadInatNearby({
      now: () => 2,
      fetch: async () => {
        throw new Error("offline");
      },
    });
    assert.equal(thrown.status, "offline");
  });
});

describe("nearbyObservationUrl", () => {
  it("targets the Demo pin Plantae observations endpoint the app uses", () => {
    const url = nearbyObservationUrl();
    assert.match(url, /^https:\/\/api\.inaturalist\.org\/v1\/observations\?/);
    assert.match(url, /lat=14\.6386/);
    assert.match(url, /lng=121\.0785/);
    assert.match(url, /iconic_taxa=Plantae/);
    assert.match(url, /photos=true/);
  });
});

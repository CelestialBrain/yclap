import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  CURATED_SOURCE,
  species,
  speciesDetail,
  picker_order,
} from "../src/data.ts";

/**
 * The 09-02 consensus row asked for at least three attribute tiles and a
 * habitat line per species, each carrying a source — and refused any field
 * that does not trace to a citation already in data.ts. These assert both
 * halves: that the tiles exist, and that none of them borrowed authority.
 */

const code_row = Object.keys(species);

describe("species attribute tiles", () => {
  it("every curated species carries at least three", () => {
    for (const code of code_row) {
      const got = speciesDetail(code);
      assert.ok(got, `${code} has no detail record`);
      assert.ok(got.attribute.length >= 3, `${code} has only ${got.attribute.length} tiles`);
    }
  });

  it("every tile has a label, a value and a source, none of them blank", () => {
    for (const code of code_row) {
      for (const tile of speciesDetail(code)!.attribute) {
        for (const field of ["label", "value", "source"] as const) {
          assert.equal(typeof tile[field], "string");
          assert.ok(tile[field].trim().length > 0, `${code}/${tile.label} has an empty ${field}`);
        }
      }
    }
  });

  it("no tile claims a citation the species record does not already carry", () => {
    for (const code of code_row) {
      const sp = species[code];
      /* Everything this file is allowed to cite for THIS species. */
      const allowed = [sp.caption, sp.tile_note, sp.note].filter(Boolean).join(" ");
      const got = speciesDetail(code)!;
      for (const source of [...got.attribute.map((a) => a.source), got.habitat.source]) {
        if (source === CURATED_SOURCE) continue;
        /* A real citation must be traceable: its author token has to appear in
           the species record above, so nothing new was looked up here. */
        const author = source.split(/[ ,·]/).filter(Boolean)[0];
        assert.ok(
          allowed.includes(author),
          `${code} cites "${author}" which appears nowhere in its own record`,
        );
      }
    }
  });

  it("says so plainly when our own curation is the only warrant", () => {
    assert.match(CURATED_SOURCE, /not a campus survey/i);
  });
});

describe("habitat line", () => {
  it("every species has one, with a source", () => {
    for (const code of code_row) {
      const { habitat } = speciesDetail(code)!;
      assert.ok(habitat.line.trim().length > 0, `${code} has no habitat line`);
      assert.ok(habitat.source.trim().length > 0, `${code} habitat line has no source`);
    }
  });

  it("never calls the campus surveyed", () => {
    for (const code of code_row) {
      const { habitat } = speciesDetail(code)!;
      for (const banned of ["we surveyed", "our survey", "we counted", "our inventory", "we censused"]) {
        assert.equal(
          habitat.line.toLowerCase().includes(banned),
          false,
          `${code} habitat line claims "${banned}"`,
        );
      }
    }
  });
});

describe("the documented confusion pair", () => {
  it("Lagundi and Molave each warn about the other", () => {
    const molave = speciesDetail("molave")!;
    const lagundi = speciesDetail("lagundi")!;
    assert.equal(molave.confusable?.species_code, "lagundi");
    assert.equal(lagundi.confusable?.species_code, "molave");
  });

  it("each warning names the difference, not just the name", () => {
    for (const code of ["molave", "lagundi"]) {
      const warn = speciesDetail(code)!.confusable!;
      assert.ok(warn.difference.length > 40, `${code} warning is too thin to act on`);
      /* The distinction that actually matters underfoot: shrub vs canopy. */
      assert.match(warn.difference, /shrub/i);
    }
  });

  it("keeps them two separate records — the merge is a standing rejection", () => {
    assert.equal(species.molave.scientific_name, "Vitex parviflora");
    assert.equal(species.lagundi.scientific_name, "Vitex negundo");
    assert.notEqual(species.molave.species_code, species.lagundi.species_code);
    assert.ok(picker_order.includes("molave"));
    assert.ok(picker_order.includes("lagundi"));
  });

  it("points only at species that exist", () => {
    for (const code of Object.keys(species)) {
      const warn = speciesDetail(code)!.confusable;
      if (!warn) continue;
      assert.ok(species[warn.species_code], `${code} warns about a species that is not on the list`);
      assert.notEqual(warn.species_code, code, `${code} warns about itself`);
    }
  });
});

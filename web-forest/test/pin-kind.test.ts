import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { pinKindOf, pinRingWidth, type PinKind } from "../src/pin.ts";
import { species, encounter } from "../src/data.ts";

/**
 * C12: a pin must say what KIND of thing it is, and it must say so in
 * greyscale — shape or ring weight, never colour alone. These assert the
 * taxonomy behind the shapes, because the shapes themselves are SVG the
 * suite cannot render.
 */

describe("pin kind", () => {
  it("ranks threatened above origin, so a threatened native is not drawn as an ordinary native", () => {
    assert.equal(species.molave.origin, "Native");
    assert.ok(species.molave.pill.includes("Threatened"));
    assert.equal(pinKindOf(species.molave), "threatened");
  });

  it("separates native from exotic", () => {
    assert.equal(pinKindOf(species.narra), "native");
    assert.equal(pinKindOf(species.mahogany), "exotic");
    assert.equal(pinKindOf(species.teak), "exotic");
  });

  it("gives every curated species exactly one kind", () => {
    for (const code of Object.keys(species)) {
      const kind = pinKindOf(species[code]);
      assert.ok(["native", "exotic", "threatened"].includes(kind), `${code} got ${kind}`);
    }
  });

  it("falls back rather than throwing on a species the guide does not have", () => {
    assert.equal(pinKindOf(undefined), "exotic");
  });

  it("every encounter on the map resolves to a kind", () => {
    for (const e of encounter) {
      assert.ok(pinKindOf(species[e.species_code]));
    }
  });
});

describe("greyscale legibility", () => {
  it("threatened carries the heaviest ring, so it reads without colour", () => {
    assert.ok(pinRingWidth("threatened") > pinRingWidth("native"));
    assert.ok(pinRingWidth("threatened") > pinRingWidth("exotic"));
  });

  it("ring weight is a real difference, not a rounding one", () => {
    assert.ok(pinRingWidth("threatened") - pinRingWidth("native") >= 2);
  });

  it("every kind has a positive ring", () => {
    for (const kind of ["native", "exotic", "threatened"] as PinKind[]) {
      assert.ok(pinRingWidth(kind) > 0);
    }
  });
});

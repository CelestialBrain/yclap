import type { Species } from "./data.ts";

/* ── pin variants ─────────────────────────────────────────────────────────
 *
 * Every find used to draw the same plant mark, so "native" and "threatened"
 * were a colour difference and nothing else. Colour alone fails a greyscale
 * projector and fails a colour-blind reader, so the kind is carried by the
 * INNER SHAPE and the ring weight instead:
 *
 *   native      round centre, 3 px ring
 *   exotic      square centre, 3 px ring
 *   threatened  triangle centre, 5 px ring  (the heaviest ring on the map)
 *
 * The seen/not-seen distinction stays a fill inversion, which is also a
 * greyscale value difference rather than a hue one.
 *
 * This lives in its own module rather than inside play-map.tsx because it is
 * data, not a component — and because the test runner strips types from .ts
 * but cannot parse JSX, so anything asserted has to be reachable from here.
 */
export type PinKind = "native" | "exotic" | "threatened";

export function pinKindOf(sp: Species | undefined): PinKind {
  if (!sp) return "exotic";
  /* Threatened outranks origin — the same precedence accentFor already uses,
     so a threatened native never renders as an ordinary native. */
  if (sp.pill.some((p) => p.toLowerCase() === "threatened")) return "threatened";
  return sp.origin === "Native" ? "native" : "exotic";
}

/** Ring weight in px. Heavier means "look harder at this one". */
export function pinRingWidth(kind: PinKind): number {
  return kind === "threatened" ? 5 : 3;
}

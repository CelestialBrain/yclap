/**
 * Honest pilot proof for the landing.
 * Field kg stays 0 until real diversion logs exist.
 */
export const pilot_proof = {
  product_name: "Gargar",
  product_tagline: "Your trash has a price.",
  product_blurb:
    "Pasig scrap pilot: see reference rates, reach a collector, log diversion. Climate as landfill load and basura to baha co-benefit, plus price transparency for informal recovery. Not a carbon credit product.",
  place_chip: ["Pasig", "Katipunan", "Mapúa"],
  rate_freeze_date: "2026-08-07",
  rate_status: "reference",
  pet_rate_amount: 14,
  aluminum_rate_amount: 55,
  collector_count: 6,
  collector_showcase_count: 3,
  collector_verified_count: 0,
  kg_diverted: 0,
  kg_target: 100,
  non_claim: [
    "No carbon credit product",
    "No plastic neutrality certificates",
    "No claim to fix flood-control corruption",
  ],
  next_gate: [
    "Field-verify PET and aluminum rates at 2 Pasig shops",
    "Mark 3 collectors verified after contact",
    "Log real kg toward the 100 kg showcase target",
  ],
  repo_path: "~/Codex/gargar",
  evidence_path: "~/Antigravity/ecowaste",
};

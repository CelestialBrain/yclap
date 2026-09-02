import { percentToLatLon, type LatLon } from "./geo.ts";

export type Origin = "Native" | "Exotic";

export interface Species {
  species_code: string;
  common_name: string;
  scientific_name: string;
  origin: Origin;
  pill: string[];
  note: string;
  caption: string | null;
  tile_note: string | null;
}

/** Curated starter list — do not invent a 1,809-row table. */
export const species: Record<string, Species> = {
  narra: {
    species_code: "narra",
    common_name: "Narra",
    scientific_name: "Pterocarpus indicus",
    origin: "Native",
    pill: ["Native", "National tree", "Shade"],
    note: "A long-lived native. Urban-canopy models for Metro Manila show land cover changes the heat you feel — this is shade, not a slogan.",
    caption:
      "Heat context: Bilang et al. 2022 / Llorin, Villarin et al. 2024 (Archīum Physics + Manila Observatory). Not a campus thermometer.",
    tile_note: null,
  },
  molave: {
    species_code: "molave",
    common_name: "Molave",
    scientific_name: "Vitex parviflora",
    origin: "Native",
    pill: ["Native", "Threatened", "Hardwood"],
    note: "Hard timber, slow to grow, and now threatened — the kind of tree a campus should protect on purpose. Not the same plant as Lagundi.",
    caption: null,
    tile_note: null,
  },
  katmon: {
    species_code: "katmon",
    common_name: "Katmon",
    scientific_name: "Dillenia philippinensis",
    origin: "Native",
    pill: ["Native", "Endemic", "Understory"],
    note: "Endemic to the Philippines, edible sour fruit — an understory tree that keeps the ground alive.",
    caption: "Campus samples barcoded — Fatallo 2022. Also Mindoro. Not an inventory.",
    tile_note: "Campus samples barcoded — Fatallo 2022. Also Mindoro. Not an inventory.",
  },
  dao: {
    species_code: "dao",
    common_name: "Dao",
    scientific_name: "Dracontomelon dao",
    origin: "Native",
    pill: ["Native", "Canopy"],
    note: "A big native canopy tree — good shade without crowding out what grows beneath it.",
    caption: null,
    tile_note: null,
  },
  mahogany: {
    species_code: "mahogany",
    common_name: "Mahogany",
    scientific_name: "Swietenia macrophylla",
    origin: "Exotic",
    pill: ["Exotic", "Fast shade"],
    note: "Fast shade. Natives often fail underneath plantation canopies — analog Ortiz et al. 2024 (Chile pines/eucalypts, Manila Observatory), not an Ateneo mahogany survey. PH reforestation already fails when soil and native vs exotic are ignored (Navarrete et al. 2018).",
    caption: "Analog: Chilean plantation landscapes (Ortiz et al. 2024, MO), not an Ateneo survey.",
    tile_note:
      "Fast shade. Natives often fail underneath plantation canopies — analog Ortiz et al. 2024 (Chile pines/eucalypts, Manila Observatory), not an Ateneo mahogany survey. PH reforestation already fails when soil and native vs exotic are ignored (Navarrete et al. 2018).",
  },
  raintree: {
    species_code: "raintree",
    common_name: "Rain tree",
    scientific_name: "Samanea saman",
    origin: "Exotic",
    pill: ["Exotic", "Wide shade"],
    note: "Wide, low shade — common on the quads, but not from here.",
    caption: null,
    tile_note: null,
  },
  teak: {
    species_code: "teak",
    common_name: "Teak",
    scientific_name: "Tectona grandis",
    origin: "Exotic",
    pill: ["Exotic", "Timber"],
    note: "Planted for timber; big leaves, but exotic to Philippine forest.",
    caption: null,
    tile_note: null,
  },
  balete: {
    species_code: "balete",
    common_name: "Balete",
    scientific_name: "Ficus sp.",
    origin: "Native",
    pill: ["Native", "Strangler fig", "Landmark"],
    note: "A strangler fig — the landmark trees people navigate by without knowing the name.",
    caption: null,
    tile_note: null,
  },
  lagundi: {
    species_code: "lagundi",
    common_name: "Lagundi",
    scientific_name: "Vitex negundo",
    origin: "Native",
    pill: ["Native", "Shrub", "Medicinal"],
    note: "A medicinal shrub, not a canopy tree. Documented from Loyola Heights accessions — never the same card as Molave (Vitex parviflora).",
    caption: "Ledesma 2022 · campus accessions. Shrub, not canopy.",
    tile_note: "Shrub · Ledesma 2022 · Loyola Heights accessions.",
  },
};

export interface EncounterSeed {
  encounter_id: string;
  species_code: string;
  x_percent: number;
  y_percent: number;
  where: string;
}

export interface Encounter extends EncounterSeed {
  /**
   * Position on THIS demo map, projected through CAMPUS_BOX — not a surveyed
   * tree location. AIS holds the inventory and, per Cathy (2026-08-29), it
   * carries species but not count and location per tree.
   */
  lat: number;
  lon: number;
}

/** Walkable-path discs only. None sit inside the SOM / swamp hatch. */
const encounter_seed: EncounterSeed[] = [
  { encounter_id: "e1", species_code: "narra", x_percent: 39, y_percent: 46, where: "Gonzaga walk" },
  { encounter_id: "e2", species_code: "raintree", x_percent: 58, y_percent: 33, where: "CTC quad" },
  { encounter_id: "e3", species_code: "molave", x_percent: 27, y_percent: 62, where: "Rizal Library lawn" },
  { encounter_id: "e4", species_code: "balete", x_percent: 70, y_percent: 55, where: "Bellarmine field edge" },
  { encounter_id: "e5", species_code: "katmon", x_percent: 49, y_percent: 70, where: "Xavier walk" },
  { encounter_id: "e6", species_code: "mahogany", x_percent: 78, y_percent: 40, where: "Katipunan gate yard" },
  { encounter_id: "e7", species_code: "dao", x_percent: 33, y_percent: 30, where: "Berchmans lawn" },
  { encounter_id: "e8", species_code: "lagundi", x_percent: 22, y_percent: 74, where: "Bellarmine path" },
];

export const encounter: Encounter[] = encounter_seed.map((row) => ({
  ...row,
  ...percentToLatLon(row.x_percent, row.y_percent),
}));

/**
 * The off-limits grove — a PLACEHOLDER extent, and it must keep saying so.
 *
 * On the old hand-drawn base this polygon was harmless decoration. On real
 * satellite imagery a hatched boundary is a claim about a real place, and the
 * percentages it was carried over from put it squarely on top of houses
 * north-east of the campus. That is the kind of quiet wrongness this repo is
 * supposed to refuse.
 *
 * These vertices sit on the wooded block inside the campus, so the shape is at
 * least over trees rather than over somebody's roof. It is still NOT surveyed:
 * nobody has given us the SOM grove's boundary. The map caption says
 * "placeholder extent, not surveyed" for that reason, and it stays until CFMO,
 * AIS or the SOM department hand over the real one.
 */
export const RESTRICTED_POLYGON: LatLon[] = [
  { lat: 14.6403, lon: 121.0769 },
  { lat: 14.6404, lon: 121.078 },
  { lat: 14.6397, lon: 121.0783 },
  { lat: 14.6393, lon: 121.0776 },
  { lat: 14.6396, lon: 121.0769 },
];

/**
 * Metres. Inside this the walk treats an encounter as reached — sized for a
 * phone fix (±5–15 m typical) over real imagery, not for survey precision.
 */
export const ENCOUNTER_RADIUS_M = 25;

/** Inside this, the card stops hedging and says you are at the tree. */
export const AT_TREE_RADIUS_M = 8;

/** 9 named + 3 unnamed empty slots = 12 of a starter list. */
export const journal_order: string[] = [
  "narra",
  "molave",
  "katmon",
  "mahogany",
  "lagundi",
  "dao",
  "raintree",
  "teak",
  "balete",
  "slot-a",
  "slot-b",
  "slot-c",
];

export const picker_order: string[] = [
  "narra",
  "molave",
  "katmon",
  "dao",
  "mahogany",
  "raintree",
  "teak",
  "balete",
  "lagundi",
];

export interface Consult {
  consult_id: string;
  label: string;
  detail: string | null;
}

export const consult: Consult[] = [
  {
    consult_id: "ais",
    label: "Ateneo Institute of Sustainability (AIS) — tree inventory access",
    detail:
      "Cuyegkeng & Favis 2019 already described how this campus struggles to get admin buy-in for sustainability programs.",
  },
  {
    consult_id: "mo",
    label: "Manila Observatory",
    detail: "Villarin is a coauthor on the Metro Manila UHI / LULC papers.",
  },
  {
    consult_id: "cfmo",
    label: "CFMO / TAW — grounds",
    detail: null,
  },
  {
    consult_id: "wild",
    label: "Student orgs already walking (Ateneo Wild / AGILA)",
    detail: null,
  },
  {
    consult_id: "admunav",
    label: "ADMUNAV authors (Lagyo, Galicia, Guico 2025) — walkable-path graph, if they will share it",
    detail: null,
  },
];

export const DEMO_PIN = { lat: 14.6386, lon: 121.0785 };

export const SEEK_URL = "https://www.inaturalist.org/pages/seek_app";

export interface Landmark {
  landmark_id: string;
  title: string;
  species_code: string;
  where: string;
  documented: string;
  /** What we have NOT collected. Never fill this with an invented memory. */
  open_ask: string;
  is_oral_history_collected: boolean;
}

/**
 * Camille (2026-08-29, 2:17:00) asked for stories and old photos from older
 * batches. We have not held that interview, so this card states the documented
 * part and names the gap. Do not write a remembered scene here.
 */
export const landmark: Landmark[] = [
  {
    landmark_id: "balete-bellarmine",
    title: "The tree everyone navigates by",
    species_code: "balete",
    where: "Bellarmine field edge",
    documented:
      "A strangler fig (Ficus sp.) — the growth form that begins on another tree and outlives it. Campus balete are the landmarks students give directions with, usually without knowing the name.",
    open_ask:
      "The oral history is not collected yet. We are asking older batches and Ateneo Wild for dated photos and first-hand memories; until someone tells it to us, this card stays a description, not a story.",
    is_oral_history_collected: false,
  },
];

/** Said out loud wherever an AIS figure appears. Cathy, 2026-08-29 (2:12:12). */
export const AIS_GAP_NOTE =
  "AIS keeps a species database for the campus. What it is missing is the count and the location of each tree — that gap is exactly what a walk like this could help close.";

export const WILD_NOTE =
  "Ateneo Wild keeps an Instagram catalogue of campus birds and trees, run by a faculty member. Not consulted yet.";

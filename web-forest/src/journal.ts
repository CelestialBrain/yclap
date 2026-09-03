import { biomeContains, biome as biome_row, type Biome } from "./biome.ts";
import { sectorAt, sectorContains, sector as sector_list, type Sector } from "./sector.ts";
import { formatLatLon, type LatLon } from "./geo.ts";

export interface Sighting {
  sighting_id: string;
  species_code: string;
  photo_data: string | null;
  created_at: string;
  inat_scientific_name: string | null;
  inat_common_name: string | null;
  /** Where it was logged. null when no fix was available at save time. */
  lat: number | null;
  lon: number | null;
  accuracy_m: number | null;
  /** "gps" = a real device fix. "demo" = the scripted stage walk. */
  fix_source: "gps" | "demo" | null;
  note: string | null;
  walk_id: string | null;
  /**
   * The two ways to earn (build spec T2.2, per `29:45` / `33:36`) — kept as two
   * separate counters, never summed into one score. "badge" = photograph a
   * species on the guide's list. "contribution" = report one the guide lacks.
   */
  entry_kind: "badge" | "contribution";
  /** What the caller says they saw, for contributions off the curated list. */
  reported_name: string | null;
}

export interface Walk {
  walk_id: string;
  started_at: string;
  ended_at: string | null;
}

const STORAGE_KEY = "field-guide.sighting";
const WALK_KEY = "field-guide.walk";

function str(value: unknown): string | null {
  return typeof value === "string" && value.trim() ? value : null;
}

function num(value: unknown): number | null {
  return typeof value === "number" && Number.isFinite(value) ? value : null;
}

function parse(raw: string | null): Sighting[] {
  if (!raw) return [];
  try {
    const value = JSON.parse(raw) as unknown;
    if (!Array.isArray(value)) return [];
    return value.flatMap((row): Sighting[] => {
      if (
        row == null ||
        typeof row !== "object" ||
        typeof (row as Sighting).sighting_id !== "string" ||
        typeof (row as Sighting).species_code !== "string"
      ) {
        return [];
      }
      const r = row as Record<string, unknown>;
      const source = r.fix_source;
      /* Rows saved before the T2 counters predate entry_kind; a curated
         species was always a badge attempt, so read them as one. */
      const kind = r.entry_kind === "contribution" ? "contribution" : "badge";
      return [
        {
          sighting_id: r.sighting_id as string,
          species_code: r.species_code as string,
          photo_data: str(r.photo_data),
          created_at: typeof r.created_at === "string" ? r.created_at : "",
          inat_scientific_name: str(r.inat_scientific_name),
          inat_common_name: str(r.inat_common_name),
          lat: num(r.lat),
          lon: num(r.lon),
          accuracy_m: num(r.accuracy_m),
          fix_source: source === "gps" || source === "demo" ? source : null,
          note: str(r.note),
          walk_id: str(r.walk_id),
          entry_kind: kind,
          reported_name: str(r.reported_name),
        },
      ];
    });
  } catch {
    return [];
  }
}

export function readSighting(): Sighting[] {
  return parse(localStorage.getItem(STORAGE_KEY));
}

export function writeSighting(row: Sighting[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(row));
}

export interface SightingDraft {
  species_code: string;
  photo_data: string | null;
  inat_scientific_name?: string | null;
  inat_common_name?: string | null;
  point?: (LatLon & { accuracy_m: number; source: "gps" | "demo" }) | null;
  note?: string | null;
  walk_id?: string | null;
  entry_kind?: "badge" | "contribution";
  reported_name?: string | null;
}

export function addSighting(draft: SightingDraft): Sighting {
  const next: Sighting = {
    sighting_id: `${draft.species_code}-${Date.now()}`,
    species_code: draft.species_code,
    photo_data: draft.photo_data,
    created_at: new Date().toISOString(),
    inat_scientific_name: draft.inat_scientific_name ?? null,
    inat_common_name: draft.inat_common_name ?? null,
    lat: draft.point?.lat ?? null,
    lon: draft.point?.lon ?? null,
    accuracy_m: draft.point?.accuracy_m ?? null,
    fix_source: draft.point?.source ?? null,
    note: draft.note?.trim() || null,
    walk_id: draft.walk_id ?? null,
    entry_kind: draft.entry_kind ?? "badge",
    reported_name: draft.reported_name?.trim() || null,
  };
  writeSighting([...readSighting(), next]);
  return next;
}

export function removeSighting(sighting_id: string): void {
  writeSighting(readSighting().filter((s) => s.sighting_id !== sighting_id));
}

export function seenCode(row: Sighting[]): Set<string> {
  return new Set(row.map((s) => s.species_code));
}

/* ── gamification, guarded (build spec T2, 2026-09-03) ────────────────────
 *
 * Everything here is PERSONAL. The forbidden axis is comparison between
 * users — `test/journal.test.ts` fails on any `leaderboard` / `rank` /
 * `percentile` / cross-user aggregate, sourced to the 09-02 pulong decision
 * (option b) and to the softened-but-never-lifted rule in
 * `docs/roadmap-rejected.md`. Level, stage and progress are per-user facts
 * derived from this journal and this journal only.
 */

export function isBadge(row: Sighting): boolean {
  return row.entry_kind === "badge";
}

export function isContribution(row: Sighting): boolean {
  return row.entry_kind === "contribution";
}

/** The two ways to earn, side by side — displayed and exported separately. */
export interface EarnCounters {
  badge_count: number;
  contribution_count: number;
}

export function counters(row: Sighting[]): EarnCounters {
  return {
    badge_count: row.filter(isBadge).length,
    contribution_count: row.filter(isContribution).length,
  };
}

/** Species from a biome's list this journal has located INSIDE that biome. */
export interface BiomeProgress {
  biome_code: string;
  seen_code: string[];
  seen_count: number;
  /** The biome's own species_code length — never a campus-wide claim. */
  total: number;
}

export function biomeProgress(row: Sighting[], of: Biome): BiomeProgress {
  const seen = new Set<string>();
  for (const s of row) {
    if (!isBadge(s) || s.lat === null || s.lon === null) continue;
    if (!biomeContains(of, { lat: s.lat, lon: s.lon })) continue;
    if (of.species_code.includes(s.species_code)) seen.add(s.species_code);
  }
  return {
    biome_code: of.biome_code,
    seen_code: [...seen],
    seen_count: seen.size,
    total: of.species_code.length,
  };
}

/* ── sectors (09-03 correction) ───────────────────────────────────────────
 *
 * The unit is now a face of the path network, not a ring we drew. These read
 * the same journal the biome functions above read — the only thing that
 * changed is which polygon a sighting is tested against. Still personal, still
 * no cross-user field anywhere in here.
 */

/** Sector codes this journal has a located badge inside. Personal, always. */
export function seenSector(row: Sighting[], of: Sector[] = sector_list): Set<string> {
  const seen = new Set<string>();
  for (const s of row) {
    if (!isBadge(s) || s.lat === null || s.lon === null) continue;
    const at = sectorAt({ lat: s.lat, lon: s.lon }, of);
    if (at) seen.add(at.sector_code);
  }
  return seen;
}

export interface SectorProgress {
  sector_code: string;
  seen_code: string[];
  seen_count: number;
  /** The sector's own provisional species list — never a campus-wide claim. */
  total: number;
}

export function sectorProgress(row: Sighting[], of: Sector): SectorProgress {
  const seen = new Set<string>();
  for (const s of row) {
    if (!isBadge(s) || s.lat === null || s.lon === null) continue;
    if (!sectorContains(of, { lat: s.lat, lon: s.lon })) continue;
    if (of.species_code.includes(s.species_code)) seen.add(s.species_code);
  }
  return {
    sector_code: of.sector_code,
    seen_code: [...seen],
    seen_count: seen.size,
    total: of.species_code.length,
  };
}

/**
 * How lively the character looks, 0..1 — `1:08:20`: it loses leaves when
 * nobody walks.
 *
 * Two properties this must have, and both are asserted in the tests: it is
 * fully recoverable (one walk today puts it back to 1), and it never touches
 * stage or any counter. Absence changes appearance, never progress.
 */
export const VIGOR_FADE_DAY = 14;

export function vigorOf(row: Sighting[], now: number = Date.now()): number {
  if (!row.length) return 1;
  const last = Math.max(...row.map((s) => new Date(s.created_at).getTime()));
  const day = (now - last) / 86400000;
  if (day <= 1) return 1;
  return Math.max(0.25, 1 - (day - 1) / VIGOR_FADE_DAY);
}

/**
 * One point per distinct badge species, one per contribution. Every 3 points
 * the level rises; each level exposes one more biome. Derived from this
 * journal alone — there is nothing else to derive it from, which is the point.
 */
export const LEVEL_STEP = 3;

export function progressPointsOf(row: Sighting[]): number {
  const badge_species = seenCode(row.filter(isBadge));
  return badge_species.size + row.filter(isContribution).length;
}

export function levelOf(row: Sighting[]): number {
  return 1 + Math.floor(progressPointsOf(row) / LEVEL_STEP);
}

/** Early levels expose fewer biomes; progression unlocks more (`32:40`). */
export function unlockedBiomeCount(row: Sighting[]): number {
  return Math.min(biome_row.length, levelOf(row) + 1);
}

/**
 * Rarity without an invented clock (`33:04`): a species not photographed for
 * N days reads "not seen lately", traced to a real journal timestamp. Nothing
 * respawns on a timer we made up.
 */
export const NOT_SEEN_LATELY_DAYS = 7;

export function lastSeenAt(row: Sighting[], species_code: string): string | null {
  const stamps = row
    .filter((s) => s.species_code === species_code)
    .map((s) => s.created_at)
    .filter(Boolean)
    .sort();
  return stamps[stamps.length - 1] ?? null;
}

export function isNotSeenLately(row: Sighting[], species_code: string, now: number): boolean {
  const last = lastSeenAt(row, species_code);
  if (!last) return true; // never seen here — the gap the walk should point at
  const age_ms = now - new Date(last).getTime();
  return age_ms > NOT_SEEN_LATELY_DAYS * 24 * 60 * 60 * 1000;
}

/* ── walk session ───────────────────────────────────────────────────────── */

export function readWalk(): Walk | null {
  try {
    const raw = localStorage.getItem(WALK_KEY);
    if (!raw) return null;
    const value = JSON.parse(raw) as Walk;
    return typeof value?.walk_id === "string" ? value : null;
  } catch {
    return null;
  }
}

export function startWalk(): Walk {
  const walk: Walk = { walk_id: `walk-${Date.now()}`, started_at: new Date().toISOString(), ended_at: null };
  localStorage.setItem(WALK_KEY, JSON.stringify(walk));
  return walk;
}

export function endWalk(): void {
  localStorage.removeItem(WALK_KEY);
}

/* ── summary ────────────────────────────────────────────────────────────── */

export interface SummaryGroup {
  key: string;
  count: number;
}

export interface JournalSummary {
  sighting_count: number;
  species_count: number;
  located_count: number;
  photo_count: number;
  day_count: number;
  by_species: SummaryGroup[];
  by_day: SummaryGroup[];
  first_at: string | null;
  last_at: string | null;
}

function tally(key_of: (s: Sighting) => string | null, row: Sighting[]): SummaryGroup[] {
  const bucket = new Map<string, number>();
  for (const s of row) {
    const key = key_of(s);
    if (!key) continue;
    bucket.set(key, (bucket.get(key) ?? 0) + 1);
  }
  return [...bucket.entries()]
    .map(([key, count]) => ({ key, count }))
    .sort((a, b) => b.count - a.count || a.key.localeCompare(b.key));
}

/** Counts and groupings only. Deliberately no score, no rank, no streak. */
export function summarize(row: Sighting[]): JournalSummary {
  const by_species = tally((s) => s.species_code, row);
  const by_day = tally((s) => (s.created_at ? s.created_at.slice(0, 10) : null), row);
  const stamp = row.map((s) => s.created_at).filter(Boolean).sort();
  return {
    sighting_count: row.length,
    species_count: by_species.length,
    located_count: row.filter((s) => s.lat !== null && s.lon !== null).length,
    photo_count: row.filter((s) => s.photo_data !== null).length,
    day_count: by_day.length,
    by_species,
    by_day,
    first_at: stamp[0] ?? null,
    last_at: stamp[stamp.length - 1] ?? null,
  };
}

/* ── export ─────────────────────────────────────────────────────────────── */

export interface FeatureCollection {
  type: "FeatureCollection";
  features: {
    type: "Feature";
    /** `field-guide/badge/…` vs `field-guide/contribution/…` — distinct feature types. */
    id: string;
    geometry: { type: "Point"; coordinates: [number, number] };
    properties: Record<string, string | number | null>;
  }[];
}

/**
 * GeoJSON of the located sightings — the shape AIS would need, since their
 * database has species but not count and location per tree. Badges and
 * contributions ride as distinct feature types (`T2.2`), separable by `id`
 * prefix and by the `entry_kind` property. Photos are left out on purpose: a
 * data-URL per feature makes the file unusable, and the journal is meant to
 * stay on the device unless a student hands it over.
 */
export function toGeoJson(row: Sighting[]): FeatureCollection {
  return {
    type: "FeatureCollection",
    features: row
      .filter((s): s is Sighting & { lat: number; lon: number } => s.lat !== null && s.lon !== null)
      .map((s) => ({
        type: "Feature",
        id: `field-guide/${s.entry_kind}/${s.sighting_id}`,
        geometry: { type: "Point", coordinates: [s.lon, s.lat] },
        properties: {
          entry_kind: s.entry_kind,
          feature_type: s.entry_kind,
          sighting_id: s.sighting_id,
          species_code: s.species_code,
          reported_name: s.reported_name,
          inat_scientific_name: s.inat_scientific_name,
          created_at: s.created_at,
          accuracy_m: s.accuracy_m,
          fix_source: s.fix_source,
          note: s.note,
          walk_id: s.walk_id,
          coordinate: formatLatLon({ lat: s.lat, lon: s.lon }),
        },
      })),
  };
}

const CSV_COLUMN = [
  "sighting_id",
  "entry_kind",
  "reported_name",
  "species_code",
  "inat_scientific_name",
  "created_at",
  "lat",
  "lon",
  "accuracy_m",
  "fix_source",
  "note",
  "walk_id",
] as const;

function csvCell(value: unknown): string {
  if (value === null || value === undefined) return "";
  const text = String(value);
  return /[",\n]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
}

export function toCsv(row: Sighting[]): string {
  const line = [CSV_COLUMN.join(",")];
  for (const s of row) {
    line.push(CSV_COLUMN.map((col) => csvCell((s as unknown as Record<string, unknown>)[col])).join(","));
  }
  return line.join("\n");
}

export function downloadText(filename: string, text: string, mime: string): void {
  const blob = new Blob([text], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

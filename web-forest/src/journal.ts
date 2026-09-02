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
    geometry: { type: "Point"; coordinates: [number, number] };
    properties: Record<string, string | number | null>;
  }[];
}

/**
 * GeoJSON of the located sightings — the shape AIS would need, since their
 * database has species but not count and location per tree. Photos are left
 * out on purpose: a data-URL per feature makes the file unusable, and the
 * journal is meant to stay on the device unless a student hands it over.
 */
export function toGeoJson(row: Sighting[]): FeatureCollection {
  return {
    type: "FeatureCollection",
    features: row
      .filter((s): s is Sighting & { lat: number; lon: number } => s.lat !== null && s.lon !== null)
      .map((s) => ({
        type: "Feature",
        geometry: { type: "Point", coordinates: [s.lon, s.lat] },
        properties: {
          sighting_id: s.sighting_id,
          species_code: s.species_code,
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

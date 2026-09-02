import { DEMO_PIN, species } from "./data.ts";

export interface InatNearby {
  observation_id: number;
  common_name: string;
  scientific_name: string;
  quality_grade: string;
  observed_on: string | null;
  url: string;
  is_campus_species: boolean;
}

export type InatNearbyState =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "ready"; nearby: InatNearby[]; fetched_at: number }
  | { status: "empty" }
  | { status: "offline" };

export interface InatSuggestion {
  taxon_id: number | null;
  scientific_name: string;
  common_name: string;
  score: number;
  rank: number;
}

export type InatIdentifyState =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "ready"; suggestion: InatSuggestion[] }
  | { status: "empty" }
  | { status: "offline" }
  | { status: "needs_token" }
  /** Recorded iNat response replayed on stage. Never a live read of the photo. */
  | { status: "demo"; suggestion: InatSuggestion[] };

export interface InatObservation {
  id?: number;
  quality_grade?: string;
  observed_on?: string | null;
  uri?: string;
  taxon?: InatTaxon | null;
}

interface InatTaxon {
  id?: number;
  name?: string;
  preferred_common_name?: string;
  rank?: string;
}

interface InatList {
  /** Upstream iNat key is plural `results`. Map it; do not keep that name on our types. */
  results?: InatObservation[];
}

const CACHE_KEY = "fg_inat_nearby_v1";
const CACHE_TTL_MS = 30 * 60 * 1000;
const FETCH_TIMEOUT_MS = 8000;
const RADIUS_KM = 1;
const SHOW_COUNT = 5;
const SUGGEST_COUNT = 10;
const VIA = "yclap-field-guide/0.1 (Youth CLAP Ateneo CCC; local PWA)";
const OBSERVATION_URL = "https://api.inaturalist.org/v1/observations";
const SCORE_IMAGE_URL = "https://api.inaturalist.org/v1/computervision/score_image";

const campus_scientific = Object.values(species).map((s) => s.scientific_name.toLowerCase());

function isCampusSpecies(scientific_name: string): boolean {
  const n = scientific_name.toLowerCase();
  return campus_scientific.some((c) => n === c || n.startsWith(c + " "));
}

interface CacheBlob {
  fetched_at: number;
  nearby: InatNearby[];
}

function readCache(now: number): CacheBlob | null {
  try {
    const storage = globalThis.sessionStorage;
    if (!storage) return null;
    const raw = storage.getItem(CACHE_KEY);
    if (!raw) return null;
    const blob = JSON.parse(raw) as CacheBlob;
    if (!blob.fetched_at || !Array.isArray(blob.nearby)) return null;
    if (now - blob.fetched_at > CACHE_TTL_MS) return null;
    return blob;
  } catch {
    return null;
  }
}

function writeCache(nearby: InatNearby[], now: number): void {
  try {
    const storage = globalThis.sessionStorage;
    if (!storage) return;
    const blob: CacheBlob = { fetched_at: now, nearby };
    storage.setItem(CACHE_KEY, JSON.stringify(blob));
  } catch {
    /* quota / private mode / Node */
  }
}

/** JSON → nearby row. Campus scientific names first, unique taxa, cap of five. */
export function mapNearbyObservation(row: InatObservation[]): InatNearby[] {
  const seen_taxon = new Set<string>();
  const mapped: InatNearby[] = [];
  for (const obs of row) {
    const taxon = obs.taxon;
    const scientific_name = taxon?.name?.trim();
    if (!obs.id || !scientific_name) continue;
    const taxon_key = String(taxon?.id ?? scientific_name.toLowerCase());
    if (seen_taxon.has(taxon_key)) continue;
    seen_taxon.add(taxon_key);
    mapped.push({
      observation_id: obs.id,
      common_name: taxon?.preferred_common_name?.trim() || scientific_name,
      scientific_name,
      quality_grade: obs.quality_grade ?? "unknown",
      observed_on: obs.observed_on ?? null,
      url: obs.uri || `https://www.inaturalist.org/observations/${obs.id}`,
      is_campus_species: isCampusSpecies(scientific_name),
    });
  }
  mapped.sort((a, b) => {
    if (a.is_campus_species !== b.is_campus_species) return a.is_campus_species ? -1 : 1;
    const a_rg = a.quality_grade === "research" ? 0 : 1;
    const b_rg = b.quality_grade === "research" ? 0 : 1;
    return a_rg - b_rg;
  });
  return mapped.slice(0, SHOW_COUNT);
}

export function inatExploreUrl(): string {
  return `https://www.inaturalist.org/observations?lat=${DEMO_PIN.lat}&lng=${DEMO_PIN.lon}&radius=${RADIUS_KM}&place_id=any&iconic_taxa=Plantae`;
}

export function nearbyObservationUrl(): string {
  const param = new URLSearchParams({
    lat: String(DEMO_PIN.lat),
    lng: String(DEMO_PIN.lon),
    radius: String(RADIUS_KM),
    iconic_taxa: "Plantae",
    per_page: "40",
    order_by: "observed_on",
    order: "desc",
    photos: "true",
  });
  return `${OBSERVATION_URL}?${param.toString()}`;
}

export function scoreImageUrl(): string {
  return SCORE_IMAGE_URL;
}

export async function loadInatNearby(io?: {
  fetch?: typeof fetch;
  now?: () => number;
}): Promise<InatNearbyState> {
  const now = io?.now ?? Date.now;
  const fetch_impl = io?.fetch ?? globalThis.fetch;
  const cached = readCache(now());
  if (cached) {
    return cached.nearby.length
      ? { status: "ready", nearby: cached.nearby, fetched_at: cached.fetched_at }
      : { status: "empty" };
  }

  const url = nearbyObservationUrl();
  const controller = new AbortController();
  const timer = globalThis.setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);

  try {
    const header = new Headers();
    header.set("Accept", "application/json");
    header.set("X-Via", VIA);
    const res = await fetch_impl(url, { method: "GET", headers: header, signal: controller.signal });
    if (!res.ok) return { status: "offline" };
    const body = (await res.json()) as InatList;
    const nearby = mapNearbyObservation(body.results ?? []);
    const fetched_at = now();
    writeCache(nearby, fetched_at);
    return nearby.length ? { status: "ready", nearby, fetched_at } : { status: "empty" };
  } catch {
    return { status: "offline" };
  } finally {
    globalThis.clearTimeout(timer);
  }
}

function asRecord(value: unknown): Record<string, unknown> | null {
  return value !== null && typeof value === "object" ? (value as Record<string, unknown>) : null;
}

function numericScore(row: Record<string, unknown>): number | null {
  for (const key of ["combined_score", "score", "vision_score"] as const) {
    const n = Number(row[key]);
    if (Number.isFinite(n)) return n;
  }
  return null;
}

/** iNat CV JSON → suggestion list. Reads taxon.name; does not invent taxa. */
export function mapScoreImage(body: unknown): InatSuggestion[] {
  const root = asRecord(body);
  const row = Array.isArray(root?.results) ? root.results : Array.isArray(body) ? body : [];
  const suggestion: InatSuggestion[] = [];
  let rank = 0;
  for (const item of row) {
    const rec = asRecord(item);
    if (!rec) continue;
    const taxon = asRecord(rec.taxon);
    const scientific_name = typeof taxon?.name === "string" ? taxon.name.trim() : "";
    if (!scientific_name) continue;
    const score = numericScore(rec);
    if (score === null) continue;
    rank += 1;
    const common =
      typeof taxon?.preferred_common_name === "string" && taxon.preferred_common_name.trim()
        ? taxon.preferred_common_name.trim()
        : scientific_name;
    const taxon_id = typeof taxon?.id === "number" ? taxon.id : null;
    suggestion.push({ taxon_id, scientific_name, common_name: common, score, rank });
    if (suggestion.length >= SUGGEST_COUNT) break;
  }
  return suggestion;
}

function readToken(explicit?: string): string | undefined {
  const from_arg = explicit?.trim();
  if (from_arg) return from_arg;
  try {
    /* Vite inlines this at build time. `process` does not exist in a browser
       bundle, so reading only `process.env` made every browser needs_token. */
    const vite_token = (import.meta as { env?: Record<string, string | undefined> }).env
      ?.VITE_INAT_API_TOKEN;
    if (vite_token?.trim()) return vite_token.trim();
  } catch {
    /* no import.meta.env */
  }
  try {
    const env_token = (globalThis as { process?: { env?: Record<string, string | undefined> } }).process
      ?.env?.INAT_API_TOKEN;
    if (env_token?.trim()) return env_token.trim();
  } catch {
    /* no process */
  }
  return undefined;
}

function asBlob(image: Blob | ArrayBuffer | Uint8Array, filename: string): Blob {
  const type = filename.endsWith(".jpg") || filename.endsWith(".jpeg") ? "image/jpeg" : "image/png";
  if (image instanceof Blob) return image;
  if (image instanceof Uint8Array) {
    const copy = Uint8Array.from(image);
    return new Blob([copy.buffer], { type });
  }
  return new Blob([image], { type });
}

export async function scorePlantImage(input: {
  image: Blob | ArrayBuffer | Uint8Array;
  filename?: string;
  token?: string;
  fetch?: typeof fetch;
  lat?: number;
  lng?: number;
}): Promise<InatIdentifyState> {
  const token = readToken(input.token);
  if (!token) return { status: "needs_token" };

  const filename = input.filename ?? "plant.png";
  const form = new FormData();
  form.append("image", asBlob(input.image, filename), filename);
  form.append("lat", String(input.lat ?? DEMO_PIN.lat));
  form.append("lng", String(input.lng ?? DEMO_PIN.lon));

  const fetch_impl = input.fetch ?? globalThis.fetch;
  const header = new Headers();
  header.set("Accept", "application/json");
  header.set("Authorization", token);
  header.set("X-Via", VIA);

  try {
    const res = await fetch_impl(SCORE_IMAGE_URL, { method: "POST", headers: header, body: form });
    if (!res.ok) return { status: "offline" };
    const body: unknown = await res.json();
    const suggestion = mapScoreImage(body);
    return suggestion.length ? { status: "ready", suggestion } : { status: "empty" };
  } catch {
    return { status: "offline" };
  }
}

/** Match an iNat suggestion to a curated campus species_code, if any. */
export function campusCodeForScientific(scientific_name: string): string | null {
  const n = scientific_name.toLowerCase();
  for (const [species_code, row] of Object.entries(species)) {
    const c = row.scientific_name.toLowerCase();
    if (n === c || n.startsWith(c + " ")) return species_code;
  }
  return null;
}

/** True when this build carries a CV token, i.e. detection can run for real. */
export function hasInatToken(): boolean {
  return Boolean(readToken());
}

/**
 * Recorded top-3 from a real POST /v1/computervision/score_image for a
 * Pterocarpus indicus photo (observation 36874701). Replayed only when the
 * build has no token, and always labelled on screen as a recorded response —
 * it is not an identification of the photo in the viewfinder.
 */
const DEMO_SCORE_BODY = {
  results: [
    {
      combined_score: 0.9124,
      taxon: { id: 348101, name: "Pterocarpus indicus", preferred_common_name: "Narra", rank: "species" },
    },
    {
      combined_score: 0.0412,
      taxon: { id: 68662, name: "Pterocarpus", preferred_common_name: "Bloodwood", rank: "genus" },
    },
    {
      combined_score: 0.0189,
      taxon: { id: 47122, name: "Samanea saman", preferred_common_name: "Rain Tree", rank: "species" },
    },
  ],
};

export function demoIdentify(): InatIdentifyState {
  const suggestion = mapScoreImage(DEMO_SCORE_BODY);
  return suggestion.length ? { status: "demo", suggestion } : { status: "empty" };
}

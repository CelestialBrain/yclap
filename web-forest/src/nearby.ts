import { biomeContains, drawn_biome, type Biome } from "./biome.ts";
import { encounter, ENCOUNTER_RADIUS_M, type Encounter } from "./data.ts";
import { bearingDegree, compassPoint, distanceMeter, type LatLon } from "./geo.ts";

export interface NearbyEncounter {
  row: Encounter;
  distance_m: number;
  bearing_degree: number;
  compass: string;
  is_at: boolean;
}

/** Every encounter ranked by true metre distance from a position. */
export function rankEncounter(from: LatLon, row: Encounter[] = encounter): NearbyEncounter[] {
  return row
    .map((e) => {
      const distance_m = distanceMeter(from, e);
      const bearing_degree = bearingDegree(from, e);
      return {
        row: e,
        distance_m,
        bearing_degree,
        compass: compassPoint(bearing_degree),
        is_at: distance_m <= ENCOUNTER_RADIUS_M,
      };
    })
    .sort((a, b) => a.distance_m - b.distance_m);
}

export function nearestEncounter(from: LatLon, row: Encounter[] = encounter): NearbyEncounter | null {
  return rankEncounter(from, row)[0] ?? null;
}

/* ── the biome unit ──────────────────────────────────────────────────────────
 *
 * Since the 09-02 pivot the card opens on AREA, not on distance: entering a
 * biome pops its card, leaving closes it. Distance (25 m / 8 m haversine) is
 * still correct and still tested — it now ranks the species representatives
 * WITHIN a biome instead of deciding which card is open.
 */

export interface BiomePresence {
  row: Biome;
  /** Encounters inside this biome, nearest first — the residents you can log. */
  resident: NearbyEncounter[];
}

/**
 * Every drawn biome that contains the position, seed order first. Containment
 * by ray casting — never by "closest polygon", which is the per-tree rule in
 * disguise and breaks where parcels adjoin.
 */
export function rankBiome(
  from: LatLon,
  row: Biome[] = drawn_biome,
  pool: Encounter[] = encounter,
): BiomePresence[] {
  return row
    .filter((b) => biomeContains(b, from))
    .map((b) => ({
      row: b,
      resident: rankEncounter(
        from,
        pool.filter((e) => biomeContains(b, e)),
      ),
    }));
}

export function biomePresenceAt(
  from: LatLon,
  row: Biome[] = drawn_biome,
  pool: Encounter[] = encounter,
): BiomePresence | null {
  return rankBiome(from, row, pool)[0] ?? null;
}

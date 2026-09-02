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

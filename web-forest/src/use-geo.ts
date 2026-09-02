import { useEffect, useRef, useState } from "react";
import { demoWalkAt, isInsideCampus, type Fix, type GeoState } from "./geo";

const DEMO_LOOP_MS = 42000;
const DEMO_TICK_MS = 120;

const WATCH_OPTION: PositionOptions = {
  enableHighAccuracy: true,
  timeout: 15000,
  maximumAge: 2000,
};

function messageFor(code: number): string {
  if (code === 1) return "Location permission denied. Demo campus keeps the walk moving.";
  if (code === 2) return "No position fix here. Demo campus keeps the walk moving.";
  return "Location timed out. Demo campus keeps the walk moving.";
}

/**
 * One position source for the whole app.
 *
 * `is_demo` runs the scripted campus loop — the stage path, and the only one
 * that works at a Mapúa hall off Katipunan. Turning it off asks the browser for
 * a real fix; a denial or a timeout says so on screen rather than silently
 * falling back to a fake position.
 */
export function useGeo(is_demo: boolean): GeoState & { is_off_campus: boolean } {
  const [state, setState] = useState<GeoState>({ status: "idle", fix: null, message: null });
  const started_at = useRef<number>(Date.now());

  useEffect(() => {
    if (!is_demo) return;
    started_at.current = Date.now();
    const tick = () => {
      const progress = ((Date.now() - started_at.current) % DEMO_LOOP_MS) / DEMO_LOOP_MS;
      const point = demoWalkAt(progress);
      setState({
        status: "demo",
        fix: { ...point, accuracy_m: 5, at: Date.now(), source: "demo" },
        message: null,
      });
    };
    tick();
    const timer = window.setInterval(tick, DEMO_TICK_MS);
    return () => window.clearInterval(timer);
  }, [is_demo]);

  useEffect(() => {
    if (is_demo) return;
    if (!("geolocation" in navigator)) {
      setState({
        status: "unavailable",
        fix: null,
        message: "This browser has no geolocation. Switch Demo campus back on.",
      });
      return;
    }
    setState({ status: "prompting", fix: null, message: "Asking this device for a position…" });
    const watch_id = navigator.geolocation.watchPosition(
      (position) => {
        const fix: Fix = {
          lat: position.coords.latitude,
          lon: position.coords.longitude,
          accuracy_m: position.coords.accuracy,
          at: position.timestamp,
          source: "gps",
        };
        setState({ status: "watching", fix, message: null });
      },
      (err) => {
        setState({
          status: err.code === 1 ? "denied" : "unavailable",
          fix: null,
          message: messageFor(err.code),
        });
      },
      WATCH_OPTION,
    );
    return () => navigator.geolocation.clearWatch(watch_id);
  }, [is_demo]);

  const is_off_campus = state.status === "watching" && state.fix !== null && !isInsideCampus(state.fix);
  return { ...state, is_off_campus };
}

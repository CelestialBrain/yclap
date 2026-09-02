import { useCallback, useEffect, useLayoutEffect, useRef, useState, type ReactNode } from "react";
import { LAYER_ORDER, nextLayer, SOURCE, type Layer } from "./basemap";
import {
  CAMPUS_BOX,
  clampCenter,
  fromWorld,

  meterPerPixel,
  MIN_ZOOM,
  TILE_SIZE,
  toWorld,
  type LatLon,
} from "./geo";

/**
 * A real slippy map, with no map library.
 *
 * The repo runs on react + react-dom and nothing else, and the offline story is
 * a hand-written service worker. Adding Leaflet or MapLibre would mean handing
 * both of those to a dependency, and a campus walk needs a small subset of what
 * either provides: pan, a few zoom steps, and markers that stay on their
 * features. That subset is the file below.
 *
 * Everything is positioned through `toWorld` (Web Mercator), the same projection
 * the tile server drew with, so a marker sits where the imagery says it sits at
 * every zoom.
 */

export interface View extends LatLon {
  zoom: number;
}

export { LAYER_ORDER, nextLayer, SOURCE };
export type { Layer };

export interface Projection {
  /** lat/lon → pixel inside the map container. */
  project: (point: LatLon) => { x: number; y: number };
  /** Ground metres per screen pixel — turns a real radius into a real circle. */
  meter_per_pixel: number;
  width: number;
  height: number;
  zoom: number;
}

interface Props {
  view: View;
  onView: (view: View) => void;
  layer: Layer;
  /** Called on a user gesture, so "follow the walker" can switch itself off. */
  onGesture?: () => void;
  is_interactive?: boolean;
  /** Credit for anything an overlay draws on top of the tiles. ODbL data has to say so. */
  overlay_attribution?: string;
  children?: (projection: Projection) => ReactNode;
}

function tileRange(origin: number, span: number): number[] {
  const first = Math.floor(origin / TILE_SIZE);
  const last = Math.floor((origin + span) / TILE_SIZE);
  const row: number[] = [];
  for (let i = first; i <= last; i += 1) row.push(i);
  return row;
}

export default function TileMap({
  view,
  onView,
  layer,
  onGesture,
  is_interactive = true,
  overlay_attribution,
  children,
}: Props) {
  const box_ref = useRef<HTMLDivElement | null>(null);
  const [size, setSize] = useState({ width: 0, height: 0 });
  const drag = useRef<{ x: number; y: number; lat: number; lon: number } | null>(null);

  useLayoutEffect(() => {
    const node = box_ref.current;
    if (!node) return;
    const read = () => setSize({ width: node.clientWidth, height: node.clientHeight });
    read();
    const observer = new ResizeObserver(read);
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  const source = SOURCE[layer];
  const zoom = Math.round(Math.max(MIN_ZOOM, Math.min(source.max_zoom, view.zoom)));
  const center_world = toWorld(view, zoom);
  const origin = {
    x: center_world.x - size.width / 2,
    y: center_world.y - size.height / 2,
  };

  const project = useCallback(
    (point: LatLon) => {
      const world = toWorld(point, zoom);
      return { x: world.x - origin.x, y: world.y - origin.y };
    },
    [zoom, origin.x, origin.y],
  );

  /* Zoom about the cursor, so the feature under the pointer stays put. */
  const zoomAt = useCallback(
    (step: number, client_x?: number, client_y?: number) => {
      const next_zoom = Math.max(MIN_ZOOM, Math.min(source.max_zoom, zoom + step));
      if (next_zoom === zoom) return;
      const rect = box_ref.current?.getBoundingClientRect();
      if (!rect || client_x === undefined || client_y === undefined) {
        onView({ ...view, zoom: next_zoom });
        return;
      }
      const anchor = fromWorld(
        { x: origin.x + (client_x - rect.left), y: origin.y + (client_y - rect.top) },
        zoom,
      );
      const anchor_world = toWorld(anchor, next_zoom);
      const next_center = fromWorld(
        {
          x: anchor_world.x - (client_x - rect.left) + size.width / 2,
          y: anchor_world.y - (client_y - rect.top) + size.height / 2,
        },
        next_zoom,
      );
      onView({ ...clampCenter(next_center), zoom: next_zoom });
    },
    [zoom, origin.x, origin.y, size.width, size.height, view, onView, source.max_zoom],
  );

  useEffect(() => {
    const node = box_ref.current;
    if (!node || !is_interactive) return;
    const onWheel = (event: WheelEvent) => {
      event.preventDefault();
      onGesture?.();
      zoomAt(event.deltaY < 0 ? 1 : -1, event.clientX, event.clientY);
    };
    /* Non-passive, or the browser refuses preventDefault and the page scrolls. */
    node.addEventListener("wheel", onWheel, { passive: false });
    return () => node.removeEventListener("wheel", onWheel);
  }, [zoomAt, is_interactive, onGesture]);

  const onPointerDown = (event: React.PointerEvent) => {
    if (!is_interactive) return;
    (event.target as Element).setPointerCapture?.(event.pointerId);
    drag.current = { x: event.clientX, y: event.clientY, lat: view.lat, lon: view.lon };
  };

  const onPointerMove = (event: React.PointerEvent) => {
    const from = drag.current;
    if (!from) return;
    const dx = event.clientX - from.x;
    const dy = event.clientY - from.y;
    if (Math.abs(dx) + Math.abs(dy) < 3) return;
    onGesture?.();
    const start = toWorld({ lat: from.lat, lon: from.lon }, zoom);
    onView({ ...clampCenter(fromWorld({ x: start.x - dx, y: start.y - dy }, zoom)), zoom });
  };

  const endDrag = (event: React.PointerEvent) => {
    (event.target as Element).releasePointerCapture?.(event.pointerId);
    drag.current = null;
  };

  const tile_x = size.width ? tileRange(origin.x, size.width) : [];
  const tile_y = size.height ? tileRange(origin.y, size.height) : [];
  const count = 2 ** zoom;

  return (
    <div
      ref={box_ref}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={endDrag}
      onPointerCancel={endDrag}
      style={{
        position: "absolute",
        inset: 0,
        overflow: "hidden",
        background: "#dfe3d8",
        touchAction: is_interactive ? "none" : undefined,
        cursor: is_interactive ? (drag.current ? "grabbing" : "grab") : "default",
      }}
    >
      {tile_y.map((ty) =>
        tile_x.map((tx) => {
          const wrapped_x = ((tx % count) + count) % count;
          if (ty < 0 || ty >= count) return null;
          return (
            <img
              key={`${zoom}/${tx}/${ty}`}
              src={source.url(zoom, wrapped_x, ty)}
              alt=""
              /* CORS, not no-cors: an opaque reply hides a 502, and the worker
                 then caches the failure as if it were a tile. */
              crossOrigin="anonymous"
              draggable={false}
              width={TILE_SIZE}
              height={TILE_SIZE}
              style={{
                position: "absolute",
                left: Math.round(tx * TILE_SIZE - origin.x),
                top: Math.round(ty * TILE_SIZE - origin.y),
                width: TILE_SIZE,
                height: TILE_SIZE,
                userSelect: "none",
                pointerEvents: "none",
              }}
            />
          );
        }),
      )}

      {size.width > 0 &&
        children?.({
          project,
          meter_per_pixel: meterPerPixel(view.lat, zoom),
          width: size.width,
          height: size.height,
          zoom,
        })}

      {is_interactive && (
        <div className="absolute flex flex-col" style={{ right: 10, top: "50%", transform: "translateY(-50%)", zIndex: 22 }}>
          {[
            { label: "Zoom in", sign: 1, glyph: "+" },
            { label: "Zoom out", sign: -1, glyph: "−" },
          ].map(({ label, sign, glyph }) => (
            <button
              key={label}
              aria-label={label}
              onClick={() => {
                onGesture?.();
                zoomAt(sign);
              }}
              style={{
                width: 34,
                height: 34,
                background: "#F9F9F9",
                border: "1.5px solid #E4E7E8",
                borderRadius: sign === 1 ? "10px 10px 0 0" : "0 0 10px 10px",
                borderBottomWidth: sign === 1 ? 0 : 1.5,
                fontSize: 18,
                fontWeight: 800,
                lineHeight: 1,
                boxShadow: "var(--shadow-card)",
              }}
            >
              {glyph}
            </button>
          ))}
        </div>
      )}

      <div
        style={{
          position: "absolute",
          right: 0,
          bottom: 0,
          zIndex: 21,
          background: "rgba(249,249,249,0.82)",
          borderTopLeftRadius: 8,
          padding: "2px 7px",
          fontSize: 9.5,
          color: "rgba(31,32,34,0.72)",
          pointerEvents: "none",
        }}
      >
        {overlay_attribution ? `${source.attribution} · ${overlay_attribution}` : source.attribution}
      </div>
    </div>
  );
}

/**
 * Warm every tile over the campus so the walk survives a dead hall.
 *
 * The service worker caches tiles it sees, which means offline only covers
 * wherever you happened to pan. On stage that is a coin flip, so this walks the
 * campus box at the zooms the app actually uses and pulls each tile once —
 * the worker stores them on the way past.
 *
 * Fetched with CORS, not `no-cors`: an opaque reply hides a failed status, and
 * the worker would then bank the failure as a tile. Every host here sends
 * `Access-Control-Allow-Origin: *`.
 */
export async function prefetchCampus(
  layer: Layer,
  zoom_list: number[] = [17, 18, 19],
  onProgress?: (done: number, total: number) => void,
): Promise<{ done: number; total: number }> {
  const source = SOURCE[layer];
  const job: string[] = [];
  for (const zoom of zoom_list) {
    if (zoom > source.max_zoom) continue;
    const nw = toWorld({ lat: CAMPUS_BOX.north, lon: CAMPUS_BOX.west }, zoom);
    const se = toWorld({ lat: CAMPUS_BOX.south, lon: CAMPUS_BOX.east }, zoom);
    for (let x = Math.floor(nw.x / TILE_SIZE); x <= Math.floor(se.x / TILE_SIZE); x += 1) {
      for (let y = Math.floor(nw.y / TILE_SIZE); y <= Math.floor(se.y / TILE_SIZE); y += 1) {
        job.push(source.url(zoom, x, y));
      }
    }
  }

  let done = 0;
  const LANE = 6;
  const queue = [...job];
  const worker = async () => {
    for (let url = queue.pop(); url; url = queue.pop()) {
      try {
        await fetch(url, { mode: "cors", cache: "default" });
      } catch {
        /* one missing tile is not a failed download */
      }
      done += 1;
      onProgress?.(done, job.length);
    }
  };
  await Promise.all(Array.from({ length: LANE }, worker));
  return { done, total: job.length };
}

import { useEffect, useMemo, useState } from "react";
import CampusMap from "./campus-map";
import Viewfinder, { type Shot } from "./camera";
import {
  AIS_GAP_NOTE,
  AT_TREE_RADIUS_M,
  consult,
  DEMO_PIN,
  encounter,
  journal_order,
  landmark,
  picker_order,
  SEEK_URL,
  species,
  WILD_NOTE,
  type Species,
} from "./data";
import {
  addSighting,
  downloadText,
  endWalk,
  readSighting,
  readWalk,
  seenCode,
  startWalk,
  summarize,
  toCsv,
  toGeoJson,
  type Sighting,
  type Walk,
} from "./journal";
import { CAMPUS_CENTER, formatLatLon, formatMeter } from "./geo";
import { LAYER_ORDER, nextLayer, prefetchCampus, SOURCE, type Layer, type View } from "./tile-map";
import { useGeo } from "./use-geo";
import { rankEncounter } from "./nearby";
import {
  campusCodeForScientific,
  demoIdentify,
  hasInatToken,
  loadInatNearby,
  scorePlantImage,
  type InatIdentifyState,
  type InatNearbyState,
  type InatSuggestion,
} from "./inat";
import InatStrip from "./inat-strip";
import { spot } from "./asset/kit";
import { Card, Chip, Eyebrow, Fab, GlyphDisc, Pill, PrimaryPill, RADIUS, SpeciesPill, TaxonName, TaxonThumb } from "./ui";
import {
  CameraIcon,
  CanopyIcon,
  ExportIcon,
  LeafScanIcon,
  LocateIcon,
  ShutterIcon,
  WalkIcon,
  CheckIcon,
  CloseIcon,
  HomeIcon,
  JournalIcon,
  MapIcon,
  PinIcon,
  PlanIcon,
  PlantMark,
  RestrictedIcon,
} from "./icon";

/** ~1.2 m per pixel: a walker sees their block, not the whole 89 ha. */
const WALK_ZOOM = 18;
const OVERVIEW_ZOOM = 16;

const CARD_RADIUS = RADIUS.card;
const TILE_RADIUS = RADIUS.tile;

export type Route = "/" | "/map" | "/journal" | "/plan";

function pathToRoute(path: string): Route {
  if (path === "/map" || path === "/journal" || path === "/plan") return path;
  return "/";
}

function StatTile({ big, line, source }: { big: string; line: string; source: string }) {
  return (
    <div
      className="flex-1"
      style={{
        background: "#F9F9F9",
        border: "1.5px solid #E4E7E8",
        borderRadius: TILE_RADIUS,
        padding: "12px 10px",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div style={{ fontWeight: 800, fontSize: 20, color: "#1F2022", lineHeight: 1.05 }}>{big}</div>
      <div style={{ fontSize: 11.5, color: "rgba(31,32,34,0.78)", marginTop: 4, lineHeight: 1.35 }}>{line}</div>
      <div style={{ fontSize: 10, color: "rgba(31,32,34,0.45)", marginTop: "auto", paddingTop: 4 }}>{source}</div>
    </div>
  );
}

function MobileNav({ route, onRoute }: { route: Route; onRoute: (r: Route) => void }) {
  const item: { id: Route; label: string; Icon: typeof HomeIcon }[] = [
    { id: "/", label: "Home", Icon: HomeIcon },
    { id: "/map", label: "Map", Icon: MapIcon },
    { id: "/journal", label: "Journal", Icon: JournalIcon },
    { id: "/plan", label: "Plan", Icon: PlanIcon },
  ];
  return (
    <nav
      className="absolute inset-x-0 bottom-0 flex items-stretch"
      style={{
        height: 64,
        background: "rgba(249,249,249,0.96)",
        borderTop: "1.5px solid #E4E7E8",
        backdropFilter: "blur(8px)",
        zIndex: 40,
      }}
    >
      {item.map(({ id, label, Icon }) => {
        const is_active = route === id;
        return (
          <button
            key={id}
            onClick={() => onRoute(id)}
            className="flex-1 flex flex-col items-center justify-center"
            style={{ color: is_active ? "#008653" : "rgba(31,32,34,0.62)" }}
          >
            <span
              style={{
                display: "grid",
                placeItems: "center",
                width: 46,
                height: 28,
                borderRadius: RADIUS.pill,
                background: is_active ? "rgba(0,134,83,0.12)" : "transparent",
                transition: "background .18s ease",
              }}
            >
              <Icon size={21} active={is_active} />
            </span>
            <span style={{ fontSize: 10.5, fontWeight: 700, marginTop: 3 }}>{label}</span>
          </button>
        );
      })}
    </nav>
  );
}

function HomeScreen({ is_desktop, onWalk, onPlan }: { is_desktop: boolean; onWalk: () => void; onPlan: () => void }) {
  if (is_desktop) {
    return (
      <div className="flex-1 scroll-soft" style={{ background: "#F9F9F9", overflowY: "auto", overflowX: "hidden", padding: "56px 64px" }}>
        <div className="flex gap-14" style={{ alignItems: "flex-start" }}>
          <div style={{ maxWidth: 640 }}>
            <div style={{ width: 72, height: 5, borderRadius: 999, background: "var(--grad-forest)", marginBottom: 26 }} />
            <h1 style={{ fontWeight: 800, fontSize: 46, lineHeight: 1.12, letterSpacing: "-0.015em" }}>
              Two-thirds of this campus is green. Most of us cannot name what we are walking under.
            </h1>
            <p style={{ fontSize: 18, color: "rgba(31,32,34,0.8)", marginTop: 20, lineHeight: 1.5, maxWidth: 560 }}>
              A student-led field guide for Ateneo&rsquo;s urban forest — so noticing becomes a habit, not a poster.
            </p>
            <div className="flex gap-3" style={{ marginTop: 32 }}>
              <StatTile big="1,809" line="trees geo-tagged" source="AIS · SY 2025–2026" />
              <StatTile big="101" line="threatened trees" source="AIS arboretum" />
              <StatTile big="~⅔" line="of 89 ha green" source="AIS, Loyola Heights" />
            </div>
            <div className="flex items-center gap-4" style={{ marginTop: 28 }}>
              <button
                onClick={onWalk}
                style={{ height: 52, padding: "0 30px", borderRadius: 12, background: "#008653", color: "#fff", fontWeight: 700, fontSize: 16 }}
              >
                Walk the campus
              </button>
              <button onClick={onPlan} style={{ height: 52, color: "#075D89", fontWeight: 700, fontSize: 15 }}>
                Read the plan
              </button>
            </div>
            <p style={{ fontSize: 13, color: "rgba(31,32,34,0.6)", marginTop: 28, lineHeight: 1.4 }}>
              Not a planting drive. Not a leaderboard. Not our tree inventory — AIS already counted.
            </p>
            <p style={{ fontSize: 12.5, color: "rgba(31,32,34,0.55)", marginTop: 10, lineHeight: 1.45, maxWidth: 560 }}>
              {AIS_GAP_NOTE}
            </p>
            <div style={{ marginTop: 22, maxWidth: 560 }}>
              <LandmarkCard is_desktop />
            </div>
            <div style={{ marginTop: 16, fontSize: 11, color: "rgba(31,32,34,0.45)", fontWeight: 700, letterSpacing: "0.04em" }}>
              YOUTH CLAP 2026 · ATENEO CCC
            </div>
          </div>
          <button
            onClick={onWalk}
            style={{
              width: 420,
              flexShrink: 0,
              borderRadius: CARD_RADIUS,
              overflow: "hidden",
              background: "#fff",
              border: "1.5px solid #E4E7E8",
              boxShadow: "var(--shadow-card)",
              textAlign: "left",
            }}
          >
            <div style={{ position: "relative", aspectRatio: "16 / 9" }}>
              <CampusMap
                encounter={encounter.slice(0, 5)}
                selected_id={null}
                onSelect={() => {}}
                view={{ ...CAMPUS_CENTER, zoom: OVERVIEW_ZOOM }}
                onView={() => {}}
                layer="satellite"
                is_interactive={false}
                disc_size={22}
              />
            </div>
            <div className="flex items-center justify-between" style={{ padding: "16px 18px" }}>
              <div>
                <div style={{ fontWeight: 800, fontSize: 17 }}>Open walk</div>
                <div style={{ fontSize: 13, color: "rgba(31,32,34,0.6)", marginTop: 2 }}>
                  Demo campus · {DEMO_PIN.lat}, {DEMO_PIN.lon}
                </div>
              </div>
              <span style={{ width: 40, height: 40, borderRadius: 999, background: "#008653", display: "grid", placeItems: "center", color: "#fff", fontWeight: 800 }}>
                →
              </span>
            </div>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="scroll-soft" style={{ height: "100%", overflowY: "auto", overflowX: "hidden", background: "#F9F9F9", paddingBottom: 80 }}>
      <header style={{ padding: 12 }}>
        <div className="flex items-center gap-2">
          <PlantMark size={28} />
          <div>
            <div style={{ fontWeight: 800, fontSize: 20, lineHeight: 1 }}>Field Guide</div>
            <div style={{ fontSize: 12, color: "#008653", fontWeight: 700, marginTop: 3 }}>Ateneo Loyola Heights</div>
          </div>
        </div>
      </header>
      <div style={{ paddingLeft: 20, paddingRight: 20, marginTop: 14 }}>
        <div style={{ width: 56, height: 4, borderRadius: 999, background: "var(--grad-forest)", marginBottom: 16 }} />
        <h1 style={{ fontWeight: 800, fontSize: 28, lineHeight: 1.15, letterSpacing: "-0.01em", maxWidth: 330 }}>
          Two-thirds of this campus is green. Most of us cannot name what we are walking under.
        </h1>
        <p style={{ fontSize: 15, color: "rgba(31,32,34,0.8)", marginTop: 14, lineHeight: 1.5 }}>
          A student-led field guide for Ateneo&rsquo;s urban forest — so noticing becomes a habit, not a poster.
        </p>
      </div>
      <div className="flex gap-2" style={{ padding: "18px 20px 4px" }}>
        <StatTile big="1,809" line="trees geo-tagged" source="AIS · SY 2025–2026" />
        <StatTile big="101" line="threatened trees" source="AIS arboretum" />
        <StatTile big="~⅔" line="of 89 ha green" source="AIS, Loyola Heights" />
      </div>
      <div style={{ padding: "16px 20px 0" }}>
        <button
          onClick={onWalk}
          style={{ width: "100%", height: 48, borderRadius: 12, background: "#008653", color: "#fff", fontWeight: 700, fontSize: 15 }}
        >
          Walk the campus
        </button>
        <button onClick={onPlan} style={{ width: "100%", height: 44, color: "#075D89", fontWeight: 700, fontSize: 15, marginTop: 6 }}>
          Read the plan
        </button>
      </div>
      <p style={{ fontSize: 12, color: "rgba(31,32,34,0.6)", padding: "14px 20px 0", lineHeight: 1.4 }}>
        Not a planting drive. Not a leaderboard. Not our tree inventory — AIS already counted.
      </p>
      <p style={{ fontSize: 11.5, color: "rgba(31,32,34,0.55)", padding: "8px 20px 0", lineHeight: 1.4 }}>
        {AIS_GAP_NOTE}
      </p>
      <div style={{ padding: "18px 20px 0" }}>
        <LandmarkCard is_desktop={false} />
      </div>
      <div style={{ padding: "22px 20px 0" }}>
        <span style={{ fontSize: 10.5, color: "rgba(31,32,34,0.45)", fontWeight: 700, letterSpacing: "0.04em" }}>
          YOUTH CLAP 2026 · ATENEO CCC
        </span>
      </div>
    </div>
  );
}

function LandmarkCard({ is_desktop }: { is_desktop: boolean }) {
  const row = landmark[0];
  if (!row) return null;
  const sp = species[row.species_code];
  return (
    <div
      style={{
        background: "#fff",
        border: "1.5px solid #E4E7E8",
        borderRadius: CARD_RADIUS,
        padding: is_desktop ? 20 : 16,
        display: "flex",
        gap: 14,
        alignItems: "flex-start",
      }}
    >
      <TaxonThumb species_code={row.species_code} size={is_desktop ? 92 : 64} />
      <div>
        <Eyebrow>LANDMARK TREE · {row.where.toUpperCase()}</Eyebrow>
        <div style={{ fontWeight: 800, fontSize: is_desktop ? 20 : 17, marginTop: 5 }}>{row.title}</div>
        <div style={{ fontStyle: "italic", fontSize: 12.5, color: "rgba(31,32,34,0.6)", marginTop: 2 }}>
          {sp?.scientific_name}
        </div>
        <p style={{ fontSize: 13.5, lineHeight: 1.45, marginTop: 9 }}>{row.documented}</p>
        <div
          style={{
            marginTop: 10,
            borderRadius: 14,
            background: "rgba(246,178,45,0.12)",
            border: "1px solid rgba(246,178,45,0.4)",
            padding: "10px 12px",
          }}
        >
          <div style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: "0.06em", color: "#8a5d00" }}>
            STORY NOT COLLECTED YET
          </div>
          <p style={{ fontSize: 12, lineHeight: 1.4, marginTop: 5, color: "rgba(31,32,34,0.78)" }}>{row.open_ask}</p>
        </div>
      </div>
    </div>
  );
}

/** Compact bar. Keeps the walker's own mark on the map instead of under a sheet. */
function NearbyBar({
  sp,
  where,
  distance_line,
  is_pinned,
  onUnpin,
  onExpand,
}: {
  sp: Species;
  where: string;
  distance_line: string | null;
  is_pinned: boolean;
  onUnpin: () => void;
  onExpand: () => void;
}) {
  return (
    <div
      className="absolute inset-x-0 flex items-center gap-3"
      style={{
        bottom: 64,
        background: "#F9F9F9",
        borderTop: "1.5px solid #E4E7E8",
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        boxShadow: "0 -8px 20px rgba(31,32,34,0.14)",
        zIndex: 45,
        padding: "10px 90px 10px 14px",
        animation: "fgup .28s cubic-bezier(.2,.8,.2,1)",
      }}
    >
      <button onClick={onExpand} className="flex items-center gap-3 flex-1" style={{ textAlign: "left", minWidth: 0 }}>
        <TaxonThumb species_code={sp.species_code} size={48} />
        <TaxonName
          sp={sp}
          size={17}
          eyebrow={`${is_pinned ? "PINNED" : "NEAREST"} · ${where.toUpperCase()}`}
          meta={
            distance_line ? (
              <span style={{ fontSize: 12, fontWeight: 700, color: "#075D89" }}>{distance_line}</span>
            ) : null
          }
        />
      </button>
      {is_pinned && (
        <button
          onClick={onUnpin}
          aria-label="Follow the nearest tree again"
          style={{
            height: 34,
            flexShrink: 0,
            padding: "0 12px",
            borderRadius: RADIUS.pill,
            border: "1.5px solid #E4E7E8",
            fontSize: 11.5,
            fontWeight: 700,
          }}
        >
          Unpin
        </button>
      )}
    </div>
  );
}

function NearbySheet({
  sp,
  where,
  distance_line,
  onLog,
  onDismiss,
}: {
  sp: Species;
  where: string;
  distance_line: string | null;
  onLog: () => void;
  onDismiss: () => void;
}) {
  return (
    <div
      className="absolute inset-x-0 bottom-0"
      style={{
        height: "56%",
        background: "#F9F9F9",
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        boxShadow: "0 -12px 28px rgba(31,32,34,0.16)",
        zIndex: 45,
        padding: "10px 20px 76px",
        display: "flex",
        flexDirection: "column",
        animation: "fgup .32s cubic-bezier(.2,.8,.2,1)",
      }}
    >
      <button
        onClick={onDismiss}
        aria-label="Collapse"
        style={{ display: "block", width: 40, height: 5, borderRadius: 999, background: "#E4E7E8", margin: "0 auto 12px" }}
      />
      <div className="flex items-center gap-3.5">
        <TaxonThumb species_code={sp.species_code} size={72} />
        <TaxonName
          sp={sp}
          size={23}
          eyebrow={`NEARBY · ${where.toUpperCase()}`}
          meta={
            distance_line ? (
              <span style={{ fontSize: 12.5, fontWeight: 700, color: "#075D89" }}>{distance_line}</span>
            ) : null
          }
        />
      </div>
      <div style={{ marginTop: 12 }}>
        <SpeciesPill sp={sp} />
      </div>
      <p style={{ fontSize: 14, lineHeight: 1.45, marginTop: 12, color: "#1F2022" }}>{sp.note}</p>
      {sp.caption && <div style={{ fontSize: 11, color: "rgba(31,32,34,0.5)", marginTop: 8 }}>{sp.caption}</div>}
      <div style={{ marginTop: "auto", display: "flex", gap: 10 }}>
        <button
          onClick={onLog}
          className="flex items-center justify-center gap-2"
          style={{ flex: 1, height: 48, borderRadius: 12, background: "#008653", color: "#fff", fontWeight: 700, fontSize: 15 }}
        >
          <GlyphDisc size={28}>
            <CameraIcon size={19} />
          </GlyphDisc>
          Log this sighting
        </button>
        <button
          onClick={onDismiss}
          style={{
            height: 48,
            padding: "0 18px",
            borderRadius: 12,
            background: "transparent",
            border: "1.5px solid #E4E7E8",
            color: "#1F2022",
            fontWeight: 700,
            fontSize: 14,
          }}
        >
          Not this tree
        </button>
      </div>
    </div>
  );
}

function identifyCaption(state: InatIdentifyState): string {
  if (state.status === "loading") return "iNaturalist is identifying this photo — not this app.";
  if (state.status === "offline") return "iNaturalist computer vision is unreachable. Pick from the campus list, or try again.";
  if (state.status === "empty") return "iNaturalist returned no taxon suggestion. Identification is still iNaturalist’s, not this app’s.";
  if (state.status === "needs_token") {
    return "iNaturalist computer vision needs a signed-in token on this build. Identification is iNaturalist’s, not this app’s — pick from the list or open Seek.";
  }
  if (state.status === "demo") {
    return "RECORDED RESPONSE — this build has no iNaturalist token, so it is replaying a saved reply for a Narra photo. It has not looked at your photo.";
  }
  if (state.status === "ready") return "iNaturalist is identifying — not this app. Tap a suggestion to fill the campus list, or pick yourself.";
  return "Photo is optional. A memory for your journal. Nothing is uploaded to iNaturalist as an observation.";
}

function SuggestionList({
  state,
  onPick,
}: {
  state: InatIdentifyState;
  onPick: (species_code: string) => void;
}) {
  if (state.status !== "ready" && state.status !== "demo") return null;
  const is_demo = state.status === "demo";
  return (
    <ul style={{ listStyle: "none", margin: "10px 0 0", padding: 0 }}>
      {state.suggestion.slice(0, 3).map((row) => {
        const match = campusCodeForScientific(row.scientific_name);
        return (
          <li key={`${row.rank}-${row.scientific_name}`} style={{ marginTop: 6 }}>
            <button
              type="button"
              onClick={() => {
                if (match) onPick(match);
              }}
              className="w-full"
              style={{ textAlign: "left", fontSize: 13 }}
            >
              <span style={{ fontWeight: 700 }}>{row.common_name}</span>
              <span style={{ fontStyle: "italic", color: "rgba(31,32,34,0.55)", marginLeft: 6 }}>
                {row.scientific_name}
              </span>
              <span style={{ display: "block", fontSize: 11, color: "rgba(31,32,34,0.45)" }}>
                {is_demo ? "recorded iNaturalist reply" : "iNaturalist"} · score {row.score.toFixed(2)} · #{row.rank}
                {match ? " · on our walk list" : ""}
              </span>
            </button>
          </li>
        );
      })}
    </ul>
  );
}

export interface SaveInput {
  photo_data: string | null;
  inat: { scientific_name: string | null; common_name: string | null };
  note: string | null;
}

function CameraSheet({
  pick_code,
  where,
  fix_line,
  onPick,
  onSave,
  onClose,
}: {
  pick_code: string;
  where: string;
  fix_line: string;
  onPick: (species_code: string) => void;
  onSave: (input: SaveInput) => void;
  onClose: () => void;
}) {
  const [shot, setShot] = useState<Shot | null>(null);
  const [note, setNote] = useState("");
  const [identify, setIdentify] = useState<InatIdentifyState>({ status: "idle" });

  useEffect(() => {
    if (!shot) {
      setIdentify({ status: "idle" });
      return;
    }
    let is_alive = true;
    setIdentify({ status: "loading" });
    scorePlantImage({ image: shot.blob, filename: "sighting.jpg" }).then((next) => {
      if (!is_alive) return;
      /* No token in this build — replay the recorded reply so the walk still
         shows the identify step, labelled as recorded. */
      const shown = next.status === "needs_token" ? demoIdentify() : next;
      setIdentify(shown);
      /* Only a LIVE identification may pre-fill the student's pick. A recorded
         reply is shown and tappable, never applied on their behalf. */
      if (shown.status === "ready") {
        const match = shown.suggestion
          .map((row: InatSuggestion) => campusCodeForScientific(row.scientific_name))
          .find((code): code is string => Boolean(code));
        if (match) onPick(match);
      }
    });
    return () => {
      is_alive = false;
    };
    // onPick is setState — stable. Do not re-score when the campus pick changes.
  }, [shot]);

  /* Saved as attribution only when iNaturalist actually looked at the photo. */
  const top = identify.status === "ready" ? identify.suggestion[0] : null;

  return (
    <div className="absolute inset-0" style={{ zIndex: 60 }}>
      <div className="absolute inset-0" style={{ background: "rgba(31,32,34,0.45)" }} onClick={onClose} />
      <div
        className="absolute inset-x-0 bottom-0 scroll-soft"
        style={{
          top: 24,
          background: "#F9F9F9",
          borderTopLeftRadius: 24,
          borderTopRightRadius: 24,
          overflowY: "auto",
          padding: "16px 20px 24px",
          animation: "fgup .3s cubic-bezier(.2,.8,.2,1)",
        }}
      >
        <div className="flex items-center justify-between">
          <div>
            <div style={{ fontWeight: 800, fontSize: 18 }}>Log a sighting</div>
            <div style={{ fontSize: 12, color: "rgba(31,32,34,0.6)", marginTop: 2 }}>{where}</div>
          </div>
          <button onClick={onClose} aria-label="Close">
            <CloseIcon />
          </button>
        </div>

        <div style={{ marginTop: 14 }}>
          <Viewfinder shot={shot} onShot={setShot} onClear={() => setShot(null)} />
        </div>

        <div className="flex items-start gap-2" style={{ marginTop: 10 }}>
          <span style={{ flexShrink: 0, marginTop: 1 }}>
            <LeafScanIcon size={16} />
          </span>
          <div style={{ fontSize: 11, color: "rgba(31,32,34,0.5)", lineHeight: 1.4 }}>{identifyCaption(identify)}</div>
        </div>
        <SuggestionList state={identify} onPick={onPick} />
        {!hasInatToken() && (
          <div style={{ fontSize: 11, color: "rgba(31,32,34,0.45)", marginTop: 6 }}>
            Set <code>VITE_INAT_API_TOKEN</code> before building to run live iNaturalist computer vision instead.
          </div>
        )}

        <div className="flex items-center gap-1.5" style={{ marginTop: 14, fontSize: 12, color: "rgba(31,32,34,0.7)" }}>
          <PinIcon size={16} />
          {fix_line}
        </div>

        <div style={{ marginTop: 18 }}><Eyebrow>WHAT DID YOU SEE?</Eyebrow></div>
        <div style={{ marginTop: 8, border: "1.5px solid #E4E7E8", borderRadius: 16, overflow: "hidden" }}>
          {picker_order.map((species_code, i) => {
            const sp = species[species_code];
            const is_active = species_code === pick_code;
            return (
              <button
                key={species_code}
                onClick={() => onPick(species_code)}
                className="w-full flex items-center justify-between"
                style={{
                  padding: "12px 14px",
                  background: is_active ? "rgba(0,134,83,0.08)" : "transparent",
                  borderTop: i === 0 ? "none" : "1px solid #E4E7E8",
                  textAlign: "left",
                }}
              >
                <span className="flex items-center gap-3">
                  <TaxonThumb species_code={species_code} size={44} />
                  <span style={{ minWidth: 0 }}>
                    <span style={{ display: "block", fontWeight: 700, fontSize: 15, lineHeight: 1.2 }}>
                      {sp.common_name}
                    </span>
                    <span style={{ display: "block", fontStyle: "italic", fontSize: 11.5, color: "rgba(31,32,34,0.6)" }}>
                      {sp.scientific_name}
                    </span>
                  </span>
                </span>
                <PrimaryPill sp={sp} />
              </button>
            );
          })}
        </div>

        <label style={{ display: "block", marginTop: 16 }}>
          <span style={{ fontSize: 11, fontWeight: 700, color: "#008653", letterSpacing: "0.06em" }}>
            FIELD NOTE (OPTIONAL)
          </span>
          <textarea
            value={note}
            onChange={(ev) => setNote(ev.target.value)}
            rows={2}
            placeholder="Flowering. Big buttress roots. Beside the covered walk."
            style={{
              display: "block",
              width: "100%",
              marginTop: 8,
              borderRadius: 14,
              border: "1.5px solid #E4E7E8",
              background: "#fff",
              padding: "10px 12px",
              fontSize: 14,
              fontFamily: "inherit",
              resize: "vertical",
            }}
          />
        </label>

        <p style={{ fontSize: 12, color: "rgba(31,32,34,0.65)", marginTop: 14, lineHeight: 1.45 }}>
          iNaturalist is identifying, not this app. Ateneo already published an invasive-species image classifier (Aliño,
          Fernandez, Diesmos 2023) — we are not rebuilding that either. For a second opinion, open Seek, or on iPhone Look Up
          the photo in Photos. The journal stays on this device.{" "}
          <a href={SEEK_URL} target="_blank" rel="noreferrer" style={{ color: "#058CD6", textDecoration: "underline", fontWeight: 700 }}>
            Open Seek
          </a>
        </p>
        <button
          onClick={() =>
            onSave({
              photo_data: shot?.data_url ?? null,
              inat: {
                scientific_name: top?.scientific_name ?? null,
                common_name: top?.common_name ?? null,
              },
              note: note.trim() || null,
            })
          }
          style={{ width: "100%", height: 48, borderRadius: 12, background: "#008653", color: "#fff", fontWeight: 700, fontSize: 15, marginTop: 16 }}
        >
          Save to my journal
        </button>
      </div>
    </div>
  );
}

/**
 * Collection grid — Seek's shape: one circular badge per species, colour when
 * seen, grey silhouette when not. A badge is a fact about your own walking, not
 * a score, so nothing here counts up against anybody else.
 */
function JournalGrid({ seen, is_desktop }: { seen: Set<string>; is_desktop: boolean }) {
  return (
    <div
      className="grid gap-x-3 gap-y-5"
      style={{ gridTemplateColumns: `repeat(${is_desktop ? 5 : 3}, minmax(0, 1fr))` }}
    >
      {journal_order.map((species_code) => {
        const sp = species[species_code];
        const is_seen = seen.has(species_code) && Boolean(sp);
        return (
          <div key={species_code} style={{ textAlign: "center", minWidth: 0 }}>
            <TaxonThumb
              species_code={species_code}
              size={is_desktop ? 104 : 92}
              is_dim={!is_seen}
              style={{ margin: "0 auto" }}
            />
            {is_seen ? (
              <>
                <div style={{ fontWeight: 800, fontSize: 13, marginTop: 8, lineHeight: 1.2 }}>{sp.common_name}</div>
                <div
                  style={{
                    fontStyle: "italic",
                    fontSize: 10.5,
                    color: "rgba(31,32,34,0.55)",
                    marginTop: 2,
                    lineHeight: 1.25,
                  }}
                >
                  {sp.scientific_name}
                </div>
                <div style={{ marginTop: 6, display: "flex", justifyContent: "center" }}>
                  <PrimaryPill sp={sp} />
                </div>
              </>
            ) : (
              <div style={{ fontSize: 11.5, fontWeight: 700, color: "rgba(31,32,34,0.5)", marginTop: 8 }}>
                Not yet
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

function SummaryStrip({ sighting }: { sighting: Sighting[] }) {
  const summary = useMemo(() => summarize(sighting), [sighting]);
  const top_species = summary.by_species.slice(0, 4);
  return (
    <Card>
      <div className="flex gap-2">
        <StatTile big={String(summary.sighting_count)} line="sightings" source="this device" />
        <StatTile big={String(summary.species_count)} line="species" source="your journal" />
        <StatTile big={String(summary.located_count)} line="located" source="GPS or demo walk" />
      </div>
      <div style={{ marginTop: 16 }}><Eyebrow>BY SPECIES</Eyebrow></div>
      <div style={{ marginTop: 8 }}>
        {top_species.map((row) => {
          const sp = species[row.key];
          const width = (row.count / top_species[0].count) * 100;
          return (
            <div key={row.key} style={{ marginTop: 8 }}>
              <div className="flex items-center justify-between" style={{ fontSize: 13 }}>
                <span style={{ fontWeight: 700 }}>{sp?.common_name ?? row.key}</span>
                <span style={{ color: "rgba(31,32,34,0.6)" }}>{row.count}</span>
              </div>
              <div style={{ height: 6, borderRadius: 999, background: "#EEF1F0", marginTop: 4 }}>
                <div style={{ width: `${width}%`, height: "100%", borderRadius: 999, background: "var(--grad-forest)" }} />
              </div>
            </div>
          );
        })}
      </div>
      <div style={{ marginTop: 16 }}><Eyebrow>BY DAY</Eyebrow></div>
      <div className="flex flex-wrap gap-1.5" style={{ marginTop: 8 }}>
        {summary.by_day.slice(0, 8).map((row) => (
          <Pill key={row.key}>
            {row.key} · {row.count}
          </Pill>
        ))}
      </div>
      <p style={{ fontSize: 11.5, color: "rgba(31,32,34,0.5)", marginTop: 14, lineHeight: 1.4 }}>
        Counts and groupings only — no score, no rank, nobody else&rsquo;s journal. {summary.photo_count} of{" "}
        {summary.sighting_count} carry a photo.
      </p>
    </Card>
  );
}

function ExportRow({ sighting }: { sighting: Sighting[] }) {
  const located = sighting.filter((s) => s.lat !== null).length;
  const stamp = new Date().toISOString().slice(0, 10);
  return (
    <Card style={{ marginTop: 16, background: "transparent" }}>
      <Eyebrow>HAND IT OVER</Eyebrow>
      <p style={{ fontSize: 13.5, lineHeight: 1.45, marginTop: 8 }}>{AIS_GAP_NOTE}</p>
      <p style={{ fontSize: 12, color: "rgba(31,32,34,0.6)", marginTop: 8, lineHeight: 1.4 }}>
        Nothing leaves this device on its own. These buttons write a file you choose to share. Photos are not included.
      </p>
      <div className="flex gap-2" style={{ marginTop: 12 }}>
        <button
          type="button"
          disabled={located === 0}
          onClick={() =>
            downloadText(
              `field-guide-sighting-${stamp}.geojson`,
              JSON.stringify(toGeoJson(sighting), null, 2),
              "application/geo+json",
            )
          }
          style={{
            flex: 1,
            height: 44,
            borderRadius: 12,
            border: "1.5px solid #E4E7E8",
            fontWeight: 700,
            fontSize: 14,
            opacity: located === 0 ? 0.45 : 1,
          }}
        >
          <span className="flex items-center justify-center gap-2">
            <ExportIcon size={18} />
            GeoJSON · {located}
          </span>
        </button>
        <button
          type="button"
          disabled={sighting.length === 0}
          onClick={() => downloadText(`field-guide-sighting-${stamp}.csv`, toCsv(sighting), "text/csv")}
          style={{
            flex: 1,
            height: 44,
            borderRadius: 12,
            border: "1.5px solid #E4E7E8",
            fontWeight: 700,
            fontSize: 14,
            opacity: sighting.length === 0 ? 0.45 : 1,
          }}
        >
          <span className="flex items-center justify-center gap-2">
            <ExportIcon size={18} />
            CSV · {sighting.length}
          </span>
        </button>
      </div>
    </Card>
  );
}

function SightingLog({ sighting }: { sighting: Sighting[] }) {
  const row = [...sighting].reverse().slice(0, 12);
  return (
    <div style={{ marginTop: 16 }}>
      <Eyebrow>WHAT YOU LOGGED</Eyebrow>
      <div style={{ marginTop: 8, border: "1.5px solid #E4E7E8", borderRadius: 20, overflow: "hidden", background: "#fff" }}>
        {row.map((s, i) => {
          const sp = species[s.species_code];
          return (
            <div
              key={s.sighting_id}
              className="flex items-start gap-3"
              style={{ padding: "12px 14px", borderTop: i === 0 ? "none" : "1px solid #E4E7E8" }}
            >
              <TaxonThumb species_code={s.species_code} size={52} photo_data={s.photo_data} />
              <div style={{ minWidth: 0 }}>
                <div style={{ fontWeight: 700, fontSize: 14.5 }}>{sp?.common_name ?? s.species_code}</div>
                <div style={{ fontSize: 11.5, color: "rgba(31,32,34,0.55)", marginTop: 2 }}>
                  {s.created_at ? new Date(s.created_at).toLocaleString() : "—"}
                </div>
                <div style={{ fontSize: 11.5, color: "rgba(31,32,34,0.6)", marginTop: 3 }}>
                  {s.lat !== null && s.lon !== null ? (
                    <>
                      {formatLatLon({ lat: s.lat, lon: s.lon })}
                      {s.accuracy_m !== null && ` · ±${Math.round(s.accuracy_m)} m`}
                      {s.fix_source === "demo" && " · demo walk"}
                    </>
                  ) : (
                    "no position recorded"
                  )}
                </div>
                {s.note && (
                  <div style={{ fontSize: 12.5, color: "rgba(31,32,34,0.8)", marginTop: 5, lineHeight: 1.4 }}>{s.note}</div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function JournalScreen({
  sighting,
  seen,
  is_desktop,
}: {
  sighting: Sighting[];
  seen: Set<string>;
  is_desktop: boolean;
}) {
  if (seen.size === 0) {
    return (
      <div
        className="scroll-soft"
        style={{
          height: "100%",
          overflowY: "auto",
          background: "#F9F9F9",
          padding: is_desktop ? "40px 72px" : "20px 20px 80px",
          display: "grid",
          placeItems: "center",
        }}
      >
        <div style={{ textAlign: "center" }}>
          <img src={spot.empty_journal} width={120} height={120} alt="" style={{ margin: "0 auto" }} />
          <p style={{ fontWeight: 800, fontSize: 18, marginTop: 12 }}>Walk a path. Log what you see.</p>
          <p style={{ fontSize: 12, color: "rgba(31,32,34,0.55)", marginTop: 10, maxWidth: 320, lineHeight: 1.45 }}>
            Reflection, not a race. Ateneo already designed an SDG game that way (Rodrigo, Favis, Cuyegkeng 2021 — RECIPE /
            Meaningful Gamification).
          </p>
        </div>
      </div>
    );
  }
  return (
    <div
      className="scroll-soft"
      style={{
        height: "100%",
        overflowY: "auto",
        overflowX: "hidden",
        background: "#F9F9F9",
        padding: is_desktop ? "40px 72px 48px" : "18px 20px 80px",
      }}
    >
      <div style={{ maxWidth: is_desktop ? 720 : undefined, margin: is_desktop ? "0 auto" : undefined }}>
        <div className="flex items-center gap-3">
          <img src={spot.success_log} width={56} height={56} alt="" />
          <h1 style={{ fontWeight: 800, fontSize: is_desktop ? 30 : 24 }}>Your journal</h1>
        </div>
        <p style={{ fontSize: 13, color: "#008653", marginTop: 2 }}>Stays on this phone.</p>
        <p style={{ fontSize: 12, color: "rgba(31,32,34,0.55)", marginTop: 8, lineHeight: 1.45 }}>
          Reflection, not a race. Ateneo already designed an SDG game that way (Rodrigo, Favis, Cuyegkeng 2021 — RECIPE /
          Meaningful Gamification).
        </p>
        <div style={{ marginTop: 16 }}>
          <SummaryStrip sighting={sighting} />
        </div>
        <div style={{ marginTop: 24 }}>
          <Eyebrow>YOUR COLLECTION</Eyebrow>
        </div>
        <div style={{ marginTop: 14 }}>
          <JournalGrid seen={seen} is_desktop={is_desktop} />
        </div>
        <p style={{ fontSize: 12, color: "rgba(31,32,34,0.55)", marginTop: 14 }}>12 of a starter list — not the 1,809.</p>
        <SightingLog sighting={sighting} />
        <ExportRow sighting={sighting} />
      </div>
    </div>
  );
}

function PlanContent() {
  return (
    <>
      <h1 style={{ fontWeight: 800, fontSize: 24, lineHeight: 1.15 }}>What happens after the walk</h1>
      <div style={{ width: 48, height: 4, borderRadius: 999, background: "var(--grad-lagoon)", marginTop: 12 }} />
      <section style={{ marginTop: 20, borderRadius: 24, border: "1.5px solid #E4E7E8", padding: 16 }}>
        <Eyebrow>1 · WHAT THIS WEBSITE IS FOR</Eyebrow>
        <p style={{ fontSize: 14.5, lineHeight: 1.5, marginTop: 8 }}>
          Formation, first: help students notice and name the trees they walk under every day. And a public map they can
          actually use — not a report that sits in a drawer.
        </p>
      </section>
      <section style={{ marginTop: 16, borderRadius: 24, border: "1.5px solid #E4E7E8", padding: 16 }}>
        <Eyebrow>2 · WHO WE STILL NEED TO TALK TO</Eyebrow>
        <p style={{ fontSize: 12, color: "rgba(31,32,34,0.6)", marginTop: 6 }}>
          Nothing here is agreed yet. We are not claiming a consultation we have not held.
        </p>
        <div
          style={{
            marginTop: 10,
            borderRadius: 16,
            background: "rgba(0,134,83,0.06)",
            border: "1px solid rgba(0,134,83,0.25)",
            padding: "12px 14px",
          }}
        >
          <p style={{ fontSize: 13, lineHeight: 1.45 }}>{AIS_GAP_NOTE}</p>
          <p style={{ fontSize: 13, lineHeight: 1.45, marginTop: 8 }}>{WILD_NOTE}</p>
        </div>
        <div style={{ marginTop: 8 }}>
          {consult.map((row) => (
            <div key={row.consult_id} style={{ padding: "12px 0", borderTop: "1px solid #E4E7E8" }}>
              <div className="flex items-start justify-between gap-3">
                <span style={{ fontSize: 14, fontWeight: 500, lineHeight: 1.35 }}>{row.label}</span>
                <Pill tone="exotic">not yet</Pill>
              </div>
              {row.detail && (
                <p style={{ fontSize: 12, color: "rgba(31,32,34,0.6)", marginTop: 6, lineHeight: 1.4 }}>{row.detail}</p>
              )}
            </div>
          ))}
        </div>
      </section>
      <section style={{ marginTop: 16, borderRadius: 24, border: "1.5px solid #E4E7E8", padding: 16 }}>
        <Eyebrow>3 · HOW ANOTHER CAMPUS COPIES THIS</Eyebrow>
        <ul style={{ marginTop: 8, paddingLeft: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: 8 }}>
          {[
            "A walkable-path map — only where students can actually go.",
            "A curated species list from whoever already counted.",
            "A personal journal with no rank.",
            "A geofence for off-limits ground.",
          ].map((t) => (
            <li key={t} style={{ fontSize: 14.5, lineHeight: 1.45, display: "flex", gap: 10 }}>
              <span style={{ color: "#45C223", fontWeight: 800 }}>—</span>
              <span>{t}</span>
            </li>
          ))}
        </ul>
        <p style={{ fontSize: 13, lineHeight: 1.45, marginTop: 12, color: "rgba(31,32,34,0.75)" }}>
          Ateneo sits in AUN ecological-education networks (Delocado, Tuaño, Lacdao-Umali 2025) — that is a carrier, not a
          second app.
        </p>
      </section>
      <p style={{ fontSize: 11, color: "rgba(31,32,34,0.5)", marginTop: 26, lineHeight: 1.4 }}>
        Youth CLAP 2026 · student prototype · not an official AIS product.
      </p>
    </>
  );
}

function PlanScreen({ is_desktop }: { is_desktop: boolean }) {
  return (
    <div
      className="scroll-soft"
      style={{
        height: "100%",
        overflowY: "auto",
        overflowX: "hidden",
        background: "#F9F9F9",
        padding: is_desktop ? "40px 72px" : "18px 20px 80px",
      }}
    >
      <div style={{ maxWidth: 720, margin: is_desktop ? "0 auto" : undefined }}>
        <PlanContent />
      </div>
    </div>
  );
}

function DesktopTopBar({
  route,
  onRoute,
  is_demo,
  onDemo,
  seen_count,
  is_wide,
}: {
  route: Route;
  onRoute: (r: Route) => void;
  is_demo: boolean;
  onDemo: () => void;
  seen_count: number;
  is_wide: boolean;
}) {
  /* Same four glyphs as the phone. A desktop menu of bare words read like a
     different product, and the kit already had the icons. */
  const tab: { id: Route; label: string; Icon: typeof HomeIcon }[] = [
    { id: "/", label: "Home", Icon: HomeIcon },
    { id: "/map", label: "Map", Icon: MapIcon },
    { id: "/journal", label: "Journal", Icon: JournalIcon },
    { id: "/plan", label: "Plan", Icon: PlanIcon },
  ];
  return (
    <header
      className="flex items-center"
      style={{ height: 64, background: "#F9F9F9", borderBottom: "1.5px solid #E4E7E8", padding: "0 28px", flexShrink: 0 }}
    >
      <button
        onClick={() => onRoute("/")}
        className="flex items-center gap-2.5"
        style={{ width: is_wide ? 260 : 200, flexShrink: 0, textAlign: "left" }}
      >
        <PlantMark size={32} />
        <span>
          <span style={{ display: "block", fontWeight: 800, fontSize: 18, lineHeight: 1 }}>Field Guide</span>
          <span style={{ display: "block", fontSize: 11, color: "#008653", fontWeight: 700, marginTop: 2 }}>
            Ateneo Loyola Heights
          </span>
        </span>
      </button>
      <nav className="flex-1 flex items-center justify-center" style={{ gap: is_wide ? 8 : 2, minWidth: 0 }}>
        {tab.map(({ id, label, Icon }) => {
          const is_active = route === id;
          return (
            <button
              key={id}
              onClick={() => onRoute(id)}
              aria-current={is_active ? "page" : undefined}
              className="flex items-center gap-2"
              style={{
                fontWeight: 700,
                fontSize: 14.5,
                color: is_active ? "#008653" : "rgba(31,32,34,0.72)",
                background: is_active ? "rgba(0,134,83,0.12)" : "transparent",
                borderRadius: RADIUS.pill,
                padding: is_wide ? "8px 16px" : "8px 11px",
                whiteSpace: "nowrap",
                transition: "background .18s ease, color .18s ease",
              }}
            >
              <Icon size={19} active={is_active} />
              {label}
            </button>
          );
        })}
      </nav>
      <div className="flex items-center gap-3" style={{ width: is_wide ? 260 : 200, flexShrink: 0, justifyContent: "flex-end" }}>
        {/* Replaces a dead `EN` span that looked like a locale switcher this app
            has never had. This one is a real number from the real journal. */}
        {is_wide && (
          <button
            onClick={() => onRoute("/journal")}
            className="flex items-center gap-1.5"
            style={{ fontSize: 12.5, fontWeight: 700, color: "rgba(31,32,34,0.62)" }}
          >
            <JournalIcon size={17} active={false} />
            {seen_count} logged
          </button>
        )}
        <Chip is_on={is_demo} onClick={onDemo}>
          <LocateIcon size={15} />
          Demo campus
        </Chip>
      </div>
    </header>
  );
}

/**
 * The two things the map has to keep saying out loud, in one place instead of
 * two floating cards that collided over the imagery: the grove is off-limits
 * and its extent is a placeholder, and the green you see is the photograph
 * rather than a layer we computed.
 */
function MapNote({ is_desktop, layer }: { is_desktop: boolean; layer: Layer }) {
  return (
    <div
      className="absolute"
      style={{
        left: is_desktop ? 18 : 12,
        bottom: is_desktop ? 30 : 176,
        zIndex: 20,
        maxWidth: is_desktop ? 330 : 250,
        background: "rgba(249,249,249,0.93)",
        border: "1.5px solid #E4E7E8",
        borderRadius: 16,
        padding: "9px 12px",
        boxShadow: "var(--shadow-card)",
        backdropFilter: "blur(6px)",
      }}
    >
      <div className="flex items-start gap-2">
        <span style={{ flexShrink: 0, marginTop: 1 }}>
          <RestrictedIcon size={17} />
        </span>
        <div style={{ fontSize: 11, lineHeight: 1.35 }}>
          {is_desktop ? (
            <>
              <strong style={{ fontWeight: 700 }}>Observed from the path.</strong> That grove is off-limits and nothing
              spawns inside it. The hatched shape is a placeholder extent — nobody has given us the surveyed boundary.
            </>
          ) : (
            <>
              <strong style={{ fontWeight: 700 }}>Off-limits grove.</strong> Nothing spawns inside. Hatch is a
              placeholder, not surveyed.
            </>
          )}
        </div>
      </div>
      {layer === "satellite" && is_desktop && (
        <div
          style={{
            fontSize: 10.5,
            lineHeight: 1.35,
            color: "rgba(31,32,34,0.6)",
            marginTop: 7,
            paddingTop: 7,
            borderTop: "1px solid #E4E7E8",
          }}
        >
          Canopy here is the imagery itself — we compute no green-cover layer. The urban-canopy and heat claim is
          Llorin et al. 2024 (Manila Observatory).
        </div>
      )}
    </div>
  );
}

function Toast({ msg }: { msg: string }) {
  return (
    <div
      className="absolute"
      style={{
        left: "50%",
        bottom: 84,
        transform: "translateX(-50%)",
        background: "#F9F9F9",
        border: "1.5px solid #E4E7E8",
        borderRadius: 999,
        padding: "12px 18px",
        fontSize: 13,
        fontWeight: 700,
        boxShadow: "var(--shadow-card)",
        zIndex: 70,
        whiteSpace: "nowrap",
        animation: "fgfade .25s ease-out",
        display: "flex",
        alignItems: "center",
        gap: 8,
      }}
    >
      <CheckIcon size={20} />
      {msg}
    </div>
  );
}

/**
 * `is_desktop` switches the layout; `is_wide` decides whether the header has
 * room for its optional control. At 900 the fixed side columns crushed the nav.
 */
function useDesktop() {
  const read = () => ({ is_desktop: window.innerWidth >= 900, is_wide: window.innerWidth >= 1120 });
  const [size, setSize] = useState(read);
  useEffect(() => {
    const onResize = () => setSize(read());
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);
  return size;
}

export default function App() {
  const [route, setRoute] = useState<Route>(() => pathToRoute(window.location.pathname));
  const [is_restricted, setRestricted] = useState(true);
  /* `guide` reads better on a walk than imagery; satellite is one tap away. */
  const [layer, setLayer] = useState<Layer>("guide");
  const [view, setView] = useState<View>(() => ({ ...CAMPUS_CENTER, zoom: WALK_ZOOM }));
  /* Off the moment the walker pans or zooms — a map that fights the hand is worse
     than one that stops following. The Recentre control turns it back on. */
  const [is_following, setFollowing] = useState(true);
  const [is_camera_open, setCameraOpen] = useState(false);
  /** Set only when the walker taps a disc. Otherwise the card follows nearest. */
  const [pinned_id, setPinnedId] = useState<string | null>(null);
  const [is_sheet_open, setSheetOpen] = useState(false);
  const [pick_code, setPickCode] = useState("narra");
  const [sighting, setSighting] = useState<Sighting[]>(() => readSighting());
  const [is_demo, setDemo] = useState(true);
  const [toast, setToast] = useState<string | null>(null);
  const [inat, setInat] = useState<InatNearbyState>({ status: "idle" });
  const [walk, setWalk] = useState<Walk | null>(() => readWalk());
  const { is_desktop, is_wide } = useDesktop();
  const geo = useGeo(is_demo);
  const seen = seenCode(sighting);

  const ranked = useMemo(() => (geo.fix ? rankEncounter(geo.fix) : []), [geo.fix]);
  const nearest = ranked[0] ?? null;
  const distance_of = (encounter_id: string) =>
    ranked.find((r) => r.row.encounter_id === encounter_id) ?? null;

  /* Follow the walker until a gesture says otherwise. */
  useEffect(() => {
    if (!is_following || !geo.fix) return;
    setView((prev) => ({ ...prev, lat: geo.fix!.lat, lon: geo.fix!.lon }));
  }, [is_following, geo.fix?.lat, geo.fix?.lon]);

  /* One tap before the demo, so offline covers the campus and not just wherever
     the map happened to be panned. Production only — a dev build has no worker
     to store them in. */
  const [warm, setWarm] = useState<{ done: number; total: number } | null>(null);

  /**
   * Warm the layer you are on, plus Satellite.
   *
   * Warming only the active layer meant tapping "Save offline" on Guide and
   * then finding a blank map the moment you switched to Satellite on stage —
   * which is the switch the canopy line on `/map` invites you to make.
   *
   * Not all four, deliberately. Trail is CyclOSM, a volunteer-run server whose
   * usage policy asks people not to bulk-download, and it already answers a
   * share of requests with 502 under load. Pulling ~220 tiles off it to make a
   * demo smoother is not a cost worth passing to them.
   */
  const warmCampus = () => {
    if (warm && warm.done < warm.total) return;
    const target: Layer[] = layer === "satellite" ? ["satellite"] : [layer, "satellite"];
    setWarm({ done: 0, total: 1 });
    void (async () => {
      let done = 0;
      let total = 0;
      const tally: { done: number; total: number }[] = target.map(() => ({ done: 0, total: 0 }));
      const sum = () => {
        done = tally.reduce((n, t) => n + t.done, 0);
        total = tally.reduce((n, t) => n + t.total, 0);
        setWarm({ done, total: Math.max(total, 1) });
      };
      for (const [i, one] of target.entries()) {
        await prefetchCampus(one, [17, 18, 19], (d, t) => {
          tally[i] = { done: d, total: t };
          sum();
        });
      }
      sum();
      showToast(`${done} tiles ready offline · ${target.map((t) => SOURCE[t].label).join(" + ")}`);
    })();
  };

  const recentre = () => {
    setFollowing(true);
    setView((prev) => ({ ...prev, ...(geo.fix ?? CAMPUS_CENTER) }));
  };

  const go = (next: Route) => {
    if (window.location.pathname !== next) {
      window.history.pushState({}, "", next);
    }
    setRoute(next);
    setCameraOpen(false);
    if (next !== "/map") setRestricted(true);
  };

  useEffect(() => {
    const onPop = () => setRoute(pathToRoute(window.location.pathname));
    window.addEventListener("popstate", onPop);
    if (window.location.pathname !== route) {
      window.history.replaceState({}, "", route);
    }
    /* Production only. Under `vite dev` every module is an unhashed same-origin
       GET, so a caching worker pins the app to a stale revision — that produced
       a white screen and a bogus "does not provide an export named" once. */
    if (import.meta.env.PROD && "serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js").catch(() => {});
    } else if (!import.meta.env.PROD && "serviceWorker" in navigator) {
      /* Clean up after any worker a previous dev session left registered.
         Drop the caches only once every worker is gone, or a still-controlling
         worker can re-populate one behind the delete. */
      void navigator.serviceWorker
        .getRegistrations()
        .then((row) => Promise.all(row.map((r) => r.unregister())))
        .then(() => ("caches" in window ? caches.keys() : Promise.resolve([])))
        .then((name) => Promise.all(name.map((n) => caches.delete(n))));
    }
    return () => window.removeEventListener("popstate", onPop);
  }, [route]);

  useEffect(() => {
    if (route !== "/map") return;
    let is_alive = true;
    setInat((prev) => (prev.status === "ready" ? prev : { status: "loading" }));
    loadInatNearby().then((next) => {
      if (is_alive) setInat(next);
    });
    return () => {
      is_alive = false;
    };
  }, [route]);

  const showToast = (m: string) => {
    setToast(m);
    window.setTimeout(() => setToast(null), 2000);
  };

  const selected_id = pinned_id ?? nearest?.row.encounter_id ?? encounter[0].encounter_id;
  const sel = encounter.find((e) => e.encounter_id === selected_id) ?? encounter[0];
  const sel_sp = species[sel.species_code];

  /* Walking into an encounter's radius pins it, so the card holds still while
     the walker photographs the tree instead of flicking to whatever is nearer. */
  const at_id = nearest?.is_at ? nearest.row.encounter_id : null;
  useEffect(() => {
    if (at_id) setPinnedId(at_id);
  }, [at_id]);

  const openCamera = (species_code: string) => {
    setPickCode(species_code);
    setCameraOpen(true);
  };

  const saveSighting = ({ photo_data, inat: id, note }: SaveInput) => {
    addSighting({
      species_code: pick_code,
      photo_data,
      inat_scientific_name: id.scientific_name,
      inat_common_name: id.common_name,
      point: geo.fix
        ? { lat: geo.fix.lat, lon: geo.fix.lon, accuracy_m: geo.fix.accuracy_m, source: geo.fix.source }
        : null,
      note,
      walk_id: walk?.walk_id ?? null,
    });
    setSighting(readSighting());
    setCameraOpen(false);
    go("/journal");
    showToast(`${species[pick_code].common_name} added to your journal.`);
  };

  const toggleWalk = () => {
    if (walk) {
      endWalk();
      setWalk(null);
      showToast("Walk ended. Your sightings stay in the journal.");
      return;
    }
    setWalk(startWalk());
    showToast("Walk started. Log what you pass.");
  };

  const walk_count = walk ? sighting.filter((row) => row.walk_id === walk.walk_id).length : 0;

  const fix_line = geo.fix
    ? `${formatLatLon(geo.fix)} · ±${Math.round(geo.fix.accuracy_m)} m · ${geo.fix.source === "demo" ? "demo walk" : "this device"}`
    : "No position — this sighting will be saved without one.";

  const selected_near = distance_of(sel.encounter_id);
  const selected_distance = selected_near
    ? selected_near.distance_m <= AT_TREE_RADIUS_M
      ? "You are at this tree"
      : selected_near.is_at
        ? `In range · ${formatMeter(selected_near.distance_m)} away`
        : `${formatMeter(selected_near.distance_m)} ${selected_near.compass} of you`
    : null;

  /* The desktop kiosk header already owns the Demo toggle — don't print two. */
  const geo_chip = (
    <div className="flex items-center gap-2">
      <Chip
        is_on={is_demo}
        onClick={() => setDemo((d) => !d)}
        style={{ display: is_desktop ? "none" : "flex" }}
      >
        <LocateIcon size={15} />
        {is_demo ? "Demo campus" : geo.status === "watching" ? "Live GPS" : "Real GPS"}
      </Chip>
      <Chip is_on={Boolean(walk)} tone="#075D89" onClick={toggleWalk}>
        <WalkIcon size={15} />
        {walk ? `End walk · ${walk_count}` : "Start a walk"}
      </Chip>
      <Chip is_on={is_following} onClick={recentre} style={{ display: is_desktop ? "flex" : "none" }}>
        <LocateIcon size={15} />
        {is_following ? "Following" : "Recentre"}
      </Chip>
      <Chip
        is_on={Boolean(warm && warm.done >= warm.total)}
        onClick={warmCampus}
        style={{ display: is_desktop ? "flex" : "none" }}
      >
        <ExportIcon size={15} />
        {warm ? (warm.done >= warm.total ? "Offline ready" : `${warm.done}/${warm.total}`) : "Save offline"}
      </Chip>
    </div>
  );

  const geo_line =
    geo.message ??
    (geo.is_off_campus
      ? "You are outside the Loyola Heights frame — switch Demo campus on to show the walk here."
      : geo.fix
        ? `${formatLatLon(geo.fix)} · ±${Math.round(geo.fix.accuracy_m)} m`
        : "Waiting for a position…");

  const mapBody = (
    <div style={{ position: "absolute", inset: 0 }}>
      <CampusMap
        encounter={encounter}
        selected_id={selected_id}
        onSelect={(encounter_id) => {
          setPinnedId(encounter_id);
          setSheetOpen(true);
          setRestricted(true);
        }}
        view={view}
        onView={setView}
        onGesture={() => setFollowing(false)}
        layer={layer}
        fix={geo.fix}
        is_restricted_on={is_restricted}
        at_id={at_id}
        disc_size={is_desktop ? 38 : 32}
      />
      {!is_desktop && (
        <div
          className="absolute inset-x-0 top-0 flex items-center"
          style={{ height: 56, background: "rgba(249,249,249,0.88)", backdropFilter: "blur(6px)", zIndex: 20, padding: "0 16px" }}
        >
          <PlantMark size={24} />
          <span style={{ fontWeight: 800, fontSize: 15, marginLeft: 8 }}>Walk the campus</span>
        </div>
      )}
      {!is_desktop && (
        <div className="absolute" style={{ top: 62, left: 12, right: 12, zIndex: 25 }}>
          <div className="flex flex-wrap items-center gap-2">
            {geo_chip}
            <Chip
              /* Lit once you have moved off the friendly default. */
              is_on={layer !== "guide"}
              onClick={() => setLayer(nextLayer)}
            >
              <CanopyIcon size={16} />
              {SOURCE[layer].label}
            </Chip>
            <Chip is_on={is_following} onClick={recentre}>
              <LocateIcon size={15} />
              {is_following ? "Following" : "Recentre"}
            </Chip>
            <Chip is_on={Boolean(warm && warm.done >= warm.total)} onClick={warmCampus}>
              <ExportIcon size={15} />
              {warm ? (warm.done >= warm.total ? "Offline ready" : `${warm.done}/${warm.total}`) : "Save offline"}
            </Chip>
          </div>
          <div
            style={{
              marginTop: 6,
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              background: "rgba(249,249,249,0.94)",
              border: "1.5px solid #E4E7E8",
              borderRadius: 999,
              padding: "5px 10px",
              fontSize: 11,
              fontWeight: 600,
              color: "rgba(31,32,34,0.7)",
              boxShadow: "var(--shadow-card)",
            }}
          >
            <PinIcon size={13} />
            {geo_line}
          </div>
        </div>
      )}
      <button
        onClick={() => setLayer(nextLayer)}
        className="absolute flex items-center gap-1.5"
        style={{
          display: is_desktop ? "flex" : "none",
          top: 18,
          right: 12,
          zIndex: 20,
          background: "#F9F9F9",
          border: "1.5px solid #E4E7E8",
          borderRadius: 999,
          padding: "7px 12px",
          fontSize: 12,
          fontWeight: 700,
          boxShadow: "var(--shadow-card)",
        }}
      >
        <CanopyIcon size={18} />
        {SOURCE[layer].label}
        <span style={{ fontWeight: 400, opacity: 0.55 }}>
          {LAYER_ORDER.indexOf(layer) + 1}/{LAYER_ORDER.length}
        </span>
      </button>
      {is_desktop && (
        <>
          <div
            className="absolute"
            style={{
              top: 18,
              left: 18,
              background: "#F9F9F9",
              border: "1.5px solid #E4E7E8",
              borderRadius: 999,
              padding: "8px 14px",
              fontSize: 13,
              fontWeight: 700,
              boxShadow: "var(--shadow-card)",
            }}
          >
            <span className="flex items-center gap-1.5">
              <PinIcon size={16} />
              Loyola Heights · {geo_line}
            </span>
            <div style={{ marginTop: 8 }}>{geo_chip}</div>
          </div>
        </>
      )}
      <MapNote is_desktop={is_desktop} layer={layer} />
      {!is_desktop && !is_sheet_open && (
        <Fab
          label={`Log a ${sel_sp.common_name} sighting`}
          onClick={() => openCamera(sel.species_code)}
          size={64}
          style={{ position: "absolute", right: 16, bottom: 152, zIndex: 46 }}
        >
          <ShutterIcon size={44} />
        </Fab>
      )}
      {!is_desktop && !is_sheet_open && (
        <NearbyBar
          sp={sel_sp}
          where={sel.where}
          distance_line={selected_distance}
          is_pinned={pinned_id !== null}
          onUnpin={() => setPinnedId(null)}
          onExpand={() => setSheetOpen(true)}
        />
      )}
      {!is_desktop && is_sheet_open && (
        <NearbySheet
          sp={sel_sp}
          where={sel.where}
          distance_line={selected_distance}
          onLog={() => openCamera(sel.species_code)}
          onDismiss={() => setSheetOpen(false)}
        />
      )}
      {!is_desktop && is_sheet_open && (inat.status === "ready" || inat.status === "loading") && (
        <div
          className="absolute"
          style={{ left: 12, right: 12, bottom: 76, zIndex: 30, maxHeight: "34%", overflowY: "auto" }}
        >
          <InatStrip state={inat} density="compact" />
        </div>
      )}
    </div>
  );

  return (
    <div style={{ height: "100%", background: "#F9F9F9", color: "#1F2022", overflowX: "hidden" }}>
      {is_desktop ? (
        <div style={{ height: "100%", display: "flex", flexDirection: "column" }}>
          <DesktopTopBar route={route} onRoute={go} is_demo={is_demo} onDemo={() => setDemo((d) => !d)} seen_count={seen.size} is_wide={is_wide} />
          {route === "/" && <HomeScreen is_desktop onWalk={() => go("/map")} onPlan={() => go("/plan")} />}
          {route === "/map" && (
            <div className="flex-1 flex" style={{ minHeight: 0 }}>
              <div style={{ width: "62%", position: "relative" }}>{mapBody}</div>
              <aside className="scroll-soft" style={{ width: "38%", background: "#F9F9F9", borderLeft: "1.5px solid #E4E7E8", padding: 32, overflowY: "auto" }}>
                <div className="flex items-center gap-4">
                  <TaxonThumb species_code={sel_sp.species_code} size={104} />
                  <TaxonName
                    sp={sel_sp}
                    size={28}
                    eyebrow={`NEARBY · ${sel.where.toUpperCase()}`}
                    meta={
                      selected_distance ? (
                        <span style={{ fontSize: 14, fontWeight: 700, color: "#075D89" }}>{selected_distance}</span>
                      ) : null
                    }
                  />
                </div>
                <div style={{ marginTop: 14 }}>
                  <SpeciesPill sp={sel_sp} />
                </div>
                <p style={{ fontSize: 16, lineHeight: 1.5, marginTop: 18 }}>{sel_sp.note}</p>
                {sel_sp.caption && <div style={{ fontSize: 12, color: "rgba(31,32,34,0.5)", marginTop: 10 }}>{sel_sp.caption}</div>}
                <div className="flex gap-3" style={{ marginTop: 24 }}>
                  {[
                    ["1,809", "campus trees · AIS SY 2025–2026"],
                    ["101", "arboretum · AIS"],
                  ].map(([big, cap]) => (
                    <div key={big} style={{ flex: 1, background: "#fff", border: "1.5px solid #E4E7E8", borderRadius: TILE_RADIUS, padding: 16 }}>
                      <div style={{ fontWeight: 800, fontSize: 22 }}>{big}</div>
                      <div style={{ fontSize: 12, color: "rgba(31,32,34,0.6)", marginTop: 4, lineHeight: 1.3 }}>{cap}</div>
                    </div>
                  ))}
                </div>
                <button
                  onClick={() => openCamera(sel.species_code)}
                  className="flex items-center justify-center gap-2"
                  style={{ width: "100%", height: 52, borderRadius: 12, background: "#008653", color: "#fff", fontWeight: 700, fontSize: 16, marginTop: 24 }}
                >
                  <GlyphDisc size={32}>
                    <ShutterIcon size={24} />
                  </GlyphDisc>
                  Log this sighting
                </button>
                <div style={{ fontSize: 13, color: "rgba(31,32,34,0.65)", marginTop: 14 }}>
                  {seen.size} species logged on this device{walk ? ` · ${walk_count} on this walk` : ""}
                </div>
                <p style={{ fontSize: 12, color: "rgba(31,32,34,0.55)", marginTop: 8, lineHeight: 1.4 }}>{AIS_GAP_NOTE}</p>
                <div style={{ fontSize: 13, color: "rgba(31,32,34,0.5)", marginTop: 8, fontStyle: "italic" }}>
                  No public leaderboard. Formation, not a race.
                </div>
                <InatStrip state={inat} />
              </aside>
            </div>
          )}
          {route === "/journal" && <JournalScreen sighting={sighting} seen={seen} is_desktop />}
          {route === "/plan" && <PlanScreen is_desktop />}
          {is_camera_open && (
            <CameraSheet
              pick_code={pick_code}
              where={sel.where}
              fix_line={fix_line}
              onPick={setPickCode}
              onSave={saveSighting}
              onClose={() => setCameraOpen(false)}
            />
          )}
          {toast && <Toast msg={toast} />}
        </div>
      ) : (
        <div style={{ position: "relative", height: "100%", overflowX: "hidden" }}>
          {route === "/" && <HomeScreen is_desktop={false} onWalk={() => go("/map")} onPlan={() => go("/plan")} />}
          {route === "/map" && mapBody}
          {route === "/journal" && <JournalScreen sighting={sighting} seen={seen} is_desktop={false} />}
          {route === "/plan" && <PlanScreen is_desktop={false} />}
          {is_camera_open && (
            <CameraSheet
              pick_code={pick_code}
              where={sel.where}
              fix_line={fix_line}
              onPick={setPickCode}
              onSave={saveSighting}
              onClose={() => setCameraOpen(false)}
            />
          )}
          <MobileNav route={route} onRoute={go} />
          {toast && <Toast msg={toast} />}
        </div>
      )}
    </div>
  );
}

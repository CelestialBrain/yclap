import type { InatNearby, InatNearbyState } from "./inat";
import { inatExploreUrl } from "./inat";

function gradeLabel(grade: string): string {
  if (grade === "research") return "research grade";
  if (grade === "needs_id") return "needs ID";
  return grade.replaceAll("_", " ");
}

export default function InatStrip({
  state,
  density = "full",
}: {
  state: InatNearbyState;
  density?: "full" | "compact";
}) {
  if (state.status === "offline" || state.status === "empty" || state.status === "idle") return null;
  if (state.status === "loading") {
    return (
      <div style={{ fontSize: 12, color: "rgba(31,32,34,0.5)", marginTop: density === "full" ? 22 : 0 }}>
        Checking iNaturalist…
      </div>
    );
  }

  const is_compact = density === "compact";
  const nearby = is_compact ? state.nearby.slice(0, 3) : state.nearby;
  return (
    <section
      style={{
        marginTop: is_compact ? 0 : 22,
        background: "#fff",
        border: "1.5px solid #E4E7E8",
        borderRadius: 20,
        padding: is_compact ? "10px 12px" : "14px 16px",
      }}
    >
      <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.08em", color: "#075D89" }}>
        ALSO POSTED NEAR HERE
      </div>
      <ul style={{ listStyle: "none", margin: "8px 0 0", padding: 0 }}>
        {nearby.map((row: InatNearby) => (
          <li key={row.observation_id} style={{ marginTop: 6 }}>
            <a
              href={row.url}
              target="_blank"
              rel="noreferrer"
              style={{ color: "#1F2022", textDecoration: "none", display: "block" }}
            >
              <span style={{ fontWeight: 700, fontSize: is_compact ? 13 : 14 }}>{row.common_name}</span>
              <span style={{ fontStyle: "italic", fontSize: 12, color: "rgba(31,32,34,0.55)", marginLeft: 6 }}>
                {row.scientific_name}
              </span>
              <span style={{ display: "block", fontSize: 11, color: "rgba(31,32,34,0.45)", marginTop: 2 }}>
                {gradeLabel(row.quality_grade)}
                {row.observed_on ? ` · ${row.observed_on}` : ""}
                {row.is_campus_species ? " · on our walk list" : ""}
              </span>
            </a>
          </li>
        ))}
      </ul>
      <p style={{ fontSize: 11, color: "rgba(31,32,34,0.5)", marginTop: 10, lineHeight: 1.4 }}>
        iNaturalist · within 1 km of the Demo pin · not AIS · not this app identifying.{" "}
        <a href={inatExploreUrl()} target="_blank" rel="noreferrer" style={{ color: "#058CD6", fontWeight: 700 }}>
          Open iNaturalist
        </a>
      </p>
    </section>
  );
}

# Flood-activated collection drive protocol — Gargar node (Youth CLAP)

**Version:** 0.1 · 2026-08-25
**Ask source:** Cong. Alba `15:07` — "run collection drives AND build sustainable systems activatable every flood/calamity" (`docs/plaud/2026-08-22-project-development.md:14`)
**Evidence:** `docs/research/wave3-agent/R09-basura-baha-evidence.md` · `R18-informal-settlement-flood.md` · `R19-drainage-micro-fix.md` · `R15-flood-ews-last-mile.md` · `docs/pitch-3min.md`
**Scope:** One pilot node (Ateneo + one Pasig/QC collector window) per the one-geography rule (`docs/lane-and-task.md:11`).

---

## 0. Why a trigger (the mechanism)

Mismanaged solid waste is an official co-driver of Metro flooding: litter → streets/esteros → canal inlets and trash racks → reduced conveyance and pump inefficiency, so floods rise faster and recede slower (`docs/research/wave3-agent/R09-basura-baha-evidence.md:25`). Even good drainage fails when esteros re-clog, which is why diversion is flood co-benefit work (`docs/research/wave3-agent/R19-drainage-micro-fix.md:74`). The national warning stack is strong; **actionability after the alert is the gap** (`docs/research/wave3-agent/R15-flood-ews-last-mile.md:23`). This protocol converts an official alert into early action at our node.

---

## 1. Trigger condition (objective, official signal only)

The drive activates on **published DOST-PAGASA / NDRRMC products**, never on vibes or group-chat weather talk. Reference bands below are from public explainers; ops always cites the live product (`docs/research/wave3-agent/R15-flood-ews-last-mile.md:255`).

| State | Trigger (any one) | Source | Action |
|-------|-------------------|--------|--------|
| STANDBY | Habagat season standing watch | PAGASA daily bulletins | Roster warm; no activity |
| **ACTIVATE** | PAGASA **Orange rainfall warning** (~15–30 mm/hr, flooding threatening) covering the node's city, OR Pasig–Marikina–Tullahan basin gauge at **Alert** water level, OR a General Flood Advisory naming the node's waterway | DOST-PAGASA heavy rainfall warning / basin bulletin, relayed via OCD-NDRRMC → LGU DRRMO → BDRRMC chain (`docs/research/wave3-agent/R15-flood-ews-last-mile.md:17,28-34`) | Run Phase 2 pre-rain interception drive |
| **SUSPEND** | PAGASA **Red rainfall warning** (>~30 mm/hr, serious flooding — evacuate immediately) or any LGU/BDRRMC siren | Same chain (`docs/research/wave3-agent/R15-flood-ews-last-mile.md:30`) | Stop field activity instantly (Phase 4 gate) |
| RESUME (post-event) | Warning downgraded to Yellow/all-clear AND LGU DRRMO or host BDRRMC gives explicit all-clear AND host partner consents | LGU/BDRRMC confirmation (`docs/research/wave3-agent/R18-informal-settlement-flood.md:117`) | Run Phase 5 mapped-cleanup drive |
| RE-ARM | 72 h after stand-down with log exported and debrief done | This protocol | Return to STANDBY |

RA 12287 (State of Imminent Disaster Act) makes anticipatory action like this newly legible for LGUs (`docs/research/wave3-agent/R15-flood-ews-last-mile.md:21,138`) — cite it when explaining *why* we move before the rain, not as our legal authority.

---

## 2. Roles (singular, mapped to desk lanes)

| Role | Owns | Lane mapping (`docs/lane-and-task.md`) |
|------|------|----------------------------------------|
| Drive lead | Activation call within the trigger table; roster; single point of contact for the host barangay/partner | Mobilize — recruit + collection-day pattern (`:47`) |
| Logistics lead | Weigh-in station, sacks/scale, collector handoff window while roads passable, transport | Mobilize — collection-day logistics (`:47`) |
| Safety lead | Trigger watch on PAGASA/NDRRMC feeds; suspend/resume calls; buddy pairs; no-go enforcement | Science & Evidence — source-QA habit (`:34-38`) |
| Comms lead | Alert-to-action message to roster; honest copy (no flood-fix claims); photo consent discipline | Story & Showcase (`:57-58`) |
| Data lead | Gargar diversion-log entries at weigh-in; event tagging; export JSON snapshot each phase | Build — scoreboard/impact-math pattern (`:23`) |

Rule: no role is decorative — if a role is unfilled, the drive does not activate (echoes `docs/lane-and-task.md:13`).

---

## 3. 72-hour timeline (trigger → stand-down)

### Phase 1 — Activation (T+0 → T+6 h)
Orange/Alert confirmed by safety lead from the official feed.
- T+0–1 h: drive lead activates roster; comms sends one-sentence alert-to-action ("Orange na — bring sorted PET/Al/carton to [node] by [time]").
- T+1–3 h: logistics confirms collector window (showcase trio first — directory label until contacted, `docs/campaign-canvas.md:70`); site walk for a dry, above-flood-line weigh-in spot.
- T+3–6 h: data lead opens the drive in the log under its drive_code; safety lead sets the Red-watch cadence (check every 2 h).

### Phase 2 — Pre-rain interception drive (T+6 → T+36 h)
Collect sorted recyclable material from node households/dorms/orgs **before peak rain**, so mass never reaches the inlet (`docs/research/wave3-agent/R09-basura-baha-evidence.md:135`). Weigh-in on arrival → data lead logs kg per material → same-day handoff to collector while routes passable. Final ₱ is always the shop after weigh-in (`docs/pitch-3min.md:40`).

### Phase 3 — Consolidation (T+36 → T+48 h)
Second collection window; reconcile log vs collector receipt; export JSON snapshot (button exists, `docs/pilot-7-day.md:55`).

### Phase 4 — Suspension gate (condition-based, may arrive any time)
Red warning or siren = stop field activity immediately; secure scale/sacks/assets above expected flood line; comms posts suspension notice; data lead switches to remote entry only. No exceptions — red means serious flooding (`docs/research/wave3-agent/R15-flood-ews-last-mile.md:30`).

### Phase 5 — Post-event resumption drive (after downgrade + all-clear)
Waters recede + LGU/BDRRMC all-clear + host consent (invited partnership only, `docs/research/wave3-agent/R18-informal-settlement-flood.md:117`).
- Cleanup mapped to **one named drain segment** with the barangay O&M pledge — not an unmapped photo cleanup (`docs/research/wave3-agent/R19-drainage-micro-fix.md:77-78`).
- Haul sorted material through the same weigh-in → log → collector loop.
- Never interfere with disaster response or livelihood hours (`docs/research/wave3-agent/R18-informal-settlement-flood.md:124`).

### Phase 6 — Stand-down + debrief (T+60 → T+72 h)
Export final log JSON; debrief what failed (borrow the drill-debrief habit, `docs/research/wave3-agent/R15-flood-ews-last-mile.md:175`); re-verify rates that shifted post-calamity (copper/PET are volatile, `docs/campaign-canvas.md:77`); return to STANDBY. The system re-activates at the next trigger — that is the Alba ask, not a one-off event.

---

## 4. Data loop (drive → Gargar diversion log)

1. **Tag** — every drive gets a `drive_code` (e.g. `drive-2026-09-habagat-01`) so calamity-activated kg are distinguishable from baseline pilot kg.
2. **Log at weigh-in** — data lead enters material type + kg into the Gargar diversion log using the frozen EcoWaste-aligned material rates (`docs/pilot-7-day.md:11,13`); practice/demo entries stay labeled as such (`docs/campaign-canvas.md:68`).
3. **Reconcile** — collector receipt (final ₱ after shop weigh-in) reconciles against log entries before the phase closes (`docs/pitch-3min.md:40`).
4. **Export** — Export-log-JSON snapshot per phase feeds the evidence kit and the /100 kg board (`docs/pilot-7-day.md:55`; `docs/campaign-canvas.md:69`).
5. **Report honestly** — drive totals enter the scoreboard as *kg diverted at the node*, never extrapolated to metro-scale flood effect (see §5).

---

## 5. Safety + honesty notes (what this protocol does NOT claim)

**Safety hard lines**
- No field activity under Red warning or without an all-clear; no estero-bank walking for content; follow host safety rules (`docs/research/wave3-agent/R18-informal-settlement-flood.md:118,124`).
- Invited partnership only — written/document consent from HOA, BDRRMC, CSO, or DRRMO anchor; no cold entry (`docs/research/wave3-agent/R18-informal-settlement-flood.md:117`).
- Drives produce **no household censuses, GPS rosters, or maps usable as eviction intelligence** (`docs/research/wave3-agent/R18-informal-settlement-flood.md:119`).
- Photos/stories need ongoing informed consent; default to no identifiable imagery (`docs/research/wave3-agent/R18-informal-settlement-flood.md:120`).

**Non-claims (same spirit as `docs/pitch-3min.md:48-54`)**
- A drive does **not prevent floods** and is **not flood control**: waste diversion alone eliminating Metro floods is a false overclaim — capacity, extremes, silt, land use remain dominant co-drivers (`docs/research/wave3-agent/R09-basura-baha-evidence.md:198`). What it demonstrates is measurable kg diverted from the flood pathway at one node (`docs/research/wave3-agent/R09-basura-baha-evidence.md:137`).
- No carbon credits, plastic neutrality, or national flood-control reform claims (`docs/pitch-3min.md:50-52`).
- A cleanup without an O&M owner relapses within one wet season — we claim participation in a handoff model, not permanence (`docs/research/wave3-agent/R19-drainage-micro-fix.md:67,69`).
- Scope honesty: support to existing CBDRRM/SWM duties, labeled pilot/educational — not official DRRM delivery (`docs/research/wave3-agent/R18-informal-settlement-flood.md:126`).
- Rates are reference until re-verified; no "book a collector" promise until phones are verified (`docs/pitch-3min.md:53-54`).

---

*End protocol. File only; no other file touched — canvas link is stitched by the merge pass.*

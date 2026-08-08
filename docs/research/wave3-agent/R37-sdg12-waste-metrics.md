# R37 — SDG 12 waste metrics for student diversion projects

**Scope:** Metrics useful for Youth CLAP / Gargar-style pilots — kg diverted, recycling rate, Indicator 12.5.1, and how to claim impact without greenwash.  
**Audience:** Build + Story lanes (pitch honesty), Evidence kit, mentor review.  
**Date:** 2026-08-07

---

## Key findings

### 1. SDG framing (what we map to, not what we “are”)

| Layer | Official wording | Student-project implication |
|-------|------------------|------------------------------|
| **Goal 12** | Ensure sustainable consumption and production patterns | Primary SDG for scrap-to-value / diversion pilots |
| **Target 12.5** | By 2030, substantially reduce waste generation through **prevention, reduction, recycling and reuse** | Hierarchy matters: avoid → reduce → reuse → recycle → residual |
| **Indicator 12.5.1** | **National recycling rate, tons of material recycled** (Tier II) | National statistical product — **not** a campus KPI you “report as 12.5.1” |

**Honest claim form:**  
*“Aligned with SDG Target 12.5 (waste reduction via recycling/reuse); pilot tracks **kg material diverted** as a local contribution, not a national recycling-rate submission.”*

Do **not** say: “We improved Indicator 12.5.1” or “We raised the national recycling rate.”

### 2. Indicator 12.5.1 — definition (authoritative)

UNSD/UNEP metadata (updated 2024-05-24) defines **National Recycling Rate** as:

\[
\text{Recycling rate} = \frac{(\text{Material recycled} + \text{Exported for recycling} - \text{Imported for recycling})}{\text{Total waste generated}} \times 100
\]

**Includes as recycling:** reprocessing of waste material that diverts it from the waste stream (same or different product type); **composting / aerobic process**; **codigestion / anaerobic digestion**.  

**Excludes:** controlled combustion (incineration); land application; reuse as fuel; on-site industrial plant recycling at generation.

**Preferred measurement point for “material recycled”:** last entity in the recycling chain — preferably when material is **bought as secondary resource** for production (exit of the chain), not merely placed in a blue bin (entry of the chain).

**Sub-indicators commonly published:** municipal waste recycled (tonnes / %); e-waste recycled (tonnes / % / per capita kg). Related: 11.6.1 (municipal solid waste management), 12.4.2 (hazardous waste), 12.3.1 (food loss/waste).

**Critical limitations for student pilots:**

1. **Scale mismatch** — Indicator is national; Gargar is a micro pilot (tens of users, ~100 kg).
2. **Chain-position mismatch** — Official preference is **end-of-chain** recycled tonnes; student logs usually capture **hand-off to collector / junkshop** (mid-chain). Mid-chain kg is valid pilot proof if labeled honestly.
3. **Informal sector** — Metadata notes informal recycling often never enters formal channels; countries may estimate it. Gargar’s collector/junkshop path is **closer** to real PH recovery than formal bin statistics alone — still not a national 12.5.1 figure.
4. **What 12.5.1 does not measure** — prevention, reduction, reuse, repair. A pilot that only recycles does not “complete” Target 12.5.

**Adaptation for Gargar (proxy, not substitution):**

| 12.5.1 concept | Pilot analog | Label to use |
|----------------|--------------|--------------|
| Material recycled (tonnes) | **kg diverted** at verified hand-off | “kg logged at collector/MRF hand-off” |
| National rate (%) | Optional **session diversion rate** if total waste is known | “pilot-window diversion rate (scope: …)” |
| Export/import netting | N/A | Omit |
| Compost/AD inclusion | Separate **organics kg** if logged | Never mix without material tag |
| End-of-chain preference | Photo + receipt/weigh-in at junkshop; note “not remelted tonnes” | “collected for recycling / sold into scrap chain” |

### 3. kg diverted — hero metric for student pilots

**Definition (recommended for Gargar):**  
**Kg diverted** = wet/as-received **weight of material transferred out of residual disposal path** into a **documented recovery path** (reuse, recycling scrap stream, composting), measured at a defined boundary event.

**Preferred boundary event (strongest claim):**  
Scale weight at **collector / junkshop / MRF acceptance** (or campus drop-off with signed transfer), not “material sorted at dorm.”

**Acceptable weaker boundary (must disclose):**  
User self-log with photo + material type + estimated kg; mark as **proxy / estimated**.

**Formula (absolute):**

\[
\text{kg diverted}_{\text{period}} = \sum_i w_i \cdot v_i
\]

- \(w_i\) = weight of log entry \(i\) (kg)  
- \(v_i\) = verification factor: `1.0` verified weigh-in; `0.0` discarded; or keep full weight but tag `verification = estimated | verified` and report both stacks separately  

**Why kg beats % for a 5-week pilot**

| Criterion | Absolute kg | Diversion / recycling % |
|-----------|-------------|-------------------------|
| Needs total waste denominator | No | Yes (hard on campus without audit) |
| Showcase storytelling | “≥100 kg diverted” | “X% of what?” |
| Comparable across events | Yes if same material tags | Misleading if scope changes |
| Greenwash risk | Medium (if inflated estimates) | High (if denominator gamed) |
| SDG 12.5.1 kinship | Same unit family (mass recycled) | Rate form only if full generation known |

**Campaign Canvas already sets the right hero:** ≥**100 kg** diverted (or honest proxy + plan) by 12 Sep 2026 — keep this as primary impact number.

**Material tagging (minimum):** PET, HDPE, mixed plastic (disclose), aluminum, steel/tin, paper/cardboard, glass, e-waste (separate), organics/compost (separate). Never roll e-waste or organics into “recyclables kg” without labels.

**Weight practice**

- Prefer **kg on a scale** (kitchen / luggage / junkshop scale).  
- If volume-only: convert with a **published density table** and mark `method = volume_proxy`.  
- Record **moisture / dirty scrap** as-is; do not invent “clean equivalent” without a stated rule.  
- One log row = one hand-off batch (or one material type per batch).

### 4. Recycling rate vs diversion rate (do not conflate)

| Metric | Typical formula | What it rewards | Pitfalls |
|--------|-----------------|-----------------|----------|
| **Diversion rate** | \((\text{reuse}+\text{recycle}+\text{compost}) / \text{total generation} \times 100\) | Anything not landfilled/incinerated (definition-dependent) | Some programs count WTE as diversion — **TRUE/ZWIA-style frameworks often exclude incineration/WTE from “diverted”** |
| **Recycling rate** | \(\text{recycled mass} / \text{total generation} \times 100\) or \(\text{recycled} / \text{recyclables collected}\) | Material reprocessing path | Collected ≠ recycled; contamination residual often landfilled |
| **Capture / participation** | Households or users who sorted / used the app | Behavior | Not impact mass |
| **Contamination rate** | Non-target mass in recycling stream / stream mass | Quality of sort | High contamination → **false diversion** if counted at bin |

**Campus / facility standard practice**

1. Waste audit (multi-day sample) → composition + baseline residual.  
2. Diversion rate by **weight**, single unit system.  
3. Adjust recycling stream for **contamination** when hauler data exists (TRUE guidance: treat contamination as landfill/WTE in reporting when known).  
4. Track absolute tonnes **and** rates — rates alone hide growing waste.

**For Gargar without a full campus audit:**  
Do **not** invent a campus recycling rate. Use:

1. **Primary:** cumulative **kg diverted** (verified + estimated, split).  
2. **Secondary:** **log count**, unique users, collectors verified.  
3. **Optional rate only inside a closed scope**, e.g.  
   *“Of 40 kg brought to the 3-hour drop-off, 36 kg accepted by junkshop (90% of event intake) — not a campus diversion rate.”*

### 5. Philippines policy context (local legitimacy, not national stats)

- **RA 9003** (Ecological Solid Waste Management Act): LGU diversion through re-use, recycling, composting; historic statutory schedule started at **≥25%** diversion from disposal facilities within five years of effectivity, with goals to increase every three years. Student pilots can **contribute** to local diversion culture; they do not “meet RA 9003” for an LGU.  
- **RA 11898** (EPR): producer responsibility for plastic packaging — Gargar is demand/transparency infrastructure, not EPR compliance.  
- Metro Manila LGU-reported diversion rates vary widely and can be **overstated** relative to what actually arrives sorted at disposal sites (World Bank assessment literature). Mentor-safe posture: cite RA 9003 hierarchy; avoid quoting unaudited LGU % as if peer-reviewed.

### 6. Claiming without greenwash

**Principles (aligned with FTC-style environmental claim discipline, GRI integrity practice, UN greenwashing caution):**

1. **Say only what the log proves** — time window, geography, boundary event, verification level.  
2. **Substantiate before the pitch** — exportable log, photos, collector confirmation; no round-number theater.  
3. **Qualify absolute words** — avoid “zero waste,” “plastic neutral,” “carbon neutral,” “saved the ocean,” “closed the loop,” “100% recycled” unless definition + evidence are explicit.  
4. **Separate layers:** behavior (users) ≠ mass diverted ≠ climate (methane) ≠ justice (worker pay). Each needs its own sentence.  
5. **No double counting** — same batch cannot be both user A and junkshop B showcase kg without one canonical log.  
6. **No end-of-chain upgrade** — “sold to junkshop” ≠ “remade into bottles in PH.”  
7. **Climate co-claims stay estimates** — methane avoided may be a **transparent order-of-magnitude method**, never tradable credits (see YCLAP carbon-markets research).  
8. **Justice claims need people** — verified collectors / fair-path story; not “we empowered informal workers” from an app screenshot alone.

#### Claim ladder (use the lowest true rung)

| Rung | Example claim | Evidence needed |
|------|---------------|-----------------|
| **A — Activity** | “30 students logged scrap and saw reference rates.” | User count, screenshots, timestamps |
| **B — Collection** | “120 kg of sorted scrap transferred to 3 Pasig junkshops in pilot window.” | Weigh-ins / receipts / photos at hand-off |
| **C — Diversion (operational)** | “120 kg diverted from residual disposal **assuming** accepted scrap enters the recycling value chain.” | B + material types accepted by shop |
| **D — Recycling (material)** | “X kg entered secondary-material processing.” | End-processor ticket (usually out of pilot reach) |
| **E — Climate** | “Illustrative landfill-methane order-of-magnitude using method M; **not** a credit.” | Method card + uncertainty |
| **F — Forbidden** | “Carbon offset,” “plastic neutrality,” “raised SDG 12.5.1,” “zero waste campus” | — |

**Default showcase language (safe):**  
> “In our [dates] pilot in [place], **N users** logged **K kg** of [materials] at **hand-off to verified collectors/junkshops**. This is **mass collected into the scrap recovery chain**, aligned with **SDG Target 12.5**. It is **not** a national recycling rate (Indicator 12.5.1), **not** a carbon credit, and **not** proof of end-of-chain remanufacturing.”

**Phrase bank — prefer / avoid**

| Prefer | Avoid |
|--------|--------|
| Diverted from residual / landfill **path** (pilot definition) | “Saved from the landfill forever” |
| Collected for recycling / sold into scrap chain | “Recycled into new products” (unless D evidence) |
| Reference rates (date-stamped) | “Market prices guaranteed” |
| Estimated kg (user) vs verified kg (scale) | Blended total without split |
| Illustrative climate co-benefit | “Offset our emissions” |
| Aligned with SDG 12 / Target 12.5 | “Achieved Indicator 12.5.1” |
| Pilot / sample window | “Pasig now diverts X%” |

### 7. Measurement design patterns that reduce greenwash

1. **Two-stack totals:** `kg_verified` and `kg_estimated` always shown separately; hero can be verified-only or sum with footnote.  
2. **Verification enum:** `self_report` | `photo` | `weighed_user` | `weighed_collector` | `receipt`.  
3. **Rejection log:** mass refused for contamination/quality — shows integrity.  
4. **Material mix chart** — heavy wet organics should not silently dominate “recycling” totals.  
5. **Time-box** — “pilot: 2026-08-xx → 2026-09-12” on every public number.  
6. **Denominator discipline** — never publish % without stating total generation scope.  
7. **Collector verification** — in-person check before “book a collector” claims (Campaign Canvas risk already flags this).  
8. **Open method card** (one slide): formulas, boundaries, what is excluded.

### 8. Secondary metrics (useful, not hero)

| Metric | Use | Greenwash watch |
|--------|-----|-----------------|
| Unique users who priced material | Funnel / UX | Not diversion |
| Diversion log entries | Process health | Inflatable |
| Collectors verified in person | Justice + ops | Directory scrape ≠ verified |
| ₱ value at reference rates | Motivation story | Label **reference**, not guaranteed payout |
| Contamination / rejection rate | Quality | Honesty signal |
| Repeat users | Habit | Small-N |
| Organics kg (if any) | Methane narrative | Keep separate from dry recyclables |
| Session intake acceptance rate | Event quality | Not campus rate |

---

## Gargar metric design

### Design goals

1. **Mentor-safe** absolute impact for Innovation Showcase.  
2. **SDG 12 / Target 12.5 alignment** without false Indicator 12.5.1 claims.  
3. **Operational** for ≥30 users, ≥3 collectors, ≥100 kg in ~5 weeks.  
4. **Justice-visible** — collectors and fair path, not only student kg brag.  
5. **Exportable evidence** — CSV/log + photos, not vibes.

### Metric stack (recommended)

| Priority | Metric ID | Definition | Target (pilot) | Reporting rule |
|----------|-----------|------------|----------------|----------------|
| **P0 Hero** | `kg_diverted_verified` | Sum of kg with verification ≥ `weighed_collector` or `receipt` | **≥100** preferred; if short, report actual + plan | Never round up |
| **P0 Support** | `kg_diverted_estimated` | Self-report / photo-only kg | Track fully | Always secondary |
| **P0 Support** | `user_active` | Unique users with ≥1 pricing or log action | ≥30 | Distinct from kg |
| **P0 Support** | `collector_verified` | In-person confirmed junkshop/collector | ≥3 | Name/place ok if consented |
| **P1** | `log_entry` | Count of diversion log rows | ≥30 | 1 batch = 1 row ideal |
| **P1** | `kg_by_material` | Breakdown by material tag | Narrative | Chart on evidence slide |
| **P1** | `php_reference_value` | Σ kg × reference rate (date-stamped table) | Story only | “Reference ₱, not paid-out” |
| **P2 Optional** | `event_acceptance_rate` | Accepted kg / offered kg at a drop-off | No fixed target | Scope = that event only |
| **P2 Optional** | `methane_illustrative` | Order-of-magnitude from organics or residual avoided (method card) | Optional | Explicit non-credit |
| **Out of scope** | National recycling rate 12.5.1 | — | — | Do not compute or claim |
| **Out of scope** | Campus diversion % | Needs full generation audit | — | Only if partner supplies denominator |
| **Out of scope** | Carbon / plastic credits | — | — | Non-claim (see R carbon research) |

### Log schema (singular identifiers; collections still singular names)

Suggested fields for each **log** entry:

| Field | Type | Notes |
|-------|------|-------|
| `log_id` | string | Unique |
| `occurred_at` | datetime | Hand-off time preferred |
| `user_id` | string | Anonymized ok for public export |
| `material` | enum | See material tagging above |
| `mass_kg` | number | As-received |
| `mass_method` | enum | `scale` \| `volume_proxy` \| `estimate` |
| `verification` | enum | `self_report` \| `photo` \| `weighed_user` \| `weighed_collector` \| `receipt` |
| `boundary` | enum | `sorted_only` \| `dropoff` \| `collector_handoff` \| `junkshop_sale` |
| `collector_id` | string | Nullable if drop-off staged |
| `place` | string | Barangay / campus node |
| `photo_ref` | string | Optional |
| `rejected_kg` | number | Default 0 |
| `note` | string | Contamination, wet, etc. |

**Aggregates for pitch dashboard**

```
kg_diverted_verified  = sum(mass_kg where verification in weighed_collector, receipt
                            and boundary in collector_handoff, junkshop_sale
                            and rejected not applied)
kg_diverted_estimated = sum(mass_kg where verification in self_report, photo, weighed_user)
kg_diverted_total     = verified + estimated   // always footnote the split
```

### Boundary policy (non-negotiable for “diverted”)

Count toward **hero diverted kg** only if:

1. Material type is accepted into a recovery path (not residual trash bag), **and**  
2. Boundary is **drop-off with transfer**, **collector hand-off**, or **junkshop sale**, **and**  
3. Verification is **weighed_collector** or **receipt** (or weighed_user **plus** collector acknowledgment photo).

`sorted_only` stays in the log for UX learning but **does not** count as diverted mass.

### Rate metrics (only if earned)

**Event acceptance rate** (allowed):

\[
\text{acceptance rate}_{\text{event}} = \frac{\text{kg accepted by collector}}{\text{kg offered at event}} \times 100
\]

**Pilot recycling-rate analog** (discouraged unless generation known):

\[
\text{scoped recycling rate} = \frac{\text{kg_diverted_verified}}{\text{kg residual + kg diverted in same scope}} \times 100
\]

Require written **scope** (e.g. “BOx booth residual bags + recyclables, 4 hours”). Without scope → do not publish %.

### Showcase scorecard (one slide)

| Line | Number | Caveat one-liner |
|------|--------|------------------|
| Users | 30+ | Activity, not mass |
| Collectors verified | 3+ | In-person |
| kg verified diverted | __ | Hand-off boundary |
| kg estimated | __ | Self-report |
| Materials | top 3 | Chart |
| SDG | 12 (Target 12.5) | Not Indicator 12.5.1 submission |
| Not claiming | credits, neutrality, national rate | Printed on slide |

### Evidence kit checklist

- [ ] Raw log export (CSV) with verification fields  
- [ ] Photo set: scale / hand-off / collector visit  
- [ ] Rate table snapshot with **as-of date**  
- [ ] Method card: diverted definition + exclusions  
- [ ] Claim ladder: which rung each pitch sentence uses  
- [ ] Justice beat: named path to collectors (with consent)

### Anti-patterns (fail mentor review)

1. Reporting only “100 kg” when 90 kg is estimated.  
2. Calling junkshop intake “recycled content in new products.”  
3. Using app downloads as impact.  
4. Publishing a campus diversion % without audit denominator.  
5. Adding methane tonnes next to kg without method/uncertainty.  
6. Implying Gargar fulfills RA 9003 or EPR for a city.  
7. Counting the same bag twice across users.  
8. “Zero waste” for a pilot that still has residual.

### Stretch (post–Sep 12 / 30-day afterlife)

- Partner MRF monthly ticket → upgrade boundary toward end-of-chain.  
- Small waste audit at one dorm/org → real scoped diversion rate.  
- Contamination sample (10 bags) → quality metric.  
- Informal-sector income story with consented ₱ actuals (not only reference).  
- Align optional organics pilot with Target 12.5 composting inclusion **and** methane narrative — still no credits.

---

## Sources

### Primary / official

1. UNEP — Indicator 12.5.1 overview: https://www.unep.org/indicator-1251  
2. UNSD/UNEP — SDG metadata *Indicator 12.5.1: National recycling rate, tons of material recycled* (metadata update 2024-05-24): https://unstats.un.org/sdgs/metadata/files/Metadata-12-05-01.pdf  
3. UNEP — Global Chemicals and Waste Indicator Review (methodology referenced by metadata): https://wedocs.unep.org/bitstream/handle/20.500.11822/36753/GCWIR.pdf  
4. UN DESA — SDG 12 / Target 12.5 text: https://sdgs.un.org/goals/goal12  
5. One Planet Network / SDG 12 Hub — Target 12.5: https://www.oneplanetnetwork.org/sdg-12-hub/see-progress-on-sdg-12-by-target/125-reduce-waste-rrr  

### Diversion / facility measurement

6. TRUE (GBCI) Rating System — diversion rate by weight; exclusion of landfill/incineration/WTE from diverted: https://true.gbci.org/sites/default/files/resources/Current-Rating-System-December-2023.pdf  
7. TRUE — Diversion Data Additional Guidance (contamination treatment, 12-month weight data): https://true.gbci.org/sites/default/files/resources/TRUE-Diversion-Data-Technical-Guidance_1.pdf  
8. Industry practice summaries — diversion KPIs (diversion rate, contamination, material-specific recycling): e.g. Busch Systems waste diversion KPIs overview  

### PH legal / sector

9. RA 9003 — Ecological Solid Waste Management Act of 2000 (mandatory LGU diversion schedule; hierarchy re-use/recycling/composting)  
10. RA 11898 — Extended Producer Responsibility Act of 2022 (plastic packaging; context only)  
11. World Bank — Metro Manila solid waste assessment literature (LGU diversion rate variance / overstatement risk; MRF coverage)  

### Claim integrity / greenwash

12. UN — climate greenwashing / integrity of claims: https://www.un.org/en/climatechange/science/climate-issues/greenwashing  
13. GRI — practices to mitigate greenwashing (transparency, verifiability): https://www.globalreporting.org/news/news-center/essential-practices-to-avoid-greenwashing-insights-and-case-studies/  
14. FTC Green Guides context on recyclable / environmental claim substantiation (US reference discipline for “recyclable” qualifications)  

### YCLAP internal (metric consistency)

15. `docs/campaign-canvas.md` — ≥100 kg diverted, ≥30 users, ≥3 collectors; non-claim carbon credits  
16. `docs/research/2026-08-deep-research-brief.md` — Gargar as scrap-to-value + kg metrics; SDG 12 primary  
17. `docs/research/2026-08-ph-carbon-markets.md` — no carbon product; methane estimate only with transparent non-tradable method  

---

## Confidence

| Topic | Confidence | Notes |
|-------|------------|-------|
| 12.5.1 formula, inclusions/exclusions, chain-position preference | **High** | Direct from UNSD/UNEP metadata PDF (2024-05-24) + UNEP indicator page |
| Target 12.5 wording and non-coverage of prevention/reuse in 12.5.1 | **High** | Official SDG text + metadata limitations section |
| kg diverted as best primary pilot metric vs % rate | **High** | Consistent with Campaign Canvas, facility practice, and small-N audit limits |
| Diversion vs recycling vs contamination distinctions | **High** | Standard SWM / TRUE / campus audit practice |
| PH RA 9003 25% diversion schedule as statutory history | **High** | Statute text; current LGU performance figures are more variable |
| Exact current PH national 12.5.1 reported value | **Low / not needed** | Not required for pilot design; avoid citing without latest UNSD table |
| Informal-sector share of PH recycling | **Medium** | Directionally large; hard to quantify in a student log |
| Methane co-benefit quantification | **Low–medium** | Allowed only as illustrative method card; not developed in this note |
| Legal risk of greenwash for a student showcase | **Low absolute**, **high reputational** | Mentors/CCC care about integrity more than FTC enforcement |

**Overall confidence in recommendations:** **High** for metric hierarchy (kg verified → activity metrics → optional scoped rates → no 12.5.1/credit claims). **Medium** for any numeric climate translation.  

**Research gap / next if needed:** one-page methane method card (landfill EF assumptions for PH residual vs dry recyclables); optional density table for volume proxies; field template for junkshop receipt photos.

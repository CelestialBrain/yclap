# Output 3 — what the website contributes

Input pack for the Friday 2026-09-05 submission. This is **not** the Output 3
document; it is the website's share of it, written so Group 2 and Group 3 can
lift rows straight across.

Delegation, per the 09-03 announcement:

- **Group 1** — Background, Goal and Objective
- **Group 2** — Activities and Project Timeline, Monitoring and Evaluation
- **Group 3** — Resources needed, Team contact information

Every figure below is computed by the app and re-derivable (`web-forest/README.md`).
Nothing here is a survey claim.

---

## For Group 1 — the goal line, corrected

The 09-03 decision changed the objective: **from mapping any single species to
mapping the common areas and their presence.** That is now what the app does —
the unit is an area, not a tree.

Wording that matches what we can defend:

> Increase awareness of, and commitment to, the campus urban forest by letting
> students walk it area by area and record what they find — using boundaries and
> ground cover from open, checkable sources rather than a survey we did not do.

Do **not** write "increase native-tree representation" — Sophie's `31:48` note
stands, the website cannot do that. Formation is the replacement (`32:58`).

## For Group 2 — Activities

| Activity | Status | Evidence |
|---|---|---|
| Cut the campus into walkable areas | Done | 94 sectors, 35.0 ha, from the OSM path/road network |
| Verify each area is really vegetated | Done | 60 Esri satellite tiles, per-sector vegetation index; 26 areas demoted to paved |
| Build the walk (4 surfaces: Home, Map, Field journal, Plan) | Done | Running PWA, works offline with no tile server |
| Personal field journal, no leaderboard | Done | Local only; a rank field fails the test suite |
| Obtain the AIS tree inventory | **Blocked** | Clariz reaching out; due Wed 09-09 |
| Consult MO / CFMO / student orgs | **Not yet** | Owners assigned, no meeting held |
| Nature walk / participatory mapping session | Not scheduled | App supports walk sessions already |

### Project timeline

| When | What |
|---|---|
| Fri 09-05 | Output 3 submitted |
| Sat 09-06 | Pitch deck |
| Mon 09-08 | Website, booth design, coordinator meeting |
| **Wed 09-09** | **AIS inventory expected — unblocks species per area** |
| Fri 09-12 | Innovation Showcase |

### Monitoring and Evaluation

The honest difficulty: our M&E cannot use engagement-ranking metrics, because we
decided against a leaderboard and against points (`20:20`). So the indicators are
coverage and contribution, not competition.

| Indicator | How it is measured | Baseline today |
|---|---|---|
| Campus area made walkable | ha of sectors classified as biome | 24.0 ha of 35.0 ha |
| Areas with something to find | sectors naming at least one species | 6 of 68 — **AIS unblocks this** |
| Ground-truth accuracy | % of sectors with a measured vegetation value | 100% (94 of 94) |
| Self-correction | claims withdrawn after checking against imagery | 26 areas demoted from green to paved |
| Student participation | sightings logged per walk session (device-local, aggregate only) | 0 — pre-launch |
| Data gap closed for AIS | sightings carrying a location AIS lacks | 0 — pre-launch |

The last row is the one worth arguing in the room: **AIS has the species list;
what it is missing is the count and the location of each tree** (Cathy,
`2:12:12`). Every located sighting a student logs is one row of exactly the data
AIS does not have. That is the project's contribution, stated as a measurable.

Note for whoever writes this section: do not promise a participation *target* we
have no basis for. We have not run a session yet.

## For Group 3 — Resources needed

### Already covered, at zero cost

| Resource | Note |
|---|---|
| Map boundaries and paths | OpenStreetMap, ODbL — free, attribution required and rendered |
| Satellite imagery for verification | Esri World Imagery, used for measurement; credited |
| Hosting | Static build; the PWA needs no server to run a walk |
| Tile server | **None.** The play view draws its own ground, so a dead-wifi hall still works |
| Species identification | iNaturalist as a client; we run no model of our own |

### Actually needed

| Need | Why | Who |
|---|---|---|
| **AIS tree inventory export** | 62 of 68 areas have nothing to find until it lands | Clariz |
| Manila Observatory contact | Urban-heat / land-cover framing; Villarin coauthored the UHI papers | Charisse, Clariz |
| CFMO / TAW grounds permission | Walk sessions on campus; which groves are off-limits | Ivan |
| Student org partners | Ateneo Wild already keeps a catalogue of campus birds and trees | Sophie |
| ADMUNAV path graph | Would replace our OSM paths with the surveyed pedestrian graph | unassigned |
| Booth: one laptop + projector or large screen | Kiosk runs the desktop play view full-bleed | Group 3 |
| Booth: 2–3 phones with the PWA installed | Visitors walk a demo campus without granting location | Group 3 |

Domain and paid hosting are **not** required for the showcase. If the team wants
a public URL afterwards, that is a small recurring cost and a separate decision.

### Team contact information

`/plan` in the app lists who we hope to consult and who is reaching out. Every
row still reads "not yet", because an assignment is not a meeting — please keep
that wording in Output 3 too.

| Organisation | Reaching out |
|---|---|
| Manila Observatory | Charisse · Clariz |
| Ateneo Institute of Sustainability (AIS) | Clariz |
| Student organisations (Ateneo Wild / AGILA) | Sophie |
| CFMO / TAW | Ivan |

---

## Guardrails for the whole document

- Cite AIS for 1,809 trees and 101 arboretum accessions. They are not our counts.
- Do not say we surveyed, censused, or inventoried anything.
- 50 of 94 area names are ours, chosen where OpenStreetMap has none. If a name
  appears in the document, it is fine — just don't call it official.
- Do not claim any consultation has happened.

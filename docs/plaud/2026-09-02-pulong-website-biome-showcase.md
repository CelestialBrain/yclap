# Plaud brief — Pulong: inayos ang website, mapa ng biome, at gawain sa showcase

2026-09-02 · 1:16:50 · 9 diarized labels (Speaker 1–9 + "Gelo"). **Diarization suspect** — Plaud names only Gelo; the rest are generic, `Speaker 3` ("Sophie") and `Speaker 7` ("Sophia") are never disambiguated and may be one person. Several segments are mis-transcribed into Indonesian/Malay (`1:07:22` "Ya oke, tapi kan, apa itu").

**Source URL:** https://web.plaud.ai/s/pub_11473239-74a9-467a-bfff-d595518fc72f::miuzkUXDh51LxrwiLVwnS5_qDeHyuI3tPd-0TmPvqNK9q2RN77qkzGC5sHOy6n2HRJUx_XKak7sV0N__hlieEgI

**Cached at:** `~/.piper/plaud/pub_11473239-74a9-467a-bfff-d595518fc72f/note.md`

Inferred labels from the transcript: **Speaker 1 = Ivan** (leader; takes CFMO himself at `1:12:00`), **Speaker 2 = Cathy**, **Speaker 3 = Sophie**, **Speaker 7 = Sophia** (takes Sanggu at `1:11:20`), **Speaker 9 = AIS contact**, **Gelo = developer**.

The meeting that **changed the project's objective on the record**: from mapping every tree to dividing the campus into general areas ("biomes") with species representatives per area. Gelo demoed the mobile prototype; the room converged on feasibility, then spent the last twenty minutes on gamification, character design and the reward system — which was explicitly left undecided.

## Ask

### Firm

| # | Ask | Cited | Repo |
|---|-----|-------|------|
| A1 | Cut the campus into biome-style **areas** instead of mapping each tree | `48:04`, `52:26` | **partial** — `campus-boundary.json` holds 4 OSM rings; no biome layer. OSM has **no** forest/wood polygon inside `CAMPUS_BOX`, so biomes must be hand-drawn |
| A2 | Assign **species representatives per area**, scannable for a badge | `51:34` | **partial** — badge/collection ships; per-area assignment absent |
| A3 | Show only the **top three species** per biome to avoid overload | `59:29` | **absent** |
| A4 | **Simplify the map** — "there's a lot of lines"; cocomelon, not an informational video | `1:00:34`, `1:01:25` | **partial** — `PathNetwork` draws 186 footways; the `Paper` preset already draws none |
| A5 | Biomes in **shades of one green**, not rainbow | `1:03:48` | **partial** — `SOURCE[layer].theme` is the hook |
| A6 | iNaturalist must verify the photo before the badge | `59:42`, `1:00:01` | **exists** — `scorePlantImage` + camera sheet |
| A7 | Get **CFMO off-limits areas** (Ivan owns it) | `1:11:52`, `1:12:00` | **partial** — `app.tsx:1200` says "placeholder extent — nobody has given us the surveyed boundary" |
| A8 | Get the **tree inventory** by Wed 2026-09-09 so website work starts Thu 09-10 | `58:50` | external — Clarice (MO + Biology), Cathy asks Mona for the soft copy |
| A9 | The website **needs a name** | `19:48` | **absent** — currently "Field Guide"; deferred to Saturday |

### Gamification asks (all blocked on the reward decision, D6)

| # | Ask | Cited | Repo |
|---|-----|-------|------|
| A10 | **Two ways to earn points**: catch spawns, and contribute an unlocated tree | `29:45`, `33:36` | **absent** — and `journal.test.ts` fails the build on a `points` field |
| A11 | **Level system** — few spawns at first, more as you progress | `32:40`, `34:27` | **absent** — same guard |
| A12 | **Character** that evolves egg → seedling → tree, and loses leaves if unvisited that day | `1:05:55`, `1:08:20` | **absent** |
| A13 | **Blind box / Pop Mart-style** unlockable character | `1:04:45` | **absent**, undecided |
| A14 | Try **3D trees**, emphasise during the pitch | `1:07:02` | **absent** |
| A15 | Add **teal** to the palette | `1:02:13` | conflicts with current YCLAP tokens; roadmap C15 already flags a palette call |

### Musing (do not promote)

| # | Musing | Cited |
|---|--------|-------|
| M1 | Rarity / urgency via spawn timers, "parang may urgency… tapos may rarity" | `33:04` |
| M2 | Make it a race to complete the badge set (competition framing) | `41:39` |
| M3 | Campaign it across Luzon "in the next life" | `28:42` |
| M4 | Humanise the trees | `1:12:40` |

## Decision

| # | Decision | Cited |
|---|----------|-------|
| D1 | **Pivot from per-tree to per-area mapping.** Ivan: singling out every tree is "imposible"; Gelo: *"I think that's better. I just think we need to specify which areas."* | `50:20`, `51:34`, `52:26` |
| D2 | **The original objective is explicitly changed**, not merely descoped | `51:20` |
| D3 | Monitoring becomes **verification of presence per area**, not a per-tree census | `49:23`, `50:49` |
| D4 | **Split the game from the data collection** — badge-scanning is the bio-education hook; a separate "help us collect data" path handles mapping | `42:41`, `43:39` |
| D5 | **Non-goal:** stay on Ateneo grounds. Expansion is "next life" | `27:54` |
| D6 | **The reward system is deliberately NOT decided** — leaderboard vs level vs blind box all still live. Ivan: "better not to decide the reward system" | `1:10:38` |
| D7 | Timeline: output 1 **Thu 09-03 night** · pitch deck **Sat 09-05** · whole of next week website + booth · tree inventory **Wed 09-09** · website work **Thu 09-10** | `8:23`, `14:02`, `58:50` |
| D8 | Team splits into a **website group** and a **campaign/booth group** | `18:48` |
| D9 | Showcase format: one booth per school, **5-min pitch + 5-min Q&A**, onsite with room and food | `3:12` |

## Open question

| # | Question | Cited |
|---|----------|-------|
| Q1 | **How exactly to cut the campus into areas** — only Sunken Forest is agreed as its own biome | `52:46` |
| Q2 | Leaderboard vs level-up vs blind box | `1:10:38`, `1:10:09` |
| Q3 | Replayability — "if you collected all the trees, what will you get?" | `32:40` |
| Q4 | Two people photograph the same tree — how is that handled? | `44:36` |
| Q5 | Users will photograph only the easiest tree by the path | `46:27` |
| Q6 | The website's name | `19:48` |
| Q7 | Who does the brand design (a friend outside the org was floated) | `1:02:48` |

## Person

**Point persons assigned** (`1:11:32`–`1:12:00`): **Sophia** → Sanggu / student orgs · **Clarice** → Manila Observatory + Biology Department · **Ivan** → CFMO (off-limits grounds) · **Speaker 9** → AIS · **Cathy** → asks Mona for the species DB soft copy, and finds the official pitch-deck template.

**Mentioned:** Mona (Biology species database) · Alfonso (absent).

## Flags

- **The no-ranking invariant is contradicted by the team that created it.** `docs/roadmap-rejected.md` rejects leaderboards/XP/points sourced to *Sophie: against incentivizing advocacy involvement*, and `journal.test.ts` fails the build on `rank`/`score`/`points`/`streak`/`level`/`xp`. Here Sophie herself is **choosing between level-up and blind box** (`1:10:09`), not objecting. The objection has softened — **but no one stated the rule is lifted.** Needs a recorded decision Saturday.
- **`[AI note]` contradiction.** Plaud's AI note assigns Gelo *"Gumawa ng paunang prototype ng reward system (leaderboard o blind box)"*. The transcript says the opposite — Ivan defers that decision at `1:10:38`. **Not an ask.**
- **The pivot invalidates part of the current P1 roadmap.** "Ordered stops with a progress rail", "`4 of 9 species seen`" and the per-tree pin glyph family were all written against per-tree encounters.
- **Already built, treated as open in the room:** iNaturalist verification, the journal/badge collection, the restricted-area hatch, per-basemap theming (the simplification lever Ivan asked for), and the 4 OSM campus rings.
- The app was **deployed after this meeting** to `yclap-field-guide.marangelonrevelo.workers.dev`; Gelo demoed a local build here.

## Follow-on

Design response, biome cut, asset research and tiered roadmap: [`../spec/biome-gamification-brief.md`](../spec/biome-gamification-brief.md).

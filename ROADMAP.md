# ROADMAP

Youth CLAP desk — roadmap from the eight Aug 15 / Aug 22 Plaud recordings, cross-referenced against this repo on 2026-08-25.

Discovered ~60 raw asks across 8 briefs (`docs/plaud/`) → **12 genuine · 6 rejected · 6 triage**. Every row carries a Tier 3 acceptance test; nothing earned Tier 1 (no regression-prone code path) or Tier 2 (no live-model effect). Rows named after behavior, never after their test.

Program clock: **Aug 28 async contract due · Aug 29 Masterclass · Sep 12 Innovation Showcase.**

## P0 — close before the Aug 28 deadline / Aug 29 session

| Item | What it closes | Surface | Effort | Benchmark (Tier 3) | Status |
|------|----------------|---------|--------|--------------------|--------|
| Async-contract packet: Campaign Canvas v0.3 + per-school tracker | Facilitators assigned canvas purpose+process (7 questions), resource inventory, cost of action/inaction by Aug 28 (`session-2` `6:13:28`; `campaign-canvas` brief) — repo canvas v0.2 lacks assumptions/M&E/success fields and no completion tracking exists | `docs/campaign-canvas.md` v0.3 + `docs/cohort/contract-tracker.md` | M | Open v0.3; PASS iff every officially assigned field has a fill-in section AND tracker lists each school with status columns for tree / canvas / inventory / costs | **done** — v0.3 + `docs/cohort/contract-tracker.md` (2026-08-25)
| Cohort idea-guardrails one-pager ("before you propose") | Cohort keeps re-inventing what already ships (transparency website ≈ Gargar wedge) and re-proposing killed directions (planting drives, blue-carbon credits, another recycling app) — before the Aug 29 room | `docs/cohort/idea-guardrails.md` | S | PASS iff page names the project rack as first check, links R10/R28/R30 evidence lines, and states the three pitfall patterns with one-line reasons | **done** — `docs/cohort/idea-guardrails.md` (2026-08-25)
| Landing program truth vs recorded reality | `program.js`/README sell Aug 15 as in-person Mapúa with governance (it ran online; governance moved to Aug 22), and Aug 29 venue is "TBD" in the recording while data pins Mapúa; vault correction: Aug 22 actually ran at Mapúa **Makati** (Intramuros power interruption, OSCI email 2026-08-20) — **coordinate with main's uncommitted `program.js` rewrite first** | web landing program section (edit on main, not this worktree) | S | Open landing; PASS iff Aug 15 row reflects online delivery, completed sessions are marked done, and no date/venue contradicts a recorded session | blocked — reconcile with main's uncommitted diff |

## P1 — Sep 12 showcase readiness

| Item | What it closes | Surface | Effort | Benchmark (Tier 3) | Status |
|------|----------------|---------|--------|--------------------|--------|
| NBS multi-factor judging rubric for the showcase | Lasco's multi-factor NBS success rule (`climate-biodiversity` brief) vs a default single-metric judging; judges need it before Sep 12 | `docs/showcase/judging-rubric.md` | S | PASS iff rubric weights ≥4 success factors, carbon tonnage is not a pass/fail gate alone, and pitch-3min non-claims are referenced | **done** — `docs/showcase/judging-rubric.md` (2026-08-25)
| Flood-activated collection-drive protocol | Cong. Alba ask for drive systems that "re-activate at every flood/calamity" (`project-development` `15:07`) — loop exists, activation protocol absent; R09 basura-baha evidence ready | `docs/pilot/flood-drive-protocol.md` (+ Gargar trigger note) | M | PASS iff protocol names trigger condition, roles, 72-hour timeline, and is linked from campaign-canvas pilot slice | **done** — `docs/pilot/flood-drive-protocol.md` + canvas link (2026-08-25)
| LGU LCCAP → PSF funding-wedge kit | "Equip LGU plans for implementation/funding" (`project-development` `2:07:24`) — R16/R17 research exists, no bridge artifact turning a school project into an LGU-plan line item with a fund source | `docs/lgu-funding-kit.md` | M | PASS iff kit maps project → LCCAP entry → fund source (PSF/LCEI/local) with one worked example citing R16/R17 pages | **done** — `docs/lgu-funding-kit.md` (2026-08-25)

## P2 — value track (post-showcase)

| Item | What it closes | Surface | Effort | Benchmark (Tier 3) | Status |
|------|----------------|---------|--------|--------------------|--------|
| GHG-assurance first-mover primer | Vicky Tan's "be first movers in GHG audit/assurance skills pre-2028" (`masterclass` `59:54`) — zero TNFD/TISFD/assurance content in repo | `docs/research/2026-08-ghg-assurance-primer.md` | M | PASS iff primer cites SEC Scope 1–3 timeline (disclosure 2026/27, audits 2028), LCEI market design, and maps 5 concrete youth-entry skills | **done** — docs/research/2026-08-ghg-assurance-primer.md (2026-08-25)
| Discounting worksheet (PV exercise) | Solo 5% discounting homework (`project-development` `2:47:34`) — lane owner set, no artifact; house rules: ≤10% project discount, 4% global, never 15% | `docs/exercise/discounting-worksheet.md` | S | PASS iff one worked PV example follows house rules and answer key matches hand-computed value | **done** — docs/exercise/discounting-worksheet.md (2026-08-25)
| Climate Venn worksheet + one-sentence statement | Assigned personal reflection (joy / strength / issue → statement) (`campaign-canvas` `6:10:09`) — absent everywhere | `docs/exercise/climate-venn-worksheet.md` | S | PASS iff worksheet renders three circles, prompts the one-sentence statement, and shows one filled example | **done** — docs/exercise/climate-venn-worksheet.md (2026-08-25)
| Pre/post-test instrument archive | Pre-test ran as attendance with scores withheld; no instrument or results live in the repo — honest-reporting culture needs the record | `docs/evaluation/pre-post-test.md` | S | PASS iff instrument questions are listed and a results table exists with the recorded cohort score policy noted | **done** — docs/evaluation/pre-post-test.md (2026-08-25)
| PhilCCA / NAP free-download library | "Download PhilCCA/NAP" asked in two sessions; references scattered across R-docs, no single library | `docs/library.md` | S | PASS iff every link resolves to an official free source and each entry notes which session assigned it | **done** — docs/library.md (2026-08-25)
| SOM swamp-forest fork spec | Gelo's firm ask: fork Gargar, reuse assets, reskin problem to species scarcity from wrong tree species (`som-forest-restoration` decisions) — execution belongs in a sibling repo after Sep 12 | `docs/spec/som-forest-fork-spec.md` (code: new sibling repo) | L | PASS iff spec fixes scope (fork-not-recreate, four chosen education/psych solutions), lists reusable assets, and names root-cause framing; separate benchmark covers the fork booting | **done** — docs/spec/som-fork-spec.md (2026-08-25)

## What we are NOT going to do

See [`docs/roadmap-rejected.md`](docs/roadmap-rejected.md) for the full log with reasons. Summary: carbon-footprint calculator/product · blue-carbon credit pitches · planting as flagship action · a second recycling/transparency app · chat-app logistics (Telegram/hashtags/school colors) · `[AI note]`-only "assignments".

## Triage — need a decision or an input

| Item | What blocks it |
|------|----------------|
| Klima Kasan Awards ₱50k entry | Need award deadline + eligibility rules |
| MWell challenge participation (window Aug 22–Sep 11, winners Sep 12) | Need team commitment decision |
| Pre-showcase convocation + CCC×NYC institutionalization | Organizer-level decision, outside desk control |
| Carbon-market integrity / PH biodiversity-credit standard research | CCC deferred it in-session; needs scoping call |
| ~~Polkadoc vault mining~~ | **mined 2026-08-25** — vault at `~/polkadoc`; YCLAP Messenger chat + 5 CCC-YCLAP email threads extracted; facts folded into library/eval/tracker/landing rows |
| ~~Messenger YCLAP groupchats~~ | **mined 2026-08-25** — the vault chat carried the async-week cadence + team roster; no other yclap-named chats in the vault as of its last scrape (2026-08-23/24) |

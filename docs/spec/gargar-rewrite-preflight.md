# Gargar rewrite pre-flight — campus waste last-mile

**Status:** prep for the Aug 26 scope vote. Nothing in `~/Codex/gargar` was touched (its tree carries uncommitted AGENTS.md/PRD work-in-progress). If the group picks rewrite-in-place, execution starts from this page.

## Current state (audited 2026-08-25)

| Layer | What exists | Verdict |
|-------|-------------|---------|
| Shell | Hash-routed role switch, 5 surfaces: `citizen` · `driver` · `map` · `government` · `intel` (`src/lib/role.js`) | **Keep** — the rewrite adds a role, not a new architecture |
| Ledger core | `src/lib/payout.js`, `diversion_log.js`, `session.js`, `role.js`, `api.js` — all under `node --test` | **Keep verbatim** — this is the proven backend the memo refused to recreate |
| Rates | `src/data/material_rate.js` (~20 streams), `rate_compare.jsx` | **Extend** — feeds the waste calculator's kg estimates |
| Directory | `collector.js`, `collector_pin.js`, Leaflet `map.jsx` | **Extend** — same pin pattern becomes the stream→partner map |
| Intel | `src/data/intel/*` EcoWaste baseline board | **Keep** — already answers "where does waste go" partially |
| Infra | Vite 6 · React 19 · port 9400/9401 claimed, eslint + tsc + node tests | **Keep** |

## Proposed new IA (three additions, zero renames)

1. **`organizer` role** — the waste calculator: inputs attendance, sponsor mix, venue type → outputs estimated kg per stream, bags, bins, haul trips. Pure function in `src/lib/event_waste.js` + tests, mirroring house style; UI is one form + result card.
2. **Kit registry** — `src/lib/kit.js`: each colored-bag kit has a station_code, location, bag_color set, fill_state, restock_request. Powers the deploy/restock loop for covered courts and food-stall rows.
3. **Partner routing on the map** — extend the collector-pin data pattern: stream (PET/paper/food/…) → accepting partner, so "after segregation, where next?" has a visible answer.

The SOM forest stays as evidence content (litter findings from quadrant sampling) inside the story, not as a separate forked site — reversing only the *separate-repo* half of the Aug 22 memo decision; backend reuse was always the plan.

## Execution order if approved

P1 calculator (pure logic + tests → UI) → P2 kit registry → P3 partner map. Each lands behind its own route, showcase-safe: the flagship citizen flow never moves until P3 is green.

## Not done here (deliberate)

No branch created, no file touched in gargar — its working tree is dirty with your AGENTS.md/PRD edits. First execution step after the vote: commit or shelve that WIP, cut `rewrite/prep`, scaffold `organizer`.

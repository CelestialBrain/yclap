# SOM fork spec — Gargar → Swamp Forest reskin

**Version:** 0.1 · 2026-08-25 · Lane K (roadmap P2)
**Source of truth:** `docs/plaud/2026-08-22-som-forest-restoration.md` (all `m:ss` cites below are that brief)
**Execution repo:** future sibling under the same org ("round robin") — NOT this repo, NOT `~/Codex/gargar`
**Flagship context (read-only):** `docs/campaign-canvas.md:43,45`, `docs/pitch-3min.md:27` — Gargar keeps its trash-value mission; this fork is a separate product, not a replacement.

---

## 1. Scope — fork, don't recreate

Decision: fork Gargar into a separate repo under the same org and reskin it, rather than rebuild from zero. The speaker is explicit twice — "I won't throw it away" (`4:22`) and the non-goal "I don't have to recreate the backend" (`5:18`). Ship an incomplete concept on purpose: "It's not a complete concept… it's just gonna be executed differently" (`0:00`).

**Stays backend-identical** (inherited from `~/Codex/gargar` untouched):

| Layer | What carries over |
|-------|-------------------|
| App shell | Vite + React SPA; `index.html` → `src/main.jsx` → `App.jsx` boot path; `npm run dev` workflow |
| Data-module pattern | Plain JS modules under `src/data/` with colocated `.test.js` files (`copy.test.js`, `haul.test.js`) |
| Lib layer | Pure logic modules under `src/lib/` (`payout.js` + test, `diversion_log.js`, `role.js` pattern) |
| Asset pipeline | `src/asset/kit.js` manifest importing sibling asset dirs |
| View composition | `src/view/` component-per-screen layout |

**Gets reskinned:**

| Surface | Gargar today | SOM fork |
|---------|--------------|----------|
| Theme copy | `gargar. — There's cash in your bottles, scrap, and cartons` (index.html title); mission *See the scrap price…* | Swamp-forest title + species-scarcity tagline |
| Problem framing | Recyclable value opacity (canvas §1) | Species scarcity root cause (§2 below) |
| Data model fields | `material_rate.js` (₱/kg), `collector.js`/`collector_pin.js` (shop directory), `haul.js`/`diversion_log.js` (kg diverted), `weigh_point.js` | Same shapes, renamed to the domain: `species.js` (one record per tree species, `species_code`, `is_native`), `plot.js`/`plot_pin.js` (swamp-forest zone directory), `restoration_log.js` (entry count replaces kg) |
| Copy content | `src/data/copy.js` scrap-price narrative | Forest narrative per `src/data/copy.test.js` contract |

## 2. Problem reframe — trash value → native-species scarcity

Gargar's premise (people don't see trash value, `pitch-3min.md:27`) is retired here. The new problem statement, set verbatim at `13:08`: **"The problem is species scarcity in Ateneo's Swamp Forest."**

Root cause before solutions — the brief demands finding why wrong tree types are there first (`2:54`, `7:16`), rejecting the supplied generic green-tech answer (`1:57`). Working root cause: historical fast-shade plantings put invasive mahogany-style exotics into a wetland that native swamp species never re-colonized, leaving dead understory, litter traps, and mosquito habitat (`7:16`, `8:14`).

Grounding from adjacent research:

- `R42-rodel-lasco-nbs.md:97` — restore degraded areas via ecosystem zoning and research-guided, climate-responsive forest management; `:98` names the exact gaps this fork dramatizes: species climate sensitivity, ecosystem-based adaptation, long-term monitoring.
- `R42-rodel-lasco-nbs.md:114` — Lasco is not a mass-planting cheerleader; plantings must match site ecology. Wrong-species planting is precisely the maladaptation he warns against.
- `R42-rodel-lasco-nbs.md:160` — red-flag pattern: "We'll plant N trees" with no survival, species, elevation, tenure, or 3-year M&E.
- `R14-katipunan-ateneo-heat.md:36` — past SOM Forest road-widening pushback shows the forest is contested green space; `:32` — Ateneo already proves native-species practice works via its 101-tree Arboretum of Threatened Philippine Trees.

## 3. Asset reuse inventory (from read-only peek at `~/Codex/gargar`, 31 files)

**Reusable as-is or near-is (pattern + neutral art):**

| Path | Reuse |
|------|-------|
| `src/asset/kit.js` | Manifest pattern — extend with new forest entries |
| `src/asset/icon/check.png` | Generic success glyph |
| `src/asset/icon/pin.png` | Map pin → `plot_pin` reuse |
| `src/asset/icon/scale.png` | Weigh/scale icon → monitoring panel |
| `src/asset/icon/payout.png` | Value-callout slot → species-value callout |
| `public/favicon.png` | Placeholder until forest favicon ships |

**Reskin-required (right slot, wrong subject):**

| Path | Why |
|------|-----|
| `src/asset/mark/sack.png` | Logo mark is a trash sack → needs forest mark |
| `src/asset/hero/handoff.png`, `hero/walk.png`, `hero/weigh.png`, `hero_still_life.png` | Junk-shop still-life scenes → forest scenes |
| `src/asset/icon/collector.png`, `icon/haul_sack.png` | Junkshop/collector figures → ranger/planter figures |
| `src/asset/material/*.png|.svg` (15: aluminum, brass, cardboard, copper, electronics, film.svg, glass, iron, paper, pet, pet_mixed, plastic_cup, sachet.svg, styro.svg, tin) | Waste-material cards → native-tree-species cards |
| `src/asset/spot/empty_collectors.png`, `spot/empty_rates.png`, `spot/success.png` | Empty-state slots kept; art redrawn for species board |

**New assets needed:** forest mark + favicon · ~8–12 native swamp-species card images (start from arboretum-listed natives, `R14:32`) · hero still life (swamp forest scene) · empty-states for species board and restoration log · bin-guide illustration for the bin UX slice.

## 4. Four solution directions → feature slices

Chosen at `5:18` with education/psychology focus (brief Decision 4). Each slice = one line of behavior in the forked app:

| Slice | Behavior (one line) |
|-------|---------------------|
| `natural_maintenance` | Show that once native species are restored, the forest sustains itself — a maintenance-less-forest explainer panel replacing the diversion-log pitch (`5:18`, `5:49`) |
| `tech_knowledge` | Surface a species/root-cause knowledge base — which tree grows where, and why the wrong ones got planted (`6:19`) |
| `bin_ux` | Guide proper waste disposal through clearer bin/disposal interface so litter stops smothering seedlings (`9:44`, `11:42`, `12:37`) |
| `stat_sizing` | Size bin capacity to measured waste averages instead of guesswork — a small stats view over collected counts (`9:44`, `11:42`) |

## 5. Non-goals — deferred musings, do not build by accident

Born as musings in the brief and left tentative; none is confirmed for the fork:

1. **Wildlife "bunker"** for Ateneo like big state universities — "might have to research on this more" (`6:19`).
2. **Faster alternatives to quadrant soil/testing sampling** (`7:16`).
3. **Colored trash bags + liquids bin + low-text label specifics** — direction chosen (`bin_ux`), concrete mechanics still "we have to think why" (`9:44`, `12:37`); do not ship props/artwork for these yet.
4. **AIS / student-org collaboration** as a feature — partnership track, not product (`9:44`, `10:42`).
5. Open questions stay open: why wrong trees were planted historically (`7:16`), 30-year mosquito/malaria trajectory (`8:14`), climate-action × climate-justice weaving (`8:14`), ₱35 JSAC container returnability (speaker corrected himself, quote the correction `11:42`).

Note: the maintenance-less forest began as musing M5 but was promoted into the four chosen directions by the brief itself (`5:18`) — hence it is slice `natural_maintenance`, not a non-goal.

## 6. Acceptance pointer — out of scope here

The benchmark "fork boots via `npm run dev` and renders the reskinned swamp-forest theme" belongs to the future fork repo's own gate (its README + test suite), not this repo. This lane delivers the spec only; no code, no fork, no sibling-repo writes.

---

*Spec written in `/Users/angelonrevelo/Grok/yclap-opencode`; `~/Codex/gargar` was read-only.*

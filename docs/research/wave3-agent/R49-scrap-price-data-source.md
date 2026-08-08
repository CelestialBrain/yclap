# R49 — Public Scrap / Recyclable Price Data Sources (PH & Asia) for Gargar Rates

**Agent:** YCLAP research (wave 3)  
**Scope:** Public and semi-public sources usable for **Gargar rate tables** — government stats, scrap apps, exchange / PRA sites, Asia commodity feeds; ethical rate-table methodology  
**Geography:** Philippines primary; Asia secondary benchmarks (LME, SEA scrap, China/India)  
**Date:** 2026-08-07  
**Status:** Source inventory + ops playbook (pairs with R06 price dynamics)  
**Related product state:** `~/Codex/gargar/src/data/material_rate.js` currently ships single-point ₱/kg labeled EcoWaste field (Mar 2026); values align closely with historical NSWMC dual-column table  

---

## Key findings

### 1. There is no open Philippine “rate API” — live ₱/kg is informal by design

| Layer | What exists | Usable for Gargar? |
|-------|-------------|--------------------|
| **Official live NCR scrap index** | **Not found** — no DENR/NSWMC/DTI/PSA daily or weekly open feed of junkshop buy prices for PET, HDPE, Al cans, copper, OCC, steel | **No** (gap = product opportunity) |
| **Quasi-official schedule** | DENR–EMB / **NSWMC *Price of Recyclables*** PDF (based on EMB Central Office MRF sales; dual **junkshop vs factory** ₱/kg) still hosted on `nswmc.emb.gov.ph` | **Taxonomy + structure only** — absolute ₱ outdated vs 2025–26 street metals |
| **Customs valuation** | BOC memoranda / reference values for scrap/wastage (e.g. 2017-04-012: steel ₱8.50/kg, aluminum ₱40, cartons ₱5, plastic items ₱10, copper rod ₱120.76) | **Not street buy rates** — import/local-sale valuation, stale absolute levels |
| **Trade statistics** | PSA International Merchandise Trade Statistics; **UN Comtrade** HS chapters for waste/scrap metals, plastics, paper | **Direction of trade / volume**, not household ₱/kg |
| **Live local ₱** | Junkshop **Facebook** price boards, FB groups, **TikTok / YouTube** “tanso price update” culture | **Best ground truth** if date + shop + grade logged |
| **Global / Asia benchmarks** | LME (Cu, Al primary), Fastmarkets scrap & SEA Al scrap, ScrapMonster (China/India), Kitco base metals, ChemOrbis / OPIS rPET, Fastmarkets RISI OCC | **Trend / volatility context**, not walk-in junkshop ₱ |

**Implication:** Gargar cannot honestly claim a single national guaranteed price. Every rate UI needs **range or midpoint + as-of date + source class + grade note**, and a hard product line: **final payout set by collector after weigh-in**.

### 2. Government and public-sector sources (Philippines)

#### 2.1 NSWMC / EMB *Price of Recyclables* (primary PH structure source)

- **URL:** `https://nswmc.emb.gov.ph/wp-content/uploads/2016/08/Price-of-Recyclables.pdf`
- **Method (stated):** Based on sales of **EMB Central Office MRF**; columns for **Junk Shop Price / Factory Price** per kilo (or per piece for some bottles).
- **Materials of Gargar interest (historical levels — illustrative of structure, not 2026 street):**

| Material | Junk (₱/kg) | Factory (₱/kg) | Notes |
|----------|-------------|----------------|-------|
| Clean PET (no caps/labels) | 16 | 20 | Unclean PET 12 / 15 |
| Aluminum cans | 50 | 60 | Soft-drink cans |
| HDPE sibak | ~10 | ~13 | Food bottles vinegar/soy etc. |
| Cartons corrugated | 2.50 | 3.00 | |
| Copper wire Class A | 300 | 350 | B 250/300; C 150/200 |
| Steel (bakal) | 9 | 12–14 | GI sheet 7 / 10 |
| Tin can (lata) | 3 | 5 | **Not aluminum** |

- **Use:** Material taxonomy, clean vs dirty PET, copper A–C language, **junk → factory premium structure**.  
- **Do not use:** As live 2026 NCR walk-in rates (especially copper — street Class A has been in the high ₱600s–₱700s in 2026 shop lists per R06).

#### 2.2 NSWMC junk shop survey / recycling industry studies

- NSWMC-hosted **Junk Shop Survey** reports (historical) and JICA / ERIA recycling industry studies: volumes, plastic ₱1–7/kg era bands, chain roles — useful for **value-chain design**, not daily rates.
- DENR **Plastic Waste Roadmap** (2024 PDF on NSWMC site) and RA 9003 / EPR context: policy, not price feed.

#### 2.3 Bureau of Customs (BOC) reference values

- **Example:** Memorandum **2017-04-012** — Reference Value for Scrap Products/Wastages subject of Local Sales (₱/kg): steel scrap 8.50; aluminum 40; cartons 5; plastic items 10; copper rod 120.76; stainless 40; paper 10.
- **Use:** Historical official valuation floor; FOI / VRIS awareness.  
- **Do not use:** As Gargar household buy rate (purpose is customs assessment when sale docs absent; levels lag commodity cycles).

#### 2.4 Philippine Statistics Authority (PSA)

- **International Merchandise Trade Statistics** (monthly/annual exports-imports).  
- Scrap metals and waste plastics appear in trade aggregates; **no published retail junkshop price series**.  
- **Economy-Wide Material Flow Accounts** (PSA releases) speak to material throughput / recycling capacity gaps — macro narrative only.

#### 2.5 UN / MDB sector studies (value, not daily ₱)

- World Bank **Market Study for the Philippines: Plastics Circularity** — material value loss (~78% of key resin value; ~USD 790–890M/year order-of-magnitude); virgin vs recycled resin economics; MFA methods.  
- Supports **justice + diversion narrative** and material prioritization (PET recoverable; multilayers hard), not a rate board.

### 3. Informal PH “live” sources (highest fidelity for street ₱)

These are the **actual sensors** for Metro Manila buy prices:

| Channel | What you get | Cadence | Audit quality | Gargar role |
|---------|--------------|---------|---------------|-------------|
| **Junkshop Facebook pages / groups** | Full grade boards (solid steel, yero, Al grades, tanso A–D, brass) | Daily–weekly posts | Medium if **screenshot + date + shop ID** saved | Primary field source for metals |
| **TikTok / YouTube scrap vloggers** | Copper Class A–D, aluminum grade talk, “today’s price” | High frequency (days) | Low–medium (often no address; good pulse) | Copper/aluminum **volatility signal** |
| **Walk-in / phone quote to Pasig–QC shops** | True pilot patch rates | On demand | **Highest** if scripted log | **Required** before freeze of demo rates |
| **Secondary blogs** (Bria Homes, lifestyle “what junkshops buy”) | Round ₱ figures | Stale years | Low | Household literacy only |
| **Academic junkshop surveys** | Throughput, income, role | One-off | Medium for mechanism | Chain design; not live UI |

**Negative result:** No PH-native consumer scrap app (iScrap-equivalent) with multi-yard reported ₱ averages was found for Metro Manila. iScrap App itself is **US/Canada only**.

### 4. Asia & global commodity / scrap data sources

#### 4.1 Primary metal benchmarks (trend layer)

| Source | Coverage | Access | Use for Gargar |
|--------|----------|--------|----------------|
| **LME** (`lme.com`) | Official Cu, Al, Pb, Ni, Zn; ferrous scrap CFR Turkey / India / Taiwan indices (partner assessments) | Delayed free pages; full data paid | Explain **why copper/Al move**; never paste LME $/t as junkshop ₱/kg |
| **Kitco** base metals | Spot Cu, Al charts ($/lb) | Free | Quick public trend charts for demos |
| **CME / COMEX copper** | US copper futures | Free delayed via many portals | Secondary to LME for PH narrative |

**Rule:** Non-ferrous scrap yards globally price as **% of LME / formula**; PH junkshops translate that into ₱ with local grade discounts, working capital, and offtake. Ferrous is more **regional** (Turkey, India, Taiwan import bids).

#### 4.2 Price Reporting Agencies (PRA) & scrap indices (Asia-relevant)

| Source | What | Notes |
|--------|------|-------|
| **Fastmarkets** (Metal Bulletin, Scrap Price Bulletin, RISI) | Ferrous scrap, **Southeast Asia aluminium scrap** (UBC/Taldon, Zorba, borings — CIF SEA assessments), recovered paper **OCC** | Gold-standard methodology (IOSCO-aligned processes for many metals/scrap assessments); **paywalled** — not for product hard-coding without license |
| **ScrapMonster** | Daily scrap prices **US, China, India, Europe** (hundreds of grades) | Free teaser / aged free lists; full paid. **No dedicated Philippines yard panel** |
| **Scrap Register** | Global scrap offers + prices | Subscription-heavy |
| **SteelOrbis / BigMint** | Steel scrap regional (incl. India CFR) | Ferrous professional traders |
| **Asian Metal / SMM / Metalexchangedirect (Peony)** | China/Asia secondary metal intelligence | Industry; not household |
| **ChemOrbis / OPIS** | Virgin PET and **rPET flake / bale** Asia (incl. SEA, Indonesia, Malaysia, China bales) | Plastic **factory-gate** context; far above walk-in PET bottle ₱/kg |
| **OnlineScrapYard** country pages (incl. “Scrap Prices in Philippines”) | Calculator claiming LME/CME-adjusted local estimates | **Indicative only** — site states estimates from global spots + freight/processing; **not** verified PH yard surveys. Safe as educational calculator second-tier, not source of record |

#### 4.3 Apps & directories (mostly non-PH)

| App / site | Region | Feature | PH usable? |
|------------|--------|---------|------------|
| **iScrap App** | US & Canada | Crowd-reported yard prices, national averages, yard finder | **Method inspiration only** (user-report + disclaimer) |
| **Metal Radar** | Europe | LME + trader tools | Benchmark only |
| **Recycling.com** price hub | Global pointers | Links LME, ISRI directories, apps | Meta-directory |
| **ISRI / ReMA Scrap Specifications Circular** | Global grade language | Defines Bare Bright, UBC, HMS, paper grades | **Grade taxonomy** for product copy (map to PH names: tanso A, sibak, karton) |
| SEA cat converter apps (e.g. BR Metals SG) | Singapore / SEA niche | Catalytic converters | Out of scope for household pilot |

### 5. Material-to-source map (what feeds each Gargar row)

| Gargar material | Best local ₱ source | Best trend source | Common data failure |
|-----------------|---------------------|-------------------|---------------------|
| **PET clean / mixed** | Pasig junkshop phone + FB PET lists | ChemOrbis virgin PET; OPIS/SEA rPET flake (direction only) | Clean vs dirty/caps; colored vs clear |
| **Aluminum cans (UBC)** | Field quote; separate from structural Al | LME Al; Fastmarkets SEA UBC CIF | **Confusing with tin *lata*** (~₱3–8) |
| **Cardboard (karton)** | Local junkshop; low open web refresh | Fastmarkets RISI OCC Asia import | Wet/mixed fiber discounts |
| **Copper wire** | FB consolidator boards + TikTok A–D | LME Cu | Class A vs coated D; theft optics |
| **Scrap iron / steel** | FB consolidator boards | LME ferrous scrap CFR Asia; ScrapMonster China | Solid vs yero vs BI grades |

### 6. Ethical rate-table methodology (for a public-facing pilot)

Professional PRAs (Fastmarkets et al.) codify practices Gargar can **adapt lightly** without claiming PRA status:

1. **Define the price**  
   - Explicit: *“Indicative junkshop buy price paid to walk-in household / collector for graded material in [city], ₱/kg, cash, no free pickup.”*  
   - Not: factory gate, export FOB, or LME primary.

2. **Grade before number**  
   - Use dual labels: PH street name + quality note (e.g. *PET clean mineral — no caps/labels*; *Aluminum UBC cans — not tin lata*).  
   - Align copper classes to local A–D practice; optionally crosswalk to ISRI names in help text only.

3. **Prefer ranges + as-of**  
   - `rate_low` / `rate_mid` / `rate_high` + `as_of_date` + `source_class` (`field_quote` | `shop_post` | `nswmc_baseline` | `eco_waste_survey`).  
   - Single-point rates only if labeled **mid of recent band** and conservative for ₱-earned claims.

4. **Minimum evidence per rate freeze**  
   - Pilot honesty bar: **≥2 independent Pasig (or pilot LGU) quotes** within **14 days** for PET + aluminum cans; metals may use dated public shop posts if shop named.  
   - Log: material, grade, ₱/kg, shop/pseudonym, barangay, channel, timestamp, collector vs walk-in.

5. **Never present as guaranteed payout**  
   - Product copy already correct in spirit (`material_rate.js` comment: final payout set after weigh-in). Keep that **in UI**, not only in code comments.

6. **Justice / do-no-harm**  
   - Rates exist to **reduce information asymmetry** for households and informal collectors — not to undercut junkshops or set a “fair price” Gargar cannot enforce.  
   - Avoid copper-first marketing that could read as strip-theft encouragement; prioritize PET / carton / Al cans for campus KPIs.  
   - Attribute sources; do not scrape private groups in ways that dox workers; prefer **public posts** or **consented** partner quotes.  
   - Child labor red line (see R05): no “family scrap income” romanticism in rate copy.

7. **Volatility handling**  
   - Copper/aluminum: refresh **weekly** or show “volatile — check collector.”  
   - PET/karton/steel: **biweekly–monthly** field check may suffice if offtake stable.  
   - When LME Cu moves >~5% week-over-week, flag metals for manual review (trend only).

8. **Dual column optional (educational)**  
   - NSWMC pattern: show **household reference** vs **“industry higher”** without inventing factory numbers — or omit factory if not measured.

9. **License / ToS**  
   - Free public posts + own field work: OK with attribution.  
   - Fastmarkets, ScrapMonster paid data, ChemOrbis: **do not republish numbers** in-app without license; use for internal research only.  
   - OnlineScrapYard-style LME-derived calculators: if used, label **estimate / not local yard**.

10. **Version the table**  
    - Ship `material_rate` with `schema_version`, `as_of`, and changelog in repo so mentors can audit honesty of ₱ claims on pitch day.

### 7. Gap summary (research negatives)

- No PSA/DTI open **NCR recyclables CPI** or scrap index.  
- No audited multi-shop 2024–2026 panel dataset for Metro Manila household recyclables.  
- No PH scrap app with crowd-reported yard prices.  
- “Philippines scrap prices” SEO pages are usually **global-formula converters**, not field panels.  
- Plastics and cardboard have **weaker** public high-frequency data than copper/aluminum.

---

## Gargar data ops

### A. Recommended rate stack (three layers)

```
Layer 1 — SOURCE OF TRUTH (product): Field + partner quotes
          Pasig/pilot LGU junkshops, consented collectors, EcoWaste-style survey
          → material_rate.js (or future rate table JSON)

Layer 2 — SENSORS (ops): Public FB shop boards + dated TikTok copper pulse
          → weekly ops log (CSV/sheet), not auto-published without review

Layer 3 — CONTEXT (narrative / mentor deck): LME, Fastmarkets headlines,
          NSWMC taxonomy, World Bank plastics value story
          → never hard-code into user-facing ₱ without conversion methodology
```

### B. Suggested schema (evolve `material_rate.js`)

Keep **singular** collection name per project convention (`material_rate` is fine). Prefer rich fields over silent single numbers:

```js
// Conceptual target schema (ops recommendation — not a code change in this memo)
{
  material_code: "pet",
  material_name: "PET clean",
  rate_amount: 12,           // mid of band if single field kept
  rate_low: 8,
  rate_high: 16,
  currency: "PHP",
  unit: "kg",
  grade_note: "Clean clear mineral; no caps/labels",
  source_class: "field_quote", // field_quote | shop_post | survey | nswmc_baseline
  source_label: "Pasig shop A + B phone, 2026-08-xx",
  as_of: "2026-08-07",
  geography: "Pasig / Metro Manila",
  payout_disclaimer: true,   // UI always: final ₱ after weigh-in
}
```

**Current shipped values** (EcoWaste-labeled Mar 2026 field note) match **NSWMC-era structure** (PET 16 / 12, Al 50, carton 2.5, copper 300, iron 8). Ops should:

1. Re-verify whether EcoWaste survey truly reconfirmed those levels or reused the EMB table.  
2. If copper remains ₱300 in product while street is ₱650–800, either **update** or **relabel heavily** as “historical baseline / educational” to avoid credibility hits with junkshop partners.  
3. Aluminum **50** may still be a conservative educational UBC figure; field-verify cans separately from scrap Al grades (R06 flags this as medium–low confidence).

### C. Ops cadence (5-week pilot)

| Cadence | Action |
|---------|--------|
| **Day 0 (pre-demo freeze)** | Call/visit **≥2** Pasig junkshops or collectors for PET clean, PET mixed, Al cans, carton; log sheet |
| **Weekly** | Scan 1–2 public NCR metal boards for copper/steel; note Δ; update only if metals shown in UI |
| **Biweekly** | Re-spot PET + carton if offtake rumors (mill downtime, holidays) |
| **Pitch / public wall** | Display **as_of + “indicative” + “collector sets final ₱”**; use **conservative mid** for estimated ₱ diverted |
| **Never** | Silent auto-scrape of private groups into production without human review |

### D. Field quote script (minimal)

1. Shop name / barangay / date-time / contact type (walk-in vs phone).  
2. “Magkano buy ninyo ngayon per kilo: clean PET mineral? mixed PET? aluminum soft-drink cans (hindi lata)? karton?”  
3. Volume threshold for better price? Free pickup minimum?  
4. Confirm units (kg) and whether price includes dirty/wet discount.  
5. Consent to list as “partner rate as of [date]” (optional).

### E. What not to build in week 1–5

- Live LME API → ₱ converter presented as local junkshop price.  
- Scraping OnlineScrapYard / ScrapMonster as “PH prices.”  
- National average from TikTok alone.  
- Copper-led campus challenges without partner e-waste pathway.

### F. Fit to YCLAP metrics

- **kg diverted** can be solid with weak prices; **₱ estimated** requires honest bands.  
- Prefer: `estimated_php = kg × rate_mid × 0.9` (haircut) with disclosed method.  
- Justice: transparent rates reduce bargaining asymmetry for pickers/households (R05/R06); rates alone do not replace collector path.

---

## Sources

### Philippines government / quasi-official
- DENR–EMB / NSWMC, *Price of Recyclables* (EMB Central Office MRF dual junk/factory table): https://nswmc.emb.gov.ph/wp-content/uploads/2016/08/Price-of-Recyclables.pdf  
- NSWMC site reports (junk shop survey series; plastic roadmap materials): https://nswmc.emb.gov.ph/  
- Bureau of Customs, Memorandum **2017-04-012**, Reference Value for Scrap Products/Wastages (local sales valuation table): https://customs.gov.ph/wp-content/uploads/2023/02/mem_2017_04-012-Reference-Value-for-Scrap-Products.pdf  
- BOC memoranda index for reference values: https://customs.gov.ph/memoranda-for-reference-values/  
- PSA International Merchandise Trade Statistics: https://psa.gov.ph/statistics/export-import/monthly  

### Informal / field PH price channels
- Public junkshop Facebook price boards and scrap groups (e.g. NCR consolidator posts — see R06 Tingzon Caloocan Mar/Jun 2026 examples).  
- TikTok / YouTube PH junkshop copper Class A–D update ecosystem (2025–2026).  
- Gargar product data note: EcoWaste-aligned field rates in `~/Codex/gargar/src/data/material_rate.js`.  
- YCLAP R06 (companion): `docs/research/wave3-agent/R06-scrap-price-dynamics-mm.md`.

### Asia / global scrap & commodity
- London Metal Exchange — non-ferrous + ferrous scrap partner indices: https://www.lme.com/  
- Kitco base metals (Cu, Al spot charts): https://www.kitco.com/price/base-metals  
- Fastmarkets scrap & secondary; SEA aluminium scrap assessments; methodology (IOSCO-aligned PRA processes): https://www.fastmarkets.com/metals-and-mining/scrap-and-secondary/ ; https://www.fastmarkets.com/methodology/  
- Fastmarkets RISI recovered paper / OCC Asia-related assessments: https://www.fastmarkets.com/forest-products/recovered-paper/  
- ScrapMonster multi-region scrap prices (US, China, India, Europe): https://www.scrapmonster.com/scrap-prices  
- Recycling.com scrap price hub (LME pointers + app directory): https://www.recycling.com/scrap-metal-prices/  
- OnlineScrapYard Philippines calculator (LME/CME-derived estimates; self-described indicative): https://onlinescrapyard.com.au/scrap-prices/scrap-prices-philippines/  
- iScrap App (US/Canada crowd-reported yard prices — method model, not PH data): https://iscrapapp.com/  
- ISRI / ReMA Scrap Specifications Circular (grade language): https://www.isrispecs.org/  
- ChemOrbis plastics pricing; OPIS SEA rPET flake/bale reporting (factory/trade level).  
- UN Comtrade (scrap trade HS data): https://comtrade.un.org/  

### Sector economics (not rate boards)
- World Bank, *Market Study for the Philippines: Plastics Circularity Opportunities and Barriers* (2021): material value loss / MFA framing.  
- ERIA / Antonio, recyclables collection trends (PH chapter); JICA recycling industry study (historical capacity).  
- Academic: junkshop-as-chain-actor studies (e.g. 2024 highly urbanized city recovery papers).

### Internal YCLAP
- `docs/campaign-canvas.md`, `docs/pilot-7-day.md`, R05 informal workers, R06 scrap price dynamics.

---

## Confidence

| Claim cluster | Confidence | Rationale |
|---------------|------------|-----------|
| No official open live PH junkshop rate API / NCR scrap index | **High** | Consistent absence across NSWMC, PSA, DTI public products; industry uses informal boards |
| NSWMC dual-column table is structure-rich but absolute-₱ stale | **High** | PDF still public; copper/steel street 2026 diverges strongly (R06) |
| BOC reference values ≠ household buy rates | **High** | Explicit customs valuation purpose; 2017 levels |
| Best street ₱ sensors = dated shop FB + field calls | **High** | Matches how NCR scrap market actually prices |
| LME / Fastmarkets useful for metal trend, not walk-in ₱ | **High** | Standard global scrap pricing architecture |
| OnlineScrapYard / similar “PH prices” pages are formula estimates | **High** | Site methodology text: global spots + local adjustments; not yard panels |
| iScrap / ScrapMonster not PH-yard panels | **High** | Geographic product scope |
| EcoWaste Mar 2026 labels in Gargar may equal NSWMC baseline levels | **Medium** | Numeric coincidence with EMB table; needs ops verification with EcoWaste notes |
| Fastmarkets SEA Al scrap / OCC usable as free public inputs | **Low–medium** | Assessments exist but full series paywalled; headlines only without license |
| Exact multi-shop 2026 PET/Al can midpoints for Pasig without new field work | **Low** | Requires pilot freeze calls (R06 same residual) |

**Overall memo confidence:** **High** for **source architecture and methodology** (what to trust, what not to hard-code). **Medium** for any specific ₱ recommendation beyond “field-verify before freeze.” This memo is a **data-ops playbook**, not a price list.

---

*End R49*

# Winning / participating climate projects deep dive

**Date:** 2026-08-08  
**Method:** `/grok` fleet of **30 headless Grok-4.5 research agents** (web_search + web_fetch, structured JSON). Claude verified contested school labels and synthesized.  
**Raw outputs:** `docs/research/wave-grok-projects/raw/G01.json` … `G30.json` + `compiled.json`  
**Fleet result:** 29/30 structured on first pass (~$7.10 notional API-equivalent); G27 retried separately.

**Hard rule:** Claims below are **public-source best effort**. Empty cells mean “not found,” not “does not exist.”

---

## 0. Does each year have the same theme?

**No.**

| Program | Same theme every year? | What changes |
|---------|------------------------|--------------|
| **Philippine Resilience Awards (CCC)** | **No** | Annual Filipino slogan shifts; women-only in 2023; youth added 2024+ |
| **CCC Week** (host week for PRA) | **No** | Separate slogan from PRA (e.g. 2024 CCC Week: *Aksyon at Adaptasyon ng Makabagong Henerasyon*) |
| **Gawad CCC / Climate Science Youth Program** | **No** | 2018 water/1.5°C frame; 2019 food–water–energy nexus; recent cycles thin online |
| **Youth CLAP** | **N/A (no multi-year public theme archive)** | TOR describes modules + showcase; no published “year theme” series for student projects |

### PRA theme strings (public)

| Year | Theme / framing | Youth category? |
|------|-----------------|-----------------|
| **2023** | Philippine Resilience Awards **for Women** (no verified youth track) | **No** |
| **2024** | *Kababaihan at Kabataan: Katatagan ng Bayan* | **Yes** (2 youth champions) |
| **2025** | *Kababaihan at Kabataan: Katuwang sa Paghahabi ng Isang Matatag na Bayan* | **Yes** (5 youth champions) |
| **2026** | Primer material (secondary): *Kababaihan at Kabataan: Nagkakaisa Tungo sa Matatag at Maunlad na Pilipinas* | Expected; re-check PRAwards.PH |

Sources: G06–G08, G30 agents; climate.gov.ph news 819 / 961 / 1047.

---

## 1. Youth CLAP past projects (direct)

| Question | Finding | Confidence |
|----------|---------|------------|
| Named past YCLAP teams / schools / winners? | **None public** | high gap |
| Innovation Showcase brand | **Likha-Klima** = *tentative title* in TOR, not a public winner archive | medium |
| Young Climate Innovators Circle | Planned afterlife CoP; no public membership roster | medium |
| 2025 design docs | Procurement / TOR / ITB exist; student product list does not | high |

**Implication for you:** there is no prior YCLAP “hall of fame” to reverse-engineer. Use **PRA youth champions** and **PH climate showcases** as the closest peer set.

---

## 2. Philippine Resilience Awards — youth projects (closest CCC peer)

### 2025 (5 youth champions) — most detailed public set

| Project | Builder | School / org | Place | What it does | When recognized |
|---------|---------|--------------|-------|--------------|-----------------|
| **Reskyusi Food Basket** | Raymart S. Garcia (barangay kagawad / program officer) | Brgy Commonwealth, Quezon City | QC | Food rescue from markets → baskets for food-insecure families → compost/vermicast to urban gardens | PRA 2025 Youth |
| **Kwentong Kalikasan** | Val Amiel Vestil (+ AYEJ) | Association of Young Environmental Journalists; Vestil = Silliman University mass-comm alumnus | Northern Mindanao content (Bukidnon / MisOr); AYEJ in CDO | ~14-episode hope-based climate/forest storytelling series (project ~2022; PRA 2025) | PRA 2025 Youth |
| **Green by Design** | Shri Tahanie B. Macaumbao (+ early team Anna Boloto, Mohammad Ali Baruang) | Origin: **MSU–Marawi Senior High**; later NYC / WWF youth network | Lake Lanao / Marawi | Water hyacinth → plant-based compostable packaging; waste + water story | PRA 2025; earlier *Next Bright Idea* pitch ~2021 |
| **Project MOSES** | Engr. **Christian B. Hernandez** (lead) + MinSU team | **Mindoro State University (MinSU)** — *not* Mindanao State U (CCC press mislabel; MinSU primary corrects) | Oriental Mindoro (Mag-asawang Tubig / Naujan etc.) | IoT site-specific e-weather stations for local early warning | PRA 2025; also DOST-MIMAROPA Best R&D 2025 |
| **Subang Environmental Initiatives** | Peter John C. Enorio / Subang PH | **Cebu Technological University – Barili** | Cebu | Land restoration, NbS, propagation (kamagong/bamboo), clean-ups | PRA 2025 Youth |

**Patterns that won CCC validation:** place-specific, field-checkable, community attached, often multi-year work (not a 5-week app only).

### 2024 (2 youth champions)

| Champion | Org / base | Project / practice | Notes |
|----------|------------|--------------------|-------|
| **Christian John Evangelista** | Manila City DRRMO | LGU DRRM / climate-resilience leadership (Astronomer-Meteorologist, DRRM Officer V) | Not a student club project; city practice |
| **Edren Llanillo** | Padyarescue Inc. / **Go Bike Project** | Youth bicycle emergency-response; first aid + DRRM + climate adaptation training | Bugallon, Pangasinan; ₱150k scale support reported for PRA 2024 awardees |

### 2023

| Youth winners? | **None published** |
|----------------|--------------------|
| Why | First modern cycle was **women category only** |
| Women examples (context only) | QC urban farming (Mayor Belmonte); DA AMIA (Alicia Ilaga); bamboo housing (Base Bahay); community forest/coastal (Nida Collado, Palawan); etc. |

---

## 3. Villgro PH Climate Action Showcase 2026 (participating enterprises)

**Event:** 18 June 2026, RCBC Plaza, Makati · ~10 climate enterprises · **not** YCLAP, but strong “what a Philippine climate pilot looks like” signal.

| Enterprise | Builders (public) | Place | Mechanism |
|------------|-------------------|-------|-----------|
| **O1nnovations** raincatchers | Augustus Nicko Bas (CEO), Anthony Adrian Cale (CTO) | Agusan Marsh / floating communities | Gravity rainwater systems; school sales subsidize free installs |
| **Anitu Forest Chocolates** | Marvi + Rogen Montecillo | Kibawe, Bukidnon | Regenerative cacao → tree-to-bar chocolate; NatureNest + Villgro |
| **IKRAM Mushroom Farm** | Sittie Aireen Caorong-Lomangcolob + IDP coop | Marawi | Sawdust waste → mushrooms → products; spent substrate as fertilizer |
| **Project Payatas** | JM Dioso (named in media) | Payatas / QC | Textile / waste circular models |
| **Bamboo Impact Lab, Kinabuhi, PAMMÉ, Resiklo** | founders often not public | various | Bamboo, circular, recycling-machine lane (partial list) |
| **Egongot sabutan weavers** (Dimasalang assoc.) | tribal farmers/weavers org | Aurora | Craft + forest restoration (media-linked) |

**Related (not same day):** Fair Futures Impact Showcase 30 June 2026 named a larger Climate Ascent cohort (O1nnovations, Project Payatas, Bamboo Impact Lab, Container Living PH, Magic Bag / RMP, etc.). Audience Choice: **Container Living PH** (Mac Evangelista) per secondary coverage.

Full official 10-name roster still **incomplete** in open web (agent G12 medium confidence).

---

## 4. Other PH youth / school climate programs (not YCLAP)

| Program | Who | Schools / orgs | When | What they ship |
|---------|-----|----------------|------|----------------|
| **First Gen YCELS / Create for the Climate** | Student teams + FG Hydro + OML Center mentors | Pantabangan NHS, Cadaclan Integrated School (Nueva Ecija); other host communities | 2025 1st summit; 2026 2nd | School/community **Climate Action Projects (CAPs)** + seed funding (2025 top teams ~₱30k cited) |
| **I ACT Philippines** | Y4E-SEA peer educators (Buensuceso, Salaysay, Tupas named) | Workshop at DLS-CSB; IRENA + Italy | Peer educators 2025; PH workshop May 2026 | Train-the-trainer climate/energy toolkit; 80+ youth trained; **not** a project pitch contest |
| **Klima Eskwela** | Climate Reality PH (+ CCC SME history) | multi-school awareness | multi-year | Literacy / sessions; TOR treats as *prior ad hoc* youth work, not the accelerator |
| **Gawad CCC / Climate Science Youth Program** | HS researchers + DepEd + NPTE | science high track | public evidence strongest 2018–2019 | Climate science research competition (not startup showcase) |
| **Mapúa Cardinal One** | Student eco-marathon team (e.g. Karis Evangeline Carlos named) | Mapúa University | 2024–2026 Shell Eco-marathon | Ultra-efficient prototype vehicles (ICE then battery-electric) — **energy efficiency race**, adjacent not CCC |
| **Young Leaders for Resilience (NRC)** | LGU university teams | Muntinlupa, XU, CSPC, ADZU, etc. | launched 2019 | Design-thinking climate/DRR pitches at Top Leaders Forum — **not** Ateneo SEEDS YCLAP |

---

## 5. SEA climate-tech winners (CIIC etc.) — for pattern only

These are **not** Youth CLAP peers (often startups / multi-country), but they show what large SEA stages reward:

| Project | Program year | Origin | Mechanism |
|---------|--------------|--------|-----------|
| Waste4Change | CIIC 2023 Ocean | Indonesia | Plastic recovery / circular ops |
| Qarbotech | CIIC 2023 | Malaysia | Photosynthesis-enhancement spray for smallholders |
| AC Biode | CIIC 2024 Circular | Japan / Lux climate-tech | Organic / plastic chemolysis / syngas path |
| SXD AI | CIIC 2025 Circular | Shelly Xu Design | Zero-material-waste garment co-design + hard % savings claims |
| Aslan Renewables | CIIC 2025 Energy | Canada deep-tech | Damless modular hydro |

**Student takeaway:** winner language is **mechanism + pilot path + numbers**, not “we care about the planet.”

---

## 6. What this means for your Sep 12 showcase

1. **You will not be scored against a secret YCLAP alumni list** (there isn’t one public).  
2. **CCC-adjacent youth winners look like:** barangay food loops, local IoT early warning, invasive plant packaging, storytelling series, NbS restoration, bike emergency response — **ops + place + people**.  
3. **Themes for PRA change yearly**; Youth CLAP has no published annual theme table. Align to **problem + pilot + proof**, not a slogan.  
4. **Many “winners” are multi-year practitioners or faculty/LGU leads**, not five-week student clubs. Your job is a **honest pilot slice**, not matching their years of ops.  
5. **School signal:** CTU Barili, MinSU, MSU-Marawi SHS, Silliman alum, Mapúa engineering, Pantabangan NHS — PH climate work is multi-school, multi-region. Ateneo is one node.

### Peer projects closest to Gargar’s lane

| Peer | Why similar |
|------|-------------|
| Reskyusi Food Basket | Diversion loop + community + waste→value |
| Green by Design | Waste stream → product, lake/place story |
| Project Payatas / Resiklo (Villgro) | Urban waste circular |
| Go Bike (PRA 2024) | Simple hardware + trained volunteers + emergency climate adaptation |

---

## 7. Agent index (G01–G30)

| ID | Target | Structured? |
|----|--------|-------------|
| G01–G05 | PRA 2025 five youth projects | yes |
| G06–G08 | PRA 2023/2024 + themes | yes |
| G09–G11 | YCLAP / Likha-Klima / Circle | yes (gaps honest) |
| G12–G16 | Villgro showcase enterprises | yes |
| G17–G21 | CIIC / SEA winners | yes |
| G22–G26 | CCC science / First Gen / I ACT / Klima Eskwela | yes |
| G27 | NYC climate awards | retry (see raw) |
| G28–G29 | Mapúa / Ateneo-adjacent resilience programs | yes |
| G30 | Cross-year theme synthesis | yes |

---

## 8. Corrections Claude made on agent claims

| Claim | Correction |
|-------|------------|
| CCC said Project MOSES = “Mindanao State University” | **Wrong.** MinSU primary sources + agent G04: **Mindoro State University** |
| “Past YCLAP winners” | Still **none public** after 30-agent search |
| Villgro “full list of 10” | **Partial** only; do not treat media names as complete roster |
| SEA CIIC winners as “schools” | Mostly **companies**, not universities |

---

## 9. Sources (starter set)

- https://climate.gov.ph/news/1047 (PRA 2025)  
- https://climate.gov.ph/news/961 (PRA 2024)  
- https://climate.gov.ph/news/819 (PRA 2023 women)  
- https://www.minsu.edu.ph/news/details/180 (Project MOSES / MinSU)  
- https://mindanews.com/business/2026/07/chocolates-rain-catchers-and-mushrooms-mindanao-innovations-featured-in-climate-action-showcase-in-makati/  
- CCC YCLAP TOR (procurement)  
- Agent raw JSON under `wave-grok-projects/raw/` for full URL lists  

---

## 10. Open questions still worth asking Jack / CCC

1. Will 2026 YCLAP publish a public showcase roster after Sep 12?  
2. Exact judging rubric and Sep 12 venue?  
3. Any sample decks from 2025 pilot teams (internal only)?  
4. Does this year have an official thematic prompt beyond “climate action project + Campaign Canvas”?  

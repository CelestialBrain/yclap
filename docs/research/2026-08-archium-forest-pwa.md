# Archīum harvest — what actually applies to the forest PWA

Queried 2026-08-27 on `bygelo` (`archium_paper` in sisia-api). Corpus: **13,686** papers (1953–2026), **13,686** embedded, **9,398** with extracted full text. FTS on `fts_doc` plus title/abstract filters. Full-text `Loyola Heights` is almost all mastheads (journal address lines), not campus ecology.

**There is no Archīum paper that is a Loyola Heights tree inventory.** The 1,809-tree figure stays an AIS citation (R14), not an Archīum one. Do not relabel it.

campus.sisia.app (`/var/www/sisia/campus/dist`) is a 3D campus + route-editor prototype. Keep it as a **path/geofence source**, not as this PWA’s visual system.

## Second pass (2026-08-27, word-boundary + author + thesis)

Tighter queries: `\m…\M` on species names (first pass matched `narra` inside *narrative*), author lists, Biology/ES title filters, every title containing `Loyola Heights`.

**Titles that actually say Loyola Heights:** two. The Lagundi thesis below, and a 2018 Pagsi interview (not ecology). That is the campus-ecology hole, restated.

### Apply (new)

| Paper | Why it belongs | How to use | How not to use |
|-------|----------------|------------|----------------|
| Ledesma (2022). *Identification of Vitex negundo L. (Lagundi) Accessions From … and From Ateneo De Manila University, Brgy. Loyola Heights… DNA Barcoding…* Thesis. https://archium.ateneo.edu/theses-dissertations/726 | **Only Archīum paper whose title names Loyola Heights and a plant.** 13 lagundi accessions, some from this campus. Chloroplast + nuclear markers | Species card: Lagundi, *Vitex negundo*, “barcoded from campus accessions (Ledesma 2022).” Not a canopy tree — a medicinal shrub that is actually documented here | Do not conflate with Molave (*Vitex parviflora*). Do not call this the 1,809-tree inventory |
| Fatallo (2022). *DNA Barcoding of Dillenia philippinensis (Katmon) and D. luzoniensis (Malakatmon) From … Pola, Oriental Mindoro and Quezon City…* Thesis. https://archium.ateneo.edu/theses-dissertations/723 | Abstract: samples from Pola **and the Ateneo campus**. Katmon is already on the curated list; now it has a campus collection cite | Katmon card caption: “Campus samples barcoded (Fatallo 2022), plus Mindoro sites — not an inventory” | Do not imply the thesis mapped every Katmon on campus |
| Rodrigo, Favis, Cuyegkeng et al. (2021). *For People and Planet: Teachers’ Evaluation of an Educational Mobile Game…* DISCS. https://archium.ateneo.edu/discs-faculty-pubs/256 | Ateneo already shipped *For People and Planet: An SDG Adventure* — Android narrative game + teacher pack, evaluated by 8 middle-school teachers | Journal UX: narrative / reflection, not a rank. Friday pakulo can point at this instead of Pokémon XP | Do not rebuild the Android game. Audience was middle school, not college. Evaluation is teachers, not students |
| Rodrigo, Favis, Cuyegkeng et al. (2021). *A RECIPE for Teaching the Sustainable Development Goals.* DISCS. https://archium.ateneo.edu/discs-faculty-pubs/235 | Same game’s design paper. Nicholson Meaningful Gamification: play, exposition, choice, information, engagement, **reflection** — no points pillar | Name the six elements on `/journal` helper or in the Friday lock: we took reflection, we refused a leaderboard | Do not add a sixth “points” element they did not use |

Cuyegkeng & Favis (2019) *Stakeholder Engagement…* also lives at https://archium.ateneo.edu/leadership-and-strategy-faculty-pubs/9 — same abstract as the JMGS copy already listed. One paper, two landing URLs. Cite once.

### Still missing after the second pass

No Narra, Molave, mahogany, swamp-forest, arboretum, or AIS tree-inventory paper. Biology faculty titles in this corpus are insects, frogs, mangroves — not campus trees. ES “forest” titles are mostly Honda Bay mangroves (out of scope). Thesis PDFs for Ledesma and Fatallo have **no `pdf_url`** in the mirror — landing pages only until someone downloads them.

## Apply (cite on-screen, do not rebuild)

| Paper | Why it belongs on a surface | How to use | How not to use |
|-------|-----------------------------|------------|----------------|
| Lagyo, Galicia, Guico (2025). *Design of a Mobile Navigation System for a University Pedestrian* (ADMUNAV). ECCE. https://archium.ateneo.edu/ecce-faculty-pubs/203 | Pedestrian graph of **this campus**; Dijkstra over walkable paths; offline; 100% routing accuracy in their test | `/map` walkable-path layer + restricted hatch = “not on ADMUNAV’s graph.” Ask the authors before copying their dataset | Do not fork ADMUNAV. Their job is wayfinding. Ours is noticing species |
| Cuyegkeng & Favis (2019). *Sustainability Practices in Higher Education: Stakeholder Engagement…* JMGS. https://archium.ateneo.edu/jmgs/vol7/iss2/7 | Named Ateneo case: GC35 → campus sustainability policy, admin buy-in, stakeholder engagement. Favis is AIS | `/plan` “who we still need to talk to” and the formation Change line. Quote the struggle, not a fake 20-consult | Do not claim this paper evaluated our website |
| Delocado, Tuaño, Lacdao-Umali (2025). *Schools in Synergy for Sustainability*. Dev Studies. https://archium.ateneo.edu/dev-stud-faculty-pubs/281 | Ateneo in AUN ecological-education networks — Aleij’s “other campuses” ask has a real network, not a slogan | `/plan` “How another campus copies this” — name AUN-EEC as a possible carrier | Do not ship a multi-tenant product |
| Villanueva et al. (2023). *Resilience and Green Spaces: Association with Stress…* Health Sciences. https://archium.ateneo.edu/hs-faculty-pubs/35 | Green space × stress, PH workers, satellite UGS mapping | Home/journal caption: noticing green is a health claim with a local paper — still not a leaderboard | Contact-centre sample is not Ateneo students. Do not say “this app reduces stress” |
| Llorin, Olaguera, Cruz, **Villarin** (2024). *Improved WRF… UHI over Metro Manila*. Physics. https://archium.ateneo.edu/physics-faculty-pubs/170 | Updated LULC + urban canopy model changes simulated surface temperature / UHI | `/map` “Canopy vs built” layer caption. Villarin is the Manila Observatory / CAP name the group already wants to pitch | Do not draw WRF output as if it were a tree species map |
| Llorin et al. (2024). *Quantifying… Updated LULC… Metro Manila*. MO. https://archium.ateneo.edu/manila-observatory/16 | NAMRIA 2015 LULC vs default USGS/MODIS; 28 AWS across MM | Same layer, source line “LULC, not our survey” | Do not pretend NAMRIA classified the arboretum |
| Bilang, Blanco, Santos, Olaguera (2022). *Simulation of UHI… WRF Urban Canopy… Metro Manila*. Physics. https://archium.ateneo.edu/physics-faculty-pubs/133 | Already in R14. High-heat event 22–29 Apr 2018 | Heat sentence on native-shade cards (Narra) | Do not invent a campus °C delta this paper does not report |
| Aliño, Fernandez, Diesmos (2023). *Classifying Invasive Alien Species in the Philippines Using CNNs*. Physics. https://archium.ateneo.edu/physics-faculty-pubs/162 | Ateneo already published IAS image classifiers (24 species, ResNet/MobileNet/GoogLeNet) | Camera sheet helper: “this app does not identify. Ateneo work on IAS-ID exists; use Seek.” | Do not rebuild their CNN. Their classes are not campus trees (frogs, etc.) |
| Navarrete, Peque, Macabuhay (2018). *Soil Information as a Reforestation Decision-Making Tool…* ES. https://archium.ateneo.edu/es-faculty-pubs/88 | PH reforestation fails when soil + native vs exotic are ignored | Mahogany/exotic card + `/plan` “we are not a planting drive.” Matches the existing planting-as-flagship rejection | Do not turn this into a nursery plan |
| Navarrete et al. (2017). *Heavy metal concentrations in soils and vegetation in urban areas of Quezon City*. ES. https://archium.ateneo.edu/es-faculty-pubs/52 | QC soils/plants; protected forest vs landfill/industrial/commercial | Background only. Land-use contrast is real | Do not put Pb numbers on a student field-guide without campus-specific samples |
| Saloma-Akpedonu & Akpedonu (2022). *Parks, Plans, and Human Needs… Accidental Public Green Spaces*. SA. https://archium.ateneo.edu/sa-faculty-pubs/91 | Metro Manila green as remnants of unfulfilled plans (Burnham / Frost-Arellano). UP Oval, not Ateneo | Formation copy: green space is used, not just zoned | Do not claim the Ateneo forest is “accidental public space” |
| MO cloud camera (2018). *Ground-Based Detection of Nighttime Clouds Above Manila Observatory **(14.64°N, 121.07°E)*** https://archium.ateneo.edu/manila-observatory/5 | Campus coordinates match the Demo-campus pin (14.6386, 121.0785) | Caption on the kiosk toggle: pin is the Observatory, not a guess | — |

## Analog only — label it

Ortiz, Gayó, Henríquez, Pauchard (2024). *Exploring the Multifunctional Landscapes Model in Areas Dominated by Non-Native Tree Plantations*. MO affiliate. https://archium.ateneo.edu/manila-observatory/11

Chile: pines and eucalypts, Mapuche conflict, mega-wildfires. **Not Loyola Heights mahogany.** The mechanism (non-native plantations homogenize, natives fail underneath, “multifunction” gets sold after the damage) is the group’s problem tree. On a species card or `/plan`, write **“analog: Chilean plantation landscapes (Ortiz et al. 2024, MO), not an Ateneo survey.”**

## Do not apply

- Masthead “Loyola Heights, Quezon City 1108” hits (hundreds).
- Random-forest / mahogany-as-literary-title FTS noise.
- Mangrove blue-carbon papers (already rejected as a pitch).
- Rebuilding ADMUNAV, the IAS CNN, or WRF.
- Calling any of this “our baseline assessment.”

## What this harvest does not contain

A geo-tagged species list. A SOM-forest ecology paper. An arboretum checklist. Those still live with AIS / TAW / Ateneo Wild, which is why `/plan` stays “not yet.”

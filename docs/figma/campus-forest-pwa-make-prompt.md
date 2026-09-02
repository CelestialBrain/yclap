# Figma Make prompt — Ateneo CCC forest PWA

Paste the block under **PROMPT** into Figma Make (or Claude in Figma). Generate **both** device frames: iPhone 14/15 (390×844) and Desktop (1440×900). Connect them as one prototype.

Working title is a placeholder. Do not invent a coined brand. Friday 28 Aug 21:00 the ten-person Ateneo CCC team can rename it.

This is the **student-led campus website** locked on 26 Aug 2026 as their Youth CLAP innovation output. It is **not** the Youth CLAP program landing (sessions, lanes, Gargar rack). It is **not** a planting campaign. It is **not** Pokémon GO with points.

---

## PROMPT

```
Design a high-fidelity PWA for a student climate team at Ateneo de Manila University, Loyola Heights. Two devices, one product:

1) Mobile 390×844 — a walk-the-campus field guide.
2) Desktop 1440×900 — a kiosk / projector view for the Youth CLAP Innovation Showcase (the hall is NOT on campus, so the desktop must work without live GPS).

PRODUCT JOB
A student (or a judge looking at a projector) can learn what they are walking under, keep a private list of species they have actually seen, and read an honest plan for who this team still needs to talk to. The Change this site can claim: form students to notice and commit to campus biodiversity. The Change this site cannot claim: increase the number of native trees on campus.

WORKING TITLE
“Field Guide” as the wordmark. Subtitle: “Ateneo Loyola Heights”. Small program chrome, never the hero: Youth CLAP 2026 · Ateneo CCC.

KEEP FROM THE EXISTING YOUTH CLAP / GROK SYSTEM (do not restyle these)
- Four-person mark: four abstract people meeting at a center, cardinal arrangement, strokes in blue / green / orange / red. Use it at 32px in the header only.
- Color tokens, named and used exactly:
  blue #058CD6
  blue-deep #075D89
  green #45C223
  green-vivid #00E800
  green-deep #008653
  orange #F6B22D
  red #FF3920
  ink #1F2022
  paper #F9F9F9
  grid #E4E7E8
  focus #073E5F
- Gradients only as thin accents, never as page washes:
  forest: 115deg #55D334 → #008653
  lagoon: 115deg #058CD6 → #45C223
- Type: Montserrat. Display 800 for the wordmark and one hero line. Body 400. Labels 700. No second display face. No Inter, no Geist, no Playfair, no cream-serif, no near-black acid-green startup look, no newspaper broadsheet.
- Radius: 24px cards, 20px tiles, 999px pills.
- Card shadow: 0 12px 28px rgba(31,32,34,0.12).

SIGNATURE (the one memorable mechanic — spend the boldness here)
Pokémon GO’s *spatial* loop, not its *economy*.

On the map, the student is a small ink-and-green position mark on a satellite-style campus. Nearby walkable trees appear as encounter discs (32px, green-deep fill, white 2px ring). Walking close (or, on desktop, clicking) slides up a sheet: species common name, scientific name in italic, a native / exotic / threatened pill, one sentence on why it matters for heat or resilience, and a single action “Log this sighting”.

Logging is catching. There is no XP, no CP, no stardust, no gym, no raid, no leaderboard, no points integer, no “#1 on campus”, no prize, no sponsored challenge. The reward is the journal filling in.

Restricted forest (SOM / swamp patches and any fenced grove) is a diagonal hatch in ink at 12% opacity with the label “Observed from the path — this grove is off-limits.” No encounter discs spawn inside the hatch. This is a real constraint: a lot of Ateneo forest is closed to students.

Desktop has a header toggle “Demo campus” ON by default, pinned to Loyola Heights 14.6386, 121.0785, so a projector in another city still shows encounters. When Demo campus is on, do not show a browser-geolocation permission modal.

WHAT TO GENERATE — 8 FRAMES

A. Mobile · Home
B. Mobile · Map (walk mode, one encounter sheet half-open)
C. Mobile · Map · Restricted overlay visible, no discs in the hatch
D. Mobile · Camera sheet (log a sighting)
E. Mobile · Field journal
F. Mobile · Plan
G. Desktop kiosk · Map + species inspector, Demo campus ON
H. Desktop kiosk · Home (showcase mode)

NAV
Mobile: bottom bar, 4 items, icons + labels, ink on paper, active item green-deep.
  Home · Map · Journal · Plan
Desktop: top bar. Left: four-person mark + “Field Guide”. Center: the 4 items as text tabs. Right: “Demo campus” pill toggle + “EN”. No hamburger. No locale duplicate.

A · MOBILE HOME
Paper background. No full-bleed nature photograph. No v4 scene wash.

Top: 12px padding. Four-person mark 28px + “Field Guide” in Montserrat 800 20px ink. Subtitle 12px green-deep “Ateneo Loyola Heights”.

Hero is a thesis, not a slogan:
“Two-thirds of this campus is green. Most of us cannot name what we are walking under.”
Montserrat 800, 28px, ink, max 3 lines. Not centered. Left-aligned. Measure 20px from the left.

One supporting sentence, Karla-like but still Montserrat 400 15px, ink at 80%:
“A student-led field guide for Ateneo’s urban forest — so noticing becomes a habit, not a poster.”

Stats strip: three tiles in a row, 20px radius, paper with 1.5px grid border.
  1,809 · trees geo-tagged on campus
  101 · threatened Philippine trees in the arboretum
  ~⅔ · of 89 ha still green
Each tile has an 11px caption under the number: “AIS · SY 2025–2026” / “AIS arboretum” / “AIS, Loyola Heights”. Never label these “our survey”.

Primary button, full width, 48px tall, 12px radius, green-deep fill, white 700 15px: “Walk the campus”.
Secondary text button, no fill: “Read the plan”.

A short “What this is not” line, 12px, ink 60%:
“Not a planting drive. Not a leaderboard. Not our tree inventory — AIS already counted.”

B · MOBILE MAP (THE POKÉMON-GO SCREEN)
The map is edge-to-edge under a transparent 56px top scrim (paper at 88%). Bottom nav sits on top of the map.

Map look: muted satellite, Loyola Heights. Buildings slightly desaturated. Canopy reads greener than roofs. Do not draw cartoon grass.

Player mark: 16px green-vivid disc, 3px white ring, 8px ink shadow. No trainer avatar, no backpack, no Pokémon.

Encounter discs: 5–8 on walkable paths and quads only (Gonzaga, CTC, Rizal Library lawn, Bellarmine field edge, Katipunan-facing gate yards). Not inside hatched forest.

Bottom sheet, 42% of screen, 24px top radius, paper, grabber. Content for the selected disc:

Eyebrow 11px 700 green-deep: NEARBY
Common name 22px 800 ink: Narra
Scientific 13px 400 italic: Pterocarpus indicus
Pills in a row: Native · National tree · Shade
One sentence 14px: “A long-lived native. Urban-canopy models for Metro Manila show land cover changes the heat you feel — this is shade, not a slogan.”
Caption 11px ink 50%: “Heat context: Bilang et al. 2022 / Llorin, Villarin et al. 2024 (Archīum Physics + Manila Observatory). Not a campus thermometer.”
Primary button 48px green-deep: “Log this sighting”
Ghost button: “Not this tree”

Floating layer chip, top-right under the scrim, pill, paper, 1.5px grid border: “Canopy vs built · off”. Tapping would toggle a choropleth; show the off state in this frame.

Do not put a search bar. Do not put Google-style zoom chrome beyond a small +/−.

C · MOBILE MAP · RESTRICTED
Same as B but camera is looking at a hatched grove (SOM / swamp forest edge). No encounter discs in the hatch. A static caption in a paper chip:
“Observed from the path — this grove is off-limits to students.”
The nearby sheet lists the closest *walkable* species, not one inside the hatch.

D · MOBILE CAMERA SHEET
Full-height sheet over a dimmed map.

Top: “Log a sighting” 18px 800. Close X.

Camera well: 4:3 rounded 20px, showing a live-camera placeholder (leaf and trunk, not a stock rainforest). Over the well, a simple square reticle, ink 40%, 2px. This is a memory photo, not an AR creature.

Species picker: a list of 8 curated names, not a free-text AI guess. Highlight Narra. Each row: common, scientific italic, native/exotic pill.

Helper 12px: “This app does not identify the tree for you. Ateneo already published an invasive-species image classifier (Aliño, Fernandez, Diesmos 2023) — we are not rebuilding it. For a second opinion, open Seek.”
Text link, blue #058CD6, underlined: “Open Seek”

Primary: “Save to my journal”. No points toast. Success is a 2-second paper chip: “Narra added to your journal.”

E · MOBILE FIELD JOURNAL
Title “Your journal”. Subtitle “Stays on this phone.”

A pokedex-like grid, 2 columns, 20px tiles. Each tile is a species card:
- Seen: full-color botanical illustration (flat, ink outline, green/sack-blue/mustard fills — not photoreal, not clipart).
- Unseen: silhouette, ink 15% fill, no name spoiler — label “Not yet”.

Seen in this mock (5): Narra, Molave, Katmon, Mahogany, Lagundi.
Unseen silhouettes (7): empty slots. Total visible 12, caption “12 of a starter list — not the 1,809.”
Katmon tile caption 11px: “Campus samples barcoded — Fatallo 2022. Also Mindoro. Not an inventory.”
Lagundi tile: native pill + “shrub” + “Ledesma 2022 · Loyola Heights accessions.”

Mahogany tile has an orange pill “Exotic” and a 12px note: “Fast shade. Natives often fail underneath plantation canopies — analog Ortiz et al. 2024 (Chile pines/eucalypts, Manila Observatory), not an Ateneo mahogany survey. PH reforestation already fails when soil and native vs exotic are ignored (Navarrete et al. 2018).”

Subtitle under the journal title, 12px: “Reflection, not a race. Ateneo already designed an SDG game that way (Rodrigo, Favis, Cuyegkeng 2021 — RECIPE / Meaningful Gamification).”

No rank, no streak flame, no weekly challenge banner, no share-to-IG.

Empty state (do not use this as the default frame, but include it as a component): a single leaf mark and “Walk a path. Log what you see.”

F · MOBILE PLAN
Title “What happens after the walk”.

Three blocks, not a 20-page strategy.

1. What this website is for (2 sentences). Formation + a public map students can actually use.
2. Who we still need to talk to — a list of unanswered rows, each with a status pill “not yet”:
   - Ateneo Institute of Sustainability (AIS) — tree inventory access. Cuyegkeng & Favis 2019 already described how this campus struggles to get admin buy-in for sustainability programs.
   - Manila Observatory (Villarin is a coauthor on the Metro Manila UHI/LULC papers)
   - CFMO / TAW — grounds
   - Student orgs already walking (Ateneo Wild / AGILA)
   - ADMUNAV authors (Lagyo, Galicia, Guico 2025) — walkable-path graph, if they will share it
   Never write “we consulted 20 representatives”.
3. How another campus copies this (4 bullets): a walkable-path map, a curated species list from whoever already counted, a personal journal with no rank, a geofence for off-limits ground. One line: Ateneo sits in AUN ecological-education networks (Delocado, Tuaño, Lacdao-Umali 2025) — that is a carrier, not a second app.

Footer 11px: “Youth CLAP 2026 · student prototype · not an official AIS product.”

G · DESKTOP KIOSK 1440×900
Showcase / projector. Demo campus toggle ON, green-deep fill, white label.

Layout: 64px top bar (mark + Field Guide + tabs + Demo campus + EN).
Body split 62% / 38%.
Left: the same map as mobile, larger, with 8 encounter discs and one hatch. Player mark near Gonzaga.
Right inspector (paper, 24px left-radius none, padding 32px):
  NEARBY
  Narra / Pterocarpus indicus
  Native · National tree · Shade
  The heat sentence from frame B.
  Two stats with sources: “1,809 campus trees · AIS SY 2025–2026” and “101 arboretum · AIS”.
  Button “Log this sighting” (on a kiosk this can be a demo that fills a fake journal count).
  Journal count: “4 species logged on this device”.
  A quiet line: “No public leaderboard. Formation, not a race.”

Do not add a live feed of other users. Do not add chat.

H · DESKTOP HOME
Same top bar. Content is the mobile home thesis at a wider measure (max 640px, left, not centered in the void). Stats strip of three tiles. A 16:9 map preview card on the right that looks tappable and says “Open walk”. Paper background. The four-person mark does not become a giant hero illustration.

CURATED SPECIES (use these; do not invent a 1,809-row table)
Narra — Pterocarpus indicus — Native — national tree, long-lived shade.
Molave — Vitex parviflora — Native — hard timber, threatened.
Katmon — Dillenia philippinensis — Native — endemic. Caption: campus samples barcoded (Fatallo 2022 thesis) plus Mindoro sites — not an inventory.
Dao — Dracontomelon dao — Native.
Mahogany — Swietenia macrophylla — Exotic — the problem species in the tree map; natives struggle under it.
Rain tree — Samanea saman — Exotic — wide shade, common on quads.
Teak — Tectona grandis — Exotic.
Balete — Ficus sp. — Native / strangler fig, landmark trees.
Lagundi — Vitex negundo — Native medicinal shrub — the only Archīum paper whose title names Loyola Heights and a plant (Ledesma 2022). Not a canopy tree. Do not label it Molave (that is Vitex parviflora, unsurveyed here).

Copy for mahogany must stay honest. Do not call it evil. Do not call a photo of it a “catch”.

COPY RULES
- Filipino-English campus voice. Short. No “unlock your eco-journey”. No “reimagine sustainability”. No “empowering communities at scale”.
- Every number on screen has a source and a year.
- Inventory numbers (1,809 / 101 / ~⅔) are AIS, never Archīum. Archīum has no Loyola Heights tree census.
- Demo campus pin 14.6386, 121.0785 matches Manila Observatory’s published campus coordinates (14.64°N, 121.07°E).
- Canopy-vs-built layer caption: “LULC / urban canopy — Llorin et al. 2024, not our survey.”
- Taglish is fine in one helper line, not in the hero.
- Buttons say the action: “Log this sighting”, “Walk the campus”, “Save to my journal”.
- Cite authors on the surface that uses them. Do not dump a bibliography on Home.

PROTOTYPE LINKS
Home Walk the campus → Map.
Map disc tap → sheet. Log this sighting → Camera sheet → Journal (Narra now seen).
Map hatch → Restricted frame.
Plan tab → Plan.
Desktop Demo campus stays on across G and H.
Bottom/top nav on every frame.

DO NOT GENERATE
- A leaderboard, podium, XP bar, coin, streak, prize, sponsored AIS cybersecurity-challenge banner.
- An in-app “AI identified this as…” badge.
- A planting-drive CTA (“plant 1,000 narra”).
- Live other-player avatars.
- Google Maps UI chrome, hamburger + locale duplicate, Lucide-only icon soup as the brand.
- Photoreal still-life heroes, bone-white / acid-lime, industrial beige.
- The Youth CLAP session timeline, Gargar scrap calculator, or EcoWaste intel boards — those stay on the existing program site.
- Lorem ipsum. Fake “12,403 students joined this week”. Fake 20-stakeholder consult complete.

VISUAL RISK (take it)
Encounter discs and the sliding nearby sheet should feel as immediate as Pokémon GO’s spawn. Everything else should feel like a Jesuit campus field notebook: paper, ink, Montserrat, sourced numbers, off-limits hatch. The clash is the point. Do not resolve it by making the trees into cartoon creatures, and do not resolve it by making the map into a static GIS portal.
```

---

## How to run it

1. Figma Make → paste the **PROMPT** block only.
2. Ask for a prototype, not a single screen.
3. After it generates, kill any leaderboard, AI-ID, or planting CTA it hallucinates — those are rejected in `docs/roadmap-rejected.md`.
4. Bring the file to Friday 21:00 as the proposed technical lock, not as a finished product.

## What this prompt is protecting

| Kept from Grok `web/` | Redone | Left for Friday |
|----------------------|--------|-----------------|
| Tokens, mark, Montserrat, 24px cards | Home is a forest thesis, not the cohort landing | Product name |
| R14 / AIS figures, labelled | Map is a walk, not a pin directory | Who builds (Jello / Angelo) |
| Program chrome for YCLAP display | Journal instead of a leaderboard | Whether `web/` and this PWA share a URL |
| maphy sat-view instinct (Loyola at 14.6386, 121.0785) | Demo campus so the showcase hall works | AIS geo file vs dummy pins |

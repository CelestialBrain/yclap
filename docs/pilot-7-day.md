# 7-day Gargar pilot patch list

**Window:** next 7 days before / into LEARN  
**Repo:** `~/Codex/gargar`  
**Evidence:** `~/Antigravity/ecowaste`

---

## Already shipped (foundation + pilot freeze 2026-08-07)

- [x] EcoWaste-aligned **material rates** (`src/data/material_rate.js`) — research freeze + ranges  
- [x] **Pasig collector directory** (`src/data/collector.js`) — showcase trio first; `is_verified` honest  
- [x] **Diversion log** + demo seeds + export JSON (`src/lib/diversion_log.js`)  
- [x] Calculator + multi-collector modal + Log diversion CTA  
- [x] Pilot progress /100 kg + non-claim copy in hero  
- [x] Campaign Canvas v0.2 + **3-min pitch** (`docs/pitch-3min.md`)  

---

## Day 1 — Demo-ready polish

- [x] Demo seeds so summary is not empty on first show  
- [ ] Run `npm run dev` in gargar; walk full path: rate → kg → collector → log  
- [ ] Run YCLAP landing `web/` and screenshot for phone gallery  
- [ ] Fix any mobile overflow on pilot section  

## Day 2 — Rate integrity (YOU · field)

- [ ] Spot-check 2 Pasig shops in person or by phone (hours, actual buy price for PET/Al)  
- [ ] Update `material_rate.js` if field differs; set `rate_status: "field_verified"`  
- [ ] Label UI: “Reference · verified YYYY-MM-DD” when confirmed  

## Day 3 — Collector reality (YOU · field)

- [ ] Mark `is_verified` only for shops contacted (Pineda MRF + ACF + Ghie first)  
- [ ] Add phone field when obtained (never invent)  
- [x] Prefer Pineda MRF + 2 junkshops as showcase trio (in code)  

## Day 4 — Impact math (Alfonso)

- [ ] Simple sheet: kg PET / Al / carton → rough avoided residual narrative  
- [ ] Optional: link waste methane one-pager from Clariz  
- [ ] One chart PNG for pitch  

## Day 5 — Recruit (Sophia + Nathanielle)

- [ ] 10 soft commits from orgs (AIS, AESS, BOx, MEA, dorm, class)  
- [ ] Schedule one drop-off / handoff window  
- [ ] Script: 30-second “why Gargar” for ambassadors (mission line in pitch doc)  

## Day 6 — Evidence kit (Ivan + Mark)

- [ ] Photo protocol (rates screen, weigh-in, collector facade with permission)  
- [x] Draft 3-min script (`docs/pitch-3min.md`)  
- [x] Export diversion log story (Export log JSON button)  

## Day 7 — Freeze for Aug 15

- [ ] No new features after 6pm — only bugfixes  
- [ ] Demo checklist: landing → Gargar → EcoWaste evidence slide  
- [ ] Backup: offline build (`npm run build` + `preview`)  

---

## Explicit non-goals this week

- Full booking backend / SMS  
- Carbon credit minting  
- National multi-city expansion  
- Perfect EcoWaste dashboard redesign  

---

## Commands

```bash
# Gargar
cd ~/Codex/gargar && npm run dev

# YCLAP landing
cd ~/Grok/yclap/web && npm run dev
```

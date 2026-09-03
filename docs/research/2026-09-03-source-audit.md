# Source audit — 2026-09-03

Every source the Field Guide cites, checked. Live endpoints were probed; document
citations were traced back to the primary. Run date 2026-09-03.

**Headline: one contradiction is currently shipping, one basemap is dead, one
attribution string is out of date, and our single most prominent number rests on
the weakest citation we have.**

---

## 1. The contradiction — fix before Saturday

Two claims about AIS are on screen in the same flow, and they cannot both be true.

| Where | What it says |
|---|---|
| Home stat strip (`app.tsx:181`) | **1,809 · trees geo-tagged · AIS · SY 2025–2026** |
| `AIS_GAP_NOTE` (`data.ts:288`, shown on `/map` and the desktop panel) | "AIS keeps a species database… **what it is missing is the count and the location of each tree**" |

If AIS geo-tagged 1,809 trees, they have the count and the location. If they lack
count and location, they did not geo-tag 1,809 trees.

Both claims trace to real places in our own notes:

- **1,809 geo-tagged** — `R14-katipunan-ateneo-heat.md:31`, sourced to *"AIS
  Instagram / public highlight — campus communications"* (R14 source 13, **no
  URL**).
- **Missing count and location** — Cathy at the 08-29 Ateneo pitch, `2:12:12`,
  a direct quote from someone who would know.

Our own docs already flagged this twice as a "reverse flag"
(`2026-08-26-lingguhang-pulong.md:96`, `2026-08-29-ateneo-biodiversity-platform.md:102`)
and it was never resolved — it just got built into the product.

**This matters beyond tidiness:** the "AIS is missing count and location" line is
the load-bearing claim in the Output 3 M&E section and in the pitch deck's ask.
If AIS already has a point file, the project's contribution needs re-stating.

**Resolution: Clariz's AIS conversation.** Until then the app must stop asserting
both. Fixed below by stating what each source says and marking it unreconciled.

## 2. The weakest citation is our most prominent number

**1,809** is the largest number on the home screen, and its provenance is an AIS
Instagram / campus-communications highlight with no retrievable link in our own
research file. R14 rates the cluster Medium–High and describes it as "AIS
operational count for one SY".

That is probably true and probably fine. But if a judge asks "where is that
from?", the honest answer today is "an AIS social post we did not archive."
**Ask Clariz for the citable source alongside the inventory.**

The `101` arboretum figure is better: independently corroborated by the GUIDON
(2023-11-27), which resolves.

## 3. Live endpoints — probed 2026-09-03

| Source | Used for | Status |
|---|---|---|
| `tile.openstreetmap.org` | Guide basemap | **200 OK** |
| `server.arcgisonline.com` World_Imagery | Satellite layer **and** the vegetation measurement | **200 OK** |
| `server.arcgisonline.com` World_Topo_Map | Paper basemap | **200 OK** |
| `api.inaturalist.org/v1` | Nearby-observation strip | **200 OK** |
| `overpass-api.de` | Rebuilding sectors | **200 OK** |
| `a/b/c.tile-cyclosm.openstreetmap.fr` | **Trail basemap** | ❌ **502 / 500 / timeout on all three subdomains, twice each** |

**CyclOSM is down.** Cycling to the Trail layer on stage gives a grey map. The
repo's own basemap docstring says every layer "was probed without a key before it
was allowed in here" — that was true when written and is not true now. Removed
from the rotation below; restoring it is a two-line revert once it recovers.

## 4. Attribution string is out of date

Esri's own service metadata now returns:

> `Source: Esri, Vantor, Earthstar Geographics, and the GIS User Community`

We render **"Imagery © Esri, Maxar, Earthstar Geographics"**. Maxar Intelligence
became Vantor, and Esri updated the credit; we did not. Attribution is a licence
term, so this is worth being exact about. Corrected below.

## 5. Document citations — all resolve

| Citation | Used on | Status |
|---|---|---|
| Ledesma 2022, `theses-dissertations/726` | Lagundi card | **200 OK** |
| Fatallo 2022, `theses-dissertations/723` | Katmon card | **200 OK** |
| Rodrigo / Favis / Cuyegkeng 2021, `discs-faculty-pubs/235` | Journal RECIPE helper | **200 OK** |
| GUIDON 2023-11-27 | 101 arboretum, ~½ of 90 ha | **200 OK** |
| `ateneo.edu/ais/programs/biodiversity` | ⅔ of 89 ha green | **403 to automated checks** — bot-blocked, not necessarily dead. Verify by hand in a browser |

Standing rule from `2026-08-archium-forest-pwa.md:5` still holds and is still
obeyed in code: **there is no Archīum paper that is a Loyola Heights tree
inventory.** 1,809 is an AIS citation, never an Archīum one.

## 6. iNaturalist

- API reachable, no key needed for the nearby-observation strip.
- The computer-vision *identify* step needs `VITE_INAT_API_TOKEN`, a JWT that
  **expires in ~24 h** and is inlined into the bundle at build time. Throwaway
  account only. Without it the sheet replays a recorded response and says so —
  it degrades honestly, which also means **nobody notices it has gone stale**.
  Refresh it the morning of the 12th.
- We never claim to run a model. Identification is attributed to iNaturalist, or
  to the student.

## 7. Sources that are ours, and say so

Not third-party, but worth listing because they are the ones most likely to be
mistaken for authority:

| Thing | Honest status |
|---|---|
| Sector boundaries | OSM ways (ODbL). Not surveyed, not cadastral |
| Vegetation % | Measured from Esri imagery by us. Method and sample count on screen |
| **50 of 94 sector names** | **Ours**, where OSM has none. Flagged `is_named_by_us` |
| Restricted-grove polygon | **Ours**, approximate, labelled "placeholder extent, not surveyed" |
| Species positions | Demo-map positions from the 09-03 seed. Not tree locations |

---

## Actions

| # | Action | Owner |
|---|---|---|
| 1 | Ask AIS whether they hold count + location, and get a citable source for 1,809 | **Clariz** |
| 2 | Stop the app asserting both AIS claims — done 2026-09-03 | done |
| 3 | Drop CyclOSM from the layer rotation while it is down — done 2026-09-03 | done |
| 4 | Correct Esri attribution to Vantor — done 2026-09-03 | done |
| 5 | Refresh `VITE_INAT_API_TOKEN` on the morning of 09-12 | whoever builds |
| 6 | Open `ateneo.edu/ais/programs/biodiversity` by hand to confirm ⅔ of 89 ha | anyone |

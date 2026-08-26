# Scope proposal — campus waste last-mile (for Wed Aug 26 scope meeting)

**Author:** Gelo · **Status:** proposal for group decision — nobody has agreed to anything yet
**Source:** my Aug 25 reasoning note (`docs/plaud/2026-08-25-campus-waste-last-mile.md`); Ivan's scope push and Catherine's usability test are retold here second-hand — correct me if I misheard you.

## The problem we'd take on

Two failures, same root:

1. **Last-mile breakdown** (`3:43`) — orgs like MEA segregate diligently at events, then everything likely gets recombined downstream. Segregation isn't the bottleneck; distribution is.
2. **Event influx blindness** (`6:39`) — ~3 trash cans for ~2,000 people at covered-court events; organizers plan reactively because they have no way to estimate volume.

Both pass Catherine's test: schools, orgs, and admin can keep using the fix after YCLAP ends.

## What we'd build (three slices, pick any)

| # | Slice | What it does | Effort | Reuses |
|---|-------|--------------|--------|--------|
| 1 | **Colored-bag kit** | Hangable bags on poles/signs for food stalls + covered courts; restock via partners | M | Gargar brand assets (31 inventoried in `docs/spec/som-fork-spec.md`); `bin_ux` slice already specced |
| 2 | **Waste calculator** | Organizer inputs attendance + sponsor mix → estimated kg/bags/bins needed | M | `stat_sizing` logic; EcoWaste rates data |
| 3 | **Partner map** | Which stream (PET, paper, food, packaging…) goes to which downstream taker | S–M | R45 junkshop + R10 circular-startup research; EcoWaste intel contacts |

Plus one study that makes all three credible: **where does our segregated waste actually go, and what % survives?** (`3:43`). AIS already runs waste audits with CFMO — we coordinate, we don't duplicate (R48).

## Why this beats staying on species scarcity

The forest stays our *evidence*: botany class quadrant sampling found the litter (`som-forest-restoration` `2:54`) — dead understory and species loss are partly a trash problem at the forest edge. Narrow framing = only botany classes use it; this framing = anyone who eats on campus. Guardrails-clean: hardware + logistics + planning intelligence, not another recycling app (`docs/cohort/idea-guardrails.md`).

## Honest limits

- Concert-scale open fields may be a mentality problem kits can't fix (`10:03`) — we target bounded venues first.
- No partner, no system: slices 1 and 3 live or die on downstream commitments.
- Calculator accuracy needs real audit data we don't have yet.

## Decisions we need from the group

1. Drop / shrink / keep the SOM-forest species-scarcity framing?
2. Which slices do we commit (all three is too much for one week)?
3. Who talks to AIS/CFMO about the flow audit, and who hunts partners?

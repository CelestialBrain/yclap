# Discounting worksheet — present value of the Gargar collection story

**Version:** 0.1 · 2026-08-25 · Lane G deliverable  
**Brief:** `docs/plaud/2026-08-22-project-development.md` · feeds `docs/campaign-canvas.md` §13.3 (cost of action vs cost of inaction)  
**Rate used in the worked example:** exactly **r = 5%** per the solo redo ask (`2:47:34`, Dr. Marian Angeles)

---

## 1. Why future benefits shrink

A peso of scrap value collected three years from now is worth less than a peso collected today, because a peso in hand can be put to work now — saved, invested, or spent on the next collection drive — while a promised future peso carries risk and waiting. Discounting converts each future value into its **present value (PV)** by dividing by a growth factor for every year it waits, so that early and late values can be added and compared honestly. Dr. Marian Angeles taught exactly this in the valuation talk and asked every participant to estimate the benefits of their own project (`2:16:50`) and then redo the discounting exercise solo at a 5% rate and compare (`2:47:34`) — see `docs/plaud/2026-08-22-project-development.md`.

## 2. The formula pair — shown once each

**Present value of one future value:**

```
PV = FV / (1 + r)^t
```

**Net present value over the whole project:**

```
NPV = Σ PV(benefit) − Σ PV(cost)
```

where `FV` is the future value, `r` the discount rate per year, and `t` the year count from today (t = 0 means money already spent or received).

## 3. Worked example — Gargar node at r = 5%

**Scenario:** one Gargar collection node over 3 years. Scrap-sale value grows as more households join; setup cost lands today, and one re-verification cost hits in year 2.

| Year | Item | Cash flow |
|------|------|-----------|
| t = 0 | Cost — bins, signage, launch drive | −₱15,000 |
| t = 1 | Benefit — scrap sale value | ₱10,000 |
| t = 2 | Benefit — scrap sale value (+20% user base) | ₱12,000 |
| t = 2 | Cost — re-print rate card, field re-check | −₱2,000 |
| t = 3 | Benefit — scrap sale value (+20% again) | ₱14,400 |

**Discount factor per year at r = 5%** (compute once, reuse):

- Year 1: (1.05)¹ = **1.05**
- Year 2: (1.05)² = 1.05 × 1.05 = **1.1025**
- Year 3: (1.05)³ = 1.1025 × 1.05 = **1.157625**

**Step-by-step PV arithmetic:**

| Step | Computation | Result |
|------|-------------|--------|
| PV of year-1 benefit | ₱10,000 ÷ 1.05 | ₱9,523.81 |
| PV of year-2 benefit | ₱12,000 ÷ 1.1025 | ₱10,884.35 |
| PV of year-3 benefit | ₱14,400 ÷ 1.157625 | ₱12,439.26 |
| **Σ PV(benefit)** | 9,523.81 + 10,884.35 + 12,439.26 | **₱32,847.42** |
| PV of t=0 cost | no waiting, no shrinkage | ₱15,000.00 |
| PV of year-2 cost | ₱2,000 ÷ 1.1025 | ₱1,814.06 |
| **Σ PV(cost)** | 15,000.00 + 1,814.06 | **₱16,814.06** |

**NPV** = ₱32,847.42 − ₱16,814.06 = **₱16,033.36**

> Rounding note: carried without intermediate rounding the NPV is ₱16,033.37; the centavo gap is display rounding only. Call it **≈ ₱16,000** in today's pesos.

## 4. Answer key — worked example

```
PV year-1 benefit ....... ₱9,523.81
PV year-2 benefit ....... ₱10,884.35
PV year-3 benefit ....... ₱12,439.26
Σ PV(benefit) ........... ₱32,847.42
Σ PV(cost) .............. ₱16,814.06
NPV @ r = 5% ............ ₱16,033.36   ≈ ₱16 thousand today
```

Positive NPV ⇒ under house rules the pilot clears the bar: the diversion story creates more present-peso value than it consumes.

## 5. Practice scenario — do solo, then compare rates

This mirrors the solo ask (`2:47:34`): same method, new number set, two rates to compare.

**Scenario:** barangay drop-off window over 3 years.

| Year | Item | Cash flow |
|------|------|-----------|
| t = 0 | Cost — bin build-out | −₱10,000 |
| t = 1 | Benefit — scrap sale value | ₱8,000 |
| t = 1 | Cost — haul fee | −₱1,000 |
| t = 2 | Benefit — scrap sale value | ₱8,000 |
| t = 3 | Benefit — scrap sale value | ₱8,000 |

Compute NPV twice: **(a)** at r = 10% (project-analysis ceiling) and **(b)** at r = 4% (global long-horizon rate). Then answer: which rate gives the higher NPV, and why does that always happen when benefit arrives later than cost?

<details>
<summary>Answer key — practice (open only after computing)</summary>

At **r = 10%**: factors 1.1, 1.21, 1.331.

- PV benefit year 1 = 8,000 ÷ 1.1 = ₱7,272.73
- PV benefit year 2 = 8,000 ÷ 1.21 = ₱6,611.57
- PV benefit year 3 = 8,000 ÷ 1.331 = ₱6,010.52
- Σ PV(benefit) = ₱19,894.82
- Σ PV(cost) = 10,000 + 1,000 ÷ 1.1 = ₱10,909.09
- **NPV @ 10% = ₱8,985.73**

At **r = 4%**: factors 1.04, 1.0816, 1.124864.

- PV benefit year 1 = 8,000 ÷ 1.04 = ₱7,692.31
- PV benefit year 2 = 8,000 ÷ 1.0816 = ₱7,396.45
- PV benefit year 3 = 8,000 ÷ 1.124864 = ₱7,111.97
- Σ PV(benefit) = ₱22,200.73
- Σ PV(cost) = 10,000 + 1,000 ÷ 1.04 = ₱10,961.54
- **NPV @ 4% = ₱11,239.19**

Comparison: the lower rate wins (₱11,239.19 > ₱8,985.73). A low rate shrinks distant value less, so later benefit survives closer to face value — which is why the choice of `r` is an ethical decision about how much we discount the future, not just arithmetic.
</details>

## 6. House-rules box — rate discipline from the brief

> Source: discount-rate guidance set in session (`2:42:20`), recorded in `docs/plaud/2026-08-22-project-development.md`.

| Rule | Rate | Cite |
|------|------|------|
| Project analysis ceiling — social discount rate | **at most 10%** | `2:42:20` |
| Global long-horizon rate (Ramsey-style) | **~4%** | `2:42:20` |
| Forbidden for climate net-benefit analysis | **never 15%** | `2:42:20` |

Companion asks this worksheet serves: estimate your own project's benefit (`2:16:50`) · redo the exercise solo at 5% and compare (`2:47:34`).

## 7. Where this lands — campaign canvas §13.3

The cost-of-action/cost-of-inaction cells in [`docs/campaign-canvas.md`](../campaign-canvas.md) §13.3 are filled in **today's pesos**, not raw future sums: run the table in §3 once for *if we act* (pilot cash flow) and once for *if we do not act* (residual waste stays opaque — evidence base in `R37-sdg12-waste-metrics.md`), then paste each NPV into its canvas cell. Same method, two scenarios, comparable units.

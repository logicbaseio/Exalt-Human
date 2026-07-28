# ExaltHuman — Content Strategy & Editorial Calendar

*Maintained by the Chief Research Editor agent (`.claude/agents/exalt-editor.md`).
Living document — update the queue as stories ship or new evidence lands.*

---

## 1. Positioning

ExaltHuman explains **how humans can optimize themselves using the best available
science** — across biology, neuroscience, psychology, medicine, nutrition,
longevity, technology, genetics, and AI.

We are measured against Huberman Lab, Peter Attia, FoundMyFitness, Nature, Cell,
MIT Technology Review (health), Stanford Medicine, and DeepMind Health — **not**
wellness blogs. The felt experience of every piece:

> "I didn't know this… and this could genuinely improve my life."

Trust is the moat. We win by being the publication people believe *because* we
show the strength of evidence, the limitations, and the conflicts — not despite
them.

---

## 2. Pillar weighting (target publishing mix)

Balance breadth of the human system with what readers can act on. Rough target
across any rolling 12 pieces:

| Pillar | Share | Notes |
|---|---|---|
| Human Biology | ~18% | The "how your body works" backbone. |
| Brain & Neuroscience | ~18% | Highest-engagement pillar; focus, sleep, dopamine. |
| Longevity | ~15% | Aspirational + future-defining; heavy sourcing bar. |
| Nutrition | ~13% | Actionable, high-search; guard hardest against hype. |
| Fitness | ~12% | Concrete, trainable levers (VO₂max, strength, Zone 2). |
| Psychology | ~10% | Habits, motivation, attention, behavior change. |
| Human Optimization | ~9% | Recovery, cold/sauna, HRV, wearables, sleep. |
| AI & Human Health | ~5% | The frontier; anchors the Human Future series. |

---

## 3. The three series & cadence

| Series | Purpose | `system` label prefix |
|---|---|---|
| **Human Hijack** | Hidden forces quietly reducing human performance | `Human Hijack · <Pillar>` |
| **Human Upgrade** | Latest breakthroughs that improve performance | `Human Upgrade · <Pillar>` |
| **Human Future** | The technologies reshaping what humans are | `Human Future · <Pillar>` |

**Suggested weekly cadence (start):** 3 articles/week —
1× Human Hijack (Mon), 1× Human Upgrade (Wed), 1× Human Future (Fri) — rotating
pillars so no domain goes dark for more than ~2 weeks. Scale cadence only when
the sourcing bar can be held.

**Article shape (Human Hijack):** Hook → the hidden problem → scientific
explanation → real-world consequences → evidence (with strength) → actionable
takeaways.

---

## 4. Story-selection scorecard

Score a candidate 1–5 on each; publish priority = highest total. Anything that
scores ≥4 on "Hype risk" needs an extra sourcing pass or gets cut.

- **Surprise / counterintuitive** — does it overturn a default belief?
- **Actionability** — can a reader change something this week?
- **Evidence strength** — RCT / large cohort / mechanism vs. anecdote.
- **Importance** — does it matter for health, performance, or the future?
- **Shareability** — would an intelligent reader send it to a friend?
- **Undercoverage** — is mainstream media missing or distorting it?
- **Hype risk (inverse)** — how easily could this be overstated? (lower = better)

**Auto-reject:** celebrity diet gossip, miracle cures, unverified supplement
claims, pseudoscience, clickbait, single-anecdote stories.

---

## 5. Sourcing & evidence standard (non-negotiable)

- Primary sources first, in priority order (peer-reviewed → Nature/Science/Cell
  → NEJM/JAMA/Lancet → NIH/PubMed/ClinicalTrials.gov → FDA/WHO/CDC → institutions).
- Every `references[]` href is **verified to resolve** before publish.
- State: consensus, evidence strength, limitations, conflicting findings, sample
  size, observational vs randomized, and whether results are preliminary.
- Never promise cures, overstate, fear-bait, or invent mechanisms.

---

## 6. Launch queue — Q3 2026

Status: **▶ in production** · ◻ queued · ✅ live

**Already live (Research Desk):** `sleep-is-the-foundation`,
`your-nervous-system-is-always-listening`, `metabolism-is-more-than-calories`.

| # | Status | Series · Pillar | Working title | Anchor evidence to verify |
|---|---|---|---|---|
| 1 | ▶ | Human Hijack · Nutrition | Ultra-processed food is engineered to override fullness | Hall et al., NIH inpatient RCT, *Cell Metabolism* 2019 |
| 2 | ▶ | Human Upgrade · Fitness | VO₂ max: the most trainable longevity metric | Mandsager et al., *JAMA Network Open* 2018; AHA CRF statement 2016 |
| 3 | ▶ | Human Future · AI & Health | AI learned to read the language of proteins | Jumper et al., *Nature* 2021 (AlphaFold); AlphaFold DB 2022 |
| 4 | ◻ | Human Hijack · Neuroscience | How variable-reward apps recalibrate your attention | Dopamine/reward-prediction literature; attention-fragmentation studies |
| 5 | ◻ | Human Upgrade · Nutrition | Creatine may be a cognitive tool, not just a gym supplement | Creatine + cognition/sleep-deprivation trials |
| 6 | ◻ | Human Future · Longevity | Senolytics: clearing "zombie" cells, carefully | Senolytics preclinical + early-phase human trials |
| 7 | ◻ | Human Hijack · Optimization | The hidden cost of chronic sleep debt | Sleep-restriction lab studies; performance decrements |
| 8 | ◻ | Human Upgrade · Neuroscience | Zone 2 and the brain: exercise as cognitive maintenance | Aerobic exercise + BDNF/cognition evidence |
| 9 | ◻ | Human Future · AI & Health | AI is learning to catch disease earlier than doctors | AI diagnostics (retinopathy, mammography) validation studies |
| 10 | ◻ | Human Biology | Your gut microbiome is a metabolic organ | Microbiome–host metabolism reviews |
| 11 | ◻ | Longevity | What biological-age clocks can and cannot tell you | Epigenetic clock literature + limitations |
| 12 | ◻ | Human Hijack · Psychology | Why "just use willpower" is bad behavioral science | Habit-formation / context-cue behavior research |

Refresh the queue monthly: retire shipped rows, promote new high-scorers, and
re-check anchor studies for retractions or stronger replacements.

---

## 7. Production workflow

1. **Pick** a story from the queue (or score a new one on §4).
2. **Research** with WebSearch/WebFetch — verify the anchor study and gather 3–5
   supporting primary sources with resolvable URLs.
3. **Draft** as a `ResearchArticle` object appended to
   `app/articles/article-data.ts` (match the type; citations index into
   `references[]`; include an `evidence` block with strength + limits).
4. **Self-check** against §5 and the "EVERY ARTICLE MUST ANSWER" list.
5. **Build** (`npm run build`) to confirm it compiles and renders at
   `/articles/<slug>`.
6. **Log** it here (mark ✅, add the shipped date).

---

## 8. What "world-class" looks like (quality KPIs)

- Zero unverifiable claims or dead reference links.
- Every health-relevant piece names its limitations and, where relevant, when to
  seek clinical care.
- A domain expert skimming it would not wince.
- The reader leaves with one thing they can do — and a reason to trust us next time.

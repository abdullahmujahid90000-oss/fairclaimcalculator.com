# Phase 1: keyword and intent research (2026-11-21)

## Data available

No keyword-volume source is connected: Semrush in this workspace exposes only
AI-prompt tracking and local listings (no keyword reports), Windsor has no
Search Console account, and Google Keyword Planner was not provided. So:

- **Every volume label below is an estimate** (High / Medium / Low), judged from
  how many large publishers target the phrase, how many distinct result pages
  exist for it, and whether it shows up as autocomplete-style variants and
  "people also ask" questions. Do not read them as numbers.
- Once Search Console has data (owner task), replace these labels with real
  impressions and re-check the map.

Cluster A is researched in depth for batch 1. Clusters B–I list the phrases and
intent now; each gets a full competitor read (top 5–8 results) in its own batch,
saved as `research/<slug>.md`, before any page is written.

## Cluster A: "Is my car totaled?" (batch 1)

### Phrases and intent

| Phrase (and close variants) | Intent | Est. volume | Page |
|---|---|---|---|
| is my car totaled; is my car totaled calculator; total loss calculator | Calculate | High | `/calculators/total-loss-threshold-checker/` |
| when is a car considered a total loss; when is a car totaled; what percentage of damage totals a car | Answer | High | `/calculators/total-loss-threshold-checker/` (answer-first intro) — secondary on the hub |
| total loss threshold by state; total loss threshold 2026; total loss states list | Compare/data | High | `/guides/total-loss/state-total-loss-threshold-laws/` (hub) |
| [state] total loss threshold; is [state] a total loss formula state; [state] salvage title percentage | Answer (local) | Low each, ×51 | state pages `/…/state-total-loss-threshold-laws/[state]/` |
| total loss formula; TLF states; repair cost plus salvage value | Answer | Medium | hub, H2 "Percentage states vs. Total Loss Formula states" |
| 75% rule car insurance; 80% rule total loss | Answer | Medium | hub (FAQ + table filter), not separate pages |
| does insurance total a car at 70%; can insurance total my car below the threshold | Answer | Medium | threshold checker FAQ ("insurer may total it anyway") |
| repair cost vs actual cash value | Answer | Medium | `/guides/total-loss/acv-vs-replacement-cost-loan-payoff-asking-price/` keeps ACV vs replacement; threshold checker covers the ratio |
| total loss threshold changes 2026; [state] new total loss law | News/data | Low, rising | **new** `/guides/total-loss/total-loss-threshold-changes/` |
| can I refuse a total loss / repair it anyway | Answer | Medium | future page #3 in the brief ("totaled but I want it repaired"), Cluster E |
| is a car totaled if the airbags deploy; is frame damage a total loss | Answer | Medium | threshold checker FAQ now; possible standalone later |

### What the top results do (read 2026-11-21)

Results for the head terms are dominated by insurers and comparison sites:
The Zebra (calculator), Policygenius, SoFi, CarInsurance.com, Insurify,
MoneyGeek, Kelley Blue Book, GEICO, Progressive, AAA, Lemonade, plus a law-firm
PDF table (Merlin Law Group / mwl-law.com) and thin calculator clones on
`pages.dev` subdomains.

Gaps and errors we can do better on:
1. **Tables disagree and are rarely sourced to the statute.** Policygenius,
   SoFi and CarInsurance.com copy one another; several states differ between
   them (FL, CO, OK, IA, MN noted on 2026-11-11). None link each state to the
   statute text.
2. **They blur two different laws.** Most "thresholds" are salvage-title
   branding rules (DMV); a few are insurance claim-handling rules that stop an
   insurer from totaling below a line (Rhode Island's § 27-9.1-4 is the clearest
   example). Competitors present both as the same thing, which misleads people
   whose insurer totals below the "state percentage".
3. **2026 changes are missing or wrong.** Rhode Island (85%) and Oklahoma
   (70% from Nov 1, 2026) are missing from most tables; South Dakota's tabled
   75% bill is sometimes reported as law.
4. **Texas is described two ways** (100% of repair cost vs. repair + salvage ≥
   ACV); few explain why.
5. **No distance-to-the-line math** except on our calculator.

### What batch 1 adds that they don't

- Every state linked to its statute or official agency page, with a
  "last checked" date and a confidence label where only secondary sources exist.
- A "what kind of law is this" line per state (title branding vs. claim handling).
- A dated change tracker (RI 2025 and 2026, OK 2026, SD 2026 bill tabled, IA
  2021, MN 2012) — original, citable data.
- `Dataset` schema on the hub table and the tracker.

## Clusters B–I: phrase inventory and page map

`new` = no page yet. Pages listed once per primary phrase to avoid two pages
competing for the same search.

| Cluster | Primary phrase | Intent | Est. vol. | Page |
|---|---|---|---|---|
| B | totaled car value calculator; how much will insurance pay for my totaled car | Calculate | High | `/calculators/total-loss-offer-audit/` |
| B | total loss settlement calculator; total loss settlement breakdown | Calculate | Medium | `/calculators/settlement-check-breakdown/` |
| B | how do insurance companies value a totaled car; CCC valuation | Answer | Medium | `/guides/total-loss/how-insurers-value-a-total-loss-vehicle/` |
| B | actual cash value vs replacement cost | Answer | Medium | `/guides/total-loss/acv-vs-replacement-cost-loan-payoff-asking-price/` |
| B | how to read a CCC / Mitchell / Audatex valuation report | Answer | Medium | `/guides/total-loss/reading-your-total-loss-valuation-report/` |
| B | total loss valuation report errors; condition adjustment | Answer | Low | `/guides/total-loss/common-valuation-report-errors/` |
| B | how to negotiate a total loss settlement; dispute total loss valuation | Answer/steps | Medium | `/guides/total-loss/how-to-dispute-a-total-loss-valuation/` |
| B | insurance offer too low; lowball offer car insurance | Answer | Medium | `/guides/claim-process/how-to-respond-to-a-lowball-offer/` (repair **and** total-loss offers; keep the total-loss detail on the dispute guide) |
| B | comparable vehicles for total loss | Steps | Low | `/guides/total-loss/finding-your-own-comparable-vehicles/` + worksheet form |
| B | total loss dispute letter | Template | Low–Med | `/forms/total-loss-valuation-dispute-letter/` |
| B | appraisal clause auto insurance | Answer | Low–Med | `new` (#22) |
| B | does insurance pay sales tax on a totaled car (by state) | Answer/data | Medium | `/guides/total-loss/sales-tax-title-fees-on-a-total-loss/` + calculator |
| B | how long does a total loss claim take | Answer | Medium | `new` (#1) |
| C | diminished value calculator; 17c calculator | Calculate | Medium | `/calculators/diminished-value-baseline/` |
| C | what is diminished value | Answer | Medium | `/guides/diminished-value/what-is-diminished-value/` |
| C | 17c formula | Answer | Low–Med | `/guides/diminished-value/the-17c-formula-history-calculation-and-limits/` |
| C | diminished value by state; can I claim DV on my own insurance | Data | Medium | `/guides/diminished-value/state-laws-first-party-diminished-value-claims/` (expand to 51-row table) |
| C | diminished value claim letter | Template | Low–Med | `/forms/diminished-value-claim-letter/` |
| C | diminished value leased car | Answer/calc | Low | `/calculators/leased-vehicle-diminished-value/` (guide becomes supporting) |
| C | how to file a diminished value claim | Steps | Low–Med | `new` (#16) |
| C | diminished value appraisal cost | Answer | Low | `new` (#19) |
| D | car totaled still owe money; gap shortfall | Calculate | Medium | `/calculators/gap-shortfall/` |
| D | gap insurance total loss; does gap cover deductible | Answer | Medium | `/guides/total-loss/gap-insurance-loan-lease-after-total-loss/` |
| D | total loss on a leased car | Answer | Low–Med | `new` (#5) |
| E | can I keep my totaled car; owner retained salvage; salvage title meaning | Answer | Medium | `/guides/total-loss/owner-retained-total-loss-and-salvage-titles/` |
| E | salvage value calculator | Calculate | Low | `/calculators/salvage-value/` |
| E | car totaled but I want it repaired | Answer | Low–Med | `new` (#3) |
| F | rental car after accident not at fault; loss of use claim | Answer/calc | Medium | `/guides/claim-process/rental-car-loss-of-use-reimbursement/` (guide) and `/calculators/loss-of-use-reimbursement/` (calc: "loss of use calculator") |
| F | first party vs third party claim | Answer | Low–Med | `/guides/claim-process/first-party-vs-third-party-auto-claims/` |
| F | how to file a complaint against an insurance company | Steps | Medium | `/guides/claim-process/filing-a-complaint-with-your-state-insurance-department/` (guide); worksheet form targets "insurance complaint worksheet" |
| F | how long does insurance have to settle a claim [state] | Data | Medium | `new` (#30) |
| F | insurance claim log template | Template | Low | `/forms/claim-communication-log/` |
| F | car insurance claim tracker | Tool | Low | `/my-claim/` |
| G | what to do after a car accident; car accident checklist | Steps | High | `/guides/claim-process/what-to-do-after-a-car-accident/` |
| G | car accident information sheet pdf | Template | Low–Med | `/forms/accident-information-worksheet/` |
| G | documents needed for car insurance claim | Steps | Low–Med | `/guides/claim-process/auto-claim-evidence-checklist/` |
| G | do I have to report a car accident in [state]; [state] accident report form; SR-1, MV-104 | Answer ×51 | Low each | `/guides/accident-reporting/[state]/` |
| G | how to get a police report [state] | Steps ×51 | Low each | same state pages (crash-report section), no separate pages |
| G | hit and run what to do; uninsured driver hit me | Steps | Medium | `new` (#28, #27) |
| H | hail damage totaled car; flood car total loss | Answer | Seasonal | `new` (#8) |
| I | should I file a claim or pay out of pocket | Calculate | Medium | `new` (#29) |
| I | car insurance minimums by state | Data | High (competitive) | `new` (#31) |

### Cannibalisation found

1. **"Car Insurance Claim Checklist"** is the start of two titles:
   `/forms/claim-evidence-checklist/` ("…— Free Printable PDF") and
   `/guides/claim-process/auto-claim-evidence-checklist/` ("…: Documents You
   Need"). Fix in batch 6: the guide keeps "documents needed for a car
   insurance claim"; the form keeps "claim checklist PDF".
2. **Lowball offer vs. dispute guide**: overlap on total-loss offers. Split
   as in the table above (batch 3).
3. **Two DV calculators**: the lease calculator should target only lease
   phrases (batch 4).

### Phrases with no page yet (by cluster)

A: total loss threshold changes (batch 1). B: appraisal clause, total loss
timeline, aftermarket parts/upgrades, classic/agreed value, personal items and
plates. C: how to file a DV claim, DV appraisal cost, DV after a minor accident.
D: leased car total loss, financed car total loss "who gets the check".
E: totaled but want it repaired. F: claim deadlines by state, bad-faith signs,
recorded statement, not-at-fault rights, UM property damage. G: hit and run,
uninsured driver. H: hail, flood, hurricane, theft recovery, deer. I: file or
pay out of pocket, will my rates go up (factors only), minimums by state.

## Sources for this note

Search result pages read 2026-11-21 for: "is my car totaled calculator", "when
is a car considered a total loss percentage", "total loss threshold by state
2026", "will insurance total my car at 70 percent", "texas total loss threshold
100% salvage", "Rhode Island total loss threshold 85% 2026", "South Dakota SB
227 2026 total loss". Competitor pages named above were seen in those results.

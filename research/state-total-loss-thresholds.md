# Research: total loss thresholds, all 51 jurisdictions (2026-11-21)

Batch 1 (Cluster A). Raw per-state research records, including notes on what
could not be verified, are in `research/data/state-thresholds-2026-11-21.json`.
The published facts are in `astro/src/lib/content/state-threshold-facts.ts`.

## Method, and its limit (read this first)

- Five research passes (about 10 states each) looked for each state's statute
  or regulation, the title agency's guidance, the insurance regulator, recent
  enacted changes and failed bills.
- **This environment's network blocked direct page loads** (every statute
  site, and even google.com, returned a proxy refusal). Only web search
  worked. So statute wording was read through search excerpts of the
  official pages (and Justia/Cornell/FindLaw copies), not by opening the full
  text, and no link could be load-tested.
- I spot-checked by hand the six states whose calculator result changes
  (FL, OR, IN, VA, WY, RI), again through search excerpts of official pages.
- Publishing rule used: a fact went on the site only if the research
  supported it; anything a pass marked "not verified" (fees, processing
  times, phone numbers, exact paragraph letters, some age limits) was left
  out. States whose core rule could not be confirmed in official wording are
  marked `check: "unconfirmed"`, say so on the page and stay `noindex`:
  Mississippi, New Hampshire, New Mexico, Utah.
- **Follow-up when network access allows:** open each `cite.url` and confirm
  the wording and the link (see `research/open-questions.md`).

## What changed on the site

| State | Before | After | Why |
|---|---|---|---|
| Rhode Island | Total Loss Formula | 85%, limits insurers (owner may ask from 75%) | R.I. Gen. Laws § 27-9.1-4 as amended by H 6053 (2025, 80%) and S 3115 / P.L. 2026 ch. 286 (85%, effective 2026-06-26). Official code page still shows the 2025 (75–80%) text; the 2026 change is reported by CollisionWeek (2026-06-10, 2026-07-09), Autobody News and Repairer Driven News, and H 7866 (2026) on the legislature site amends the same section. |
| Florida | 80% | No general % (insurer-paid total = total loss; 80% only for uninsured cars) | Fla. Stat. § 319.30(3)(a): insurer payment triggers; 80% of replacement cost applies to uninsured vehicles; FLHSMV procedures TL-35/TL-36. |
| Oregon | 80% | No general % (insurer declaration controls; 80% only for uninsured damage) | ORS 801.527(1) vs (3); ODOT DMV insurer guidance. |
| Wyoming | 75% | No general % (75% only when no insurer is involved) | Wyo. Stat. § 31-2-107(a). |
| Virginia | 75% | Formula-style test (repairs > ACV − salvage value); 75% for specific cases | Va. Code § 46.2-1600 (LIS); Virginia DMV salvage guidance. |
| Oklahoma | 70% (already correct) | 70%, with change dated | SB 1920, law without signature 2026-05-13, effective 2026-11-01 (oklegislature.gov bill page excerpt; NAMIC). |
| South Dakota | TLF | No % in law; SB 227 (75%) recorded as failed | Passed Senate 27–6 (2026-02-17), tabled 8–3 in House Transportation (2026-02-24), per the committee minutes on mylrc.sdlegislature.gov. |

Labels for the other no-percentage states now say what the law does
("formula-style test in law" for CT, ID, MA, PA, VA, WA; "no % in law:
insurer decides" for the rest) instead of calling them all "Total Loss
Formula states". Every percentage state now shows what the percentage is
measured against and its limits (age limits in NY, WI, KS, MI, NE, IN;
value floors in SC, IA; hail exclusions in TX, ND, KS, MO).

## Re-indexing (scaled-content rule)

Similarity of each state page's `<main>` text to its most similar sibling
(word-level difflib ratio, `python3 astro/scripts/audit-site.py --similarity
/guides/total-loss/state-total-loss-threshold-laws/`):

- Before: 0.90–0.98 (median 0.96). For comparison, two unrelated guides on the
  site score 0.16–0.32.
- After: 0.49–0.66. 21 states below 0.60 and confirmed are back in the index
  (AK, AR, CA, CT, FL, GA, HI, IL, IN, KY, MA, MI, MN, NJ, NY, ND, PA, RI, SD,
  VA, WA). The other 30 stay `noindex` until they carry more state-specific
  substance (topic 17).

## Competitor notes

See `research/01-keywords.md` (Cluster A). Short version: the popular tables
(Policygenius, SoFi, CarInsurance.com, The Zebra, Insurify, MoneyGeek) copy
one another, call about half the states "Total Loss Formula states" without a
statutory basis, miss the 2026 changes, and quote uninsured-vehicle rules
(FL, OR, WY) as general thresholds.

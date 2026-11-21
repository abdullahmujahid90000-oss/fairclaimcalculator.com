# Phase 0 audit: FairClaimCalculator.com (2026-11-21)

Audited by the FairClaimCalculator editorial workflow (Claude session, 2026-11-21).
Method: `npm run build` on branch `seo/cluster-a-total-loss` (= open PR #2
`claude/beautiful-keller-h7960k` + the internal-linking commit from
`seo/internal-linking-2026-11-20`), then `python3 astro/scripts/audit-site.py`
over `astro/dist/`. Per-page numbers are in `research/00-audit-pages.csv`.
Body links = links inside `<main>` minus breadcrumbs (header, nav and footer
links do not count). Word counts = visible `<main>` text.

The live site could not be crawled from this environment (the network policy
blocks www.fairclaimcalculator.com). The live site still runs the older `main`
branch; PR #2 has not been merged, so everything below describes the site as it
will be once PR #2 and this batch are merged.

## 1. Repository state (corrects the brief)

| Item | Brief said | Actually found |
|---|---|---|
| Roadmap | All 16 topics `todo` | Topics 1–5 **done** on the unmerged PR #2 branch (11–20 Nov 2026), plus new topics 17–18 |
| Who is editing | Only this session | A scheduled task ("FairClaimCalculator topic rewrite (Mon/Wed/Fri)") was committing to PR #2. **Paused 2026-11-21 at the owner's instruction**, not deleted |
| 51 threshold state pages | Live and indexable | `noindex,follow` and out of the sitemap since 2026-11-08 (scaled-content risk: 89–94% identical) |
| Internal-linking branch | To rebase onto main | Cherry-picked onto PR #2; 6 guides conflicted (PR #2 rewrote them), resolved by keeping PR #2 text and re-running the idempotent `add-related-links.py` |
| Pages | ~166 | 167 built pages + 10 redirect stubs + 21 retired personal-injury stubs (all `noindex`) |

## 2. Gate checks (pass/fail)

| Check | Result |
|---|---|
| Broken internal links | **0** |
| H1 count ≠ 1 | **0** pages |
| Titles > 60 chars (indexable) | **0** |
| Descriptions > 160 chars | **0** |
| Invalid JSON-LD | **0** |
| Duplicate titles / descriptions | **0** |
| Placeholder text (TODO, lorem, TBD) | **0** |
| Images missing alt | **0** |
| Orphans (< 3 inbound body links, indexable) | **6**: `/glossary/` (0), `/accessibility/` (0), `/terms/` (0), `/privacy/` (1), `/guides/accident-reporting/alaska/` (2), `/guides/accident-reporting/hawaii/` (2). Legal pages are linked from the footer on every page, which is normal; the glossary and AK/HI are real gaps |
| Pages with < 4 inbound body links | 10 (above + advertising disclosure, 2 forms, Maine) |
| Descriptions < 110 chars | `/contact/` (103), `/terms/` (91) |

## 3. Content depth (indexable pages, visible `<main>` words)

| Group | Pages | Min / median / max words | Notes |
|---|---|---|---|
| Hubs and trust pages | 18 | 139 / 370 / 930 | Cluster hubs are link lists (170–245 words); the brief asks for a 200+ word intro that helps people choose |
| Calculators | 10 | 516 / 744 / 2,333 | Threshold checker (1,260) and offer audit (2,333) rewritten; the other 8 are 516–675 |
| Guides | 28 | 170 / 656 / 1,938 | 14 guides under 700 words (lowest: valuation-report errors 444, inherent vs repair DV 469, what is DV 499) |
| Forms | 8 | 354 / 492 / 664 | Each has a PDF; prose is short |
| Accident-reporting state pages | 51 | 310 / 433 / 598 | **Indexed**; 17 are under 400 words |
| Threshold state pages | 51 | 724 / 790 / 876 | `noindex`; long but mostly shared text |

## 4. Scaled-content (near-duplicate) risk: the top risk for AdSense

Word-level similarity of each state page's `<main>` text to its most similar
sibling (difflib ratio, `audit-site.py --similarity`):

| Set | Indexed? | Lowest | Median | Highest | Repo rule |
|---|---|---|---|---|---|
| Threshold pages (51) | No (`noindex`) | 0.90 | 0.96 | 0.98 (Hawaii ~ Alaska) | Re-index only below ~0.60 |
| Accident-reporting pages (51) | **Yes** | 0.57 | 0.72 | 0.81 (Maine ~ Louisiana) | Same rule |

The 2026-11-20 log measured the accident pages at 49–66% with a slightly
different method; this audit measures the full `<main>` text including FAQs and
finds most are still above 60%. They are indexed, so they are the largest
remaining "templated pages" signal a reviewer could see. Fix: add genuinely
state-specific substance (crash-report copy instructions for the other 41
states, form details, deadlines, examples) and cut shared text further, or
temporarily `noindex` the pages that stay above 0.60 until they are rewritten.

## 5. Accuracy and freshness

- **Threshold data is mostly secondary.** 47 of 51 states in
  `STATE_THRESHOLDS` rely on a Policygenius compilation; only CO, IA, MN and OK
  carry a checked statute citation.
- **Rhode Island is wrong on the site.** It is listed as "Total Loss Formula".
  Trade press reports a 2025 law (75% → 80%) and a 2026 law (80% → 85%, S 3115)
  in the insurance code (R.I. Gen. Laws § 27-9.1-4). Being verified against the
  legislature's text in batch 1.
- **South Dakota SB 227 (75% floor)** passed the Senate but was tabled in House
  committee on 2026-02-24 per trade press; South Dakota should stay unchanged,
  with a dated note. Verifying on sdlegislature.gov.
- **Oklahoma 60% → 70% (SB 1920, effective 2026-11-01)** is already on the site
  with the Oklahoma Insurance Department's 2026 change summary as source.
- `lastmod` in the sitemap is the **build time** for every URL (all 115 show
  the same timestamp). Google ignores lastmod that does not reflect real
  changes, so it should come from each page's reviewed date.
- 37 indexable pages show no visible "Last reviewed" date (all calculators,
  forms, hubs and trust pages). The guide template has one; others do not.

## 6. Structured data

- Present: Organization (all), BreadcrumbList (164), Article (127), FAQPage
  (127), HowTo (8), DigitalDocument (8 forms), WebApplication (3), DefinedTermSet (glossary).
- Missing: `WebApplication` on 7 calculators (diminished value, GAP, loss of use,
  sales tax, salvage, settlement breakdown, letter builder); `Dataset` on the
  threshold and accident-reporting data tables; `CollectionPage`/`ItemList` on
  hubs; breadcrumbs on `/my-claim/`.

## 7. AI-assistant visibility

- `robots.txt` is `User-agent: * / Allow: /` with the sitemap. That already
  allows every AI crawler; naming them explicitly (brief §8.1) is optional but
  documents intent.
- `/llms.txt` exists and is generated at build time from page titles and
  descriptions; it lists threshold state pages nowhere (they are noindex), which
  is correct.
- Calculators render their explanations server-side (static Astro), so the
  text is readable without JavaScript.

## 8. AdSense plumbing (unchanged, verified in code)

- `ca-pub-5391037132181133` in `astro/src/lib/ads/config.ts`,
  `ADS_SERVING_ENABLED = false`; `google-adsense-account` meta tag on every page;
  `ads.txt` generated at build. Not touched.

## 9. Prioritised work list

1. **Batch 1 (Cluster A).** Verify all 51 thresholds from statutes; fix RI; dated
   "Recent changes" notes (RI, OK, SD, IA, MN); rebuild the threshold state
   template around state-specific facts (statute, what the law governs,
   exceptions, keeping the car, agency links) and re-index the states that
   measure under 0.60; add a "threshold change tracker" page and `Dataset`
   schema; sitemap lastmod from real dates.
2. **Batch 2 (Cluster G, scaled-content fix).** Accident-reporting state
   pages: crash-report copies for the remaining 41 states (roadmap topic 18),
   cut shared text, reach < 0.60 similarity and 400+ words, or `noindex` laggards.
   Fix the AK/HI/ME orphans.
3. **Batch 3 (Cluster B).** Dispute / valuation report / comparables /
   settlement breakdown (roadmap topics 7, 15), including the sourced
   class-action note.
4. **Batch 4 (Cluster C).** Diminished value (topics 6 and 13), the 51-state DV
   table and the 2025–2026 court decisions.
5. **Batch 5 (Cluster D/E).** GAP, sales tax by state, keeping a totaled car
   (topics 9–11).
6. **Batch 6 (Cluster F).** Rental/loss of use, claim process, letters
   (topics 8, 12, 14); claim-deadline table by state.
7. **Batch 7.** Hubs, glossary, trust pages (topic 16): 200+ word hub intros,
   visible reviewed dates everywhere, WebApplication schema on all calculators.
8. **Batch 8+.** New pages from the brief's list (seasonal hail/flood first,
   then "file a claim or pay out of pocket" calculator), linking pass,
   AI-visibility pass, final AdSense audit.

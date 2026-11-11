# CONTENT-ROADMAP.md: topic-by-topic rewrite (3 topics a week)

Internal reference only, not part of the live site. Started 2026-11-07 at the
owner's request: rewrite every page, one topic per run, three runs a week
(Mon/Wed/Fri), with real research first. Goals in the owner's words: **ranking**
and **more traffic**, content that is fully useful and different from (better
than) what competitors offer, and features that make visitors come back.

Each scheduled run takes the **first topic below whose status is `todo`**, does it
completely, sets it to `done (YYYY-MM-DD)`, and adds a dated entry to BUILD-LOG.md.
If a run cannot finish a topic, it sets `in progress` with a one-line note on
what is left, and the next run finishes that topic before starting a new one.

---

## Rules for every topic

### 1. Research first (before writing a word)
- **Search demand.** Run web searches for the topic's seed keywords and their
  variations. Collect: the exact phrases people use, "People also ask" style
  questions, long-tail versions ("in Texas", "with a loan", "after a hail storm").
  No keyword-volume tool is connected yet, so rank phrases by how often they
  appear across competitors, question sites and autocomplete-style variants;
  label volumes as estimates. If Search Console data becomes available, use it first.
- **Competitors.** Read the top 5–8 real results (skip spam/scraped copies).
  Note what each covers, what it gets wrong or leaves out, and what format it
  uses (calculator, table, checklist, video, FAQ).
- **Facts.** Every legal or numeric claim needs an official source (statute,
  state DMV/insurance department, NAIC, federal agency) or a clearly named
  secondary source labeled as such. Log new sources in SOURCE-REGISTER.md and
  on /sources/. Never invent a number, a law, a quote, a statistic or a person.
- Save the research notes for the topic under `research/<topic-slug>.md`
  (keywords found, questions found, competitor gaps, sources). These notes are
  the record of why the page says what it says.

### 2. Write for people, structured for search
- One **primary keyword** per page in: title (≤60 chars), H1, URL (keep
  existing URLs; never change a URL that is already live), first 100 words,
  meta description (≤160 chars), one H2.
- **Secondary keywords and questions** as H2/H3s and FAQ entries, in natural
  language. No keyword stuffing, no repeated phrases for their own sake, no
  word-count padding. Google penalizes both, and so does AdSense review.
- Answer the main question in the first 2–3 sentences (featured-snippet style),
  then go deeper. Use tables, numbered steps, worked dollar examples, and
  "what this means for you" boxes.
- **Be different and better:** every rewritten page must have at least one
  thing competitors don't: an interactive tool, a state-specific table, a
  worked example with real numbers, a downloadable checklist, or a correction
  of a common error found in competitor pages.
- FAQ schema for the FAQs, Article/HowTo/BreadcrumbList as the page type fits.
- Internal links: every page links to its calculator, its guide, its form, and
  the next logical step. Every new page is linked from at least two existing pages.
- Reading level: plain English, short paragraphs, US spelling, US audience.

### 2b. Natural writing (the owner's top priority: AdSense approval)
AdSense and Google both reject pages that read as written for search engines.
Every page must read like a knowledgeable person explaining it to a friend:
- Use the main phrase where it fits naturally, usually 2–4 times on a page,
  never forced into every heading. Use synonyms and natural variations
  ("totaled", "written off", "a total loss") instead of repeating one phrase.
- No lists of keywords, no "best X near me 2026" style headings, no
  sentences that exist only to hold a keyword, no stacked city/state names.
- No filler intros ("In today's world..."), no repeating the question back,
  no generic AI phrasing ("delve", "navigate the complexities", "it's
  important to note"). Get to the point in the first sentence.
- Vary sentence length. Use "you". Use real examples with real numbers.
- Every paragraph must teach something; if removing it loses nothing, remove it.
- State pages and other repeated templates must differ in substance (state
  facts, examples, comparisons), not just the swapped state name.
- Before committing, read each rewritten page from top to bottom once as a
  visitor would. If any sentence sounds like it was written for Google, rewrite it.

### 3. Make people come back (interaction)
Add, where it fits the topic: results that can be saved/printed, a checklist
with progress saved in the browser (localStorage, no account, no backend),
"next step" prompts, deadline countdowns, and links into the **My Claim
tracker** (topic 3). GitHub Pages hosting means no server: everything
interactive runs in the visitor's browser and stores nothing on our side.

### 4. Quality gate before pushing (all must pass)
`npm run typecheck`, `npm run test` (add tests for any new calculator logic),
`npm run build`, `npm run audit:a11y` (0 violations), internal link check
(0 broken), titles ≤60 and descriptions ≤160 chars, a 390px-wide screenshot
check with no horizontal scroll. Ads stay off tool inputs/results (see
`astro/src/lib/ads/config.ts`).

### 5. Hard rules
- The byline is "FairClaimCalculator Editorial Team" (owner's choice, 2026-11-07). Never invent a named person, bio or credentials.
- Never change `ADS_SERVING_ENABLED` or the publisher ID.
- Never delete a live URL. To merge two pages, redirect the old one with the
  existing stub mechanism (`astro/scripts/legacy-paths.mjs`).
- Bodily-injury claims stay out of scope (vehicle/property claims only).

---

## Scaled-content rule for state pages (added 2026-11-08)
Measured 2026-11-08: the 51 total-loss threshold state pages were 89–94%
identical to each other, and the 51 accident-reporting pages 79–85%. The
threshold pages are now `noindex,follow` and out of the sitemap
(`astro/src/lib/seo/indexing.mjs`). A state page goes back into the index only
when it is rewritten with real state-specific substance (statute citation,
state rules and exceptions, a state example, state agency links), and its
text is under ~60% similar to any other state page. Measure similarity on the
built `dist/` pages (word-level difflib ratio of the `<main>` text) before
adding a slug to `INDEXED_THRESHOLD_STATE_SLUGS`. Topics 1 and 5 must cut the
shared boilerplate on their state templates down to what is truly needed.

## Topic order

Ordered by expected traffic and by what later topics depend on.
Seed keywords are starting points for research, not final targets.

| # | Topic | Pages | Seed keywords | Status |
|---|---|---|---|---|
| 1 | **Is my car totaled?** | `/calculators/total-loss-threshold-checker/`, `/guides/total-loss/state-total-loss-threshold-laws/` (hub), state page template (51 pages) | is my car totaled, total loss calculator, total loss threshold by state, [state] total loss threshold, when is a car totaled | done (2026-11-11): calculator + hub rewritten; state pages stay noindex, see topic 17 |
| 2 | **Totaled car value / payout** | `/calculators/total-loss-offer-audit/`, `/guides/total-loss/how-insurers-value-a-total-loss-vehicle/`, `/guides/total-loss/acv-vs-replacement-cost-loan-payoff-asking-price/` | totaled car value calculator, how much will insurance pay for my totaled car, actual cash value car | todo |
| 3 | **Site theme, homepage and My Claim tracker** | homepage, header/footer, design tokens, new `/my-claim/` tracker (browser-saved claim timeline, deadlines, checklist progress) | free car insurance claim calculator, car insurance claim help | todo |
| 4 | **What to do after a car accident** | `/guides/claim-process/what-to-do-after-a-car-accident/`, `/forms/accident-information-worksheet/`, `/guides/claim-process/auto-claim-evidence-checklist/`, `/forms/claim-evidence-checklist/` | what to do after a car accident, car accident checklist, car accident information sheet pdf | todo |
| 5 | **Accident reporting by state** | `/guides/accident-reporting/` hub + state template (51 pages); add "how to get a copy of your crash report" per state | do I have to report a car accident, [state] accident report form, how to get a police report [state] | todo |
| 6 | **Diminished value** | `/calculators/diminished-value-baseline/`, `/guides/diminished-value/what-is-diminished-value/`, `/guides/diminished-value/the-17c-formula-history-calculation-and-limits/` | diminished value calculator, diminished value claim, 17c formula | todo |
| 7 | **Disputing a low offer** | `/guides/total-loss/how-to-dispute-a-total-loss-valuation/`, `/guides/claim-process/how-to-respond-to-a-lowball-offer/`, `/guides/total-loss/common-valuation-report-errors/`, `/guides/total-loss/reading-your-total-loss-valuation-report/` | how to negotiate total loss settlement, insurance lowball offer, dispute total loss valuation | todo |
| 8 | **Letters and templates** | `/calculators/claim-letter-builder/`, `/forms/total-loss-valuation-dispute-letter/`, `/forms/diminished-value-claim-letter/`, `/forms/` hub | total loss dispute letter, diminished value demand letter template | todo |
| 9 | **Sales tax and fees on a totaled car** | `/calculators/sales-tax-title-fee-estimator/`, `/guides/total-loss/sales-tax-title-fees-on-a-total-loss/` (add a sourced state table) | does insurance pay sales tax on totaled car, total loss sales tax by state | todo |
| 10 | **Owe more than the car is worth (GAP)** | `/calculators/gap-shortfall/`, `/guides/total-loss/gap-insurance-loan-lease-after-total-loss/` | car totaled still owe money, gap insurance totaled car, do I need gap insurance | todo |
| 11 | **Keeping a totaled car** | `/calculators/salvage-value/`, `/guides/total-loss/owner-retained-total-loss-and-salvage-titles/` | can I keep my totaled car, salvage title, owner retained salvage | todo |
| 12 | **Rental car and loss of use** | `/calculators/loss-of-use-reimbursement/`, `/guides/claim-process/rental-car-loss-of-use-reimbursement/`, `/forms/rental-loss-of-use-log/` | rental car after accident not at fault, loss of use claim | todo |
| 13 | **Diminished value: laws, evidence, leased cars** | `/guides/diminished-value/state-laws-first-party-diminished-value-claims/`, `/guides/diminished-value/building-diminished-value-market-evidence/`, `/guides/diminished-value/inherent-vs-repair-related-diminished-value/`, leased-vehicle guide + calculator (consider merging) | diminished value claim by state, diminished value leased car | todo |
| 14 | **Claim process** | first-party vs third-party, filing a DOI complaint, appraisal/attorney, DV vs total loss, `/forms/claim-communication-log/`, `/forms/insurance-complaint-worksheet/` | how to file a complaint against an insurance company, appraisal clause auto insurance | todo |
| 15 | **Comparables and settlement check** | `/guides/total-loss/finding-your-own-comparable-vehicles/`, `/forms/comparable-vehicles-worksheet/`, `/calculators/settlement-check-breakdown/`, `/check-my-offer/` | comparable vehicles total loss, total loss settlement breakdown | todo |
| 16 | **Glossary, hubs and trust pages** | `/glossary/`, `/guides/` and cluster hubs, `/calculators/`, About/Methodology/Editorial policy (author details need owner input) | car insurance claim terms | todo |
| 17 | **State threshold pages: per-state rewrite** | `/guides/total-loss/state-total-loss-threshold-laws/[state]/` — ~10 states per run, largest states first (CA, TX, FL, NY, PA, IL, OH, GA, NC, MI). Each needs its statute citation, state rules (salvage branding, owner-retained rules, exceptions like CO hail), a state example; re-index per the scaled-content rule | [state] total loss threshold, [state] salvage title rules | todo |

## New topics to add after the rewrite (from the 2026-10-29 suggestions)
- "Should I file a claim or pay out of pocket?" calculator
- "How long does insurance have to settle a claim in [state]" (sourced, 51 states)
- Car insurance minimums by state
- Hit by an uninsured driver / hit-and-run: what to do
- How long does a total loss claim take; hail/flood totaled cars (seasonal)

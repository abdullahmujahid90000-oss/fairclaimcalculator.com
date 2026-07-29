> **2026-07-22 update:** a full Astro/TypeScript rebuild of this site is now
> underway, superseding the plain-HTML architecture this file describes.
> See `ASTRO-REBUILD-PLAN.md` for the current plan, decision log, and
> execution queue — read that file first for any new session on the v2
> rebuild. This file remains accurate for the plain-HTML site, which stays
> live and untouched until the Astro rebuild reaches parity and cutover is
> explicitly approved (ASTRO-REBUILD-PLAN.md R5/Phase 8).
>
> **2026-07-29 update:** per the owner's expanded rebuild brief, this file
> now also carries a short dated session log for the v2 rebuild itself (§6
> below), so there is one place recording *when* work happened and was
> verified, alongside `ASTRO-REBUILD-PLAN.md`'s living architecture/decision/
> queue record and the newer `SOURCE-REGISTER.md` / `ADSENSE-READINESS.md` /
> `URL-MIGRATION.md` deliverables. Append to §6 at the end of every v2
> session; don't duplicate `ASTRO-REBUILD-PLAN.md`'s content here, just log
> what ran and what was verified.

# BUILD-LOG.md — FairClaimCalculator.com Pivot

Internal reference only — not part of the live site, not linked from navigation,
not in sitemap.xml. **Read this file first at the start of every future session
before touching any code.** It is the only thing that remembers what happened
in prior sessions.

Source of truth for product rules: `fairclaimcalculator-v2-master-build-prompt.md`
(the "master prompt") — uploaded 2026-07-18. Treat every rule in that document
as binding unless this log records an explicit user decision overriding it.

---

## 0. How to use this file (read this every session)

1. Check "Current phase" and "Next up" below.
2. When the user says a trigger word ("next", "continue", "next page", "go
   ahead", etc.) with no other context, build exactly the item listed under
   "Next up" — nothing else, don't ask for topic ideas.
3. When done, move that item to "Session history" with the date and files
   touched, and update "Next up" to the following item in the queue.
4. Never mass-produce state pages, never fabricate legal facts/statistics,
   never enable AdSense/ads.txt without a real approval, never fabricate
   appraiser/attorney partners. These are hard rules from the master prompt,
   not suggestions.
5. Every new page must pass `CONTENT-STANDARDS.md` before being considered
   done, updated for the new topic (see Decision Log item D4).

---

## 1. Decision log

| # | Decision | Rationale |
|---|---|---|
| D1 | **Full pivot.** FairClaimCalculator.com is being rebuilt from a personal-injury settlement calculator hub into the auto diminished-value / total-loss claim-audit product described in the master prompt. | User's explicit choice, 2026-07-18. Master prompt §1.4 lists bodily injury / PI settlement calculators as **out of scope** for this product — the two cannot coexist under one topical focus. |
| D2 | ~~Existing PI pages not deleted~~ — **superseded by D8 below.** |  |
| D3 | **Tech stack: keep current plain HTML/CSS/JS**, not Astro/TypeScript. | User's explicit choice. Matches what's already live, fastest for a daily/every-other-day cadence, no migration project blocking content output. |
| D4 | **Build order follows the master prompt's phase order**: core tools first (Phase 3: settlement breakdown → total-loss audit → evidence/letter builder → DV baseline → next-step guide), then P0 foundational guides/templates/trust pages (Phase 4), then state pilot (Phase 5). | User's explicit choice, matches doc §16. |
| D5 | No attorney or qualified insurance-law reviewer is retained. Per master prompt §8.1 ("If no qualified reviewer is retained, state that clearly and limit the content accordingly"), every legal/state-law page will carry an explicit "not yet reviewed by a qualified professional" note, use hedged language only (§2.3), and state pages stay `noindex` + out of the sitemap until that changes. This is a standing constraint, not a one-time note. | Required by the doc itself; I cannot fabricate a review board or legal sign-off. |
| D6 | Claude (this assistant) verified the 17c/Mabry legal history via live web search on 2026-07-18 before writing anything about it. See `PHASE-0-RESEARCH.md` §2 for sources and the corrected explanation. Do not simplify this back to "the Georgia Supreme Court created the 17c formula" — that is the exact error the doc prohibits (§2.4). | Doc requirement. |
| D7 | AdSense: the existing site does NOT have `ads.txt` and should not until a real publisher ID exists (matches existing `CONTENT-STANDARDS.md` rule). No ad code changes without an explicit user instruction that approval has happened. | Carried over from existing standard + doc §11/§18. |
| D8 | **2026-07-19: full deletion executed.** User asked to remove all duplicate/soon-to-be-duplicate pages and "start fresh." Deleted `calculators/` (4 files) and `articles/` (18 files) entirely via `git rm`/`rm` (required `allow_cowork_file_delete` — the connected folder blocks deletes until explicitly approved). Rewrote `index.html`, `about.html`, `contact.html`, `disclaimer.html`, `privacy-policy.html`, `terms-of-service.html`, `404.html` for the new product (new nav: Home/About/Contact only — expands as real tool/guide pages ship), rebuilt `sitemap.xml` down to 4 real URLs, added `.scenario-cards`/`.scenario-card` CSS. Confirmed via search the domain was not indexed by Google at all before this change, so there was no ranking/backlink equity to lose. This supersedes D2. | Explicit user instruction, 2026-07-19. See `PHASE-0-RESEARCH.md` §7 for the SERP gap-check and domain-suitability findings that informed this. |

---

## 2. Phase status

| Phase | Description | Status |
|---|---|---|
| 0 | Validation & source system | **Done for kickoff** — see `PHASE-0-RESEARCH.md`. Competitor matrix is directional (not a fresh live audit of every competitor site); 17c/Mabry sourced and verified; state scorecard is the doc's own candidate list, explicitly unverified pending real research. |
| 1 | IA & design | **Interim version live** — homepage rebuilt with two scenario cards (not yet clickable to real tools), minimal 3-item nav (Home/About/Contact). Full §9.1 navy/blue/teal/amber design-token system NOT yet applied — site still uses the original green/blue palette in `css/style.css`. Revisit palette as a deliberate decision, not by default. |
| 2 | Technical foundation (nav, schemas, metadata patterns for new topic) | In progress — trust pages (about/contact/disclaimer/privacy/terms/404) rewritten for new topic 2026-07-19. Nav will grow one item at a time as each tool/guide actually ships (no dead links in the meantime). |
| 3 | Core tools (5) | Not started |
| 4 | Foundational content & trust pages | Not started |
| 5 | State pilot | Not started |
| 6 | Launch QA | Not started |
| 7 | Distribution & monetization | Not started |

---

## 3. Build queue (in order — this is what "next" pulls from)

Each queue item = one session's worth of work unless noted. Pages must clear
`CONTENT-STANDARDS.md` (updated for the new topic) before being marked done.

### Phase 1/2 — foundation (do once, before Phase 3 tool pages go live)
- [x] **Q1a.** New minimal nav + homepage rebuild done 2026-07-19 (two scenario cards, trust line, "what's coming" list). Cards are informational only — no links yet, since the tools don't exist.
- [ ] **Q1b.** Wire the homepage scenario cards to real tool pages as each one ships (starts with Q3 below). Add "Methodology" back into nav once that page exists.
- [ ] **Q2.** `/methodology/` page skeleton (versioned config explanation, source caveats — can be thin at first and grow as tools ship).

### Phase 3 — core tools (build in this order per doc §10.2/§16)
- [x] **Q3.** Tool 3 — Settlement Check Breakdown (`/settlement-check-breakdown/`) — **shipped 2026-07-19.**
- [x] **Q4.** Tool 2 — Total-Loss / ACV Offer Audit (`/total-loss-offer-calculator/`) — flagship. **Shipped 2026-07-19.**
- [x] **Q5.** Tool 4 — Evidence Packet & Claim Letter Builder (`/claim-letter-builder/`) — **shipped 2026-07-19.**
- [x] **Q6.** Tool 1 — Diminished Value Baseline & Market Evidence Worksheet (`/diminished-value-calculator/`) — **shipped 2026-07-22.**
- [ ] **Q7.** Tool 5 — Next-Step Decision Guide (folded into `/check-my-offer/` flow)
- [ ] **Q8.** `/check-my-offer/` flagship hub tying the audit modules together

### Phase 4 — P0 foundational guides/templates (six guides + four templates from doc §13.1)
- [ ] **Q9.** Guide: How to Dispute a Total-Loss Valuation
- [ ] **Q10.** Guide: How to Read a CCC Total-Loss Valuation Report
- [ ] **Q11.** Guide: Total-Loss Comparable Vehicles
- [ ] **Q12.** Guide: How to File a Diminished-Value Claim
- [ ] **Q13.** Guide: First-Party vs. Third-Party Diminished Value
- [ ] **Q14.** Guide: The 17c Diminished-Value Formula, Explained (correct history — see Phase-0 memo)
- [ ] **Q15.** Template: Total-Loss Valuation Dispute Letter
- [ ] **Q16.** Template: Request for Complete Valuation Report
- [ ] **Q17.** Template: Correct Vehicle Details Letter
- [ ] **Q18.** Template: Diminished-Value Claim Letter
- [ ] **Q19.** Trust/legal page pass: `/about/`, `/authors/`, `/editorial-policy/`, `/source-policy/`, `/corrections/`, `/advertising-affiliate-disclosure/`, `/accessibility/` (privacy/terms/disclaimer/contact already exist and need updating for the new topic, not recreating)

### Phase 4 P1 (post-launch-set, weeks 5–8 per doc calendar)
- [ ] **Q20.** Guide: Total-Loss Sales Tax / Title / Registration Fees
- [ ] **Q21.** Guide: ACV vs. Replacement Cost
- [ ] **Q22.** Guide: Totaled Car Loan Payoff & GAP Insurance
- [ ] **Q23.** Guide: Owner-Retained Salvage (Keeping a Totaled Car)
- [ ] **Q24.** Guide: Appraisal Clause in Auto Insurance
- [ ] **Q25.** Template/Checklist: Insurance Claim Evidence Checklist

### Phase 5 — state pilot (only after real per-state source research; do NOT template-swap)
- [ ] **Q26.** Real research pass + source matrix for Georgia (first, given £ Mabry/17c relevance) — publish only if a full source record per doc §6 exists. Otherwise publish as `noindex` draft and say so.
- [ ] Remaining candidate states (CA, TX, FL, NC, NY, IL) — research individually, one at a time, never templated.

This queue will be re-ordered only with an explicit user instruction. Default
trigger words ("next", "continue", "next page") always mean: take the top
unchecked item.

---

## 4. Session history

### Session 1 — 2026-07-18
- Read master prompt (md + docx) in full.
- Audited existing live site: personal-injury settlement hub (4 calculators,
  17 articles, trust pages, cookie consent + shared css/js).
- Asked and got answers on the 3 blocking decisions (D1–D4 above).
- Verified 17c/Mabry legal history via web search (Justia, Georgia OCI
  directive commentary, 11th Circuit filings) — see `PHASE-0-RESEARCH.md`.
- Created this file and `PHASE-0-RESEARCH.md`.
- **Nothing shipped to the live site yet.** Next session starts Q1 (nav +
  homepage rebuild).

### Session 2 — 2026-07-19
- User asked for: (a) a fresh look at existing-vs-new topics for competition/
  demand and domain suitability, (b) removal of all duplicate/soon-to-be-
  duplicate pages to start fresh.
- Ran live SERP gap-checks on the doc's top-priority keyword clusters
  (diminished value calculator, total-loss settlement calculator, CCC report
  guide, total-loss dispute) and confirmed the domain has zero Google index
  footprint — see `PHASE-0-RESEARCH.md` §7.
- Deleted `calculators/` and `articles/` entirely (required
  `allow_cowork_file_delete` approval — connected-folder deletes are blocked
  by default). Rewrote all 7 remaining root pages for the new product.
  Rebuilt `sitemap.xml`. Added scenario-card CSS. See D8.
- Site is now a clean, honest, no-dead-link shell: homepage explains the
  pivot and lists what's coming, but no tool is live yet.
- Next session starts **Q3 — Tool 3: Settlement Check Breakdown** (first
  core tool per the build order).

### Session 3 — 2026-07-19 (same day, continued)
- Built and shipped **Tool 3: Settlement Check Breakdown** at
  `/settlement-check-breakdown/` — integer-cent calculation engine in
  `js/settlement-breakdown.js` (dual browser/Node export so the math can be
  sanity-tested with `node -e "require('./js/settlement-breakdown.js')..."`
  before shipping — 8 scenarios run and passed 2026-07-19, covering: no
  loan, first-party deductible, loan payoff less than settlement, loan
  payoff exceeding settlement (GAP scenario), salvage retention, stated-
  check mismatch detection, deductible-exceeds-ACV flag, and `toCents`
  input validation).
- Page includes: full visible arithmetic waterfall, plain-language
  definitions (ACV/deductible/lienholder/GAP/salvage), worked example,
  3-question FAQ (JSON-LD matches visible text), BreadcrumbList schema,
  full on-page SEO per `CONTENT-STANDARDS.md`.
- Added "Settlement Breakdown" to primary nav on every page. Updated
  homepage's "totaled" scenario card and "what's coming" list to link the
  live tool. Added the URL to `sitemap.xml`. Deleted the now-fully-unused
  `js/calculator.js` (old PI multiplier/workers-comp logic — dead code
  after the pivot).
- Ran tag-balance + single-H1 sanity checks across all 8 HTML files —
  clean.
- **Nothing deployed live to the actual domain yet** — this is committed
  in the local repo only. Whether it's already connected to a host (GitHub
  Pages / Netlify / other) and whether it needs a push to go live is
  something only the user can confirm; asked in this session's reply.
- Next session starts **Q4 — Tool 2: Total-Loss / ACV Offer Audit**
  (flagship tool).

### Session 4 — 2026-07-19 (same day, continued)
- Built and shipped **Tool 2: Total-Loss / ACV Offer Audit** (flagship) at
  `/total-loss-offer-calculator/` — implements Modules A-C from master
  prompt §3.3: claim basics, a 10-field valuation-report mismatch
  checklist (correct/incorrect/unknown/not-shown → "possible mismatch to
  verify," never an accusation), insurer comps (up to 4) vs. user comps
  (up to 6, meeting the doc's "at least six" for the user's own set), and
  an internal-consistency engine: mean/median/range for each comp set, a
  disclosed 20%-from-median outlier flag, ACV-vs-insurer's-own-range check,
  and ACV-vs-user-comp-median gap.
- Calculation engine (`js/total-loss-audit.js`) built with the same
  dual browser/Node pattern as Tool 3, sanity-tested via `node -e` before
  shipping: mismatch evaluation, comp stats (mean/median/min/max),
  outlier detection + before/after exclusion, empty-comps handling
  (returns null, no crash), and ACV-outside-range / ACV-vs-user-gap
  flagging — all verified correct.
- **Scoping note, logged honestly rather than silently skipped:** the
  master prompt's Module C also mentions a "weighted evidence-quality
  score" based on completeness/similarity. This build implements
  mean/median/range/outlier handling (which is what §4.2's own Tool 2
  requirements list explicitly asks for) but not a separate numeric
  quality score. Candidate for a later polish pass if wanted — not
  currently on the queue below, add it back in if desired.
- Added new nav item ("Total-Loss Offer Audit") across all 9 pages.
  Updated homepage: totaled-car scenario card and "what's coming" list
  now link the live tool. Cross-linked the two live tools to each other
  (no orphan pages). Added the URL to `sitemap.xml`. Ran tag-balance,
  single-H1, and nav-consistency checks across all 9 HTML files — clean.
- Still not deployed to a live host — repo-only. Not yet resolved: how
  this site is actually hosted (asked in session 3, not yet answered) —
  needed before Search Console / real indexing can happen.
- Next session starts **Q5 — Tool 4: Evidence Packet & Claim Letter
  Builder.**

### Session 5 — 2026-07-19 (same day, continued)
- Confirmed with user: repo is directly connected to GitHub (this chat's
  file edits land in the real local repo), and Google Search Console is
  already attached/indexing. Committed all Session 3+4 work with a real
  message (`729310a`) — **note: `git push` fails from this sandbox (no
  stored credentials)**; the user's own sync/push process needs to run
  for anything to actually go live and get crawled. This applies to every
  session's work, not just this one — flag it each time until confirmed
  otherwise.
- Built and shipped **Tool 4: Evidence Packet & Claim Letter Builder** at
  `/claim-letter-builder/` — 6 letter modes (valuation-report request,
  factual-correction request, comparable-vehicle reconsideration request,
  diminished-value claim notice, adjustment-explanation request,
  appraisal-clause request). The 7th mode in the doc — state insurance
  department complaint — is intentionally NOT built, per the doc's own
  rule that it requires per-state workflow verification first (none
  exists yet). All templates are factual/calm, no threats, fake
  deadlines, legal citations, or "bad faith" language; blank fields
  become bracket placeholders, never "undefined" text.
- Also includes a static evidence checklist (9 items) and local
  print/PDF export via an isolated `#print-letter` print-CSS block (no
  external PDF library needed) — letter output lives in a `<textarea>`
  so there's no HTML-injection surface from user text.
- Letter-generation engine (`js/claim-letter-builder.js`) built with the
  same dual browser/Node pattern as Tools 2 and 3; sanity-tested via
  `node -e`: all 6 modes produce non-empty text with correct bracket
  placeholders when fields are blank, and correct substitution when
  filled (verified with a filled `factual-correction` example) — no
  "undefined" leakage in any mode.
- All 3 live tools now cross-link each other in "More Tools" sections.
  Nav, homepage, and `sitemap.xml` updated. Ran tag-balance, single-H1,
  and **exact nav-link-set** consistency checks across all 10 HTML files
  — confirmed byte-identical nav on every page, zero tag mismatches.
- Next session starts **Q6 — Tool 1: Diminished-Value Baseline & Market
  Evidence Worksheet** (the 17c-baseline tool — must use the verified
  17c/Mabry framing from `PHASE-0-RESEARCH.md` §2, never presented as
  "true diminished value").

### Session 6 — 2026-07-22
- Built and shipped **Tool 1: Diminished-Value Baseline & Market Evidence
  Worksheet** at `/diminished-value-calculator/` — the 17c-formula tool.
- Before hardcoding the multiplier table, ran a live web search to verify
  the commonly-published 17c structure (10% base-value cap × damage-
  severity multiplier 0.00–1.00 × mileage multiplier stepping 1.00→0.00
  in ~20k-mile bands) against multiple independent secondary sources
  (diminishedvalueofgeorgia.com, supercarclaims.com, snapclaim.com,
  cfm-calculator.com) — all describe the same structure, and one source's
  own worked example ($25,000 value, moderate damage, 45,000 miles →
  $750) was used as a Node sanity-test case and passed exactly.
- Calculation engine (`js/diminished-value-baseline.js`) built with the
  same dual browser/Node pattern as Tools 2–4, versioned config
  (`DV_CONFIG`, version 1.0, reviewed July 2026) with an explicit source
  note distinguishing this from "true diminished value" and citing the
  2002 Muscogee County settlement-order origin + Georgia OCI Directive
  08-P&C-2. Sanity-tested via `node -e` across 27 assertions: published-
  example replication, zero/negative/non-numeric value rejection, extreme
  mileage and extreme value rejection (implausible-input ceiling), every
  mileage-band boundary, severe-damage-at-low-mileage (full 10% cap),
  cosmetic-only damage (zero result regardless of mileage), empty/garbage
  market-comps handling (returns null, no crash), and multi-comp
  mean/median/range/gap computation — all passed.
- **Scoping decision, logged honestly:** the master prompt's Tool 1 input
  list includes structural/frame involvement, airbag deployment, panel
  replacement count, prior damage history, repairs-complete flag, and
  state/claim relationship. None of these has a verified numeric weight
  in the public 17c formula (only damage category and mileage do), so
  rather than inventing undisclosed additional multipliers, these fields
  are collected and echoed back in a plain "Claim Context Summary" panel
  (for the user's own records and for reuse in the Claim Letter Builder)
  and are NOT run through the arithmetic. This mirrors the Tool 2 scoping
  precedent (weighted evidence-quality score not implemented) — a
  disclosed, defensible choice rather than a silent omission.
- Page has two clearly separate result panels (17c baseline; market
  evidence worksheet built from up to 4 clean-history + 4 accident-
  history user comps) plus an explicit "why we never average these"
  note, per the doc's hard requirement. Full on-page SEO (title/meta/
  canonical/OG/Twitter/BreadcrumbList+FAQPage JSON-LD), a corrected
  17c/Mabry history section (same framing as `disclaimer.html`), and a
  "Calculation logic version 1.0 — last reviewed July 2026" footer citing
  the source basis.
- Added "DV Baseline" to primary nav on all 11 HTML files (the 10
  pre-existing pages plus the new page). Updated homepage's repaired-
  vehicle scenario card and "what's coming next" list to link the live
  tool. Cross-linked all three other live tools' "More Tools" sections to
  the new tool (and vice versa) — no orphan pages. Added the URL to
  `sitemap.xml`.
- Ran tag-balance, single-H1, duplicate-id, and exact-nav-link-set
  consistency checks across all 11 HTML files via a Python script — zero
  mismatches, byte-identical nav confirmed on every page.
- Still git-push-from-this-sandbox caveat applies (see Session 5) — work
  is committed locally; the user's own sync process publishes it.
- **All 4 of the 5 originally-scoped core tools are now live** (Tool 5 —
  Next-Step Decision Guide — is intentionally folded into the not-yet-
  built `/check-my-offer/` hub, Q7/Q8). Next session starts **Q7/Q8 —
  the `/check-my-offer/` flagship hub** tying all four audit tools
  together with a next-step decision guide, OR, if the user wants content
  instead of another tool, **Q9** (first P0 guide: How to Dispute a
  Total-Loss Valuation). Default trigger words pull Q7/Q8 per queue
  order unless redirected.

---

## 5. Standing reminders (do not relitigate every session)

- No email/account/VIN required to get a result (doc §9.2, §10.2).
- No claim data to server/analytics; local-only by default.
- Never say "you are owed," "lowball," "illegal," "guaranteed," etc. (§2.3).
- 17c = "17c insurer-style baseline," never "true diminished value."
- Money math in integer cents internally, USD formatting at display only.
- No fabricated stats, partners, reviews, or "verified" state pages without
  a real source record.
- Ads: none enabled; no `ads.txt`; no ad code changes without explicit
  instruction that approval has occurred.

---

## 6. v2 (Astro rebuild) session log

Dated, append-only log of what ran and was verified each session on the
Astro rebuild. Architecture/decisions/queue live in `ASTRO-REBUILD-PLAN.md`;
this section is just "what happened, when."

- **2026-07-29 — Phase 2 verification + Phase 4 (trust pages) + integrity fixes.**
  Found three of four calculators (Total-Loss Offer Audit, Diminished Value
  Baseline, Claim Letter Builder), their test files, and the
  `/calculators/`+`/check-my-offer/` pages already present in the working
  tree, uncommitted and unverified. Audited all of it, then ran
  `npm run typecheck` / `npm run test` / `npm run build`:
  - Found and fixed 4 real TypeScript errors (RadioNodeList casts in
    `settlement-check-breakdown/index.astro`'s client script; a type-
    narrowing gap in `total-loss-audit.test.ts`).
  - Fixed a local sandbox-only Rollup optional-dependency install bug
    (npm/cli#4828); confirmed the fix does not affect the x64 GitHub
    Actions runner (see ASTRO-REBUILD-PLAN.md R7 for the `@astrojs/sitemap`
    version-pin story, a related but separate compatibility issue).
  - Added `@astrojs/check` + a `typecheck` script, wired into
    `.github/workflows/deploy.yml` so CI now fails on type errors, not just
    test/build failures.
  - Added the `@astrojs/sitemap` integration (pinned to `3.2.1` — see R7).
    Verified `dist/sitemap-0.xml` lists exactly the 18 real complete pages,
    no 404, no incomplete route.
  - **Found a real defect:** the header nav, footer, and several pages'
    body copy already linked 14 trust/guide routes that didn't exist yet —
    a direct violation of "never add a route to nav until complete." Fixed
    by trimming nav/footer to real routes, then building all 11 trust/
    policy pages (Phase 4, pulled forward) so the links could be honestly
    restored. Removed the homepage's guide-card section and the header's
    Guides submenu until Phase 5 guides actually exist (see
    ASTRO-REBUILD-PLAN.md R8 for the full account).
  - Result: 74/74 Vitest cases pass, 0 typecheck errors across 41 files,
    clean production build (19 static pages), zero dangling internal
    links (checked by diffing every `href="/.../"` in `src/` against the
    set of routes actually built).
  - Files: see the commit this entry accompanies for the exact list.
- **2026-07-29 — Phase 3 (redirect + retired-content stubs).** Verified the
  exact historical filenames of the retired personal-injury content via
  `git log --diff-filter=D --name-only --all` (4 calculators + 17
  `/articles/` pages — the earlier reconstructed-from-memory table in
  `ASTRO-REBUILD-PLAN.md` had two mistakes: a nonexistent filename guess,
  and it missed the entire `/articles/` section). Discovered that Astro's
  own page routing (`trailingSlash: "always"` + `build.format: "directory"`)
  cannot produce a literal flat `.html` file at these legacy paths — tested
  directly. Built `astro/scripts/legacy-paths.mjs` (manifest) and
  `astro/scripts/generate-legacy-stubs.mjs` (writes real static stub files
  straight into `public/`, wired in as an npm `prebuild` step) instead.
  Verified via a real build: all 9 redirect stubs (meta-refresh + canonical)
  and 21 retired-content stubs (noindex + "this content has been retired"
  message linking to the 4 live tools) land at their exact old byte-for-byte
  paths in `dist/`, none leak into the sitemap, and the site's 18 real pages
  are unaffected. See ASTRO-REBUILD-PLAN.md R9 for the full account.

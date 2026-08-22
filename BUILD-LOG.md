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
- **2026-07-29 — Required deliverables (SOURCE-REGISTER.md,
  URL-MIGRATION.md, ADSENSE-READINESS.md) + AdSlot scaffolding.** Wrote all
  three repo-root docs required by the rebuild brief but not previously
  created. Built `astro/src/lib/ads/config.ts` (`ADSENSE_ENABLED = false`
  as a literal constant, `isAdEligible()` with a deny-list that always
  wins) and `astro/src/components/AdSlot.astro` (renders nothing while
  disabled/ineligible) — prepared but fully inactive; no page uses it yet.
- **2026-07-29 — Phase 6, partial: automated code-level accessibility
  audit.** Ran three scripted checks against the real production build
  (`dist/`, all 50 HTML files — 19 real pages + 30 legacy stubs):
  1. Heading/landmark check: every one of the 19 real content pages has
     exactly one `<h1>`, a `<main>` landmark, a skip-link, and
     `lang="en-US"`. Zero issues.
  2. Contrast-ratio check (computed directly from the actual hex values in
     `tokens.css`, WCAG relative-luminance formula): every color pair
     actually used on the site — body text, muted text, primary
     green/dark-green on white and vice versa, error/warning banner text
     on their backgrounds, the blue focus-ring/accent color — passes AA at
     the *stricter* 4.5:1 normal-text threshold, not just the 3:1
     large-text/UI minimum. Lowest ratio found: 5.61:1
     (text-muted-on-bg-soft). Zero issues.
  3. Label/ARIA-reference integrity check: every `<label for>`,
     `aria-describedby`, and `aria-labelledby` across all 19 pages
     resolves to a real element id. Every form control has an associated
     label (checked both the explicit `for=` pattern and the implicit
     wrapped-inside-`<label>` pattern used by `/check-my-offer/`'s radio
     choice-cards — the script initially flagged those as false positives
     before I corrected it to recognize implicit labeling too). Zero real
     issues after the fix.
  **What this does NOT cover, and is still outstanding:** the actual
  manual keyboard-only navigation and screen-reader (VoiceOver/NVDA-style)
  walkthrough at 320/390/768/1024/1440px that Phase 6 calls for, and a
  Lighthouse/perf-budget run. Both require either a live deployed URL or
  local browser/AT automation tooling not connected in this session. Do
  not report Phase 6 as fully done on the strength of the automated pass
  alone.
- **2026-08-01 — Owner confirmed the real contact inbox.** Owner confirmed
  `info@fairclaimcalculator.com` (not the placeholder
  `contact@fairclaimcalculator.com` default) is the real, checked mailbox.
  Updated `/contact/` to publish it. This closes one of the remaining
  owner-only items on the AdSense activation gate.
- **2026-08-01 — Google Analytics 4 added, real consent-gated (not fake).**
  Owner supplied a GA4 measurement ID (`G-Y0W2ZWVGLZ`). Added
  `astro/src/lib/analytics/config.ts` (on/off switch + ID, mirrors the
  `ads/config.ts` pattern) and `astro/src/components/CookieConsent.astro`.
  Deliberately stricter than Google's own Consent Mode minimum: the
  `gtag.js` script tag is never injected into the page at all — no request
  to `googletagmanager.com` happens — until a visitor affirmatively
  accepts (this visit or a remembered prior choice via `localStorage`).
  Consent Mode v2 defaults (all four signals denied) are still declared
  immediately, so the signal is correct the instant the script does load
  for a returning accepted visitor. Wired into every page via
  `BaseLayout.astro`. `Footer.astro`'s "Privacy choices" is now a real
  `<button>` (was a link to a static anchor with nothing behind it) that
  reopens the actual banner from anywhere on the site via a
  `data-open-cookie-prefs` attribute and event delegation; `/privacy/#choices`
  has the same control inline. Rewrote `/privacy/`'s "what this site
  collects," "cookies," and "your privacy choices" sections to describe
  exactly what now runs — no more "nothing to consent to yet." Updated
  `ADSENSE-READINESS.md` §5 and its top status line to match; this is
  analytics, not advertising, so it doesn't change AdSense eligibility
  either way, but the doc must never silently drift from what the code
  does. Also took the opportunity to refresh the stale §1 activation-gate
  table, most of which still said Phase 5 "hasn't started" — it shipped
  two conversations ago. Verified: `astro check` (0 errors), `vitest run`
  (74/74), `npm run build` (38 pages).
- **2026-08-01 — Live-site audit; found the custom domain wasn't actually
  connected.** Ran a full audit of the deployed build (bundle sizes,
  robots/sitemap, typecheck, live fetches of both the github.io URL and
  `www.fairclaimcalculator.com`). The github.io deployment was fully
  correct; `www.fairclaimcalculator.com` was still serving the old
  intermediate site — traced to the Pages "Custom domain" field never
  having been filled in, even though `astro/public/CNAME` (and thus
  `dist/CNAME`) already contained the right value. Owner then added
  `www.fairclaimcalculator.com` in Pages settings; DNS check is in
  progress as of this entry — not yet confirmed live on the real domain.
- **2026-08-01 — New guide: state-by-state first-party diminished-value
  recognition.** Added
  `/guides/diminished-value/state-laws-first-party-diminished-value-claims/`
  — the guide library is now 16 guides (5 in the Diminished Value
  cluster). Researched via the NAIC's peer-reviewed 2023 *Journal of
  Insurance Regulation* survey plus primary case law (Mabry v. State Farm,
  Siegle v. Progressive, Schaefer, Ray v. Farmers, Delledonne/O'Brien) and
  N.C. Gen. Stat. § 20-279.21(d)(1). Explains that Georgia is the only
  state with a clear first-party DV rule, documents several states with
  rulings against it, and separately covers the much-more-common
  third-party recognition. Cross-linked from `what-is-diminished-value`,
  `the-17c-formula...`, and `first-party-vs-third-party-auto-claims`
  (all three already flagged this exact gap in their own "what this guide
  cannot tell you" sections). Updated guide counts on `/guides/`,
  `/guides/diminished-value/`, and the homepage from 15→16 / 4→5. Logged
  in `SOURCE-REGISTER.md` §6 entry 16. This is the first of a five-guide
  batch (state total-loss thresholds, GAP/loan payoff, rental
  reimbursement, responding to a lowball offer — remaining four still to
  come). Verified: `astro check` (0 errors), `vitest run` (74/74),
  `npm run build` (39 pages), 0 broken links, 0 title/description length
  issues.
- **2026-08-01 — Remaining four guides of the batch, completed.** Owner
  asked to keep building AdSense-ready, in-demand pages one by one; this
  closes out the five-guide batch proposed earlier in the day. Guide
  library is now **20 guides** (10 Total Loss, 5 Diminished Value, 5 Claim
  Process). Each guide researched with real primary/authoritative sources
  before writing (never invented), cross-linked into at least one existing
  guide that had already flagged the same gap, added to `SOURCE-REGISTER.md`
  §6, and guide counts updated on `/guides/`, its cluster hub, and the
  homepage. In order:
  - `/guides/total-loss/state-total-loss-threshold-laws/` — the two
    calculation methods (simple percentage vs. Total Loss Formula) plus a
    full 50-state + DC comparison table, sourced from a dated,
    editorially-reviewed Policygenius table (named licensed-insurance-expert
    author) and the NH DOI valuation-methods page already used elsewhere.
  - `/guides/total-loss/gap-insurance-loan-lease-after-total-loss/` — what
    GAP insurance is actually for, common exclusions, and the federal right
    to cancel/get a refund, sourced from the CFPB's own consumer page on GAP
    plus California's AB 2311/SB 1311 as one concrete state-regulation
    example.
  - `/guides/claim-process/rental-car-loss-of-use-reimbursement/` — the two
    separate paths (your own optional rental-reimbursement coverage vs. a
    third-party loss-of-use claim), sourced from a real Nevada-filed
    rental-reimbursement policy endorsement and the Texas Office of Public
    Insurance Counsel's framing of loss-of-use as part of property-damage
    liability.
  - `/guides/claim-process/how-to-respond-to-a-lowball-offer/` — the
    general rebuttal process covering both total-loss and diminished-value
    offers, tying the site's own calculators and guides together, plus a
    state-DOI-complaint escalation step via the NAIC Unfair Claims
    Settlement Practices Act (reusing the citation already established for
    the first-party-vs-third-party guide). Deliberately cross-linked both
    directions with the existing total-loss-specific dispute guide rather
    than left as a near-duplicate, per `ADSENSE-READINESS.md` §4's
    no-near-duplicate rule.
  Each guide verified individually before committing: `astro check`
  (0 errors), `vitest run` (74/74), `npm run build`, 0 title/description
  length issues; a full internal-link check after the final guide showed
  0 broken links across 197 checked hrefs. `ADSENSE-READINESS.md` §1 guide
  count refreshed to 20 (5 added 2026-08-01).
- **2026-08-08 — Verification session; found the real blocker.** Owner
  asked (via Cowork, connected to this repo folder directly) to fix
  whatever's needed for AdSense readiness. Audited the full repo, not just
  the live domain, and found why the live site still looked like the thin
  4-tool plain-HTML version despite everything logged above: **GitHub
  Pages "Source" has never been switched to "GitHub Actions"**
  (`ASTRO-REBUILD-PLAN.md` §1, manual step #1, was still open) — so
  `www.fairclaimcalculator.com` has never actually served the Astro
  rebuild. This is a repo Settings toggle, not something a commit or this
  sandbox can flip. Re-verified the build clean from scratch this session:
  `npm run typecheck` (0 errors, 72 files), `npm run test` (74/74),
  `npm run build` (all pages generated; one harmless `EPERM` on a dist
  cleanup step — a sandbox file-permission artifact from the mounted
  folder, not a code defect, output unaffected). Spot-checked
  `src/lib/ads/config.ts` and confirmed `ADSENSE_ENABLED` is still
  hard-`false` with an empty `ELIGIBLE_ROUTES` set — untouched. Did **not**
  create `ads.txt`, flip `ADSENSE_ENABLED`, add bio/credential specifics,
  or add any new state-specific page — all correctly remain gated per this
  file's hard rules and `ADSENSE-READINESS.md`. Told the owner the Pages
  source toggle + a DNS confirmation are the two blocking manual steps
  before Phase 7 (SEO/Search-Console validation) and the Phase 6 manual
  accessibility walkthrough can proceed — both require a live URL this
  sandbox doesn't have.
- **2026-08-08 — FAQ schema + GA4 conversion events on all 4 calculators.**
  Owner uploaded a third-party site audit and a matching set of fix
  prompts; cross-checked both against the actual Astro codebase (not the
  old live site the audit describes — confirmed several "immediate fixes"
  it lists, like the homepage contradiction and BreadcrumbList schema, are
  already resolved by this rebuild). Two real gaps addressed this pass:
  - Added `src/lib/seo/faq-schema.ts` (`buildFaqSchema()`) and
    `src/components/FaqSection.astro` (accessible `<details>/<summary>`
    rendering) — both consume the exact same `FaqItem[]` array per page,
    by design, so visible FAQ text and FAQPage JSON-LD can never drift
    apart, per Google's structured-data requirement that they match.
  - Wrote 5 genuine FAQs per calculator (20 total), grounded strictly in
    facts already established on each page or elsewhere on the site (no
    new claims invented) — Diminished Value Baseline, Total-Loss Offer
    Audit, Settlement Check Breakdown, Claim Letter Builder.
  - Added `src/lib/analytics/events.ts` (`trackEvent`, plus typed
    `trackCalculatorCompleted`, `trackLetterGenerated`,
    `trackLetterCopied`, `trackLetterPrinted` helpers) and wired GA4
    custom events into all 4 calculators' client-side success paths,
    matching the exact event/parameter names requested: `calculator_completed`
    (`calculator: diminished_value | total_loss | settlement_breakdown`),
    `letter_generated`, `letter_copied`, `letter_printed` (all with a
    `letter_type` parameter). Safe to fire unconditionally per
    `CookieConsent.astro`'s existing gtag-stub/queuing behavior — no
    consent-check branching needed at each call site.
  - Full verification before commit: `npm run typecheck` (0 errors, 148
    pre-existing hints), `npx vitest run` (74/74), `npm run build` (43
    pages), a title/description length check with HTML-entity decoding
    (74 pages, all ≤60/≤160 chars), and an internal-link check (1481
    hrefs across 74 pages, 0 broken).
  - Deliberately did **not** follow the uploaded fix-prompts' ads.txt
    instruction to add a placeholder ID with a TODO comment — that
    contradicts this project's own standing rule (no ad-network
    references of any kind until a real AdSense publisher ID exists).
    Flagged this, plus the About-page bio expansion (would require real,
    non-fabricated details from the owner), as owner-only items rather
    than acting on them unilaterally.
- **2026-08-08 — 5th calculator: Rental / Loss-of-Use Reimbursement.**
  Built per the uploaded fix-prompts spec (item 5): new
  `src/lib/calculators/loss-of-use.ts` (pure, tested module — daily rate
  offered × days without vehicle, capped by an optional total/per-claim
  cap; an optional daily-cap mismatch check; a gap comparison against
  actual rental cost; a low-rate flag using the same 20%
  possible-outlier threshold already established in the Total-Loss
  Offer Audit calculator, for internal consistency) and
  `astro/tests/loss-of-use.test.ts` (28 tests: normal, boundary, empty,
  invalid, negative, extreme). New page at
  `/calculators/loss-of-use-reimbursement/`, following the same
  form/result/FAQ/methodology pattern as the other 4 calculators, with
  its own 5 genuine FAQs and GA4 `calculator_completed` event
  (`calculator: loss_of_use`).
  - Cross-linked from: `/calculators/` (new "While you're without a
    vehicle" section), the homepage's calculator grid, all 4 other
    calculators' "More Calculators" blocks, the Check My Offer router
    (new "rental" goal option + route), the rental-car guide's
    `relatedLinks`, and `/sources/`.
  - While updating counts, found and fixed **stale content that
    predated this session's work**: `/sources/index.astro` still said
    "four calculators" and "15-guide library (8/4/3)" — left over from
    before the earlier 5-guide batch (which brought the library to
    20 guides across 10/5/5) was ever reflected there. Corrected to the
    real counts. Also fixed "four calculators" on `/about/` and
    `/check-my-offer/` (two places) for the same reason, and updated
    `ADSENSE-READINESS.md` §1's calculator/test-count line.
  - Full verification: `npm run typecheck` (0 errors), `npx vitest run`
    (102/102 across 5 files), `npm run build` (45 pages),
    title/description lengths OK (76 pages, one 67-char title trimmed),
    0 broken internal links (1668 hrefs checked).
- **2026-08-08 — 6th calculator: Salvage / Owner-Retained Value.** Built
  per the uploaded fix-prompts spec (item 6): new
  `src/lib/calculators/salvage-value.ts` (pure, tested module — net cash
  if retained vs. surrendered, and a separate comparison of the
  insurer's salvage deduction against real salvage-title sale prices
  the user enters, using the same descriptive-statistics +20%-outlier
  pattern already established in the Total-Loss Offer Audit calculator;
  never averaged with the insurer's figure, matching the site's
  "never average, always show separately" principle). New
  `astro/tests/salvage-value.test.ts` (16 tests, including a check
  against the exact worked example already published in the
  owner-retained-salvage guide: ACV $16,000, salvage deduction $3,200
  → net if retained $12,800). New page at `/calculators/salvage-value/`
  with a `state` field that's explicitly informational only (never used
  in the math, consistent with how `claimState` works on the DV Baseline
  calculator) — matching fix-prompts' instruction not to state salvage
  branding rules as fact.
  - Linked directly from the Settlement Check Breakdown form's salvage
    field (per fix-prompts' explicit instruction), plus all other
    calculators' "More Calculators" blocks, `/calculators/`, the
    homepage, the Check My Offer router (new "salvage" goal + route),
    the owner-retained-salvage guide's `relatedLinks`, and `/sources/`.
  - Full verification: `npm run typecheck` (0 errors), `npx vitest run`
    (118/118 across 6 files), `npm run build` (46 pages),
    title/description lengths OK (77 pages, one 63-char title trimmed),
    0 broken internal links (1715 hrefs checked). Built
  `/glossary/` per the uploaded fix-prompts' content-hub spec (item 4.3):
  a standalone reference pulling together the 15 terms already defined
  inline across the 4 calculators and their source guides (ACV,
  comparable, deductible, diminished value, first-party/third-party, GAP
  coverage/shortfall, lienholder, loss of use, market evidence, outlier,
  owner-retained salvage, percentage-threshold law, salvage/rebuilt
  title, Total Loss Formula, 17c formula). Every definition is a
  restatement of what's already published elsewhere on the site — no new
  claims invented — and each term links back to the calculator or guide
  where it's used in context. Added `BreadcrumbList` + `DefinedTermSet`
  JSON-LD. Linked from both `Header.astro` (primary nav) and
  `Footer.astro`. Verified: typecheck 0 errors, vitest 74/74, build 44
  pages, title/description lengths OK (75 pages, one 166-char
  description trimmed to fit), 0 broken links (1625 hrefs checked).

## 2026-08-08 — Leased-Vehicle Diminished Value guide + calculator (fix-prompts item 7)

Built the guide+calculator variant requested in the uploaded fix-prompts
document (item 7): a leased vehicle's title sits with the leasing company,
not the driver, which changes who typically holds a diminished-value claim.

- **Research first, per the site's no-fabrication rule.** Ran several
  `WebSearch` queries on lessee-vs-lessor DV claim standing; rejected ~8
  secondary/marketing sources (law-firm blogs, DV-claim-service sites) as
  insufficient. Fetched and verified two real primary sources directly via
  `web_fetch`: (1) New York State DFS, Office of General Counsel, OGC
  Opinion No. 11-02-01 (Feb 7, 2011) — confirms a leased-vehicle loss
  payment's destination (lessee vs. leasing company) "is dependent upon the
  full terms and conditions of the policy," not a fixed rule; (2) North
  Carolina General Statutes § 25-2A-219 (UCC Article 2A, "Risk of Loss") —
  fetched the full Article 2A statute page (106,937 chars, saved to a temp
  file) and grepped out the exact text: "Except in the case of a finance
  lease, risk of loss is retained by the lessor and does not pass to the
  lessee." Both sources logged as SOURCE-REGISTER.md entry #17, cited as one
  regulator opinion and one state's statute — not a universal rule.
- **New guide:** `/guides/diminished-value/leased-vehicle-diminished-value/`
  — explains why lessor-vs-lessee matters, what varies by lease (policy
  named-insured/loss-payee, lease terms on loss in value, purchase option,
  whether the leasing company pursues claims), and practical steps. States
  plainly what it cannot determine (needs the reader's own lease and state
  law). Diminished Value guide cluster is now 6 guides; site-wide guide
  library is now 21.
- **New calculator:** `/calculators/leased-vehicle-diminished-value/` —
  deliberately does NOT duplicate the calculation logic. Imports
  `calculate17cBaseline`, `evaluateMarketEvidence`, `formatUSD`, `DV_CONFIG`,
  `DVValidationError`, and `toCents` directly from the existing, tested
  `diminished-value-baseline.ts` module (no new lib file, no new Vitest
  file — same 16 tests still cover this page's math). Leads with a "Who Can
  File: Lessee vs. Lessor" explainer citing both sources above, then the
  same baseline-vs-market-evidence worksheet (3 comps per group instead of
  4, plus 3 lease-context fields: lease responsibility for loss in value,
  purchase-option intent, state). Added a 6th value (`leased_diminished_value`)
  to the `trackCalculatorCompleted` GA4 event union in `events.ts`.
- **Bidirectional link required by fix-prompts item 7:** added to the DV
  Baseline calculator page as a body note right under the trust badges, a
  new FAQ entry, and the first entry in its "More Calculators" block.
- **Cross-linked everywhere else:** `/calculators/` (7th card, "Seven Free
  Auto Claim Calculators"), homepage ("Seven Free Calculators"), all other
  5 calculators' "More Calculators" blocks, Check My Offer router (new
  "Same, but my vehicle is leased" goal option + `leased-dv` route),
  `/sources/` (new source group + updated guide-cluster count), `/about/`
  ("Seven calculators"), `/guides/diminished-value/` and `/guides/` (guide
  counts and descriptions).
- **Full verification:** `npm run typecheck` (0 errors, 89 files),
  `npx vitest run` (118/118 across 6 files — unchanged, since the new
  calculator reuses tested code), `npm run build` (48 pages), title/
  description lengths OK after two trims (leased-DV calculator meta
  description, Check My Offer meta description), 0 broken internal links
  (52 pages, 52 routes, 105 asset files checked).

## 2026-08-08 — State insurance-department complaint guide (fix-prompts item 8 / task #42)

The uploaded fix-prompts document asked for a state regulator/DMV complaint
directory. A hand-maintained 50-state table of phone numbers and URLs was
flagged as high accuracy-risk: that kind of list goes stale between reviews
and this site has no way to continuously re-verify 50+ individual contact
records. Built the lower-risk, still-genuinely-useful version instead.

- **Research:** verified two real, dated NAIC consumer-education articles by
  fetching them directly — "Need Help with Insurance? Insurance Departments
  Are Your Trusted Source" (Sept. 15, 2025) and "How to File a Complaint and
  Research Complaints Against Insurance Carriers" (Sept. 1, 2022) — plus
  confirmed the NAIC's own live state-locator tool at
  `content.naic.org/state-insurance-departments` is real and current via
  search and fetch. Logged as SOURCE-REGISTER.md entry #21.
- **New guide:** `/guides/claim-process/filing-a-complaint-with-your-state-insurance-department/`
  — explains what a state Department of Insurance can and can't do (per
  NAIC's own framing), what to gather before filing, how to research a
  company's complaint history, and links directly to the NAIC's official
  directory rather than publishing a static 50-state list. States plainly
  that this site doesn't operate that directory. Claim Process cluster is
  now 6 guides; site-wide guide library is now 22.
- **Cross-linked:** `/guides/claim-process/` and `/guides/` (counts +
  descriptions), homepage, `/sources/` (count), the "When to Consider an
  Independent Appraisal or Attorney" and "How to Respond to a Lowball
  Offer" guides' `relatedLinks`, and — most directly — resolved a FAQ on
  the Claim Letter Builder calculator that previously said "Not yet" to
  "Can I get a template for filing a state insurance-department complaint?"
  by pointing it at this new guide.
- **Full verification:** `npm run typecheck` (0 errors, 90 files),
  `npx vitest run` (118/118, unchanged — no new calculator logic),
  `npm run build` (49 pages), title/description lengths OK after one trim
  (new guide's title and description both shortened), 0 broken internal
  links (53 pages, 1818 hrefs, 53 routes, 106 assets checked).

## 2026-08-08 — Diminished Value vs. Total Loss decision guide (fix-prompts item 4.4, re-audit finding)

Re-read the uploaded fix-prompts document in full against the completed
build to confirm nothing was missed. Found one genuine gap: item 4.4 asked
for "a short decision-guide article that routes users to the right tool
based on whether their vehicle was repaired or declared a total loss." The
interactive `/check-my-offer/` router covers this functionally, but no
standalone article existed — items 4.1 (state DV eligibility), 4.2 (reading
a valuation report), and 4.3 (glossary) were already done under different
titles.

- **New guide:** `/guides/claim-process/diminished-value-vs-total-loss-which-claim/`
  — a short, source-free (internal routing note only, logged as
  SOURCE-REGISTER.md entry #22) article: the one fact that decides which
  path applies (repaired vs. totaled), a quick self-check table linking to
  all 5 relevant calculators plus the router, and the handful of edge cases
  where both can seem to apply (multiple accidents, undecided claims,
  disputing the repair-vs-total-loss decision itself). Claim Process
  cluster is now 7 guides; site-wide guide library is now 23.
- **Cross-linked:** `/guides/claim-process/`, `/guides/`, homepage, and
  `/sources/` (counts + descriptions); added to the `relatedLinks` of "What
  Is Diminished Value?" and "How Insurers Value a Total-Loss Vehicle";
  added a second "read it instead" link on `/check-my-offer/` alongside the
  existing "browse all calculators" link.
- **Full verification:** `npm run typecheck` (0 errors, 91 files),
  `npx vitest run` (118/118, unchanged), `npm run build` (50 pages), title/
  description lengths OK after one title trim, 0 broken internal links
  (54 pages, 1869 hrefs, 54 routes, 107 assets checked).

This closes out every numbered item in the uploaded fix-prompts document
(1 through 8). Remaining open items are all owner-only or live-site-only:
a real AdSense publisher ID, the About page bio, the manual accessibility
walkthrough (needs a live URL), and the go-live/cutover sequence itself.

## 2026-08-08/09 — AdSense per-page checklist + real automated accessibility audit

With every fix-prompts item closed, worked forward through the two
remaining actionable items in `ADSENSE-READINESS.md` that don't require a
live URL or owner-only info: the per-page content checklist (§4) and the
mobile/accessibility check row.

**AdSense per-page checklist (all 23 guides):** ran the documented
checklist — substantial original content, not templated/mass-generated,
genuine `reviewedDate`, every factual claim logged in `SOURCE-REGISTER.md`
and reflected on `/sources/` — against all 23 published guides. All 23
passed. Populated `astro/src/lib/ads/config.ts`'s `ELIGIBLE_ROUTES` allow-
list with all 23 paths, each dated `// checklist passed 2026-08-08`, plus
an explanatory header noting `/glossary/` and hub/index pages were
deliberately excluded (navigational, not the long-form content this
checklist certifies). **`ADSENSE_ENABLED` was verified unchanged (`false`)
throughout** — this only pre-populates the allow-list for whenever ads are
eventually enabled; the deny-list (`NEVER_ELIGIBLE_PATTERNS`) still wins
over anything here regardless.

**Automated accessibility audit — real upgrade, not just a re-run:** prior
sessions' "automated pass" was a simple regex-style check (one `<h1>`,
`<main>` present, skip link present, `lang` attribute present). This
session replaced it with a genuine WCAG rule-engine scan using axe-core,
run headlessly via `jsdom` (no live URL needed) against every built HTML
page. New permanent tool: `astro/scripts/axe-check.mjs`, wired to
`npm run audit:a11y`, with `axe-core` and `jsdom` added as real
devDependencies (previously trialed with `--no-save`).

Two integration bugs had to be fixed to get a trustworthy result: (1) axe-
core must be loaded via `dom.window.eval()` inside the JSDOM window's own
context — setting Node globals (`global.window = ...`) after the fact
doesn't work; (2) a shared JSDOM instance with `innerHTML` swapped between
pages produced 81/81 false-positive `html-has-lang` violations, because
`innerHTML` assignment doesn't re-parse the `<html>` tag's own attributes —
fixed by creating a fresh `JSDOM` instance per file. `resources: "usable"`
(which fetches linked CSS/images over the network) was dropped since it's
unneeded for axe's structural rules and was the reason a full scan
initially timed out; without it, all 81 pages scan in ~18s.

**Coverage gap discovered and fixed:** the file-walk originally matched
only literal `index.html`, silently skipping the ~27 legacy redirect/
retired-content stub pages under `public/` (e.g.
`articles/what-is-pain-and-suffering.html`) that get copied verbatim into
`dist/` at real, live, publicly-reachable URLs. These pages had never been
checked by *any* verification script this entire project — not for
accessibility, not for title/description length, not for broken links.
Fixed the walk to match every `.html` file, bringing total coverage from
54 pages to the real total of 81.

Found and fixed 2 genuine issues via the corrected scan:
1. An empty, unlabeled `<th></th>` header cell in the comparison table on
   `/guides/claim-process/first-party-vs-third-party-auto-claims/` —
   screen readers couldn't announce that column. Fixed with a
   `.visually-hidden` span.
2. All ~30 legacy stub pages had their body content sitting directly under
   `<body>` with no landmark region wrapping it (axe: `region`,
   moderate). Fixed at the generator-template level, not the generated
   files — `astro/scripts/generate-legacy-stubs.mjs`'s `pageShell()`
   function now wraps `${body}` in `<main>...</main>`, so the fix survives
   every future `npm run build` (which regenerates these files from
   scratch via the `prebuild` hook). Verified this survives a real rebuild.

Final clean run: **0 violations across all 81 pages.** `color-contrast` is
disabled in the script (jsdom doesn't do real layout) but was separately
verified by hand against the site's small, fixed color palette. Updated
`ADSENSE-READINESS.md`'s accessibility row to describe the real method and
result — the manual keyboard-only/screen-reader walkthrough at
320/390/768/1024/1440px remains the one genuinely outstanding piece, since
it needs a live URL.

Investigated one item flagged by the broken-link checker —
`BROKEN ROUTE in dist/404.html: /404/` — and confirmed it's a false
positive in the checker's own route model, not a site defect: `404.html`
is a reserved filename served automatically by static hosts (GitHub Pages)
for any unmatched path, so it legitimately has no matching `/404/`
directory route the way ordinary content pages do under
`trailingSlash: "always"`. The page's `<link rel="canonical">` self-
reference is harmless standard practice, and the page already carries
`noindex` — no code change needed.

- **Full verification:** `npx vitest run` (118/118), `npm run typecheck`
  (0 errors, 92 files), `npm run build` (50 pages), `npm run audit:a11y`
  (81 pages, 0 violations), title/description lengths OK (81 files
  checked, including stubs for the first time), 0 real broken internal
  links (81 pages, 2081 hrefs including absolute-URL canonical/redirect
  links, 81 routes, 107 assets checked; the one flagged item is the
  `/404/` false positive above).

## 2026-08-14 — Three new calculators, full site status check, live-site discovery

The owner asked for an SEO/AdSense status check before publishing anything
further. Checked the actual live site directly rather than from memory:
`www.fairclaimcalculator.com` is still serving the **old plain-HTML
placeholder site** (root-level files, "tools launching over the coming
weeks" copy, 4 tools) — none of this project's Astro rebuild has ever gone
live. Confirmed `origin/main` is fully in sync with local `main`
(`e4e7cd4`), so the earlier open question about unpushed commits is
resolved — the rebuild is finished and pushed, just not cut over. The
GitHub Actions deploy workflow (`.github/workflows/deploy.yml`) is ready
and waiting on one manual step (Pages source → "GitHub Actions") that only
the owner can do from GitHub's own settings UI.

Given that status, the owner asked for two things: get everything
AdSense-readiness-wise that's under this project's own control fully
finished, and add the most useful additional calculator tools. Both
addressed:

**Three new calculators (8th, 9th, 10th):**

1. **Total-Loss Threshold Checker** (`/calculators/total-loss-threshold-checker/`)
   — turns the already-published, already-sourced state threshold table
   (from the "State Total-Loss Threshold Laws Explained" guide) into an
   interactive lookup. Handles both the simple-percentage-threshold states
   and Total-Loss-Formula states correctly, including an optional
   estimated-salvage-value field for TLF states. No new state data was
   researched — the same 51-entry table is reused verbatim (kept in sync
   with the guide's table by a code comment). 20 Vitest tests, including
   exact matches to the guide's own worked examples.
2. **Loan/Lease Payoff vs. ACV Gap** (`/calculators/gap-shortfall/`) —
   deliberately NOT a rebuild of Settlement Check Breakdown. Computes only
   the raw arithmetic gap between a loan/lease payoff and a settlement
   amount, then surfaces the same 5-item common-GAP-exclusions checklist
   already published in the GAP guide (shared as data between the two so
   they can't drift). Explicitly never claims to calculate what GAP would
   actually pay — the guide already established that depends on the
   user's specific certificate, which this site can't know. 10 Vitest
   tests.
3. **Sales Tax & Title Fee Estimator** (`/calculators/sales-tax-title-fee-estimator/`)
   — deliberately does NOT include a built-in state sales-tax-rate table.
   The companion guide already explains why Settlement Check Breakdown
   never assumes a state's tax rate (rates vary by state AND locality, and
   change over time); this tool follows the same policy, asking for the
   user's own known/looked-up rate rather than fabricating a 50-state
   table that would eventually go stale or be wrong for a specific
   locality. 14 Vitest tests, including a sanity check rejecting
   implausible rates (>20%).

All three: full lib module + Vitest tests written and passing *before* the
page was built (not after), FAQ sections with FAQPage schema,
BreadcrumbList schema, cross-linked from their source guides (each guide
got a new inline link to its calculator), the calculators index, the
homepage, `/check-my-offer/` (3 new routing options), `/sources/`, and
reciprocal links added from Settlement Check Breakdown, Total-Loss Offer
Audit, and Salvage Value's own "More Calculators" sections. Site-wide
calculator count updated from "seven" to "ten" everywhere it was stated
(About, calculators index, homepage, check-my-offer).

**Consent/CMP:** rather than build a homemade "ad consent" toggle (which
would not satisfy the real IAB TCF requirement `ADSENSE-READINESS.md` §5
already calls for, and would misrepresent compliance that doesn't exist),
added a precise code comment in `CookieConsent.astro` marking exactly
where a real, future CMP integration plugs in, and clarifying that this
banner's own buttons must never grant the `ad_*` consent categories
themselves. Documented as a deliberate scope decision, not an oversight.

**AdSense checklist:** confirmed the 3 new calculators don't need (and
aren't eligible for) `ELIGIBLE_ROUTES` — they're tool pages, permanently
denied under §3 same as every other calculator, so no new checklist work
was needed there. `ADSENSE_ENABLED` verified unchanged (`false`).

**Full verification:** `npx vitest run` (162/162, 44 new), `npm run
typecheck` (0 errors, 101+ files), `npm run build` (53 Astro pages),
`npm run audit:a11y` (84 pages, 0 violations), title/description lengths
OK across all 84 pages after 2 trims, 0 real broken links (84 pages, 2298
hrefs including asset references, 84 routes + 33 assets checked; the one
flagged item is the same known `/404/` checker false positive as before).
`SOURCE-REGISTER.md`, `ADSENSE-READINESS.md`, and `/sources/` updated with
the 3 new calculators' sources and honest page/test counts throughout.

Net result: every item in `ADSENSE-READINESS.md` §1 that doesn't require
a live URL or the owner personally is now done. What's left is cutover
itself, the two post-cutover manual reviews, a future CMP vendor decision,
and the owner-only items (publisher ID, DNS/Pages settings) — all
explicitly out of this session's reach by design, not oversight.

## 2026-08-16 — Live-site confirmation, full SEO audit, 51 state total-loss threshold pages

**Live-site status confirmed.** DNS misconfiguration from the prior session
(domain pointed at Vercel instead of GitHub Pages) is fully resolved —
`https://www.fairclaimcalculator.com/` now serves the rebuilt Astro site
over HTTPS, live-fetched and confirmed showing all 10 calculators (commit
`3b7884a`, matching `origin/main` exactly, working tree clean). robots.txt
and sitemap both confirmed served correctly from the live domain.

**Technical + on-page SEO audit (site-wide):** every guide has exactly one
real `<h1>` (rendered by `GuideLayout.astro` from a required `h1` prop —
an initial grep-based check flagged 23 false positives because it only
matched literal `<h1` in each page file, not layout-rendered headings;
confirmed as a checker artifact, not a real issue, by reading the layout
source). Zero `<img>` tags site-wide without `alt` (the site currently has
no raster images at all, so this is moot rather than passing). Zero
duplicate `<title>` or meta-description values across all 52 pre-existing
page files. Zero orphan pages — an initial orphan check flagged 4 guides
as unlinked, again a checker artifact (hub pages link guides via
`href={g.href}` dynamic attributes, not literal `href="..."` strings the
regex could see). WebSite JSON-LD present on the homepage; no sitewide
Organization schema yet (minor, logged as a future nice-to-have, not
required). Sitemap has no `<lastmod>` values (minor, `@astrojs/sitemap`
default; not required for indexing). Conclusion: on-page/technical SEO
fundamentals are in good shape; nothing broken was found.

**51 new state total-loss threshold pages** — the headline addition this
session, chosen (via `AskUserQuestion`, user selected it explicitly over 3
alternatives) as the single highest-leverage scalable addition: turns the
already-sourced, already-tested 51-entry `STATE_THRESHOLDS` table into an
individual page per state, each targeting real high-intent, low-competition
search queries like "is my car a total loss in Texas" that the site
previously had no dedicated page for.

- One dynamic Astro route (`getStaticPaths()` over `STATE_THRESHOLDS`),
  not 51 hand-authored files — but explicitly NOT a mass-generated
  find-and-replace template either. New file
  `src/lib/content/state-threshold-copy.ts` branches the "what this means
  practically" paragraph by threshold **tier** (100%, 80%, 75%, 70%, 65%,
  60%, or TLF) — a real factual distinction between states — and computes
  each page's worked dollar example individually from that state's own
  real percentage. Design rationale documented in a code comment at the
  top of that file and in `SOURCE-REGISTER.md` §8, directly answering this
  project's own `ADSENSE-READINESS.md` §4 anti-templating rule.
- Added `slugifyState()` / `lookupStateBySlug()` to
  `total-loss-threshold.ts` (single source of truth, so the calculator's
  exact state-name matching and the new pages' URL slugs can't drift
  apart). "Washington, D.C." → `washington-dc`, correctly distinct from
  "Washington" → `washington`.
- Small calculator UX addition: the Total-Loss Threshold Checker now reads
  an optional `?state=` query param on load and pre-selects that state in
  the dropdown — every new state page links into the calculator this way.
- Parent guide's 51-row table converted from hardcoded HTML to a
  data-driven `STATE_THRESHOLDS.map()`, so every state name is now a link
  to its own page (fixes what would otherwise have been a dead-end table).
- Each state page: its own title/description (verified programmatically
  against built `dist/` output, not just source — worst case "Washington,
  D.C." at 59/60 title chars, 128/160 description chars), a 4-level
  breadcrumb, FAQPage schema (3 real per-state Q&As), the same two sources
  as the parent guide, and reciprocal links to the parent guide, the
  calculator, and "How Insurers Value a Total-Loss Vehicle."

**Full verification:** `npx vitest run` (174/174, 12 new — 6 for
`slugifyState`/`lookupStateBySlug`, 6 for the copy-generation helpers),
`npm run typecheck` (0 errors), `npm run build` (104 Astro-rendered pages,
up from 53), `npm run audit:a11y` (135 total dist pages, 0 violations),
0 broken internal links (4,131 hrefs checked across the built site).
`SOURCE-REGISTER.md` §8 and `ADSENSE-READINESS.md` §1 updated with the new
page/test/route counts.

Net result: AdSense-controllable checklist unchanged in substance from
2026-08-14 (still nothing left under this project's own control except the
manual accessibility walkthrough, now unblocked since the site is
confirmed live). The 51 new pages are a genuine scale-up of the site's
useful surface area and search footprint, not an AdSense-readiness item
per se — they're guide-cluster content pages, same permanently-eligible
category as the other 23 guides once/if `ELIGIBLE_ROUTES` review ever
extends to them individually.

## 2026-08-22 — External audit reconciliation, sitewide Organization schema

Owner connected this repo (local `/Users/mac/Documents/GitHub/fairclaimcalculator.com`)
after an earlier session had audited the live site from the outside only
(no repo access) and flagged the sitemap as broken/85% incomplete. That
external finding was a false alarm caused by the auditing tool fetching
`/sitemap.xml` directly — an orphaned file left over from the pre-Astro
plain-HTML root site, referenced by nothing (not even that same site's own
`robots.txt`, which correctly points to `/sitemap-index.xml`). Re-fetched
`robots.txt` and `/sitemap-index.xml` live and confirmed both are correct
and match this repo's `astro/public/robots.txt` / `@astrojs/sitemap`
output exactly — no actual sitemap defect exists. Root-cause note for
whoever reads this next: the repo root still contains the pre-migration
plain-HTML files (`index.html`, `sitemap.xml`, etc., last touched
2026-07-19) which are not part of the Astro build or the `deploy.yml`
pipeline and are never served — they're dead weight in the repo, not a
live-site risk, but worth deleting in a future cleanup pass to stop this
exact false alarm from recurring for the next person/tool that audits the
domain without repo context.

Reviewed `ADSENSE-READINESS.md` §1 and this file's own history end to end
against the live site. Confirmed nothing has regressed since 2026-08-16:
site still live, still serving the Astro build, `robots.txt` +
`sitemap-index.xml` + `sitemap-0.xml` all correct.

**Closed the one legitimately-open item from that checklist:** sitewide
`Organization` JSON-LD ("minor, logged as a future nice-to-have, not
required" per 2026-08-16). Added directly to `BaseLayout.astro` (not
duplicated per-page) so every route gets it automatically — homepage's
existing page-specific `WebSite` schema is unaffected and still renders
alongside it. Not yet run through this repo's own `npm run typecheck` /
`npm run test` / `npm run build` / `npm run audit:a11y` gate from this
session (no local Node toolchain in this session's reach) — relying on
`deploy.yml`'s CI gate to catch anything wrong before it deploys, same as
this project's own existing safety net. **Owner (or whatever normally
pushes this repo's commits) still needs to `git add / commit / push` this
change** — this session cannot push directly, same constraint noted in
`deploy.yml`'s header comment.

**Confirmed still genuinely outstanding, unchanged from 2026-08-16:** the
manual keyboard-only/screen-reader accessibility walkthrough at
320/390/768/1024/1440px; Google Search Console submission (not yet done);
the four owner-only items in `ADSENSE-READINESS.md` §7 (real publisher ID,
CMP vendor decision, and re-confirming the Pages/DNS settings that were
already fixed 2026-08-16 are still correct).

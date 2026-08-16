# ADSENSE-READINESS.md — FairClaimCalculator.com v2

Internal reference only — not part of the live site, not linked from
navigation, not in the sitemap. Tracks the site's readiness against
Google's publisher policies and this project's own, stricter internal
gate for ever enabling any advertising. **These are internal quality bars
this project has set for itself, not a claim about Google's actual
minimum requirements** — treat every checkbox below as "what we require of
ourselves before applying," not as legal or policy advice about AdSense.

**Current status: ads are fully disabled. No AdSense application has been
made. `ADSENSE_ENABLED = false` in `astro/src/lib/ads/config.ts`, and
nothing in this repository requests, loads, or references any ad network
script, publisher ID, or `ads.txt` content. As of 2026-08-01, Google
Analytics 4 (analytics only, not advertising) runs in real consent-gated
mode — see §5 below. This does not change AdSense eligibility either way;
it's logged here for the same reason everything else is: so this
document never silently drifts from what the code actually does.**

---

## 1. Activation gate — do not apply for AdSense until every box is checked

| Done? | Requirement |
|---|---|
| ✅ | At least 4 functioning, tested calculators live (162 Vitest tests passing — **10 calculators as of 2026-08-14**: the original 4, plus Rental / Loss-of-Use Reimbursement, Salvage / Owner-Retained Value, and Leased Vehicle Diminished Value (added 2026-08-08), plus Total-Loss Threshold Checker, Loan/Lease Payoff vs. ACV Gap, and Sales Tax & Title Fee Estimator (added 2026-08-14) — all three new tools reuse already-sourced data/math from existing guides rather than introducing new unverified claims). |
| ✅ | Finished homepage and `/calculators/` directory. |
| ✅ | Complete trust/legal framework (11 pages: About, Methodology, Editorial Policy, Sources, Corrections, Advertising Disclosure, Privacy, Terms, Disclaimer, Accessibility, Contact). |
| ✅ | Meaningful, source-backed guide library (23 guides across 3 clusters — 15 published 2026-07-29, 5 added 2026-08-01, 3 added 2026-08-08 — plus 51 individual state pages added 2026-08-16 under the State Total-Loss Threshold Laws guide, each with its own worked example, source citations, and FAQPage schema; see `SOURCE-REGISTER.md` §8 for the anti-templating design rationale). Sources logged in `SOURCE-REGISTER.md` and reflected on `/sources/`. |
| ✅ | No placeholder/broken pages, no broken internal links, across the growing site — verified with a script comparing every `href`/`src` in the built `dist/` HTML against real routes and real static assets, re-run after every content change. As of 2026-08-16: 104 Astro-rendered routes (up from 53 — the +51 is the new state-by-state total-loss threshold pages), 135 total files in `dist/` including legacy redirect stubs, **0 broken links across 4,131 internal hrefs checked**. |
| ⚠️ | Mobile/accessibility checks. Upgraded 2026-08-08 from a simple structural regex pass to a real automated WCAG rule-engine scan (axe-core, run headlessly via `astro/scripts/axe-check.mjs` against every built page, now `npm run audit:a11y`). Result: **0 violations across all 135 pages** as of 2026-08-16 (re-run after adding 51 state pages). Earlier fixed: an unlabeled table header cell, and ~30 stub pages missing a landmark region (`<main>`) around their body content, at the generator-template level so it survives every rebuild. Color-contrast is not checked by this script (jsdom doesn't do real layout/rendering) but was separately verified by hand against the site's fixed color palette. **Still outstanding:** the actual manual keyboard-only and screen-reader walkthrough at 320/390/768/1024/1440px — the site now has a confirmed live URL (`https://www.fairclaimcalculator.com/`, DNS/HTTPS both verified working 2026-08-16), so this is unblocked and is the next real step. |
| ✅ | Indexing files validated, including against the confirmed-live deployment. `robots.txt` and sitemap both confirmed served correctly from `https://www.fairclaimcalculator.com/` as of 2026-08-16 (live fetch, not just local build output) — 52 URLs in the live sitemap as of the last deploy; the 51 new state pages will appear in the sitemap on the next deploy of this commit. Not yet submitted to Google Search Console — that's a real owner action, not blocked on anything else. |
| ⚠️ | Real identity shown honestly. `/about/` deliberately stays minimal (real name, no unverified credentials/headshot) per the owner's own instruction — this is *compliant* with "honest," but if fuller bio specifics ever become available, add them; don't treat the current minimal state as something to fix by inventing detail. |
| ⚠️ | Privacy/CMP plan. **Real and working for analytics** as of 2026-08-01 — Google Analytics 4 runs only after affirmative consent via a real banner (`CookieConsent.astro`), Consent Mode v2 wired correctly, footer control functional. **Still not built:** a real, certified IAB TCF CMP for ad consent. As of 2026-08-14, `CookieConsent.astro` carries an explicit code comment marking exactly where a real CMP's own consent-update call would plug in — deliberately **not** a second homemade toggle on this banner, since that would not satisfy the TCF requirement and would misrepresent compliance that doesn't exist yet. Selecting and integrating a real CMP vendor remains an owner decision (see §7). |
| ❌ | Real AdSense publisher ID available. None exists. Do not fabricate one, ever, per the owner's explicit standing instruction. |
| ❌ | Correct root `ads.txt` ready to generate from the real ID. Not applicable until the above is real. |
| ✅ | No policy-restricted placements planned. The formal per-page checklist in §4 was run and logged 2026-08-08 against all 23 published guides (word counts, non-templated originality, real reviewedDate, source-logging all checked against the actual files) — all 23 passed and are now listed, individually and dated, in `ELIGIBLE_ROUTES` in `astro/src/lib/ads/config.ts`. The 3 new calculators added 2026-08-14 are tool pages, not guides — they fall under the permanent calculator deny-list in §3, same as every other calculator, and were never candidates for `ELIGIBLE_ROUTES`. This only pre-populates the allow-list; `ADSENSE_ENABLED` is still `false` and nothing is actually eligible until that flips. |
| ❌ | Manual page-by-page review done. Not started — this is a visual/rendering review (layout, ad-placement conflicts, mobile rendering) against the real deployed pages, which needs a live URL and hasn't been done. The content-substance portion of page review is covered by the §4 checklist above. |

**Net: everything under this project's own control is now finished.**
What's left is exactly three kinds of thing, all requiring either a live
URL or the owner personally: (1) the manual accessibility/page-review
walkthroughs, both blocked on cutover; (2) a real CMP vendor decision for
ad consent, whenever ads are actually pursued; (3) the four items only the
site owner can supply or decide (contact inbox — **confirmed 2026-08-01,
now `info@fairclaimcalculator.com`**; GitHub Pages source setting; DNS
confirmation; and, only after actual approval, a real publisher ID).

---

## 2. Safe ad architecture — built now, inactive until the gate above is met

- **`astro/src/lib/ads/config.ts`** — `ADSENSE_ENABLED = false` (a literal
  code constant, not an environment variable that could be flipped by a
  build secret without a reviewed code change). `isAdEligible(path)`
  returns `false` unconditionally while disabled, and even once enabled,
  a deny-list of route patterns (`NEVER_ELIGIBLE_PATTERNS`) always wins
  over the allow-list (`ELIGIBLE_ROUTES`, currently empty).
- **`astro/src/components/AdSlot.astro`** — renders nothing at all (no
  element, no reserved space, no placeholder box) unless the page is both
  globally enabled and individually eligible. No page currently imports or
  uses this component — it is prepared scaffolding, not a live placement.
- Neither file contains a publisher ID, an ad-network script tag, or any
  reference to a real AdSense account.

## 3. Route-level ad-eligibility policy (permanent deny-list)

These route categories must **never** carry an ad placement, even after
`ADSENSE_ENABLED` is eventually flipped to `true`:

- The 404/error page.
- The `/check-my-offer/` routing quiz (a decision flow, not content).
- Every calculator page itself — its form, live results, print view, and
  empty/in-progress states. (A future dedicated "calculator explainer"
  guide page *about* a calculator, if ever written as separate content, is
  a different route and could theoretically be assessed separately — the
  calculator tool page itself never becomes ad-eligible.)
- All 11 legal/trust/support pages (About, Methodology, Editorial Policy,
  Sources, Corrections, Advertising Disclosure, Privacy, Terms, Disclaimer,
  Accessibility, Contact).
- Any redirect or retired-content stub (`URL-MIGRATION.md` §2/§3) — these
  aren't even Astro page routes (they're static files in `public/`), so
  `AdSlot` could never reach them regardless, but logged here for
  completeness.
- Any unfinished, placeholder, or "coming soon" page — moot today since
  none are published, but stated as a standing rule for future work.

Once the Phase 5 guide library exists, individual guide pages **may**
become ad-eligible, but only one at a time, each added explicitly to
`ELIGIBLE_ROUTES` with a dated comment recording that it passed the
per-page checklist below — never a blanket "all guides are eligible" rule.

## 4. Per-page content/policy checklist (required before adding any route to `ELIGIBLE_ROUTES`)

A page must satisfy all of the following before it is added:

- Substantial original content beyond a form or a short definition — not a
  superficial rewrite of another source, not a near-duplicate of another
  page on this site.
- Not mass-generated, not templated across states with only place-names
  swapped in.
- No arbitrary word-count padding; length reflects the actual topic.
- Its `reviewedDate` reflects a real substantive review, not a cosmetic
  date bump.
- Every legal/factual claim on the page is logged in `SOURCE-REGISTER.md`
  and appears on the public `/sources/` page.
- The page is not an empty result state, an error state, or a
  navigation-only page.

## 5. Consent / privacy plan

- **Today (updated 2026-08-01):** Google Analytics 4 (`G-Y0W2ZWVGLZ`, see
  `astro/src/lib/analytics/config.ts`) runs in real, consent-gated mode via
  `astro/src/components/CookieConsent.astro`. This is analytics, not
  advertising — no ad network, no ad tag, no `ads.txt` content exists.
  Implementation, deliberately stricter than Google's own Consent Mode
  minimum: the `gtag.js` script tag itself is never injected into the page
  — no request to `googletagmanager.com` happens at all — until a visitor
  affirmatively accepts (this visit or a remembered prior one). Consent
  Mode v2 defaults (`analytics_storage`, `ad_storage`, `ad_user_data`,
  `ad_personalization`: all `denied`) are declared regardless, so the
  signal is correct the instant the script does load. `Footer.astro`'s
  "Privacy choices" is now a real `<button>` (not a link to a static
  anchor) that reopens the actual consent banner from anywhere on the
  site; `/privacy/#choices` has the same control inline. `/privacy/` was
  rewritten in the same change to describe exactly what runs.
- **When ads are ever added, before the first ad request is made:**
  - A Google-certified CMP (or Google's own Privacy & Messaging tooling)
    must be integrated and functioning, supporting IAB TCF v2.3 for
    EEA/UK/CH visitors and a US-state opt-out mechanism. The current
    custom banner covers Analytics consent only — it is **not** an IAB
    TCF CMP and must not be mistaken for one once real ad auctions are
    involved; IAB TCF is specifically required for participating in ad
    real-time-bidding, not for first-party analytics.
  - No ad request may fire before consent is captured where required.
  - `/privacy/` and `/advertising-disclosure/` must be updated again in
    the same change that enables ads, not after.
  - The Footer's "Privacy choices" control must be extended to cover
    ad-related consent too, not just analytics.

## 6. `ads.txt`

No `ads.txt` file exists at the repo root (correctly — there is no real
publisher ID to put in one). One will be generated only from a verified
real AdSense publisher ID, never a placeholder or invented value.

## 7. Owner actions required before this can ever move to "ready"

1. Confirm Phase 5 (guide library) and Phase 6 (accessibility pass) are
   complete — both are prerequisites independent of advertising.
2. Provide a real AdSense publisher ID once (and only once) an application
   has actually been approved — do not ask for one to be fabricated.
3. Decide on and approve a specific CMP/consent solution before any
   ad-related code is enabled.
4. Explicitly approve flipping `ADSENSE_ENABLED` — this should never
   happen as a side effect of an unrelated change.

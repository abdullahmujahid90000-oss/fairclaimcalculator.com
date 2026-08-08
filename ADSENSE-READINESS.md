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
| ✅ | At least 4 functioning, tested calculators live (102 Vitest tests passing — 5 calculators as of 2026-08-08: the original 4 plus Rental / Loss-of-Use Reimbursement). |
| ✅ | Finished homepage and `/calculators/` directory. |
| ✅ | Complete trust/legal framework (11 pages: About, Methodology, Editorial Policy, Sources, Corrections, Advertising Disclosure, Privacy, Terms, Disclaimer, Accessibility, Contact). |
| ✅ | Meaningful, source-backed guide library (20 guides across 3 clusters — 15 published 2026-07-29, 5 added 2026-08-01). Sources logged in `SOURCE-REGISTER.md` and reflected on `/sources/`. |
| ✅ | No placeholder/broken pages, no broken internal links, across the entire 38-page site — verified with a script comparing every `href` in source against real built routes, re-run after every content change including the Phase 5 guide additions. |
| ⚠️ | Mobile/accessibility checks. Automated pass done and re-verified against the full 38-page build: every page has one `<h1>`, a `<main>` landmark, working skip link, `lang` attribute; every color pair in use passes WCAG AA contrast; all labels/ARIA references resolve. **Still outstanding:** the actual manual keyboard-only and screen-reader walkthrough at 320/390/768/1024/1440px, which needs a live URL — planned for immediately after cutover. |
| ⚠️ | Indexing files validated. Sitemap confirmed to list exactly the 37 real indexable pages and nothing else; `robots.txt` correct. Not yet validated against a live deployment or Search Console — that requires cutover first. |
| ⚠️ | Real identity shown honestly. `/about/` deliberately stays minimal (real name, no unverified credentials/headshot) per the owner's own instruction — this is *compliant* with "honest," but if fuller bio specifics ever become available, add them; don't treat the current minimal state as something to fix by inventing detail. |
| ⚠️ | Privacy/CMP plan. **Real and working for analytics** as of 2026-08-01 — Google Analytics 4 runs only after affirmative consent via a real banner (`CookieConsent.astro`), Consent Mode v2 wired correctly, footer control functional. **Still not built:** an IAB TCF CMP for ad consent — correctly deferred, since there are no ads yet to consent to. |
| ❌ | Real AdSense publisher ID available. None exists. Do not fabricate one, ever, per the owner's explicit standing instruction. |
| ❌ | Correct root `ads.txt` ready to generate from the real ID. Not applicable until the above is real. |
| ⚠️ | No policy-restricted placements planned. Guide content now exists and reads as substantive, original, and source-backed on manual review — nothing found that would need excluding. The formal per-page checklist in §4 hasn't been run and logged page-by-page yet. |
| ❌ | Manual page-by-page review done. Not started — the site isn't live yet, so this hasn't been done against the real deployed pages. |

**Net: very close, not ready yet.** The guide library and link/sitemap
verification — previously the two hard blockers — are both done. What's
left is genuinely thin: the manual accessibility walkthrough (needs a live
URL), the manual page-by-page review (same), and the four items only the
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

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
script, publisher ID, or `ads.txt` content.**

---

## 1. Activation gate — do not apply for AdSense until every box is checked

| Done? | Requirement |
|---|---|
| ✅ | At least 4 functioning, tested calculators live. |
| ✅ | Finished homepage and `/calculators/` directory. |
| ✅ | Complete trust/legal framework (11 pages: About, Methodology, Editorial Policy, Sources, Corrections, Advertising Disclosure, Privacy, Terms, Disclaimer, Accessibility, Contact). |
| ❌ | Meaningful, source-backed guide library (Phase 5 — 15 guides across 3 clusters). **Not started.** |
| ❌ | No placeholder/broken pages, no broken internal links, across the *entire* finished site (last verified only against the current 18-page + stub set — must be re-verified once guides ship). |
| ❌ | Mobile/accessibility checks passed (Phase 6 — manual keyboard + screen-reader test matrix at 320/390/768/1024/1440px). **Not started**; `/accessibility/` currently states design intent and built-in measures, not a completed audit. |
| ⚠️ | Indexing files validated (sitemap confirmed to list only the 18 real complete pages; robots.txt present. Not yet validated against a live deployment or Search Console — that requires cutover first.) |
| ⚠️ | Real identity shown honestly. `/about/` deliberately stays minimal (real name, no unverified credentials/headshot) per the owner's own instruction — this is *compliant* with "honest," but if fuller bio specifics ever become available, add them; don't treat the current minimal state as something to fix by inventing detail. |
| ❌ | Privacy/CMP plan ready. Architecture note only exists in `/privacy/#choices` and `/advertising-disclosure/`, both stating "nothing to consent to yet." No actual CMP integration, no IAB TCF wiring, no US state opt-out mechanism built. |
| ❌ | Real AdSense publisher ID available. None exists. Do not fabricate one, ever, per the owner's explicit standing instruction. |
| ❌ | Correct root `ads.txt` ready to generate from the real ID. Not applicable until the above is real. |
| ❌ | No policy-restricted placements planned. Not yet assessed — depends on final guide content (Phase 5), which doesn't exist yet. |
| ❌ | Manual page-by-page review done. Not started — depends on Phase 5 completing first. |

**Net: not ready. Do not apply for AdSense.** The two hard blockers are the
guide library (Phase 5) and the accessibility/manual-testing pass (Phase
6) — both explicitly required by this gate before the site is even
substantively "done," independent of ads.

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

## 5. Consent / privacy plan (not built yet — architecture intent only)

- **Today:** no analytics, no ads, no non-essential trackers run anywhere
  on the site (confirmed directly — `BaseLayout.astro` loads no such
  script). `/privacy/#choices` and `/advertising-disclosure/` both say so
  plainly, and `Footer.astro`'s "Privacy choices" link points at that
  section rather than a working preference center, because none exists.
- **When ads are ever added, before the first ad request is made:**
  - A Google-certified CMP (or Google's own Privacy & Messaging tooling)
    must be integrated and functioning, supporting IAB TCF v2.3 for
    EEA/UK/CH visitors and a US-state opt-out mechanism.
  - No ad request, and no non-essential tracking script, may fire before
    consent is captured where required.
  - `/privacy/` must be rewritten to accurately describe exactly what
    runs — this document and that page must be updated in the same
    change that enables ads, not after.
  - The Footer's "Privacy choices" link must point at the real, working
    CMP control, not the current static anchor.

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

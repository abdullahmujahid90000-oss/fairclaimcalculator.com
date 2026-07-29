# ASTRO-REBUILD-PLAN.md — FairClaimCalculator.com v2 (Astro/TypeScript rebuild)

Internal reference only — not part of the live site, not linked from navigation,
not in sitemap.xml. Companion to `BUILD-LOG.md` (which tracks the plain-HTML
site this rebuild is replacing) and `PHASE-0-RESEARCH.md` (17c/Mabry sourcing —
still authoritative, carried forward unchanged).

**Read this file first for every session on the v2 rebuild.** `BUILD-LOG.md`
now describes a superseded architecture; new work happens against the queue
in §9 below, using the same "next"/"continue" trigger-word convention.

---

## 0. Decisions locked in this session (do not relitigate)

| # | Decision | Rationale |
|---|---|---|
| R1 | **Full migration to Astro + TypeScript**, static output, deployed to GitHub Pages. Supersedes the earlier plain-HTML decision (BUILD-LOG.md D3). | User's explicit choice, 2026-07-22, over a plain-HTML-with-shared-includes fallback and over adopting the pre-existing untracked `web-next/` Next.js scaffold. |
| R2 | The `web-next/` directory (Next.js 16 + React 19 + Three.js/GSAP/Framer Motion scaffold) is **not used**. It predates this plan, is untracked by git, and doesn't match the "avoid React unless a component genuinely requires it" rule. Left in place, untouched, not deleted without explicit instruction. | Confirmed via repo inspection; user picked Astro instead. |
| R3 | **"David Bennett — Founder & Editor" is confirmed by the user to be a real identity, not a placeholder.** However, no verifiable bio specifics (credentials, professional history, headshot, professional profile URL) have been supplied yet. Until they are, the bio stays in its current minimal, honest form ("independent web publisher, not an attorney, insurer, or appraiser") and **no Person schema, headshot, or specific credential claim is added**. This is an open item — see §10. | User's explicit answer, 2026-07-22. Brief's own rule: never invent a persona, headshot, or credential — applies equally to *expanding* a real name with unverified specifics. |
| R4 | **Hosting: GitHub Pages**, confirmed by the user. Deployment uses a GitHub Actions workflow (build Astro → upload Pages artifact → deploy), which runs on GitHub's own infrastructure once a commit reaches `main` — this works regardless of whether the push comes from this sandbox (which still cannot push directly) or the user's external sync process. | User's explicit answer, 2026-07-22. Decouples "can this sandbox push" from "does the site deploy." |
| R5 | The existing plain-HTML root site (`index.html`, `about.html`, `js/*.js`, etc.) **stays live and untouched** during migration. The new Astro project builds in a new `astro/` subdirectory with its own toolchain. Nothing is deleted or overwritten until the Astro build has verified parity and the user explicitly approves cutover. | Risk containment — a multi-week rebuild must not leave the live site broken or half-migrated at any commit. |
| R6 | Canonical origin: `https://www.fairclaimcalculator.com/` (www, per brief). `astro.config.mjs` and the `CNAME` file are set accordingly. | Explicit brief requirement. |

---

## 1. Manual steps only the user can do (blocking items, not code)

1. **Flip GitHub Pages source to "GitHub Actions."** Repo → Settings → Pages →
   Build and deployment → Source → **GitHub Actions**. Until this is changed,
   GitHub Pages keeps serving whatever it's serving today from a branch, and
   the new `.github/workflows/deploy.yml` added in this session will run
   (harmlessly) but won't actually go live. This is a repo-settings toggle,
   not a file — I cannot do this from a git commit.
2. **Confirm DNS.** The `www` CNAME record for fairclaimcalculator.com should
   point at `<username>.github.io` (standard GitHub Pages custom-domain DNS).
   If the site is already resolving today, this may already be correct —
   just confirm, since I can't inspect your DNS provider from here.
3. **David Bennett's real bio specifics**, if you want the About page and
   Person schema to say more than the current minimal line — real
   professional background, a real headshot, a real professional-profile
   link (LinkedIn, etc.). Without this, the trust pages stay deliberately
   thin rather than guess.
4. **AdSense**: nothing to do yet — this stays off until the site is
   substantively complete, per the brief's own gate. Flagged here so it
   isn't forgotten, not because it's due now.

---

## 2. Architecture

```
/                              ← existing plain-HTML site (untouched, stays live during migration)
/astro/                        ← new Astro + TypeScript project (this rebuild)
  astro.config.mjs             site: https://www.fairclaimcalculator.com, output: static, trailingSlash: always
  tsconfig.json
  package.json
  public/
    CNAME                      www.fairclaimcalculator.com
    .nojekyll                  required — Astro's _astro/ asset folder would otherwise be Jekyll-ignored
    robots.txt
    favicon.ico, images/...
  src/
    layouts/
      BaseLayout.astro         skip-link, header/nav, footer, meta/OG/Twitter/canonical, schema slots
    components/
      Header.astro / Footer.astro / SkipLink.astro
      ScenarioCard.astro / CalculatorCard.astro / TrustBadges.astro
      ResultPanel.astro / ErrorSummary.astro (accessibility primitives shared by every calculator)
    lib/
      calculators/             pure TypeScript calculation modules, ported 1:1 from js/*.js verified math
        settlement-breakdown.ts
        total-loss-audit.ts
        diminished-value-baseline.ts
        claim-letter-builder.ts
      redirects.ts             manifest of old-URL → new-URL/status, drives generated redirect-stub pages
    pages/
      index.astro
      check-my-offer/index.astro
      calculators/
        index.astro
        settlement-check-breakdown/index.astro
        total-loss-offer-audit/index.astro
        diminished-value-baseline/index.astro
        claim-letter-builder/index.astro
      guides/{total-loss,diminished-value,claim-process}/index.astro  (+ individual guide pages)
      about/ methodology/ editorial-policy/ sources/ corrections/
      advertising-disclosure/ privacy/ terms/ disclaimer/ accessibility/ contact/
      404.astro
    styles/
      tokens.css                design tokens (color, spacing, type) — ported + extended from css/style.css
      global.css                base element styles, focus-visible, reduced-motion, a11y helpers
  tests/
    *.test.ts                  Vitest — normal/boundary/empty/invalid/negative/extreme per calculator
.github/workflows/deploy.yml    build astro/ → upload_pages_artifact → deploy-pages, on push to main
```

Why a subdirectory instead of replacing the root: the Pages-Actions deploy
model uploads whatever the workflow builds as the artifact — it does not care
where in the repo the source lives. This lets the old plain-HTML site and the
new Astro project coexist in the same repo/commit history with zero risk of
a half-broken intermediate state, and R5 stays true throughout the migration.

---

## 3. IA & URL migration table

### New Astro routes (all trailing-slash, matching `trailingSlash: "always"`)

| Route | Purpose | Status this session |
|---|---|---|
| `/` | Homepage | Phase 1 — built this session |
| `/check-my-offer/` | Routing quiz → correct tool | Phase 2 |
| `/calculators/` | Index of 4 tools | Phase 2 |
| `/calculators/settlement-check-breakdown/` | Tool | Phase 1 — built this session (reference migration) |
| `/calculators/total-loss-offer-audit/` | Tool | Phase 2 |
| `/calculators/diminished-value-baseline/` | Tool | Phase 2 |
| `/calculators/claim-letter-builder/` | Tool | Phase 2 |
| `/guides/total-loss/`, `/guides/diminished-value/`, `/guides/claim-process/` + 15 individual guides | Content | Phase 5 |
| `/about/ /methodology/ /editorial-policy/ /sources/ /corrections/ /advertising-disclosure/ /privacy/ /terms/ /disclaimer/ /accessibility/ /contact/` | Trust framework | Phase 4 |
| `/404` | Custom 404 | Phase 1 — built this session |

### Old plain-HTML site → new Astro site (redirect manifest, `src/lib/redirects.ts`)

Every mapping below becomes a small static stub page at the **old** path:
`<meta http-equiv="refresh" content="0; url=NEW">` + `<link rel="canonical" href="NEW">`
+ a plain-text fallback link. GitHub Pages has no server-side redirect
config, so this meta-refresh + canonical pattern is the standard static-host
equivalent of a 301 — it is a genuine one-hop redirect from the browser's and
a crawler's perspective, just not an HTTP-layer 301. Documented here as a
deliberate, host-constrained tradeoff rather than a gap.

| Old URL (current live plain-HTML) | New URL | Status | Rationale |
|---|---|---|---|
| `/` | `/` | 200, content replaced | Same URL, new homepage |
| `/settlement-check-breakdown/` | `/calculators/settlement-check-breakdown/` | Redirect stub | Consistent `/calculators/` IA |
| `/total-loss-offer-calculator/` | `/calculators/total-loss-offer-audit/` | Redirect stub | Consistent IA + name matches brief ("Offer Audit") |
| `/diminished-value-calculator/` | `/calculators/diminished-value-baseline/` | Redirect stub | Consistent IA + name matches brief |
| `/claim-letter-builder/` | `/calculators/claim-letter-builder/` | Redirect stub | Consistent IA |
| `/about.html` | `/about/` | Redirect stub | Clean-URL convention |
| `/contact.html` | `/contact/` | Redirect stub | Clean-URL convention |
| `/disclaimer.html` | `/disclaimer/` | Redirect stub | Clean-URL convention |
| `/privacy-policy.html` | `/privacy/` | Redirect stub | Clean-URL convention |
| `/terms-of-service.html` | `/terms/` | Redirect stub | Clean-URL convention |
| `/404.html` | `/404` | N/A (host-served 404) | Astro/GH Pages 404 handling |

### Retired personal-injury `/calculators/*.html` URLs (deleted 2026-07-19, pre-dating this plan)

These were already removed from the live site during the original pivot
(see `BUILD-LOG.md` D8) — the actual filenames are no longer in the repo to
inspect directly, so this table is reconstructed from `BUILD-LOG.md`'s record
of what existed (4 calculators under a `calculators/` folder: general
personal-injury, car-accident, slip-and-fall, and workers-comp settlement
calculators) plus the confirmation that the domain had **zero Google index
footprint** at the time of deletion (`PHASE-0-RESEARCH.md` §7.3).

| Old URL (reconstructed) | Status | Destination | Rationale |
|---|---|---|---|
| `/calculators/car-accident-settlement-calculator.html` (name approximate) | **410 Gone** | none | Off-topic content (bodily-injury, out of scope per master prompt §1.4). No live indexed equity to preserve (verified zero index footprint before deletion). A 301 to an auto-claim tool would misdirect users who searched for injury-settlement content into an unrelated tool — a bad-faith redirect. 410 is the honest signal. |
| `/calculators/slip-and-fall-settlement-calculator.html` (approximate) | **410 Gone** | none | Same as above. |
| `/calculators/workers-comp-settlement-calculator.html` (approximate) | **410 Gone** | none | Same as above. |
| `/calculators/general-injury-settlement-calculator.html` (approximate) | **410 Gone** | none | Same as above. |

Because these files no longer exist in the working tree (deleted before this
plan), GitHub Pages will already return its default 404 for them today, not a
true 410 — static hosts can't easily distinguish "never existed" from "gone
on purpose" without a dedicated stub. Phase 3 will add thin stub pages at
these exact paths that return real content with a `<meta name="robots"
content="noindex">` and a clear "this content has been retired" message
linking to the four live tools, which is the closest static-host equivalent
of an honest 410 response. Exact historical filenames should be confirmed
against `git log --diff-filter=D` before Phase 3, since this table's paths
are reconstructed from memory of BUILD-LOG.md, not re-verified against the
deletion commit yet.

---

## 4. Design system & components (Phase 1, this session)

Ported from `css/style.css` (green/blue palette kept, per the original
deliberate-deferral decision) into `astro/src/styles/tokens.css`, extended
with the accessibility requirements the plain-HTML site never fully had:

- `:focus-visible` treatment on every interactive element (not just default
  browser outline — a visible, high-contrast ring).
- `prefers-reduced-motion` media query disabling smooth-scroll/transitions.
- Minimum 44×44px touch targets on buttons/inputs on touch viewports.
- A real skip-to-content link (`<a class="skip-link">`), visually hidden
  until focused.
- Semantic landmarks in `BaseLayout.astro`: `<header>`, `<nav aria-label="Primary">`,
  `<main id="main-content">`, `<footer>`.

Shared components (Phase 1): `Header.astro`, `Footer.astro`, `SkipLink.astro`,
`ScenarioCard.astro`, `CalculatorCard.astro`, `TrustBadges.astro`. These
replace the old pattern of hand-copying header/nav/footer HTML into every
page — the exact problem the brief calls out.

---

## 5. Calculator migration approach

Each existing `js/*.js` engine already uses the dual browser/Node export
pattern with integer-cent math — the actual verified formulas are **not**
being rewritten, only ported to typed TypeScript with the same inputs/
outputs, plus a versioned config object (`version`, `effectiveDate`,
`reviewedDate`, `sources: string[]`) and a Vitest suite covering normal,
boundary, empty, invalid, negative, and extreme-input cases (mirroring the
`node -e` sanity tests already run for each tool in `BUILD-LOG.md`, now
formalized as real, repeatable test files instead of ad hoc shell commands).

**This session migrates one tool end-to-end as the reference pattern:
Settlement Check Breakdown** (`src/lib/calculators/settlement-breakdown.ts` +
`tests/settlement-breakdown.test.ts` + `src/pages/calculators/settlement-check-breakdown/index.astro`).
The other three (Total-Loss Offer Audit, Diminished Value Baseline, Claim
Letter Builder) follow the identical pattern in Phase 2 — including the
Total-Loss Offer Audit fix required by the brief: year/mileage/distance are
currently collected but not used in any visible output. The Astro version
adds a disclosed **comparable-quality review** (year difference, mileage
difference, trim/configuration match, geographic distance, listing
date/status, dealer-vs-private-party, condition, insurer-shown adjustments)
as its own labeled section, separate from the mean/median/range/outlier
statistics — never inventing a dollar adjustment, only flagging differences
as "questions to verify." Group statistics require at least 2 comparables to
display, with a conservative confidence label below 3.

---

## 6. Accessibility approach (applies to every page/component going forward)

- Every form control: visible `<label for>`, `aria-describedby` pointing at
  a hint element with units + example value + constraints.
- Inline per-field validation **plus** a focusable error summary
  (`role="alert"` region above the form, listing field-linked errors) —
  not inline-only, which fails for screen-reader users who don't traverse
  field-by-field.
- Results: focus is moved programmatically to the result heading on
  successful submit (`tabindex="-1"` + `.focus()`), so the outcome is
  announced without relying solely on `aria-live` (which some screen
  reader/browser combinations handle inconsistently for large content
  swaps).
- Mobile comparable-entry tables become stacked field groups below a
  breakpoint (not horizontally-scrolled tables), per the brief.
- Decorative emoji/icons get `aria-hidden="true"`; anything conveying real
  information gets real text.
- Manual test matrix before Phase 6 sign-off: keyboard-only navigation and
  screen-reader form completion at 320/390/768/1024/1440px.

---

## 7. Content plan sequencing (Phase 5)

The 15 guides in the brief are grouped into the three guide clusters already
in the IA (`/guides/total-loss/`, `/guides/diminished-value/`,
`/guides/claim-process/`). Each guide gets: real author (David Bennett, per
R3, with the same honest-minimal-bio caveat), published/modified dates,
plain-language summary, worked example, "what varies by state," "what this
guide cannot tell you," primary-source citations inline, a source table,
related calculator/guide links, and a corrections link. No state-specific
legal pages publish until each claim has a real primary source and appears
in `/sources/` — same hard rule as `BUILD-LOG.md`'s state-pilot gate,
carried forward unchanged.

Guide-to-cluster mapping (for Phase 5 planning, not committed to yet):

- **`/guides/total-loss/`**: 1 (how insurers value a totaled vehicle), 2 (CCC/Mitchell/Audatex reports), 3 (finding comps), 4 (mileage/trim/condition errors), 5 (ACV vs. replacement cost/loan/asking price), 6 (tax/title/fees), 7 (owner-retained salvage), 8 (disputing a valuation factually).
- **`/guides/diminished-value/`**: 9 (what DV means), 10 (inherent vs. repair-related DV), 11 (17c formula history/calc/limitations), 12 (building DV market evidence).
- **`/guides/claim-process/`**: 13 (first- vs. third-party claims), 14 (when independent appraisal/legal consultation may help), 15 (evidence checklist).

---

## 8. AdSense, performance, and security (Phase 6/7 — deferred, not built this session)

Tracked here so it isn't forgotten, executed only once Phases 1–5 are done
and the user confirms the site is substantively complete:

- Performance budgets (LCP <2.5s, INP <200ms, CLS <0.1, <50KB JS/tool,
  <300KB initial transfer) — Astro's static-first/minimal-JS-by-default
  model is chosen specifically to make this achievable without special
  effort, but it still needs to be measured, not assumed.
- CSP, `X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy` —
  GitHub Pages cannot set custom HTTP response headers, so CSP will ship as
  a `<meta http-equiv="Content-Security-Policy">` tag (a real, documented
  limitation of this host — a header-capable host or a CDN in front would be
  needed for the stronger `frame-ancestors`/`report-uri` directives that
  only work at the HTTP-header layer, not via `<meta>`). Flagged plainly
  rather than silently claiming full CSP coverage.
- ads.txt / AdSense verification / CMP: nothing until a real publisher ID
  exists, per the brief's own gate and the existing `BUILD-LOG.md` D7 rule.

---

## 9. Execution queue (session-by-session, same "next" convention as BUILD-LOG.md)

- [x] **P1.** Astro project scaffold, design tokens/global CSS, BaseLayout +
      shared components, finished homepage, custom 404, GH Actions deploy
      workflow, CNAME/.nojekyll/robots.txt, and **one** fully migrated
      calculator (Settlement Check Breakdown) with Vitest tests, as the
      reference pattern for the rest. **— this session.**
- [ ] **P2.** Migrate the remaining 3 calculators (Total-Loss Offer Audit
      with the comp-quality-review fix, Diminished Value Baseline, Claim
      Letter Builder) + `/calculators/` index + `/check-my-offer/` routing page.
- [ ] **P3.** Redirect-stub generation for the old plain-HTML URLs (§3
      table) + retired-content stub pages for the 4 historical PI URLs.
- [ ] **P4.** Trust framework pages: `/about/ /methodology/ /editorial-policy/
      /sources/ /corrections/ /advertising-disclosure/ /privacy/ /terms/
      /disclaimer/ /accessibility/ /contact/`.
- [ ] **P5.** First source-backed content cluster — 15 guides across the 3
      guide sections (§7).
- [ ] **P6.** Full accessibility pass + manual keyboard/screen-reader test
      matrix at all 5 breakpoints + Lighthouse/perf budget verification.
- [ ] **P7.** SEO/migration validation (sitemap `lastmod`, robots.txt,
      canonicals, structured data validator, Search Console render check)
      + AdSense-readiness checklist (still not activating ads).
- [ ] **P8.** Cutover: once the user confirms parity, retire the plain-HTML
      root site (only with explicit approval — R5).

---

## 10. Open items requiring the user (not blocking Phase 1, but tracked)

1. GitHub Pages source setting → Actions (manual toggle, §1.1).
2. Real bio/credential specifics for David Bennett, if the trust pages
   should say more than the current minimal line (§0 R3, §1.3).
3. Exact historical filenames of the 4 retired PI calculator URLs, to
   verify against `git log --diff-filter=D` before Phase 3 builds accurate
   stub pages rather than reconstructed-from-memory paths (§3).

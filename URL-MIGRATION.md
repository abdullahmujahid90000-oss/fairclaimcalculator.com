# URL-MIGRATION.md — FairClaimCalculator.com plain-HTML → Astro v2

Internal reference only — not part of the live site, not linked from
navigation, not in the sitemap. The authoritative decision log for *why*
each mapping below exists is `ASTRO-REBUILD-PLAN.md` §3/R9; this file is
the dedicated, complete migration table required as its own deliverable.

**Status as of this document's last update: Phases 1–4 built and verified
on the `astro/` project. The plain-HTML root site described below is still
the live site — none of this has gone live yet. Cutover (Phase 8) requires
explicit owner approval and has not happened.**

---

## 1. How static redirects work on this host

GitHub Pages has no server-side redirect configuration (no `_redirects`
file, no custom HTTP response headers). The static-host equivalent used
throughout this migration is a **meta-refresh + canonical stub**:

```html
<meta http-equiv="refresh" content="0; url=NEW_URL" />
<link rel="canonical" href="NEW_URL" />
```

This is a genuine one-hop redirect from a browser's and a well-behaved
crawler's perspective, and the `rel=canonical` tag is the specific signal
search engines use to consolidate ranking at the new URL — but it is not an
HTTP-layer 301, and this document does not claim otherwise anywhere.

These stubs are generated automatically, not hand-written per page:
`astro/scripts/legacy-paths.mjs` is the manifest (single source of truth),
and `astro/scripts/generate-legacy-stubs.mjs` writes the actual static
files directly into `astro/public/` as an npm `prebuild` step — run before
every `npm run build`, locally and in CI. See `ASTRO-REBUILD-PLAN.md` R9
for why this had to be plain static files rather than Astro page
components (Astro's own `trailingSlash`/`build.format` config cannot
produce a literal flat `.html` file at these legacy paths).

---

## 2. Redirect stubs — old plain-HTML URL → new Astro URL

| # | Old URL (current live site) | New URL | Rationale |
|---|---|---|---|
| 1 | `/` | `/` | Same URL; content fully replaced by the new homepage. |
| 2 | `/settlement-check-breakdown/` | `/calculators/settlement-check-breakdown/` | Consistent `/calculators/` IA. |
| 3 | `/total-loss-offer-calculator/` | `/calculators/total-loss-offer-audit/` | Consistent IA; tool renamed to match the brief ("Offer Audit"). |
| 4 | `/diminished-value-calculator/` | `/calculators/diminished-value-baseline/` | Consistent IA; tool renamed to match the brief ("Baseline"). |
| 5 | `/claim-letter-builder/` | `/calculators/claim-letter-builder/` | Consistent `/calculators/` IA. |
| 6 | `/about.html` | `/about/` | Clean-URL convention (trailing-slash directory routes). |
| 7 | `/contact.html` | `/contact/` | Clean-URL convention. |
| 8 | `/disclaimer.html` | `/disclaimer/` | Clean-URL convention. |
| 9 | `/privacy-policy.html` | `/privacy/` | Clean-URL convention. |
| 10 | `/terms-of-service.html` | `/terms/` | Clean-URL convention. |

Row 1 is a content replacement at cutover, not a stub. Rows 2–10 (9 stubs)
are generated files — verified present at their exact paths in a real
production build (see Phase 3 entry in `BUILD-LOG.md` §6).

`/404.html` → handled by Astro's own `src/pages/404.astro` + GitHub Pages'
custom-404 convention; not a stub, not in this table.

---

## 3. Retired-content stubs — no new equivalent (out of scope, not redirected)

These paths belonged to an earlier, unrelated personal-injury section of
the site, already deleted from the repository on 2026-07-18/07-19 (before
this rebuild began). **Verified via `git log --diff-filter=D --name-only
--all`** — not reconstructed from memory. `PHASE-0-RESEARCH.md` §7.3
confirms the whole domain had zero Google index footprint as of
2026-07-19, so there is no ranking equity a redirect would need to
preserve; redirecting an injury-settlement search to an unrelated
auto-property tool would also misdirect the user, which is why these are
retired rather than redirected.

Each gets a real 200-response page with `<meta name="robots"
content="noindex,follow">` and a plain "this content has been retired"
explanation linking to the four live tools — the closest static-host
equivalent of an honest 410 Gone response.

### 3a. Retired calculators (4)

| Old URL |
|---|
| `/calculators/car-accident-settlement-calculator.html` |
| `/calculators/dog-bite-settlement-calculator.html` |
| `/calculators/slip-and-fall-settlement-calculator.html` |
| `/calculators/workers-comp-settlement-calculator.html` |

### 3b. Retired articles (17 — 16 individual pages + the section index)

| Old URL |
|---|
| `/articles/index.html` |
| `/articles/average-settlement-amounts-by-injury-type.html` |
| `/articles/comparative-negligence-by-state.html` |
| `/articles/dog-bite-laws-by-state.html` |
| `/articles/how-insurance-adjusters-evaluate-claims.html` |
| `/articles/how-long-does-a-settlement-take.html` |
| `/articles/how-the-multiplier-method-works.html` |
| `/articles/how-to-calculate-lost-wages-after-an-accident.html` |
| `/articles/personal-injury-demand-letter.html` |
| `/articles/personal-injury-statute-of-limitations-by-state.html` |
| `/articles/should-you-accept-the-first-settlement-offer.html` |
| `/articles/slip-and-fall-liability-commercial-vs-residential.html` |
| `/articles/structured-settlement-vs-lump-sum.html` |
| `/articles/taxes-on-personal-injury-settlement.html` |
| `/articles/what-is-pain-and-suffering.html` |
| `/articles/what-to-do-after-a-car-accident.html` |
| `/articles/why-insurance-companies-deny-claims.html` |
| `/articles/workers-comp-vs-personal-injury-lawsuit.html` |

21 retired-content stubs total (4 + 17) — verified present at their exact
paths in a real production build, all correctly excluded from the sitemap.

---

## 4. New routes with no old-site equivalent (net-new, not a migration)

These did not exist on the plain-HTML site at all — new IA introduced by
this rebuild, not part of the migration table:

`/check-my-offer/`, `/calculators/` (index), `/methodology/`,
`/editorial-policy/`, `/sources/`, `/corrections/`, `/advertising-disclosure/`,
`/accessibility/`, and (Phase 5, not yet built) `/guides/total-loss/`,
`/guides/diminished-value/`, `/guides/claim-process/` and their 15
individual guide pages.

---

## 5. Verification performed

- Confirmed via a real `npm run build`: every row in §2 and §3 lands at its
  exact byte-for-byte old path in `dist/`, alongside (not colliding with)
  the corresponding new page.
- Confirmed none of the 30 stub paths appear in `dist/sitemap-0.xml`
  (`public/` files are copied verbatim and are never enumerated by the
  `@astrojs/sitemap` integration, which only walks Astro's own page
  routes — this exclusion happens by construction, not by a manual filter).
- Not yet performed: a live crawl/redirect-chain check against the actual
  deployed site (only possible after cutover), and a broken-internal-link
  check against the eventual, fully-linked live site including Phase 5
  guides. Both are Phase 6/7 items.

## 6. What this document does not cover

Cutover itself (when the plain-HTML root site is actually replaced by the
Astro build) is a separate, explicit-approval-gated step — see
`ASTRO-REBUILD-PLAN.md` §9 Phase 8 and R5. This document describes the
migration mapping that cutover will use; it does not authorize or schedule
cutover.

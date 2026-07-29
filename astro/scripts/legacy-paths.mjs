// Single source of truth for the plain-HTML → Astro URL migration.
//
// Every entry here becomes a static file written directly into `public/`
// by `generate-legacy-stubs.mjs` (run as an npm `prebuild` step, so it
// always runs before `astro build`, both locally and in CI). These are
// plain static HTML files, not Astro pages/routes — deliberately, since
// Astro's `trailingSlash: "always"` + `build.format: "directory"` config
// cannot produce a literal flat `about.html` file or a literal
// `calculators/car-accident-settlement-calculator.html` path (tested: an
// `about.html.astro` page file still gets forced into
// `/about.html/index.html`, not `/about.html`). Writing directly to
// `public/` sidesteps that and matches each legacy URL byte-for-byte.
//
// See ASTRO-REBUILD-PLAN.md §3 for the full rationale, and R9 for how
// these paths were verified (git log --diff-filter=D), not reconstructed
// from memory.

// Old plain-HTML site URLs that map to a real, equivalent page on the new
// Astro site. Each becomes a meta-refresh + canonical redirect stub — the
// documented static-host equivalent of a 301 (GitHub Pages has no
// server-side redirect config).
export const REDIRECT_STUBS = [
  { oldFile: "about.html", newPath: "/about/" },
  { oldFile: "contact.html", newPath: "/contact/" },
  { oldFile: "disclaimer.html", newPath: "/disclaimer/" },
  { oldFile: "privacy-policy.html", newPath: "/privacy/" },
  { oldFile: "terms-of-service.html", newPath: "/terms/" },
  { oldFile: "settlement-check-breakdown/index.html", newPath: "/calculators/settlement-check-breakdown/" },
  { oldFile: "total-loss-offer-calculator/index.html", newPath: "/calculators/total-loss-offer-audit/" },
  { oldFile: "diminished-value-calculator/index.html", newPath: "/calculators/diminished-value-baseline/" },
  { oldFile: "claim-letter-builder/index.html", newPath: "/calculators/claim-letter-builder/" },
];

// Old personal-injury-era URLs that have no new equivalent (out of scope —
// this site is vehicle property claims only, never bodily injury) and were
// already deleted from the repo on 2026-07-18/07-19, before this rebuild
// began. Confirmed via `git log --diff-filter=D --name-only --all` — these
// are the exact real historical filenames, not a reconstruction from
// BUILD-LOG.md's prose description. PHASE-0-RESEARCH.md §7.3 confirms the
// whole domain had zero Google index footprint as of 2026-07-19, so there
// is no ranking equity to preserve with a redirect; a static, noindex
// "this content has been retired" stub is the honest static-host
// equivalent of a 410, per ASTRO-REBUILD-PLAN.md §3.
export const RETIRED_STUBS = [
  { oldFile: "calculators/car-accident-settlement-calculator.html", label: "Car Accident Settlement Calculator" },
  { oldFile: "calculators/dog-bite-settlement-calculator.html", label: "Dog Bite Settlement Calculator" },
  { oldFile: "calculators/slip-and-fall-settlement-calculator.html", label: "Slip and Fall Settlement Calculator" },
  { oldFile: "calculators/workers-comp-settlement-calculator.html", label: "Workers' Comp Settlement Calculator" },
  { oldFile: "articles/index.html", label: "Articles index" },
  { oldFile: "articles/average-settlement-amounts-by-injury-type.html", label: "Average Settlement Amounts by Injury Type" },
  { oldFile: "articles/comparative-negligence-by-state.html", label: "Comparative Negligence by State" },
  { oldFile: "articles/dog-bite-laws-by-state.html", label: "Dog Bite Laws by State" },
  { oldFile: "articles/how-insurance-adjusters-evaluate-claims.html", label: "How Insurance Adjusters Evaluate Claims" },
  { oldFile: "articles/how-long-does-a-settlement-take.html", label: "How Long Does a Settlement Take" },
  { oldFile: "articles/how-the-multiplier-method-works.html", label: "How the Multiplier Method Works" },
  { oldFile: "articles/how-to-calculate-lost-wages-after-an-accident.html", label: "How to Calculate Lost Wages After an Accident" },
  { oldFile: "articles/personal-injury-demand-letter.html", label: "Personal Injury Demand Letter" },
  { oldFile: "articles/personal-injury-statute-of-limitations-by-state.html", label: "Personal Injury Statute of Limitations by State" },
  { oldFile: "articles/should-you-accept-the-first-settlement-offer.html", label: "Should You Accept the First Settlement Offer" },
  { oldFile: "articles/slip-and-fall-liability-commercial-vs-residential.html", label: "Slip and Fall Liability: Commercial vs. Residential" },
  { oldFile: "articles/structured-settlement-vs-lump-sum.html", label: "Structured Settlement vs. Lump Sum" },
  { oldFile: "articles/taxes-on-personal-injury-settlement.html", label: "Taxes on a Personal Injury Settlement" },
  { oldFile: "articles/what-is-pain-and-suffering.html", label: "What Is Pain and Suffering" },
  { oldFile: "articles/what-to-do-after-a-car-accident.html", label: "What to Do After a Car Accident" },
  { oldFile: "articles/why-insurance-companies-deny-claims.html", label: "Why Insurance Companies Deny Claims" },
  { oldFile: "articles/workers-comp-vs-personal-injury-lawsuit.html", label: "Workers' Comp vs. Personal Injury Lawsuit" },
];

/**
 * Ad-eligibility configuration layer. Kept fully disabled by default —
 * see ADSENSE-READINESS.md at the repo root for the full policy this
 * enforces, and the activation gate that must be met (and the owner must
 * explicitly confirm) before ADSENSE_ENABLED is ever flipped to true.
 *
 * This module intentionally contains no publisher ID, no ad-network
 * script tags, and no environment-variable indirection that could
 * silently flip ads on via a build-time secret. Enabling ads is a
 * deliberate code change to this file, reviewed like any other change —
 * not a config toggle that can drift.
 */

/** Master switch. Do not flip this without: (1) a real, verified AdSense
 * publisher ID, (2) a working consent/CMP integration, (3) the owner's
 * explicit sign-off that the ADSENSE-READINESS.md activation gate is met.
 * See ADSENSE-READINESS.md §1. */
export const ADSENSE_ENABLED = false;

/**
 * Route-level ad eligibility. Nothing is eligible yet — no page has been
 * run through the content/policy checklist in ADSENSE-READINESS.md §3,
 * so every route defaults to ineligible until explicitly added here with
 * a dated note recording when and against what checklist it passed.
 *
 * When a route IS added here in the future, it must not be one of the
 * permanently-ineligible route categories in `NEVER_ELIGIBLE_PATTERNS`
 * below — `isAdEligible` enforces that ordering (deny-list wins).
 */
const ELIGIBLE_ROUTES: ReadonlySet<string> = new Set([
  // Per-page checklist (ADSENSE-READINESS.md §4) run 2026-08-08 against all
  // 23 published guides: each has substantial original content (361–1,146
  // words of real prose/tables, not padding), is not templated or mass-
  // generated, carries a genuine reviewedDate, and has every factual claim
  // logged in SOURCE-REGISTER.md and reflected on /sources/. All 23 passed.
  // This only pre-populates the allow-list for whenever ads are eventually
  // enabled — ADSENSE_ENABLED stays false regardless (see top of file), and
  // NEVER_ELIGIBLE_PATTERNS still wins over anything listed here.

  // Total Loss cluster (10)
  "/guides/total-loss/how-insurers-value-a-total-loss-vehicle/", // checklist passed 2026-08-08
  "/guides/total-loss/reading-your-total-loss-valuation-report/", // checklist passed 2026-08-08
  "/guides/total-loss/finding-your-own-comparable-vehicles/", // checklist passed 2026-08-08
  "/guides/total-loss/common-valuation-report-errors/", // checklist passed 2026-08-08
  "/guides/total-loss/how-to-dispute-a-total-loss-valuation/", // checklist passed 2026-08-08
  "/guides/total-loss/owner-retained-total-loss-and-salvage-titles/", // checklist passed 2026-08-08
  "/guides/total-loss/sales-tax-title-fees-on-a-total-loss/", // checklist passed 2026-08-08
  "/guides/total-loss/acv-vs-replacement-cost-loan-payoff-asking-price/", // checklist passed 2026-08-08
  "/guides/total-loss/state-total-loss-threshold-laws/", // checklist passed 2026-08-08
  "/guides/total-loss/gap-insurance-loan-lease-after-total-loss/", // checklist passed 2026-08-08

  // Diminished Value cluster (6)
  "/guides/diminished-value/what-is-diminished-value/", // checklist passed 2026-08-08
  "/guides/diminished-value/inherent-vs-repair-related-diminished-value/", // checklist passed 2026-08-08
  "/guides/diminished-value/the-17c-formula-history-calculation-and-limits/", // checklist passed 2026-08-08
  "/guides/diminished-value/building-diminished-value-market-evidence/", // checklist passed 2026-08-08
  "/guides/diminished-value/state-laws-first-party-diminished-value-claims/", // checklist passed 2026-08-08
  "/guides/diminished-value/leased-vehicle-diminished-value/", // checklist passed 2026-08-08

  // Claim Process cluster (7)
  "/guides/claim-process/first-party-vs-third-party-auto-claims/", // checklist passed 2026-08-08
  "/guides/claim-process/when-to-consider-an-independent-appraisal-or-attorney/", // checklist passed 2026-08-08
  "/guides/claim-process/auto-claim-evidence-checklist/", // checklist passed 2026-08-08
  "/guides/claim-process/rental-car-loss-of-use-reimbursement/", // checklist passed 2026-08-08
  "/guides/claim-process/how-to-respond-to-a-lowball-offer/", // checklist passed 2026-08-08
  "/guides/claim-process/filing-a-complaint-with-your-state-insurance-department/", // checklist passed 2026-08-08
  "/guides/claim-process/diminished-value-vs-total-loss-which-claim/", // checklist passed 2026-08-08

  // Note: the /glossary/ page and guide/calculator hub index pages
  // (/guides/, /guides/total-loss/, etc.) were deliberately NOT added —
  // they're navigational/reference pages, not the kind of long-form
  // content this checklist is meant to certify. Re-assess separately if
  // ads are ever enabled.
]);

/**
 * Route categories that must NEVER carry an ad placement, even after
 * ADSENSE_ENABLED is true and even if a path here were mistakenly also
 * added to ELIGIBLE_ROUTES above. This list is deliberately broad and
 * pattern-based rather than an exact-path allowlist, because new routes
 * of these kinds (a new calculator, a new error state) should be
 * ineligible by default without needing this file edited every time.
 */
const NEVER_ELIGIBLE_PATTERNS: RegExp[] = [
  /^\/404\/?$/, // error page
  /^\/check-my-offer\/?$/, // routing quiz — a form/decision flow, not content
  /^\/calculators\/[^/]+\/?$/, // every calculator page itself (forms, live results, print views)
  /^\/(about|methodology|editorial-policy|sources|corrections|advertising-disclosure|privacy|terms|disclaimer|accessibility|contact)\/?$/, // legal/trust/support pages
];

/**
 * Returns whether a given site-relative path (e.g. "/guides/total-loss/foo/")
 * may show an ad placement. Deny-list (NEVER_ELIGIBLE_PATTERNS) always wins
 * over the allow-list (ELIGIBLE_ROUTES). Returns false for absolutely
 * everything while ADSENSE_ENABLED is false, regardless of either list —
 * that check is first and unconditional so this function can be called
 * safely from anywhere without needing a separate top-level guard.
 */
export function isAdEligible(path: string): boolean {
  if (!ADSENSE_ENABLED) return false;
  if (NEVER_ELIGIBLE_PATTERNS.some((pattern) => pattern.test(path))) return false;
  return ELIGIBLE_ROUTES.has(path);
}

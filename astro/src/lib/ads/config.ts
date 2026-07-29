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
  // Intentionally empty. Add real paths here only after ADSENSE-READINESS.md's
  // per-page checklist has actually been run against that page, with a
  // dated comment, e.g.: "/guides/total-loss/how-insurers-value-a-total-loss-vehicle/", // checklist passed 2026-XX-XX
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

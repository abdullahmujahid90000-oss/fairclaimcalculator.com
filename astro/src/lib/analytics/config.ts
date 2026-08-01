/**
 * Analytics configuration. Mirrors the pattern in `lib/ads/config.ts`:
 * a single, explicit, literal switch — not an environment variable that
 * could silently flip behavior via a build secret.
 *
 * This site uses Google Analytics 4 (via gtag.js) in first-party,
 * consent-gated mode only. See `components/CookieConsent.astro` for the
 * actual consent logic. The measurement ID below is not loaded or
 * requested from Google at all until a visitor affirmatively accepts —
 * see that component for why this is the stricter reading of "no
 * non-essential tracking before consent," not just Google's minimum
 * Consent Mode default-deny behavior.
 */

/** Master switch. Setting this to false removes analytics entirely —
 * no banner, no gtag stub, nothing — regardless of visitor consent. */
export const ANALYTICS_ENABLED = true;

/** GA4 measurement ID, provided by the site owner 2026-08-01. */
export const GA_MEASUREMENT_ID = "G-Y0W2ZWVGLZ";

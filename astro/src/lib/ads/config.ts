/**
 * AdSense configuration. Two independent switches, set in this order:
 *
 *   1. ADSENSE_PUBLISHER_ID — paste your real "ca-pub-XXXXXXXXXXXXXXXX" ID
 *      here as soon as you create the AdSense account. On its own this only
 *      adds the `google-adsense-account` verification meta tag to every page
 *      and generates /ads.txt at build time (scripts/generate-ads-txt.mjs).
 *      No ad script loads and no ad request is made. This is what Google's
 *      review needs to find on the live site before it will approve it.
 *
 *   2. ADS_SERVING_ENABLED — flip to true only AFTER AdSense emails you that
 *      the site is approved AND you have turned on Google's own consent
 *      message (AdSense → Privacy & messaging → European regulations + U.S.
 *      state regulations). That loads adsbygoogle.js sitewide, which enables
 *      Auto ads (if turned on in AdSense) and fills the <AdSlot> units below.
 *
 * Full step-by-step process: ADSENSE-SUBMISSION-PLAYBOOK.md at the repo root.
 */

/** Real AdSense publisher ID, e.g. "ca-pub-1234567890123456". Empty = not set up yet. Never invent one. */
export const ADSENSE_PUBLISHER_ID = "";

/** Master switch for actually serving ads. Requires a publisher ID. */
export const ADS_SERVING_ENABLED = false;

/**
 * Optional manual ad-unit IDs (AdSense → Ads → By ad unit → Display ads →
 * copy the `data-ad-slot` number). A slot left empty renders nothing, and
 * Auto ads alone decide placement instead.
 */
export const AD_UNIT_IDS = {
  /** Guides: after the introduction, before the main body. */
  "guide-top": "",
  /** Guides: after the main body, before the Sources box. */
  "guide-bottom": "",
  /** Calculators: after the FAQ — far below the form, buttons and results. */
  "calculator-after-faq": "",
} as const;

export type AdSlotName = keyof typeof AD_UNIT_IDS;

export const ADSENSE_READY = /^ca-pub-\d{16}$/.test(ADSENSE_PUBLISHER_ID);
export const ADS_ACTIVE = ADSENSE_READY && ADS_SERVING_ENABLED;

/**
 * Routes that must NEVER carry a manual ad placement. Error, legal/trust and
 * support pages add nothing for readers when monetized and draw reviewer
 * scrutiny. Calculators are NOT excluded: the placement there sits after the
 * FAQ, well away from inputs, buttons and results, which is what AdSense's
 * "accidental click" policy actually requires.
 */
const NEVER_ELIGIBLE_PATTERNS: RegExp[] = [
  /^\/404\/?$/,
  /^\/check-my-offer\/?$/, // routing quiz — a decision flow, not content
  /^\/(about|methodology|editorial-policy|sources|corrections|advertising-disclosure|privacy|terms|disclaimer|accessibility|contact)\/?$/,
];

/** Content sections where manual units may appear. */
const ELIGIBLE_PREFIXES = ["/guides/", "/calculators/"];

/** Returns whether a site-relative path may show a manual ad unit. */
export function isAdEligible(path: string): boolean {
  if (!ADS_ACTIVE) return false;
  if (NEVER_ELIGIBLE_PATTERNS.some((pattern) => pattern.test(path))) return false;
  return ELIGIBLE_PREFIXES.some((prefix) => path.startsWith(prefix));
}

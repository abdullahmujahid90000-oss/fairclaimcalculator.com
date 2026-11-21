// Which templated state pages search engines may index.
//
// On 2026-11-08 the 51 state total-loss threshold pages measured 89–94%
// identical text to each other (only the state name and one percentage
// differ). That is the "scaled content" pattern Google's spam policies
// demote, and it can drag down the whole site and an AdSense review. They
// stay live (noindex,follow, out of the sitemap) and the hub page keeps the
// full 51-state table, until each is rewritten with genuinely
// state-specific substance (statute citation, state rules, examples).
//
// When a state page has been rewritten that way, add its slug here
// (e.g. "minnesota"). Used by the page template and the sitemap filter.
//
// 2026-11-21: every page was rebuilt around its own statute, details and
// change history (src/lib/content/state-threshold-facts.ts). These 21
// measured under 0.60 against their most similar sibling (word-level
// difflib ratio of <main>, `python3 scripts/audit-site.py --similarity`)
// and their rule is confirmed. The other 30 measured 0.60–0.66 and need
// more state-specific substance (roadmap topic 17). States whose rule could
// not be confirmed (Mississippi, New Hampshire, New Mexico, Utah) stay out
// whatever they measure.
export const INDEXED_THRESHOLD_STATE_SLUGS = [
  "alaska",
  "arkansas",
  "california",
  "connecticut",
  "florida",
  "georgia",
  "hawaii",
  "illinois",
  "indiana",
  "kentucky",
  "massachusetts",
  "michigan",
  "minnesota",
  "new-jersey",
  "new-york",
  "north-dakota",
  "pennsylvania",
  "rhode-island",
  "south-dakota",
  "virginia",
  "washington",
];

export const THRESHOLD_STATE_PATH = "/guides/total-loss/state-total-loss-threshold-laws/";

/** True for a built URL or path of a threshold state page that must stay out of search. */
export function isNoindexThresholdStatePage(urlOrPath) {
  const path = urlOrPath.replace(/^https?:\/\/[^/]+/, "");
  if (!path.startsWith(THRESHOLD_STATE_PATH)) return false;
  const slug = path.slice(THRESHOLD_STATE_PATH.length).replace(/\/$/, "");
  return slug !== "" && !INDEXED_THRESHOLD_STATE_SLUGS.includes(slug);
}

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
export const INDEXED_THRESHOLD_STATE_SLUGS = [];

export const THRESHOLD_STATE_PATH = "/guides/total-loss/state-total-loss-threshold-laws/";

/** True for a built URL or path of a threshold state page that must stay out of search. */
export function isNoindexThresholdStatePage(urlOrPath) {
  const path = urlOrPath.replace(/^https?:\/\/[^/]+/, "");
  if (!path.startsWith(THRESHOLD_STATE_PATH)) return false;
  const slug = path.slice(THRESHOLD_STATE_PATH.length).replace(/\/$/, "");
  return slug !== "" && !INDEXED_THRESHOLD_STATE_SLUGS.includes(slug);
}

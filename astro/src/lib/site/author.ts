/**
 * Who stands behind the content. The owner chose (2026-11-07) to publish
 * under a team byline rather than a personal name. Never replace this with
 * an invented individual: a made-up person behind money/legal (YMYL)
 * content is a trust problem for Google and for AdSense review. A team
 * byline backed by sources, methodology and corrections pages is honest.
 *
 * Fill in the optional fields with REAL details only. Each renders on
 * /about/ and in the schema only once it has a value.
 */
export const AUTHOR = {
  name: "FairClaimCalculator Editorial Team",
  role: "Research & Editorial",
  /** Short label for small avatar badges. */
  initials: "FC",
  /** Short real bio: background, why you built this site, how you research. 2–4 sentences. */
  bio: "",
  /** Path under public/, e.g. "/images/team-logo.png" (square, at least 400×400). */
  photo: "",
  /** Real public profiles, e.g. LinkedIn, X, a personal site. */
  profiles: [] as string[],
  /** Anchor on /about/ that bylines link to. */
  aboutHref: "/about/#who-runs-it",
};

/** Author schema (an Organization, since the byline is a team) — only emitted with fields that have values. */
export function authorSchema(siteOrigin: string): Record<string, unknown> {
  const schema: Record<string, unknown> = {
    "@type": "Organization",
    name: AUTHOR.name,
    url: `${siteOrigin}${AUTHOR.aboutHref}`,
  };
  if (AUTHOR.bio) schema.description = AUTHOR.bio;
  if (AUTHOR.photo) schema.logo = `${siteOrigin}${AUTHOR.photo}`;
  if (AUTHOR.profiles.length > 0) schema.sameAs = AUTHOR.profiles;
  return schema;
}

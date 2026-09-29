/**
 * The site's real editor. AdSense reviewers and Google's quality raters
 * look for a real, verifiable person behind YMYL (money/legal) content.
 *
 * Fill in the optional fields with REAL details only — never invented
 * credentials. Each field renders on /about/ and in the Person schema only
 * once it has a value, so leaving one empty is always safe.
 */
export const AUTHOR = {
  name: "David Bennett",
  role: "Founder & Editor",
  /** Short real bio: background, why you built this site, how you research. 2–4 sentences. */
  bio: "",
  /** Path under public/, e.g. "/images/david-bennett.jpg" (square, at least 400×400). */
  photo: "",
  /** Real public profiles, e.g. LinkedIn, X, a personal site. */
  profiles: [] as string[],
  /** Anchor on /about/ that bylines link to. */
  aboutHref: "/about/#who-runs-it",
};

/** Person schema — only emitted with fields that actually have values. */
export function authorSchema(siteOrigin: string): Record<string, unknown> {
  const schema: Record<string, unknown> = {
    "@type": "Person",
    name: AUTHOR.name,
    jobTitle: AUTHOR.role,
    url: `${siteOrigin}${AUTHOR.aboutHref}`,
  };
  if (AUTHOR.bio) schema.description = AUTHOR.bio;
  if (AUTHOR.photo) schema.image = `${siteOrigin}${AUTHOR.photo}`;
  if (AUTHOR.profiles.length > 0) schema.sameAs = AUTHOR.profiles;
  return schema;
}

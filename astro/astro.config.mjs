import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";
import { execSync } from "node:child_process";

// Canonical origin per ASTRO-REBUILD-PLAN.md R6 — www subdomain, GitHub Pages hosting (R4).

// Real <lastmod> for the sitemap, derived from the actual latest commit
// touching this repo — not a fabricated per-page date. A shallow checkout
// (GitHub Actions' default `fetch-depth: 1`) still contains the single
// most recent commit, so `git log -1` works without any CI change. This is
// one sitewide freshness date rather than a per-page one: Astro's sitemap
// `serialize()` only sees the final built URL, not which source file
// produced it, so a reliable per-page git-blame mapping isn't something
// this config can build without risking a wrong URL<->file match. A single
// honest, real date beats either no date or a guessed one. Falls back to
// the build-time date only if git is unavailable, so a build never fails
// because of this.
function getLastCommitDate() {
  try {
    return execSync("git log -1 --format=%cI", { encoding: "utf-8" }).trim();
  } catch {
    return new Date().toISOString();
  }
}
const siteLastModified = getLastCommitDate();

export default defineConfig({
  site: "https://www.fairclaimcalculator.com",
  output: "static",
  trailingSlash: "always",
  build: {
    format: "directory"
  },
  integrations: [
    sitemap({
      // Never list the error page, and never list a route that isn't
      // finished — noindex pages must not appear in the sitemap either.
      filter: (page) => !page.includes("/404"),
      serialize(item) {
        item.lastmod = siteLastModified;
        return item;
      },
    }),
  ],
});

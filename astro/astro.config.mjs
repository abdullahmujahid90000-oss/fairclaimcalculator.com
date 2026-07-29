import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";

// Canonical origin per ASTRO-REBUILD-PLAN.md R6 — www subdomain, GitHub Pages hosting (R4).
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
    }),
  ],
});

import { defineConfig } from "astro/config";

// Canonical origin per ASTRO-REBUILD-PLAN.md R6 — www subdomain, GitHub Pages hosting (R4).
export default defineConfig({
  site: "https://www.fairclaimcalculator.com",
  output: "static",
  trailingSlash: "always",
  build: {
    format: "directory"
  }
});

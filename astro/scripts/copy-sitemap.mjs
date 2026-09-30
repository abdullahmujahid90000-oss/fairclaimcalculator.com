// Publishes /sitemap.xml as a copy of Astro's sitemap-0.xml after every
// build. The site's canonical sitemap is /sitemap-index.xml (see
// robots.txt), but /sitemap.xml is where many tools look by default and
// where the pre-Astro site's sitemap used to live, so an old Search Console
// submission of that URL keeps working instead of failing.
import { copyFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const dist = join(dirname(fileURLToPath(import.meta.url)), "..", "dist");
await copyFile(join(dist, "sitemap-0.xml"), join(dist, "sitemap.xml"));
console.log("[sitemap.xml] copied from sitemap-0.xml");

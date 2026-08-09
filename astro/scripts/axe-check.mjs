// Automated accessibility audit: runs the real axe-core WCAG rule engine
// (via jsdom, headlessly — no live URL or browser needed) against every
// built .html page under dist/, including the ~27 legacy redirect/retired
// stub pages copied verbatim from public/ (not just Astro-routed pages —
// an earlier version of this script missed those; see BUILD-LOG.md).
//
// Run after `npm run build`: `npm run audit:a11y`
//
// Notes:
// - axe-core is loaded via `dom.window.eval(axeSource)` rather than a normal
//   import, because it expects to execute inside a real browser-like window
//   context, not reference Node globals set after the fact.
// - `color-contrast` is disabled: jsdom doesn't do real CSS layout/rendering,
//   so contrast checks would be meaningless. Contrast is verified by hand
//   against the site's fixed, small color palette instead.
// - A fresh JSDOM instance is created per file (not one shared instance with
//   `innerHTML` swapped between pages) because `innerHTML` assignment doesn't
//   re-parse the `<html>` tag's own attributes (e.g. `lang="en-US"`), which
//   caused false-positive `html-has-lang` violations in an earlier version.
// - `resources: "usable"` is intentionally omitted (it tries to fetch linked
//   CSS/images over the network per page) — axe's structural/semantic rules
//   don't need it, and omitting it is what keeps the full 81-page scan to
//   ~18s instead of timing out.

import { JSDOM } from "jsdom";
import { readFileSync, readdirSync } from "node:fs";
import { dirname, join, relative, sep } from "node:path";
import { fileURLToPath } from "node:url";

const scriptDir = dirname(fileURLToPath(import.meta.url));
const distDir = join(scriptDir, "..", "dist");
const axeSource = readFileSync(join(scriptDir, "..", "node_modules", "axe-core", "axe.min.js"), "utf8");

function walk(dir, acc) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) walk(full, acc);
    else if (entry.name.endsWith(".html")) acc.push(full);
  }
}

const files = [];
walk(distDir, files);
files.sort();

let totalViolations = 0;
const summary = [];

for (const file of files) {
  const html = readFileSync(file, "utf8");
  const dom = new JSDOM(html, {
    url: "https://www.fairclaimcalculator.com/",
    runScripts: "dangerously",
  });
  dom.window.eval(axeSource);

  const rel = relative(distDir, file).split(sep).join("/");
  const route = rel === "index.html" ? "/" : rel.endsWith("/index.html") ? "/" + rel.slice(0, -"index.html".length) : "/" + rel;

  try {
    const results = await dom.window.axe.run(dom.window.document, {
      rules: { "color-contrast": { enabled: false } },
    });
    if (results.violations.length > 0) {
      summary.push({ route: route || "/", violations: results.violations });
      totalViolations += results.violations.length;
    }
  } catch (err) {
    console.log(`ERROR on ${file}: ${err.message}`);
  } finally {
    dom.window.close();
  }
}

console.log(`Checked ${files.length} pages.`);
console.log(`Pages with violations: ${summary.length}`);
console.log(`Total violation instances: ${totalViolations}`);
console.log("---");
for (const s of summary) {
  console.log(`\n${s.route}`);
  for (const v of s.violations) {
    console.log(`  [${v.impact}] ${v.id}: ${v.help} (${v.nodes.length} node(s))`);
    for (const n of v.nodes.slice(0, 3)) console.log(`      target: ${n.target.join(" ")}`);
  }
}
process.exit(0);

// Writes dist/llms.txt (https://llmstxt.org) after every build: a plain
// Markdown map of the site's calculators and guides, taken from each built
// page's own <title> and meta description, so it never drifts from the
// site. Helps AI assistants (ChatGPT, Perplexity, Claude, Gemini) find and
// cite the right page. Runs in `postbuild`.

import { readFile, readdir, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const SITE = "https://www.fairclaimcalculator.com";
const dist = join(dirname(fileURLToPath(import.meta.url)), "..", "dist");

const decode = (s) =>
  s.replace(/&amp;/g, "&").replace(/&#39;/g, "'").replace(/&quot;/g, '"').replace(/&lt;/g, "<").replace(/&gt;/g, ">");

async function pageInfo(route) {
  const html = await readFile(join(dist, route, "index.html"), "utf-8");
  const title = decode(html.match(/<title>([^<]*)/)?.[1] ?? route).replace(/ \| FairClaimCalculator$/, "");
  const description = decode(html.match(/<meta name="description" content="([^"]*)"/)?.[1] ?? "");
  return `- [${title}](${SITE}/${route}/): ${description}`;
}

async function section(dir) {
  const entries = await readdir(join(dist, dir), { withFileTypes: true });
  const routes = entries.filter((e) => e.isDirectory()).map((e) => `${dir}/${e.name}`).sort();
  return Promise.all(routes.map(pageInfo));
}

const lines = [
  "# FairClaimCalculator",
  "",
  "> Free, private, U.S.-focused calculators and source-cited guides for auditing auto insurance total-loss and diminished-value claim offers. Every calculation runs in the browser and shows its full arithmetic. Educational only — not legal advice.",
  "",
  "## Calculators",
  "",
  ...(await section("calculators")),
];

for (const [dir, name] of [
  ["guides/total-loss", "Total-loss guides"],
  ["guides/diminished-value", "Diminished-value guides"],
  ["guides/claim-process", "Claim-process guides"],
]) {
  lines.push("", `## ${name}`, "", ...(await section(dir)));
}

lines.push(
  "",
  "## About",
  "",
  `- [About and editor](${SITE}/about/)`,
  `- [Methodology](${SITE}/methodology/)`,
  `- [Sources](${SITE}/sources/)`,
  `- [Editorial policy](${SITE}/editorial-policy/)`,
  "",
);

await writeFile(join(dist, "llms.txt"), lines.join("\n"));
console.log("[llms.txt] written");

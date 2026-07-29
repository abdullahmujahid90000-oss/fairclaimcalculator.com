// Generates static redirect/retired stub files at exact legacy URLs into
// `public/`, so they end up at the identical byte-for-byte path in `dist/`
// after `astro build` copies `public/` verbatim. Run automatically before
// every build via npm's `prebuild` lifecycle hook (see package.json) — do
// not call `astro build` directly without this step, or these legacy URLs
// will 404 once the plain-HTML root site is retired at cutover.
//
// Why this lives outside Astro's own page-routing system: see the header
// comment in legacy-paths.mjs. Astro's `trailingSlash: "always"` +
// `build.format: "directory"` config cannot emit a literal flat file like
// `about.html` or `calculators/dog-bite-settlement-calculator.html` from a
// normal page component — tested directly, confirmed it forces every
// route (even ones already ending in `.html`) into `<name>/index.html`.

import { mkdir, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { REDIRECT_STUBS, RETIRED_STUBS } from "./legacy-paths.mjs";

const SITE_ORIGIN = "https://www.fairclaimcalculator.com";
const scriptDir = dirname(fileURLToPath(import.meta.url));
const publicDir = join(scriptDir, "..", "public");

function escapeHtml(value) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function pageShell({ title, robots, body }) {
  return `<!doctype html>
<html lang="en-US">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>${escapeHtml(title)}</title>
${robots ? `<meta name="robots" content="${robots}" />\n` : ""}<style>
  body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; color: #1f2937; background: #fff; max-width: 640px; margin: 15vh auto 40px; padding: 0 20px; line-height: 1.6; }
  h1 { color: #0f3d21; font-size: 1.4rem; }
  a { color: #14532d; }
  .stub-note { color: #5b6472; font-size: 0.9rem; margin-top: 24px; }
</style>
</head>
<body>
${body}
</body>
</html>
`;
}

async function writeStub(oldFile, html) {
  const outPath = join(publicDir, oldFile);
  await mkdir(dirname(outPath), { recursive: true });
  await writeFile(outPath, html, "utf8");
}

async function generateRedirectStubs() {
  for (const { oldFile, newPath } of REDIRECT_STUBS) {
    const newUrl = `${SITE_ORIGIN}${newPath}`;
    const html = pageShell({
      title: "This page has moved",
      robots: null,
      body: `<meta http-equiv="refresh" content="0; url=${escapeHtml(newUrl)}" />
<link rel="canonical" href="${escapeHtml(newUrl)}" />
<h1>This page has moved</h1>
<p>This page now lives at <a href="${escapeHtml(newUrl)}">${escapeHtml(newUrl)}</a>. You should be redirected automatically.</p>`,
    });
    await writeStub(oldFile, html);
  }
}

async function generateRetiredStubs() {
  const toolLinks = `<ul>
  <li><a href="${SITE_ORIGIN}/calculators/settlement-check-breakdown/">Settlement Check Breakdown</a></li>
  <li><a href="${SITE_ORIGIN}/calculators/total-loss-offer-audit/">Total-Loss Offer Audit</a></li>
  <li><a href="${SITE_ORIGIN}/calculators/diminished-value-baseline/">Diminished Value Baseline</a></li>
  <li><a href="${SITE_ORIGIN}/calculators/claim-letter-builder/">Claim Letter &amp; Evidence Packet Builder</a></li>
</ul>`;
  for (const { oldFile, label } of RETIRED_STUBS) {
    const html = pageShell({
      title: `Retired: ${label}`,
      robots: "noindex,follow",
      body: `<h1>This content has been retired</h1>
<p>"${escapeHtml(label)}" was part of an earlier, unrelated personal-injury section of this
site and has been permanently removed. FairClaimCalculator now covers only U.S. auto
total-loss and diminished-value <em>property</em> claims — never bodily-injury claims.</p>
<p>If you're working on a vehicle total-loss or diminished-value claim, one of these free
calculators may help:</p>
${toolLinks}
<p><a href="${SITE_ORIGIN}/">Go to the homepage →</a></p>
<p class="stub-note">This page intentionally returns a normal 200 response with a
"noindex" tag (the static-host equivalent of a 410 Gone) rather than a broken link,
so anyone who finds an old link gets an honest explanation instead of a dead page.</p>`,
    });
    await writeStub(oldFile, html);
  }
}

await generateRedirectStubs();
await generateRetiredStubs();

console.log(
  `[generate-legacy-stubs] wrote ${REDIRECT_STUBS.length} redirect stub(s) and ${RETIRED_STUBS.length} retired-content stub(s) into public/.`,
);

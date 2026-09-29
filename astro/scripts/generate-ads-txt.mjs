// Writes public/ads.txt from the publisher ID in src/lib/ads/config.ts, so
// the ID lives in exactly one place. With no ID set, any stale ads.txt is
// removed rather than shipping a fake or empty one. Runs in `prebuild`.

import { readFile, writeFile, rm } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const config = await readFile(join(root, "src/lib/ads/config.ts"), "utf-8");
const match = config.match(/ADSENSE_PUBLISHER_ID\s*=\s*"([^"]*)"/);
const publisherId = match ? match[1] : "";
const adsTxtPath = join(root, "public/ads.txt");

if (/^ca-pub-\d{16}$/.test(publisherId)) {
  const pubId = publisherId.replace(/^ca-/, "");
  await writeFile(adsTxtPath, `google.com, ${pubId}, DIRECT, f08c47fec0942fa0\n`);
  console.log(`[ads.txt] written for ${pubId}`);
} else {
  if (publisherId !== "") {
    throw new Error(`ADSENSE_PUBLISHER_ID "${publisherId}" is not a valid ca-pub-XXXXXXXXXXXXXXXX ID`);
  }
  await rm(adsTxtPath, { force: true });
  console.log("[ads.txt] skipped — no publisher ID set yet");
}

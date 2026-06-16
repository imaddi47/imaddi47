#!/usr/bin/env node
/**
 * Check that every external URL referenced in src/lib/data.ts is reachable.
 * Catches dead project links, moved repos, and stale product domains.
 *
 * Usage: node scripts/check-links.mjs   (exit code 1 if any link is dead)
 */

import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const here = dirname(fileURLToPath(import.meta.url));
const DATA = join(here, "..", "src", "lib", "data.ts");

const TIMEOUT_MS = 12_000;
// Hosts that routinely block bots — a non-2xx here isn't necessarily broken.
const BOT_HOSTILE = ["linkedin.com", "medium.com", "google.com"];

async function head(url) {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), TIMEOUT_MS);
  try {
    let res = await fetch(url, { method: "HEAD", redirect: "follow", signal: ctrl.signal, headers: { "User-Agent": "link-check" } });
    if (res.status === 405 || res.status === 501) {
      res = await fetch(url, { method: "GET", redirect: "follow", signal: ctrl.signal, headers: { "User-Agent": "link-check" } });
    }
    return res.status;
  } catch (err) {
    return err.name === "AbortError" ? "timeout" : "unreachable";
  } finally {
    clearTimeout(t);
  }
}

const src = await readFile(DATA, "utf8");
const urls = [...new Set((src.match(/https?:\/\/[^\s"'`)]+/g) || []).map((u) => u.replace(/[.,]+$/, "")))].sort();

console.log(`\n  Checking ${urls.length} links from data.ts\n`);
let dead = 0;
for (const url of urls) {
  const status = await head(url);
  const ok = typeof status === "number" && status >= 200 && status < 400;
  const lenient = BOT_HOSTILE.some((h) => url.includes(h));
  const mark = ok ? "ok " : lenient ? "?? " : "DEAD";
  if (!ok && !lenient) dead++;
  console.log(`  [${mark}] ${String(status).padEnd(11)} ${url}`);
}

console.log(
  dead === 0
    ? `\n  ✓ all links reachable (?? = host blocks bots; verify in a browser)\n`
    : `\n  ✗ ${dead} dead link(s) above — fix in src/lib/data.ts\n`,
);
process.exit(dead === 0 ? 0 : 1);

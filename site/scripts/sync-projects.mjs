#!/usr/bin/env node
/**
 * Sync the "open source" projects from GitHub.
 *
 * Fetches imaddi47's public repos, computes commit counts + top languages,
 * keeps the ones with real history, and prints:
 *   1. a report table, and
 *   2. a paste-ready `Project[]` snippet for the open-source block in
 *      src/lib/data.ts (between the // <auto:projects> … </auto:projects> markers).
 *
 * It never auto-edits files (so your hand-written blurbs and the private
 * products stay intact) — review the output and paste what you want.
 *
 * Usage:
 *   node scripts/sync-projects.mjs               # default owner imaddi47, min 10 commits
 *   node scripts/sync-projects.mjs --min 5       # lower the commit threshold
 *   GITHUB_TOKEN=ghp_… node scripts/sync-projects.mjs   # higher rate limit
 */

const OWNER = process.env.GH_OWNER || "imaddi47";
const MIN_COMMITS = Number(process.argv.includes("--min") ? process.argv[process.argv.indexOf("--min") + 1] : 10);
const ONGOING_DAYS = 120;

const headers = {
  "User-Agent": `${OWNER}-portfolio-sync`,
  Accept: "application/vnd.github+json",
  ...(process.env.GITHUB_TOKEN ? { Authorization: `Bearer ${process.env.GITHUB_TOKEN}` } : {}),
};

const ACRONYMS = new Set([
  "aws", "ssm", "sso", "api", "ui", "ux", "vpn", "cli", "ai", "ml", "db", "s3",
  "os", "js", "ts", "3d", "http", "rest", "sdk", "ci", "cd", "qr", "ftp", "gpt",
]);

const titleCase = (name) =>
  name
    .split(/[-_.]/)
    .filter(Boolean)
    .map((w) => (ACRONYMS.has(w.toLowerCase()) ? w.toUpperCase() : w[0].toUpperCase() + w.slice(1)))
    .join(" ");

async function gh(path) {
  const res = await fetch(`https://api.github.com${path}`, { headers });
  if (!res.ok) throw new Error(`GitHub ${res.status} on ${path} — ${(await res.text()).slice(0, 120)}`);
  return { json: await res.json(), link: res.headers.get("link") || "" };
}

async function commitCount(repo) {
  const { json, link } = await gh(`/repos/${OWNER}/${repo}/commits?per_page=1`);
  const m = link.match(/[?&]page=(\d+)>;\s*rel="last"/);
  return m ? Number(m[1]) : Array.isArray(json) ? json.length : 0;
}

async function topLangs(repo) {
  const { json } = await gh(`/repos/${OWNER}/${repo}/languages`);
  return Object.entries(json).sort((a, b) => b[1] - a[1]).slice(0, 3).map(([k]) => k);
}

async function main() {
  const repos = [];
  for (let page = 1; ; page++) {
    const { json } = await gh(`/users/${OWNER}/repos?per_page=100&page=${page}&sort=pushed`);
    repos.push(...json);
    if (json.length < 100) break;
  }

  const candidates = repos.filter(
    (r) => !r.fork && !r.archived && r.name.toLowerCase() !== OWNER.toLowerCase(),
  );

  const enriched = [];
  for (const r of candidates) {
    const commits = await commitCount(r.name);
    if (commits < MIN_COMMITS) continue;
    const langs = await topLangs(r.name);
    const pushedDaysAgo = (Date.now() - new Date(r.pushed_at).getTime()) / 86_400_000;
    enriched.push({
      name: r.name,
      title: titleCase(r.name),
      description: r.description || "",
      commits,
      stars: r.stargazers_count,
      langs,
      href: r.html_url,
      year: String(new Date(r.pushed_at).getFullYear()),
      status: pushedDaysAgo <= ONGOING_DAYS ? "ongoing" : "shipped",
    });
  }
  enriched.sort((a, b) => b.commits - a.commits);

  console.log(`\n  ${OWNER} — public repos with ≥ ${MIN_COMMITS} commits (sorted by commits)\n`);
  console.log("  commits  stars  status    repo");
  console.log("  " + "-".repeat(60));
  for (const e of enriched) {
    console.log(
      `  ${String(e.commits).padStart(7)}  ${String(e.stars).padStart(5)}  ${e.status.padEnd(8)}  ${e.name}  [${e.langs.join(", ")}]`,
    );
  }

  console.log(`\n  Paste-ready snippet for the // <auto:projects> block in src/lib/data.ts`);
  console.log(`  (review the blurbs — they default to the GitHub description):\n`);
  const block = enriched
    .map(
      (e) => `  {
    id: ${JSON.stringify(e.name)},
    title: ${JSON.stringify(e.title)},
    blurb: ${JSON.stringify(e.description)},
    meta: { year: ${JSON.stringify(e.year)}, stack: ${JSON.stringify(e.langs)}, kind: "Open source" },
    href: ${JSON.stringify(e.href)},
    status: ${JSON.stringify(e.status)},
  },`,
    )
    .join("\n");
  console.log(block + "\n");
}

main().catch((err) => {
  console.error("\n  sync-projects failed:", err.message, "\n");
  process.exit(1);
});

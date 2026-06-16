#!/usr/bin/env node
/**
 * Pull the latest posts from the blog's RSS feed (blog.debugblackbox.com/feed,
 * which surfaces Ankit's Medium) and print a paste-ready `writings` snippet for
 * src/lib/data.ts. Read/print only — it never edits files.
 *
 * Usage:
 *   node scripts/sync-writing.mjs            # latest 4 posts
 *   node scripts/sync-writing.mjs --n 6      # latest 6
 */

const FEED = process.env.BLOG_FEED || "https://blog.debugblackbox.com/feed";
const N = Number(process.argv.includes("--n") ? process.argv[process.argv.indexOf("--n") + 1] : 4);

const strip = (s) =>
  s
    .replace(/<!\[CDATA\[|\]\]>/g, "")
    .replace(/<[^>]+>/g, " ")
    .replace(/&[a-z]+;/gi, " ")
    .replace(/\s+/g, " ")
    .trim();

const tag = (block, name) => {
  const m = block.match(new RegExp(`<${name}[^>]*>([\\s\\S]*?)</${name}>`, "i"));
  return m ? m[1] : "";
};

const monthYear = (d) => {
  const date = new Date(d);
  return isNaN(date) ? "" : date.toLocaleDateString("en-US", { month: "short", year: "numeric" });
};

async function main() {
  const res = await fetch(FEED, { headers: { "User-Agent": "writing-sync" } });
  if (!res.ok) throw new Error(`feed ${res.status}`);
  const xml = await res.text();

  const items = [...xml.matchAll(/<item>([\s\S]*?)<\/item>/gi)].map((m) => m[1]).slice(0, N);
  if (!items.length) {
    console.log("\n  No <item> entries found in the feed.\n");
    return;
  }

  const entries = items.map((it) => {
    const title = strip(tag(it, "title"));
    const href = strip(tag(it, "link")).split("?")[0];
    const date = monthYear(strip(tag(it, "pubDate")));
    const body = strip(tag(it, "content:encoded") || tag(it, "description"));
    const excerpt = body.length > 150 ? body.slice(0, 147).replace(/\s+\S*$/, "") + "…" : body;
    return { title, href, date, excerpt };
  });

  console.log(`\n  Latest ${entries.length} posts from ${FEED}\n`);
  for (const e of entries) console.log(`  • ${e.date.padEnd(9)} ${e.title}`);

  console.log(`\n  Paste-ready snippet for the \`writings\` array in src/lib/data.ts`);
  console.log(`  (trim the excerpts to taste):\n`);
  const block = entries
    .map(
      (e) => `  {
    title: ${JSON.stringify(e.title)},
    excerpt: ${JSON.stringify(e.excerpt)},
    date: ${JSON.stringify(e.date)},
    href: ${JSON.stringify(e.href)},
  },`,
    )
    .join("\n");
  console.log(block + "\n");
}

main().catch((err) => {
  console.error("\n  sync-writing failed:", err.message, "\n");
  process.exit(1);
});

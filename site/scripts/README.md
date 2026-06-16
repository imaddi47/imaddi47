# Content scripts

Helpers for keeping the site's content current. Both are dependency-free
(Node 20+), read/print only, and never edit files for you — you stay in control
of the wording.

| Command | What it does |
|---|---|
| `pnpm sync:projects` | Pulls your public GitHub repos, computes commit counts + top languages, keeps the ones with real history (≥ 10 commits), and prints a **report** plus a **paste-ready `Project[]` snippet** for the open-source block in `src/lib/data.ts`. |
| `pnpm check:links` | Fetches every external URL in `src/lib/data.ts` and reports which are dead. Run it before shipping — it catches moved/renamed repos and stale product domains. |

## How to update each section

All content lives in `src/lib/data.ts`. Edit it, push to `main`, and the site redeploys itself.

- **Projects**
  - *Live products* (closed-source, e.g. SSM Dojo, OpenVPN Manager): edit the `products` array by hand — they aren't on GitHub.
  - *Open-source repos*: run `pnpm sync:projects`, review the printed snippet, and paste what you want **between the `// <auto:projects>` … `// </auto:projects>` markers**. Tidy the blurbs (they default to the GitHub description). Then `pnpm check:links`.
- **Now** — edit the `now` array (the "A current note" section).
- **Writing** — edit the `writings` array; replace the titles/dates with real posts.
- **Stack** — edit the `stack` object.
- **Contact / handles** — edit the `meta` object.
- **Stats numbers** (GH joined, repo count) — `src/components/sections/about.tsx`.

## Options

```bash
pnpm sync:projects --min 5          # lower the commit threshold (default 10)
GITHUB_TOKEN=ghp_… pnpm sync:projects   # raise the GitHub API rate limit
```

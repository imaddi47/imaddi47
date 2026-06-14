# site — imaddi47 portfolio

A single-page portfolio with a 3D railway that snakes through the content. Lives at
**[imaddi47.github.io/imaddi47](https://imaddi47.github.io/imaddi47/)**.

## Stack

| Layer | Choice |
|---|---|
| Framework | Next.js 16 (App Router, Turbopack), static-exported |
| Language | TypeScript 5 |
| Styling | Tailwind v4 + CSS variables |
| 2D motion | `motion` (Framer Motion successor) v12 |
| 3D | `three` + `@react-three/fiber` + `@react-three/drei` |
| Fonts | Archivo (display) · Newsreader (body) · JetBrains Mono (mono) — via `next/font/google` |

## Aesthetic

"Industrial Steam" — dark charcoal-coffee ground (`#181410`), brass (`#c8973f`) and
oxblood (`#b4472b`) accents, cream ink (`#ece2d2`). Tokens live in `globals.css` under
`@theme inline`; components use `bg-paper` / `text-ink` / `text-accent` etc., never raw hex.

The page is a vertical sequence of sections. A locomotive rides a 3D track that **snakes
left↔right** down the page; each section takes the half opposite the train (collapses to a
single column below `lg`). Order and per-section side come from `src/lib/snake.ts`.

## Interactions

- **Snaking 3D railway** (`components/rail3d/`) — a fixed full-viewport R3F `<Canvas>` behind the content. The track is built in document space; the world group is offset by `scrollY` each frame so it scrolls with the page, and the locomotive rides it by scroll progress. Cream rails on sleepers, trackside trees, brass station lamps, a drifting axonometric camera. Desktop + WebGL only.
- **Footer locomotive** (`loco-clip.tsx`) — a turntable engine you can **drag to rotate** (drei `OrbitControls`, auto-rotates when idle).
- **Custom cursor**, **Reveal/Stagger** (IntersectionObserver), and a **magnetic** effect on footer links. All motion honors `prefers-reduced-motion`.

## Run locally

```bash
pnpm install
pnpm dev          # http://localhost:3000  (Node 20+)
pnpm build        # static export → ./out
```

## Run with Docker

Builds the static export and serves it with nginx.

```bash
docker compose up --build      # → http://localhost:3000
# or
docker build -t imaddi47-portfolio . && docker run -p 3000:80 imaddi47-portfolio
```

## Deploy

Pushing to `main` (anything under `site/**`) triggers `.github/workflows/deploy.yml`,
which static-exports and publishes to **GitHub Pages**. `PAGES_BASE_PATH` is set to the
project base path so assets resolve under `/imaddi47`. Nothing else to do — it's automatic.

## ✅ Keeping it current

All copy lives in **`src/lib/data.ts`** — editing content shouldn't need JSX changes.
Push to `main` and the site redeploys itself.

| When… | Edit |
|---|---|
| You ship a repo worth featuring | `projects` in `src/lib/data.ts` **and** the "Selected work" table in the root [`README.md`](../README.md) |
| Your current focus changes | `now` in `src/lib/data.ts` (the "A current note" section) |
| You publish a blog post | `writings` in `src/lib/data.ts` — replace the titles/dates with the real posts |
| Your toolset shifts | `stack` in `src/lib/data.ts` |
| Contact handle / role changes | `meta` in `src/lib/data.ts` |
| Repo count / "GH joined" is stale | `STATS` in `src/components/sections/about.tsx` |
| You add/remove a section | `src/lib/snake.ts` (order + which side the train takes) + `src/app/page.tsx` |

**Do this periodically (≈monthly):** refresh `now`, confirm the featured `projects` still
represent your best work, and bump any year references.

## File layout

```
src/
├── app/                  layout.tsx · page.tsx · globals.css
├── components/
│   ├── cursor.tsx        custom two-layer cursor
│   ├── reveal.tsx        IntersectionObserver fade-rise + Stagger
│   ├── magnetic.tsx      mouse-following nudge (footer links)
│   ├── clock.tsx         live IST clock
│   ├── header.tsx        sticky chapter nav
│   ├── snake-row.tsx     lays a section into one half (opposite the train)
│   ├── sections/         hero · about · projects · instruments · writing · now · footer
│   └── rail3d/
│       ├── snake-rail.tsx     fixed canvas + scroll/measurement wiring
│       ├── snake-scene.tsx    document-space track, rails, sleepers, stations, camera
│       ├── locomotive.tsx     the scroll-riding engine model
│       ├── tree.tsx           low-poly checkpoint conifer
│       └── loco-clip.tsx      drag-to-rotate footer turntable
└── lib/
    ├── data.ts           all content: meta · projects · stack · now · writings
    └── snake.ts          section order + train/content side per section
```

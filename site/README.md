# site — portfolio.imaddi47

Editorial-aesthetic portfolio for [@imaddi47](https://github.com/imaddi47).

## Stack

| Layer | Choice |
|---|---|
| Framework | Next.js 16 (App Router, Turbopack) |
| Type system | TypeScript 5 |
| Styling | Tailwind v4 + CSS variables |
| Motion | `motion` (formerly Framer Motion) v12 |
| Programmatic animation | Remotion 4 (for the publisher's-mark signature) |
| Fonts | Instrument Serif · Newsreader · JetBrains Mono — via `next/font/google` |
| Icons | Lucide (currently unused — kept as an option) |

## Aesthetic

A printed editorial / field journal. Warm paper bg `#f2eee3`, ink `#13110d`, single accent of burnt sienna `#b8410e`. Two serifs (display + body) plus a single monospace for marginalia. Deliberately not a SaaS landing page.

The page is composed as six "chapters":

| | |
|---|---|
| `§I` | **Field Notes** — orientation prose with editorial dropcap |
| `§II` | **Specimens** — five featured repositories as catalog entries |
| `§III` | **Instruments** — categorized stack list (no logo grid) |
| `§IV` | **Writing** — essay teasers + link to `blog.debugblackbox.com` |
| `§V` | **Now** — a field log of what's in front of me |
| `§VI` | **Colophon** — inverted-palette footer with publisher's mark |

## Notable interactions

- **Custom cursor** — small ink dot + outline ring with two-spring lerp. Expands on hover targets, swaps to an accent disc with mono label (`open`) over project cards. Hides on touch devices via `(hover: hover) and (pointer: fine)`.
- **Parallax** — section-level scroll-based Y translation on background marks (giant roman numerals).
- **Reveal / Stagger** — `IntersectionObserver`-based fade+rise per content block.
- **Magnetic CTA** — used sparingly on the footer contact links.
- **Remotion signature** — programmatic AK monogram that draws stroke-by-stroke, holds, fades, and loops. Plays via `@remotion/player`.

All motion honors `prefers-reduced-motion: reduce`.

## Run locally

```bash
pnpm install
pnpm dev
```

Defaults to `http://localhost:3000`. Requires Node 20+.

## Deploy

The app is configured for the standard Vercel / Next-on-Node deploy. For static export to GitHub Pages, add `output: "export"` to `next.config.ts` and run `pnpm build` — there are no dynamic routes or server actions, so static export works without modification.

## File layout

```
src/
├── app/
│   ├── layout.tsx     — fonts, root html, mounts <Cursor/>
│   ├── page.tsx       — composes sections in order
│   └── globals.css    — Tailwind import + theme tokens + paper grain
├── components/
│   ├── cursor.tsx     — two-layer custom cursor with springs
│   ├── parallax.tsx   — scroll-based Y transform wrapper
│   ├── reveal.tsx     — IntersectionObserver fade-rise + Stagger
│   ├── magnetic.tsx   — mouse-following nudge wrapper
│   ├── clock.tsx      — live IST clock (updates every 15s)
│   ├── header.tsx     — sticky chapter nav with active anchor
│   ├── sections/
│   │   ├── hero.tsx           (§ top — italic display name)
│   │   ├── about.tsx          (§I)
│   │   ├── projects.tsx       (§II)
│   │   ├── instruments.tsx    (§III)
│   │   ├── writing.tsx        (§IV)
│   │   ├── now.tsx            (§V)
│   │   └── footer.tsx         (§VI)
│   └── remotion/
│       ├── signature.tsx              — <Player> wrapper
│       └── signature-composition.tsx  — animated AK monogram
└── lib/
    ├── data.ts        — bio, projects, stack, writings, now log
    └── utils.ts       — cn() helper (clsx + tailwind-merge)
```

All copy lives in `src/lib/data.ts`. Editing content shouldn't require touching JSX.

## Notes for review

- Tailwind tokens (`bg-paper`, `text-ink`, `text-accent`, etc.) are defined in `globals.css` under `@theme inline` — components must use these, not arbitrary hex.
- Each section uses an asymmetric 12-column grid. Resist the urge to center anything.
- Section dividers are `<hr className="rule" />`, not `<div>`. `.rule` sets a 1px top border on the hr.
- The custom cursor adds the class `has-custom-cursor` to `<html>` only on devices with a fine pointer — this is what hides the system cursor via CSS.

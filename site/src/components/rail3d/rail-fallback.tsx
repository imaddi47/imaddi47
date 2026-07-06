"use client";

import { useEffect, useMemo, useRef } from "react";
import type { SnakeStation } from "./snake-scene";

/**
 * A GPU-free stand-in for the 3D railway, shown when WebGL can't run smoothly
 * (software rasterisers, blocklisted drivers, weak integrated GPUs). It's drawn
 * once as SVG in document coordinates, so the track scrolls with the page on
 * the compositor thread — no per-frame WebGL render, no jank, smooth anywhere.
 * The engine is a small glyph pinned mid-viewport that follows the track's x
 * via a single transform write per scroll frame.
 */

type Props = {
  width: number;
  docHeight: number;
  stations: SnakeStation[];
  activeId: string;
  reduced: boolean;
  onSelect: (id: string) => void;
};

const GAUGE = 11; // half the gap between the two rails, in px
const SLEEPER_W = 28; // tie width (drawn as a fat dashed stroke)

/** Catmull-Rom → cubic Bézier: one smooth path through the given points. */
function smoothPath(pts: { x: number; y: number }[]): string {
  if (pts.length === 0) return "";
  if (pts.length === 1) return `M ${pts[0].x} ${pts[0].y}`;
  let d = `M ${pts[0].x.toFixed(1)} ${pts[0].y.toFixed(1)}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[i - 1] ?? pts[i];
    const p1 = pts[i];
    const p2 = pts[i + 1];
    const p3 = pts[i + 2] ?? p2;
    const c1x = p1.x + (p2.x - p0.x) / 6;
    const c1y = p1.y + (p2.y - p0.y) / 6;
    const c2x = p2.x - (p3.x - p1.x) / 6;
    const c2y = p2.y - (p3.y - p1.y) / 6;
    d += ` C ${c1x.toFixed(1)} ${c1y.toFixed(1)}, ${c2x.toFixed(1)} ${c2y.toFixed(1)}, ${p2.x.toFixed(1)} ${p2.y.toFixed(1)}`;
  }
  return d;
}

function LocoGlyph() {
  return (
    <svg width="34" height="50" viewBox="0 0 34 50" fill="none" aria-hidden>
      <rect x="7" y="7" width="20" height="33" rx="5" fill="#2b2620" stroke="var(--accent)" strokeWidth="2" />
      <rect x="12" y="15" width="10" height="7" rx="2" fill="#ff7a33" />
      <rect x="13" y="1.5" width="8" height="6" rx="2" fill="var(--accent)" />
      <circle cx="17" cy="43" r="3.4" fill="#ffd27a" />
      <circle cx="5.5" cy="17" r="3" fill="var(--accent)" />
      <circle cx="28.5" cy="17" r="3" fill="var(--accent)" />
      <circle cx="5.5" cy="31" r="3" fill="var(--accent)" />
      <circle cx="28.5" cy="31" r="3" fill="var(--accent)" />
    </svg>
  );
}

export function RailFallback({ width, docHeight, stations, activeId, reduced, onSelect }: Props) {
  const trainRef = useRef<HTMLDivElement>(null);
  const raf = useRef(0);
  const cx = width / 2;

  const sorted = useMemo(() => [...stations].sort((a, b) => a.y - b.y), [stations]);

  const paths = useMemo(() => {
    const pts = sorted.map((s) => ({ x: cx + s.x, y: s.y }));
    return {
      sleepers: smoothPath(pts),
      leftRail: smoothPath(pts.map((p) => ({ x: p.x - GAUGE, y: p.y }))),
      rightRail: smoothPath(pts.map((p) => ({ x: p.x + GAUGE, y: p.y }))),
    };
  }, [sorted, cx]);

  // Screen-space x of the track at a given document y (same smoothstep as the 3D).
  const trackXAt = useMemo(() => {
    return (docY: number) => {
      if (sorted.length === 0) return cx;
      if (docY <= sorted[0].y) return cx + sorted[0].x;
      const last = sorted[sorted.length - 1];
      if (docY >= last.y) return cx + last.x;
      for (let i = 0; i < sorted.length - 1; i++) {
        const a = sorted[i];
        const b = sorted[i + 1];
        if (docY >= a.y && docY <= b.y) {
          const raw = (docY - a.y) / Math.max(1, b.y - a.y);
          const t = raw * raw * (3 - 2 * raw);
          return cx + a.x + (b.x - a.x) * t;
        }
      }
      return cx + last.x;
    };
  }, [sorted, cx]);

  // Engine follows the track's x at mid-viewport — one transform per frame, so it
  // rides the native scroll on the compositor and stays perfectly smooth.
  useEffect(() => {
    const place = () => {
      raf.current = 0;
      const el = trainRef.current;
      if (!el) return;
      const x = trackXAt(window.scrollY + window.innerHeight / 2);
      el.style.transform = `translateX(${x.toFixed(1)}px) translate(-50%, -50%)`;
    };
    const onScroll = () => {
      if (raf.current) return;
      raf.current = requestAnimationFrame(place);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", place);
    place();
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", place);
      if (raf.current) cancelAnimationFrame(raf.current);
    };
  }, [trackXAt]);

  if (width === 0 || sorted.length < 2) return null;

  return (
    <>
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 z-0 hidden overflow-hidden lg:block"
        style={{ height: docHeight }}
      >
        <svg
          width="100%"
          height={docHeight}
          viewBox={`0 0 ${width} ${docHeight}`}
          preserveAspectRatio="none"
          style={{ position: "absolute", inset: 0 }}
        >
          <path d={paths.sleepers} fill="none" stroke="var(--accent-soft)" strokeWidth={SLEEPER_W} strokeLinecap="butt" strokeDasharray="4 20" opacity={0.4} vectorEffect="non-scaling-stroke" />
          <path d={paths.leftRail} fill="none" stroke="var(--accent)" strokeWidth={2.5} opacity={0.7} vectorEffect="non-scaling-stroke" />
          <path d={paths.rightRail} fill="none" stroke="var(--accent)" strokeWidth={2.5} opacity={0.7} vectorEffect="non-scaling-stroke" />
          {sorted.map((s) => {
            const active = s.id === activeId;
            return (
              <circle
                key={s.id}
                cx={cx + s.x}
                cy={s.y}
                r={active ? 7 : 4.5}
                fill={active ? "var(--accent)" : "var(--paper)"}
                stroke="var(--accent)"
                strokeWidth={2}
                vectorEffect="non-scaling-stroke"
              />
            );
          })}
        </svg>

        {sorted.map((s) => {
          const active = s.id === activeId;
          const inward = s.x <= 0 ? 1 : -1; // label points toward page centre
          return (
            <button
              key={s.id}
              onClick={() => onSelect(s.id)}
              data-cursor="hover"
              className="pointer-events-auto absolute flex items-center gap-2 whitespace-nowrap border-0 bg-transparent p-0 font-mono"
              style={{
                top: s.y,
                left: cx + s.x + inward * 20,
                transform: `translate(${inward < 0 ? "-100%" : "0"}, -50%)`,
                cursor: "pointer",
              }}
            >
              <span
                style={{
                  fontSize: 10, letterSpacing: 0.5, padding: "2px 6px", borderRadius: 3,
                  color: active ? "var(--paper)" : "var(--ink)",
                  background: active ? "var(--accent)" : "transparent",
                  border: active ? "none" : "1px solid var(--rule-strong)",
                }}
              >
                {s.numeral}
              </span>
              <span className="uppercase" style={{ fontSize: 10, letterSpacing: 0.8, color: "var(--ink)", opacity: active ? 0.92 : 0.4 }}>
                {s.label}
              </span>
            </button>
          );
        })}
      </div>

      {/* engine — pinned mid-viewport, riding the track's x */}
      <div
        aria-hidden
        ref={trainRef}
        className="pointer-events-none fixed left-0 top-1/2 z-0 hidden lg:block"
        style={reduced ? undefined : { transition: "transform 80ms linear" }}
      >
        <LocoGlyph />
      </div>
    </>
  );
}

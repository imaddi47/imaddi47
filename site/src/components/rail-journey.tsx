"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";

/**
 * A fixed railway that runs down the left gutter. A locomotive rides the track
 * and its position along the rail equals the page's scroll progress, so the
 * whole page reads as a journey. Each section is a station; the engine "arrives"
 * as that section reaches the middle of the viewport. The track behind the
 * engine is energized (accent); the track ahead is faint.
 */

type Pt = { x: number; y: number };

type Station = {
  id: string;
  numeral: string;
  label: string;
  frac: number; // scroll fraction at which this station is centered
  x: number;
  y: number;
};

const SECTIONS: { id: string; numeral: string; label: string }[] = [
  { id: "top", numeral: "—", label: "Cover" },
  { id: "field-notes", numeral: "I", label: "Field Notes" },
  { id: "specimens", numeral: "II", label: "Specimens" },
  { id: "instruments", numeral: "III", label: "Instruments" },
  { id: "writing", numeral: "IV", label: "Writing" },
  { id: "now", numeral: "V", label: "Now" },
  { id: "colophon", numeral: "VI", label: "Colophon" },
];

const RAIL_W = 172; // gutter wide enough for the track + station signs
const GAUGE = 22; // distance between the two rails
const CENTER_X = 52;
const AMP = 17; // how far the track weaves left/right
const WEAVES = 3;
const AVATAR = "https://avatars.githubusercontent.com/u/77939876?v=4";
const AVATAR_CY = 52;
const AVATAR_R = 26;
const TOP_PAD = 152; // start the track below the depot so the resting engine clears its label
const BOT_PAD = 56;

function smoothPath(points: Pt[]): string {
  if (points.length < 2) return "";
  let d = `M ${points[0].x.toFixed(2)} ${points[0].y.toFixed(2)}`;
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[i - 1] ?? points[i];
    const p1 = points[i];
    const p2 = points[i + 1];
    const p3 = points[i + 2] ?? p2;
    const c1x = p1.x + (p2.x - p0.x) / 6;
    const c1y = p1.y + (p2.y - p0.y) / 6;
    const c2x = p2.x - (p3.x - p1.x) / 6;
    const c2y = p2.y - (p3.y - p1.y) / 6;
    d += ` C ${c1x.toFixed(2)} ${c1y.toFixed(2)} ${c2x.toFixed(2)} ${c2y.toFixed(2)} ${p2.x.toFixed(2)} ${p2.y.toFixed(2)}`;
  }
  return d;
}

function clamp(n: number, lo = 0, hi = 1) {
  return Math.max(lo, Math.min(hi, n));
}

export function RailJourney() {
  const [height, setHeight] = useState(0);
  const [centerD, setCenterD] = useState("");
  const [leftD, setLeftD] = useState("");
  const [rightD, setRightD] = useState("");
  const [sleepers, setSleepers] = useState<{ a: Pt; b: Pt }[]>([]);
  const [stations, setStations] = useState<Station[]>([]);
  const [activeId, setActiveId] = useState<string>("top");
  const [reduced, setReduced] = useState(false);

  const containerRef = useRef<HTMLDivElement | null>(null);
  const measureRef = useRef<SVGPathElement | null>(null);
  const engineRef = useRef<SVGGElement | null>(null);
  const progressRef = useRef<SVGPathElement | null>(null);
  const totalLenRef = useRef(0);
  const rafRef = useRef(0);
  const stationsRef = useRef<Station[]>([]);

  useEffect(() => {
    stationsRef.current = stations;
  }, [stations]);

  // Measure the rail's pixel height (mount + whenever the viewport resizes).
  useLayoutEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const measure = () => setHeight(el.clientHeight);
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // Rebuild the centerline path whenever the measured height changes.
  useLayoutEffect(() => {
    if (height <= 0) return;
    const span = Math.max(1, height - TOP_PAD - BOT_PAD);
    const N = 14;
    const pts: Pt[] = [];
    for (let i = 0; i <= N; i++) {
      const t = i / N;
      pts.push({
        x: CENTER_X + AMP * Math.sin(t * Math.PI * WEAVES),
        y: TOP_PAD + t * span,
      });
    }
    setCenterD(smoothPath(pts));
  }, [height]);

  // After the centerline renders, sample it to build rails, sleepers, stations.
  const rebuild = useCallback(() => {
    const path = measureRef.current;
    const container = containerRef.current;
    if (!path || !container) return;

    const total = path.getTotalLength();
    if (!total) return;
    totalLenRef.current = total;

    const samples = 120;
    const center: Pt[] = [];
    for (let i = 0; i <= samples; i++) {
      const p = path.getPointAtLength((i / samples) * total);
      center.push({ x: p.x, y: p.y });
    }

    const left: Pt[] = [];
    const right: Pt[] = [];
    const ties: { a: Pt; b: Pt }[] = [];
    for (let i = 0; i <= samples; i++) {
      const prev = center[Math.max(0, i - 1)];
      const next = center[Math.min(samples, i + 1)];
      const tx = next.x - prev.x;
      const ty = next.y - prev.y;
      const len = Math.hypot(tx, ty) || 1;
      // unit normal
      const nx = -ty / len;
      const ny = tx / len;
      const c = center[i];
      left.push({ x: c.x + nx * (GAUGE / 2), y: c.y + ny * (GAUGE / 2) });
      right.push({ x: c.x - nx * (GAUGE / 2), y: c.y - ny * (GAUGE / 2) });
      if (i % 4 === 0) {
        const ext = GAUGE / 2 + 4;
        ties.push({
          a: { x: c.x + nx * ext, y: c.y + ny * ext },
          b: { x: c.x - nx * ext, y: c.y - ny * ext },
        });
      }
    }
    setLeftD(smoothPath(left));
    setRightD(smoothPath(right));
    setSleepers(ties);

    // Stations: map each section's centered-scroll fraction onto the track.
    const doc = document.documentElement;
    const vh = window.innerHeight;
    const scrollable = Math.max(1, doc.scrollHeight - vh);
    const built: Station[] = [];
    for (const s of SECTIONS) {
      const elSec = document.getElementById(s.id);
      if (!elSec) continue;
      const rect = elSec.getBoundingClientRect();
      const top = rect.top + window.scrollY;
      const frac = clamp((top + rect.height / 2 - vh / 2) / scrollable);
      const p = path.getPointAtLength(frac * total);
      built.push({ ...s, frac, x: p.x, y: p.y });
    }
    setStations(built);
  }, []);

  useLayoutEffect(() => {
    if (!centerD) return;
    // Two frames: let the measuring path commit, then sample.
    const id = requestAnimationFrame(() => requestAnimationFrame(rebuild));
    return () => cancelAnimationFrame(id);
  }, [centerD, rebuild]);

  // Reduced-motion + late relayout (webfonts shift section offsets, which moves
  // stations). Height changes are handled by the ResizeObserver above.
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const onMQ = () => setReduced(mq.matches);
    mq.addEventListener("change", onMQ);

    const onResize = () => rebuild();
    window.addEventListener("resize", onResize);
    window.addEventListener("load", rebuild);
    const t = setTimeout(rebuild, 600); // after webfonts settle layout
    return () => {
      mq.removeEventListener("change", onMQ);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("load", rebuild);
      clearTimeout(t);
    };
  }, [rebuild]);

  // Drive the engine from scroll.
  useEffect(() => {
    const update = () => {
      rafRef.current = 0;
      const path = measureRef.current;
      const engine = engineRef.current;
      const total = totalLenRef.current;
      if (!path || !engine || !total) return;

      const doc = document.documentElement;
      const scrollable = Math.max(1, doc.scrollHeight - window.innerHeight);
      const progress = clamp(window.scrollY / scrollable);

      const dist = progress * total;
      const p = path.getPointAtLength(dist);
      const ahead = path.getPointAtLength(Math.min(dist + 1.5, total));
      const angle = (Math.atan2(ahead.y - p.y, ahead.x - p.x) * 180) / Math.PI - 90;
      engine.setAttribute("transform", `translate(${p.x.toFixed(2)} ${p.y.toFixed(2)}) rotate(${angle.toFixed(2)})`);

      if (progressRef.current) {
        progressRef.current.style.strokeDashoffset = String(1 - progress);
      }

      // active station = last one whose fraction we've passed (with small lead)
      const list = stationsRef.current;
      let id = list[0]?.id ?? "top";
      for (const s of list) {
        if (progress + 0.04 >= s.frac) id = s.id;
      }
      setActiveId((prev) => (prev === id ? prev : id));
    };

    const onScroll = () => {
      if (rafRef.current) return;
      rafRef.current = requestAnimationFrame(update);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    update();
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [stations.length]);

  const goTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: reduced ? "auto" : "smooth", block: "start" });
  };

  return (
    <aside
      aria-label="Page progress railway"
      className="pointer-events-none fixed left-0 top-0 z-30 hidden h-screen lg:block"
      style={{ width: RAIL_W }}
    >
      <div ref={containerRef} className="absolute inset-0">
        {height > 0 && (
          <svg
            width={RAIL_W}
            height={height}
            viewBox={`0 0 ${RAIL_W} ${height}`}
            fill="none"
            className="absolute inset-0"
            style={{ overflow: "visible" }}
          >
            <defs>
              <clipPath id="rj-avatar-clip">
                <circle cx={CENTER_X} cy={AVATAR_CY} r={AVATAR_R} />
              </clipPath>
            </defs>

            {/* hidden measuring centerline (real units) */}
            <path ref={measureRef} d={centerD} stroke="none" fill="none" />

            {/* connector from the depot down to the first rail point */}
            <line
              x1={CENTER_X}
              y1={AVATAR_CY + AVATAR_R + 2}
              x2={CENTER_X}
              y2={TOP_PAD}
              stroke="var(--ink)"
              strokeOpacity={0.32}
              strokeWidth={1.4}
            />

            {/* sleepers */}
            {sleepers.map((t, i) => (
              <line
                key={i}
                x1={t.a.x}
                y1={t.a.y}
                x2={t.b.x}
                y2={t.b.y}
                stroke="var(--ink)"
                strokeOpacity={0.18}
                strokeWidth={2.4}
                strokeLinecap="round"
              />
            ))}

            {/* the two physical rails */}
            <path d={leftD} stroke="var(--ink)" strokeOpacity={0.32} strokeWidth={1.6} />
            <path d={rightD} stroke="var(--ink)" strokeOpacity={0.32} strokeWidth={1.6} />

            {/* energized (traveled) centerline */}
            <path
              ref={progressRef}
              d={centerD}
              stroke="var(--accent)"
              strokeWidth={2.6}
              strokeLinecap="round"
              pathLength={1}
              strokeDasharray={1}
              strokeDashoffset={1}
              style={{ transition: "none" }}
            />

            {/* station signposts */}
            {stations.map((s) => {
              if (s.id === "top") return null; // the depot medallion is the origin
              const active = s.id === activeId;
              const px = s.x + 22; // post sits to the right of the rail
              const boardW = 13 + s.numeral.length * 6;
              const boardX = px - boardW / 2;
              const boardY = s.y - 33;
              return (
                <g
                  key={s.id}
                  className="pointer-events-auto cursor-pointer"
                  onClick={() => goTo(s.id)}
                  data-cursor="hover"
                >
                  {/* hit area */}
                  <rect x={s.x - 6} y={s.y - 38} width={140} height={48} fill="transparent" />
                  {/* feeder + post */}
                  <line x1={s.x} y1={s.y} x2={px} y2={s.y} stroke="var(--ink)" strokeOpacity={0.4} strokeWidth={1.2} />
                  <line
                    x1={px}
                    y1={s.y + 2}
                    x2={px}
                    y2={boardY + 13}
                    stroke={active ? "var(--accent)" : "var(--ink)"}
                    strokeOpacity={active ? 1 : 0.5}
                    strokeWidth={1.6}
                    style={{ transition: "stroke 0.3s ease" }}
                  />
                  {/* base plate on the rail */}
                  <circle
                    cx={s.x}
                    cy={s.y}
                    r={3}
                    fill={active ? "var(--accent)" : "var(--paper)"}
                    stroke="var(--ink)"
                    strokeOpacity={active ? 0 : 0.5}
                    strokeWidth={1.2}
                    style={{ transition: "fill 0.3s ease" }}
                  />
                  {/* nameboard */}
                  <rect
                    x={boardX}
                    y={boardY}
                    width={boardW}
                    height={14}
                    rx={2.5}
                    fill={active ? "var(--accent)" : "var(--paper)"}
                    stroke="var(--ink)"
                    strokeOpacity={active ? 0 : 0.45}
                    strokeWidth={1}
                    style={{ transition: "fill 0.3s ease" }}
                  />
                  <text
                    x={px}
                    y={boardY + 10}
                    textAnchor="middle"
                    fontFamily="var(--font-mono)"
                    fontSize={8.5}
                    letterSpacing={0.5}
                    fill={active ? "var(--paper)" : "var(--ink)"}
                    style={{ transition: "fill 0.3s ease" }}
                  >
                    {s.numeral}
                  </text>
                  {/* station name */}
                  <text
                    x={boardX + boardW + 7}
                    y={boardY + 11}
                    fontFamily="var(--font-mono)"
                    fontSize={9.5}
                    letterSpacing={0.6}
                    fill="var(--ink)"
                    fillOpacity={active ? 0.92 : 0.42}
                    style={{ transition: "fill-opacity 0.3s ease", textTransform: "uppercase" }}
                  >
                    {s.label}
                  </text>
                </g>
              );
            })}

            {/* the engine */}
            <g ref={engineRef} style={{ willChange: "transform" }}>
              <Locomotive reduced={reduced} />
            </g>

            {/* the depot — Ankit's portrait at the head of the line */}
            <g
              className="pointer-events-auto cursor-pointer"
              onClick={() => goTo("top")}
              data-cursor="hover"
            >
              <circle cx={CENTER_X} cy={AVATAR_CY} r={AVATAR_R + 5} fill="var(--paper)" />
              <image
                href={AVATAR}
                x={CENTER_X - AVATAR_R}
                y={AVATAR_CY - AVATAR_R}
                width={AVATAR_R * 2}
                height={AVATAR_R * 2}
                clipPath="url(#rj-avatar-clip)"
                preserveAspectRatio="xMidYMid slice"
              />
              <circle cx={CENTER_X} cy={AVATAR_CY} r={AVATAR_R} fill="none" stroke="var(--ink)" strokeWidth={1.4} />
              <circle
                cx={CENTER_X}
                cy={AVATAR_CY}
                r={AVATAR_R + 3.5}
                fill="none"
                stroke="var(--accent)"
                strokeWidth={1.6}
                strokeOpacity={activeId === "top" ? 1 : 0.45}
                style={{ transition: "stroke-opacity 0.3s ease" }}
              />
              <text
                x={CENTER_X}
                y={AVATAR_CY + AVATAR_R + 16}
                textAnchor="middle"
                fontFamily="var(--font-mono)"
                fontSize={9}
                letterSpacing={1}
                fill="var(--ink)"
                fillOpacity={0.7}
                style={{ textTransform: "uppercase" }}
              >
                imaddi47
              </text>
            </g>
          </svg>
        )}
      </div>
    </aside>
  );
}

/** A small side-profile locomotive, drawn nose-down so it points along travel. */
function Locomotive({ reduced }: { reduced: boolean }) {
  return (
    <g>
      {/* soft shadow / glow on the rail */}
      <ellipse cx={0} cy={4} rx={22} ry={34} fill="var(--accent)" opacity={0.1} />

      {/* steam from the chimney (top, local -y) */}
      {!reduced && (
        <g>
          <circle className="rail-steam rail-steam-1" cx={0} cy={-28} r={4} fill="var(--ink)" opacity={0.2} />
          <circle className="rail-steam rail-steam-2" cx={0} cy={-28} r={3.2} fill="var(--ink)" opacity={0.17} />
          <circle className="rail-steam rail-steam-3" cx={0} cy={-28} r={2.6} fill="var(--ink)" opacity={0.15} />
        </g>
      )}

      {/* body */}
      <g>
        {/* wheels (under the chassis) */}
        <circle cx={-15} cy={-9} r={4} fill="var(--ink-2)" />
        <circle cx={15} cy={-9} r={4} fill="var(--ink-2)" />
        <circle cx={-15} cy={12} r={4} fill="var(--ink-2)" />
        <circle cx={15} cy={12} r={4} fill="var(--ink-2)" />
        {/* chassis */}
        <rect x={-15} y={-26} width={30} height={52} rx={9} fill="var(--ink)" />
        {/* roof highlight */}
        <rect x={-15} y={-26} width={30} height={15} rx={9} fill="var(--ink-2)" />
        {/* chimney */}
        <rect x={-4} y={-32} width={8} height={8} rx={2.5} fill="var(--ink)" />
        {/* cab window */}
        <rect x={-10} y={-15} width={20} height={12} rx={3} fill="var(--paper)" opacity={0.94} />
        {/* boiler band */}
        <rect x={-15} y={3} width={30} height={3.6} fill="var(--accent)" />
        {/* headlamp (front = bottom), glows */}
        <circle cx={0} cy={20} r={4.6} fill="var(--highlight)" stroke="var(--accent)" strokeWidth={1.6} />
      </g>
    </g>
  );
}

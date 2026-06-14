"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { RailScene, type Station3D } from "./rail-scene";
import { RailJourney } from "@/components/rail-journey";

const RAIL_W = 224;
const AVATAR = "https://avatars.githubusercontent.com/u/77939876?v=4";

const SECTIONS: Omit<Station3D, "frac">[] = [
  { id: "top", numeral: "—", label: "Cover" },
  { id: "field-notes", numeral: "I", label: "Field Notes" },
  { id: "specimens", numeral: "II", label: "Specimens" },
  { id: "instruments", numeral: "III", label: "Instruments" },
  { id: "writing", numeral: "IV", label: "Writing" },
  { id: "now", numeral: "V", label: "Now" },
  { id: "colophon", numeral: "VI", label: "Colophon" },
];

function hasWebGL(): boolean {
  try {
    const c = document.createElement("canvas");
    return !!(c.getContext("webgl2") || c.getContext("webgl"));
  } catch {
    return false;
  }
}

function clamp(n: number, lo = 0, hi = 1) {
  return Math.max(lo, Math.min(hi, n));
}

export function RailJourney3D() {
  const [mounted, setMounted] = useState(false);
  const [use3D, setUse3D] = useState(true);
  const [height, setHeight] = useState(0);
  const [stations, setStations] = useState<Station3D[]>([]);
  const [activeId, setActiveId] = useState("top");
  const [reduced, setReduced] = useState(false);

  const containerRef = useRef<HTMLDivElement | null>(null);
  const progress = useRef(0);
  const rafRef = useRef(0);
  const stationsRef = useRef<Station3D[]>([]);

  useEffect(() => {
    stationsRef.current = stations;
  }, [stations]);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const reduce = mq.matches;
    setReduced(reduce);
    setUse3D(!reduce && hasWebGL());
    setMounted(true);
    const onMQ = () => {
      setReduced(mq.matches);
      setUse3D(!mq.matches && hasWebGL());
    };
    mq.addEventListener("change", onMQ);
    return () => mq.removeEventListener("change", onMQ);
  }, []);

  const measure = useCallback(() => {
    const el = containerRef.current;
    if (el) setHeight(el.clientHeight);

    const doc = document.documentElement;
    const vh = window.innerHeight;
    const scrollable = Math.max(1, doc.scrollHeight - vh);
    const built: Station3D[] = [];
    for (const s of SECTIONS) {
      const sec = document.getElementById(s.id);
      if (!sec) continue;
      const rect = sec.getBoundingClientRect();
      const top = rect.top + window.scrollY;
      built.push({ ...s, frac: clamp((top + rect.height / 2 - vh / 2) / scrollable) });
    }
    setStations(built);
  }, []);

  useEffect(() => {
    if (!mounted || !use3D) return;
    measure();
    const el = containerRef.current;
    const ro = el ? new ResizeObserver(measure) : null;
    if (el && ro) ro.observe(el);
    window.addEventListener("resize", measure);
    window.addEventListener("load", measure);
    const t = setTimeout(measure, 600);
    return () => {
      ro?.disconnect();
      window.removeEventListener("resize", measure);
      window.removeEventListener("load", measure);
      clearTimeout(t);
    };
  }, [mounted, use3D, measure]);

  useEffect(() => {
    if (!mounted || !use3D) return;
    const update = () => {
      rafRef.current = 0;
      const doc = document.documentElement;
      const scrollable = Math.max(1, doc.scrollHeight - window.innerHeight);
      const p = clamp(window.scrollY / scrollable);
      progress.current = p;
      const list = stationsRef.current;
      let id = list[0]?.id ?? "top";
      for (const s of list) if (p + 0.04 >= s.frac) id = s.id;
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
  }, [mounted, use3D]);

  const goTo = useCallback((id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: reduced ? "auto" : "smooth", block: "start" });
  }, [reduced]);

  // Fallback to the SVG railway when 3D isn't available.
  if (mounted && !use3D) return <RailJourney />;
  if (!mounted) return null;

  return (
    <aside
      aria-label="Page progress railway"
      className="pointer-events-none fixed left-0 top-0 z-30 hidden h-screen lg:block"
      style={{ width: RAIL_W }}
    >
      {/* depot — Ankit's portrait at the head of the line */}
      <button
        onClick={() => goTo("top")}
        data-cursor="hover"
        aria-label="Back to top"
        className="pointer-events-auto absolute z-10 flex flex-col items-center gap-1 bg-transparent border-0 cursor-pointer"
        style={{ left: 90, top: 18, transform: "translateX(-50%)" }}
      >
        <span
          className="block rounded-full"
          style={{
            padding: 2,
            background: activeId === "top" ? "var(--accent)" : "var(--rule-strong)",
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={AVATAR}
            alt="Ankit Kumar"
            width={52}
            height={52}
            className="block rounded-full"
            style={{ objectFit: "cover", border: "2px solid var(--paper)" }}
          />
        </span>
        <span className="font-mono uppercase" style={{ fontSize: 9, letterSpacing: 1, color: "var(--ink-mute)" }}>
          imaddi47
        </span>
      </button>
      {/* connector from depot down to where the track begins */}
      <span
        aria-hidden
        className="absolute"
        style={{ left: 90, top: 78, width: 1, height: 64, background: "var(--rule-strong)" }}
      />

      <div ref={containerRef} className="absolute inset-0">
        {height > 0 && (
          <Canvas
            orthographic
            camera={{ position: [0, 0, 220], zoom: 1, near: 0.1, far: 2000 }}
            dpr={[1, 2]}
            gl={{ alpha: true, antialias: true, powerPreference: "high-performance" }}
            style={{ background: "transparent" }}
          >
            <RailScene
              width={RAIL_W}
              height={height}
              stations={stations}
              progress={progress}
              activeId={activeId}
              reduced={reduced}
              onSelect={goTo}
            />
          </Canvas>
        )}
      </div>
    </aside>
  );
}

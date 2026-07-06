"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { PerformanceMonitor } from "@react-three/drei";
import { SnakeScene, type SnakeNode, type SnakeStation } from "./snake-scene";
import { SNAKE_SECTIONS, trainSide } from "@/lib/snake";

function hasWebGL() {
  try {
    const c = document.createElement("canvas");
    return !!(c.getContext("webgl2") || c.getContext("webgl"));
  } catch {
    return false;
  }
}
const clamp = (n: number, lo = 0, hi = 1) => Math.max(lo, Math.min(hi, n));

export function SnakeRail() {
  const [on, setOn] = useState(false);
  const [dims, setDims] = useState({ w: 0, h: 0, doc: 0 });
  const [nodes, setNodes] = useState<SnakeNode[]>([]);
  const [stations, setStations] = useState<SnakeStation[]>([]);
  const [activeId, setActiveId] = useState("top");
  const [reduced, setReduced] = useState(false);
  // Resolution scales itself down if the GPU can't keep up (helps weak/integrated GPUs).
  const [dpr, setDpr] = useState(1.25);

  const scroll = useRef(0);
  const progress = useRef(0);
  const raf = useRef(0);
  const stationsRef = useRef<SnakeStation[]>([]);

  useEffect(() => {
    stationsRef.current = stations;
  }, [stations]);

  useEffect(() => {
    const mqReduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    const mqLg = window.matchMedia("(min-width: 1024px)");
    const evaluate = () => {
      setReduced(mqReduce.matches);
      setOn(mqLg.matches && hasWebGL());
    };
    evaluate();
    mqReduce.addEventListener("change", evaluate);
    mqLg.addEventListener("change", evaluate);
    return () => {
      mqReduce.removeEventListener("change", evaluate);
      mqLg.removeEventListener("change", evaluate);
    };
  }, []);

  const measure = useCallback(() => {
    const w = window.innerWidth;
    const h = window.innerHeight;
    const doc = document.documentElement.scrollHeight;
    setDims({ w, h, doc });

    const ampX = clamp(w * 0.24, 130, 360);
    const builtNodes: SnakeNode[] = [];
    const builtStations: SnakeStation[] = [];
    SNAKE_SECTIONS.forEach((s, i) => {
      const el = document.getElementById(s.id);
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const centerY = rect.top + window.scrollY + rect.height / 2;
      const x = trainSide(i) === "left" ? -ampX : ampX;
      builtNodes.push({ y: centerY, x });
      builtStations.push({ id: s.id, numeral: s.numeral, label: s.label, y: centerY, x });
    });
    setNodes(builtNodes);
    setStations(builtStations);
  }, []);

  useEffect(() => {
    if (!on) return;
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(document.body);
    window.addEventListener("resize", measure);
    window.addEventListener("load", measure);
    const t = setTimeout(measure, 700);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
      window.removeEventListener("load", measure);
      clearTimeout(t);
    };
  }, [on, measure]);

  useEffect(() => {
    if (!on) return;
    const update = () => {
      raf.current = 0;
      const scrollable = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      scroll.current = window.scrollY;
      progress.current = clamp(window.scrollY / scrollable);
      const list = stationsRef.current;
      let id = list[0]?.id ?? "top";
      const mid = window.scrollY + window.innerHeight / 2;
      for (const s of list) if (mid >= s.y - window.innerHeight * 0.35) id = s.id;
      setActiveId((p) => (p === id ? p : id));
    };
    const onScroll = () => {
      if (raf.current) return;
      raf.current = requestAnimationFrame(update);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    update();
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (raf.current) cancelAnimationFrame(raf.current);
    };
  }, [on]);

  const goTo = useCallback((id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: reduced ? "auto" : "smooth", block: "start" });
  }, [reduced]);

  if (!on || dims.w === 0) return null;

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-0 hidden lg:block">
      <Canvas
        orthographic
        camera={{ position: [0, 0, 320], zoom: 1, near: 0.1, far: 3000 }}
        dpr={dpr}
        performance={{ min: 0.5 }}
        gl={{ alpha: true, antialias: true, powerPreference: "high-performance" }}
        style={{ background: "transparent" }}
      >
        <PerformanceMonitor
          onIncline={() => setDpr(1.5)}
          onDecline={() => setDpr(1)}
          flipflops={3}
          onFallback={() => setDpr(1)}
        >
          <SnakeScene
            width={dims.w}
            height={dims.h}
            docHeight={dims.doc}
            nodes={nodes}
            stations={stations}
            scroll={scroll}
            progress={progress}
            activeId={activeId}
            reduced={reduced}
            onSelect={goTo}
          />
        </PerformanceMonitor>
      </Canvas>
    </div>
  );
}

"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { PerformanceMonitor } from "@react-three/drei";
import { SnakeScene, type SnakeNode, type SnakeStation } from "./snake-scene";
import { RailFallback } from "./rail-fallback";
import { SNAKE_SECTIONS, trainSide } from "@/lib/snake";

type Caps = "off" | "webgl" | "fallback";

/**
 * Decide up front whether WebGL is worth using. No context / a software
 * rasteriser (SwiftShader, llvmpipe, Microsoft Basic Render, …) means the GPU
 * isn't really in play and a 3D scene would crawl at a few FPS — so we route
 * straight to the lightweight fallback instead.
 */
function pickRenderer(): Caps {
  try {
    const c = document.createElement("canvas");
    const gl = (c.getContext("webgl2") || c.getContext("webgl")) as WebGLRenderingContext | null;
    if (!gl) return "fallback";
    const ext = gl.getExtension("WEBGL_debug_renderer_info");
    const raw = ext ? String(gl.getParameter(ext.UNMASKED_RENDERER_WEBGL)) : "";
    if (/swiftshader|llvmpipe|softpipe|software|basic render|microsoft basic|mesa offscreen/i.test(raw)) {
      return "fallback";
    }
    return "webgl";
  } catch {
    return "fallback";
  }
}

const clamp = (n: number, lo = 0, hi = 1) => Math.max(lo, Math.min(hi, n));

/**
 * Runs inside the Canvas and watches real frame rate. Software rendering that
 * slipped past the string check shows up here as a sustained sub-20-FPS window;
 * when it does, we bail to the fallback. A short warm-up grace avoids tripping
 * on first-frame shader/pipeline compilation, and we stop watching once the
 * scene has proven itself for a few seconds.
 */
function FpsWatchdog({ onSlow }: { onSlow: () => void }) {
  const frames = useRef(0);
  const windowT = useRef(0);
  const warmup = useRef(0);
  const life = useRef(0);
  const done = useRef(false);

  useFrame((_, delta) => {
    if (done.current) return;
    life.current += delta;
    if (warmup.current < 0.5) {
      warmup.current += delta;
      return;
    }
    frames.current += 1;
    windowT.current += delta;
    if (windowT.current >= 1) {
      const fps = frames.current / windowT.current;
      if (fps < 20) {
        done.current = true;
        onSlow();
        return;
      }
      frames.current = 0;
      windowT.current = 0;
      if (life.current > 6) done.current = true; // healthy long enough — stop watching
    }
  });

  return null;
}

export function SnakeRail() {
  const [caps, setCaps] = useState<Caps>("off");
  const [dims, setDims] = useState({ w: 0, h: 0, doc: 0 });
  const [nodes, setNodes] = useState<SnakeNode[]>([]);
  const [stations, setStations] = useState<SnakeStation[]>([]);
  const [activeId, setActiveId] = useState("top");
  const [reduced, setReduced] = useState(false);
  // Resolution scales itself down if the GPU can't keep up (helps weak/integrated GPUs).
  const [dpr, setDpr] = useState(1.25);

  // Shared with SnakeScene: it samples window.scrollY into these each frame.
  const scroll = useRef(0);
  const progress = useRef(0);
  const raf = useRef(0);
  const stationsRef = useRef<SnakeStation[]>([]);
  // Once the watchdog demotes us to the fallback, stay there across re-evaluations.
  const forcedFallback = useRef(false);

  useEffect(() => {
    stationsRef.current = stations;
  }, [stations]);

  useEffect(() => {
    const mqReduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    const mqLg = window.matchMedia("(min-width: 1024px)");
    // ?rail=lite forces the GPU-free fallback, ?rail=3d forces the WebGL scene —
    // handy for previewing either path regardless of the device's real GPU.
    const forced = new URLSearchParams(window.location.search).get("rail");
    const evaluate = () => {
      setReduced(mqReduce.matches);
      if (!mqLg.matches) setCaps("off");
      else if (forced === "lite") setCaps("fallback");
      else if (forced === "3d") setCaps("webgl");
      else setCaps(forcedFallback.current ? "fallback" : pickRenderer());
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
    if (caps === "off") return;
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
  }, [caps, measure]);

  useEffect(() => {
    if (caps === "off") return;
    // The active nav highlight — React state that doesn't need to be frame-perfect,
    // so it's rAF-throttled. (The 3D world/engine track scroll inside SnakeScene's
    // own render loop; the fallback tracks it via its own transform.)
    const update = () => {
      raf.current = 0;
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
  }, [caps]);

  const goTo = useCallback((id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: reduced ? "auto" : "smooth", block: "start" });
  }, [reduced]);

  const demoteToFallback = useCallback(() => {
    forcedFallback.current = true;
    setCaps("fallback");
  }, []);

  if (caps === "off" || dims.w === 0) return null;

  if (caps === "fallback") {
    return (
      <RailFallback
        width={dims.w}
        docHeight={dims.doc}
        stations={stations}
        activeId={activeId}
        reduced={reduced}
        onSelect={goTo}
      />
    );
  }

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
        <FpsWatchdog onSlow={demoteToFallback} />
      </Canvas>
    </div>
  );
}

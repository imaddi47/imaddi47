"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "motion/react";

type CursorState = {
  mode: "default" | "hover" | "text" | "view";
  label?: string;
};

export function Cursor() {
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);

  // Two-layer cursor: tight inner dot, looser outer ring (for the lag/lerp feel).
  const dotX = useSpring(x, { stiffness: 1200, damping: 60, mass: 0.4 });
  const dotY = useSpring(y, { stiffness: 1200, damping: 60, mass: 0.4 });
  const ringX = useSpring(x, { stiffness: 220, damping: 26, mass: 0.6 });
  const ringY = useSpring(y, { stiffness: 220, damping: 26, mass: 0.6 });

  const [state, setState] = useState<CursorState>({ mode: "default" });
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    // Only enable on devices with a fine pointer (skip touch).
    const mq = window.matchMedia("(hover: hover) and (pointer: fine)");
    const apply = () => {
      if (mq.matches) {
        document.documentElement.classList.add("has-custom-cursor");
        setEnabled(true);
      } else {
        document.documentElement.classList.remove("has-custom-cursor");
        setEnabled(false);
      }
    };
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);

  useEffect(() => {
    if (!enabled) return;

    const onMove = (e: MouseEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);

      const t = e.target as HTMLElement | null;
      if (!t) return;

      // Walk up to find a cursor-affecting element.
      const linkEl = t.closest<HTMLElement>(
        "a, button, [role='button'], [data-cursor]",
      );
      if (!linkEl) {
        setState((s) => (s.mode === "default" ? s : { mode: "default" }));
        return;
      }
      const mode = linkEl.dataset.cursor as CursorState["mode"] | undefined;
      const label = linkEl.dataset.cursorText;
      if (mode === "text" || mode === "view") {
        setState({ mode, label: label ?? "view" });
      } else {
        setState({ mode: "hover" });
      }
    };

    const onDown = () => document.documentElement.style.setProperty("--cursor-scale", "0.7");
    const onUp = () => document.documentElement.style.setProperty("--cursor-scale", "1");
    const onLeave = () => {
      x.set(-100);
      y.set(-100);
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    window.addEventListener("mousedown", onDown);
    window.addEventListener("mouseup", onUp);
    window.addEventListener("mouseleave", onLeave);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mousedown", onDown);
      window.removeEventListener("mouseup", onUp);
      window.removeEventListener("mouseleave", onLeave);
    };
  }, [enabled, x, y]);

  // Ring scale + opacity per mode
  const ringSize =
    state.mode === "text" || state.mode === "view" ? 64 : state.mode === "hover" ? 48 : 28;
  const ringBg =
    state.mode === "text" || state.mode === "view" ? "var(--accent)" : "transparent";
  const dotOpacity = useTransform([dotX, dotY], ([dx, dy]) => {
    return dx === -100 && dy === -100 ? 0 : 1;
  });

  if (!enabled) return null;

  return (
    <>
      {/* outer ring */}
      <motion.div
        aria-hidden
        style={{
          x: ringX,
          y: ringY,
          width: ringSize,
          height: ringSize,
          background: ringBg,
          opacity: dotOpacity,
        }}
        className="pointer-events-none fixed left-0 top-0 z-[9999] -translate-x-1/2 -translate-y-1/2 rounded-full border border-ink/60 mix-blend-multiply transition-[width,height,background] duration-300 ease-out"
      >
        {(state.mode === "text" || state.mode === "view") && state.label && (
          <span className="absolute inset-0 flex items-center justify-center font-mono text-[10px] uppercase tracking-wider text-paper">
            {state.label}
          </span>
        )}
      </motion.div>
      {/* inner dot */}
      <motion.div
        aria-hidden
        style={{ x: dotX, y: dotY, opacity: dotOpacity }}
        className="pointer-events-none fixed left-0 top-0 z-[9999] h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-ink"
      />
    </>
  );
}

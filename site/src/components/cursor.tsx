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

  // The dot tracks the pointer 1:1 (instant, precise). The ring trails it by
  // just a hair — snappy enough not to feel laggy, soft enough to feel alive.
  const ringX = useSpring(x, { stiffness: 700, damping: 30, mass: 0.3 });
  const ringY = useSpring(y, { stiffness: 700, damping: 30, mass: 0.3 });
  const press = useSpring(1, { stiffness: 600, damping: 24, mass: 0.4 });

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

    const onDown = () => press.set(0.78);
    const onUp = () => press.set(1);
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
  }, [enabled, x, y, press]);

  // Ring scale + fill per mode
  const ringSize =
    state.mode === "text" || state.mode === "view" ? 64 : state.mode === "hover" ? 44 : 30;
  const ringBg =
    state.mode === "text" || state.mode === "view"
      ? "var(--accent)"
      : state.mode === "hover"
        ? "rgba(200, 151, 63, 0.14)"
        : "transparent";
  const opacity = useTransform([x, y], ([cx, cy]) => (cx === -100 && cy === -100 ? 0 : 1));

  if (!enabled) return null;

  return (
    <>
      {/* outer ring — trails slightly, scales/fills on hover & press */}
      <motion.div
        aria-hidden
        style={{
          x: ringX,
          y: ringY,
          width: ringSize,
          height: ringSize,
          background: ringBg,
          opacity,
          scale: press,
        }}
        className="pointer-events-none fixed left-0 top-0 z-[9999] -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-accent/70 transition-[width,height,background,border-color] duration-200 ease-out"
      >
        {(state.mode === "text" || state.mode === "view") && state.label && (
          <span className="absolute inset-0 flex items-center justify-center font-mono text-[10px] uppercase tracking-wider text-paper">
            {state.label}
          </span>
        )}
      </motion.div>
      {/* inner dot — tracks the pointer exactly */}
      <motion.div
        aria-hidden
        style={{ x, y, opacity }}
        className="pointer-events-none fixed left-0 top-0 z-[9999] h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent"
      />
    </>
  );
}

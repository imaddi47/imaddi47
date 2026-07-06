"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue, useTransform } from "motion/react";

type CursorState = {
  mode: "default" | "hover" | "text" | "view";
  label?: string;
};

export function Cursor() {
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);

  const [state, setState] = useState<CursorState>({ mode: "default" });
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
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

      const linkEl = t.closest<HTMLElement>("a, button, [role='button'], [data-cursor]");
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

    const onLeave = () => {
      x.set(-100);
      y.set(-100);
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    window.addEventListener("mouseleave", onLeave);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseleave", onLeave);
    };
  }, [enabled, x, y]);

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
      {/* ring — 1:1 tracking, CSS transitions handle size/color changes only */}
      <motion.div
        aria-hidden
        style={{ x, y, width: ringSize, height: ringSize, background: ringBg, opacity }}
        className="pointer-events-none fixed left-0 top-0 z-[9999] -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-accent/70 transition-[width,height,background] duration-150 ease-out"
      >
        {(state.mode === "text" || state.mode === "view") && state.label && (
          <span className="absolute inset-0 flex items-center justify-center font-mono text-[10px] uppercase tracking-wider text-paper">
            {state.label}
          </span>
        )}
      </motion.div>
      {/* dot — 1:1 tracking */}
      <motion.div
        aria-hidden
        style={{ x, y, opacity }}
        className="pointer-events-none fixed left-0 top-0 z-[9999] h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent"
      />
    </>
  );
}

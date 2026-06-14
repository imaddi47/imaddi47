"use client";

import { useRef, type ReactNode } from "react";
import { motion, useScroll, useTransform, useReducedMotion } from "motion/react";

type ParallaxProps = {
  children: ReactNode;
  /** How far the element shifts as it scrolls through the viewport, in px. Positive = moves up slower (back layer), negative = moves faster (foreground). */
  offset?: number;
  className?: string;
};

export function Parallax({ children, offset = 80, className }: ParallaxProps) {
  const ref = useRef<HTMLDivElement | null>(null);
  const reduce = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], reduce ? [0, 0] : [offset, -offset]);

  return (
    <motion.div ref={ref} style={{ y }} className={className}>
      {children}
    </motion.div>
  );
}

"use client";

import { motion, useScroll, useTransform, useReducedMotion } from "motion/react";
import { useRef } from "react";
import { Parallax } from "@/components/parallax";

export function Hero() {
  const ref = useRef<HTMLElement | null>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const heroY = useTransform(scrollYProgress, [0, 1], reduce ? [0, 0] : [0, -120]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.9], [1, 0.1]);

  return (
    <section
      ref={ref}
      id="top"
      aria-label="Introduction"
      className="relative flex min-h-[92vh] flex-col justify-between px-6 pt-10 pb-12 md:px-12 md:pt-16 md:pb-16 overflow-hidden"
    >
      {/* Background giant numeral — parallax back layer */}
      <Parallax offset={120} className="pointer-events-none absolute inset-0 z-0">
        <div className="absolute -right-[8vw] top-[18vh] select-none">
          <span
            aria-hidden
            className="font-display text-[clamp(20rem,38vw,46rem)] leading-none text-accent/[0.07] tracking-tight"
          >
            V
          </span>
        </div>
        <div className="absolute -left-4 top-[58vh] select-none rotate-[-4deg]">
          <span
            aria-hidden
            className="marginalia text-[clamp(0.7rem,0.9vw,0.95rem)] text-ink-mute/40 [writing-mode:vertical-rl]"
          >
            VOL. V — PORTFOLIO — IMADDI47 — MMXXVI
          </span>
        </div>
      </Parallax>

      {/* Top meta bar */}
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-10 grid grid-cols-2 items-start gap-4 sm:grid-cols-3"
      >
        <div className="marginalia">Vol. V · 2026</div>
        <div className="marginalia hidden sm:block text-center">
          Portfolio &amp; field log
        </div>
        <div className="marginalia text-right">
          12°58′N 77°35′E
        </div>
      </motion.div>

      {/* Hero text */}
      <motion.div
        style={{ y: heroY, opacity: heroOpacity }}
        className="relative z-10 grid grid-cols-12 gap-6 my-auto py-12"
      >
        <div className="col-span-12 md:col-span-9">
          <HeroName />
          <motion.p
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.1, delay: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="mt-8 max-w-2xl font-body text-lg leading-relaxed text-ink-2 md:text-xl md:leading-[1.55]"
          >
            <span className="font-display text-2xl text-accent md:text-3xl">¶</span>{" "}
            Software engineer building tooling for the unglamorous middle of the stack —
            <span className="italic"> auth flows, AWS plumbing, AI-augmented workflows.</span>{" "}
            The things that ship at 2 a.m. and quietly hold.
          </motion.p>
        </div>

        {/* Side marginalia */}
        <motion.aside
          initial={{ opacity: 0, x: 12 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.9, delay: 1.0, ease: [0.22, 1, 0.36, 1] }}
          className="col-span-12 md:col-span-3 flex md:flex-col gap-x-8 gap-y-3 md:pt-4 md:border-l md:border-rule md:pl-5 self-start"
        >
          <Meta label="Est." value="Bengaluru, 2021" />
          <Meta label="Field" value="Distributed systems · AI tooling · DevX" />
          <Meta label="Status" value="At work — Toddle" dot />
        </motion.aside>
      </motion.div>

      {/* Scroll cue */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1.4 }}
        className="relative z-10 flex items-end justify-between gap-4"
      >
        <a
          href="#field-notes"
          className="group flex items-center gap-3 marginalia hover:text-accent transition-colors"
          data-cursor="hover"
        >
          <span className="inline-block h-px w-12 bg-ink-2 transition-all group-hover:w-20 group-hover:bg-accent" />
          Continue reading
        </a>
        <div className="marginalia text-right hidden sm:block">
          §I · Field notes
        </div>
      </motion.div>
    </section>
  );
}

function HeroName() {
  const reduce = useReducedMotion();

  // Per-letter reveal of "Ankit" — staggered, dramatic
  const letters = ["A", "n", "k", "i", "t"];
  return (
    <div>
      <motion.div
        initial="hidden"
        animate="visible"
        variants={{
          hidden: {},
          visible: { transition: { staggerChildren: 0.06, delayChildren: 0.2 } },
        }}
        className="flex"
      >
        {letters.map((l, i) => (
          <motion.span
            key={`${l}-${i}`}
            variants={
              reduce
                ? { hidden: { opacity: 1, y: 0 }, visible: { opacity: 1, y: 0 } }
                : {
                    hidden: { opacity: 0, y: "0.4em" },
                    visible: {
                      opacity: 1,
                      y: 0,
                      transition: { duration: 1.0, ease: [0.22, 1, 0.36, 1] },
                    },
                  }
            }
            className="font-display block text-[clamp(5.5rem,15vw,12rem)] leading-[0.85] text-ink"
            style={{ fontStyle: "italic" }}
          >
            {l}
          </motion.span>
        ))}
      </motion.div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.0, delay: 0.55, ease: [0.22, 1, 0.36, 1] }}
        className="mt-1 flex items-baseline gap-3"
      >
        <span className="font-body text-[clamp(2.2rem,4.8vw,3.6rem)] leading-none text-ink/80 tracking-tight">
          Kumar
        </span>
        <span className="marginalia">a.k.a. imaddi47</span>
      </motion.div>
    </div>
  );
}

function Meta({ label, value, dot }: { label: string; value: string; dot?: boolean }) {
  return (
    <div className="flex flex-col gap-1">
      <span className="marginalia">{label}</span>
      <span className="flex items-center gap-2 font-body text-sm leading-snug text-ink">
        {dot && (
          <span className="relative inline-flex h-1.5 w-1.5 shrink-0">
            <span className="absolute inset-0 animate-ping rounded-full bg-accent opacity-50" />
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-accent" />
          </span>
        )}
        {value}
      </span>
    </div>
  );
}

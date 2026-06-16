"use client";

import { motion, useReducedMotion } from "motion/react";

export function Hero() {
  const reduce = useReducedMotion();
  const rise = (delay: number) =>
    reduce
      ? { initial: { opacity: 1 }, animate: { opacity: 1 } }
      : {
          initial: { opacity: 0, y: 22 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 1, delay, ease: [0.22, 1, 0.36, 1] as const },
        };

  return (
    <section
      id="top"
      aria-label="Introduction"
      className="section relative scroll-mt-24 flex min-h-[92vh] items-center"
    >
      <div className="w-full max-w-[640px] px-6 lg:px-10">
        <motion.div {...rise(0)} className="flex items-center justify-between">
          <span className="marginalia">§ I · Cover</span>
          <span className="marginalia">Vol. 2026</span>
        </motion.div>
        <motion.hr {...rise(0.05)} className="rule mt-2" />

        <motion.p {...rise(0.15)} className="marginalia mt-8 text-accent">
          Portfolio &amp; field log
        </motion.p>

        <motion.h1
          {...rise(0.25)}
          className="font-display text-ink mt-3"
          style={{ fontSize: "clamp(3.2rem, 9vw, 6.5rem)" }}
        >
          Ankit
          <br />
          Kumar
        </motion.h1>

        <motion.p {...rise(0.4)} className="marginalia mt-3 text-ink-mute">
          a.k.a. imaddi47
        </motion.p>

        <motion.p
          {...rise(0.5)}
          className="font-body text-ink-2 mt-8 text-lg leading-relaxed"
        >
          Software engineer. I build for the unglamorous middle of the
          stack — <span className="text-ink">auth, AWS plumbing, AI workflows</span> —
          the stuff that has to hold at 2 a.m.
        </motion.p>

        <motion.dl {...rise(0.62)} className="mt-10 grid grid-cols-2 gap-x-6 gap-y-5">
          <Meta label="Est." value="Bengaluru, 2021" />
          <Meta label="Field" value="Distributed systems · AI tooling · DevX" />
          <Meta label="Status" value="At work — Toddle" dot />
          <Meta label="Coordinates" value="12°58′N 77°35′E" />
        </motion.dl>

        <motion.a
          {...rise(0.78)}
          href="#field-notes"
          data-cursor="hover"
          className="group mt-12 inline-flex items-center gap-3 marginalia hover:text-accent transition-colors"
        >
          <span className="inline-block h-px w-12 bg-ink-2 transition-all group-hover:w-20 group-hover:bg-accent" />
          Continue reading
        </motion.a>
      </div>
    </section>
  );
}

function Meta({ label, value, dot }: { label: string; value: string; dot?: boolean }) {
  return (
    <div className="flex flex-col gap-1">
      <dt className="marginalia">{label}</dt>
      <dd className="flex items-center gap-2 font-body text-sm leading-snug text-ink">
        {dot && (
          <span className="relative inline-flex h-1.5 w-1.5 shrink-0">
            <span className="absolute inset-0 animate-ping rounded-full bg-accent opacity-50" />
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-accent" />
          </span>
        )}
        {value}
      </dd>
    </div>
  );
}

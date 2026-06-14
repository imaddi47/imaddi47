"use client";

import { motion, useReducedMotion } from "motion/react";
import { Reveal, Stagger, StaggerItem } from "@/components/reveal";
import { Parallax } from "@/components/parallax";

const EYEBROW_WORDS = ["A", "short", "orientation."];

const STATS: { label: string; value: string }[] = [
  { label: "GH joined", value: "2021" },
  { label: "Public repos", value: "22" },
  { label: "Based", value: "Bengaluru" },
  { label: "Writes at", value: "debugblackbox.com" },
];

function EyebrowWords() {
  const reduce = useReducedMotion();

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.4 }}
      variants={{
        hidden: {},
        visible: {
          transition: { staggerChildren: 0.14, delayChildren: 0.05 },
        },
      }}
      aria-label="A short orientation."
      className="flex flex-wrap gap-x-[0.3em]"
    >
      {EYEBROW_WORDS.map((word, index) => (
        <motion.span
          key={`${word}-${index}`}
          variants={
            reduce
              ? { hidden: { opacity: 1, y: 0 }, visible: { opacity: 1, y: 0 } }
              : {
                  hidden: { opacity: 0, y: "0.3em" },
                  visible: {
                    opacity: 1,
                    y: 0,
                    transition: { duration: 1.0, ease: [0.22, 1, 0.36, 1] },
                  },
                }
          }
          className="font-display text-ink leading-[1.05]"
          style={{ fontSize: "clamp(2.5rem, 5vw, 4rem)" }}
        >
          {word}
        </motion.span>
      ))}
    </motion.div>
  );
}

export function About() {
  return (
    <section
      id="field-notes"
      aria-labelledby="about-heading"
      className="section relative scroll-mt-24 bg-paper overflow-hidden"
    >
      {/* Background giant numeral — parallax decoration */}
      <Parallax offset={60} className="pointer-events-none absolute inset-0 z-0">
        <div
          aria-hidden
          className="absolute -right-[6vw] top-[10%] select-none"
        >
          <span className="font-display text-accent/[0.06] text-[clamp(18rem,32vw,40rem)] leading-none">
            I
          </span>
        </div>
      </Parallax>

      <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12">
        {/* Top header row */}
        <Reveal y={10} duration={0.8}>
          <div className="flex items-center justify-between mb-2">
            <span className="marginalia">§I · Field Notes</span>
            <span className="marginalia">Issue 026 — Spring 2026</span>
          </div>
          <hr className="rule" />
        </Reveal>

        {/* Main 12-column grid */}
        <div className="grid grid-cols-12 gap-x-6 gap-y-10 mt-12 md:mt-16">
          {/* Left column: eyebrow + folio caption */}
          <div className="col-span-12 md:col-span-4">
            <div className="md:sticky md:top-32">
              <EyebrowWords />
              <Reveal delay={0.35} y={10} duration={0.8}>
                <p className="marginalia mt-5 text-ink-mute">Vol. V · Folio II</p>
              </Reveal>
            </div>
          </div>

          {/* One-column gap on md+ (col 5 is intentionally empty) */}
          <div className="hidden md:block md:col-span-1" aria-hidden />

          {/* Right column: body paragraphs */}
          <div className="col-span-12 md:col-span-7" id="about-heading">
            <Reveal delay={0} y={18} duration={0.95}>
              <p className="font-body text-ink text-lg leading-[1.75] dropcap">
                Five years of shipping production JavaScript, TypeScript, and Python. Currently at Toddle — an education platform — where the work is mostly Postgres, Node, and the long tail of edge cases that come with serving schools across timezones.
              </p>
            </Reveal>

            <Reveal delay={0.15} y={18} duration={0.95}>
              <p className="font-body text-ink-2 text-lg leading-[1.75] mt-7">
                Off-hours I make small developer tools and write about the ones that didn't work. Lately that has meant a resume tailoring service that runs Gemini over LaTeX templates, an AWS Systems Manager parameter UI nobody asked for, and a wireguard backend that mostly just sits there doing its job.
              </p>
            </Reveal>

            <Reveal delay={0.3} y={18} duration={0.95}>
              <p className="font-body text-ink-2 text-lg leading-[1.75] mt-7">
                I am partial to boring databases, careful migrations, and the kind of authentication code that survives an incident. I am suspicious of frameworks that solve problems I do not have.
              </p>
            </Reveal>
          </div>
        </div>

        {/* Bottom rule + marginalia stats row */}
        <Reveal delay={0.1} y={10} duration={0.8} className="mt-14 md:mt-20">
          <hr className="rule mb-8" />
        </Reveal>

        <Stagger className="grid grid-cols-2 gap-y-5 sm:grid-cols-4 gap-x-6" stagger={0.09} initialDelay={0.2}>
          {STATS.map((stat) => (
            <StaggerItem key={stat.label}>
              <div className="flex flex-col gap-1">
                <span className="marginalia">{stat.label}</span>
                {stat.label === "Writes at" ? (
                  <a
                    href="https://debugblackbox.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-mono text-xs text-ink link-underline"
                    data-cursor="hover"
                  >
                    {stat.value}
                  </a>
                ) : (
                  <span className="font-mono text-xs text-ink">{stat.value}</span>
                )}
              </div>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  );
}

"use client";

import { Reveal, Stagger, StaggerItem } from "@/components/reveal";
import { Parallax } from "@/components/parallax";
import { stack } from "@/lib/data";

type StackGroup = {
  label: string;
  key: keyof typeof stack;
};

const STACK_GROUPS: StackGroup[] = [
  { label: "DAILY", key: "daily" },
  { label: "OFTEN", key: "often" },
  { label: "CURIOUS ABOUT", key: "curious" },
  { label: "LOVED", key: "loved" },
];

function StackRow({ label, items }: { label: string; items: string[] }) {
  return (
    <div className="grid grid-cols-12 gap-x-4 items-baseline py-4">
      <div className="col-span-3">
        <span className="font-mono text-[0.65rem] uppercase tracking-widest text-ink-mute leading-none">
          {label}
        </span>
      </div>
      <div className="col-span-9">
        <span className="font-body text-ink text-sm leading-relaxed">
          {items.map((item, index) => (
            <span key={item}>
              <span className="transition-all duration-200 hover:border-b hover:border-accent hover:text-accent cursor-default">
                {item}
              </span>
              {index < items.length - 1 && (
                <span className="mx-2 text-ink-mute select-none" aria-hidden>
                  ·
                </span>
              )}
            </span>
          ))}
        </span>
      </div>
    </div>
  );
}

export function Instruments() {
  return (
    <section
      id="instruments"
      aria-labelledby="instruments-heading"
      className="section relative scroll-mt-24 overflow-hidden"
    >
      {/* Background giant numeral — parallax decoration */}
      <Parallax offset={60} className="pointer-events-none absolute inset-0 z-0">
        <div
          aria-hidden
          className="absolute -right-[4vw] top-[8%] select-none"
        >
          <span className="font-display text-accent/[0.06] text-[clamp(18rem,30vw,38rem)] leading-none italic">
            III
          </span>
        </div>
      </Parallax>

      <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12">
        {/* Top header row */}
        <Reveal y={10} duration={0.8}>
          <div className="flex items-center justify-between mb-2">
            <span className="marginalia">§III · Instruments</span>
            <span className="marginalia">What I reach for, by frequency</span>
          </div>
          <hr className="rule" />
        </Reveal>

        {/* Section heading */}
        <Reveal y={18} duration={0.95} delay={0.1}>
          <h2
            id="instruments-heading"
            className="font-display italic text-[clamp(2.5rem,6vw,5rem)] text-ink mt-12 mb-2 leading-none"
          >
            Instruments.
          </h2>
          <p className="font-body italic text-ink-2 text-lg">
            A working inventory — partial, biased, current.
          </p>
        </Reveal>

        {/* 12-column body */}
        <div className="grid grid-cols-12 gap-x-6 gap-y-10 mt-10 md:mt-14">
          {/* Left col: editorial prose */}
          <div className="col-span-12 md:col-span-5">
            <Reveal y={18} duration={0.95} delay={0.15}>
              <p className="font-body text-ink-2 text-base leading-[1.8]">
                Tooling is a long conversation with the work. I&rsquo;m not a maximalist about
                any single language; I&rsquo;m partial to the ones that get out of the way.
                Postgres has earned its keep many times over. TypeScript is a tax I gladly pay.
                I read about Rust often and write about it rarely.
              </p>
            </Reveal>
          </div>

          {/* Gap col */}
          <div className="hidden md:block md:col-span-1" aria-hidden />

          {/* Right col: stack inventory */}
          <div className="col-span-12 md:col-span-6">
            <Stagger stagger={0.09} initialDelay={0.25}>
              {STACK_GROUPS.map((group, index) => (
                <StaggerItem key={group.key}>
                  <StackRow label={group.label} items={stack[group.key]} />
                  {index < STACK_GROUPS.length - 1 && <hr className="rule" />}
                </StaggerItem>
              ))}
            </Stagger>
          </div>
        </div>

        {/* Footnote */}
        <Reveal y={10} duration={0.8} delay={0.2} className="mt-12 md:mt-16">
          <hr className="rule mb-5" />
          <p className="marginalia text-ink-mute">
            Footnote — I also write the occasional Solidity contract. Mostly to learn how
            Ethereum reorgs ruin your day.
          </p>
        </Reveal>
      </div>
    </section>
  );
}

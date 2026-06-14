"use client";

import { Reveal, Stagger, StaggerItem } from "@/components/reveal";
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
    <div className="flex flex-col gap-2 py-4">
      <span className="font-mono text-[0.65rem] uppercase tracking-widest text-ink-mute leading-none">
        {label}
      </span>
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
  );
}

export function Instruments() {
  return (
    <section
      id="instruments"
      aria-labelledby="instruments-heading"
      className="section relative scroll-mt-24"
    >
      <div className="w-full max-w-[640px] px-6 lg:px-10">
        <Reveal y={10} duration={0.8}>
          <span className="marginalia">§ IV · Instruments</span>
          <hr className="rule mt-2" />
        </Reveal>

        <Reveal y={18} duration={0.95} delay={0.1}>
          <h2
            id="instruments-heading"
            className="font-display text-[clamp(2rem,5vw,3.5rem)] text-ink mt-10 mb-2 leading-none"
          >
            Instruments.
          </h2>
          <p className="font-body text-ink-2 text-lg">
            A working inventory — partial, biased, current.
          </p>
        </Reveal>

        <Reveal y={18} duration={0.95} delay={0.15}>
          <p className="font-body text-ink-2 text-base leading-[1.8] mt-8">
            Tooling is a long conversation with the work. I&rsquo;m not a maximalist about
            any single language; I&rsquo;m partial to the ones that get out of the way.
            Postgres has earned its keep many times over. TypeScript is a tax I gladly pay.
            I read about Rust often and write about it rarely.
          </p>
        </Reveal>

        <div className="mt-10">
          <Stagger stagger={0.09} initialDelay={0.25}>
            {STACK_GROUPS.map((group, index) => (
              <StaggerItem key={group.key}>
                <StackRow label={group.label} items={stack[group.key]} />
                {index < STACK_GROUPS.length - 1 && <hr className="rule" />}
              </StaggerItem>
            ))}
          </Stagger>
        </div>

        <Reveal y={10} duration={0.8} delay={0.2} className="mt-12">
          <hr className="rule mb-4" />
          <p className="marginalia text-ink-mute">
            Footnote — I also write the occasional Solidity contract. Mostly to learn how
            Ethereum reorgs ruin your day.
          </p>
        </Reveal>
      </div>
    </section>
  );
}

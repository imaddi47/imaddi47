"use client";

import { Reveal, Stagger, StaggerItem } from "@/components/reveal";

const STATS: { label: string; value: string; href?: string }[] = [
  { label: "GH joined", value: "2021" },
  { label: "Public repos", value: "22" },
  { label: "Based", value: "Bengaluru" },
  { label: "Writes at", value: "debugblackbox.com", href: "https://debugblackbox.com" },
];

export function About() {
  return (
    <section
      id="field-notes"
      aria-labelledby="about-heading"
      className="section relative scroll-mt-24"
    >
      <div className="w-full max-w-[640px] px-6 lg:px-10">
        <Reveal y={10} duration={0.8}>
          <span className="marginalia">§ II · Field Notes</span>
          <hr className="rule mt-2" />
        </Reveal>

        <Reveal delay={0.1} y={14} duration={0.9}>
          <h2
            id="about-heading"
            className="font-display text-[clamp(2rem,4.5vw,3.2rem)] text-ink leading-[1.05] tracking-tight mt-8"
          >
            A short orientation.
          </h2>
        </Reveal>

        <div className="mt-8 flex flex-col gap-7">
          <Reveal delay={0.15} y={18} duration={0.95}>
            <p className="font-body text-ink text-lg leading-[1.75] dropcap">
              Five years of shipping production JavaScript, TypeScript, and Python. Currently at Toddle — an education platform — where the work is mostly Postgres, Node, and the long tail of edge cases that come with serving schools across timezones.
            </p>
          </Reveal>

          <Reveal delay={0.25} y={18} duration={0.95}>
            <p className="font-body text-ink-2 text-lg leading-[1.75]">
              Off-hours I make small developer tools and write about the ones that didn't work. Lately that has meant a resume tailoring service that runs Gemini over LaTeX templates, an AWS Systems Manager parameter UI nobody asked for, and a wireguard backend that mostly just sits there doing its job.
            </p>
          </Reveal>

          <Reveal delay={0.35} y={18} duration={0.95}>
            <p className="font-body text-ink-2 text-lg leading-[1.75]">
              I am partial to boring databases, careful migrations, and the kind of authentication code that survives an incident. I am suspicious of frameworks that solve problems I do not have.
            </p>
          </Reveal>
        </div>

        <Reveal delay={0.1} y={10} duration={0.8} className="mt-12">
          <hr className="rule" />
        </Reveal>

        <Stagger className="mt-6 grid grid-cols-2 gap-x-6 gap-y-5" stagger={0.09} initialDelay={0.2}>
          {STATS.map((stat) => (
            <StaggerItem key={stat.label}>
              <div className="flex flex-col gap-1">
                <span className="marginalia text-ink-mute">{stat.label}</span>
                {stat.href ? (
                  <a
                    href={stat.href}
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

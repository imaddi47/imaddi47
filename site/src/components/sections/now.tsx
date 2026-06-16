"use client";

import { Reveal, Stagger, StaggerItem } from "@/components/reveal";
import { now } from "@/lib/data";

export function Now() {
  return (
    <section id="now" className="section relative scroll-mt-24">
      <div className="w-full max-w-[640px] px-6 lg:px-10">
        <div className="flex items-baseline justify-between mb-2">
          <span className="marginalia">§ VI · Now</span>
          <span className="marginalia">Updated this week</span>
        </div>

        <hr className="rule" />

        <Reveal>
          <h2 className="font-display font-black tracking-tight text-[clamp(2rem,5vw,3.5rem)] mt-10 mb-2 text-ink">
            A current note.
          </h2>
          <p className="font-body text-ink-mute text-base mb-10">
            What&rsquo;s in front of me today.
          </p>
        </Reveal>

        <Stagger className="flex flex-col" stagger={0.1}>
          {now.map((entry, index) => (
            <StaggerItem key={entry.label}>
              <div className="py-6">
                <span className="font-mono text-xs uppercase tracking-widest text-accent border-l-2 border-accent pl-3">
                  {entry.label}
                </span>
                <p className="font-body text-ink-2 mt-3 leading-relaxed">
                  {entry.text}
                </p>
              </div>
              {index < now.length - 1 && <hr className="rule" />}
            </StaggerItem>
          ))}
        </Stagger>

        <Reveal delay={0.4}>
          <div className="mt-10 flex flex-col gap-2">
            <span className="font-display font-black tracking-tight text-accent text-[clamp(1.25rem,2.5vw,1.75rem)]">
              Yours, in production.
            </span>
            <span className="marginalia">Stamped June 2026 · from the desk of A.K.</span>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

"use client";

import { Reveal, Stagger, StaggerItem } from "@/components/reveal";
import { now } from "@/lib/data";

export function Now() {
  return (
    <section
      id="now"
      className="section relative scroll-mt-24 bg-paper-2 overflow-hidden"
    >
      <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12">
        <div className="flex items-baseline justify-between mb-2">
          <span className="marginalia">§V · Now</span>
          <span className="marginalia">Updated this week</span>
        </div>

        <hr className="rule" />

        <Reveal>
          <h2 className="font-display italic text-[clamp(2.5rem,6vw,5rem)] mt-12 mb-2 text-ink">
            A current note.
          </h2>
          <p className="font-body italic text-ink-mute text-base mb-10">
            What&rsquo;s in front of me today.
          </p>
        </Reveal>

        <div className="grid grid-cols-12 gap-x-6 gap-y-10">
        {/* Left: definition list, cols 1–7 */}
        <div className="col-span-12 lg:col-span-7">
          <Stagger className="flex flex-col" stagger={0.1}>
            {now.map((entry, index) => (
              <StaggerItem key={entry.label}>
                <div className="py-6">
                  {/* Label with accent left border */}
                  <span
                    className="font-mono text-xs uppercase tracking-widest text-accent pl-3"
                    style={{ borderLeft: "2px solid" }}
                  >
                    {entry.label}
                  </span>

                  <p className="font-body text-ink-2 max-w-prose mt-3 leading-relaxed">
                    {entry.text}
                  </p>
                </div>

                {index < now.length - 1 && <hr className="rule" />}
              </StaggerItem>
            ))}
          </Stagger>
        </div>

        <div className="col-span-12 lg:col-start-9 lg:col-span-4 flex items-end justify-end">
          <Reveal delay={0.5}>
            <div className="text-right flex flex-col gap-3">
              <span
                className="font-display italic text-accent block"
                style={{ fontSize: "clamp(1.4rem, 2.5vw, 2rem)" }}
              >
                Yours, in production.
              </span>

              <span className="font-mono text-xs uppercase tracking-widest text-ink-mute">
                Stamped — June 2026
              </span>

              <span className="marginalia">From the desk of A.K.</span>
            </div>
          </Reveal>
        </div>
        </div>
      </div>
    </section>
  );
}

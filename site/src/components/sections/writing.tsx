"use client";

import { Reveal, Stagger, StaggerItem } from "@/components/reveal";
import { Magnetic } from "@/components/magnetic";
import { writings, meta } from "@/lib/data";

export function Writing() {
  return (
    <section id="writing" className="section relative scroll-mt-24">
      <div className="w-full max-w-[640px] px-6 lg:px-10">
        <div className="flex items-center justify-between">
          <span className="marginalia">§ V · Writing</span>
        </div>
        <hr className="rule mt-2" />

        <Reveal delay={0.05} as="div">
          <h2
            className="font-display text-ink mt-12 mb-2 tracking-tight"
            style={{ fontSize: "clamp(2rem, 5vw, 3.5rem)", fontWeight: 800 }}
          >
            From the press.
          </h2>
          <p className="font-body text-ink-2 text-lg">
            Recent posts, mostly homelab and infra war stories. The rest&rsquo;s on the blog.
          </p>
        </Reveal>

        <Stagger stagger={0.12} initialDelay={0.2} className="mt-14">
          {writings.map((entry, index) => (
            <StaggerItem key={entry.title}>
              <article>
                {index > 0 && <hr className="rule" />}
                <div className="py-8">
                  <div className="flex items-baseline justify-between mb-3">
                    <span className="marginalia text-ink-mute">{entry.date}</span>
                    <span className="marginalia text-ink-mute">Essay</span>
                  </div>

                  <a
                    href={entry.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    data-cursor="hover"
                    className="group block"
                    aria-label={`Read essay: ${entry.title}`}
                  >
                    <h3
                      className="font-display text-ink leading-[1.1] tracking-tight transition-colors duration-200 group-hover:text-accent"
                      style={{ fontSize: "clamp(1.3rem, 3vw, 1.9rem)", fontWeight: 800 }}
                    >
                      {entry.title}
                    </h3>
                  </a>

                  <p className="font-body text-ink-2 mt-3 leading-relaxed text-base">
                    {entry.excerpt}
                  </p>
                </div>
              </article>
            </StaggerItem>
          ))}
          <hr className="rule" />
        </Stagger>

        <div className="mt-10">
          <Magnetic strength={0.2}>
            <a
              href={meta.blog}
              target="_blank"
              rel="noopener noreferrer"
              data-cursor="hover"
              className="font-mono text-accent inline-block"
              style={{ fontSize: "clamp(0.85rem, 1.5vw, 1rem)" }}
            >
              Read all essays →
            </a>
          </Magnetic>
        </div>
      </div>
    </section>
  );
}

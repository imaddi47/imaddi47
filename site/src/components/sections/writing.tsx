"use client";

import { Reveal, Stagger, StaggerItem } from "@/components/reveal";
import { Parallax } from "@/components/parallax";
import { Magnetic } from "@/components/magnetic";
import { writings, meta } from "@/lib/data";

export function Writing() {
  return (
    <section id="writing" className="section relative scroll-mt-24 overflow-hidden">
      <Parallax
        offset={60}
        className="pointer-events-none absolute inset-0 z-0 overflow-hidden"
      >
        <div className="absolute -right-[6vw] top-[8vh] select-none">
          <span
            aria-hidden
            className="font-display text-[clamp(18rem,32vw,44rem)] leading-none text-accent/[0.05] tracking-tight"
          >
            IV
          </span>
        </div>
      </Parallax>

      <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12">
        <div className="flex items-center justify-between mb-0">
          <span className="marginalia">§IV · Writing</span>
          <span className="marginalia">Selected essays — blog.debugblackbox.com</span>
        </div>
        <hr className="rule mt-2" />

        <Reveal delay={0.05} as="div">
          <h2
            className="font-display italic text-ink mt-12 mb-2"
            style={{ fontSize: "clamp(2.5rem, 6vw, 5rem)" }}
          >
            From the press.
          </h2>
          <p className="font-body italic text-ink-2 text-lg md:text-xl">
            A handful of essays. The full archive lives elsewhere.
          </p>
        </Reveal>

        <div className="grid grid-cols-12 gap-x-6 mt-14">
          <div className="col-span-12 md:col-span-3 md:col-start-1">
            <p className="font-body italic text-ink-2 leading-relaxed text-base max-w-[36ch]">
              I write to figure out what I think. Most of it ends up at blog.debugblackbox.com;
              some of it ends up rewritten in a project&rsquo;s commit messages.
            </p>
          </div>

          <div className="col-span-12 md:col-span-7 md:col-start-6 mt-10 md:mt-0">
            <Stagger stagger={0.12} initialDelay={0.2}>
              {writings.map((entry, index) => (
                <StaggerItem key={entry.title}>
                  <article>
                    {index > 0 && <hr className="rule" />}
                    <div className="py-8">
                      <div className="flex items-baseline justify-between mb-3">
                        <span className="marginalia text-ink-mute">{entry.date}</span>
                        <span className="marginalia italic text-ink-mute">Essay</span>
                      </div>

                      <a
                        href={entry.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        data-cursor="hover"
                        className="group block"
                        aria-label={entry.title}
                      >
                        <h3
                          className="font-display italic text-ink leading-[1.1] transition-colors duration-200 group-hover:text-accent"
                          style={{ fontSize: "clamp(1.6rem, 3vw, 2.4rem)" }}
                        >
                          {entry.title}
                        </h3>
                      </a>

                      <p className="font-body text-ink-2 mt-3 leading-relaxed max-w-prose text-base">
                        {entry.excerpt}
                      </p>

                      <div className="mt-4">
                        <a
                          href={entry.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          data-cursor="hover"
                          className="marginalia link-underline text-ink-mute"
                        >
                          ↗ Read on blog
                        </a>
                      </div>
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
                  className="font-display italic text-accent text-2xl link-underline inline-block"
                  style={{ fontSize: "clamp(1.2rem, 2.2vw, 1.6rem)" }}
                >
                  READ ALL ESSAYS →
                </a>
              </Magnetic>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

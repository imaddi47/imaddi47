"use client";

import { useEffect, useState } from "react";
import { Reveal } from "@/components/reveal";
import { Magnetic } from "@/components/magnetic";
import { LocoClip } from "@/components/rail3d/loco-clip";
import { meta } from "@/lib/data";

/** Live IST clock rendered in paper text for the inverted footer. */
function LocalClock() {
  const [time, setTime] = useState<string>("");

  useEffect(() => {
    const fmt = new Intl.DateTimeFormat("en-GB", {
      timeZone: "Asia/Kolkata",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
    const tick = () => setTime(fmt.format(new Date()));
    tick();
    const id = setInterval(tick, 15_000);
    return () => clearInterval(id);
  }, []);

  return (
    <span className="font-mono text-xs uppercase tracking-wider text-ink/80 tabular-nums">
      {time || "—:—"} <span className="opacity-60">IST</span>
    </span>
  );
}

const MARQUEE_TEXT = " ANKIT KUMAR ✦ IMADDI47 ✦ ANKIT KUMAR ✦ IMADDI47 ✦ ";

type ContactLink = {
  label: string;
  href: string;
  external: boolean;
};

const contactLinks: ContactLink[] = [
  { label: "Email", href: `mailto:${meta.email}`, external: false },
  { label: "GitHub", href: meta.github, external: true },
  { label: "LinkedIn", href: meta.linkedin, external: true },
  { label: "Blog", href: meta.blog, external: true },
  { label: "Medium", href: meta.medium, external: true },
];

export function Footer() {
  return (
    <footer id="colophon" className="relative scroll-mt-24 bg-[#0f0b07] text-ink">
      {/* Marquee strip */}
      <div className="overflow-hidden whitespace-nowrap border-b border-ink/20">
        <div
          className="marquee-track flex"
          style={{ fontSize: "clamp(4rem, 10vw, 8rem)" }}
          aria-hidden="true"
        >
          <span className="font-display italic text-ink/[0.15] shrink-0 select-none">
            {MARQUEE_TEXT}
          </span>
          <span className="font-display italic text-ink/[0.15] shrink-0 select-none">
            {MARQUEE_TEXT}
          </span>
        </div>
      </div>

      {/* Publisher's mark — Remotion + three.js locomotive on a turntable */}
      <div className="flex items-center justify-center pt-8 md:pt-12 pb-2 border-b border-ink/10">
        <div className="flex flex-col items-center gap-1">
          <LocoClip width={260} height={170} className="opacity-95" />
          <span className="marginalia text-ink/30">Publisher&rsquo;s mark — no. 47</span>
        </div>
      </div>

      {/* Colophon body */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 py-20 md:py-24">
        <Reveal>
          {/* Main 12-col grid */}
          <div className="grid grid-cols-12 gap-x-6 gap-y-16">
            {/* Col 1–5: How to reach */}
            <div className="col-span-12 md:col-span-5">
              <p className="marginalia text-ink/40 mb-6">REACH</p>
              <nav aria-label="Contact links">
                <ul className="flex flex-col gap-3">
                  {contactLinks.map(({ label, href, external }) => (
                    <li key={label}>
                      <Magnetic strength={0.2}>
                        <a
                          href={href}
                          className="group link-underline flex items-baseline gap-2 font-display italic text-ink hover:text-accent transition-colors duration-300"
                          style={{ fontSize: "clamp(1.4rem, 2.5vw, 2rem)" }}
                          data-cursor="hover"
                          {...(external
                            ? { target: "_blank", rel: "noopener noreferrer" }
                            : {})}
                        >
                          <span className="inline-block transition-transform duration-300 group-hover:translate-x-1">
                            →
                          </span>
                          {label}
                        </a>
                      </Magnetic>
                    </li>
                  ))}
                </ul>
              </nav>
            </div>

            {/* Col 7–9: Colophon prose */}
            <div className="col-span-12 md:col-start-7 md:col-span-3">
              <p className="marginalia text-ink/40 mb-6">COLOPHON</p>
              <p className="font-body text-sm text-ink/80 leading-relaxed mb-6">
                Set in Instrument Serif and Newsreader. Composed with Next.js, Tailwind v4, and
                Motion. Rendered in a single page. Last typeset June 2026.
              </p>
              <p className="marginalia text-ink/40">
                License — © 2026 Ankit Kumar. Words are mine. Code on{" "}
                <a
                  href={meta.github}
                  className="link-underline hover:text-ink/80 transition-colors duration-200"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  GitHub
                </a>
                .
              </p>
            </div>

            {/* Col 11–12: Field facts */}
            <div className="col-span-12 md:col-start-11 md:col-span-2 md:text-right">
              <div className="mb-5">
                <p className="marginalia text-ink/40 mb-1">LOCATION</p>
                <p className="font-mono text-xs uppercase tracking-wider text-ink/80">
                  Bengaluru · IN
                </p>
              </div>
              <div>
                <p className="marginalia text-ink/40 mb-1">LOCAL TIME</p>
                <LocalClock />
              </div>
            </div>
          </div>

          {/* Bottom rule + meta row */}
          <div className="mt-16 md:mt-20 border-t border-ink/20 pt-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <span className="marginalia text-ink/40">v1.0.0 — built in a weekend</span>
            <a
              href="#top"
              className="link-underline marginalia text-ink/40 hover:text-ink/80 transition-colors duration-200 self-start sm:self-auto"
              data-cursor="hover"
            >
              ↑ Back to top
            </a>
          </div>
        </Reveal>
      </div>
    </footer>
  );
}

"use client";

import { useEffect, useState } from "react";
import { Reveal } from "@/components/reveal";
import { Magnetic } from "@/components/magnetic";
import { LocoClip } from "@/components/rail3d/loco-clip";
import { meta } from "@/lib/data";

function LocalClock() {
  const [time, setTime] = useState("");
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
    <span className="font-mono text-xs uppercase tracking-wider text-ink tabular-nums">
      {time || "—:—"} <span className="text-ink-mute">IST</span>
    </span>
  );
}

const links: { label: string; href: string; external: boolean }[] = [
  { label: "Email", href: `mailto:${meta.email}`, external: false },
  { label: "GitHub", href: meta.github, external: true },
  { label: "LinkedIn", href: meta.linkedin, external: true },
  { label: "Blog", href: meta.blog, external: true },
  { label: "Medium", href: meta.medium, external: true },
];

export function Footer() {
  return (
    <footer id="colophon" className="section relative scroll-mt-24">
      <div className="w-full max-w-[640px] px-6 lg:px-10">
        <span className="marginalia text-ink-mute">§ VII · Colophon</span>
        <hr className="rule mt-2" />

        {/* End of the line — Remotion + three.js locomotive on a turntable */}
        <Reveal>
          <div className="mt-8 flex flex-col items-start gap-1">
            <LocoClip width={240} height={160} className="-ml-2 opacity-95" />
            <span className="marginalia text-ink-mute">End of the line — no. 47</span>
          </div>
        </Reveal>

        <Reveal delay={0.1}>
          <p className="marginalia text-ink-mute mt-14 mb-5">Reach</p>
          <nav aria-label="Contact links">
            <ul className="flex flex-col gap-2">
              {links.map(({ label, href, external }) => (
                <li key={label}>
                  <Magnetic strength={0.2}>
                    <a
                      href={href}
                      data-cursor="hover"
                      className="group inline-flex items-baseline gap-2 font-display text-ink hover:text-accent transition-colors duration-300"
                      style={{ fontSize: "clamp(1.6rem, 4vw, 2.4rem)" }}
                      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                    >
                      <span className="text-accent transition-transform duration-300 group-hover:translate-x-1">
                        →
                      </span>
                      {label}
                    </a>
                  </Magnetic>
                </li>
              ))}
            </ul>
          </nav>
        </Reveal>

        <Reveal delay={0.15}>
          <div className="mt-14 grid grid-cols-2 gap-x-6 gap-y-6">
            <div>
              <p className="marginalia text-ink-mute mb-1">Location</p>
              <p className="font-mono text-xs uppercase tracking-wider text-ink">Bengaluru · IN</p>
            </div>
            <div>
              <p className="marginalia text-ink-mute mb-1">Local time</p>
              <LocalClock />
            </div>
          </div>

          <p className="font-body text-sm text-ink-2 leading-relaxed mt-10">
            Set in Archivo and Newsreader. Composed with Next.js, Tailwind v4, Motion
            and three.js. Rendered in a single page.
          </p>
          <p className="marginalia text-ink-mute mt-4">
            © 2026 Ankit Kumar. Words are mine. Code on{" "}
            <a href={meta.github} className="link-underline text-ink hover:text-accent" target="_blank" rel="noopener noreferrer">
              GitHub
            </a>
            .
          </p>

          <div className="mt-10 border-t border-rule pt-5 flex items-center justify-between">
            <span className="marginalia text-ink-mute">v1.0.0 — built in a weekend</span>
            <a href="#top" data-cursor="hover" className="link-underline marginalia text-ink-mute hover:text-accent">
              ↑ Back to top
            </a>
          </div>
        </Reveal>
      </div>
    </footer>
  );
}

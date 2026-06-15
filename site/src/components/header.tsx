"use client";

import { useEffect, useState } from "react";
import { Clock } from "./clock";
import { Logo } from "./logo";
import { SNAKE_SECTIONS } from "@/lib/snake";

// Skip the cover; the nav lists the readable chapters.
const sections = SNAKE_SECTIONS.slice(1);

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 flex items-center justify-between px-6 py-4 transition-all md:px-12 ${
        scrolled
          ? "backdrop-blur-sm bg-paper/80 border-b border-rule"
          : "bg-transparent border-b border-transparent"
      }`}
    >
      <a href="#top" className="group flex items-center gap-2.5" data-cursor="hover" aria-label="LoneBuilder — home">
        <Logo className="h-7 w-7 shrink-0 transition-transform duration-300 group-hover:-rotate-3" />
        <span className="font-display text-base leading-none tracking-tight">
          <span className="text-ink">LONE</span><span style={{ color: "#3aa6e6" }}>BUILDER</span>
        </span>
      </a>

      <nav aria-label="Sections" className="hidden md:flex items-center gap-7">
        {sections.map((s) => (
          <a
            key={s.id}
            href={`#${s.id}`}
            className="group flex items-baseline gap-1.5 font-mono text-[11px] uppercase tracking-wider text-ink-2 hover:text-accent transition-colors"
            data-cursor="hover"
          >
            <span className="text-accent/70 group-hover:text-accent">{s.numeral}</span>
            <span>{s.label}</span>
          </a>
        ))}
      </nav>

      <div className="hidden sm:flex items-center gap-3">
        <span className="marginalia">India</span>
        <span className="h-3 w-px bg-rule" aria-hidden />
        <Clock />
      </div>
    </header>
  );
}

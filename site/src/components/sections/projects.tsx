"use client";

import { Reveal } from "@/components/reveal";
import { Parallax } from "@/components/parallax";
import { projects, type Project } from "@/lib/data";

function StatusIndicator({ status }: { status: Project["status"] }) {
  if (status === "ongoing") {
    return (
      <span className="inline-flex items-center gap-1.5">
        <span className="relative inline-flex h-1.5 w-1.5 shrink-0">
          <span className="absolute inset-0 animate-ping rounded-full bg-accent opacity-50" />
          <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-accent" />
        </span>
        ongoing
      </span>
    );
  }

  if (status === "shipped") {
    return (
      <span className="inline-flex items-center gap-1.5">
        <span className="inline-block h-1.5 w-1.5 shrink-0 bg-accent" />
        shipped
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1.5">
      <span className="inline-block h-1.5 w-1.5 shrink-0 border border-ink-mute" />
      archived
    </span>
  );
}

function ProjectEntry({ project, delay }: { project: Project; delay: number }) {
  return (
    <Reveal delay={delay}>
      <a
        href={project.href}
        target="_blank"
        rel="noopener noreferrer"
        data-cursor="view"
        data-cursor-text="open"
        className="group relative block border-t border-rule py-10 md:py-14 transition-colors"
        aria-label={`${project.title} — opens on GitHub`}
      >
        <div className="grid grid-cols-12 gap-x-6 gap-y-4 items-start">
          {/* Col 1: Roman numeral */}
          <div className="col-span-1 pt-1">
            <span
              aria-hidden
              className="numeral text-[clamp(1.4rem,2.5vw,2rem)] leading-none opacity-50 inline-block transition-all duration-300 group-hover:opacity-100 group-hover:-translate-x-1"
            >
              {project.index}
            </span>
          </div>

          {/* Col 2–7: Title + blurb */}
          <div className="col-span-11 md:col-span-6">
            <h3
              className="font-display text-ink leading-[1.1] transition-all duration-300 group-hover:[font-style:italic]"
              style={{ fontSize: "clamp(1.8rem, 3.5vw, 2.8rem)" }}
            >
              {project.title}
            </h3>
            <p className="mt-3 font-body text-ink-2 leading-relaxed max-w-[50ch] text-base">
              {project.blurb}
            </p>
          </div>

          {/* Col 8–9: Kind + year */}
          <div className="hidden md:flex col-span-2 flex-col gap-1 pt-1.5">
            <span className="marginalia text-ink-mute">{project.meta.kind}</span>
            <span className="marginalia text-ink-mute">{project.meta.year}</span>
          </div>

          {/* Col 10–12: Stack + status + arrow */}
          <div className="hidden md:flex col-span-3 flex-col justify-between h-full gap-3 pt-1.5">
            <p className="marginalia text-ink-mute leading-loose">
              {project.meta.stack.join(" · ")}
            </p>
            <div className="marginalia text-ink-mute mt-auto">
              <span className="block mb-0.5 text-ink-mute/60">STATUS</span>
              <StatusIndicator status={project.status} />
            </div>
          </div>
        </div>

        {/* Mobile: kind/year/stack/status row */}
        <div className="md:hidden mt-4 flex flex-wrap items-center gap-x-4 gap-y-2">
          <span className="marginalia">{project.meta.kind}</span>
          <span className="marginalia">{project.meta.year}</span>
          <span className="marginalia">{project.meta.stack.join(" · ")}</span>
          <span className="marginalia">
            <StatusIndicator status={project.status} />
          </span>
        </div>

        {/* Arrow — appears and shifts on hover */}
        <div
          aria-hidden
          className="hidden md:block absolute right-0 top-1/2 -translate-y-1/2 text-accent marginalia text-base opacity-0 translate-x-0 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-2 pointer-events-none select-none"
        >
          →
        </div>
      </a>
    </Reveal>
  );
}

export function Projects() {
  return (
    <section
      id="specimens"
      className="section relative scroll-mt-24 px-6 md:px-12"
    >
      {/* Background decorative numeral */}
      <Parallax
        offset={60}
        className="pointer-events-none absolute inset-0 z-0 overflow-hidden"
      >
        <div className="absolute -right-[6vw] top-[8vh] select-none">
          <span
            aria-hidden
            className="font-display text-[clamp(18rem,32vw,44rem)] leading-none text-accent/[0.05] tracking-tight"
          >
            II
          </span>
        </div>
      </Parallax>

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Section header marginalia row */}
        <div className="flex items-center justify-between mb-0">
          <span className="marginalia">§II · Specimens</span>
          <span className="marginalia">Selected work — 2024 → 2026</span>
        </div>
        <hr className="rule mt-2" />

        {/* Eyebrow heading */}
        <Reveal delay={0.05}>
          <h2 className="font-display italic text-ink mt-12 mb-2" style={{ fontSize: "clamp(2.5rem, 6vw, 5rem)" }}>
            Specimens.
          </h2>
          <p className="font-body italic text-ink-2 text-lg md:text-xl">
            Five working artifacts. Open one to read the receipts.
          </p>
        </Reveal>

        {/* Project entries list */}
        <div className="relative mt-10">
          {projects.map((project, index) => (
            <div key={project.id} className="relative">
              <ProjectEntry project={project} delay={index * 0.1} />
            </div>
          ))}
          {/* Closing rule after last entry */}
          <hr className="rule" />
        </div>

        {/* Footer link */}
        <Reveal delay={0.5}>
          <div className="mt-8">
            <a
              href="https://github.com/imaddi47?tab=repositories"
              data-cursor="hover"
              className="link-underline marginalia"
            >
              All 22 repositories on GitHub →
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

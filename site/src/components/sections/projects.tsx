"use client";

import { Reveal } from "@/components/reveal";
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
      <span className="inline-block h-1.5 w-1.5 shrink-0 border border-rule-strong" />
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
        aria-label={`${project.title} — opens on GitHub`}
        className="group block border-t border-rule py-8 transition-colors"
      >
        <div className="flex items-baseline justify-between gap-4">
          <div className="flex items-baseline gap-3 min-w-0">
            <span
              aria-hidden
              className="numeral text-accent opacity-50 transition-opacity duration-300 group-hover:opacity-100 shrink-0"
            >
              {project.index}
            </span>
            <h3 className="font-display text-ink text-xl leading-tight transition-colors duration-300 group-hover:text-accent">
              {project.title}
              <span
                aria-hidden
                className="ml-2 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
              >
                →
              </span>
            </h3>
          </div>
          <span className="marginalia text-ink-mute shrink-0">{project.meta.year}</span>
        </div>

        <p className="mt-2 font-body text-ink-2 leading-relaxed text-sm max-w-prose">
          {project.blurb}
        </p>

        <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1">
          <span className="marginalia text-ink-mute">
            {project.meta.stack.join(" · ")}
          </span>
          <span className="marginalia text-ink-mute">·</span>
          <span className="marginalia text-ink-mute">
            <StatusIndicator status={project.status} />
          </span>
        </div>
      </a>
    </Reveal>
  );
}

export function Projects() {
  return (
    <section id="specimens" className="section relative scroll-mt-24">
      <div className="w-full max-w-[640px] px-6 lg:px-10">
        <span className="marginalia text-ink-mute">§ III · Specimens</span>
        <hr className="rule mt-2" />

        <Reveal delay={0.05}>
          <h2 className="font-display text-ink mt-10 mb-2" style={{ fontSize: "clamp(2rem,5vw,3.5rem)" }}>
            Specimens.
          </h2>
          <p className="font-body text-ink-2 text-base">
            Five working artifacts. Open one to read the receipts.
          </p>
        </Reveal>

        <div className="mt-8">
          {projects.map((project, index) => (
            <ProjectEntry key={project.id} project={project} delay={index * 0.08} />
          ))}
          <hr className="rule" />
        </div>

        <Reveal delay={0.45}>
          <div className="mt-6">
            <a
              href="https://github.com/imaddi47?tab=repositories"
              target="_blank"
              rel="noopener noreferrer"
              className="marginalia text-ink-mute hover:text-accent transition-colors duration-200"
            >
              All repositories on GitHub →
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

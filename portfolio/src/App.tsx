import { useEffect, useMemo, useState } from "react";
import { profile, secondarySystems, signals, skillGroups, systems, writings } from "./data";

function App() {
  const carouselSystems = useMemo(() => systems.slice(0, 4), []);
  const [activeSystemIndex, setActiveSystemIndex] = useState(0);
  const activeSystem = carouselSystems[activeSystemIndex];

  useEffect(() => {
    const root = document.documentElement;
    const onScroll = () => {
      const y = window.scrollY;
      root.style.setProperty("--grid-y", `${Math.round(y * 0.08)}px`);
      root.style.setProperty("--grid-x", `${Math.round(y * -0.04)}px`);
      root.style.setProperty("--hero-copy-y", `${Math.round(Math.min(y * 0.025, 22))}px`);
      root.style.setProperty("--hero-panel-y", `${Math.round(Math.max(y * -0.018, -18))}px`);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion) return;

    const interval = window.setInterval(() => {
      setActiveSystemIndex((index) => (index + 1) % carouselSystems.length);
    }, 4600);

    return () => window.clearInterval(interval);
  }, [carouselSystems.length]);

  useEffect(() => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion) return;

    document.documentElement.classList.add("motion-ready");
    const targets = Array.from(document.querySelectorAll("[data-reveal]"));
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { rootMargin: "0px 0px -12% 0px", threshold: 0.12 },
    );

    targets.forEach((target) => observer.observe(target));
    return () => {
      observer.disconnect();
      document.documentElement.classList.remove("motion-ready");
    };
  }, []);

  const goToSystem = (direction: "next" | "previous") => {
    setActiveSystemIndex((index) => {
      if (direction === "next") return (index + 1) % carouselSystems.length;
      return (index - 1 + carouselSystems.length) % carouselSystems.length;
    });
  };

  return (
    <main>
      <header className="topbar" aria-label="Primary">
        <a className="brand" href="#top" aria-label="Ankit Kumar home">
          AK
        </a>
        <nav>
          <a href="#systems">Systems</a>
          <a href="#writing">Writing</a>
          <a href="#stack">Stack</a>
          <a href={`mailto:${profile.email}`}>Contact</a>
        </nav>
      </header>

      <section className="hero" id="top">
        <div className="hero-copy" data-reveal>
          <p className="eyebrow">Infrastructure · DevOps · Solo systems</p>
          <h1>{profile.name}</h1>
          <p className="lede">{profile.headline}</p>
          <p className="focus">{profile.focus}</p>
          <div className="hero-actions" aria-label="Profile links">
            {profile.links.map((link) => (
              <a key={link.href} href={link.href}>
                {link.label}
                <span aria-hidden="true">-&gt;</span>
              </a>
            ))}
          </div>
        </div>
        <aside className="operator-panel" aria-label="Operator profile summary" data-reveal>
          <img src="https://github.com/imaddi47.png" alt="Ankit Kumar GitHub avatar" />
          <div>
            <p className="panel-label">Operator profile</p>
            <strong>@{profile.handle}</strong>
            <span>Cloud tooling, secure admin systems, local-first AI workflows.</span>
          </div>
        </aside>
      </section>

      <section className="signals" aria-label="Profile signals">
        {signals.map((signal) => (
          <div key={signal.label} data-reveal>
            <span>{signal.label}</span>
            <strong>{signal.value}</strong>
          </div>
        ))}
      </section>

      <section className="section motion-section" aria-label="Featured systems carousel" data-reveal>
        <div className="section-heading">
          <p className="eyebrow">Build queue</p>
          <h2>Highlighted systems, rotating through the operational proof.</h2>
        </div>
        <div className="carousel-shell">
          <div className="carousel-stage" key={`${activeSystem.title}-stage`}>
            {activeSystem.image ? (
              <img src={activeSystem.image.src} alt={activeSystem.image.alt} />
            ) : (
              <div className="carousel-diagram" aria-label={`${activeSystem.title} flow`}>
                <span>Source</span>
                <span>Control</span>
                <span>Policy</span>
                <span>Audit</span>
              </div>
            )}
          </div>
          <div className="carousel-copy" key={`${activeSystem.title}-copy`}>
            <span>{activeSystem.domain}</span>
            <h3>{activeSystem.title}</h3>
            <p>{activeSystem.summary}</p>
            <ul>
              {activeSystem.proof.slice(0, 2).map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
            <div className="carousel-controls">
              <button type="button" aria-label="Previous system" onClick={() => goToSystem("previous")}>
                &lt;
              </button>
              <div className="carousel-dots" aria-label="Carousel position">
                {carouselSystems.map((system, index) => (
                  <button
                    type="button"
                    key={system.title}
                    className={index === activeSystemIndex ? "active" : ""}
                    aria-label={`Show ${system.title}`}
                    aria-current={index === activeSystemIndex}
                    onClick={() => setActiveSystemIndex(index)}
                  />
                ))}
              </div>
              <button type="button" aria-label="Next system" onClick={() => goToSystem("next")}>
                &gt;
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="section" id="systems">
        <div className="section-heading">
          <p className="eyebrow">Featured systems</p>
          <h2>Tools for people who operate real infrastructure.</h2>
        </div>

        <div className="system-grid">
          {systems.map((system) => (
            <article className="system-card" key={system.title} data-reveal>
              <div className="card-head">
                <span>{system.domain}</span>
                <small>{system.status}</small>
              </div>
              <h3>{system.title}</h3>
              <p>{system.summary}</p>
              {system.image ? (
                <img className="system-image" src={system.image.src} alt={system.image.alt} />
              ) : (
                <div className="system-diagram" aria-label={`${system.title} system diagram`}>
                  <span>Input</span>
                  <span>Control plane</span>
                  <span>Audit</span>
                </div>
              )}
              <ul>
                {system.proof.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
              <div className="stack-list">
                {system.stack.map((item) => (
                  <span key={item}>{item}</span>
                ))}
              </div>
              {system.link ? (
                <a className="evidence-link" href={system.link.href}>
                  {system.link.label}
                  <span aria-hidden="true">-&gt;</span>
                </a>
              ) : null}
            </article>
          ))}
        </div>
      </section>

      <section className="section compact-section">
        <div className="section-heading" data-reveal>
          <p className="eyebrow">More builds</p>
          <h2>Smaller surfaces, same operator bias.</h2>
        </div>
        <div className="mini-grid">
          {secondarySystems.map((system) => (
            <article className="mini-card" key={system.title} data-reveal>
              <span>{system.domain}</span>
              <h3>{system.title}</h3>
              <p>{system.summary}</p>
              <div className="stack-list">
                {system.stack.map((item) => (
                  <span key={item}>{item}</span>
                ))}
              </div>
              {system.link ? <a href={system.link.href}>{system.link.label}</a> : null}
            </article>
          ))}
        </div>
      </section>

      <section className="section split-section" id="writing">
        <div className="section-heading sticky-heading" data-reveal>
          <p className="eyebrow">Writing</p>
          <h2>Notes from the sharp edges of infra work.</h2>
        </div>
        <div className="writing-list">
          {writings.map((writing) => (
            <a className="writing-row" href={writing.href} key={writing.href} data-reveal>
              <time>{writing.date}</time>
              <strong>{writing.title}</strong>
              <span>{writing.tags.join(" · ")}</span>
            </a>
          ))}
        </div>
      </section>

      <section className="section" id="stack">
        <div className="section-heading" data-reveal>
          <p className="eyebrow">Stack</p>
          <h2>Practical tools, chosen for systems that have to keep running.</h2>
        </div>
        <div className="skill-grid">
          {skillGroups.map((group) => (
            <article className="skill-group" key={group.title} data-reveal>
              <h3>{group.title}</h3>
              <div className="stack-list">
                {group.items.map((item) => (
                  <span key={item}>{item}</span>
                ))}
              </div>
            </article>
          ))}
        </div>
      </section>

      <footer>
        <div>
          <strong>{profile.name}</strong>
          <span>Infrastructure tools, operator platforms, local-first AI workflows.</span>
        </div>
        <a href={`mailto:${profile.email}`}>{profile.email}</a>
      </footer>
    </main>
  );
}

export default App;

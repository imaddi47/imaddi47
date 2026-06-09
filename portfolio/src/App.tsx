import { useEffect, useMemo, useState } from "react";
import InfraScene from "./InfraScene";
import { profile, secondarySystems, signals, skillGroups, systems, writings } from "./data";

const trackerSections = [
  { id: "top", label: "Boot" },
  { id: "systems", label: "Systems" },
  { id: "writing", label: "Field notes" },
  { id: "stack", label: "Stack" },
];

const codeLines = [
  "terraform plan -out infra.operator.tfplan",
  "aws ssm get-parameters-by-path --with-decryption=false",
  "openvpn-agent enroll --audit-stream websocket",
  "codex run --sandbox disposable --ship-local-first",
  "gh workflow run deploy-profile.yml --ref profile-update",
];

function App() {
  const featuredSystems = useMemo(() => systems.slice(0, 4), []);
  const [activeSystemIndex, setActiveSystemIndex] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [activeSection, setActiveSection] = useState("top");
  const activeSystem = featuredSystems[activeSystemIndex];

  useEffect(() => {
    const root = document.documentElement;
    const onScroll = () => {
      const scrollable = document.body.scrollHeight - window.innerHeight;
      const progress = scrollable > 0 ? window.scrollY / scrollable : 0;
      setScrollProgress(Math.min(Math.max(progress, 0), 1));
      root.style.setProperty("--scroll-progress", `${Math.round(progress * 100)}%`);
      root.style.setProperty("--mesh-y", `${Math.round(window.scrollY * 0.12)}px`);
      root.style.setProperty("--mesh-x", `${Math.round(window.scrollY * -0.05)}px`);
      root.style.setProperty("--hero-drift", `${Math.round(Math.min(window.scrollY * 0.035, 34))}px`);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion) return;

    const interval = window.setInterval(() => {
      setActiveSystemIndex((index) => (index + 1) % featuredSystems.length);
    }, 5200);

    return () => window.clearInterval(interval);
  }, [featuredSystems.length]);

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
            const id = entry.target.getAttribute("id");
            if (id && trackerSections.some((section) => section.id === id)) {
              setActiveSection(id);
            }
          }
        });
      },
      { rootMargin: "-20% 0px -58% 0px", threshold: 0.1 },
    );

    targets.forEach((target) => observer.observe(target));
    return () => {
      observer.disconnect();
      document.documentElement.classList.remove("motion-ready");
    };
  }, []);

  const goToSystem = (direction: "next" | "previous") => {
    setActiveSystemIndex((index) => {
      if (direction === "next") return (index + 1) % featuredSystems.length;
      return (index - 1 + featuredSystems.length) % featuredSystems.length;
    });
  };

  return (
    <main>
      <div className="page-chrome" aria-hidden="true" />
      <header className="topbar" aria-label="Primary">
        <a className="brand" href="#top" aria-label="Ankit Kumar home">
          <span>AK</span>
        </a>
        <nav>
          <a href="#systems">Systems</a>
          <a href="#writing">Writing</a>
          <a href="#stack">Stack</a>
          <a href={`mailto:${profile.email}`}>Contact</a>
        </nav>
      </header>

      <aside className="scroll-tracker" aria-label="Page sections">
        <span className="tracker-line" aria-hidden="true" />
        {trackerSections.map((section) => (
          <a
            className={activeSection === section.id ? "active" : ""}
            href={`#${section.id}`}
            key={section.id}
            aria-current={activeSection === section.id ? "location" : undefined}
          >
            <span />
            {section.label}
          </a>
        ))}
      </aside>

      <section className="hero" id="top" data-reveal>
        <div className="hero-copy">
          <p className="eyebrow">Infrastructure · DevOps · solo operator</p>
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

        <div className="hero-visual" aria-label="Animated infrastructure graph">
          <InfraScene scrollProgress={scrollProgress} />
          <div className="hud-card profile-hud">
            <img src="https://github.com/imaddi47.png" alt="Ankit Kumar GitHub avatar" />
            <div>
              <span>operator</span>
              <strong>@{profile.handle}</strong>
            </div>
          </div>
          <div className="hud-card status-hud">
            <span>focus</span>
            <strong>secure cloud tools</strong>
          </div>
        </div>
      </section>

      <section className="command-strip" aria-label="Animated command stream">
        <div className="ticker">
          {[...codeLines, ...codeLines].map((line, index) => (
            <span key={`${line}-${index}`}>{line}</span>
          ))}
        </div>
      </section>

      <section className="signals" aria-label="Profile signals">
        {signals.map((signal) => (
          <div key={signal.label} data-reveal>
            <span>{signal.label}</span>
            <strong>{signal.value}</strong>
          </div>
        ))}
      </section>

      <section className="section spotlight-section" aria-label="Featured system scanner" data-reveal>
        <div className="section-heading">
          <p className="eyebrow">Live build scanner</p>
          <h2>Operator-facing systems with audit trails, guarded workflows, and local-first bias.</h2>
        </div>
        <div className="scanner-shell">
          <div className="scanner-visual" key={`${activeSystem.title}-visual`}>
            <div className="scan-grid" aria-hidden="true" />
            {activeSystem.image ? (
              <img src={activeSystem.image.src} alt={activeSystem.image.alt} />
            ) : (
              <div className="pipeline-map" aria-label={`${activeSystem.title} pipeline map`}>
                <span>input</span>
                <span>control</span>
                <span>policy</span>
                <span>audit</span>
              </div>
            )}
          </div>
          <div className="scanner-copy" key={`${activeSystem.title}-copy`}>
            <span>{activeSystem.domain}</span>
            <h3>{activeSystem.title}</h3>
            <p>{activeSystem.summary}</p>
            <ul>
              {activeSystem.proof.slice(0, 3).map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
            <div className="carousel-controls">
              <button type="button" aria-label="Previous system" onClick={() => goToSystem("previous")}>
                &lt;
              </button>
              <div className="carousel-dots" aria-label="Scanner position">
                {featuredSystems.map((system, index) => (
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

      <section className="section systems-section" id="systems" data-reveal>
        <div className="section-heading">
          <p className="eyebrow">Case studies</p>
          <h2>Builds that turn infrastructure pressure into product surfaces.</h2>
        </div>

        <div className="system-stack">
          {systems.map((system, index) => (
            <article className="system-case" key={system.title} data-reveal>
              <div className="case-index">0{index + 1}</div>
              <div className="case-copy">
                <div className="case-meta">
                  <span>{system.domain}</span>
                  <small>{system.status}</small>
                </div>
                <h3>{system.title}</h3>
                <p>{system.summary}</p>
                {system.link ? (
                  <a className="evidence-link" href={system.link.href}>
                    {system.link.label}
                    <span aria-hidden="true">-&gt;</span>
                  </a>
                ) : null}
              </div>
              <div className="case-proof">
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
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="section compact-section" data-reveal>
        <div className="section-heading">
          <p className="eyebrow">Side channels</p>
          <h2>Smaller builds that show the same operating taste.</h2>
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

      <section className="section split-section" id="writing" data-reveal>
        <div className="section-heading sticky-heading">
          <p className="eyebrow">Incident notes</p>
          <h2>Writing from the sharp edges: Docker, DNS, Cloudflare, migrations, AI tooling.</h2>
        </div>
        <div className="writing-list">
          {writings.map((writing, index) => (
            <a className="writing-row" href={writing.href} key={writing.href} data-reveal>
              <time>{writing.date}</time>
              <strong>{writing.title}</strong>
              <span>{writing.tags.join(" · ")}</span>
              <em>read_0{index + 1}</em>
            </a>
          ))}
        </div>
      </section>

      <section className="section stack-section" id="stack" data-reveal>
        <div className="section-heading">
          <p className="eyebrow">Toolchain</p>
          <h2>Practical stack choices for systems that need to stay understandable under load.</h2>
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

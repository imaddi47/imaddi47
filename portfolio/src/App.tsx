import { profile, secondarySystems, signals, skillGroups, systems, writings } from "./data";

function App() {
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
        <div className="hero-copy">
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
        <aside className="operator-panel" aria-label="Operator profile summary">
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
          <div key={signal.label}>
            <span>{signal.label}</span>
            <strong>{signal.value}</strong>
          </div>
        ))}
      </section>

      <section className="section" id="systems">
        <div className="section-heading">
          <p className="eyebrow">Featured systems</p>
          <h2>Tools for people who operate real infrastructure.</h2>
        </div>

        <div className="system-grid">
          {systems.map((system) => (
            <article className="system-card" key={system.title}>
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
        <div className="section-heading">
          <p className="eyebrow">More builds</p>
          <h2>Smaller surfaces, same operator bias.</h2>
        </div>
        <div className="mini-grid">
          {secondarySystems.map((system) => (
            <article className="mini-card" key={system.title}>
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
        <div className="section-heading sticky-heading">
          <p className="eyebrow">Writing</p>
          <h2>Notes from the sharp edges of infra work.</h2>
        </div>
        <div className="writing-list">
          {writings.map((writing) => (
            <a className="writing-row" href={writing.href} key={writing.href}>
              <time>{writing.date}</time>
              <strong>{writing.title}</strong>
              <span>{writing.tags.join(" · ")}</span>
            </a>
          ))}
        </div>
      </section>

      <section className="section" id="stack">
        <div className="section-heading">
          <p className="eyebrow">Stack</p>
          <h2>Practical tools, chosen for systems that have to keep running.</h2>
        </div>
        <div className="skill-grid">
          {skillGroups.map((group) => (
            <article className="skill-group" key={group.title}>
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

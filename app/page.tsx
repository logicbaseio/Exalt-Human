import Image from "next/image";
import OptimizationDispatch from "./components/OptimizationDispatch";
import WholeHumanSystem from "./components/WholeHumanSystem";

const articles = [
  {
    className: "story story-lead",
    slug: "sleep-is-the-foundation",
    category: "Sleep",
    title: "Sleep is the foundation. Everything else is downstream.",
    summary:
      "How sleep shapes cognition, metabolism, immunity, emotional regulation, and adaptation—and where the science is still evolving.",
    time: "12 min read",
    updated: "Jul 2026",
    image: "/article-sleep.jpg",
    width: 1122,
    height: 1402,
    alt: "A calm sleeping profile with a softly illuminated brain",
  },
  {
    className: "story story-nervous",
    slug: "your-nervous-system-is-always-listening",
    category: "Nervous system",
    title: "Your nervous system is always listening.",
    summary:
      "Stress, safety, regulation, and the signals your body processes before conscious thought.",
    time: "10 min read",
    updated: "Jul 2026",
    image: "/article-nervous-system.jpg",
    width: 1402,
    height: 1122,
    alt: "A human profile revealing the nervous system and spinal pathways",
  },
  {
    className: "story story-metabolism",
    slug: "metabolism-is-more-than-calories",
    category: "Metabolism",
    title: "Metabolism is more than calories.",
    summary:
      "Energy production, hormones, movement, sleep, and nutrition across the human system.",
    time: "9 min read",
    updated: "Jul 2026",
    image: "/article-metabolism.jpg",
    width: 1536,
    height: 1024,
    alt: "A detailed visualization of mitochondria within a human cell",
  },
];

export default function Home() {
  return (
    <main>
      <section
        className="hero"
        id="top"
        aria-labelledby="hero-title"
      >
        <header className="site-header">
          <a className="wordmark" href="#top" aria-label="Exalt Human home">
            <Image
              className="brand-logo"
              src="/exalt-human-logo.png"
              alt=""
              width={196}
              height={51}
              priority
              unoptimized
            />
          </a>

          <nav className="desktop-nav" aria-label="Primary navigation">
            <a href="#atlas">Whole Human</a>
            <a href="#research">Research</a>
            <a href="#standard">Our standard</a>
          </nav>

          <a className="header-link" href="#research">
            Explore <span aria-hidden="true">↗</span>
          </a>

          <details className="mobile-nav">
            <summary aria-label="Open navigation">
              <span />
              <span />
            </summary>
            <nav aria-label="Mobile navigation">
              <a href="#atlas">Whole Human</a>
              <a href="#research">Research journal</a>
              <a href="#standard">Research standard</a>
              <a href="#newsletter">The Dispatch</a>
            </nav>
          </details>
        </header>

        <div className="hero-media" aria-hidden="true">
          <div className="hero-anatomy">
            <Image
              className="hero-anatomy-base"
              src="/hero-sequence/frame-16.webp"
              alt=""
              fill
              priority
              sizes="100vw"
              unoptimized
            />
            <div className="hero-anatomy-reveal">
              <Image
                className="hero-anatomy-color"
                src="/hero-sequence/frame-16.webp"
                alt=""
                fill
                priority
                sizes="100vw"
                unoptimized
              />
            </div>
            <div className="hero-scan-beam" />
            <div className="hero-signal hero-signal-brain">
              <i />
              <span>Neural activity</span>
            </div>
            <div className="hero-signal hero-signal-heart">
              <i />
              <span>Cardiac activity</span>
            </div>
          </div>
          <div className="hero-grid" />
          <div className="hero-vignette" />
        </div>

        <div className="hero-content shell">
          <div className="hero-copy">
            <p className="signal-label">
              <span />
              01 · Human operating system
            </p>
            <h1 className="hero-display" id="hero-title">
              Your body is the technology. Learn to operate it.
            </h1>
            <p className="hero-message-copy">
              Independent, evidence-led intelligence for optimizing body, mind,
              psychology, health, and human potential.
            </p>
            <div className="hero-actions">
              <a className="hero-action-primary" href="#atlas">
                See the whole system <span aria-hidden="true">↘</span>
              </a>
              <a className="hero-action-secondary" href="#research">
                Read the research <span aria-hidden="true">↗</span>
              </a>
            </div>
          </div>
        </div>

        <div className="hero-axis shell" aria-hidden="true">
          <div className="hero-domains">
            <span>Body</span>
            <span>Mind</span>
            <span>Psychology</span>
            <span>Health</span>
            <span>Spirit</span>
          </div>
          <div className="hero-live-state">
            <i />
            <span>Live anatomical map</span>
          </div>
        </div>

        <div className="hero-figure-label" aria-hidden="true">
          <span>FIG. 001</span>
          <span>HUMAN SYSTEM</span>
        </div>
      </section>

      <section className="thesis" id="thesis" aria-labelledby="thesis-title">
        <div className="thesis-word" aria-hidden="true">
          HUMAN
        </div>
        <div className="shell thesis-grid">
          <div className="thesis-index">
            <span>01</span>
            <span>THE WHOLE SYSTEM</span>
          </div>
          <div>
            <p className="section-kicker">The principle</p>
            <h2 id="thesis-title">You were never built in parts.</h2>
            <p className="thesis-lead">
              Every thought has biology. Every behavior has context. Every
              system changes the systems around it.
            </p>
          </div>
          <div className="thesis-signals">
            <p>
              <span>01</span>
              Your nervous system listens.
            </p>
            <p>
              <span>02</span>
              Your metabolism responds.
            </p>
            <p>
              <span>03</span>
              Your psychology adapts.
            </p>
          </div>
        </div>
      </section>

      <WholeHumanSystem />

      <section
        className="research-journal"
        id="research"
        aria-labelledby="research-title"
      >
        <div className="journal-intro shell">
          <p className="section-kicker">The research journal</p>
          <h2 id="research-title">
            Ideas that change how you see yourself.
          </h2>
          <p>
            Evidence-led explorations of the body, mind, and conditions that
            shape human potential.
          </p>
        </div>

        <div className="story-grid shell">
          {articles.map((article, index) => (
            <a
              className={article.className}
              href={`/articles/${article.slug}`}
              key={article.title}
            >
              <div className="story-image">
                <Image
                  src={article.image}
                  alt={article.alt}
                  width={article.width}
                  height={article.height}
                  sizes="(max-width: 820px) calc(100vw - 32px), (max-width: 1160px) 31vw, 470px"
                />
              </div>
              <div className="story-meta">
                <div>
                  <span>{article.category}</span>
                  <span>{article.time}</span>
                  <span>{article.updated}</span>
                </div>
                <span className="story-number" aria-hidden="true">
                  0{index + 1}
                </span>
              </div>
              <h3>{article.title}</h3>
              <p>{article.summary}</p>
              <span className="story-link">
                Read the research <i aria-hidden="true">↗</i>
              </span>
            </a>
          ))}
        </div>
      </section>

      <section className="standard" id="standard" aria-labelledby="standard-title">
        <div className="shell standard-top">
          <p className="section-kicker">The Exalt standard</p>
          <h2 id="standard-title">We show our working.</h2>
          <p>
            Research is rarely a simple yes or no. We make the strength,
            limits, and maturity of the evidence visible.
          </p>
        </div>

        <div className="shell evidence-spectrum" aria-label="Evidence spectrum">
          <div className="spectrum-labels">
            <span>
              <b>Established</b>
              Repeated, high-confidence findings
            </span>
            <span>
              <b>Evolving</b>
              Promising evidence with open questions
            </span>
            <span>
              <b>Exploratory</b>
              Early mechanisms and hypotheses
            </span>
          </div>
          <div className="spectrum-track" aria-hidden="true">
            <i />
            <i />
            <i />
          </div>
        </div>

        <div className="shell standard-principles">
          <article>
            <span>01</span>
            <h3>Source the claim.</h3>
            <p>
              Peer-reviewed evidence and review dates accompany every
              research-led article.
            </p>
          </article>
          <article>
            <span>02</span>
            <h3>Preserve the nuance.</h3>
            <p>
              Association is not causation. Plausible is not proven. We say
              which is which.
            </p>
          </article>
          <article>
            <span>03</span>
            <h3>Update the record.</h3>
            <p>
              When the evidence changes, our interpretation changes with it.
            </p>
          </article>
        </div>
      </section>

      <OptimizationDispatch />

      <footer className="site-footer">
        <div className="shell">
          <div className="footer-top">
            <a className="wordmark" href="#top" aria-label="Exalt Human home">
              <Image
                className="brand-logo"
                src="/exalt-human-logo.png"
                alt=""
                width={196}
                height={51}
                unoptimized
              />
            </a>
            <p>Clearer knowledge for the system you live in.</p>
          </div>
          <div className="footer-bottom">
            <nav aria-label="Footer navigation">
              <a href="#atlas">Whole Human</a>
              <a href="#research">Research</a>
              <a href="#standard">Editorial standard</a>
              <a href="#newsletter">The Dispatch</a>
            </nav>
            <div>
              <span>© 2026 Exalt Human</span>
              <span>Educational content. Not medical advice.</span>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}

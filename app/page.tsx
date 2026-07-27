"use client";

import { gsap } from "gsap";
import Image from "next/image";
import {
  KeyboardEvent,
  useEffect,
  useRef,
  useState,
} from "react";
import OptimizationDispatch from "./components/OptimizationDispatch";

const systems = [
  {
    number: "01",
    name: "Body",
    mode: "Physical capacity",
    visualCue: "Move · Fuel · Recover",
    descriptor: "Capacity · Recovery · Energy",
    thesis: "Build a body that can produce, recover, and adapt.",
    copy: "Physical optimization is not appearance alone. It is the capacity to move well, create energy, tolerate demand, and recover for what comes next.",
    supports: [
      "Progressive movement",
      "Restorative sleep",
      "Nutrient sufficiency",
    ],
    disrupts: [
      "Chronic under-recovery",
      "Prolonged inactivity",
      "Unmanaged overload",
    ],
    signals: ["Strength & mobility", "Energy & recovery", "Metabolic health"],
  },
  {
    number: "02",
    name: "Mind",
    mode: "Cognitive clarity",
    visualCue: "Focus · Learn · Decide",
    descriptor: "Attention · Learning · Clarity",
    thesis: "Train attention and protect the conditions for clear thought.",
    copy: "Mental optimization means directing attention, learning efficiently, preserving cognitive energy, and making better decisions under real-world pressure.",
    supports: ["Deep focus", "Quality sleep", "Deliberate learning"],
    disrupts: ["Constant switching", "Sleep debt", "Passive overload"],
    signals: ["Attention stability", "Learning & recall", "Cognitive energy"],
  },
  {
    number: "03",
    name: "Psychology",
    mode: "Adaptive behavior",
    visualCue: "Feel · Relate · Adapt",
    descriptor: "Emotion · Behavior · Identity",
    thesis: "Turn awareness into emotional range and adaptive behavior.",
    copy: "Psychological optimization is the ability to understand internal patterns, regulate emotion, relate securely, and respond rather than react.",
    supports: ["Self-awareness", "Emotional regulation", "Secure connection"],
    disrupts: ["Chronic threat", "Rigid self-narratives", "Social isolation"],
    signals: ["Stress recovery", "Behavioral patterns", "Relational health"],
  },
  {
    number: "04",
    name: "Health",
    mode: "Long-term resilience",
    visualCue: "Prevent · Restore · Endure",
    descriptor: "Prevention · Resilience · Longevity",
    thesis: "Protect long-term function through informed prevention.",
    copy: "Health optimization connects daily behavior with preventive care, evidence, personal risk, and the ability to remain capable across a lifetime.",
    supports: ["Preventive care", "Consistent recovery", "Risk-informed habits"],
    disrupts: [
      "Ignored warning signs",
      "Fragmented information",
      "Extreme interventions",
    ],
    signals: ["Clinical markers", "Risk trends", "Function over time"],
  },
];

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
  const [activeSystem, setActiveSystem] = useState(0);
  const atlasStageRef = useRef<HTMLDivElement>(null);
  const atlasTabs = useRef<Array<HTMLButtonElement | null>>([]);
  const currentSystem = systems[activeSystem];

  useEffect(() => {
    const stage = atlasStageRef.current;
    if (!stage) return;

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (reduceMotion) return;

    const scope = gsap.context(() => {
      const activeWorld = stage.querySelector(
        '.optimization-world[aria-selected="true"]',
      );
      const activeMotion = activeWorld?.querySelector(
        ".optimization-world-motion",
      );
      const panelCopy = stage.querySelectorAll(
        ".atlas-panel-meta, .atlas-panel-copy, .optimization-lens",
      );
      if (!activeWorld || !activeMotion) return;

      gsap.killTweensOf([activeWorld, activeMotion, panelCopy]);
      const timeline = gsap.timeline({
        defaults: { ease: "power3.out" },
      });
      timeline
        .fromTo(
          activeWorld,
          { scale: 0.985 },
          { scale: 1, duration: 0.62 },
          0,
        )
        .fromTo(
          activeMotion,
          { autoAlpha: 0 },
          { autoAlpha: 1, duration: 0.48 },
          0.12,
        )
        .fromTo(
          panelCopy,
          { opacity: 0, y: 18 },
          {
            opacity: 1,
            y: 0,
            duration: 0.55,
            stagger: 0.045,
          },
          0.1,
        );
    }, stage);

    return () => scope.revert();
  }, [activeSystem]);

  function handleAtlasKeys(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    const last = systems.length - 1;
    let next = index;

    if (event.key === "ArrowRight" || event.key === "ArrowDown") {
      next = index === last ? 0 : index + 1;
    } else if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
      next = index === 0 ? last : index - 1;
    } else if (event.key === "Home") {
      next = 0;
    } else if (event.key === "End") {
      next = last;
    } else {
      return;
    }

    event.preventDefault();
    setActiveSystem(next);
    atlasTabs.current[next]?.focus();
  }

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
              src="/branding/logo-full-light-red.png"
              alt=""
              width={196}
              height={51}
              priority
              unoptimized
            />
          </a>

          <nav className="desktop-nav" aria-label="Primary navigation">
            <a href="#atlas">Human Atlas</a>
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
              <a href="#atlas">Human Atlas</a>
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
                Explore the Human Atlas <span aria-hidden="true">↘</span>
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

      <section className="atlas" id="atlas" aria-labelledby="atlas-title">
        <div className="atlas-heading shell">
          <p className="section-kicker">Human Optimization System</p>
          <h2 id="atlas-title">Optimize the whole human.</h2>
          <p>
            Explore the four dimensions that shape human performance. Improve
            one with awareness of how it affects the whole.
          </p>
        </div>

        <div className="atlas-stage shell" ref={atlasStageRef}>
          <div
            className="optimization-worlds"
            role="tablist"
            aria-label="Four dimensions of human optimization"
            aria-orientation="horizontal"
          >
            {systems.map((system, index) => (
              <button
                key={system.name}
                type="button"
                role="tab"
                id={`atlas-tab-${index}`}
                aria-controls="atlas-panel"
                aria-selected={activeSystem === index}
                tabIndex={activeSystem === index ? 0 : -1}
                ref={(element) => {
                  atlasTabs.current[index] = element;
                }}
                onClick={() => setActiveSystem(index)}
                onKeyDown={(event) => handleAtlasKeys(event, index)}
                className={`optimization-world optimization-world-${index + 1}`}
              >
                <span
                  className={`optimization-world-art optimization-world-art-${index + 1}`}
                  aria-hidden="true"
                />
                <span className="optimization-world-shade" aria-hidden="true" />
                <span
                  className="optimization-world-motion"
                  aria-hidden="true"
                >
                  <i />
                  <i />
                  <i />
                </span>
                <span className="optimization-world-top">
                  <i>{system.number}</i>
                  <small>{system.mode}</small>
                </span>
                <span className="optimization-world-copy">
                  <strong>{system.name}</strong>
                  <small>{system.visualCue}</small>
                  <em>
                    {activeSystem === index
                      ? system.thesis
                      : "Select to explore"}
                  </em>
                </span>
              </button>
            ))}
          </div>

          <div
            className="atlas-panel optimization-brief"
            id="atlas-panel"
            role="tabpanel"
            aria-labelledby={`atlas-tab-${activeSystem}`}
          >
            <div className="optimization-brief-intro">
              <div className="atlas-panel-meta">
                <span>{currentSystem.number} / 04</span>
                <span>{currentSystem.descriptor}</span>
              </div>
              <div className="atlas-panel-copy" aria-live="polite">
                <h3>{currentSystem.thesis}</h3>
                <p>{currentSystem.copy}</p>
              </div>
            </div>
            <div className="optimization-lenses">
              <div className="optimization-lens">
                <h4>
                  <span>01</span>
                  Strengthen
                </h4>
                <p>{currentSystem.supports.join(" · ")}</p>
              </div>
              <div className="optimization-lens">
                <h4>
                  <span>02</span>
                  Protect from
                </h4>
                <p>{currentSystem.disrupts.join(" · ")}</p>
              </div>
              <div className="optimization-lens">
                <h4>
                  <span>03</span>
                  Observe
                </h4>
                <p>{currentSystem.signals.join(" · ")}</p>
              </div>
            </div>
          </div>

          <div className="optimization-loop" aria-label="The optimization loop">
            <p>The optimization loop</p>
            {["Understand", "Strengthen", "Protect", "Observe", "Adapt"].map(
              (step, index) => (
                <div key={step}>
                  <span>0{index + 1}</span>
                  <strong>{step}</strong>
                  {index < 4 && <i aria-hidden="true">→</i>}
                </div>
              ),
            )}
          </div>
        </div>
      </section>

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
                src="/branding/logo-full-light-red.png"
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
              <a href="#atlas">Human Atlas</a>
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

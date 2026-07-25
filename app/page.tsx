"use client";

import { gsap } from "gsap";
import Image from "next/image";
import {
  CSSProperties,
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
    descriptor: "Structure · Movement · Metabolism",
    thesis: "The physical structure that carries every experience.",
    copy: "Trace how tissue, movement, circulation, and energy production work together to keep you capable and adaptive.",
    fields: ["Musculoskeletal", "Cardiovascular", "Metabolic"],
    points: [
      { label: "Cardiac muscle", side: "right", x: 54.2, y: 27.4, labelY: 26 },
      { label: "Liver", side: "left", x: 43, y: 34.5, labelY: 35 },
      { label: "Quadriceps", side: "right", x: 61.2, y: 62.6, labelY: 63 },
    ],
    focus: [52, 29],
  },
  {
    number: "02",
    name: "Mind",
    descriptor: "Cognition · Sleep · Attention",
    thesis: "Attention, memory, and perception emerge from a body in context.",
    copy: "Explore the nervous and circadian systems behind focus, learning, memory, sleep, and the way reality reaches consciousness.",
    fields: ["Central nervous", "Sensory", "Circadian"],
    points: [
      { label: "Cerebral cortex", side: "right", x: 50, y: 7.8, labelY: 6.3 },
      { label: "Brainstem", side: "left", x: 50, y: 14.5, labelY: 13.2 },
      { label: "Spinal cord", side: "right", x: 50, y: 19.2, labelY: 20.4 },
    ],
    focus: [50, 10],
  },
  {
    number: "03",
    name: "Psychology",
    descriptor: "Emotion · Behavior · Identity",
    thesis: "Behavior is shaped by learned patterns, emotion, and connection.",
    copy: "See how stress, safety, relationships, and repeated experience influence what you feel, expect, and choose.",
    fields: ["Stress response", "Emotional regulation", "Social cognition"],
    points: [
      { label: "Prefrontal cortex", side: "left", x: 50, y: 6.4, labelY: 5.3 },
      { label: "Autonomic pathways", side: "right", x: 50, y: 16.4, labelY: 16.2 },
      { label: "Enteric nervous system", side: "left", x: 50, y: 41.2, labelY: 41.8 },
    ],
    focus: [50, 18],
  },
  {
    number: "04",
    name: "Health",
    descriptor: "Prevention · Recovery · Longevity",
    thesis: "Resilience depends on systems working together.",
    copy: "Build practical literacy around prevention, immune function, hormonal signaling, recovery, and health across a lifetime.",
    fields: ["Immune", "Endocrine", "Recovery"],
    points: [
      { label: "Thyroid gland", side: "left", x: 50, y: 17.2, labelY: 16.2 },
      { label: "Thymus", side: "right", x: 50, y: 22.8, labelY: 23.2 },
      { label: "Intestinal barrier", side: "left", x: 50, y: 42, labelY: 42.8 },
    ],
    focus: [50, 24],
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
      const figure = stage.querySelector(".atlas-figure img");
      const aura = stage.querySelector(".atlas-aura");
      const calloutGroups = stage.querySelectorAll(".atlas-callout-group");
      const calloutLines = stage.querySelectorAll(".atlas-callout-line");
      const panelCopy = stage.querySelectorAll(
        ".atlas-panel-meta, .atlas-panel-copy, .atlas-fields a",
      );
      if (!figure) return;

      gsap.killTweensOf([
        figure,
        aura,
        calloutGroups,
        calloutLines,
        panelCopy,
      ]);
      gsap.fromTo(
        figure,
        {
          scale: 0.992,
          y: 6,
        },
        {
          scale: 1.008,
          y: 0,
          duration: 0.64,
          ease: "power2.out",
          transformOrigin: `${currentSystem.focus[0]}% ${currentSystem.focus[1]}%`,
        },
      );
      gsap.fromTo(
        aura,
        { opacity: 0, scale: 0.68 },
        { opacity: 1, scale: 1, duration: 0.7, ease: "power2.out" },
      );
      gsap.fromTo(
        calloutLines,
        { strokeDashoffset: 1 },
        {
          strokeDashoffset: 0,
          duration: 0.56,
          stagger: 0.08,
          ease: "power2.inOut",
        },
      );
      gsap.fromTo(
        calloutGroups,
        { autoAlpha: 0 },
        {
          autoAlpha: 1,
          duration: 0.34,
          stagger: 0.08,
          ease: "power1.out",
        },
      );
      gsap.fromTo(
        panelCopy,
        { opacity: 0, y: 18 },
        {
          opacity: 1,
          y: 0,
          duration: 0.55,
          stagger: 0.045,
          ease: "power3.out",
        },
      );
    }, stage);

    return () => scope.revert();
  }, [activeSystem, currentSystem.focus]);

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
              src="/branding/logo-full-light.webp"
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
          <p className="section-kicker">Interactive Human Atlas</p>
          <h2 id="atlas-title">The systems beneath the self.</h2>
          <p>
            Select a field. See the structures, signals, and processes behind
            how you function.
          </p>
        </div>

        <div className="atlas-stage shell" ref={atlasStageRef}>
          <div
            className="atlas-tabs"
            role="tablist"
            aria-label="Human system fields"
            aria-orientation="vertical"
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
              >
                <span>{system.number}</span>
                {system.name}
              </button>
            ))}
            <div className="atlas-progress" aria-hidden="true">
              <span>{currentSystem.number}</span>
              <i />
              <span>04</span>
            </div>
          </div>

          <div
            className="atlas-figure"
            style={
              {
                "--focus-x": `${currentSystem.focus[0]}%`,
                "--focus-y": `${currentSystem.focus[1]}%`,
              } as CSSProperties
            }
          >
            <div className="atlas-aura" aria-hidden="true" />
            <Image
              src="/human-atlas.jpg"
              alt="Front-facing anatomical figure showing the interconnected systems of the human body"
              width={864}
              height={1821}
              sizes="(max-width: 760px) 78vw, 470px"
              priority={false}
            />
            <svg
              className="atlas-callouts"
              viewBox="0 0 864 1821"
              preserveAspectRatio="none"
              aria-hidden="true"
            >
              {currentSystem.points.map((point) => {
                const anchorX = point.x * 8.64;
                const anchorY = point.y * 18.21;
                const labelY = point.labelY * 18.21;
                const isLeft = point.side === "left";
                const kneeX = isLeft ? anchorX - 44 : anchorX + 44;
                const railX = isLeft ? -138 : 1002;
                const labelX = isLeft ? -165 : 974;

                return (
                  <g className="atlas-callout-group" key={point.label}>
                    <polyline
                      className="atlas-callout-line"
                      pathLength="1"
                      points={`${anchorX},${anchorY} ${kneeX},${anchorY} ${railX},${labelY}`}
                    />
                    <circle
                      className="atlas-callout-anchor"
                      cx={anchorX}
                      cy={anchorY}
                      r="6"
                    />
                    <text
                      className="atlas-callout-label"
                      x={labelX}
                      y={labelY + 6}
                      textAnchor="end"
                    >
                      {point.label}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>

          <div
            className="atlas-panel"
            id="atlas-panel"
            role="tabpanel"
            aria-labelledby={`atlas-tab-${activeSystem}`}
          >
            <div className="atlas-panel-meta">
              <span>{currentSystem.number} / 04</span>
              <span>{currentSystem.descriptor}</span>
            </div>
            <div className="atlas-panel-copy" aria-live="polite">
              <h3>{currentSystem.thesis}</h3>
              <p>{currentSystem.copy}</p>
            </div>
            <div className="atlas-fields">
              {currentSystem.fields.map((field, index) => (
                <a href="#research" key={field}>
                  <span>0{index + 1}</span>
                  {field}
                  <i aria-hidden="true">↗</i>
                </a>
              ))}
            </div>
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
                src="/branding/logo-full-light.webp"
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

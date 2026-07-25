"use client";

import Image from "next/image";
import {
  CSSProperties,
  FormEvent,
  KeyboardEvent,
  useEffect,
  useRef,
  useState,
} from "react";

const systems = [
  {
    number: "01",
    name: "Body",
    descriptor: "Structure · Movement · Metabolism",
    thesis: "The physical structure that carries every experience.",
    copy: "Trace how tissue, movement, circulation, and energy production work together to keep you capable and adaptive.",
    fields: ["Musculoskeletal", "Cardiovascular", "Metabolic"],
    points: [
      { label: "Heart & vessels", side: "right", x: 54.2, y: 27.8 },
      { label: "Liver & gut", side: "left", x: 47.1, y: 37.1 },
      { label: "Skeletal muscle", side: "left", x: 41.9, y: 63.4 },
    ],
    focus: [52, 31],
  },
  {
    number: "02",
    name: "Mind",
    descriptor: "Cognition · Sleep · Attention",
    thesis: "Attention, memory, and perception emerge from a body in context.",
    copy: "Explore the nervous and circadian systems behind focus, learning, memory, sleep, and the way reality reaches consciousness.",
    fields: ["Central nervous", "Sensory", "Circadian"],
    points: [
      { label: "Cerebral cortex", side: "left", x: 47.4, y: 7.6 },
      { label: "Brainstem & cord", side: "right", x: 51.1, y: 19.2 },
      { label: "Circadian center", side: "right", x: 52.2, y: 11 },
    ],
    focus: [49, 11],
  },
  {
    number: "03",
    name: "Psychology",
    descriptor: "Emotion · Behavior · Identity",
    thesis: "Behavior is shaped by learned patterns, emotion, and connection.",
    copy: "See how stress, safety, relationships, and repeated experience influence what you feel, expect, and choose.",
    fields: ["Stress response", "Emotional regulation", "Social cognition"],
    points: [
      { label: "Prefrontal networks", side: "left", x: 46.7, y: 8.3 },
      { label: "Autonomic pathways", side: "right", x: 52.2, y: 27.1 },
      { label: "Gut–brain signaling", side: "left", x: 48.5, y: 39 },
    ],
    focus: [51, 26],
  },
  {
    number: "04",
    name: "Health",
    descriptor: "Prevention · Recovery · Longevity",
    thesis: "Resilience depends on systems working together.",
    copy: "Build practical literacy around prevention, immune function, hormonal signaling, recovery, and health across a lifetime.",
    fields: ["Immune", "Endocrine", "Recovery"],
    points: [
      { label: "Immune organs", side: "left", x: 50.2, y: 24.4 },
      { label: "Endocrine organs", side: "right", x: 50.6, y: 17 },
      { label: "Recovery tissue", side: "right", x: 58.9, y: 62 },
    ],
    focus: [51, 25],
  },
];

const articles = [
  {
    className: "story story-lead",
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
  const [subscribed, setSubscribed] = useState(false);
  const heroRef = useRef<HTMLElement>(null);
  const atlasTabs = useRef<Array<HTMLButtonElement | null>>([]);
  const currentSystem = systems[activeSystem];

  useEffect(() => {
    const hero = heroRef.current;
    if (!hero) return;

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (reduceMotion) {
      hero.classList.add("is-active");
      return;
    }

    let animationFrame = 0;

    const moveImage = (event: PointerEvent) => {
      if (event.pointerType !== "mouse") return;
      cancelAnimationFrame(animationFrame);
      animationFrame = requestAnimationFrame(() => {
        const bounds = hero.getBoundingClientRect();
        const x = (event.clientX - bounds.left) / bounds.width - 0.5;
        const y = (event.clientY - bounds.top) / bounds.height - 0.5;
        hero.style.setProperty("--hero-x", `${x * 9}px`);
        hero.style.setProperty("--hero-y", `${y * 6}px`);
      });
    };

    const resetImage = () => {
      hero.style.setProperty("--hero-x", "0px");
      hero.style.setProperty("--hero-y", "0px");
    };

    const observer = new IntersectionObserver(
      ([entry]) => hero.classList.toggle("is-active", entry.isIntersecting),
      { threshold: 0.15 },
    );

    observer.observe(hero);
    hero.addEventListener("pointermove", moveImage);
    hero.addEventListener("pointerleave", resetImage);

    return () => {
      cancelAnimationFrame(animationFrame);
      observer.disconnect();
      hero.removeEventListener("pointermove", moveImage);
      hero.removeEventListener("pointerleave", resetImage);
    };
  }, []);

  function handleSubscribe(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubscribed(true);
  }

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
        className="hero is-active"
        id="top"
        aria-labelledby="hero-title"
        ref={heroRef}
      >
        <header className="site-header">
          <a className="wordmark" href="#top" aria-label="Exalt Human home">
            <span>EXALT</span>
            <i aria-hidden="true" />
            <span>HUMAN</span>
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
          <div className="hero-image-motion">
            <Image
              src="/human-system-hero.png"
              alt=""
              fill
              priority
              sizes="100vw"
            />
          </div>
          <div className="hero-organ-glow hero-brain-glow" />
          <div className="hero-neural-path">
            <i />
          </div>
          <div className="hero-organ-glow hero-heart-glow" />
          <div className="hero-scan" />
          <div className="hero-vignette" />
        </div>

        <div className="hero-content shell">
          <p className="signal-label">
            <span aria-hidden="true" />
            Independent human science
          </p>
          <h1 id="hero-title">
            The most important system you&apos;ll ever understand is your own.
          </h1>
          <div className="hero-intro">
            <p>
              Exalt Human turns biology, psychology, and health research into
              clear knowledge for living better.
            </p>
            <a href="#atlas">
              Enter the Human Atlas <span aria-hidden="true">↓</span>
            </a>
          </div>
        </div>

        <div className="hero-figure-label" aria-hidden="true">
          <span>FIG. 001</span>
          <span>HUMAN SYSTEM</span>
        </div>
      </section>

      <section className="thesis" aria-labelledby="thesis-title">
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

        <div className="atlas-stage shell">
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
            <div className="atlas-callouts" aria-hidden="true">
              {currentSystem.points.map((point) => (
                <span
                  className={`atlas-callout atlas-callout-${point.side}`}
                  style={
                    {
                      "--callout-x": `${point.x}%`,
                      "--callout-y": `${point.y}%`,
                    } as CSSProperties
                  }
                  key={point.label}
                >
                  <b>{point.label}</b>
                  <i />
                </span>
              ))}
            </div>
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
            <a className={article.className} href="#newsletter" key={article.title}>
              <div className="story-number" aria-hidden="true">
                0{index + 1}
              </div>
              <div className="story-image">
                <Image
                  src={article.image}
                  alt={article.alt}
                  width={article.width}
                  height={article.height}
                  sizes={
                    index === 0
                      ? "(max-width: 760px) calc(100vw - 32px), 58vw"
                      : "(max-width: 760px) calc(100vw - 32px), 38vw"
                  }
                />
              </div>
              <div className="story-meta">
                <span>{article.category}</span>
                <span>{article.time}</span>
                <span>{article.updated}</span>
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

      <section
        className="newsletter"
        id="newsletter"
        aria-labelledby="newsletter-title"
      >
        <div className="newsletter-signal" aria-hidden="true">
          <span />
        </div>
        <div className="shell newsletter-grid">
          <p className="section-kicker">The Exalt Human Dispatch</p>
          <div>
            <h2 id="newsletter-title">
              One clear idea about being human, every week.
            </h2>
            <p>
              Body, mind, psychology, and health—well sourced and free from
              miracle claims.
            </p>
            {subscribed ? (
              <p className="success-message" role="status">
                You&apos;re on the list. Your first dispatch is next.
              </p>
            ) : (
              <form onSubmit={handleSubscribe}>
                <label className="sr-only" htmlFor="email">
                  Email address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="Email address"
                  autoComplete="email"
                  required
                />
                <button type="submit">
                  Join the dispatch <span aria-hidden="true">↗</span>
                </button>
              </form>
            )}
            <small>
              Educational content only. Unsubscribe whenever you like.
            </small>
          </div>
        </div>
      </section>

      <footer className="site-footer">
        <div className="shell">
          <div className="footer-top">
            <a className="wordmark" href="#top" aria-label="Exalt Human home">
              <span>EXALT</span>
              <i aria-hidden="true" />
              <span>HUMAN</span>
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

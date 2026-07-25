"use client";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";
import {
  CSSProperties,
  KeyboardEvent,
  useEffect,
  useRef,
  useState,
} from "react";
import OptimizationDispatch from "./components/OptimizationDispatch";

const heroFrames = Array.from(
  { length: 17 },
  (_, index) => `/hero-sequence/frame-${String(index).padStart(2, "0")}.webp`,
);

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
  const heroRef = useRef<HTMLElement>(null);
  const heroStickyRef = useRef<HTMLDivElement>(null);
  const heroFrameRef = useRef<HTMLImageElement>(null);
  const atlasStageRef = useRef<HTMLDivElement>(null);
  const atlasTabs = useRef<Array<HTMLButtonElement | null>>([]);
  const currentSystem = systems[activeSystem];

  useEffect(() => {
    const hero = heroRef.current;
    const frame = heroFrameRef.current;
    if (!hero || !frame) return;

    const imageMotion = hero.querySelector<HTMLElement>(".hero-image-motion");
    const messageOne = hero.querySelector<HTMLElement>(".hero-message-one");
    const messageTwo = hero.querySelector<HTMLElement>(".hero-message-two");
    const messageThree = hero.querySelector<HTMLElement>(".hero-message-three");
    const scrollProgress = hero.querySelector<HTMLElement>(
      ".hero-scroll-progress i",
    );

    if (
      !imageMotion ||
      !messageOne ||
      !messageTwo ||
      !messageThree ||
      !scrollProgress
    ) {
      return;
    }

    gsap.registerPlugin(ScrollTrigger);
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const preload = heroFrames.map(
      (source) =>
        new Promise<void>((resolve) => {
          const image = new window.Image();
          image.onload = () => resolve();
          image.onerror = () => resolve();
          image.src = source;
        }),
    );

    const scope = gsap.context(() => {
      const setMessage = (element: HTMLElement, opacity: number) => {
        gsap.set(element, {
          opacity,
          visibility: opacity > 0.015 ? "visible" : "hidden",
        });
      };
      const fadeIn = (progress: number, start: number, end: number) =>
        gsap.utils.clamp(0, 1, (progress - start) / (end - start));
      const fadeOut = (progress: number, start: number, end: number) =>
        1 - fadeIn(progress, start, end);

      gsap.set(scrollProgress, {
        scaleX: 0,
        transformOrigin: "left center",
      });

      if (reduceMotion) {
        frame.src = heroFrames.at(-1) ?? heroFrames[0];
        setMessage(messageOne, 0);
        setMessage(messageTwo, 0);
        setMessage(messageThree, 1);
        gsap.set(scrollProgress, { scaleX: 1 });
        return;
      }

      let currentFrame = -1;
      const render = (progress: number) => {
        const nextFrame = Math.round(progress * (heroFrames.length - 1));
        if (nextFrame !== currentFrame) {
          frame.src = heroFrames[nextFrame];
          currentFrame = nextFrame;
        }

        gsap.set(imageMotion, {
          scale: 1 + progress * 0.085,
          xPercent: progress * -1.7,
          yPercent: progress * -0.8,
        });
        gsap.set(scrollProgress, { scaleX: progress });

        setMessage(messageOne, fadeOut(progress, 0.24, 0.33));
        setMessage(
          messageTwo,
          Math.min(
            fadeIn(progress, 0.28, 0.36),
            fadeOut(progress, 0.58, 0.67),
          ),
        );
        setMessage(messageThree, fadeIn(progress, 0.63, 0.72));
      };

      render(0);
      ScrollTrigger.create({
        trigger: hero,
        start: "top top",
        end: "bottom bottom",
        invalidateOnRefresh: true,
        onUpdate: (self) => render(self.progress),
      });
    }, hero);

    Promise.all(preload).then(() => ScrollTrigger.refresh());

    return () => scope.revert();
  }, []);

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
      const callouts = stage.querySelectorAll(".atlas-callout");
      const panelCopy = stage.querySelectorAll(
        ".atlas-panel-meta, .atlas-panel-copy, .atlas-fields a",
      );
      if (!figure) return;

      gsap.killTweensOf([figure, aura, callouts, panelCopy]);
      gsap.fromTo(
        figure,
        {
          scale: 0.975,
          rotationY: activeSystem % 2 === 0 ? -3.5 : 3.5,
          y: 10,
        },
        {
          scale: 1.025,
          rotationY: 0,
          y: 0,
          duration: 0.72,
          ease: "power3.out",
          transformOrigin: "50% 34%",
        },
      );
      gsap.fromTo(
        aura,
        { opacity: 0, scale: 0.68 },
        { opacity: 1, scale: 1, duration: 0.7, ease: "power2.out" },
      );
      gsap.fromTo(
        callouts,
        { opacity: 0, x: activeSystem % 2 === 0 ? 14 : -14 },
        {
          opacity: 1,
          x: 0,
          duration: 0.48,
          stagger: 0.07,
          ease: "power2.out",
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
        className="hero is-active"
        id="top"
        aria-labelledby="hero-title"
        ref={heroRef}
      >
        <div className="hero-sticky" ref={heroStickyRef}>
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
            <div className="hero-image-motion">
              <Image
                ref={heroFrameRef}
                className="hero-sequence-frame"
                src={heroFrames[0]}
                alt=""
                fill
                priority
                sizes="100vw"
              />
            </div>
            <div className="hero-vignette" />
          </div>

          <h1 className="sr-only" id="hero-title">
            Understand the one adaptive human system that carries every thought,
            behavior, and experience.
          </h1>

          <div className="hero-content shell">
            <div className="hero-message hero-message-one" aria-hidden="true">
              <p className="signal-label">
                <span />
                01 · Independent human science
              </p>
              <p className="hero-display">
                The most important system you&apos;ll ever understand is your own.
              </p>
              <div className="hero-intro">
                <p>
                  Exalt Human turns biology, psychology, and health research into
                  clear knowledge for living better.
                </p>
                <span>
                  Scroll to examine <i>↓</i>
                </span>
              </div>
            </div>

            <div className="hero-message hero-message-two" aria-hidden="true">
              <p className="signal-label">02 · Integration</p>
              <p className="hero-display">
                The body is not a collection of parts.
              </p>
              <p className="hero-message-copy">
                Every organ, signal, and behavior belongs to one adaptive
                system.
              </p>
            </div>

            <div className="hero-message hero-message-three" aria-hidden="true">
              <p className="signal-label">03 · Elevation</p>
              <p className="hero-display">
                Understand the system. Elevate the whole.
              </p>
              <p className="hero-message-copy">
                Optimization begins by seeing how body, mind, psychology, and
                health move together.
              </p>
            </div>
          </div>

          <a className="hero-skip" href="#thesis">
            Skip interactive introduction <span aria-hidden="true">↓</span>
          </a>

          <div className="hero-scroll-progress" aria-hidden="true">
            <span>01</span>
            <i />
            <span>03</span>
          </div>

          <div className="hero-figure-label" aria-hidden="true">
            <span>FIG. 001</span>
            <span>HUMAN SYSTEM</span>
          </div>
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

"use client";

import {
  type CSSProperties,
  type KeyboardEvent,
  useEffect,
  useRef,
  useState,
} from "react";

import styles from "./WholeHumanSystem.module.css";

const inputs = [
  {
    number: "01",
    name: "Sleep",
    type: "Recovery signal",
    prompt: "Change sleep, and no layer stays untouched.",
    thesis: "Sleep is not downtime. It is coordinated maintenance.",
    explanation:
      "The same night of sleep reaches tissue recovery, attention, emotional regulation, and long-term resilience. The useful signal is the combined response, not one isolated metric.",
    responses: [
      {
        number: "01",
        name: "Body",
        effect: "Repair capacity",
        copy: "Supports tissue repair, energy restoration, and readiness for the next demand.",
      },
      {
        number: "02",
        name: "Mind",
        effect: "Memory + attention",
        copy: "Creates the conditions for learning, recall, and steadier cognitive control.",
      },
      {
        number: "03",
        name: "Psychology",
        effect: "Emotional range",
        copy: "Supports regulation and creates more distance between a feeling and a reaction.",
      },
      {
        number: "04",
        name: "Health",
        effect: "System resilience",
        copy: "Helps immune, metabolic, and cardiovascular processes keep a stable rhythm.",
      },
    ],
  },
  {
    number: "02",
    name: "Movement",
    type: "Adaptive stimulus",
    prompt: "Movement is information, not just output.",
    thesis: "A moving body teaches every layer how to adapt.",
    explanation:
      "A useful movement practice is more than exercise volume. It changes physical capacity, cognitive state, self-perception, and the reserve the whole system can draw on over time.",
    responses: [
      {
        number: "01",
        name: "Body",
        effect: "Strength + mobility",
        copy: "Builds force, range, coordination, and confidence under physical demand.",
      },
      {
        number: "02",
        name: "Mind",
        effect: "Cognitive energy",
        copy: "Changes arousal and supports the conditions for learning and clear thought.",
      },
      {
        number: "03",
        name: "Psychology",
        effect: "Agency + mood",
        copy: "Turns effort into evidence that adaptation is possible and repeatable.",
      },
      {
        number: "04",
        name: "Health",
        effect: "Metabolic reserve",
        copy: "Supports circulation, glucose regulation, and long-term functional capacity.",
      },
    ],
  },
  {
    number: "03",
    name: "Stress",
    type: "Demand signal",
    prompt: "Stress can sharpen the system or consume it.",
    thesis: "Demand becomes damaging when recovery never closes the loop.",
    explanation:
      "Stress is not only a mental event. It changes muscle tone, attention, behavior, sleep, and physiology. Optimization means reading dose, context, and recovery together.",
    responses: [
      {
        number: "01",
        name: "Body",
        effect: "Readiness + tension",
        copy: "Mobilizes energy and muscle tone for action, then needs a route back to baseline.",
      },
      {
        number: "02",
        name: "Mind",
        effect: "Attention narrows",
        copy: "Prioritizes immediate signals while reducing flexible, long-range thinking.",
      },
      {
        number: "03",
        name: "Psychology",
        effect: "Threat patterns",
        copy: "Reinforces the interpretations and behaviors used to find safety.",
      },
      {
        number: "04",
        name: "Health",
        effect: "Cumulative load",
        copy: "Repeated activation without recovery can erode resilience across systems.",
      },
    ],
  },
  {
    number: "04",
    name: "Connection",
    type: "Safety signal",
    prompt: "Safety is biological as well as social.",
    thesis: "Human connection changes the state from which you operate.",
    explanation:
      "Belonging is not separate from performance. A credible sense of safety changes autonomic state, cognitive bandwidth, adaptive behavior, and the habits that protect long-term health.",
    responses: [
      {
        number: "01",
        name: "Body",
        effect: "Autonomic settling",
        copy: "Supports the shift from constant readiness toward restoration and repair.",
      },
      {
        number: "02",
        name: "Mind",
        effect: "Cognitive bandwidth",
        copy: "Frees attention for exploration, perspective, and more flexible decisions.",
      },
      {
        number: "03",
        name: "Psychology",
        effect: "Belonging + trust",
        copy: "Creates a safer context for identity, emotion, and relational learning.",
      },
      {
        number: "04",
        name: "Health",
        effect: "Protective behavior",
        copy: "Makes support, recovery, and consistent health behavior easier to sustain.",
      },
    ],
  },
] as const;

export default function WholeHumanSystem() {
  const [activeInput, setActiveInput] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const tabsRef = useRef<Array<HTMLButtonElement | null>>([]);
  const input = inputs[activeInput];

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.16 },
    );

    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  function handleTabKeys(
    event: KeyboardEvent<HTMLButtonElement>,
    index: number,
  ) {
    const last = inputs.length - 1;
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
    setActiveInput(next);
    tabsRef.current[next]?.focus();
  }

  return (
    <section
      className={`${styles.section} ${isVisible ? styles.isVisible : ""}`}
      id="atlas"
      ref={sectionRef}
      aria-labelledby="whole-human-title"
    >
      <div className={`shell ${styles.intro}`}>
        <div className={styles.kicker}>
          <span>02</span>
          <p>The whole-human model</p>
        </div>
        <h2 id="whole-human-title">
          One signal enters.
          <span>The whole human responds.</span>
        </h2>
        <p className={styles.lede}>
          Body, mind, psychology, and health are not four separate projects.
          They are four readings of one living system.
        </p>
      </div>

      <div className={`shell ${styles.instrument}`}>
        <header className={styles.instrumentHeader}>
          <div>
            <i aria-hidden="true" />
            Exalt system map
          </div>
          <span>Input → response → adaptation</span>
          <span>Model 001 / Interactive</span>
        </header>

        <div
          className={styles.inputTabs}
          role="tablist"
          aria-label="Signals that affect the whole human"
        >
          {inputs.map((item, index) => (
            <button
              key={item.name}
              type="button"
              role="tab"
              id={`whole-human-tab-${index}`}
              aria-controls="whole-human-panel"
              aria-selected={activeInput === index}
              tabIndex={activeInput === index ? 0 : -1}
              ref={(element) => {
                tabsRef.current[index] = element;
              }}
              onClick={() => setActiveInput(index)}
              onKeyDown={(event) => handleTabKeys(event, index)}
            >
              <span>{item.number}</span>
              <strong>{item.name}</strong>
              <small>{item.type}</small>
            </button>
          ))}
        </div>

        <div
          className={styles.field}
          id="whole-human-panel"
          role="tabpanel"
          aria-labelledby={`whole-human-tab-${activeInput}`}
        >
          <div className={styles.inputReadout} key={`input-${input.name}`}>
            <span className={styles.readoutLabel}>Active input</span>
            <p className={styles.readoutNumber}>{input.number} / 04</p>
            <h3>{input.name}</h3>
            <p className={styles.prompt}>{input.prompt}</p>
            <div className={styles.liveSignal}>
              <i aria-hidden="true" />
              Signal propagating
            </div>
          </div>

          <div className={styles.cascade}>
            <svg
              className={styles.paths}
              viewBox="0 0 760 600"
              preserveAspectRatio="none"
              aria-hidden="true"
            >
              <path className={styles.pathBase} d="M0 300 H185" />
              <path
                className={styles.pathBase}
                d="M185 300 C300 300 300 75 420 75 H760"
              />
              <path
                className={styles.pathBase}
                d="M185 300 C300 300 300 225 420 225 H760"
              />
              <path
                className={styles.pathBase}
                d="M185 300 C300 300 300 375 420 375 H760"
              />
              <path
                className={styles.pathBase}
                d="M185 300 C300 300 300 525 420 525 H760"
              />
              <g key={`flow-${input.name}`} className={styles.pathFlow}>
                <path pathLength={1} d="M0 300 H185" />
                <path
                  pathLength={1}
                  d="M185 300 C300 300 300 75 420 75 H760"
                />
                <path
                  pathLength={1}
                  d="M185 300 C300 300 300 225 420 225 H760"
                />
                <path
                  pathLength={1}
                  d="M185 300 C300 300 300 375 420 375 H760"
                />
                <path
                  pathLength={1}
                  d="M185 300 C300 300 300 525 420 525 H760"
                />
              </g>
            </svg>

            <span className={styles.splitter} aria-hidden="true">
              <i />
            </span>

            <ol
              className={styles.responses}
              key={`responses-${input.name}`}
              aria-label={`${input.name} across the whole human`}
            >
              {input.responses.map((response, index) => (
                <li
                  key={response.name}
                  style={
                    {
                      "--response-delay": `${160 + index * 90}ms`,
                    } as CSSProperties
                  }
                >
                  <span className={styles.responseNumber}>{response.number}</span>
                  <div>
                    <p className={styles.responseName}>{response.name}</p>
                    <strong>{response.effect}</strong>
                  </div>
                  <p className={styles.responseCopy}>{response.copy}</p>
                  <i className={styles.responseNode} aria-hidden="true" />
                </li>
              ))}
            </ol>
          </div>
        </div>

        <div className={styles.synthesis} key={`synthesis-${input.name}`}>
          <p>
            <span>Whole-human reading</span>
            {input.type}
          </p>
          <h3>{input.thesis}</h3>
          <p>{input.explanation}</p>
        </div>

        <footer className={styles.instrumentFooter}>
          <span>Do not optimize the category.</span>
          <strong>Understand the chain.</strong>
          <span>Education, not diagnosis.</span>
        </footer>
      </div>
    </section>
  );
}

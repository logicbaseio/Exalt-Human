"use client";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { FormEvent, useEffect, useRef, useState } from "react";

import styles from "./OptimizationDispatch.module.css";

const dimensions = [
  {
    number: "01",
    name: "Physical",
    scope: "Capacity",
    description:
      "Strength, energy, recovery, and the systems that turn daily inputs into performance.",
  },
  {
    number: "02",
    name: "Mental",
    scope: "Regulation",
    description:
      "Attention, emotional balance, sleep, and a nervous system that can return to baseline.",
  },
  {
    number: "03",
    name: "Intellectual",
    scope: "Expansion",
    description:
      "Learning, memory, reasoning, and the practices that keep the mind adaptive.",
  },
  {
    number: "04",
    name: "Spiritual",
    scope: "Alignment",
    description:
      "Meaning, values, presence, and the inner coherence that guides how you live.",
  },
  {
    number: "05",
    name: "Medical",
    scope: "Literacy",
    description:
      "Evidence-led understanding of risk, biomarkers, prevention, and when expert care matters.",
  },
] as const;

const weeklyLoop = [
  {
    number: "01",
    name: "Observe",
    description: "Notice the signals your body and mind are already sending.",
  },
  {
    number: "02",
    name: "Understand",
    description: "Learn the mechanism behind the signal, not just the symptom.",
  },
  {
    number: "03",
    name: "Apply",
    description: "Turn evidence into one deliberate, practical intervention.",
  },
  {
    number: "04",
    name: "Reassess",
    description: "Review the response, refine the input, and continue the loop.",
  },
] as const;

export default function OptimizationDispatch() {
  const sectionRef = useRef<HTMLElement>(null);
  const [subscribed, setSubscribed] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState("");

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    gsap.registerPlugin(ScrollTrigger);

    const media = gsap.matchMedia();
    const context = gsap.context(() => {
      media.add(
        {
          reduceMotion: "(prefers-reduced-motion: reduce)",
          motionSafe: "(prefers-reduced-motion: no-preference)",
        },
        (mediaContext) => {
          const conditions = mediaContext.conditions as {
            reduceMotion?: boolean;
            motionSafe?: boolean;
          };
          const rows = gsap.utils.toArray<HTMLElement>(
            "[data-dispatch-row]",
            section,
          );
          const loopSteps = gsap.utils.toArray<HTMLElement>(
            "[data-loop-step]",
            section,
          );
          const loopLine = section.querySelector<HTMLElement>(
            "[data-loop-line]",
          );

          if (conditions.reduceMotion) {
            gsap.set(
              loopLine
                ? [...rows, ...loopSteps, loopLine]
                : [...rows, ...loopSteps],
              {
                clearProps: "all",
              },
            );
            return;
          }

          if (!conditions.motionSafe) return;

          gsap.fromTo(
            rows,
            { autoAlpha: 0, y: 28 },
            {
              autoAlpha: 1,
              y: 0,
              duration: 0.78,
              ease: "power3.out",
              stagger: 0.09,
              clearProps: "transform,opacity,visibility",
              scrollTrigger: {
                trigger: rows[0],
                start: "top 80%",
                toggleActions: "play none none none",
                once: true,
              },
            },
          );

          const loopTimeline = gsap.timeline({
            defaults: { ease: "power3.out" },
            scrollTrigger: {
              trigger: loopLine ?? loopSteps[0],
              start: "top 78%",
              toggleActions: "play none none none",
              once: true,
            },
          });

          if (loopLine) {
            loopTimeline.fromTo(
              loopLine,
              { scaleX: 0 },
              {
                scaleX: 1,
                duration: 0.9,
                transformOrigin: "left center",
              },
            );
          }

          loopTimeline.fromTo(
            loopSteps,
            { autoAlpha: 0, y: 20 },
            {
              autoAlpha: 1,
              y: 0,
              duration: 0.65,
              stagger: 0.11,
              clearProps: "transform,opacity,visibility",
            },
            loopLine ? "-=0.58" : 0,
          );
        },
      );
    }, section);

    return () => {
      media.revert();
      context.revert();
    };
  }, []);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    const email = String(formData.get("email") ?? "").trim();
    const website = String(formData.get("website") ?? "");

    setSubmitting(true);
    setFormError("");

    try {
      const response = await fetch("/api/newsletter", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, website }),
      });
      const result = (await response.json()) as {
        error?: string;
      };

      if (!response.ok) {
        throw new Error(result.error ?? "Unable to join the Dispatch.");
      }

      setSubscribed(true);
      form.reset();
    } catch (error) {
      setFormError(
        error instanceof Error
          ? error.message
          : "Unable to join right now. Please try again.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section
      className={styles.section}
      id="newsletter"
      ref={sectionRef}
      aria-labelledby="dispatch-title"
    >
      <div className={styles.foundation}>
        <header className={styles.intro}>
          <p className={styles.eyebrow}>
            <span aria-hidden="true" />
            The Exalt Human Dispatch
          </p>
          <h2 id="dispatch-title">
            Five dimensions.
            <br />
            One human system.
          </h2>
          <div className={styles.introCopy}>
            <p>
              Human optimization is not a collection of isolated habits. It is
              the practice of understanding how every part of you informs the
              whole.
            </p>
            <p className={styles.cadence}>One evidence-led briefing each week.</p>
          </div>
        </header>

        <ol
          className={styles.spectrum}
          aria-label="Five dimensions of human optimization"
        >
          {dimensions.map((dimension) => (
            <li
              className={styles.dimension}
              data-dispatch-row
              key={dimension.name}
            >
              <span className={styles.dimensionNumber} aria-hidden="true">
                {dimension.number}
              </span>
              <h3>{dimension.name}</h3>
              <p className={styles.scope}>{dimension.scope}</p>
              <p className={styles.description}>{dimension.description}</p>
            </li>
          ))}
        </ol>
      </div>

      <div className={styles.loop}>
        <div className={styles.loopInner}>
          <header className={styles.loopHeader}>
            <p className={styles.eyebrowLight}>The weekly optimization loop</p>
            <h2>Awareness becomes practice.</h2>
            <p>
              The Dispatch gives you a repeatable way to read your system,
              choose an informed action, and learn from the result.
            </p>
          </header>

          <div className={styles.loopTrack}>
            <span
              className={styles.loopLine}
              data-loop-line
              aria-hidden="true"
            />
            <ol className={styles.loopSteps}>
              {weeklyLoop.map((step) => (
                <li data-loop-step key={step.name}>
                  <span className={styles.loopNumber} aria-hidden="true">
                    {step.number}
                  </span>
                  <h3>{step.name}</h3>
                  <p>{step.description}</p>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>

      <div className={styles.subscribe}>
        <div className={styles.subscribeInner}>
          <div>
            <p className={styles.subscribeEyebrow}>Begin with awareness</p>
            <h2>Know the system you live in.</h2>
          </div>

          {subscribed ? (
            <p className={styles.confirmation} role="status">
              You’re on the list. Your first Dispatch is on its way.
            </p>
          ) : (
            <form
              className={styles.form}
              onSubmit={handleSubmit}
              aria-label="Join the Exalt Human Dispatch"
            >
              <label className={styles.srOnly} htmlFor="dispatch-email">
                Email address
              </label>
              <input
                id="dispatch-email"
                name="email"
                type="email"
                inputMode="email"
                autoComplete="email"
                placeholder="Your email address"
                required
              />
              <input
                className={styles.honeypot}
                name="website"
                type="text"
                tabIndex={-1}
                autoComplete="off"
                aria-hidden="true"
              />
              <button type="submit" disabled={submitting}>
                {submitting ? "Joining…" : "Join the Dispatch"}
                <span aria-hidden="true">↗</span>
              </button>
              <p
                className={formError ? styles.formError : undefined}
                role={formError ? "alert" : undefined}
                aria-live="polite"
              >
                {formError ||
                  "Independent human science. One useful briefing a week. No noise."}
              </p>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}

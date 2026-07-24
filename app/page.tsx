"use client";

import Image from "next/image";
import { FormEvent, useState } from "react";

const systems = [
  {
    number: "01",
    name: "Body",
    descriptor: "Structure · Movement · Metabolism",
    copy: "Understand the physical systems that carry, fuel, repair, and adapt you.",
  },
  {
    number: "02",
    name: "Mind",
    descriptor: "Cognition · Sleep · Attention",
    copy: "Explore how the brain learns, focuses, remembers, and restores itself.",
  },
  {
    number: "03",
    name: "Psychology",
    descriptor: "Emotion · Behavior · Identity",
    copy: "See how perception and environment shape what you feel and what you do.",
  },
  {
    number: "04",
    name: "Health",
    descriptor: "Prevention · Recovery · Longevity",
    copy: "Build the literacy to protect your health across a lifetime.",
  },
];

const articles = [
  {
    category: "Nervous system",
    title: "Your nervous system is always listening.",
    summary:
      "A clear guide to stress, safety, regulation, and the signals your body processes before conscious thought.",
    time: "10 min",
    evidence: "Evidence guide",
  },
  {
    category: "Metabolism",
    title: "Metabolism is more than calories.",
    summary:
      "How energy production, hormones, movement, sleep, and nutrition interact across the human system.",
    time: "9 min",
    evidence: "Research explainer",
  },
  {
    category: "Psychology",
    title: "Change begins before motivation.",
    summary:
      "The mechanics of behavior, environment, friction, and why durable habits rarely begin with willpower.",
    time: "8 min",
    evidence: "Field guide",
  },
];

export default function Home() {
  const [subscribed, setSubscribed] = useState(false);

  function handleSubscribe(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubscribed(true);
  }

  return (
    <main>
      <section className="hero" id="top" aria-labelledby="hero-title">
        <header className="site-header">
          <a className="wordmark" href="#top" aria-label="Exalt Human home">
            <span>EXALT</span>
            <i aria-hidden="true" />
            <span>HUMAN</span>
          </a>

          <nav className="desktop-nav" aria-label="Primary navigation">
            <a href="#systems">Body</a>
            <a href="#systems">Mind</a>
            <a href="#systems">Psychology</a>
            <a href="#systems">Health</a>
            <a href="#research">Research</a>
          </nav>

          <a className="header-link" href="#journal">
            Explore <span aria-hidden="true">↗</span>
          </a>

          <details className="mobile-nav">
            <summary aria-label="Open navigation">
              <span />
              <span />
            </summary>
            <nav aria-label="Mobile navigation">
              <a href="#systems">Human systems</a>
              <a href="#research">Featured research</a>
              <a href="#journal">Journal</a>
              <a href="#standard">Research standard</a>
            </nav>
          </details>
        </header>

        <div className="hero-media" aria-hidden="true">
          <Image
            src="/human-system-hero.png"
            alt=""
            fill
            priority
            sizes="100vw"
          />
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
            <a href="#systems">
              Explore the human system <span aria-hidden="true">↓</span>
            </a>
          </div>
        </div>

        <div className="hero-figure-label" aria-hidden="true">
          <span>FIG. 001</span>
          <span>HUMAN SYSTEM</span>
        </div>
      </section>

      <section className="manifesto" aria-labelledby="manifesto-title">
        <div className="shell">
          <p className="section-kicker">Why Exalt Human</p>
          <h2 id="manifesto-title">
            Your body is not a trend. It is a living system—adaptable,
            connected, and worth understanding.
          </h2>
          <div className="manifesto-foot">
            <p>
              We make complex human science legible without flattening the
              nuance.
            </p>
            <p>
              No miracle claims.<br />
              No manufactured urgency.
            </p>
          </div>
        </div>
      </section>

      <section className="systems" id="systems" aria-labelledby="systems-title">
        <div className="shell">
          <div className="section-heading">
            <p className="section-kicker">The human index</p>
            <h2 id="systems-title">Learn the whole system.</h2>
            <p>
              Health is never one variable. Trace the connections between the
              body, mind, behavior, and environment.
            </p>
          </div>

          <div className="system-list">
            {systems.map((system) => (
              <a className="system-row" href="#journal" key={system.name}>
                <span className="system-number">{system.number}</span>
                <span className="system-name">{system.name}</span>
                <span className="system-details">
                  <small>{system.descriptor}</small>
                  <span>{system.copy}</span>
                </span>
                <span className="system-arrow" aria-hidden="true">
                  ↗
                </span>
              </a>
            ))}
          </div>
        </div>
      </section>

      <section
        className="featured-research"
        id="research"
        aria-labelledby="feature-title"
      >
        <div className="research-signal" aria-hidden="true">
          <span />
        </div>
        <div className="shell research-layout">
          <div className="research-main">
            <div className="research-meta">
              <span>Featured research</span>
              <span>Sleep / Circadian biology</span>
              <span>12 min read</span>
            </div>
            <h2 id="feature-title">
              Sleep is the foundation.
              <br />
              Everything else is downstream.
            </h2>
            <p className="research-deck">
              Sleep touches cognition, metabolism, immunity, emotional
              regulation, and adaptation. Here is what the evidence actually
              says—and where it is still evolving.
            </p>
            <a className="light-link" href="#journal">
              Read the research <span aria-hidden="true">↗</span>
            </a>
          </div>

          <aside className="evidence-note" aria-label="Article evidence note">
            <p>Evidence lens</p>
            <strong>Established + evolving</strong>
            <span>
              This guide separates high-confidence findings from practical
              interpretation and open questions.
            </span>
            <dl>
              <div>
                <dt>Last reviewed</dt>
                <dd>July 2026</dd>
              </div>
              <div>
                <dt>Format</dt>
                <dd>Research synthesis</dd>
              </div>
            </dl>
          </aside>
        </div>
      </section>

      <section className="journal" id="journal" aria-labelledby="journal-title">
        <div className="shell">
          <div className="journal-heading">
            <p className="section-kicker">Latest intelligence</p>
            <h2 id="journal-title">Read what changes how you see yourself.</h2>
          </div>

          <div className="article-list">
            {articles.map((article, index) => (
              <article className="article-row" key={article.title}>
                <div className="article-index">
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  <span>{article.category}</span>
                </div>
                <div className="article-copy">
                  <h3>{article.title}</h3>
                  <p>{article.summary}</p>
                </div>
                <div className="article-meta">
                  <span>{article.evidence}</span>
                  <span>{article.time}</span>
                  <a href="#newsletter" aria-label={`Read ${article.title}`}>
                    Read <span aria-hidden="true">↗</span>
                  </a>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="standard" id="standard" aria-labelledby="standard-title">
        <div className="shell standard-grid">
          <div className="standard-title">
            <p className="section-kicker">The research standard</p>
            <h2 id="standard-title">
              Clarity without false certainty.
            </h2>
          </div>
          <div className="standard-copy">
            <p className="standard-lead">
              Every research-led article distinguishes what is established,
              what is emerging, and what remains unknown.
            </p>
            <ol>
              <li>
                <span>01</span>
                <div>
                  <strong>Start with evidence</strong>
                  <p>
                    We interpret peer-reviewed research and link readers to the
                    source material.
                  </p>
                </div>
              </li>
              <li>
                <span>02</span>
                <div>
                  <strong>Preserve the nuance</strong>
                  <p>
                    Association is not causation. Plausible is not proven. We
                    say which is which.
                  </p>
                </div>
              </li>
              <li>
                <span>03</span>
                <div>
                  <strong>Update the record</strong>
                  <p>
                    Review dates and evidence labels show when our understanding
                    changes.
                  </p>
                </div>
              </li>
            </ol>
          </div>
        </div>
      </section>

      <section
        className="newsletter"
        id="newsletter"
        aria-labelledby="newsletter-title"
      >
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
              <a href="#systems">Body</a>
              <a href="#systems">Mind</a>
              <a href="#systems">Psychology</a>
              <a href="#systems">Health</a>
              <a href="#standard">Editorial standard</a>
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

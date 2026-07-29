import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { TOOLS, TOOL_CATEGORIES } from "@/lib/tools";
import { ToolsHeader, ToolsFooter, MedicalNotice } from "./chrome";

export const metadata: Metadata = {
  title: "Tools",
  description:
    "Evidence-based calculators for strength, fitness, body composition, nutrition, sleep, and longevity. Every formula sourced, every limitation stated.",
  openGraph: {
    title: "Tools — Exalt Human",
    description:
      "Evidence-based calculators for the human body. Every formula sourced, every limitation stated.",
    type: "website",
  },
};

export default function ToolsPage() {
  return (
    <main className="tools-page">
      <ToolsHeader />

      <section className="tools-hero shell">
        <nav className="article-breadcrumb" aria-label="Breadcrumb">
          <Link href="/">Exalt Human</Link>
          <span>/</span>
          <span>Tools</span>
        </nav>

        <div className="tools-hero-grid">
          <div>
            <p className="tools-eyebrow">Instruments</p>
            <h1>
              Measure the system you live in.
            </h1>
          </div>
          <p className="tools-hero-lede">
            Most health calculators online cannot tell you where their numbers
            came from. Every tool here uses a published formula, names its
            source, and states plainly what it cannot tell you. They run
            entirely in your browser: nothing you enter is sent anywhere or
            stored.
          </p>
        </div>
      </section>

      <section className="tools-index shell" aria-label="All tools">
        {TOOL_CATEGORIES.map((category) => {
          const group = TOOLS.filter((tool) => tool.category === category);
          if (!group.length) return null;

          return (
            <div className="tools-group" key={category}>
              <p className="tools-group-label">{category}</p>
              <ul className="tools-grid">
                {group.map((tool, index) => (
                  <li key={tool.slug}>
                    <Link className="tool-card" href={`/tools/${tool.slug}`}>
                      <span className="tool-card-thumb">
                        <Image
                          src={tool.thumb}
                          alt={tool.thumbAlt}
                          width={900}
                          height={900}
                          sizes="(max-width: 720px) 100vw, (max-width: 1100px) 50vw, 33vw"
                        />
                        <i className="tool-card-index" aria-hidden="true">
                          {String(index + 1).padStart(2, "0")}
                        </i>
                      </span>
                      <span className="tool-card-body">
                        <b>{tool.name}</b>
                        <em>{tool.deck}</em>
                      </span>
                      <span className="tool-card-foot">
                        <span>{tool.explainer.timeNeeded}</span>
                        <i aria-hidden="true">↗</i>
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </section>

      <section className="tools-standard shell">
        <div>
          <p className="tools-eyebrow">Our standard</p>
          <h2>A number is only useful if you know what it means.</h2>
        </div>
        <div className="tools-standard-points">
          <div>
            <b>Sourced formulas</b>
            <p>
              Every calculation names the study or guideline behind it. If we
              could not source it, we did not build it.
            </p>
          </div>
          <div>
            <b>Stated limits</b>
            <p>
              Each tool says what it cannot tell you, because a result you
              misread is worse than no result.
            </p>
          </div>
          <div>
            <b>Nothing collected</b>
            <p>
              Calculations run in your browser. Nothing you type is transmitted
              or stored.
            </p>
          </div>
        </div>
      </section>

      <div className="shell">
        <MedicalNotice />
      </div>

      <section className="article-dispatch">
        <div className="shell">
          <p>Continue the inquiry</p>
          <h2>Research for the system you live in.</h2>
          <Link href="/#newsletter">
            Join The Dispatch <span aria-hidden="true">↗</span>
          </Link>
        </div>
      </section>

      <ToolsFooter />
    </main>
  );
}

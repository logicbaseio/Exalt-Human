import Link from "next/link";
import {
  getFeaturedArticles,
  getPublishedArticles,
  countByTopic,
} from "@/lib/articles";
import { TOPICS } from "@/lib/topics";
import { ArticleCard } from "@/components/article-card";

const STATS = [
  { value: "37.2T", label: "cells rebuilding" },
  { value: "86B", label: "neurons firing" },
  { value: "100K", label: "heartbeats / day" },
  { value: "206", label: "bones to train" },
];

const MARQUEE = [
  "Body",
  "Mind",
  "Psychology",
  "Health",
  "Elevation",
  "Longevity",
  "Recovery",
  "Focus",
];

export default async function HomePage() {
  const [featured, latest, counts] = await Promise.all([
    getFeaturedArticles(3),
    getPublishedArticles({ limit: 6 }),
    countByTopic(),
  ]);

  const hero = featured[0];
  const secondary = featured.slice(1, 3);

  return (
    <>
      {/* ================================================================ HERO */}
      <section className="relative overflow-hidden border-b border-line">
        {/* giant watermark word */}
        <span
          aria-hidden
          className="display pointer-events-none absolute -right-10 -top-16 select-none text-[26vw] leading-none text-white/[0.025] sm:-top-24"
        >
          HUMAN
        </span>

        <div className="mx-auto max-w-[1400px] border-x border-line">
          <div className="grid lg:grid-cols-[auto_1fr]">
            {/* left vertical rail */}
            <div className="hidden w-14 items-end border-r border-line lg:flex">
              <span className="eyebrow mb-8 ml-4 rotate-180 text-fg-faint [writing-mode:vertical-rl]">
                Est. 2026 — Human Systems Field Guide
              </span>
            </div>

            <div className="px-5 pb-14 pt-16 sm:px-10 sm:pt-24">
              <div className="flex items-center gap-3">
                <span className="h-2 w-2 animate-pulse bg-volt" />
                <span className="eyebrow text-fg-dim">
                  The human optimization library
                </span>
              </div>

              <h1 className="display mt-8 text-[19vw] leading-[0.82] text-fg sm:text-8xl lg:text-9xl">
                Optimize
                <br />
                the <span className="text-volt">human</span>
              </h1>

              <div className="mt-10 grid gap-8 border-t border-line pt-8 md:grid-cols-[1fr_auto] md:items-end">
                <p className="max-w-xl text-lg leading-relaxed text-fg-dim">
                  You are 37 trillion cells rebuilding on a schedule you can
                  influence. A field guide to the machine you live in — every
                  system, every input, everything that damages or improves it.
                </p>
                <div className="flex flex-wrap gap-0">
                  <Link
                    href="/articles"
                    className="trans inline-flex items-center gap-2 bg-volt px-6 py-3.5 text-sm font-bold uppercase tracking-wide text-ink hover:bg-fg"
                  >
                    Start learning
                    <svg width="15" height="15" viewBox="0 0 14 14" fill="none">
                      <path
                        d="M3 7h8M7.5 3.5 11 7l-3.5 3.5"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        strokeLinecap="square"
                      />
                    </svg>
                  </Link>
                  <Link
                    href="#domains"
                    className="trans inline-flex items-center border border-l-0 border-line px-6 py-3.5 text-sm font-bold uppercase tracking-wide text-fg hover:bg-surface"
                  >
                    Domains
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================= MARQUEE */}
      <div className="overflow-hidden border-b border-line bg-volt py-3 text-ink">
        <div className="marquee">
          {[0, 1].map((dup) => (
            <div key={dup} className="flex shrink-0" aria-hidden={dup === 1}>
              {MARQUEE.map((w) => (
                <span
                  key={w}
                  className="display flex items-center whitespace-nowrap px-6 text-xl"
                >
                  {w}
                  <span className="ml-6 text-base">✦</span>
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* =============================================================== FIGURES */}
      <section className="mx-auto max-w-[1400px] border-x border-line">
        <div className="flex items-baseline justify-between px-5 pt-10 sm:px-10">
          <span className="eyebrow text-fg-faint">The human, by the numbers</span>
          <span className="eyebrow text-fg-faint">Fig. 01</span>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4">
          {STATS.map((s, i) => (
            <div
              key={s.label}
              className={`px-5 py-8 sm:px-10 ${
                i !== 0 ? "border-l border-line" : ""
              } ${i >= 2 ? "border-t md:border-t-0" : ""}`}
            >
              <div className="display text-5xl text-fg sm:text-6xl">
                {s.value}
              </div>
              <div className="eyebrow mt-3 text-fg-faint">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* =============================================================== DOMAINS */}
      <section
        id="domains"
        className="mx-auto max-w-[1400px] scroll-mt-20 border-x border-t border-line"
      >
        <div className="flex items-baseline justify-between px-5 py-8 sm:px-10">
          <h2 className="display text-4xl text-fg sm:text-5xl">
            Five domains
          </h2>
          <span className="eyebrow text-fg-faint">01 — 05</span>
        </div>

        <div className="border-t border-line">
          {TOPICS.map((t, i) => (
            <Link
              key={t.slug}
              href={`/topics/${t.slug}`}
              className="trans group grid grid-cols-[auto_1fr_auto] items-center gap-5 border-b border-line px-5 py-6 last:border-b-0 hover:bg-[var(--dh)] sm:gap-8 sm:px-10"
              style={{ ["--dh" as string]: t.color }}
            >
              <span className="eyebrow text-fg-faint group-hover:text-ink/70">
                {String(i + 1).padStart(2, "0")}
              </span>
              <div className="flex flex-wrap items-baseline gap-x-5 gap-y-1">
                <span className="display text-4xl text-fg group-hover:text-ink sm:text-6xl">
                  {t.name}
                </span>
                <span className="text-sm text-fg-dim group-hover:text-ink/70">
                  {t.tagline}
                </span>
              </div>
              <div className="flex items-center gap-4 sm:gap-8">
                <span className="eyebrow hidden text-fg-faint group-hover:text-ink/70 sm:inline">
                  {counts[t.slug] ?? 0}{" "}
                  {(counts[t.slug] ?? 0) === 1 ? "piece" : "pieces"}
                </span>
                <span className="text-3xl text-fg-faint group-hover:text-ink">
                  →
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ============================================================== FEATURED */}
      {hero && (
        <section className="mx-auto max-w-[1400px] border-x border-t border-line">
          <div className="flex items-baseline justify-between px-5 py-8 sm:px-10">
            <h2 className="display text-4xl text-fg sm:text-5xl">Featured</h2>
            <span className="eyebrow text-fg-faint">Editor’s pick</span>
          </div>
          <div className="grid gap-px border-t border-line bg-line lg:grid-cols-[1.4fr_1fr]">
            <ArticleCard article={hero} size="large" />
            <div className="grid gap-px bg-line sm:grid-cols-2 lg:grid-cols-1">
              {secondary.map((a) => (
                <ArticleCard key={a.id} article={a} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ============================================================= MANIFESTO */}
      <section className="border-y border-line bg-volt text-ink">
        <div className="mx-auto max-w-[1400px] border-x border-ink/15 px-5 py-20 sm:px-10 sm:py-28">
          <span className="eyebrow text-ink/60">The premise</span>
          <p className="display mt-6 max-w-4xl text-5xl leading-[0.92] sm:text-7xl">
            The body keeps score.
            <br />
            Learn to read it.
          </p>
          <div className="mt-10 flex flex-wrap items-center gap-6">
            <Link
              href="/articles"
              className="trans inline-flex items-center gap-2 bg-ink px-6 py-3.5 text-sm font-bold uppercase tracking-wide text-volt hover:bg-ink-2"
            >
              Browse the library
              <span>→</span>
            </Link>
            <p className="max-w-sm text-sm font-medium text-ink/70">
              Grounded breakdowns of the body, mind and human potential. No
              hype, no miracle protocols.
            </p>
          </div>
        </div>
      </section>

      {/* ================================================================ LATEST */}
      <section className="mx-auto max-w-[1400px] border-x border-line">
        <div className="flex items-baseline justify-between px-5 py-8 sm:px-10">
          <h2 className="display text-4xl text-fg sm:text-5xl">Latest</h2>
          <Link
            href="/articles"
            className="eyebrow text-fg-dim hover:text-volt"
          >
            View all →
          </Link>
        </div>
        <div className="grid gap-px border-t border-line bg-line sm:grid-cols-2 lg:grid-cols-3">
          {latest.map((a, i) => (
            <ArticleCard key={a.id} article={a} index={i + 1} />
          ))}
        </div>
      </section>
    </>
  );
}

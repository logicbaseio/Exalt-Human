import Link from "next/link";
import {
  getFeaturedArticles,
  getPublishedArticles,
  countByTopic,
} from "@/lib/articles";
import { TOPICS } from "@/lib/topics";
import { ArticleCard } from "@/components/article-card";
import { TopicIcon } from "@/components/topic-icon";

const STATS = [
  { value: "37.2T", label: "cells rebuilding" },
  { value: "86B", label: "neurons firing" },
  { value: "100K", label: "heartbeats / day" },
  { value: "206", label: "bones to train" },
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
      {/* ---------------------------------------------------------------- HERO */}
      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 grid-bg" />
        <div className="pointer-events-none absolute inset-x-0 top-0 h-[520px] glow-volt opacity-70" />

        <div className="relative mx-auto max-w-6xl px-5 pb-16 pt-20 sm:px-8 sm:pt-28">
          <div className="inline-flex items-center gap-2 rounded-full border border-line bg-surface/60 px-3.5 py-1.5">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-volt" />
            <span className="eyebrow text-fg-dim">
              The human optimization library
            </span>
          </div>

          <h1 className="display mt-7 max-w-4xl text-6xl text-fg sm:text-7xl md:text-8xl">
            Optimize
            <br />
            the <span className="text-volt">human.</span>
          </h1>

          <p className="mt-7 max-w-xl text-lg leading-relaxed text-fg-dim">
            You are 37 trillion cells rebuilding on a schedule you can influence.
            Exalt Human is a field guide to the machine you live in — every system,
            every input, everything that damages or improves it.
          </p>

          <div className="mt-9 flex flex-wrap items-center gap-3">
            <Link
              href="/articles"
              className="inline-flex items-center gap-2 rounded-full bg-volt px-6 py-3 text-sm font-semibold text-ink transition-transform hover:scale-[1.03]"
            >
              Start learning
              <svg width="16" height="16" viewBox="0 0 14 14" fill="none">
                <path
                  d="M3 7h8M7.5 3.5 11 7l-3.5 3.5"
                  stroke="currentColor"
                  strokeWidth="1.7"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </Link>
            <Link
              href="#domains"
              className="inline-flex items-center rounded-full border border-line px-6 py-3 text-sm font-semibold text-fg transition-colors hover:border-white/30 hover:bg-surface"
            >
              Explore the domains
            </Link>
          </div>

          {/* stat band */}
          <div className="mt-16 grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-line bg-line sm:grid-cols-4">
            {STATS.map((s) => (
              <div key={s.label} className="bg-ink px-5 py-6">
                <div className="font-mono text-3xl font-medium tracking-tight text-fg sm:text-4xl">
                  {s.value}
                </div>
                <div className="eyebrow mt-2 text-fg-faint">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------- DOMAINS */}
      <section id="domains" className="mx-auto max-w-6xl scroll-mt-20 px-5 py-20 sm:px-8">
        <div className="flex items-end justify-between gap-6">
          <div>
            <p className="eyebrow text-fg-faint">Five domains</p>
            <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-fg sm:text-4xl">
              Everything human, mapped.
            </h2>
          </div>
          <Link
            href="/articles"
            className="hidden shrink-0 text-sm font-semibold text-fg-dim hover:text-fg sm:inline"
          >
            All articles →
          </Link>
        </div>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {TOPICS.map((t) => (
            <Link
              key={t.slug}
              href={`/topics/${t.slug}`}
              className="lift group relative flex flex-col overflow-hidden rounded-2xl border border-line bg-surface p-7 hover:border-white/20"
            >
              <div
                className="pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-100"
                style={{ background: t.tint }}
              />
              <div
                className="flex h-12 w-12 items-center justify-center rounded-xl border"
                style={{ borderColor: t.color, color: t.color }}
              >
                <TopicIcon slug={t.slug} color={t.color} size={26} />
              </div>
              <h3 className="mt-5 text-xl font-bold tracking-tight text-fg">
                {t.name}
              </h3>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-fg-dim">
                {t.tagline}
              </p>
              <div className="mt-5 flex items-center justify-between">
                <span className="eyebrow text-fg-faint">
                  {counts[t.slug] ?? 0}{" "}
                  {(counts[t.slug] ?? 0) === 1 ? "article" : "articles"}
                </span>
                <span
                  className="text-sm font-semibold transition-transform group-hover:translate-x-0.5"
                  style={{ color: t.color }}
                >
                  Enter →
                </span>
              </div>
            </Link>
          ))}

          {/* mission tile */}
          <div className="flex flex-col justify-center rounded-2xl border border-dashed border-line bg-ink-2 p-7">
            <p className="text-sm leading-relaxed text-fg-dim">
              Where body, mind and psychology converge is where real change
              happens.
            </p>
            <p className="mt-3 font-mono text-sm text-volt">
              Be aware of everything.
            </p>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------ FEATURED */}
      {hero && (
        <section className="mx-auto max-w-6xl px-5 py-6 sm:px-8">
          <p className="eyebrow text-fg-faint">Featured</p>
          <div className="mt-6 grid gap-4 lg:grid-cols-[1.5fr_1fr]">
            <ArticleCard article={hero} size="large" />
            <div className="grid gap-4">
              {secondary.map((a) => (
                <ArticleCard key={a.id} article={a} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* -------------------------------------------------------------- LATEST */}
      <section className="mx-auto max-w-6xl px-5 py-16 sm:px-8">
        <div className="flex items-end justify-between gap-6">
          <h2 className="text-3xl font-extrabold tracking-tight text-fg sm:text-4xl">
            Latest
          </h2>
          <Link
            href="/articles"
            className="text-sm font-semibold text-fg-dim hover:text-fg"
          >
            View all →
          </Link>
        </div>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {latest.map((a) => (
            <ArticleCard key={a.id} article={a} />
          ))}
        </div>
      </section>

      {/* ----------------------------------------------------------------- CTA */}
      <section className="mx-auto max-w-6xl px-5 py-12 sm:px-8">
        <div className="relative overflow-hidden rounded-3xl border border-line bg-surface px-8 py-16 text-center sm:py-20">
          <div className="pointer-events-none absolute inset-0 grid-bg opacity-60" />
          <div className="pointer-events-none absolute inset-x-0 bottom-0 top-auto h-64 glow-volt opacity-60 [transform:rotate(180deg)]" />
          <div className="relative">
            <h2 className="display mx-auto max-w-2xl text-4xl text-fg sm:text-5xl">
              The body keeps score. <span className="text-volt">Learn to read it.</span>
            </h2>
            <p className="mx-auto mt-5 max-w-lg text-fg-dim">
              New breakdowns on the science of the body, mind and human potential
              — grounded, practical, no hype.
            </p>
            <Link
              href="/articles"
              className="mt-8 inline-flex items-center gap-2 rounded-full bg-volt px-7 py-3.5 text-sm font-semibold text-ink transition-transform hover:scale-[1.03]"
            >
              Browse the library
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

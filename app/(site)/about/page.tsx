import Link from "next/link";
import type { Metadata } from "next";
import { TOPICS } from "@/lib/topics";
import { TopicIcon } from "@/components/topic-icon";

export const metadata: Metadata = {
  title: "About",
  description:
    "Exalt Human is a platform dedicated to human optimization — the science of the body, mind and human potential.",
};

const PRINCIPLES = [
  {
    n: "01",
    title: "The body is a system",
    text: "Not a collection of parts, but an interconnected machine. We trace how sleep touches hormones, how movement touches mood, how one input ripples through the whole.",
  },
  {
    n: "02",
    title: "Awareness is leverage",
    text: "You cannot improve what you cannot see. The goal is to make the invisible mechanics of your body and mind legible — so your choices become informed instead of accidental.",
  },
  {
    n: "03",
    title: "Grounded, never hyped",
    text: "No miracle protocols, no fear-selling. Just clear explanations of what the evidence supports, why it works, and what it means for how you live.",
  },
];

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-[1400px] border-x border-line">
      {/* masthead */}
      <header className="relative overflow-hidden border-b border-line px-5 pb-14 pt-16 sm:px-10 sm:pt-24">
        <span
          aria-hidden
          className="display pointer-events-none absolute -right-8 -top-16 select-none text-[22vw] leading-none text-white/[0.025]"
        >
          HUMAN
        </span>
        <div className="relative">
          <div className="flex items-center gap-3">
            <span className="h-2 w-2 bg-volt" />
            <span className="eyebrow text-fg-dim">About Exalt Human</span>
          </div>
          <h1 className="display mt-7 max-w-4xl text-6xl text-fg sm:text-8xl">
            A field guide to <span className="text-volt">being human</span>
          </h1>
          <p className="mt-8 max-w-2xl text-lg leading-relaxed text-fg-dim">
            Exalt Human is a platform dedicated to human optimization. We publish
            clear, grounded content on the human body, mind, psychology and health
            — and everything that damages or improves them. The premise is simple:
            learn the machine you live in, and you can maintain it, defend it and
            elevate it.
          </p>
        </div>
      </header>

      {/* principles */}
      <section className="grid gap-px border-b border-line bg-line md:grid-cols-3">
        {PRINCIPLES.map((p) => (
          <div key={p.n} className="bg-ink px-6 py-10 sm:px-8">
            <div className="display text-4xl text-volt">{p.n}</div>
            <h3 className="display mt-5 text-2xl text-fg">{p.title}</h3>
            <p className="mt-3 text-sm leading-relaxed text-fg-dim">{p.text}</p>
          </div>
        ))}
      </section>

      {/* domains recap */}
      <section>
        <div className="flex items-baseline justify-between px-5 py-8 sm:px-10">
          <h2 className="display text-4xl text-fg sm:text-5xl">
            Five domains, one system
          </h2>
          <span className="eyebrow text-fg-faint">Coverage</span>
        </div>
        <div className="border-t border-line">
          {TOPICS.map((t, i) => (
            <Link
              key={t.slug}
              href={`/topics/${t.slug}`}
              className="trans group flex items-center gap-5 border-b border-line px-5 py-6 last:border-b-0 hover:bg-[var(--dh)] sm:gap-8 sm:px-10"
              style={{ ["--dh" as string]: t.color }}
            >
              <span className="eyebrow text-fg-faint group-hover:text-ink/70">
                {String(i + 1).padStart(2, "0")}
              </span>
              <div
                className="flex h-11 w-11 shrink-0 items-center justify-center border group-hover:border-ink"
                style={{ borderColor: t.color, color: t.color }}
              >
                <TopicIcon slug={t.slug} color="currentColor" size={22} />
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="display text-2xl text-fg group-hover:text-ink sm:text-3xl">
                  {t.name}
                </h3>
                <p className="truncate text-sm text-fg-dim group-hover:text-ink/70">
                  {t.tagline}
                </p>
              </div>
              <span className="text-2xl text-fg-faint group-hover:text-ink">
                →
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* cta */}
      <section className="border-t border-line bg-volt text-ink">
        <div className="px-5 py-16 text-center sm:px-10">
          <h2 className="display text-4xl sm:text-6xl">Start with the library</h2>
          <Link
            href="/articles"
            className="trans mt-8 inline-flex bg-ink px-7 py-3.5 text-sm font-bold uppercase tracking-wide text-volt hover:bg-ink-2"
          >
            Browse all articles →
          </Link>
        </div>
      </section>
    </div>
  );
}

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
    text: "Not a collection of parts, but an interconnected machine. We treat it that way — tracing how sleep touches hormones, how movement touches mood, how one input ripples through the whole.",
  },
  {
    n: "02",
    title: "Awareness is leverage",
    text: "You cannot improve what you cannot see. The goal is to make the invisible mechanics of your body and mind legible — so your choices become informed instead of accidental.",
  },
  {
    n: "03",
    title: "Grounded, never hyped",
    text: "No miracle protocols, no fear-selling. Just clear explanations of what the evidence supports, why it works, and what it means for the way you live.",
  },
];

export default function AboutPage() {
  return (
    <div>
      <header className="relative overflow-hidden border-b border-line">
        <div className="pointer-events-none absolute inset-0 grid-bg opacity-70" />
        <div className="pointer-events-none absolute inset-x-0 top-0 h-72 glow-volt opacity-60" />
        <div className="relative mx-auto max-w-4xl px-5 pb-16 pt-16 sm:px-8 sm:pt-24">
          <p className="eyebrow text-fg-faint">About Exalt Human</p>
          <h1 className="display mt-6 max-w-3xl text-5xl text-fg sm:text-6xl">
            A field guide to <span className="text-volt">being human.</span>
          </h1>
          <p className="mt-7 max-w-2xl text-lg leading-relaxed text-fg-dim">
            Exalt Human is a platform dedicated to human optimization. We publish
            clear, grounded content on the human body, mind, psychology and health
            — and everything that damages or improves them. The premise is simple:
            learn the machine you live in, and you can maintain it, defend it and
            elevate it.
          </p>
        </div>
      </header>

      {/* principles */}
      <section className="mx-auto max-w-4xl px-5 py-16 sm:px-8">
        <div className="grid gap-4 sm:grid-cols-3">
          {PRINCIPLES.map((p) => (
            <div
              key={p.n}
              className="rounded-2xl border border-line bg-surface p-6"
            >
              <div className="font-mono text-sm text-volt">{p.n}</div>
              <h3 className="mt-4 text-lg font-bold tracking-tight text-fg">
                {p.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-fg-dim">
                {p.text}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* domains recap */}
      <section className="mx-auto max-w-4xl px-5 pb-16 sm:px-8">
        <p className="eyebrow text-fg-faint">What we cover</p>
        <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-fg">
          Five domains, one system.
        </h2>
        <div className="mt-8 space-y-3">
          {TOPICS.map((t) => (
            <Link
              key={t.slug}
              href={`/topics/${t.slug}`}
              className="lift group flex items-center gap-5 rounded-2xl border border-line bg-surface p-5 hover:border-white/20"
            >
              <div
                className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border"
                style={{ borderColor: t.color, color: t.color }}
              >
                <TopicIcon slug={t.slug} color={t.color} size={24} />
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="font-bold text-fg">{t.name}</h3>
                <p className="truncate text-sm text-fg-dim">{t.tagline}</p>
              </div>
              <span
                className="shrink-0 text-sm font-semibold transition-transform group-hover:translate-x-0.5"
                style={{ color: t.color }}
              >
                →
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* cta */}
      <section className="mx-auto max-w-4xl px-5 pb-16 sm:px-8">
        <div className="rounded-3xl border border-line bg-surface p-10 text-center">
          <h2 className="text-2xl font-extrabold tracking-tight text-fg sm:text-3xl">
            Start with the library.
          </h2>
          <Link
            href="/articles"
            className="mt-6 inline-flex rounded-full bg-volt px-6 py-3 text-sm font-semibold text-ink transition-transform hover:scale-[1.03]"
          >
            Browse all articles
          </Link>
        </div>
      </section>
    </div>
  );
}

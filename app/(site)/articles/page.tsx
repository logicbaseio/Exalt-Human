import Link from "next/link";
import type { Metadata } from "next";
import { getPublishedArticles } from "@/lib/articles";
import { TOPICS, TOPIC_SLUGS, type TopicSlug } from "@/lib/topics";
import { ArticleCard } from "@/components/article-card";

export const metadata: Metadata = {
  title: "Articles",
  description:
    "Every breakdown across body, mind, psychology, health and elevation.",
};

export default async function ArticlesPage({
  searchParams,
}: {
  searchParams: Promise<{ topic?: string }>;
}) {
  const { topic } = await searchParams;
  const active =
    topic && TOPIC_SLUGS.includes(topic as TopicSlug)
      ? (topic as TopicSlug)
      : undefined;

  const articles = await getPublishedArticles({ topic: active });

  return (
    <div className="mx-auto max-w-6xl px-5 py-16 sm:px-8 sm:py-20">
      <p className="eyebrow text-fg-faint">The library</p>
      <h1 className="mt-3 text-4xl font-extrabold tracking-tight text-fg sm:text-5xl">
        {active ? TOPICS.find((t) => t.slug === active)?.name : "All articles"}
      </h1>
      <p className="mt-4 max-w-xl text-fg-dim">
        Grounded breakdowns of how the human system works — and what moves the
        needle.
      </p>

      {/* filter chips */}
      <div className="mt-9 flex flex-wrap gap-2">
        <FilterChip href="/articles" label="All" isActive={!active} />
        {TOPICS.map((t) => (
          <FilterChip
            key={t.slug}
            href={`/articles?topic=${t.slug}`}
            label={t.name}
            color={t.color}
            isActive={active === t.slug}
          />
        ))}
      </div>

      {articles.length === 0 ? (
        <div className="mt-16 rounded-2xl border border-dashed border-line bg-surface p-12 text-center">
          <p className="text-fg-dim">No articles here yet. Check back soon.</p>
        </div>
      ) : (
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {articles.map((a) => (
            <ArticleCard key={a.id} article={a} />
          ))}
        </div>
      )}
    </div>
  );
}

function FilterChip({
  href,
  label,
  color,
  isActive,
}: {
  href: string;
  label: string;
  color?: string;
  isActive: boolean;
}) {
  return (
    <Link
      href={href}
      className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition-colors ${
        isActive
          ? "border-white/25 bg-surface-2 text-fg"
          : "border-line text-fg-dim hover:border-white/20 hover:text-fg"
      }`}
    >
      {color && (
        <span
          className="h-1.5 w-1.5 rounded-full"
          style={{ background: color }}
        />
      )}
      {label}
    </Link>
  );
}

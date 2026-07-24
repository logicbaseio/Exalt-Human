import Link from "next/link";
import type { Metadata } from "next";
import { getPublishedArticles } from "@/lib/articles";
import { TOPICS, TOPIC_SLUGS, topicOf, type TopicSlug } from "@/lib/topics";
import { formatDate } from "@/lib/format";

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
  const activeTopic = active ? topicOf(active) : undefined;

  return (
    <div className="mx-auto max-w-[1400px] border-x border-line">
      {/* masthead */}
      <header className="border-b border-line px-5 pb-10 pt-16 sm:px-10 sm:pt-20">
        <div className="flex items-center gap-3">
          <span
            className="h-2 w-2"
            style={{ background: activeTopic?.color ?? "var(--color-volt)" }}
          />
          <span className="eyebrow text-fg-dim">
            {activeTopic ? `Domain — ${activeTopic.name}` : "The library"}
          </span>
        </div>
        <h1 className="display mt-6 text-6xl text-fg sm:text-8xl">
          {activeTopic ? activeTopic.name : "All articles"}
        </h1>
        <p className="mt-6 max-w-xl text-lg leading-relaxed text-fg-dim">
          {activeTopic?.intro ??
            "Grounded breakdowns of how the human system works — and what actually moves the needle."}
        </p>
      </header>

      {/* filter bar */}
      <div className="flex flex-wrap items-stretch border-b border-line">
        <FilterTab href="/articles" label="All" count={undefined} isActive={!active} />
        {TOPICS.map((t) => (
          <FilterTab
            key={t.slug}
            href={`/articles?topic=${t.slug}`}
            label={t.name}
            color={t.color}
            isActive={active === t.slug}
          />
        ))}
        <span className="ml-auto hidden items-center px-6 sm:flex">
          <span className="eyebrow text-fg-faint">
            {String(articles.length).padStart(2, "0")} total
          </span>
        </span>
      </div>

      {/* index */}
      {articles.length === 0 ? (
        <div className="px-5 py-24 text-center sm:px-10">
          <p className="display text-3xl text-fg-faint">Nothing here yet</p>
          <p className="mt-3 text-fg-dim">Check back soon.</p>
        </div>
      ) : (
        <ol>
          {articles.map((a, i) => {
            const t = topicOf(a.topic);
            return (
              <li key={a.id}>
                <Link
                  href={`/articles/${a.slug}`}
                  className="trans group grid grid-cols-[auto_1fr] items-start gap-5 border-b border-line px-5 py-8 hover:bg-[var(--dh)] sm:grid-cols-[3rem_1fr_auto] sm:gap-8 sm:px-10 sm:py-10"
                  style={{ ["--dh" as string]: t.color }}
                >
                  {/* index */}
                  <span className="display pt-1 text-2xl text-fg-faint group-hover:text-ink sm:text-3xl">
                    {String(i + 1).padStart(2, "0")}
                  </span>

                  {/* main */}
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span
                        className="h-1.5 w-1.5 group-hover:!bg-ink"
                        style={{ background: t.color }}
                      />
                      <span className="eyebrow text-fg-dim group-hover:text-ink/70">
                        {t.name}
                      </span>
                    </div>
                    <h2 className="display mt-3 text-3xl text-fg group-hover:text-ink sm:text-5xl">
                      {a.title}
                    </h2>
                    <p className="mt-3 max-w-2xl text-sm leading-relaxed text-fg-dim group-hover:text-ink/75 sm:text-base">
                      {a.excerpt}
                    </p>
                  </div>

                  {/* meta */}
                  <div className="col-span-2 flex items-center gap-5 sm:col-span-1 sm:flex-col sm:items-end sm:gap-3 sm:pt-1">
                    <span className="eyebrow whitespace-nowrap text-fg-faint group-hover:text-ink/70">
                      {formatDate(a.created_at)}
                    </span>
                    <span className="eyebrow whitespace-nowrap text-fg-faint group-hover:text-ink/70">
                      {a.read_minutes} min
                    </span>
                    <span className="ml-auto text-2xl text-fg-faint group-hover:text-ink sm:ml-0 sm:text-3xl">
                      →
                    </span>
                  </div>
                </Link>
              </li>
            );
          })}
        </ol>
      )}
    </div>
  );
}

function FilterTab({
  href,
  label,
  color,
  isActive,
}: {
  href: string;
  label: string;
  count?: number;
  color?: string;
  isActive: boolean;
}) {
  return (
    <Link
      href={href}
      className={`trans flex items-center gap-2 border-r border-line px-5 py-4 text-[13px] font-bold uppercase tracking-wide ${
        isActive
          ? "bg-fg text-ink"
          : "text-fg-dim hover:bg-surface hover:text-fg"
      }`}
    >
      {color && (
        <span
          className="h-2 w-2"
          style={{ background: isActive ? "var(--color-ink)" : color }}
        />
      )}
      {label}
    </Link>
  );
}

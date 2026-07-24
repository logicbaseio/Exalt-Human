import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getPublishedArticles } from "@/lib/articles";
import { getTopic, TOPICS, TOPIC_SLUGS } from "@/lib/topics";
import { ArticleCard } from "@/components/article-card";
import { TopicIcon } from "@/components/topic-icon";
import Link from "next/link";

export function generateStaticParams() {
  return TOPIC_SLUGS.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const topic = getTopic(slug);
  if (!topic) return { title: "Not found" };
  return { title: topic.name, description: topic.intro };
}

export default async function TopicPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const topic = getTopic(slug);
  if (!topic) notFound();

  const articles = await getPublishedArticles({ topic: topic.slug });
  const others = TOPICS.filter((t) => t.slug !== topic.slug);

  return (
    <div>
      {/* header */}
      <header className="relative overflow-hidden border-b border-line">
        <div className="pointer-events-none absolute inset-0 grid-bg opacity-70" />
        <div
          className="pointer-events-none absolute inset-x-0 top-0 h-72 opacity-50"
          style={{
            background: `radial-gradient(50% 100% at 50% 0%, ${topic.tint}, transparent 70%)`,
          }}
        />
        <div className="relative mx-auto max-w-6xl px-5 pb-14 pt-16 sm:px-8 sm:pt-24">
          <div
            className="flex h-16 w-16 items-center justify-center rounded-2xl border"
            style={{ borderColor: topic.color, color: topic.color }}
          >
            <TopicIcon slug={topic.slug} color={topic.color} size={34} />
          </div>
          <h1 className="display mt-6 text-6xl text-fg sm:text-7xl">
            {topic.name}
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-relaxed text-fg-dim">
            {topic.intro}
          </p>
          <p className="eyebrow mt-6 text-fg-faint">
            {articles.length} article{articles.length === 1 ? "" : "s"}
          </p>
        </div>
      </header>

      {/* articles */}
      <section className="mx-auto max-w-6xl px-5 py-14 sm:px-8">
        {articles.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-line bg-surface p-12 text-center">
            <p className="text-fg-dim">
              No articles in this domain yet. Check back soon.
            </p>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {articles.map((a) => (
              <ArticleCard key={a.id} article={a} />
            ))}
          </div>
        )}
      </section>

      {/* other domains */}
      <section className="mx-auto max-w-6xl px-5 pb-12 sm:px-8">
        <p className="eyebrow text-fg-faint">Other domains</p>
        <div className="mt-5 flex flex-wrap gap-2">
          {others.map((t) => (
            <Link
              key={t.slug}
              href={`/topics/${t.slug}`}
              className="inline-flex items-center gap-2 rounded-full border border-line px-4 py-2 text-sm font-medium text-fg-dim transition-colors hover:border-white/20 hover:text-fg"
            >
              <span
                className="h-1.5 w-1.5 rounded-full"
                style={{ background: t.color }}
              />
              {t.name}
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}

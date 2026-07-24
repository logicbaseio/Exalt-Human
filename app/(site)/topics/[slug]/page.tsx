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
    <div className="mx-auto max-w-[1400px] border-x border-line">
      {/* masthead */}
      <header className="relative overflow-hidden border-b border-line px-5 pb-12 pt-14 sm:px-10 sm:pt-20">
        <span
          aria-hidden
          className="display pointer-events-none absolute -right-6 -top-10 select-none text-[24vw] leading-none opacity-[0.06]"
          style={{ color: topic.color }}
        >
          {topic.name}
        </span>
        <div className="relative">
          <div
            className="flex h-16 w-16 items-center justify-center border-2"
            style={{ borderColor: topic.color, color: topic.color }}
          >
            <TopicIcon slug={topic.slug} color={topic.color} size={34} />
          </div>
          <h1 className="display mt-7 text-7xl text-fg sm:text-9xl">
            {topic.name}
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-fg-dim">
            {topic.intro}
          </p>
          <p className="eyebrow mt-7 text-fg-faint">
            {String(articles.length).padStart(2, "0")} article
            {articles.length === 1 ? "" : "s"}
          </p>
        </div>
      </header>

      {/* articles */}
      {articles.length === 0 ? (
        <div className="px-5 py-24 text-center sm:px-10">
          <p className="display text-3xl text-fg-faint">Nothing here yet</p>
          <p className="mt-3 text-fg-dim">Check back soon.</p>
        </div>
      ) : (
        <div className="grid gap-px bg-line sm:grid-cols-2 lg:grid-cols-3">
          {articles.map((a, i) => (
            <ArticleCard key={a.id} article={a} index={i + 1} />
          ))}
        </div>
      )}

      {/* other domains */}
      <section className="border-t border-line px-5 py-10 sm:px-10">
        <span className="eyebrow text-fg-faint">Other domains</span>
        <div className="mt-5 flex flex-wrap gap-px bg-line">
          {others.map((t) => (
            <Link
              key={t.slug}
              href={`/topics/${t.slug}`}
              className="trans flex items-center gap-2 bg-ink px-4 py-2.5 text-[13px] font-bold uppercase tracking-wide text-fg-dim hover:bg-[var(--dh)] hover:text-ink"
              style={{ ["--dh" as string]: t.color }}
            >
              <span
                className="h-2 w-2 group-hover:bg-ink"
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

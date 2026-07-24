import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getArticleBySlug, getPublishedArticles } from "@/lib/articles";
import { topicOf } from "@/lib/topics";
import { formatDateLong } from "@/lib/format";
import { MarkdownBody } from "@/components/markdown";
import { ArticleCard } from "@/components/article-card";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);
  if (!article) return { title: "Not found" };
  return {
    title: article.title,
    description: article.excerpt,
    openGraph: {
      type: "article",
      title: article.title,
      description: article.excerpt,
      publishedTime: article.created_at,
      authors: [article.author],
    },
  };
}

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);
  if (!article) notFound();

  const topic = topicOf(article.topic);
  const related = (
    await getPublishedArticles({
      topic: article.topic,
      limit: 3,
      excludeSlug: article.slug,
    })
  ).slice(0, 2);

  return (
    <article className="mx-auto max-w-[1400px] border-x border-line">
      {/* header */}
      <header className="border-b border-line px-5 pb-12 pt-12 sm:px-10 sm:pt-16">
        <div className="mx-auto max-w-3xl">
          <div className="flex items-center gap-4">
            <Link
              href={`/topics/${topic.slug}`}
              className="trans inline-flex items-center gap-2 px-3 py-1.5 text-xs font-bold uppercase tracking-wide text-ink"
              style={{ background: topic.color }}
            >
              {topic.name}
            </Link>
            <span className="eyebrow text-fg-faint">
              {article.read_minutes} min read
            </span>
          </div>

          <h1 className="display mt-8 text-5xl leading-[0.92] text-fg sm:text-7xl">
            {article.title}
          </h1>

          <p className="mt-7 max-w-2xl text-xl leading-relaxed text-fg-dim">
            {article.excerpt}
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-x-3 gap-y-1 border-t border-line pt-6">
            <span className="eyebrow text-fg-dim">{article.author}</span>
            <span className="text-fg-faint" aria-hidden>
              /
            </span>
            <span className="eyebrow text-fg-faint">
              {formatDateLong(article.created_at)}
            </span>
          </div>
        </div>
      </header>

      {/* body */}
      <div className="px-5 py-14 sm:px-10">
        <div className="mx-auto max-w-3xl">
          <MarkdownBody>{article.body}</MarkdownBody>

          <div className="mt-14 border-l-2 border-volt bg-surface px-5 py-4 text-sm text-fg-dim">
            Educational content only. Nothing here is medical advice — consult a
            qualified professional before acting on it.
          </div>

          <div className="mt-10 flex items-center justify-between border-t border-line pt-8">
            <Link
              href="/articles"
              className="eyebrow text-fg-dim hover:text-volt"
            >
              ← All articles
            </Link>
            <Link
              href={`/topics/${topic.slug}`}
              className="eyebrow hover:opacity-70"
              style={{ color: topic.color }}
            >
              More on {topic.name} →
            </Link>
          </div>
        </div>
      </div>

      {/* related */}
      {related.length > 0 && (
        <section className="border-t border-line">
          <div className="px-5 py-8 sm:px-10">
            <h2 className="display text-3xl text-fg sm:text-4xl">Keep going</h2>
          </div>
          <div className="grid gap-px border-t border-line bg-line sm:grid-cols-2">
            {related.map((a) => (
              <ArticleCard key={a.id} article={a} />
            ))}
          </div>
        </section>
      )}
    </article>
  );
}

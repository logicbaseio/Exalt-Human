import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import {
  getArticleBySlug,
  getPublishedArticles,
} from "@/lib/articles";
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
    <article>
      {/* header */}
      <header className="relative overflow-hidden border-b border-line">
        <div className="pointer-events-none absolute inset-0 grid-bg opacity-60" />
        <div
          className="pointer-events-none absolute inset-x-0 top-0 h-64 opacity-40"
          style={{
            background: `radial-gradient(50% 100% at 50% 0%, ${topic.tint}, transparent 70%)`,
          }}
        />
        <div className="relative mx-auto max-w-3xl px-5 pb-12 pt-14 sm:px-8 sm:pt-20">
          <Link
            href={`/topics/${topic.slug}`}
            className="inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-semibold uppercase tracking-wide"
            style={{ color: topic.color, background: topic.tint }}
          >
            {topic.name}
          </Link>

          <h1 className="mt-6 text-4xl font-extrabold leading-[1.08] tracking-tight text-fg sm:text-5xl">
            {article.title}
          </h1>

          <p className="mt-5 text-lg leading-relaxed text-fg-dim">
            {article.excerpt}
          </p>

          <div className="mt-7 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-fg-faint">
            <span className="font-medium text-fg-dim">{article.author}</span>
            <span aria-hidden>·</span>
            <span>{formatDateLong(article.created_at)}</span>
            <span aria-hidden>·</span>
            <span>{article.read_minutes} min read</span>
          </div>
        </div>
      </header>

      {/* body */}
      <div className="mx-auto max-w-3xl px-5 py-14 sm:px-8">
        <MarkdownBody>{article.body}</MarkdownBody>

        {/* disclaimer */}
        <div className="mt-14 rounded-xl border border-line bg-surface px-5 py-4 text-sm text-fg-faint">
          Educational content only. Nothing here is medical advice — consult a
          qualified professional before acting on it.
        </div>

        <div className="mt-10 flex justify-between border-t border-line pt-8">
          <Link
            href="/articles"
            className="text-sm font-semibold text-fg-dim hover:text-fg"
          >
            ← All articles
          </Link>
          <Link
            href={`/topics/${topic.slug}`}
            className="text-sm font-semibold hover:opacity-80"
            style={{ color: topic.color }}
          >
            More on {topic.name} →
          </Link>
        </div>
      </div>

      {/* related */}
      {related.length > 0 && (
        <section className="mx-auto max-w-6xl px-5 pb-12 sm:px-8">
          <p className="eyebrow text-fg-faint">Keep going</p>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {related.map((a) => (
              <ArticleCard key={a.id} article={a} />
            ))}
          </div>
        </section>
      )}
    </article>
  );
}

import Link from "next/link";
import type { Article } from "@/lib/articles";
import { topicOf } from "@/lib/topics";
import { formatDate } from "@/lib/format";

export function ArticleCard({
  article,
  index,
  size = "default",
}: {
  article: Article;
  index?: number;
  size?: "default" | "large";
}) {
  const topic = topicOf(article.topic);
  const large = size === "large";

  return (
    <Link
      href={`/articles/${article.slug}`}
      className="trans group relative flex h-full flex-col bg-ink-2 hover:bg-surface"
      style={{ ["--dh" as string]: topic.color }}
    >
      {/* left spine that fills in on hover */}
      <span className="absolute left-0 top-0 h-full w-[3px] scale-y-0 bg-[var(--dh)] transition-transform duration-300 [transform-origin:top] group-hover:scale-y-100" />

      {/* meta bar */}
      <div className="flex items-center justify-between border-b border-line-soft px-5 py-3">
        <span className="flex items-center gap-2">
          <span
            className="inline-block h-2 w-2"
            style={{ background: topic.color }}
          />
          <span className="eyebrow text-fg-dim">{topic.name}</span>
        </span>
        <span className="eyebrow text-fg-faint">
          {typeof index === "number"
            ? String(index).padStart(2, "0")
            : `${article.read_minutes} min`}
        </span>
      </div>

      {/* title */}
      <div className={`flex flex-1 flex-col px-5 ${large ? "py-7" : "py-6"}`}>
        <h3
          className={`font-head font-bold tracking-[-0.02em] text-fg transition-colors group-hover:text-[var(--dh)] ${
            large
              ? "text-3xl leading-[1.05] sm:text-[2.7rem] sm:leading-[1]"
              : "text-[1.4rem] leading-[1.12] sm:text-[1.55rem]"
          }`}
        >
          {article.title}
        </h3>

        <p
          className={`mt-4 text-fg-dim ${
            large
              ? "text-base leading-relaxed"
              : "text-sm leading-relaxed line-clamp-3"
          }`}
        >
          {article.excerpt}
        </p>

        <div className="mt-auto flex items-center justify-between pt-6">
          <span className="eyebrow text-fg-faint">
            {article.author} · {formatDate(article.created_at)}
          </span>
          <span
            className="trans inline-flex h-8 w-8 items-center justify-center border border-line text-fg-dim group-hover:border-[var(--dh)] group-hover:bg-[var(--dh)] group-hover:text-ink"
            aria-hidden
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path
                d="M3 7h8M7.5 3.5 11 7l-3.5 3.5"
                stroke="currentColor"
                strokeWidth="1.7"
                strokeLinecap="square"
              />
            </svg>
          </span>
        </div>
      </div>
    </Link>
  );
}

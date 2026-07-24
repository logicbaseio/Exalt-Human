import Link from "next/link";
import type { Article } from "@/lib/articles";
import { topicOf } from "@/lib/topics";
import { formatDate } from "@/lib/format";

export function ArticleCard({
  article,
  size = "default",
}: {
  article: Article;
  size?: "default" | "large";
}) {
  const topic = topicOf(article.topic);
  const large = size === "large";

  return (
    <Link
      href={`/articles/${article.slug}`}
      className="lift group relative flex flex-col overflow-hidden rounded-2xl border border-line bg-surface p-6 hover:border-white/20 hover:bg-surface-2"
    >
      {/* domain accent bar */}
      <span
        className="absolute inset-x-0 top-0 h-0.5 origin-left scale-x-0 transition-transform duration-300 group-hover:scale-x-100"
        style={{ background: topic.color }}
      />

      <div className="mb-4 flex items-center gap-2.5">
        <span
          className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide"
          style={{ color: topic.color, background: topic.tint }}
        >
          {topic.name}
        </span>
        <span className="eyebrow text-fg-faint">
          {article.read_minutes} min
        </span>
      </div>

      <h3
        className={`font-extrabold tracking-tight text-fg transition-colors ${
          large ? "text-2xl leading-tight sm:text-3xl" : "text-xl leading-snug"
        }`}
      >
        {article.title}
      </h3>

      <p
        className={`mt-3 text-fg-dim ${
          large ? "text-base leading-relaxed" : "text-sm leading-relaxed"
        } ${large ? "line-clamp-3" : "line-clamp-2"}`}
      >
        {article.excerpt}
      </p>

      <div className="mt-5 flex items-center gap-2 pt-1 text-xs text-fg-faint">
        <span>{article.author}</span>
        <span aria-hidden>·</span>
        <span>{formatDate(article.created_at)}</span>
        <span
          className="ml-auto inline-flex translate-x-0 items-center gap-1 font-semibold text-fg-dim transition-all group-hover:translate-x-0.5 group-hover:text-fg"
          aria-hidden
        >
          Read
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path
              d="M3 7h8M7.5 3.5 11 7l-3.5 3.5"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
      </div>
    </Link>
  );
}

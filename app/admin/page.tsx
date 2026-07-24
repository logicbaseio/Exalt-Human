import Link from "next/link";
import type { Metadata } from "next";
import { requireAuth } from "@/lib/auth";
import { getAllArticles } from "@/lib/articles";
import { hasDb } from "@/lib/db";
import { topicOf } from "@/lib/topics";
import { formatDate } from "@/lib/format";
import { DeleteButton } from "@/components/admin/delete-button";

export const metadata: Metadata = { title: "Studio" };

export default async function AdminDashboard() {
  await requireAuth();
  const articles = await getAllArticles();
  const dbConnected = hasDb();

  return (
    <div className="mx-auto max-w-5xl px-5 py-12 sm:px-8">
      <div className="flex items-end justify-between gap-4">
        <div>
          <p className="eyebrow text-fg-faint">Studio</p>
          <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-fg">
            Articles
          </h1>
        </div>
        <Link
          href="/admin/new"
          className="inline-flex items-center gap-2 rounded-full bg-volt px-4 py-2.5 text-sm font-semibold text-ink transition-transform hover:scale-[1.03]"
        >
          + New article
        </Link>
      </div>

      {!dbConnected && (
        <div className="mt-6 rounded-xl border border-elevate/30 bg-elevate/10 px-4 py-3 text-sm text-elevate">
          <strong className="font-semibold">Read-only preview.</strong> No
          database is connected, so you are seeing seed content and cannot save
          changes yet. Add <code className="font-mono">DATABASE_URL</code> (Vercel
          → Neon integration, or <code className="font-mono">.env.local</code>) to
          start publishing.
        </div>
      )}

      <div className="mt-8 overflow-hidden rounded-2xl border border-line">
        {articles.length === 0 ? (
          <div className="p-12 text-center text-fg-dim">
            No articles yet.{" "}
            <Link href="/admin/new" className="text-volt hover:underline">
              Write your first one →
            </Link>
          </div>
        ) : (
          <ul className="divide-y divide-line">
            {articles.map((a) => {
              const topic = topicOf(a.topic);
              return (
                <li
                  key={a.id}
                  className="flex flex-col gap-3 bg-surface px-5 py-4 transition-colors hover:bg-surface-2 sm:flex-row sm:items-center"
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span
                        className="inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide"
                        style={{ color: topic.color, background: topic.tint }}
                      >
                        {topic.name}
                      </span>
                      {a.published ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-medium text-health">
                          <span className="h-1.5 w-1.5 rounded-full bg-health" />
                          Published
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[11px] font-medium text-fg-faint">
                          <span className="h-1.5 w-1.5 rounded-full bg-fg-faint" />
                          Draft
                        </span>
                      )}
                      {a.featured && (
                        <span className="text-[11px] font-medium text-volt">
                          ★ Featured
                        </span>
                      )}
                    </div>
                    <h3 className="mt-1.5 truncate font-semibold text-fg">
                      {a.title}
                    </h3>
                    <p className="mt-0.5 font-mono text-xs text-fg-faint">
                      /{a.slug} · {formatDate(a.updated_at)}
                    </p>
                  </div>

                  <div className="flex shrink-0 items-center gap-2">
                    <Link
                      href={`/articles/${a.slug}`}
                      className="rounded-lg border border-line px-3 py-1.5 text-xs font-medium text-fg-dim hover:text-fg"
                    >
                      View
                    </Link>
                    <Link
                      href={`/admin/edit/${a.id}`}
                      className="rounded-lg border border-line px-3 py-1.5 text-xs font-medium text-fg hover:border-white/30"
                    >
                      Edit
                    </Link>
                    <DeleteButton id={a.id} title={a.title} />
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}

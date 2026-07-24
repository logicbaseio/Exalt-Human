"use client";

import { useActionState, useState } from "react";
import Link from "next/link";
import { saveArticleAction, type FormState } from "@/app/admin/actions";
import { MarkdownBody } from "@/components/markdown";
import { TOPICS } from "@/lib/topics";
import type { Article } from "@/lib/articles";

const initial: FormState = {};

function autoSlug(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/['"]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

export function ArticleForm({ article }: { article?: Article }) {
  const [state, formAction, pending] = useActionState(
    saveArticleAction,
    initial,
  );

  const [title, setTitle] = useState(article?.title ?? "");
  const [slug, setSlug] = useState(article?.slug ?? "");
  const [slugEdited, setSlugEdited] = useState(!!article);
  const [body, setBody] = useState(article?.body ?? "");
  const [tab, setTab] = useState<"write" | "preview">("write");

  return (
    <form action={formAction} className="space-y-6">
      {article && <input type="hidden" name="id" value={article.id} />}

      {state.error && (
        <p className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
          {state.error}
        </p>
      )}

      {/* title */}
      <div>
        <label htmlFor="title" className="eyebrow text-fg-faint">
          Title
        </label>
        <input
          id="title"
          name="title"
          value={title}
          onChange={(e) => {
            setTitle(e.target.value);
            if (!slugEdited) setSlug(autoSlug(e.target.value));
          }}
          required
          placeholder="Your Muscles Are Listening Right Now"
          className="mt-2 w-full rounded-lg border border-line bg-ink px-3.5 py-3 text-lg font-semibold text-fg outline-none transition-colors focus:border-volt"
        />
      </div>

      {/* slug + topic */}
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="slug" className="eyebrow text-fg-faint">
            Slug
          </label>
          <input
            id="slug"
            name="slug"
            value={slug}
            onChange={(e) => {
              setSlug(e.target.value);
              setSlugEdited(true);
            }}
            required
            className="mt-2 w-full rounded-lg border border-line bg-ink px-3.5 py-2.5 font-mono text-sm text-fg outline-none transition-colors focus:border-volt"
          />
          <p className="mt-1.5 font-mono text-xs text-fg-faint">
            /articles/{slug || "…"}
          </p>
        </div>
        <div>
          <label htmlFor="topic" className="eyebrow text-fg-faint">
            Domain
          </label>
          <select
            id="topic"
            name="topic"
            defaultValue={article?.topic ?? "body"}
            className="mt-2 w-full appearance-none rounded-lg border border-line bg-ink px-3.5 py-2.5 text-sm text-fg outline-none transition-colors focus:border-volt"
          >
            {TOPICS.map((t) => (
              <option key={t.slug} value={t.slug} className="bg-ink">
                {t.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* excerpt */}
      <div>
        <label htmlFor="excerpt" className="eyebrow text-fg-faint">
          Excerpt
        </label>
        <textarea
          id="excerpt"
          name="excerpt"
          defaultValue={article?.excerpt ?? ""}
          rows={2}
          placeholder="One or two sentences that hook the reader and summarize the piece."
          className="mt-2 w-full resize-y rounded-lg border border-line bg-ink px-3.5 py-2.5 text-sm text-fg outline-none transition-colors focus:border-volt"
        />
      </div>

      {/* body with write/preview tabs */}
      <div>
        <div className="flex items-center justify-between">
          <label htmlFor="body" className="eyebrow text-fg-faint">
            Body (Markdown)
          </label>
          <div className="flex gap-1 rounded-full border border-line p-0.5">
            {(["write", "preview"] as const).map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setTab(t)}
                className={`rounded-full px-3 py-1 text-xs font-medium capitalize transition-colors ${
                  tab === t
                    ? "bg-surface-2 text-fg"
                    : "text-fg-dim hover:text-fg"
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* keep textarea mounted so it always submits; hide when previewing */}
        <div className={tab === "write" ? "mt-2" : "mt-2 hidden"}>
          <textarea
            id="body"
            name="body"
            value={body}
            onChange={(e) => setBody(e.target.value)}
            required
            rows={20}
            placeholder={"## A heading\n\nWrite your article in Markdown. Use **bold**, lists, > blockquotes, and [links](https://…)."}
            className="w-full resize-y rounded-lg border border-line bg-ink px-3.5 py-3 font-mono text-sm leading-relaxed text-fg outline-none transition-colors focus:border-volt"
          />
        </div>
        {tab === "preview" && (
          <div className="mt-2 min-h-[20rem] rounded-lg border border-line bg-surface px-6 py-6">
            {body.trim() ? (
              <MarkdownBody>{body}</MarkdownBody>
            ) : (
              <p className="text-sm text-fg-faint">Nothing to preview yet.</p>
            )}
          </div>
        )}
      </div>

      {/* author + toggles */}
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="author" className="eyebrow text-fg-faint">
            Author
          </label>
          <input
            id="author"
            name="author"
            defaultValue={article?.author ?? "Exalt Human"}
            className="mt-2 w-full rounded-lg border border-line bg-ink px-3.5 py-2.5 text-sm text-fg outline-none transition-colors focus:border-volt"
          />
        </div>
        <div className="flex items-end gap-6 pb-1">
          <Toggle
            name="published"
            label="Published"
            defaultChecked={article?.published ?? false}
          />
          <Toggle
            name="featured"
            label="Featured"
            defaultChecked={article?.featured ?? false}
          />
        </div>
      </div>

      <div className="flex items-center gap-3 border-t border-line pt-6">
        <button
          type="submit"
          disabled={pending}
          className="inline-flex items-center gap-2 rounded-full bg-volt px-6 py-2.5 text-sm font-semibold text-ink transition-transform hover:scale-[1.03] disabled:opacity-60"
        >
          {pending ? "Saving…" : article ? "Save changes" : "Create article"}
        </button>
        <Link
          href="/admin"
          className="rounded-full border border-line px-5 py-2.5 text-sm font-medium text-fg-dim hover:text-fg"
        >
          Cancel
        </Link>
      </div>
    </form>
  );
}

function Toggle({
  name,
  label,
  defaultChecked,
}: {
  name: string;
  label: string;
  defaultChecked: boolean;
}) {
  return (
    <label className="flex cursor-pointer items-center gap-2.5 text-sm font-medium text-fg">
      <input
        type="checkbox"
        name={name}
        defaultChecked={defaultChecked}
        className="peer sr-only"
      />
      <span className="relative h-5 w-9 rounded-full bg-line transition-colors peer-checked:bg-volt">
        <span className="absolute left-0.5 top-0.5 h-4 w-4 rounded-full bg-fg transition-transform peer-checked:translate-x-4 peer-checked:bg-ink" />
      </span>
      {label}
    </label>
  );
}

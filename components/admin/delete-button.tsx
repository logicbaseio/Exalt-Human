"use client";

import { deleteArticleAction } from "@/app/admin/actions";

export function DeleteButton({ id, title }: { id: string; title: string }) {
  return (
    <form
      action={deleteArticleAction}
      onSubmit={(e) => {
        if (!confirm(`Delete "${title}"? This cannot be undone.`)) {
          e.preventDefault();
        }
      }}
    >
      <input type="hidden" name="id" value={id} />
      <button
        type="submit"
        className="rounded-lg border border-line px-3 py-1.5 text-xs font-medium text-red-300/80 hover:border-red-500/40 hover:text-red-300"
      >
        Delete
      </button>
    </form>
  );
}

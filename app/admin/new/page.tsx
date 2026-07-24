import type { Metadata } from "next";
import { requireAuth } from "@/lib/auth";
import { ArticleForm } from "@/components/admin/article-form";

export const metadata: Metadata = { title: "New article" };

export default async function NewArticlePage() {
  await requireAuth();

  return (
    <div className="mx-auto max-w-3xl px-5 py-12 sm:px-8">
      <p className="eyebrow text-fg-faint">Studio</p>
      <h1 className="mt-2 mb-8 text-3xl font-extrabold tracking-tight text-fg">
        New article
      </h1>
      <ArticleForm />
    </div>
  );
}

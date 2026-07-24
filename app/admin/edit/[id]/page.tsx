import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { requireAuth } from "@/lib/auth";
import { getArticleById } from "@/lib/articles";
import { ArticleForm } from "@/components/admin/article-form";

export const metadata: Metadata = { title: "Edit article" };

export default async function EditArticlePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireAuth();
  const { id } = await params;
  const article = await getArticleById(id);
  if (!article) notFound();

  return (
    <div className="mx-auto max-w-3xl px-5 py-12 sm:px-8">
      <p className="eyebrow text-fg-faint">Studio</p>
      <h1 className="mt-2 mb-8 text-3xl font-extrabold tracking-tight text-fg">
        Edit article
      </h1>
      <ArticleForm article={article} />
    </div>
  );
}

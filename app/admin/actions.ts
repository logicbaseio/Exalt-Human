"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import {
  checkCredentials,
  createSession,
  destroySession,
  requireAuth,
} from "@/lib/auth";
import {
  createArticle,
  updateArticle,
  deleteArticle,
  slugExists,
  slugify,
  type ArticleInput,
} from "@/lib/articles";
import { TOPIC_SLUGS, type TopicSlug } from "@/lib/topics";
import { hasDb } from "@/lib/db";

export interface FormState {
  error?: string;
}

/* --------------------------------- auth ---------------------------------- */

export async function loginAction(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  const email = String(formData.get("email") ?? "");
  const password = String(formData.get("password") ?? "");

  if (!email || !password) {
    return { error: "Email and password are required." };
  }
  if (!checkCredentials(email, password)) {
    return { error: "Invalid credentials." };
  }
  await createSession(email);
  redirect("/admin");
}

export async function logoutAction(): Promise<void> {
  await destroySession();
  redirect("/admin/login");
}

/* ------------------------------- articles -------------------------------- */

function readArticleForm(formData: FormData): ArticleInput {
  const title = String(formData.get("title") ?? "").trim();
  const rawSlug = String(formData.get("slug") ?? "").trim();
  const excerpt = String(formData.get("excerpt") ?? "").trim();
  const body = String(formData.get("body") ?? "").trim();
  const topicRaw = String(formData.get("topic") ?? "body");
  const author = String(formData.get("author") ?? "Exalt Human").trim();
  const published = formData.get("published") === "on";
  const featured = formData.get("featured") === "on";

  const topic: TopicSlug = (TOPIC_SLUGS as string[]).includes(topicRaw)
    ? (topicRaw as TopicSlug)
    : "body";

  return {
    title,
    slug: slugify(rawSlug || title),
    excerpt,
    body,
    topic,
    author: author || "Exalt Human",
    published,
    featured,
  };
}

export async function saveArticleAction(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  await requireAuth();

  if (!hasDb()) {
    return {
      error:
        "No database connected. Add DATABASE_URL (Vercel → Neon integration, or .env.local) to save articles.",
    };
  }

  const id = String(formData.get("id") ?? "").trim();
  const input = readArticleForm(formData);

  if (!input.title) return { error: "Title is required." };
  if (!input.slug) return { error: "A valid slug is required." };
  if (!input.body) return { error: "Body content is required." };

  if (await slugExists(input.slug, id || undefined)) {
    return { error: `The slug "${input.slug}" is already in use.` };
  }

  if (id) {
    await updateArticle(id, input);
  } else {
    await createArticle(input);
  }

  revalidatePath("/", "layout");
  redirect("/admin");
}

export async function deleteArticleAction(formData: FormData): Promise<void> {
  await requireAuth();
  const id = String(formData.get("id") ?? "").trim();
  if (id && hasDb()) {
    await deleteArticle(id);
    revalidatePath("/", "layout");
  }
  redirect("/admin");
}

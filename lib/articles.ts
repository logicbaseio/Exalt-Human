import { hasDb, requireDb } from "@/lib/db";
import { SEED_ARTICLES } from "@/lib/content/seed";
import type { TopicSlug } from "@/lib/topics";

export interface Article {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  body: string; // markdown
  topic: TopicSlug;
  author: string;
  published: boolean;
  featured: boolean;
  read_minutes: number;
  created_at: string; // ISO
  updated_at: string; // ISO
}

export interface ArticleInput {
  title: string;
  slug: string;
  excerpt: string;
  body: string;
  topic: TopicSlug;
  author: string;
  published: boolean;
  featured: boolean;
}

/* -------------------------------------------------------------------------- */
/* helpers                                                                    */
/* -------------------------------------------------------------------------- */

/** ~200 wpm reading estimate, floored at 1. */
export function estimateReadMinutes(markdown: string): number {
  const words = markdown.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}

export function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/['"]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

/* eslint-disable @typescript-eslint/no-explicit-any */
function mapRow(r: any): Article {
  return {
    id: String(r.id),
    slug: r.slug,
    title: r.title,
    excerpt: r.excerpt ?? "",
    body: r.body ?? "",
    topic: r.topic,
    author: r.author ?? "Exalt Human",
    published: !!r.published,
    featured: !!r.featured,
    read_minutes: r.read_minutes ?? estimateReadMinutes(r.body ?? ""),
    created_at:
      r.created_at instanceof Date ? r.created_at.toISOString() : r.created_at,
    updated_at:
      r.updated_at instanceof Date ? r.updated_at.toISOString() : r.updated_at,
  };
}
/* eslint-enable @typescript-eslint/no-explicit-any */

function seedSortedPublished(): Article[] {
  return [...SEED_ARTICLES]
    .filter((a) => a.published)
    .sort((a, b) => b.created_at.localeCompare(a.created_at));
}

/* -------------------------------------------------------------------------- */
/* public reads                                                               */
/* -------------------------------------------------------------------------- */

export async function getPublishedArticles(opts?: {
  topic?: TopicSlug;
  limit?: number;
  excludeSlug?: string;
}): Promise<Article[]> {
  const { topic, limit, excludeSlug } = opts ?? {};

  if (!hasDb()) {
    let rows = seedSortedPublished();
    if (topic) rows = rows.filter((a) => a.topic === topic);
    if (excludeSlug) rows = rows.filter((a) => a.slug !== excludeSlug);
    if (limit) rows = rows.slice(0, limit);
    return rows;
  }

  const db = requireDb();
  const rows = await db`
    SELECT * FROM articles
    WHERE published = true
      AND (${topic ?? null}::text IS NULL OR topic = ${topic ?? null})
      AND (${excludeSlug ?? null}::text IS NULL OR slug <> ${excludeSlug ?? null})
    ORDER BY created_at DESC
    LIMIT ${limit ?? 100}
  `;
  return rows.map(mapRow);
}

export async function getFeaturedArticles(limit = 3): Promise<Article[]> {
  if (!hasDb()) {
    const feat = seedSortedPublished().filter((a) => a.featured);
    return (feat.length ? feat : seedSortedPublished()).slice(0, limit);
  }
  const db = requireDb();
  const rows = await db`
    SELECT * FROM articles
    WHERE published = true AND featured = true
    ORDER BY created_at DESC
    LIMIT ${limit}
  `;
  if (rows.length) return rows.map(mapRow);
  // fall back to latest if nothing is flagged featured
  return getPublishedArticles({ limit });
}

export async function getArticleBySlug(slug: string): Promise<Article | null> {
  if (!hasDb()) {
    return SEED_ARTICLES.find((a) => a.slug === slug && a.published) ?? null;
  }
  const db = requireDb();
  const rows = await db`
    SELECT * FROM articles WHERE slug = ${slug} AND published = true LIMIT 1
  `;
  return rows.length ? mapRow(rows[0]) : null;
}

export async function countByTopic(): Promise<Record<string, number>> {
  if (!hasDb()) {
    return seedSortedPublished().reduce<Record<string, number>>((acc, a) => {
      acc[a.topic] = (acc[a.topic] ?? 0) + 1;
      return acc;
    }, {});
  }
  const db = requireDb();
  const rows = await db`
    SELECT topic, COUNT(*)::int AS n FROM articles
    WHERE published = true GROUP BY topic
  `;
  return rows.reduce<Record<string, number>>((acc, r) => {
    acc[r.topic] = r.n;
    return acc;
  }, {});
}

/* -------------------------------------------------------------------------- */
/* admin reads                                                                */
/* -------------------------------------------------------------------------- */

export async function getAllArticles(): Promise<Article[]> {
  if (!hasDb()) {
    return [...SEED_ARTICLES].sort((a, b) =>
      b.created_at.localeCompare(a.created_at),
    );
  }
  const db = requireDb();
  const rows = await db`SELECT * FROM articles ORDER BY updated_at DESC`;
  return rows.map(mapRow);
}

export async function getArticleById(id: string): Promise<Article | null> {
  if (!hasDb()) {
    return SEED_ARTICLES.find((a) => a.id === id) ?? null;
  }
  const db = requireDb();
  const rows = await db`SELECT * FROM articles WHERE id = ${id} LIMIT 1`;
  return rows.length ? mapRow(rows[0]) : null;
}

/* -------------------------------------------------------------------------- */
/* writes (require a database)                                                */
/* -------------------------------------------------------------------------- */

export async function createArticle(input: ArticleInput): Promise<Article> {
  const db = requireDb();
  const read = estimateReadMinutes(input.body);
  const rows = await db`
    INSERT INTO articles
      (slug, title, excerpt, body, topic, author, published, featured, read_minutes)
    VALUES
      (${input.slug}, ${input.title}, ${input.excerpt}, ${input.body},
       ${input.topic}, ${input.author}, ${input.published}, ${input.featured}, ${read})
    RETURNING *
  `;
  return mapRow(rows[0]);
}

export async function updateArticle(
  id: string,
  input: ArticleInput,
): Promise<Article> {
  const db = requireDb();
  const read = estimateReadMinutes(input.body);
  const rows = await db`
    UPDATE articles SET
      slug = ${input.slug},
      title = ${input.title},
      excerpt = ${input.excerpt},
      body = ${input.body},
      topic = ${input.topic},
      author = ${input.author},
      published = ${input.published},
      featured = ${input.featured},
      read_minutes = ${read},
      updated_at = now()
    WHERE id = ${id}
    RETURNING *
  `;
  return mapRow(rows[0]);
}

export async function deleteArticle(id: string): Promise<void> {
  const db = requireDb();
  await db`DELETE FROM articles WHERE id = ${id}`;
}

export async function slugExists(
  slug: string,
  exceptId?: string,
): Promise<boolean> {
  if (!hasDb()) return SEED_ARTICLES.some((a) => a.slug === slug);
  const db = requireDb();
  const rows = await db`
    SELECT 1 FROM articles
    WHERE slug = ${slug} AND (${exceptId ?? null}::text IS NULL OR id::text <> ${exceptId ?? null})
    LIMIT 1
  `;
  return rows.length > 0;
}

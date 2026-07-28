import "server-only";
import { getSql } from "@/db";
import {
  researchArticles,
  type ResearchArticle,
} from "@/app/articles/article-data";

/**
 * The content engine. A single `content_items` table backs both the public
 * site (status = 'live') and the Exalt Space pipeline board (every status).
 *
 * When no database is configured, public reads fall back to the bundled seed
 * articles so the site keeps working; writes require a database.
 */

export type ContentStatus = "idea" | "drafting" | "review" | "scheduled" | "live";
export type Series = "hijack" | "upgrade" | "future" | "desk";

export const SERIES_LABEL: Record<Series, string> = {
  hijack: "Human Hijack",
  upgrade: "Human Upgrade",
  future: "Human Future",
  desk: "Research Desk",
};

/** Lightweight card for the pipeline board. */
export interface PipelineCard {
  id: string;
  status: ContentStatus;
  series: Series;
  pillar: string;
  title: string;
  deck: string;
  note: string;
  source: string;
  slug: string;
  scheduledFor: string | null;
  updatedAt: string;
}

export function hasDb(): boolean {
  return Boolean(process.env.POSTGRES_URL ?? process.env.DATABASE_URL);
}

/* eslint-disable @typescript-eslint/no-explicit-any */

async function ensureSchema(sql: any) {
  await sql`
    CREATE TABLE IF NOT EXISTS content_items (
      id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      slug text UNIQUE NOT NULL,
      status text NOT NULL DEFAULT 'idea',
      series text NOT NULL DEFAULT 'desk',
      pillar text NOT NULL DEFAULT '',
      system text NOT NULL DEFAULT '',
      title text NOT NULL,
      deck text NOT NULL DEFAULT '',
      read_time text NOT NULL DEFAULT '',
      byline text NOT NULL DEFAULT 'Exalt Human Research Desk',
      image text NOT NULL DEFAULT '/human-atlas.jpg',
      image_alt text NOT NULL DEFAULT '',
      image_caption text NOT NULL DEFAULT '',
      image_w integer NOT NULL DEFAULT 1200,
      image_h integer NOT NULL DEFAULT 800,
      note text NOT NULL DEFAULT '',
      source_hint text NOT NULL DEFAULT '',
      published_label text NOT NULL DEFAULT '',
      reviewed_label text NOT NULL DEFAULT '',
      sections jsonb NOT NULL DEFAULT '[]'::jsonb,
      takeaways jsonb NOT NULL DEFAULT '[]'::jsonb,
      refs jsonb NOT NULL DEFAULT '[]'::jsonb,
      scheduled_for timestamptz,
      published_at timestamptz,
      created_at timestamptz NOT NULL DEFAULT now(),
      updated_at timestamptz NOT NULL DEFAULT now()
    )
  `;
  await sql`CREATE INDEX IF NOT EXISTS content_status_idx ON content_items (status)`;
  await maybeSeed(sql);
}

// Seed the starter articles as 'live' once, when a fresh DB is first used.
let seedChecked = false;
async function maybeSeed(sql: any) {
  if (seedChecked) return;
  seedChecked = true;
  try {
    const rows = await sql`SELECT COUNT(*)::int AS n FROM content_items`;
    if ((rows[0]?.n ?? 0) > 0) return;
    for (const a of researchArticles) {
      const series = seriesFromSystem(a.system);
      const pillar = a.system.split("·").slice(-1)[0]?.trim() ?? "";
      await sql`
        INSERT INTO content_items
          (slug, status, series, pillar, system, title, deck, read_time, byline,
           image, image_alt, image_caption, image_w, image_h,
           published_label, reviewed_label, sections, takeaways, refs, published_at)
        VALUES
          (${a.slug}, 'live', ${series}, ${pillar}, ${a.system}, ${a.title}, ${a.deck},
           ${a.time}, ${a.byline}, ${a.image}, ${a.alt}, ${a.caption}, ${a.width}, ${a.height},
           ${a.published}, ${a.reviewed},
           ${JSON.stringify(a.sections)}::jsonb, ${JSON.stringify(a.takeaways)}::jsonb,
           ${JSON.stringify(a.references)}::jsonb, now())
        ON CONFLICT (slug) DO NOTHING
      `;
    }
  } catch {
    /* seeding is best-effort */
  }
}

function iso(v: any): string {
  return v instanceof Date ? v.toISOString() : String(v ?? "");
}

/** DB row -> the ResearchArticle shape the public pages render. */
function rowToArticle(r: any): ResearchArticle {
  const series = (r.series as Series) || "desk";
  const system =
    r.system && r.system.length
      ? r.system
      : [SERIES_LABEL[series], r.pillar].filter(Boolean).join(" · ");
  return {
    slug: r.slug,
    system,
    title: r.title,
    deck: r.deck ?? "",
    time: r.read_time || "8 min read",
    published: r.published_label || "",
    reviewed: r.reviewed_label || r.published_label || "",
    byline: r.byline || "Exalt Human Research Desk",
    image: r.image || "/human-atlas.jpg",
    width: r.image_w ?? 1200,
    height: r.image_h ?? 800,
    alt: r.image_alt ?? "",
    caption: r.image_caption ?? "",
    sections: Array.isArray(r.sections) ? r.sections : [],
    takeaways: Array.isArray(r.takeaways) ? r.takeaways : [],
    references: Array.isArray(r.refs) ? r.refs : [],
  };
}

function rowToCard(r: any): PipelineCard {
  return {
    id: String(r.id),
    status: r.status,
    series: (r.series as Series) || "desk",
    pillar: r.pillar ?? "",
    title: r.title,
    deck: r.deck ?? "",
    note: r.note ?? "",
    source: r.source_hint ?? "",
    slug: r.slug,
    scheduledFor: r.scheduled_for ? iso(r.scheduled_for) : null,
    updatedAt: iso(r.updated_at),
  };
}

/* -------------------------------------------------------- public reads --- */

export async function listLiveArticles(): Promise<ResearchArticle[]> {
  if (!hasDb()) return researchArticles;
  try {
    const sql: any = getSql();
    await ensureSchema(sql);
    const rows = await sql`
      SELECT * FROM content_items
      WHERE status = 'live'
      ORDER BY COALESCE(published_at, created_at) DESC
    `;
    return rows.length ? rows.map(rowToArticle) : researchArticles;
  } catch {
    return researchArticles;
  }
}

export async function getLiveArticle(slug: string): Promise<ResearchArticle | null> {
  if (!hasDb()) return researchArticles.find((a) => a.slug === slug) ?? null;
  try {
    const sql: any = getSql();
    await ensureSchema(sql);
    const rows = await sql`
      SELECT * FROM content_items WHERE slug = ${slug} AND status = 'live' LIMIT 1
    `;
    if (rows.length) return rowToArticle(rows[0]);
    return researchArticles.find((a) => a.slug === slug) ?? null;
  } catch {
    return researchArticles.find((a) => a.slug === slug) ?? null;
  }
}

/* ------------------------------------------------------ pipeline reads --- */

export async function listPipeline(): Promise<PipelineCard[]> {
  if (!hasDb()) {
    // no DB: show the seed articles as live cards so the board isn't empty
    return researchArticles.map((a, i) => ({
      id: `seed-${i}`,
      status: "live" as ContentStatus,
      series: seriesFromSystem(a.system),
      pillar: a.system.split("·").slice(-1)[0]?.trim() ?? "",
      title: a.title,
      deck: a.deck,
      note: "",
      source: "",
      slug: a.slug,
      scheduledFor: null,
      updatedAt: "",
    }));
  }
  const sql: any = getSql();
  await ensureSchema(sql);
  const rows = await sql`SELECT * FROM content_items ORDER BY updated_at DESC`;
  return rows.map(rowToCard);
}

export async function getItem(id: string): Promise<any | null> {
  if (!hasDb()) return null;
  const sql: any = getSql();
  await ensureSchema(sql);
  const rows = await sql`SELECT * FROM content_items WHERE id = ${id} LIMIT 1`;
  return rows[0] ?? null;
}

/* ------------------------------------------------------------- writes --- */

function requireDb() {
  if (!hasDb()) {
    throw new Error(
      "No database connected. Connect Neon (Vercel → Storage → Neon, or set DATABASE_URL) to save pipeline changes.",
    );
  }
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

async function uniqueSlug(sql: any, base: string): Promise<string> {
  let slug = base || "idea";
  let n = 1;
  // eslint-disable-next-line no-constant-condition
  while (true) {
    const rows = await sql`SELECT 1 FROM content_items WHERE slug = ${slug} LIMIT 1`;
    if (!rows.length) return slug;
    n += 1;
    slug = `${base}-${n}`;
  }
}

export async function createIdea(input: {
  title: string;
  series?: Series;
  pillar?: string;
  note?: string;
  source?: string;
}): Promise<PipelineCard> {
  requireDb();
  const sql: any = getSql();
  await ensureSchema(sql);
  const series = (input.series as Series) || "desk";
  const slug = await uniqueSlug(sql, slugify(input.title));
  const rows = await sql`
    INSERT INTO content_items (slug, status, series, pillar, title, note, source_hint)
    VALUES (${slug}, 'idea', ${series}, ${input.pillar ?? ""}, ${input.title},
            ${input.note ?? ""}, ${input.source ?? ""})
    RETURNING *
  `;
  return rowToCard(rows[0]);
}

export async function setStatus(
  id: string,
  status: ContentStatus,
  scheduledFor?: string | null,
): Promise<PipelineCard | null> {
  requireDb();
  const sql: any = getSql();
  await ensureSchema(sql);
  const publishedAt = status === "live" ? new Date() : null;
  const publishedLabel =
    status === "live"
      ? new Date().toLocaleDateString("en-US", { month: "long", year: "numeric" })
      : null;
  const rows = await sql`
    UPDATE content_items SET
      status = ${status},
      scheduled_for = ${scheduledFor ?? null},
      published_at = CASE WHEN ${status} = 'live' THEN COALESCE(published_at, ${publishedAt}) ELSE published_at END,
      published_label = CASE WHEN ${status} = 'live' AND (published_label = '' OR published_label IS NULL) THEN ${publishedLabel} ELSE published_label END,
      updated_at = now()
    WHERE id = ${id}
    RETURNING *
  `;
  return rows.length ? rowToCard(rows[0]) : null;
}

export async function deleteItem(id: string): Promise<void> {
  requireDb();
  const sql: any = getSql();
  await ensureSchema(sql);
  await sql`DELETE FROM content_items WHERE id = ${id}`;
}

/** Save a generated draft body onto an item and move it to review. */
export async function saveDraft(
  id: string,
  draft: {
    deck?: string;
    system?: string;
    pillar?: string;
    readTime?: string;
    image?: string;
    imageAlt?: string;
    imageCaption?: string;
    imageW?: number;
    imageH?: number;
    sections: unknown[];
    takeaways: unknown[];
    references: unknown[];
  },
): Promise<void> {
  requireDb();
  const sql: any = getSql();
  await ensureSchema(sql);
  await sql`
    UPDATE content_items SET
      status = 'review',
      deck = COALESCE(NULLIF(${draft.deck ?? ""}, ''), deck),
      system = COALESCE(NULLIF(${draft.system ?? ""}, ''), system),
      pillar = COALESCE(NULLIF(${draft.pillar ?? ""}, ''), pillar),
      read_time = COALESCE(NULLIF(${draft.readTime ?? ""}, ''), read_time),
      image = COALESCE(NULLIF(${draft.image ?? ""}, ''), image),
      image_alt = COALESCE(NULLIF(${draft.imageAlt ?? ""}, ''), image_alt),
      image_caption = COALESCE(NULLIF(${draft.imageCaption ?? ""}, ''), image_caption),
      image_w = ${draft.imageW ?? 1200},
      image_h = ${draft.imageH ?? 800},
      sections = ${JSON.stringify(draft.sections)}::jsonb,
      takeaways = ${JSON.stringify(draft.takeaways)}::jsonb,
      refs = ${JSON.stringify(draft.references)}::jsonb,
      reviewed_label = ${new Date().toLocaleDateString("en-US", { month: "long", year: "numeric" })},
      updated_at = now()
    WHERE id = ${id}
  `;
}

/** Publish any items whose scheduled_for has passed. Returns count. */
export async function publishDueScheduled(): Promise<number> {
  requireDb();
  const sql: any = getSql();
  await ensureSchema(sql);
  const rows = await sql`
    UPDATE content_items SET
      status = 'live',
      published_at = COALESCE(published_at, now()),
      published_label = CASE WHEN published_label = '' THEN ${new Date().toLocaleDateString("en-US", { month: "long", year: "numeric" })} ELSE published_label END,
      updated_at = now()
    WHERE status = 'scheduled' AND scheduled_for IS NOT NULL AND scheduled_for <= now()
    RETURNING id
  `;
  return rows.length;
}

/** The oldest idea, for the autonomous drafting loop. */
export async function nextIdeaToDraft(): Promise<any | null> {
  if (!hasDb()) return null;
  const sql: any = getSql();
  await ensureSchema(sql);
  const rows = await sql`
    SELECT * FROM content_items WHERE status = 'idea' ORDER BY created_at ASC LIMIT 1
  `;
  return rows[0] ?? null;
}

function seriesFromSystem(system: string): Series {
  const s = system.toLowerCase();
  if (s.includes("hijack")) return "hijack";
  if (s.includes("upgrade")) return "upgrade";
  if (s.includes("future")) return "future";
  return "desk";
}
/* eslint-enable @typescript-eslint/no-explicit-any */

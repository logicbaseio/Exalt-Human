#!/usr/bin/env node
/**
 * One-shot database setup for Exalt Human.
 *  - creates the `articles` table + indexes
 *  - seeds the starter articles (idempotent: ON CONFLICT DO NOTHING)
 *
 * Usage:
 *   node --env-file=.env.local scripts/setup-db.mjs
 *   # or, if DATABASE_URL is already exported:
 *   node scripts/setup-db.mjs
 */
import { neon } from "@neondatabase/serverless";
import { SEED_ARTICLES } from "../lib/content/seed-data.mjs";

const url = process.env.DATABASE_URL;
if (!url) {
  console.error(
    "\n  ✗ DATABASE_URL is not set.\n" +
      "    Run:  node --env-file=.env.local scripts/setup-db.mjs\n",
  );
  process.exit(1);
}

const sql = neon(url);

function readMinutes(body) {
  const words = String(body).trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}

async function main() {
  console.log("→ creating schema…");
  await sql`
    CREATE TABLE IF NOT EXISTS articles (
      id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      slug         text UNIQUE NOT NULL,
      title        text NOT NULL,
      excerpt      text NOT NULL DEFAULT '',
      body         text NOT NULL DEFAULT '',
      topic        text NOT NULL DEFAULT 'body',
      author       text NOT NULL DEFAULT 'Exalt Human',
      published    boolean NOT NULL DEFAULT false,
      featured     boolean NOT NULL DEFAULT false,
      read_minutes integer NOT NULL DEFAULT 1,
      created_at   timestamptz NOT NULL DEFAULT now(),
      updated_at   timestamptz NOT NULL DEFAULT now()
    )
  `;
  await sql`CREATE INDEX IF NOT EXISTS articles_topic_idx ON articles (topic)`;
  await sql`
    CREATE INDEX IF NOT EXISTS articles_published_created_idx
    ON articles (published, created_at DESC)
  `;

  console.log(`→ seeding ${SEED_ARTICLES.length} starter articles…`);
  let inserted = 0;
  for (const a of SEED_ARTICLES) {
    const rows = await sql`
      INSERT INTO articles
        (slug, title, excerpt, body, topic, author, published, featured, read_minutes, created_at)
      VALUES
        (${a.slug}, ${a.title}, ${a.excerpt}, ${a.body}, ${a.topic},
         ${a.author}, ${a.published}, ${a.featured}, ${readMinutes(a.body)}, ${a.created_at})
      ON CONFLICT (slug) DO NOTHING
      RETURNING id
    `;
    if (rows.length) inserted++;
  }

  console.log(
    `\n  ✓ Done. Inserted ${inserted} new article(s) (existing ones left untouched).\n`,
  );
}

main().catch((err) => {
  console.error("\n  ✗ Setup failed:", err.message, "\n");
  process.exit(1);
});

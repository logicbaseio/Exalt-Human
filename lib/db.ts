import { neon, type NeonQueryFunction } from "@neondatabase/serverless";

/**
 * Neon Postgres connection.
 *
 * DATABASE_URL is injected automatically by Vercel's Neon integration in
 * production. Locally, add it to `.env.local`. When it is absent the app falls
 * back to seed content (see lib/articles.ts) so the site still renders.
 */
const url = process.env.DATABASE_URL;

export const sql: NeonQueryFunction<false, false> | null = url
  ? neon(url)
  : null;

export function hasDb(): boolean {
  return sql !== null;
}

/** Throw a clear error for write paths that require a real database. */
export function requireDb(): NeonQueryFunction<false, false> {
  if (!sql) {
    throw new Error(
      "No database connected. Set DATABASE_URL in your environment (Vercel → Neon integration, or .env.local) to enable publishing.",
    );
  }
  return sql;
}

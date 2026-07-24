import type { Article } from "@/lib/articles";
import { SEED_ARTICLES as raw } from "./seed-data.mjs";

/**
 * Fallback content. Used ONLY when DATABASE_URL is not configured, so the site
 * is fully viewable in local dev before Neon is wired up. Once the database is
 * connected these are ignored and all content comes from Postgres.
 *
 * The canonical data lives in ./seed-data.mjs so the DB setup script
 * (scripts/setup-db.mjs) can seed a fresh Neon database from the same source.
 */
export const SEED_ARTICLES = raw as Article[];

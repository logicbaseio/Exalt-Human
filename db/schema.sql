-- Exalt Human — database schema (Neon / Postgres)
-- Run once against your Neon database, or use `npm run db:setup`.

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
);

CREATE INDEX IF NOT EXISTS articles_topic_idx
  ON articles (topic);

CREATE INDEX IF NOT EXISTS articles_published_created_idx
  ON articles (published, created_at DESC);

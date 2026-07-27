# Exalt Human

Exalt Human is an evidence-led education platform for understanding and
optimizing the human body, mind, psychology, and long-term health.

## Stack

- Next.js 16 and React 19
- GSAP for interaction and motion
- Neon Serverless Postgres
- Drizzle Kit for schema management
- Vercel for hosting and continuous deployment

## Local development

Use Node.js 22.13 or newer.

```bash
npm install
cp env.example .env.local
npm run dev
```

The newsletter endpoint requires either `POSTGRES_URL` or `DATABASE_URL`.
When the project is linked to Vercel, pull the provisioned Neon credentials:

```bash
vercel env pull .env.local --environment=development
```

## Database

Generate a migration after changing `db/schema.ts`:

```bash
npm run db:generate
```

Apply the schema using the linked Vercel production environment:

```bash
vercel env run --environment production -- npm run db:push
```

Database credentials are server-only and must never use a `NEXT_PUBLIC_`
prefix or be committed to Git.

## Verification

```bash
npm run lint
npm run build
```

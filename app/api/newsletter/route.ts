import { getSql } from "@/db";

export const runtime = "nodejs";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      email?: unknown;
      website?: unknown;
    };
    const email =
      typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
    const honeypot =
      typeof body.website === "string" ? body.website.trim() : "";

    if (honeypot) {
      return Response.json({ ok: true }, { status: 200 });
    }

    if (!email || email.length > 320 || !emailPattern.test(email)) {
      return Response.json(
        { error: "Enter a valid email address." },
        { status: 400 },
      );
    }

    const sql = getSql();

    await sql`
      CREATE TABLE IF NOT EXISTS newsletter_subscribers (
        id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
        email TEXT NOT NULL UNIQUE,
        source TEXT NOT NULL DEFAULT 'website',
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      )
    `;

    await sql`
      INSERT INTO newsletter_subscribers (email, source)
      VALUES (${email}, 'website')
      ON CONFLICT (email) DO NOTHING
    `;

    return Response.json({ ok: true }, { status: 201 });
  } catch (error) {
    console.error(
      "Newsletter subscription failed:",
      error instanceof Error ? error.message : error,
    );

    return Response.json(
      { error: "Unable to join right now. Please try again." },
      { status: 500 },
    );
  }
}

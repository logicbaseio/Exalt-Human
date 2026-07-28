/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { getSpaceSession } from "@/lib/space-auth";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const SYSTEM = `You are the Chief Research Editor for ExaltHuman, an evidence-based
human-optimization publication (body, mind, psychology, health, longevity, AI &
human health). You are talking to the team inside "Exalt Space", the editorial
mission-control console for the site.

Voice: an elite science editor. Optimistic, curious, evidence-first, plain-spoken.
Short paragraphs, no fluff, no hype. It is fine to be direct and opinionated.

What you do here:
- Discuss content strategy, the pipeline, scheduling, and which stories are worth
  covering. Use the live pipeline state provided below to answer accurately about
  what is live, in production, scheduled, or in the backlog.
- Help shape ideas: angles, hooks, what evidence a piece would need, why a story
  matters, how to score it (surprise, actionability, evidence strength, hype-risk).
- Take direction. If the user tells you to prioritize, add, or reshape something,
  acknowledge it clearly and say how you'd act on it in the workspace.

Rules:
- Never fabricate studies, statistics, citations, or URLs. If a claim would need a
  real source, say it needs verification rather than inventing one. Real drafting
  and source-checking happen in the workspace, not in this chat.
- Never promise cures or overstate findings. Distinguish established vs emerging
  evidence. Keep medical caution.
- Be concise: this is a chat console. Usually 1-4 short paragraphs. Use a compact
  bulleted list only when it genuinely helps.
- Do not include internal or system XML tags in your response.`;

export async function POST(request: Request) {
  const email = await getSpaceSession();
  if (!email) {
    return NextResponse.json({ error: "Your session expired. Refresh and sign in again." }, { status: 401 });
  }

  if (!process.env.ANTHROPIC_API_KEY) {
    return NextResponse.json(
      {
        error:
          "Live chat isn't configured yet. Add ANTHROPIC_API_KEY in the Vercel project's environment variables (and redeploy) to switch the editor on.",
      },
      { status: 200 },
    );
  }

  let body: any;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Bad request." }, { status: 400 });
  }

  const raw = Array.isArray(body?.messages) ? body.messages : [];
  const messages = raw
    .filter(
      (m: any) =>
        m && (m.role === "user" || m.role === "assistant") && typeof m.content === "string",
    )
    .slice(-20)
    .map((m: any) => ({ role: m.role as "user" | "assistant", content: String(m.content).slice(0, 4000) }));

  if (!messages.length || messages[0].role !== "user") {
    return NextResponse.json({ error: "Nothing to respond to yet." }, { status: 400 });
  }

  const pipeline = typeof body?.pipeline === "string" ? body.pipeline.slice(0, 6000) : "";
  const system = pipeline
    ? `${SYSTEM}\n\n# Current pipeline (live board state)\n${pipeline}`
    : SYSTEM;

  try {
    const client = new Anthropic();
    const resp = await client.messages.create({
      model: "claude-opus-5",
      max_tokens: 1024,
      system,
      messages,
    });
    const text = resp.content
      .filter((b: any) => b.type === "text")
      .map((b: any) => b.text)
      .join("")
      .trim();
    return NextResponse.json({ reply: text || "(no response)" });
  } catch (err: any) {
    const status = err?.status;
    const msg =
      status === 401
        ? "The configured ANTHROPIC_API_KEY was rejected. Check the key in Vercel."
        : status === 429
          ? "Rate limited by the model right now — try again in a moment."
          : "The editor hit an error reaching the model. Try again shortly.";
    return NextResponse.json({ error: msg }, { status: 200 });
  }
}

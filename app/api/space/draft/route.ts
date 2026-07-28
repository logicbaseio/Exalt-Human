/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { getSpaceSession } from "@/lib/space-auth";
import { getItem, saveDraft, setStatus, SERIES_LABEL, type Series } from "@/lib/content";
import { draftArticle } from "@/lib/draft";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 300; // drafting + web search is slow (Vercel Pro)

export async function POST(request: Request) {
  const email = await getSpaceSession();
  if (!email) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  if (!process.env.ANTHROPIC_API_KEY) {
    return NextResponse.json(
      { error: "Drafting needs ANTHROPIC_API_KEY set in the environment." },
      { status: 200 },
    );
  }

  let body: any;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Bad request." }, { status: 400 });
  }
  const id = String(body?.id ?? "");
  if (!id) return NextResponse.json({ error: "id required." }, { status: 400 });

  const item = await getItem(id);
  if (!item) return NextResponse.json({ error: "Not found." }, { status: 404 });

  try {
    await setStatus(id, "drafting");
    const client = new Anthropic();
    const draft = await draftArticle(client, {
      title: item.title,
      series: (item.series as Series) || "desk",
      seriesLabel: SERIES_LABEL[(item.series as Series) || "desk"],
      pillar: item.pillar || "",
      note: item.note || "",
      source: item.source_hint || "",
    });
    await saveDraft(id, draft);
    return NextResponse.json({ ok: true, status: "review" });
  } catch (e: any) {
    // roll the card back to idea so it can be retried
    try {
      await setStatus(id, "idea");
    } catch {}
    return NextResponse.json(
      { error: e?.message ?? "Drafting failed. The idea was returned to Planning." },
      { status: 200 },
    );
  }
}

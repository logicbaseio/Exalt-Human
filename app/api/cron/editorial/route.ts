/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import {
  publishDueScheduled,
  nextIdeaToDraft,
  saveDraft,
  setStatus,
  hasDb,
  SERIES_LABEL,
  type Series,
} from "@/lib/content";
import { draftArticle } from "@/lib/draft";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 300;

/**
 * The editorial heartbeat. Vercel Cron calls this on a schedule.
 *  1. Publish any scheduled item whose time has arrived (human already approved).
 *  2. Draft the next idea into `review` for a human to approve (autonomous, gated).
 * Guarded by CRON_SECRET so only the scheduler (or an authorized caller) can run it.
 */
export async function GET(request: Request) {
  const secret = process.env.CRON_SECRET;
  const auth = request.headers.get("authorization") ?? "";
  if (!secret || auth !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  if (!hasDb()) {
    return NextResponse.json({ error: "No database connected." }, { status: 200 });
  }

  const result: any = { published: 0, drafted: null };

  try {
    result.published = await publishDueScheduled();
  } catch (e: any) {
    result.publishError = e?.message ?? "publish failed";
  }

  // Autonomous drafting is optional — only if a key is set and drafting is enabled.
  const draftingEnabled = process.env.CRON_AUTODRAFT === "1" && !!process.env.ANTHROPIC_API_KEY;
  if (draftingEnabled) {
    try {
      const idea = await nextIdeaToDraft();
      if (idea) {
        await setStatus(idea.id, "drafting");
        const client = new Anthropic();
        const draft = await draftArticle(client, {
          title: idea.title,
          series: (idea.series as Series) || "desk",
          seriesLabel: SERIES_LABEL[(idea.series as Series) || "desk"],
          pillar: idea.pillar || "",
          note: idea.note || "",
          source: idea.source_hint || "",
        });
        await saveDraft(idea.id, draft);
        result.drafted = { id: idea.id, title: idea.title, status: "review" };
      }
    } catch (e: any) {
      result.draftError = e?.message ?? "draft failed";
    }
  }

  return NextResponse.json({ ok: true, ...result });
}

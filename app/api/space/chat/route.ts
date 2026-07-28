/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { getSpaceSession } from "@/lib/space-auth";
import {
  listPipeline,
  createIdea,
  setStatus,
  deleteItem,
  type Series,
  type ContentStatus,
} from "@/lib/content";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";
export const maxDuration = 60;

const SYSTEM = `You are the Chief Research Editor for ExaltHuman, an evidence-based
human-optimization publication (body, mind, psychology, health, longevity, AI &
human health). You run "Exalt Space", the editorial mission-control console.

The single goal: make ExaltHuman the most trusted place people come to optimize
their body and mind — evidence-first, actionable, no hype. Every decision serves
that.

You can DO things, not just talk. You have tools to read the pipeline and to add
ideas, schedule, publish, move, or remove items. When the user asks you to make a
change ("add a story on X", "schedule that for Friday", "publish it"), use the
tools to actually do it, then confirm plainly what you did. When they ask a
question, answer it. Use list_pipeline when you need the current, authoritative
board (with item ids) before acting.

Editorial judgment: balance the pillars (biology, neuroscience, longevity,
nutrition, fitness, psychology, optimization, AI-health) across the three series
(Human Hijack, Human Upgrade, Human Future). Score story ideas on surprise,
actionability, evidence strength, importance, and hype-risk. Prefer primary
sources. Never fabricate studies, statistics, citations, or URLs — real research
and drafting happen when a card is drafted, not in this chat.

Be concise: 1-4 short paragraphs. Keep medical caution; never promise cures.
Do not include internal or system XML tags in your response.`;

const TOOLS: any[] = [
  {
    name: "list_pipeline",
    description:
      "List every content item on the board with its id, title, status, series and pillar. Call this before scheduling/publishing/removing so you have the right id.",
    input_schema: { type: "object", properties: {}, additionalProperties: false },
  },
  {
    name: "add_idea",
    description: "Add a new content idea to the Planning column.",
    input_schema: {
      type: "object",
      properties: {
        title: { type: "string", description: "The story title/idea" },
        series: { type: "string", enum: ["hijack", "upgrade", "future", "desk"] },
        pillar: { type: "string", description: "e.g. Nutrition, Fitness, Neuroscience" },
        note: { type: "string", description: "angle or reasoning" },
        source: { type: "string", description: "anchor study or source hint" },
      },
      required: ["title"],
      additionalProperties: false,
    },
  },
  {
    name: "set_status",
    description:
      "Move an item to a new status. status='scheduled' with an ISO 'when' schedules it; status='live' publishes it now; other statuses move it between stages. Identify the item by id (preferred) or by title.",
    input_schema: {
      type: "object",
      properties: {
        id: { type: "string" },
        title: { type: "string" },
        status: { type: "string", enum: ["idea", "drafting", "review", "scheduled", "live"] },
        when: { type: "string", description: "ISO date-time for scheduling" },
      },
      required: ["status"],
      additionalProperties: false,
    },
  },
  {
    name: "remove_item",
    description: "Delete a content item, by id (preferred) or title.",
    input_schema: {
      type: "object",
      properties: { id: { type: "string" }, title: { type: "string" } },
      additionalProperties: false,
    },
  },
];

async function resolveId(idOrTitle: { id?: string; title?: string }): Promise<string | null> {
  if (idOrTitle.id) return idOrTitle.id;
  if (!idOrTitle.title) return null;
  const cards = await listPipeline();
  const t = idOrTitle.title.toLowerCase();
  const exact = cards.find((c) => c.title.toLowerCase() === t);
  if (exact) return exact.id;
  const partial = cards.find((c) => c.title.toLowerCase().includes(t));
  return partial ? partial.id : null;
}

async function runTool(name: string, input: any): Promise<string> {
  try {
    if (name === "list_pipeline") {
      const cards = await listPipeline();
      return JSON.stringify(
        cards.map((c) => ({
          id: c.id,
          title: c.title,
          status: c.status,
          series: c.series,
          pillar: c.pillar,
        })),
      );
    }
    if (name === "add_idea") {
      const card = await createIdea({
        title: String(input.title),
        series: (input.series as Series) || "desk",
        pillar: input.pillar,
        note: input.note,
        source: input.source,
      });
      return JSON.stringify({ ok: true, added: card.title, id: card.id, status: card.status });
    }
    if (name === "set_status") {
      const id = await resolveId(input);
      if (!id) return JSON.stringify({ ok: false, error: "Couldn't find that item." });
      const when = input.status === "scheduled" ? input.when ?? null : null;
      const card = await setStatus(id, input.status as ContentStatus, when);
      if (!card) return JSON.stringify({ ok: false, error: "Item not found." });
      return JSON.stringify({ ok: true, title: card.title, status: card.status, scheduledFor: card.scheduledFor });
    }
    if (name === "remove_item") {
      const id = await resolveId(input);
      if (!id) return JSON.stringify({ ok: false, error: "Couldn't find that item." });
      await deleteItem(id);
      return JSON.stringify({ ok: true, removed: true });
    }
    return JSON.stringify({ ok: false, error: "Unknown tool." });
  } catch (e: any) {
    return JSON.stringify({ ok: false, error: e?.message ?? "Tool failed." });
  }
}

export async function POST(request: Request) {
  const email = await getSpaceSession();
  if (!email) return NextResponse.json({ error: "Your session expired. Sign in again." }, { status: 401 });

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
  const messages: any[] = raw
    .filter((m: any) => m && (m.role === "user" || m.role === "assistant") && typeof m.content === "string")
    .slice(-20)
    .map((m: any) => ({ role: m.role, content: String(m.content).slice(0, 4000) }));

  if (!messages.length || messages[0].role !== "user") {
    return NextResponse.json({ error: "Nothing to respond to yet." }, { status: 400 });
  }

  const pipeline = typeof body?.pipeline === "string" ? body.pipeline.slice(0, 6000) : "";
  const system = pipeline ? `${SYSTEM}\n\n# Current board (as the user sees it)\n${pipeline}` : SYSTEM;

  try {
    const client = new Anthropic();
    let text = "";

    for (let i = 0; i < 6; i++) {
      const resp: any = await client.messages.create({
        model: "claude-opus-5",
        max_tokens: 1200,
        system,
        tools: TOOLS,
        messages,
      });

      text = resp.content
        .filter((b: any) => b.type === "text")
        .map((b: any) => b.text)
        .join("")
        .trim();

      if (resp.stop_reason === "tool_use") {
        messages.push({ role: "assistant", content: resp.content });
        const toolResults: any[] = [];
        for (const block of resp.content) {
          if (block.type === "tool_use") {
            const out = await runTool(block.name, block.input ?? {});
            toolResults.push({ type: "tool_result", tool_use_id: block.id, content: out });
          }
        }
        messages.push({ role: "user", content: toolResults });
        continue;
      }
      break;
    }

    return NextResponse.json({ reply: text || "(done)" });
  } catch (err: any) {
    const status = err?.status;
    const msg =
      status === 401
        ? "The ANTHROPIC_API_KEY was rejected. Check the key in Vercel."
        : status === 429
          ? "Rate limited by the model — try again shortly."
          : "The editor hit an error reaching the model. Try again.";
    return NextResponse.json({ error: msg }, { status: 200 });
  }
}

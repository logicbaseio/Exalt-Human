/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import { getSpaceSession } from "@/lib/space-auth";
import {
  listPipeline,
  createIdea,
  setStatus,
  deleteItem,
  hasDb,
  type ContentStatus,
  type Series,
} from "@/lib/content";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const STATUSES: ContentStatus[] = ["idea", "drafting", "review", "scheduled", "live"];
const SERIESES: Series[] = ["hijack", "upgrade", "future", "desk"];

async function guard() {
  const email = await getSpaceSession();
  return email;
}

export async function GET() {
  if (!(await guard())) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  try {
    const cards = await listPipeline();
    return NextResponse.json({ cards, live: hasDb() });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message ?? "Failed to load pipeline." }, { status: 200 });
  }
}

export async function POST(request: Request) {
  if (!(await guard())) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  let body: any;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Bad request." }, { status: 400 });
  }
  const title = String(body?.title ?? "").trim();
  if (!title) return NextResponse.json({ error: "A title is required." }, { status: 400 });
  const series = SERIESES.includes(body?.series) ? (body.series as Series) : "desk";
  try {
    const card = await createIdea({
      title,
      series,
      pillar: String(body?.pillar ?? "").slice(0, 60),
      note: String(body?.note ?? "").slice(0, 500),
      source: String(body?.source ?? "").slice(0, 300),
    });
    return NextResponse.json({ card }, { status: 201 });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message ?? "Couldn't add the idea." }, { status: 200 });
  }
}

export async function PATCH(request: Request) {
  if (!(await guard())) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  let body: any;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Bad request." }, { status: 400 });
  }
  const id = String(body?.id ?? "");
  const status = body?.status;
  if (!id || !STATUSES.includes(status)) {
    return NextResponse.json({ error: "id and a valid status are required." }, { status: 400 });
  }
  const scheduledFor =
    status === "scheduled" && body?.scheduledFor ? String(body.scheduledFor) : null;
  try {
    const card = await setStatus(id, status, scheduledFor);
    if (!card) return NextResponse.json({ error: "Not found." }, { status: 404 });
    return NextResponse.json({ card });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message ?? "Couldn't update." }, { status: 200 });
  }
}

export async function DELETE(request: Request) {
  if (!(await guard())) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const id = new URL(request.url).searchParams.get("id") ?? "";
  if (!id) return NextResponse.json({ error: "id required." }, { status: 400 });
  try {
    await deleteItem(id);
    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message ?? "Couldn't delete." }, { status: 200 });
  }
}

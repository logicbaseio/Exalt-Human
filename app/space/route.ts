import { NextResponse } from "next/server";
import { getSpaceSession } from "@/lib/space-auth";
import { SPACE_HTML_B64 } from "./space-html";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const email = await getSpaceSession();
  if (!email) {
    return NextResponse.redirect(new URL("/space/login", request.url));
  }

  const html = Buffer.from(SPACE_HTML_B64, "base64").toString("utf-8");
  return new Response(html, {
    headers: {
      "content-type": "text/html; charset=utf-8",
      "cache-control": "private, no-store",
      "x-robots-tag": "noindex, nofollow",
    },
  });
}

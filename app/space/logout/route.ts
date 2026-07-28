import { NextResponse } from "next/server";
import { clearSpaceSession } from "@/lib/space-auth";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  await clearSpaceSession();
  return NextResponse.redirect(new URL("/space/login", request.url));
}

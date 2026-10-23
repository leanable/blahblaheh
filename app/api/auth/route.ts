import { NextRequest, NextResponse } from "next/server";
import { checkAdmin } from "@/lib/auth";

export const runtime = "edge";
export const dynamic = "force-dynamic";

// Lets the client verify a secret before enabling admin mode.
export async function POST(req: NextRequest) {
  const auth = checkAdmin(req);
  if (!auth.ok) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }
  return NextResponse.json({ ok: true });
}

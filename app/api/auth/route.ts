import { NextRequest, NextResponse } from "next/server";
import { checkAdmin } from "@/lib/auth";
import { APP_VERSION } from "@/lib/version";

export const runtime = "edge";
export const dynamic = "force-dynamic";

const NO_STORE = { "Cache-Control": "no-store" };

// Open /api/auth in a browser: if you see {"version": ...}, the new build is live.
export async function GET() {
  return NextResponse.json({ version: APP_VERSION }, { headers: NO_STORE });
}

// Verifies a secret before the client enables admin mode.
export async function POST(req: NextRequest) {
  const auth = checkAdmin(req);
  if (!auth.ok) {
    return NextResponse.json(
      { ok: false, error: auth.error },
      { status: auth.status, headers: NO_STORE }
    );
  }
  return NextResponse.json({ ok: true }, { headers: NO_STORE });
}

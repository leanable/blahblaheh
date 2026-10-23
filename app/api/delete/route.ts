
import { del } from "@vercel/blob";
import { NextRequest, NextResponse } from "next/server";
import { checkAdmin } from "@/lib/auth";

export const runtime = "edge";

export async function DELETE(req: NextRequest) {
  // Auth check
  const auth = checkAdmin(req);
  if (!auth.ok) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  const { url } = await req.json();
  if (!url || typeof url !== "string") {
    return NextResponse.json({ error: "Missing url" }, { status: 400 });
  }

  try {
    await del(url);
    return NextResponse.json({ success: true });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Delete failed";
    console.error("Delete error:", err);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

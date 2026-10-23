import { del } from "@vercel/blob";
import { NextRequest, NextResponse } from "next/server";

const ADMIN_SECRET = process.env.ADMIN_SECRET || "";

export const runtime = "edge";

export async function DELETE(req: NextRequest) {
  // Auth check
  const secret = req.headers.get("x-admin-secret");
  if (ADMIN_SECRET && secret !== ADMIN_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
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

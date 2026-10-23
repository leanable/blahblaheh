import { list } from "@vercel/blob";
import { NextResponse } from "next/server";

export const runtime = "edge";

export async function GET() {
  try {
    const { blobs } = await list();

    const files = blobs.map((blob) => ({
      url: blob.url,
      downloadUrl: blob.downloadUrl,
      pathname: blob.pathname,
      size: blob.size,
      uploadedAt: blob.uploadedAt,
    }));

    // Sort newest first
    files.sort(
      (a, b) =>
        new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime()
    );

    return NextResponse.json({ files });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to list files";
    console.error("List error:", err);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

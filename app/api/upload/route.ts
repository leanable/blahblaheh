import { put } from "@vercel/blob";
import { NextRequest, NextResponse } from "next/server";
import { checkAdmin } from "@/lib/auth";

const MAX_FILE_SIZE = parseInt(process.env.MAX_FILE_SIZE || "") || 50 * 1024 * 1024; // 50 MB default

export const runtime = "edge";

export async function POST(req: NextRequest) {
  // Auth check
  const auth = checkAdmin(req);
  if (!auth.ok) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  const rawFilename = req.headers.get("x-filename");
  let filename = rawFilename || "";
  try {
    filename = decodeURIComponent(filename); // client sends it URI-encoded
  } catch {}
  if (!filename) {
    return NextResponse.json({ error: "Missing x-filename header" }, { status: 400 });
  }

  const contentLength = req.headers.get("content-length");
  if (contentLength && parseInt(contentLength) > MAX_FILE_SIZE) {
    return NextResponse.json(
      { error: `File too large. Max size is ${MAX_FILE_SIZE / 1024 / 1024} MB` },
      { status: 413 }
    );
  }

  if (!req.body) {
    return NextResponse.json({ error: "No file body" }, { status: 400 });
  }

  try {
    const blob = await put(filename, req.body, {
      access: "public",
      contentType: req.headers.get("content-type") || "application/octet-stream",
    });

    return NextResponse.json({
      url: blob.url,
      downloadUrl: blob.downloadUrl,
      pathname: blob.pathname,
      size: contentLength ? parseInt(contentLength) : 0,
      uploadedAt: new Date().toISOString(),
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Upload failed";
    console.error("Upload error:", err);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

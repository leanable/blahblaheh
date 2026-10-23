import { NextRequest } from "next/server";

// Trim so stray whitespace/newlines pasted into Vercel's env UI don't break matching.
function getAdminSecret(): string {
  return (process.env.ADMIN_SECRET || "").trim();
}

// Constant-time string compare (edge-runtime safe, no node:crypto).
function safeEqual(a: string, b: string): boolean {
  const enc = new TextEncoder();
  const ba = enc.encode(a);
  const bb = enc.encode(b);
  let diff = ba.length ^ bb.length;
  const len = Math.max(ba.length, bb.length);
  for (let i = 0; i < len; i++) {
    diff |= (ba[i] ?? 0) ^ (bb[i] ?? 0);
  }
  return diff === 0;
}

export type AuthResult =
  | { ok: true }
  | { ok: false; status: number; error: string };

export function checkAdmin(req: NextRequest): AuthResult {
  const expected = getAdminSecret();

  // Fail CLOSED: if the env var isn't set, nobody is admin.
  if (!expected) {
    return {
      ok: false,
      status: 500,
      error:
        "ADMIN_SECRET is not set on the server. Add it in Vercel → Settings → Environment Variables and redeploy.",
    };
  }

  const provided = (req.headers.get("x-admin-secret") || "").trim();
  if (!provided || !safeEqual(provided, expected)) {
    return { ok: false, status: 401, error: "Unauthorized" };
  }
  return { ok: true };
}

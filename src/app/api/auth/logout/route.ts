import { NextResponse } from "next/server";
import { getDatabase } from "@/lib/auth/db";
import { clearSessionCookie, readSessionToken, revokeSession } from "@/lib/auth/session";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const sql = getDatabase();
    if (sql) await revokeSession(sql, readSessionToken(request));
  } catch {
    // Always clear the browser cookie even if the session store is unavailable.
  }

  const response = new NextResponse(null, { status: 204 });
  clearSessionCookie(response);
  return response;
}

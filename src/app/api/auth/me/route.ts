import { NextResponse } from "next/server";
import { getDatabase, isAuthConfigured } from "@/lib/auth/db";
import { getSessionUser, readSessionToken } from "@/lib/auth/session";

export const runtime = "nodejs";

export async function GET(request: Request) {
  const sql = getDatabase();
  if (!sql || !isAuthConfigured()) {
    return NextResponse.json({ user: null, configured: false }, { headers: { "Cache-Control": "no-store" } });
  }

  try {
    const user = await getSessionUser(sql, readSessionToken(request));
    return NextResponse.json({ user, configured: true }, { headers: { "Cache-Control": "no-store" } });
  } catch {
    return NextResponse.json({ message: "We could not load your account." }, { status: 503 });
  }
}

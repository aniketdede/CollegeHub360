import { randomUUID } from "node:crypto";
import { NextResponse } from "next/server";
import { getDatabase, isAuthConfigured } from "@/lib/auth/db";
import { hashPassword } from "@/lib/auth/password";
import { createSession, setSessionCookie } from "@/lib/auth/session";
import { registerSchema } from "@/lib/auth/validation";
import { checkRateLimit } from "@/lib/rate-limit";

export const runtime = "nodejs";

const genericRegistrationError = "Unable to create an account with those details.";

function clientKey(request: Request) {
  return request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown-client";
}

export async function POST(request: Request) {
  const rateLimit = checkRateLimit(`auth-register:${clientKey(request)}`, 5, 60_000);
  if (!rateLimit.allowed) {
    return NextResponse.json(
      { message: "Too many attempts. Please try again shortly." },
      { status: 429, headers: { "Retry-After": String(rateLimit.retryAfterSeconds) } },
    );
  }

  const sql = getDatabase();
  if (!sql || !isAuthConfigured()) {
    return NextResponse.json({ message: "Account service is not configured." }, { status: 503 });
  }

  try {
    const parsed = registerSchema.safeParse(await request.json());
    if (!parsed.success) {
      return NextResponse.json({ message: genericRegistrationError }, { status: 400 });
    }

    const { displayName, email, password } = parsed.data;
    const existing = await sql`SELECT id FROM auth_users WHERE LOWER(email) = ${email} LIMIT 1`;
    if (existing.length > 0) {
      return NextResponse.json({ message: genericRegistrationError }, { status: 400 });
    }

    const passwordHash = await hashPassword(password);
    const userId = randomUUID();
    await sql`
      INSERT INTO auth_users (id, email, display_name, password_hash)
      VALUES (${userId}, ${email}, ${displayName}, ${passwordHash})
    `;

    const token = await createSession(sql, userId);
    const response = NextResponse.json(
      { user: { id: userId, email, displayName } },
      { status: 201 },
    );
    setSessionCookie(response, token);
    return response;
  } catch {
    return NextResponse.json({ message: genericRegistrationError }, { status: 400 });
  }
}

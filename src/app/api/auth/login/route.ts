import { NextResponse } from "next/server";
import { getDatabase, isAuthConfigured } from "@/lib/auth/db";
import { verifyPassword } from "@/lib/auth/password";
import { createSession, setSessionCookie } from "@/lib/auth/session";
import { loginSchema } from "@/lib/auth/validation";
import { checkRateLimit } from "@/lib/rate-limit";

export const runtime = "nodejs";

const genericLoginError = "Invalid email or password.";
const dummyPasswordHash = "$argon2id$v=19$m=19456,t=2,p=1$X6XkkblgVYAE3JqsJ5Jdzw$JuZAIR45/nIhbf3efSKhVbRor+7Kj/Uy79RMV28UENM";

function clientKey(request: Request) {
  return request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown-client";
}

export async function POST(request: Request) {
  const rateLimit = checkRateLimit(`auth-login:${clientKey(request)}`, 8, 60_000);
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
    const parsed = loginSchema.safeParse(await request.json());
    if (!parsed.success) {
      return NextResponse.json({ message: genericLoginError }, { status: 401 });
    }

    const { email, password } = parsed.data;
    const rows = await sql`
      SELECT id, email, display_name AS "displayName", password_hash AS "passwordHash"
      FROM auth_users
      WHERE LOWER(email) = ${email}
      LIMIT 1
    `;
    const user = rows[0] as { id: string; email: string; displayName: string; passwordHash: string } | undefined;
    const passwordMatches = await verifyPassword(user?.passwordHash ?? dummyPasswordHash, password);

    if (!user || !passwordMatches) {
      return NextResponse.json({ message: genericLoginError }, { status: 401 });
    }

    const token = await createSession(sql, user.id);
    const response = NextResponse.json({
      user: { id: user.id, email: user.email, displayName: user.displayName },
    });
    setSessionCookie(response, token);
    return response;
  } catch {
    return NextResponse.json({ message: genericLoginError }, { status: 401 });
  }
}

import { createHmac, randomBytes, randomUUID } from "node:crypto";
import type { NextResponse } from "next/server";
import type { Sql } from "@/lib/auth/db";

export const SESSION_COOKIE = "collegehub360_session";
export const SESSION_MAX_AGE_SECONDS = 60 * 60 * 24 * 30;

export type AuthUser = {
  id: string;
  email: string;
  displayName: string;
};

export function sessionCookieOptions() {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    maxAge: SESSION_MAX_AGE_SECONDS,
    path: "/",
  };
}

function hashSessionToken(token: string) {
  const secret = process.env.SESSION_SECRET?.trim();
  if (!secret) throw new Error("SESSION_SECRET is required for sessions");
  return createHmac("sha256", secret).update(token).digest("hex");
}

export async function createSession(sql: Sql, userId: string) {
  const token = randomBytes(32).toString("base64url");
  const tokenHash = hashSessionToken(token);
  const expiresAt = new Date(Date.now() + SESSION_MAX_AGE_SECONDS * 1000).toISOString();

  await sql`
    INSERT INTO auth_sessions (id, user_id, token_hash, expires_at)
    VALUES (${randomUUID()}, ${userId}, ${tokenHash}, ${expiresAt})
  `;

  return token;
}

export async function getSessionUser(sql: Sql, token: string | undefined): Promise<AuthUser | null> {
  if (!token) return null;

  const tokenHash = hashSessionToken(token);
  const rows = await sql`
    SELECT u.id, u.email, u.display_name AS "displayName"
    FROM auth_sessions s
    JOIN auth_users u ON u.id = s.user_id
    WHERE s.token_hash = ${tokenHash}
      AND s.expires_at > NOW()
    LIMIT 1
  `;

  return (rows[0] as AuthUser | undefined) ?? null;
}

export async function revokeSession(sql: Sql, token: string | undefined) {
  if (!token) return;
  await sql`DELETE FROM auth_sessions WHERE token_hash = ${hashSessionToken(token)}`;
}

export function readSessionToken(request: Request) {
  const cookieHeader = request.headers.get("cookie") ?? "";
  const prefix = `${SESSION_COOKIE}=`;
  const cookie = cookieHeader.split(";").map((value) => value.trim()).find((value) => value.startsWith(prefix));
  return cookie ? decodeURIComponent(cookie.slice(prefix.length)) : undefined;
}

export function setSessionCookie(response: NextResponse, token: string) {
  response.cookies.set(SESSION_COOKIE, token, sessionCookieOptions());
}

export function clearSessionCookie(response: NextResponse) {
  response.cookies.set(SESSION_COOKIE, "", {
    ...sessionCookieOptions(),
    maxAge: 0,
  });
}

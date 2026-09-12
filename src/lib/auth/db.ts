import { neon, type NeonQueryFunction } from "@neondatabase/serverless";

export type Sql = NeonQueryFunction<false, false>;

export function getDatabase(): Sql | null {
  const databaseUrl = process.env.DATABASE_URL?.trim();
  return databaseUrl ? neon(databaseUrl) : null;
}

export function isAuthConfigured() {
  return Boolean(process.env.DATABASE_URL?.trim() && process.env.SESSION_SECRET?.trim());
}

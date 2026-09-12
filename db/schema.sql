-- CollegeHub360 auth MVP schema
-- Apply this once to the PostgreSQL database configured as DATABASE_URL.
-- Never commit the database URL or any user records.

CREATE TABLE IF NOT EXISTS auth_users (
  id TEXT PRIMARY KEY,
  email TEXT NOT NULL,
  display_name TEXT NOT NULL,
  password_hash TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE UNIQUE INDEX IF NOT EXISTS auth_users_email_lower_idx ON auth_users (LOWER(email));

CREATE TABLE IF NOT EXISTS auth_sessions (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES auth_users(id) ON DELETE CASCADE,
  token_hash TEXT NOT NULL UNIQUE,
  expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS auth_sessions_user_id_idx ON auth_sessions (user_id);
CREATE INDEX IF NOT EXISTS auth_sessions_expires_at_idx ON auth_sessions (expires_at);

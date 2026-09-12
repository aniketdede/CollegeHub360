# CollegeHub360 — Deployment Runbook

## Status

The public discovery and assessment MVP is suitable for preview deployment. Production release remains gated until the data, authentication, privacy, rate-limiting and testing requirements in this document are complete.

## Local preflight

```bash
npm ci
npm run check
npm audit --audit-level=high
npm run start -- --hostname 0.0.0.0 --port 3000
```

Smoke-test the running application:

```bash
curl -fsS http://localhost:3000/api/health
curl -fsS http://localhost:3000/
curl -fsS http://localhost:3000/assess
```

## Preview deployment

1. Import the repository into the selected Next.js hosting platform.
2. Use the platform's standard Next.js build detection or set the build command to `npm run build`.
3. Use Node.js 22 or the runtime specified by the hosting platform's supported Next.js version.
4. Configure only the variables required for the deployed slice from `.env.example`.
5. Keep account routes disabled unless both `DATABASE_URL` and `SESSION_SECRET` are configured.
6. Enable preview deployments and review the preview URL before production release.

The public catalogue and assessment preview do not require account credentials. Account persistence requires applying the database schema:

```bash
psql "$DATABASE_URL" -f db/schema.sql
```

Never place database URLs, session secrets, passwords or user records in Git, browser bundles or logs.

## Preview acceptance checks

- Installation completes from `package-lock.json`.
- `npm run check` passes.
- High-severity dependency audit findings are absent.
- `/api/health` returns `{ "status": "ok" }`.
- `/`, `/assess`, `/login` and `/register` load without hydration or console errors.
- College search, filters and comparison work on desktop and mobile widths.
- Assessment requests are server-validated and rate-limited.
- Each catalogue record exposes source and freshness context.
- Missing official cutoff evidence is displayed as `Insufficient data`.
- Account routes fail closed when database configuration is absent.

## Production release gate

Production is not open until all of the following are complete:

- Official JoSAA and Maharashtra CET Cell cutoff data has been imported with exam, year, round, quota, category, source URL and review date.
- Database migrations, backups, restoration and rollback have been tested.
- Authentication integration tests cover registration, login, logout, expiry, revocation and generic invalid-credential responses.
- Passwords are stored only as Argon2id hashes and sessions use secure, HttpOnly, SameSite cookies.
- Shared rate limiting replaces the current in-memory development limiter.
- Privacy notice, account deletion, data export and incident ownership are available.
- Automated unit, integration, accessibility and critical-path browser tests pass.
- A data owner reviews the published catalogue and assessment evidence.

## Rollback and observability

- Retain the previous known-good deployment and immutable release identifier.
- Roll back at the hosting platform before making emergency code changes.
- If assessment evidence is incorrect, disable the assessment route or feature flag and preserve the incident record.
- Monitor deployment status, HTTP 4xx/5xx rates, `/api/health`, assessment latency, rate-limit responses and data freshness.
- Do not log passwords, session tokens, assessment inputs, ranks, category values or complete request bodies.

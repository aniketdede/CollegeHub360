# CollegeHub360

CollegeHub360 is a source-linked college discovery and admission assessment MVP for Indian higher education.

## Current scope

- Explore a curated college and program catalogue.
- Search and filter by stream, location, college, city and program.
- Compare up to four colleges while retaining program and source context.
- Submit an admission assessment request with server-side validation and rate limiting.
- Show source, academic-year context and review date for public catalogue records.
- Provide account registration, login, logout and session APIs backed by PostgreSQL when configured.

## Product status

The public discovery flow is preview-ready. The catalogue is deliberately small and uses public institution sources. Official cutoff rows from JoSAA and Maharashtra CET Cell are not yet imported; the assessment returns `Insufficient data` rather than displaying guessed or unverified cutoffs.

Account routes are implemented with Argon2id password hashing and server-side sessions, but remain disabled until a PostgreSQL-compatible database and `SESSION_SECRET` are configured.

## Technology

- Next.js 16 with the App Router
- TypeScript and React
- PostgreSQL-compatible persistence through Neon Serverless
- Argon2id password hashing
- Zod request validation
- Tailwind CSS v4 and project-level responsive CSS
- Vercel-compatible deployment

## Local development

```bash
npm ci
npm run dev
```

Open `http://localhost:3000` and use `/assess`, `/login` or `/register` as needed.

Copy `.env.example` to `.env.local` when local configuration is required. Account functionality needs:

```text
DATABASE_URL=<server-side PostgreSQL connection string>
SESSION_SECRET=<server-side high-entropy secret>
```

Apply the account schema before enabling account routes:

```bash
psql "$DATABASE_URL" -f db/schema.sql
```

Never commit `.env.local`, credentials or user records.

## Verification

```bash
npm run lint
npm run typecheck
npm run build
npm run check
npm audit --audit-level=high
```

## API surface

- `GET /api/health` — liveness check
- `POST /api/assessments/preview` — validated assessment request
- `POST /api/auth/register` — create an account when persistence is configured
- `POST /api/auth/login` — create a secure session
- `POST /api/auth/logout` — revoke the current session
- `GET /api/auth/me` — return the current authenticated user

## Data and assessment integrity

- Volatile catalogue facts retain a source URL, publisher, academic-year context and review date.
- Missing data is shown as missing; it is never replaced with zero or an invented estimate.
- Assessment results are decision support, not admission guarantees.
- A result without comparable official evidence is explicitly marked `Insufficient data`.
- Careers360 and CollegeDunia are reference sites for product category research only. Their estimates are not used as authoritative cutoff data.

See:

- [Data sources](data-sources.md)
- [Product and UX design](design.md)
- [System architecture](architecture.md)
- [Product and data rules](rules.md)
- [Delivery roadmap](phases.doc.md)
- [Deployment runbook](deployment.md)
- [Architecture decisions](DECISIONS.md)

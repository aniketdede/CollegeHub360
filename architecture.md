# CollegeHub360 — System Architecture

**Status:** MVP architecture v0.2
**Scope:** Web-first MVP for Indian higher-education discovery, comparison and admission-chance assessment.

## 1. Architectural intent

CollegeHub360 should help a student move from **question → shortlist → informed decision** without forcing them to search several disconnected websites. The architecture must make three things trustworthy and easy to change:

1. College, course, exam, fee, placement and cutoff data.
2. The admission-chance assessment and the assumptions behind it.
3. User-created state such as saved colleges, comparisons and alerts.

The MVP uses a modular monolith so public discovery, assessment and account services can share typed domain boundaries without premature service extraction.

## 2. Product boundary

### In scope for the MVP

- Search and filter colleges, campuses, courses and entrance exams.
- Canonical college and course profiles.
- Side-by-side comparison of up to four colleges for one course context.
- Shortlists, notes and deadline reminders for signed-in users.
- An explainable admission-chance assessment using user inputs and historical cutoffs.
- Admin workflows for importing, reviewing, publishing and retiring data.
- Source, freshness and confidence labels on data that can change.

### Explicitly out of scope initially

- Applying to a college on a user’s behalf.
- Guaranteeing admission or publishing an unexplainable AI score.
- Live counselling-seat inventory unless an official feed is available.
- Paid counselling, ads, institution lead routing and native mobile apps.
- Copying competitor content, rankings, images, reviews or UI patterns.

## 3. Context diagram

```text
 Student / Parent browser
          |
          v
  Web UI (responsive, SEO-friendly)
          |
          v
  Application API / domain modules
    |       |        |        |
    v       v        v        v
 PostgreSQL Search   Worker   Notification provider
   +         index   /ETL          |
 object storage       |             v
    |                  +------> email / in-app alerts
    v
 source records, images, import files

 Content/data admin ---> authenticated admin routes ---> API
```

The browser must use same-origin or relative API URLs. No production browser code should call `localhost` or `127.0.0.1`.

## 4. Recommended implementation shape

### Application

- **Web:** TypeScript web application with server-rendered or statically generated public pages for discoverability and client-side interaction for filters, comparison and assessment.
- **API:** Versioned JSON API in the same deployable application for MVP. Keep modules separated by domain so the API can be extracted later if scale requires it.
- **Database:** PostgreSQL as the system of record. Use migrations, foreign keys and audit columns from the first migration.
- **Search:** PostgreSQL full-text search and indexed filters for the first release. Introduce a dedicated search index only when query latency or ranking quality requires it.
- **Async jobs:** A worker/queue for source imports, stale-data checks, assessment report generation, reminder delivery and search re-indexing.
- **Object storage:** Store uploaded evidence, logos and approved media outside the database; save immutable metadata and source URLs in PostgreSQL.
- **Analytics:** Privacy-conscious event tracking with a documented event schema. Never send raw rank, category or phone number to a third-party analytics tool.

The exact framework and hosting provider are implementation decisions; the domain boundaries and contracts above are the constraint.

## 5. Domain model

| Entity | Purpose | Key fields |
|---|---|---|
| `User` | Account and preferences | id, email/phone, role, consent timestamps |
| `College` | Institution-level canonical record | slug, name, type, ownership, accreditation, description, source status |
| `Campus` | Physical/virtual location under a college | college_id, city, state, address, coordinates |
| `Program` | A course offered at a campus | degree, discipline, duration, mode, eligibility, fee summary |
| `Exam` | Entrance exam or admission route | name, conducting body, cycle, score/rank type, official URL |
| `Cutoff` | Historical opening/closing admission signal | exam, year, college, program, category, quota, round, value, source_id |
| `Deadline` | Application/counselling milestone | exam/program/college, label, starts_at, ends_at, source_id |
| `AssessmentInput` | Versioned user-submitted facts | exam, score/rank, category, domicile, gender where relevant, preferences |
| `AssessmentResult` | Explainable result snapshot | input_id, result_version, band, reasons, data_freshness, created_at |
| `ShortlistItem` | Saved college/program and notes | user_id, program_id, priority, note, reminder_at |
| `Comparison` | Shareable or private comparison context | user_id/anonymous_token, program context, ordered program IDs |
| `Review` | Moderated first-person experience | user_id, college_id, rating dimensions, body, status, verified flag |
| `SourceRecord` | Provenance and freshness | publisher, URL, captured_at, valid_from, valid_to, license/usage note |
| `AuditEvent` | Who changed publishable data | actor, entity, action, before/after, timestamp |

Use stable IDs internally and slugs only for public URLs. Do not encode mutable names in foreign keys.

## 6. Module boundaries

1. **Catalog** — colleges, campuses, programs, facilities and media.
2. **Admissions** — exams, eligibility, deadlines, counselling routes and historical cutoffs.
3. **Discovery** — search, filters, sorting, SEO collections and related results.
4. **Assessment** — validation, cutoff matching, banding, explanations and versioning.
5. **Engagement** — accounts, shortlists, comparisons, notes and reminders.
6. **Trust & community** — source records, reviews, moderation and report abuse.
7. **Content operations** — import, deduplication, review queue, publishing and audit history.
8. **Platform** — authentication, rate limiting, notifications, analytics and observability.

Each module owns its validation and service logic. UI components must not implement cutoff or eligibility rules themselves.

## 7. Core request flows

### Discovery

1. User submits a query and filters.
2. API validates allowed filter values and builds a parameterized query.
3. Search returns canonical IDs, title, location, course context, freshness and a short result summary.
4. Public result/profile pages are cacheable; personalized shortlist state is fetched separately.

### Assessment

1. User selects an exam and admission cycle.
2. API validates score/rank range, category, domicile/quota and selected programs.
3. Assessment service selects comparable historical cutoff records using the rules in `rules.md`.
4. Result returns `Safe`, `Target`, `Ambitious` or `Insufficient data`, with matched records, date, source and an explanation.
5. The result is versioned so a future rules/data update does not silently rewrite an old report.

### Data ingestion

```text
source -> fetch/import -> normalize -> deduplicate -> validate
       -> human review -> publish -> index/cache refresh -> audit log
```

A failed or partial import must never delete the last known good published value.

## 8. Initial API surface

All endpoints are under `/api/v1`. Public GET endpoints should return `updatedAt`, `sourceCount` and an appropriate freshness/status field when the response contains time-sensitive data.

| Method | Route | Purpose |
|---|---|---|
| `GET` | `/colleges` | Search/filter paginated colleges |
| `GET` | `/colleges/:slug` | College profile and source metadata |
| `GET` | `/programs` | Search courses/programs |
| `GET` | `/exams` | Exam directory and important dates |
| `GET` | `/cutoffs` | Historical, source-linked cutoff data |
| `POST` | `/assessments/preview` | Validate inputs and return assessment result |
| `POST` | `/shortlist/items` | Save a college/program |
| `GET` | `/shortlist` | Current user’s shortlist |
| `POST` | `/comparisons` | Create a comparison context for up to four programs |
| `POST` | `/reviews` | Submit a review for moderation |
| `POST` | `/reports` | Report inaccurate data or abusive content |
| `GET` | `/me` | Current account and preferences |

Admin routes live under `/api/v1/admin`, require a role check and write an audit event. Use cursor pagination for growing public lists and never trust client-supplied ownership or role fields.

## 9. Quality attributes

- **Performance:** p95 search response under 800 ms, p95 profile response under 1.2 s on a warm cache; lazy-load non-critical media.
- **Availability:** target 99.5% monthly availability for public read paths in MVP; graceful empty/error states for workers and external providers.
- **Accessibility:** WCAG 2.2 AA target, keyboard-complete flows, visible focus and no information conveyed by colour alone.
- **SEO:** stable canonical URLs, metadata, structured data where accurate, server-rendered public profile content and no indexable duplicate filter URLs.
- **Security:** TLS, secure/httpOnly cookies, CSRF protection where applicable, parameterized queries, output encoding, upload scanning and rate limits on assessment/review/report endpoints. All client input is advisory; server-side schema validation, authorization and database constraints are mandatory.
- **Privacy:** collect only fields needed for the current task, separate contact consent from product consent, support export/deletion workflows and redact PII from logs.

### Required authentication controls

- Validate every login, registration, password-reset and profile payload on the server with an allowlist schema, size limits and normalized values. Repeat authorization checks at the service/data layer; never rely on disabled UI controls or client-supplied roles.
- Store passwords only as salted, adaptive one-way hashes using Argon2id (scrypt is an approved fallback). Do not store plaintext passwords and do not use reversible encryption for password storage. Passwords, reset tokens and session secrets must never be logged.
- Apply layered login rate limiting by account identifier and source IP, with progressive backoff and monitoring. Use the same protection for password reset, verification and assessment/report abuse endpoints. Thresholds are configuration, not a client bypass.
- Return generic authentication errors such as `Invalid email or password` and `If an account exists, we sent reset instructions`. Do not reveal whether an account exists, which field failed or whether a password is correct. Keep response timing reasonably uniform.
- Use short-lived, rotated sessions in secure/httpOnly/SameSite cookies, revoke sessions after password changes, and invalidate reset tokens after one use or expiry. Protect state-changing browser requests with CSRF controls.
- Secrets and encryption keys come from the deployment secret manager/environment, never source files, fixtures, logs or client bundles. Rotate them and test the rotation path before production.

Security-sensitive changes require review and automated tests before release.
- **Recovery:** daily backups initially, tested restore procedure, and no destructive data import without a recoverable snapshot.
- **Auditability:** every published data value has a source, capture time and editorial actor or import job.

## 10. Environments and delivery

- `local` — seeded synthetic data; external notifications disabled by default.
- `test` — migrations, unit/integration tests, accessibility checks and fixture data.
- `staging` — production-like deployment with test email provider and redacted data.
- `production` — protected secrets, backups, monitoring and reviewed migrations.

CI should run formatting, type checks, unit tests, API contract tests, migration checks and a production build before merge. Feature flags may hide incomplete modules; do not ship half-populated public records.

## 11. Reference learnings and boundary

The product direction is informed by capabilities visible on [Careers360](https://www.careers360.com/) and [CollegeDunia](https://www.collegedunia.com/): broad college/course/exam discovery, rankings, comparison, reviews, important dates and college-predictor style tools. CollegeHub360 should use these as category references only. It must build its own data contracts, content, brand, ranking disclosure and assessment logic.

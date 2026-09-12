# CollegeHub360 — Delivery Phases

**Status:** Draft v0.1
**Release approach:** Ship a trustworthy web MVP in vertical slices, then expand coverage and personalization.

## 0. Product constraints

- Web is the first platform; responsive mobile web is required.
- The first dataset is intentionally small and source-linked rather than a scraped catalogue of uncertain quality.
- Each phase requires product, engineering and data-quality review.
- The assessment is decision support based on comparable historical evidence, not an admission guarantee.
- The phases describe delivery order and acceptance criteria, not calendar commitments.

## Phase 0 — Product and data foundation

**Goal:** Remove ambiguity before building screens.

**Deliverables**

- Confirm target launch segment: for example, Indian undergraduate engineering admissions.
- Interview/test with students, parents and one data reviewer.
- Define the first exam, course families, states and 50–100 canonical institutions.
- Approve data dictionary, source hierarchy, freshness windows and assessment rule version 0.
- Produce low-fidelity flows for search, profile, compare, shortlist and assessment.
- Decide legal/privacy review path for reviews, contact fields and source licensing.

**Exit criteria**

- Product owner signs the MVP scope and non-goals.
- Every launch field has an owner, source expectation and update path.
- At least 10 representative assessment cases exist, including no-match and stale-data cases.
- No unresolved decision blocks Phase 1 implementation.

## Phase 1 — Application foundation and content operations

**Goal:** Establish the secure shell and a publishable catalogue.

**Deliverables**

- Project setup, environments, CI checks, migrations and seed fixtures.
- Authentication/authorization skeleton with student and admin roles.
- Server-side validation at every API boundary, database constraints and deny-by-default authorization checks.
- Password storage using Argon2id salted hashes; secure/httpOnly/SameSite sessions; no plaintext or reversible password encryption.
- Layered login, password-reset, verification and abuse rate limits with progressive backoff and generic public errors.
- PostgreSQL schema for colleges, campuses, programs, exams, sources and audit events.
- Admin import/review/publish workflow with validation errors and rollback-safe imports.
- Public shell: header, footer, responsive layout, loading/error/not-found states.
- Monitoring for API errors, worker failures and stale data.

**Acceptance checks**

- A reviewer can import a fixture, resolve duplicates, publish a record and see its source/freshness on the public profile.
- Unauthorized users cannot access admin routes, and ownership/role checks are enforced server-side.
- Invalid, oversized and unknown request fields are rejected by the API even when the UI is bypassed.
- Passwords, reset tokens and session secrets do not appear in logs, fixtures, responses or analytics.
- Login and reset abuse is rate-limited and returns generic authentication errors without account enumeration.
- CI can create a clean database and run migrations from scratch.
- A failed import leaves the last good published record unchanged.

## Phase 2 — Discovery and catalog

**Goal:** Let a new visitor find a relevant college or program quickly.

**Deliverables**

- Search across college, course, exam and location aliases.
- Filter by stream/program, state/city, ownership, fee band, mode, accreditation and exam route where data exists.
- Pagination, sort, URL-persisted filter state and shareable result URLs.
- College and program cards with concise summaries, source/freshness status and clear next actions.
- SEO-safe canonical profile and collection pages.

**Acceptance checks**

- A user can find a target institution using name, alias or city.
- Every filter is labelled with its unit/context and can be cleared independently.
- Empty, loading, failed and no-image states are designed and tested.
- Public pages do not expose private user state.
- Search p95 meets the target in `architecture.md` on the launch fixture.

## Phase 3 — Profile, compare and shortlist

**Goal:** Turn browsing into a practical shortlist.

**Deliverables**

- College profile: overview, programs, admissions, fees, facilities, placements, reviews placeholder, source panel and last updated date.
- Program detail: eligibility, admission route, duration, fees, seats if sourced, deadlines and historical cutoffs.
- Add/remove shortlist, notes, priority and optional reminder for signed-in users.
- Compare up to four compatible programs with raw values, missing-data states and source links.
- Shareable comparison view that does not expose private notes.

**Acceptance checks**

- Anonymous users can compare; sign-in is requested only for persistence.
- Incompatible contexts display a warning instead of a misleading comparison.
- Saved items persist across sessions and can be deleted.
- No comparison row uses zero for missing data.
- Source and freshness details are reachable from every volatile value.

## Phase 4 — Admission-chance assessment

**Goal:** Provide an explainable, useful first assessment for the launch exam(s).

**Deliverables**

- Input form with exam/cycle, rank or score, course, category and relevant quota/domicile.
- Input validation with units, range checks and plain-language errors.
- Matching service following `rules.md`, with versioned rule configuration.
- Result page with Safe/Target/Ambitious/Insufficient data bands, matched historical records, data date, source and limitations.
- Save/share/export result only with explicit user action; do not expose sensitive inputs in URLs.
- Admin report of missing cutoff coverage and stale records.

**Acceptance checks**

- Exact-match, broadened-match, no-match, stale-data and invalid-input fixtures pass.
- The UI names every omitted dimension and never promises admission.
- A data reviewer can trace each result to the cutoff rows and rule version used.
- Assessment p95 meets the performance target and rate limits prevent abuse.
- Product review confirms the result is understandable without statistical expertise.

## Phase 5 — Trust, alerts and community loop

**Goal:** Keep decisions current and improve trust without adding noise.

**Deliverables**

- Official deadline/exam update feed with source and freshness state.
- Shortlist reminders and in-app notification centre with opt-in controls.
- Review submission, verification marker, reporting, moderation queue and appeals.
- “Report inaccurate data” action on profiles and assessment evidence.
- Analytics dashboard for discovery-to-shortlist and assessment completion funnels.

**Acceptance checks**

- Users can opt out of each notification category.
- Moderated content cannot appear publicly before approval.
- Expired deadlines are marked rather than silently removed.
- Review and report endpoints are rate-limited and audited.
- PII is absent from analytics payloads and application logs.

## Phase 6 — Expansion after MVP evidence

Only start after Phase 4 has real usage and data-quality review.

Possible work:

- More exams, states, disciplines and international destinations.
- Preference-fit assessment that weights fees, location, placements, facilities and course interests separately from admission chance.
- Better cutoff calibration and transparent confidence analysis.
- Saved searches, recommendation feedback and a richer counselling calendar.
- Dedicated search infrastructure, mobile app or partner integrations only when measured need justifies them.

Do not start Phase 6 merely to increase feature count.

## Cross-phase definition of done

- Requirements, design, API contract and data rules are updated.
- Unit, integration and critical-path end-to-end tests exist.
- Keyboard and screen-reader smoke checks pass on new flows.
- Loading, empty, error, stale and permission states are handled.
- Server-side validation, authorization, rate-limit, generic-error and credential-handling tests cover every new protected flow.
- Analytics events are documented and contain no unnecessary PII.
- Sources and update timestamps are present for volatile content.
- Product/data owner signs off on sample content.
- A rollback or feature-flag path exists for risky changes.
- README or runbook explains local setup, migrations, seeds and test commands.

## Launch quality gates

### Trust gate

No public college/program record without a canonical identity, source status and owner. No assessment result without traceable evidence or an explicit `Insufficient data` response.

### Safety gate

Privacy notice, consent controls, deletion path, abuse reporting, server-side validation, layered login/password-reset rate limiting, Argon2id password hashing, generic authentication errors, secure session cookies and secret handling are tested before public accounts or reviews launch.

### Usability gate

Five first-time users can complete: search → profile → compare → shortlist, and the assessment flow can be completed without moderator help. Findings are recorded and critical blockers fixed.

### Measurement gate

Baseline the following before wider rollout:

- Search success rate and zero-result rate.
- Profile engagement and compare-start/compare-complete rate.
- Shortlist save and return rate.
- Assessment completion, `Insufficient data` rate and correction/report rate.
- Source freshness SLA and import failure rate.
- Core web vitals, API latency and error rate.

## Risks and mitigations

| Risk | Mitigation |
|---|---|
| Stale or inconsistent college data | Small launch dataset, source owner, freshness states, audit trail |
| Assessment interpreted as a guarantee | Chance bands, evidence panel, limitations copy, no fake precision |
| Scraping/licensing problems | Use permitted sources, contracts and original editorial content |
| Sponsored content bias | Separate commercial/editorial approvals and visible labelling |
| Scope expands to every exam immediately | Phase by launch segment and use data coverage as a gate |
| Sensitive student data leaks | Data minimization, redacted logs, restricted access and deletion tests |

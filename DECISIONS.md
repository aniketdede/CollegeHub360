# CollegeHub360 — Product and Architecture Decisions

This document records decisions that affect the MVP scope, trust model and release process.

| ID | Decision | Rationale |
|---|---|---|
| D-001 | Use a Next.js and TypeScript modular monolith for the MVP. | It supports server-rendered public pages, typed API boundaries and a simple deployment model. |
| D-002 | Start with a small source-linked catalogue. | A smaller reviewed dataset is safer and more useful than broad coverage with uncertain provenance. |
| D-003 | Keep discovery, comparison and assessment as the first product slice. | These flows establish the core student journey from research to shortlist. |
| D-004 | Treat assessment results as decision support, not admission predictions or guarantees. | Admission outcomes depend on official counselling, eligibility, seat availability and final cutoffs. |
| D-005 | Import cutoff records only from authoritative counselling or examination sources. | JoSAA and Maharashtra CET Cell data are the required sources for the initial engineering routes. |
| D-006 | Use PostgreSQL-compatible persistence for accounts and server-side sessions. | User identity must survive across serverless instances and deployments. |
| D-007 | Hash passwords with Argon2id and store only protected session-token hashes. | Credentials and bearer tokens must not be stored in plaintext. |
| D-008 | Keep production release gated until authentication, privacy, rate limiting, data provenance and automated tests are complete. | The application must not present a preview implementation as a production admissions service. |

## Release criteria

- Every public catalogue record has a canonical source and review date.
- Every assessment result has traceable evidence or is explicitly marked `Insufficient data`.
- Server-side validation and authorization are applied at every protected API boundary.
- Authentication uses secure cookies, generic errors, expiry and revocation.
- Production data imports, migrations, backups and rollback procedures are tested.
- Automated unit, integration, accessibility and critical-path browser checks pass.

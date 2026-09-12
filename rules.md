# CollegeHub360 — Product and Data Rules

**Status:** Draft v0.1
**Purpose:** The non-negotiable rules for trustworthy discovery, comparison, reviews and admission-chance assessment.

## 1. Trust and provenance

1. Every time-sensitive value—fee, cutoff, deadline, seat count, placement figure or ranking—must have a `SourceRecord`, `updatedAt` and a freshness state.
2. Prefer sources in this order: official regulator/exam/counselling authority, official institution publication, audited or transparent ranking body, verified institutional submission, then moderated community report.
3. A source is evidence, not an endorsement. Show the publisher and link where licensing permits; do not imply that CollegeHub360 guarantees the source.
4. Never merge two values into an average when their definitions, years, courses or populations differ.
5. If sources conflict, show the conflict or send the record to review. Do not silently pick the value that makes a college look better.
6. A stale value may remain visible only with a clear stale label. A value without a usable source must not be shown as fact.
7. Editorial changes require an audit record. Deleting a source must not delete the last published value without an explicit review decision.

### Minimum freshness defaults

These are defaults and may be tightened by an owner of each dataset:

| Data | Review/recheck window |
|---|---:|
| Admission deadline or live counselling notice | 7 days while active |
| Exam pattern, eligibility and schedule | 30 days during an active cycle |
| Fees and seats | 90 days or at the next official update |
| Cutoffs and placement outcomes | Next published cycle; otherwise annual review |
| Campus description and facilities | 180 days |
| Rankings | One review per ranking release |

Use `Current`, `Needs review`, `Stale` and `Unverified` states; do not use a green check without defining what was verified.

## 2. College and course identity

1. A college, university, campus and affiliated institute are distinct records even when users commonly use one name for all of them.
2. A program belongs to a specific institution/campus and includes degree, specialization, duration, mode and admission route.
3. Do not imply that an institution offers a course merely because a similarly named institution does.
4. Preserve official names and aliases for search, but use one canonical public URL per record.
5. Do not publish accreditation, approval, placement or ranking claims without a source and relevant year.

## 3. Search and discovery

1. Search is tolerant of spelling and common abbreviations, but result cards must show the canonical name.
2. Default sort is relevance, then data completeness and freshness—not paid placement.
3. Sponsored or promoted content, if introduced later, must be visually and textually labelled and never mixed into an “unbiased” ranking.
4. Filters must expose their unit and context: annual vs total fee, campus vs university, course vs college, domestic vs international, and academic year.
5. Empty results must explain which filters caused the empty state and offer safe reset actions.
6. Public result pages must be shareable without exposing a user’s private shortlist, notes or assessment inputs.
7. Do not create an SEO landing page unless it has useful, reviewed content and a stable canonical query.

## 4. Comparison

1. A comparison is valid only when programs have a compatible context. If degrees or admission routes differ, show a warning rather than a misleading row-by-row score.
2. Allow up to four colleges/programs in a comparison. Preserve the user’s order and allow removal without losing the rest.
3. Show raw values first, then a neutral interpretation. Do not collapse a multi-dimensional decision into one “best college” score in MVP.
4. Every comparison row has a source/freshness affordance where the value can change.
5. Missing values display `Not available` or `Not reported`, never zero.
6. Comparison recommendations must not be influenced by sponsorship or a commercial lead objective.

## 5. Admission-chance assessment

The assessment is decision support, not an admission promise. Use “chance band” language and include the sentence: **“This estimate is based on historical data; actual admission depends on official counselling, eligibility, seat availability and final cutoffs.”**

### Required inputs

- Exam/admission route and cycle.
- Official rank or score, with the unit explicitly labelled.
- Course/branch preferences.
- Category and applicable quota/domicile.
- Gender or other factor only where the selected counselling rules explicitly use it.
- Optional location and fee preferences for filtering, not for changing historical cutoffs.

Do not ask for caste certificate numbers, government ID, passwords, complete date of birth or unrelated sensitive data. If a user does not provide a field, show which assessment dimensions cannot be matched.

### Matching logic

1. Match historical records on the same exam/admission route, course or branch, institution/campus, category, quota and round wherever available.
2. Prefer the latest comparable rounds and the same counselling cycle. Do not mix a state quota cutoff with an all-India cutoff.
3. When exact records are missing, broaden matching in a disclosed order and reduce confidence: exact branch → related branch group → institution-level route. Never silently broaden.
4. For rank-based exams, lower rank is better. For score-based exams, higher score is better. Normalize direction before comparison.
5. Use opening/closing rank or score with the round and year visible. Do not turn one cutoff into a false precision probability.
6. Return one of:
   - **Safe:** historical evidence is materially more favourable than the user’s input.
   - **Target:** the input is close to the historical range; the option is plausible but competitive.
   - **Ambitious:** the input is weaker than the recent range but the option is still useful as an aspirational choice.
   - **Insufficient data:** there is not enough comparable, recent or quality-assured evidence.
7. The boundary values are configuration, not UI logic. Each exam owner must calibrate them against historical outcomes and document the version.
8. A result must include: matched cutoff rows, year/round, source, data freshness, matched dimensions, omitted dimensions and a short explanation.
9. Never display “100% chance”, “guaranteed”, or a fabricated decimal probability. If probabilistic modelling is introduced later, it requires calibration, evaluation, versioning and a plain-language limitations panel.
10. If the official rules change, invalidate or re-run affected assessments and show the assessment rules version.

### Assessment result quality gate

An assessment release needs historical fixtures, edge-case tests, category/quota tests, a missing-data test, a stale-data test and review by a domain owner. A result without evidence is a product bug, not a content gap.

## 6. Reviews and community content

1. Reviews are first-person experiences, not official college claims. Label the review date and whether the reviewer identity/enrolment was verified.
2. One user may not create multiple active reviews for the same college in the same review period without moderation.
3. Prohibit personal data, harassment, threats, hate, allegations presented as fact, copied text, paid testimonials and promotional spam.
4. Allow report, moderation status, edit history and appeal. Do not silently edit a user’s meaning; explain moderation decisions.
5. Rating dimensions must be defined and should not be averaged into a single “truth score” without displaying sample size and methodology.
6. A low review count must be shown; do not present it as representative of all students.

## 7. Accounts, consent and privacy

1. Browsing and basic search should work without an account.
2. Require an account only for persistence or notifications: shortlist sync, saved assessment reports, notes and alerts.
3. Ask for consent at the point of collection. Product usage consent, marketing consent and third-party sharing consent are separate choices.
4. Assessment inputs are sensitive in context. Encrypt in transit and at rest where supported, restrict access, redact logs and provide deletion/export controls.
5. Do not send assessment inputs to partners, counsellors or institutions without a separate, specific opt-in.
6. Users can revoke notification consent and delete saved inputs. Deletion must propagate to backups according to the retention policy.
7. Sessions use secure cookies, expiry/rotation and server-side authorization. A client role or hidden UI control is never a permission check.

### Authentication and validation requirements

- **Server-side validation is authoritative.** Validate type, shape, length, format, range and allowed values at every API boundary. Normalize values before comparison, reject unknown fields where practical, and enforce database constraints as a second line of defence.
- **Passwords are hashed, not reversibly encrypted.** Use Argon2id with a unique salt and an approved work factor; never store plaintext, log credentials or put passwords in analytics, URLs, error reports or fixtures. Encryption is appropriate for selected data at rest, not as a replacement for password hashing.
- **Login rate limits are layered.** Rate-limit failed login attempts by account identifier and source IP, add progressive backoff, monitor spikes and avoid permanent lockout that can be abused for denial of service. Apply equivalent limits to registration, password reset, verification, review, report and assessment endpoints.
- **Authentication responses are generic.** Use the same public response for unknown account, wrong password, disabled account and reset requests. Do not disclose whether an email/phone exists, which credential was wrong or whether a token was valid. Log only an internal correlation ID and safe reason category.
- **Authorization is server-side and deny-by-default.** Re-check ownership, role and record state on every protected read/write. Never trust a role, user ID, redirect URL or permission flag supplied by the browser.
- **Credential recovery is single-use and expiring.** Reset tokens are random, short-lived, stored only as hashes, invalidated after use/password change and never included in application logs or referrer URLs.

## 8. Accessibility and content

1. Every action is keyboard reachable and has a visible focus state.
2. Labels, errors and assessment outcomes are text-first; colour is supporting information only.
3. Use plain Indian English, expand acronyms on first use and explain rank/score units.
4. Never use urgency copy such as “last chance” unless the linked official deadline is current and visible.
5. User-facing error messages say what happened and what to do next; never expose stack traces or internal IDs.

## 9. Commercial and editorial boundaries

1. A partner, sponsored profile or lead form must be labelled before interaction.
2. Paid placement cannot change organic relevance, assessment results, cutoff data or ranking methodology.
3. No dark patterns: no preselected marketing consent, forced phone capture for basic results, fake countdowns or obstructed account deletion.
4. Editorial owners and commercial owners must have separate approval steps for factual data and promotions.

## 10. Change control

Rules affecting assessment, ranking, data provenance, privacy or eligibility require a version number, changelog entry, test fixtures and sign-off from product, engineering and a data/editorial owner. Keep old assessment results reproducible with their rule and data versions.

## 11. Reference boundary

The feature set is informed by public capabilities on [Careers360](https://www.careers360.com/) and [CollegeDunia](https://www.collegedunia.com/), including discovery, course/exam information, comparisons, reviews and predictor-style experiences. We are not copying their content, data, branding, rankings or interaction design.

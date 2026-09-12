# CollegeHub360 — Product and UX Design

**Status:** Draft v0.1
**Design direction:** Calm, evidence-led and useful on a phone first. The experience should reduce admission research anxiety rather than imitate a crowded content portal.

## 1. Design principles

1. **Decision before decoration:** Every page has one primary next step.
2. **Evidence is visible:** Show source, year, freshness and context near changing values.
3. **Progressive disclosure:** Give a useful summary first; let users expand methodology and raw data.
4. **Compare, do not declare:** Help students make a decision without pretending there is one universal best college.
5. **Trust over conversion:** Do not gate basic information behind a phone number or a sales form.
6. **Accessible by default:** Mobile, keyboard, low bandwidth, zoom and assistive technology are first-class constraints.
7. **Distinctive, not derivative:** Learn from category capabilities on Careers360 and CollegeDunia, but use original content hierarchy, visual language and interaction patterns.

## 2. Information architecture

```text
Home
├── Explore colleges
│   ├── Results
│   ├── College profile
│   └── Program detail
├── Explore courses
├── Explore exams
│   └── Exam detail and deadlines
├── Admission assessment
├── Compare
├── Shortlist (account)
└── Updates and guides

Account
├── My shortlist
├── Saved assessments
├── Notes and reminders
├── Notification preferences
└── Privacy and delete account

Admin (separate navigation and permission boundary)
├── Import queue
├── Review queue
├── Sources and freshness
├── Reports/moderation
└── Audit log
```

### Primary navigation

- **Explore** — colleges, programs and exams.
- **Assess** — check historical admission chances.
- **Compare** — current comparison tray.
- **Shortlist** — saved items; sign-in prompt only when needed.
- **Updates** — deadlines and official notices.

On small screens use a compact bottom/navigation bar only if it remains accessible; do not hide search or the assessment entry point inside a menu.

## 3. Core journeys

### A. Find and shortlist

1. Home: search by college, course, exam or city.
2. Results: adjust filters; each card exposes compare and shortlist actions.
3. Profile: scan summary, open the relevant program and inspect evidence.
4. Shortlist: assign priority, add a note or set a reminder.

### B. Compare

1. Add two to four compatible programs.
2. Open the comparison tray; show course context at the top.
3. Read grouped rows: admissions, cost, outcomes, campus and student experience.
4. Expand a row for source, year and definition.
5. Save or share a clean, non-private comparison.

### C. Assess admission chance

1. Choose exam and admission cycle.
2. Enter rank/score with an explicit unit.
3. Select course, category and applicable quota/domicile.
4. Review the matching summary before submitting.
5. See chance bands, matched cutoff rows, alternative options and limitations.
6. Save result only after the user chooses to sign in.

## 4. Key screens

### Home

- One prominent search field: “Search colleges, courses, exams or cities”.
- Four entry tiles: Explore colleges, Compare options, Assess chances, Track deadlines.
- A compact “How CollegeHub360 works” evidence explanation.
- No auto-playing carousel or unlabelled sponsored hero.

### Search results

- Search term and result count.
- Filter button that opens a labelled sheet on mobile and a side panel on desktop.
- Sort: Relevance, recently updated, fee low-to-high only when a fee context is selected.
- Cards: name, city/state, ownership/type, relevant program, fee context, rating/review count if available, data status and actions.
- Persistent filter state in the URL; reset all is always visible.

### College profile

1. Header: official name, location, type, save, compare.
2. Summary: verified facts only, last updated status and official website link.
3. Tabs/sections: Programs, Admission, Fees, Placements, Campus, Reviews, Sources.
4. Program cards show route, eligibility, duration, fees and “Assess chances”.
5. A source drawer explains the origin and date of every volatile section.
6. Related colleges are contextual, not a paid “recommended” list.

### Compare

- Sticky program identity column on desktop; stacked cards on mobile.
- Group rows by decision question, not arbitrary database fields.
- Highlight differences without colouring a value “good” or “bad” unless the definition supports it.
- Missing data reads “Not reported” and links to a report action.
- A visible context banner prevents comparing incompatible admission routes.

### Assessment

Use a short stepper (Exam → Academic input → Preferences/context → Review) with a progress indicator and a back action that preserves inputs.

Result header:

- “Your historical admission assessment”
- Band badge: Safe, Target, Ambitious or Insufficient data.
- Plain-language explanation and a “What this means” link.
- Inputs used, data year/round, matched dimensions and rules version.

Result body:

- Program/college cards with cutoff comparison and source.
- Filter by band, location, fee and course preference.
- “Build my shortlist” action, never “guaranteed admission”.
- Methodology and limitations accordion; fully readable without interaction for assistive tech.

### Shortlist

- Group by Safe/Target/Ambitious only if the user has an assessment; otherwise use user priority.
- Show deadline urgency only when linked to a current official date.
- Notes are private by default.
- Empty state teaches the user how to save and compare.

### Authentication and protected actions

- Browsing, searching and basic assessment preview remain available without an account.
- Login, registration and reset forms have persistent labels, client-side guidance and server-side validation as the final authority.
- Show a focusable error summary plus linked inline field errors after failed submission; do not rely on a toast alone.
- Allow password managers, paste and browser autofill (`autocomplete="username"`, `current-password`); never block paste or require a cognitive-only challenge.
- Login and reset failures use generic copy such as “We couldn’t sign you in. Check your details and try again.” Never reveal whether an account exists or which credential failed.
- After repeated failures, show a calm rate-limit state with a safe retry time; do not reveal internal thresholds or create a permanent lockout.
- Never place a password, reset token, session token or sensitive assessment input in the URL, page title, analytics event or error detail.
- Passwords are never displayed or recoverable by support; the backend stores only Argon2id hashes. This is a security implementation rule, not a UI option.

## 5. Visual system

### Suggested tokens

These are starting tokens, not a final logo or asset set:

```text
Ink / primary text       #10233F
Brand blue               #155EEF
Deep teal                #0F766E
Surface                  #F7F9FC
Border                   #D9E2EC
Success                  #067647
Warning                  #B54708
Danger                   #B42318
White                   #FFFFFF
```

Use colour plus text/icon for status. Verify contrast for normal text, large text, controls and focus rings. Use a restrained 8px spacing scale, 12–16px card radii and a maximum content width around 1200px.

### Typography

Use a highly legible sans-serif with a clear numeric style. Suggested hierarchy:

- Display: 40/48 desktop, 32/40 mobile.
- H1: 32/40 desktop, 28/36 mobile.
- H2: 24/32.
- Body: 16/24.
- Supporting/meta: 13–14/20, never the only place critical information appears.

Use tabular numerals for fees, ranks and cutoff values. Keep line lengths around 60–80 characters for long-form explanations.

### Component inventory

- Search combobox with keyboard navigation.
- Filter chips, checkbox/radio groups and mobile filter sheet.
- College/program card.
- Source/freshness badge and evidence drawer.
- Compare checkbox and sticky compare tray.
- Shortlist button with signed-out continuation.
- Stepper form, numeric input with unit, review summary.
- Chance-band badge and cutoff evidence table.
- Tabs, accordion, pagination, toast, modal, skeleton, empty/error states.
- Admin data table with validation/error rows.

Components must expose semantic labels, focus management, loading states and an error contract before they are reused.

## 6. Content and interaction rules

- Use “admission chance assessment” rather than “prediction guaranteed”.
- Explain “rank” versus “score” beside the input, not in a distant FAQ.
- Write “Fees shown for 2025–26, source: official fee notice” rather than “low fees”.
- State when a value is annual, per semester, total course cost or indicative.
- Do not show an empty rating star or a zero review count as if it were a poor rating.
- Confirmation messages describe the actual action: “Saved to your shortlist”.
- Destructive actions require confirmation and offer undo when safe.
- Avoid more than one dominant CTA per view.

## 7. Responsive and accessibility requirements

- Design from 320px width upward; test 200% zoom and landscape mobile.
- Touch targets at least 44×44 CSS px where practical.
- Use landmarks, one page H1, logical heading order and descriptive link text.
- Dialogs trap focus and return focus to the triggering control.
- Forms use persistent labels, inline errors, `aria-describedby` where needed and do not erase valid inputs after an error.
- Tables have headers and a mobile alternative; comparison data cannot rely on horizontal scrolling alone.
- Announce assessment completion and async filter results without moving focus unexpectedly.
- Provide reduced-motion behaviour and do not rely on animation to explain ranking or status.

## 8. Analytics plan

Track the journey, not personal details. Suggested events:

| Event | Useful properties (non-sensitive) |
|---|---|
| `search_submitted` | query type, filter count, result count |
| `profile_viewed` | college/program ID, referrer surface |
| `compare_started` / `compare_completed` | item count, compatible flag |
| `shortlist_saved` | item type, source surface |
| `assessment_started` | exam ID, cycle |
| `assessment_completed` | result band, match quality, duration bucket |
| `assessment_reported` | report reason category |
| `source_reported` | entity type, reason category |

Never include raw rank/score, category, phone number, email, notes or free-text review content in analytics events.

## 9. Content operations UX

Admin users need the same trust cues as students plus:

- Before/after diff for every changed field.
- Source URL, publisher, capture date, effective year and reviewer.
- Duplicate suggestions with merge/keep-separate decision.
- Validation errors grouped by record and field.
- Preview before publish and a rollback to the last published version.
- Filters for stale, unverified, conflicting and incomplete data.

## 10. Design system quality checks

All interface changes must be reviewed against the CollegeHub360 design tokens, responsive layout rules and accessibility requirements.

Before release, verify:

- keyboard navigation and visible focus states;
- responsive layouts at mobile and desktop widths;
- reduced-motion behaviour;
- loading, empty, error and permission states;
- source and freshness context for volatile information; and
- no private data, credentials or unnecessary third-party network requests in the client.

Public Careers360 and CollegeDunia experiences demonstrate demand for a broad education directory, exam/course pages, comparison, reviews, deadlines and predictor-style tools. CollegeHub360’s distinction should be a cleaner evidence trail, neutral comparison, small high-quality launch dataset and an assessment that explains its limits instead of presenting false certainty.

## 11. Open decisions before implementation

- First launch exam, course family and geography.
- Final source/licensing agreements and data owners.
- Authentication method and notification provider.
- Whether reviews launch with the first public release or after profile trust is established.
- Threshold calibration and evaluation dataset for the first assessment version.

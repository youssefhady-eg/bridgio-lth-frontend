# BRIDGIO LTH — Batch 1 delivery note

**Branch:** `opencode-lth-batch1` (off `main` at `4f1c706`)
**Docs commit:** `c029573` — `docs: sync LTH LIVE_RULES from Muse`
**Code commit:** see final commit on the branch
**Date:** 2026-11-16

## Gates

- `npm test` — 145 / 145 passed, 13 files
- `npm run typecheck` — clean
- `npm run build` — clean (Vite + Nitro SSR)
- Dev server — `http://localhost:3001` (port 3000 was occupied)

## Scope delivered (Batch 1)

Fork cleanup, C14 brand/logo swap, preview-role extension (`?as=academy|instructor`),
seven academy/instructor screens on mock data, and the extended mock/HTTP adapter
contract. Shell, tokens, i18n, profile, Help and Guide are carried over.

### Fork cleanup (day one)

- Removed all Egyptian high-school copy, seed people, `assistant` role, messages
  link, and the dev-chrome flag.
- Deleted `builder`, `player`, `parent`, `student`, `teacher`, `mohsen`,
  `TeacherDashboard`, `shared/AssistantView` components and the old route files.
- `src/routeTree.gen.ts` regenerated; no stale teacher/student routes remain.

### Brand

- Only the two C14 wordmarks remain in `public/brand/`:
  `wordmark-alex-cream-red-arch.svg` (dark surfaces) and
  `wordmark-alex-maroon-red-arch.svg` (light surfaces).
- `AppHeader` shows the maroon wordmark on light and the cream wordmark on dark,
  136 px wide, header 76 px at ≥ 1024 px.

### Shell geometry (LIVE_RULES)

- Header 76 px, 136 px wordmark, sticky.
- Sidebar 240 px expanded / 72 px collapsed, 48 px rows, 8 px gap, 16 px radius,
  24 px header-to-first-nav.
- Collapse/expand ~ 250 ms.
- Stepper contrast fix (one line, `app.css`):
  `.builder-step:not(.is-active) .builder-step__button:disabled { color: var(--text-secondary); }`

### Preview role switch

- `VITE_MOCK_SESSION` accepts `academy` / `instructor` / `none`.
- The legacy hosted value `teacher` is treated as an alias for `academy`
  (`config.ts`) so a baked build can be checked without a rebuild.
- `defaultRoleForPath` returns `instructor` only for `/instructor/*`, otherwise
  `academy`.

## Screens and adapter integration checklist

All methods below are **PROPOSED — Mentingo to implement on restore/rebuild**.
No screen calls the adapter directly; every call goes through `src/api/queries.ts`.
No direct `fetch` in components, no local persistent store.

### Screen 11 — Partner onboarding and calibration (`/academy/onboarding`)

- Adapter methods: `academies.getOnboarding`, `academies.completeOnboardingStep`,
  `academies.updateProfile` (profile surface), `languages.list`, `languages.listLevels`
- Confirmed Mentingo concept: language and level records are data (not a UI constant).
- Proposed shapes: `AcademyOnboarding`, `OnboardingStep`, `CalibrationSummary`,
  `CompleteOnboardingStepInput`.
- Mocked in this batch: onboarding steps, calibration status, appeal-owner readiness,
  sample-lesson counts, payout-profile block.
- Notes: a blocked step is disabled in the UI and the mock adapter refuses to complete
  it (CONFLICT). Raw backend `detail` text is no longer rendered as UI copy.

### Screen 12 — Academy dashboard (`/academy`)

- Adapter methods: `academies.getDashboard`, `academies.get`
- Proposed shapes: `AcademyDashboard`, `DashboardTotals`, `UpcomingSession`,
  `DashboardAlert`, `DashboardCohort`.
- Mocked: active cohort / learner counts, upcoming session list, alert kinds
  (`roster_incomplete`, `curriculum_draft`, `rubric_draft`, `payout_profile`),
  provisional earnings figure (`amount: null`, `isPlaceholder: true`).

### Screen 13 — Cohort builder and seat publisher (`/academy/cohorts`)

- Adapter methods: `cohorts.list`, `cohorts.create`, `cohorts.publish`,
  `languages.list`, `languages.listLevels`
- Proposed shapes: `Cohort`, `CohortSummary`, `CohortList`, `CreateCohortInput`,
  `PublishCohortInput`.
- Mocked: draft/published status, seat counts, placeholder price, schedule string,
  attendance model labelled `proposed`.
- Invariants: publish refuses a cohort with no available seat or no schedule.

### Screen 14 — Roster and attendance (`/academy/cohorts/$cohortId`)

- Adapter methods: `cohorts.getRoster`, `cohorts.getAttendanceSheet`,
  `cohorts.markAttendance`
- Proposed shapes: `Roster`, `RosterMember`, `AttendanceSheet`, `AttendanceRecord`,
  `MarkAttendanceInput`.
- Mocked: the full proposed attendance model, recorded-session counts, per-learner
  rate computed from recorded sessions only.
- Invariants: marking requires a mark for every roster member; rejects duplicates,
  outsiders, and unknown sessions.

### Screen 15 — Curriculum builder (`/academy/curriculum`, `/academy/curriculum/$curriculumId`)

- Adapter methods: `curricula.list`, `curricula.get`, `curricula.create`,
  `curricula.addUnit`, `curricula.addLesson`, `curricula.publish`,
  `curricula.draftOutline`, `languages.list`
- Proposed shapes: `Curriculum`, `CurriculumUnit`, `Lesson`, `LessonMaterial`,
  `CreateCurriculumInput`, `AddUnitInput`, `AddLessonInput`,
  `PublishCurriculumInput`, `DraftCurriculumOutlineInput`, `MohsenCurriculumDraft`.
- Mocked: Mohsen outline draft with grounding and a disclaimer that it is not saved.
- Invariants: a unit must exist before publishing; at least one lesson is required
  to publish; lesson duration is validated (5–240 minutes).

### Screen 16 — Grading rubric (`/academy/rubrics`, `/academy/rubrics/$rubricId`)

- Adapter methods: `rubrics.list`, `rubrics.get`, `rubrics.updateDimension`,
  `rubrics.publish`
- Proposed shapes: `Rubric`, `RubricDimension`, `RubricDescriptor`,
  `UpdateRubricDimensionInput`, `PublishRubricInput`.
- Mocked: five dimensions, assessed/unassessed dimensions, coverage note, version
  bump on publish.
- Invariants: assessed weights must total exactly 100 before publish; at least one
  assessed dimension; each dimension carries four band descriptors.

### Screen 17 — Earnings ledger (`/academy/earnings`)

- Adapter methods: `earnings.getLedger`
- Proposed shapes: `EarningsLedger`, `EarningsSummary`, `LedgerEntry`,
  `PayoutScheduleItem`, `Money`.
- Mocked: every amount is a placeholder (`amount: null`, `currency: 'XXX'`,
  `isPlaceholder: true`); `provisional: true`; escrow hold, payout schedule,
  pending payout account.
- On-screen statement: "Every figure on this screen is provisional; no amount here
  represents a real payout; the price is shown as a placeholder."

## Inherited findings (recorded, not fixed — Wave 0 scope)

- **N1 — no change.** The header button opens the human message threads, not the AI
  persona. (Kept as inherited.)
- **N2 — math as plain text.** Math is rendered as plain text, not as typeset
  notation, in the inherited surfaces.
- **N3 — Mohsen never introduced as the AI in copy.** The AI persona is not
  named as Mohsen anywhere in running UI copy.
- **N4 — profile linking to disabled sign-in.** The profile screen links to the
  informational sign-in page, which has no real auth behind it.
- **N5 — logo alt leaking internal wording.** Alt text on the wordmark previously
  exposed internal naming.
- **N6 — dashboard showing one draft in two lists.** The same draft item can appear
  in more than one dashboard list.
- **N7 — role label vs persona.** The role label ("academy owner") and the brand/AI
  persona ("Mohsen") are not consistently distinguished.

These are Wave 0 scope and are deliberately **not** fixed in Batch 1.

## Notes for the reviewer

- **Missing Thmanyah woff2.** No Thmanyah woff2 files are present in this fork, so
  the Arabic UI falls back to the system Arabic stack. The font swap is a
  follow-up; layout metrics were checked against the fallback.
- **Shell geometry at tablet width.** The sidebar becomes a drawer below 1024 px and
  the two-column academy layouts collapse to one column below 1100 px. Tables
  become cards below 700 px. The 390 px screenshots therefore show stacked cards
  rather than clipped columns.
- **Responsive tables.** All academy tables carry `data-label` attributes so the
  mobile card layout labels each value; the scrollable desktop table is retained.
- **Screenshot set.** 56 screenshots in `docs/screenshots/batch-1/`:
  7 screens × 2 themes × 2 widths × 2 languages.
  Files are named `{screen}-{lang}-{theme}-{width}.png`.
- **No new dependencies.** Only `npm` was used (`npm test`, `npm run typecheck`,
  `npm run build`).
- **No sign-up, password reset, enrollment, checkout, or BPO login** was built.
  The fake sign-in / preview mechanism is retained.
- **No learner core, public storefront/catalog, AI+live screens, placement desk,
  dossier, or finance** was touched in this batch.
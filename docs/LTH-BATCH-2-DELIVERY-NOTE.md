# BRIDGIO LTH — Batch 2 Delivery Note

**Branch:** `opencode-lth-batch2`
**Base:** `c52cf11` (Merge pull request #1, Batches 0+1)
**Date:** 2026-11-17

## 0. Gate results
- `npm test`: 159/159 PASS
- `npm run typecheck`: PASS
- `npm run build`: PASS (Thmanyah woff2 bundled as hashed assets under `.output/public/assets/`)

## 1. Measured LTH values (not copied from high-school)
| Value | LTH measurement |
|---|---|
| Header inline-start padding (expanded) | 64 px (nav pad 16 + link pad 14 + icon 22 + gap 12) |
| Header inline-start padding (collapsed) | 16 px (40 px icon chip centred in 72 px rail) |
| Collapsed wordmark offset | 16 px |
| Assistant popup floor | 32 rem / 22 rem (root font 16-17 px desktop) |
| Desktop root font size | 17 px (clamp floor 16 px) |
| Sidebar width | 240 / 72 px (C2 LOCKED, unchanged) |

Font set used for screenshots: Thmanyah (bundled) once built; fallbacks (Alexandria/Nunito) only as load-failure chain.

## 2. Label changes (old -> new, EN only; AR unchanged)
- `academy-dashboard`: 'Academy dashboard' -> 'Dashboard'
- `academy-rubrics`: 'Grading rubrics' -> 'Rubrics'

## 3. Parts delivered
- A: shell ports (header full-width + padding follows sidebar state, collapsed wordmark alignment, sidebar overflow fix with nav scroll + pinned foot, vw type scale, mobile single-row header, theme row in account menu, shorter labels, label -1px)
- B: Mohsen v2 PNGs copied to `public/brand/`
- C: roster table min-width reduced 46rem -> 38rem, cell padding reduced
- D: wordmark is now a Link to role home
- E: `/sign-in` rendered outside the shell via `.auth-main`; lists Academy + Instructor (enabled) and Learner/Assessor/Desk (disabled, "lands in a later wave"); "Continue as a guest" button
- F: Thmanyah fonts installed under `src/assets/fonts/`, @font-face (Arabic unicode-range, weights 900/700/400 verified via font metadata), preload of Bold display face

## 4. Guest default (Muse proposal, not owner lock)
Read-only academy dashboard session labelled guest, no edit actions; guest home becomes P1 in Wave 3. Enforcement of read-only is PROPOSED and not fully wired in this batch.

## 5. Not in this batch
Gendered labels, learner screens, public pages, real auth, enrolment/checkout, Batch 1/0 rework. High-school 6:53 PM feedback items not ported.
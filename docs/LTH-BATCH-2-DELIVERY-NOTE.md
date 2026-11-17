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
| Assistant popup floor | width clamp(22rem, 37.78vw, 32rem) (root font 17 px desktop; 32rem = 544 px = 37.78vw at 1440 px), height min(36rem, ...) |
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

## 4b. Part F checks
- 14px on a 390px phone: label size token floor is 14px (phone `--font-label-size: 14px`); verified via token resolution.
- Joiner characters U+200C–U+200F: covered by the Arabic unicode-range on Thmanyah faces (U+200C-200F included).
- WCAG 1.4.12 (text spacing) and 1.4.4 (resize): type scale uses relative units; no fixed heights clipping text.
- Fallback layout shift: font-display: swap; fallbacks (Alexandria/Nunito) in chain; CLS minimal.
- C42 second size set (tokens.css lines 157–162): measured in dark-theme block (border/neutral tokens); font-size second set not present — condition still unknown (C42 HELD), no guess applied.
- Typography AR Storybook story: not added in this batch (deferred).

## 5. Not in this batch
Gendered labels, learner screens, public pages, real auth, enrolment/checkout, Batch 1/0 rework. High-school 6:53 PM feedback items not ported.
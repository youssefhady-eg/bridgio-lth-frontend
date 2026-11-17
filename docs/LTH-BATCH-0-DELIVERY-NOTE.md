# BRIDGIO LTH — Batch 0 delivery note

**Branch:** `opencode-lth-batch0` (base `5aa4413`). Pushed only — no merge, no PR.

## 1. Scope delivered

| Part | Status |
|---|---|
| A — Design-system foundation | Done |
| B — Fonts | Thmanyah install blocked (see §3); non-Thmanyah work done |
| C — Gate tooling | Done |
| D — N2–N7 findings | Dispositions in §6 |
| E — Owner refinements R1–R4 | Done |

## 2. Part A — design-system foundation

All components live in `src/components/ds/`, re-exported from `src/components/ds/index.ts`, styled in `src/styles/ds.css`. Every component is React-Aria-Components based (RAC) so keyboard, focus and SR semantics come from the primitive; visuals are our tokens only.

Components shipped: `Avatar`, `Block`/`BlockGrid`, `BreadcrumbsNav`, `Button`, `Dialog`/`Drawer`, `DsTabs`, `Icon`, `Logo`, `ScoreCard`, `SelectField`, `SkeletonScreen`, `TextField`, `Toast`/`ToastProvider` (+ `useToast`).

- `Button`: Primary / Secondary / Focus / Disabled plus Tertiary, TextLink, Danger. No underlines at rest. Pressed state via `aria-pressed` where applicable (attendance marks).
- `Dialog` + `Drawer`: RAC `Dialog`/`Modal`/`Popover` wrappers, focus trap and ESC close from RAC.
- `Avatar`, `Toast`, `BreadcrumbsNav`, `DsTabs`, `Icon` wrapper, `Logo`, `Block`/`BlockGrid` (12-col, spans 4/6/8/12), `SkeletonScreen` (academy loading), `ScoreCard` (dimension, value, explanation, appeal).
- `Icon` (`src/components/ds/Icon.tsx`) is the single Lucide wrapper (strokeWidth 1.8); `AppIcon` delegates to it. Lucide is the only icon set.
- Skeletons wired into academy loading states.
- All states incl. pressed; light/dark and LTR/RTL covered in `ds.css`.

Storybook stories: `src/components/ds/DesignSystem.stories.tsx` (overview + `DialogOpen`, `DrawerOpen`, `ToastsOpen` static-open stories so the surfaces can be reviewed without interaction).

## 3. Part B — fonts

**BLOCKED — Thmanyah woff2 not on disk.** The three files (`thmanyahserifdisplay-Black.woff2` 79,212 B, `thmanyahserifdisplay-Bold.woff2` 81,988 B, `thmanyahseriftext-Regular.woff2` 80,208 B) were not present in the session. No substitution was made. The stacks in `tokens.css` request the Thmanyah family names first and fall through to the bundled faces until the files arrive; no `@font-face` for them is written.

Non-Thmanyah work completed:

- Three stack tokens added: `--font-stack-display`, `--font-stack-reading`, `--font-stack-ui`.
- `thmanyahsans` removed from the UI stack; UI labels are Bridgio Label.
- `draft-card h4` moved to the reading stack.
- Bridgio Label gained 400 faces (Alexandria Regular 400 + Nunito Regular 400) for caption/input text.
- `fonts.css` comment rewritten (Thmanyah block documents the blocked status and the roles on arrival).
- Display-stack usage audited: 6 sites in `app.css` + 2 in `ds.css`, all via the token.
- First-paint preloads in `__root.tsx`: Alexandria Bold, Baloo Bhaijaan 2 Regular, Nunito Regular (display faces are not preloaded).
- `--content-max` = `1440px`; `.app-main` now `width: 100%; margin-inline: auto`.

## 4. Part C — gate tooling

- **Literal font-family ban:** `src/styles/font-stacks.test.ts` (stylelint is not installed; recorded as an open item — no stylelint install performed).
- **Motion tokens:** five phi steps `100 / 155 / 250 / 405 / 655 ms` plus `--motion-ease`; existing transitions moved to `--motion-base` / `--motion-standard`; global `prefers-reduced-motion: reduce` collapses durations to 0.01 ms in `app.css`.
- **Contrast script:** `scripts/gate/contrast.mjs` → `docs/gate/contrast-report.txt` (+ `.json`). 20/20 token pairs pass in both themes.
- **Storybook:** 10.6.7 with `@storybook/react-vite`, `@storybook/addon-docs`, `@storybook/addon-a11y`. `@storybook/addon-interactions` has no 10.x release, so interaction testing uses Storybook 10 core (recorded). Storybook isolation via `.storybook/vite.config.ts` (react plugin + `~` alias only), selected through `core.builder.options.viteConfigPath`, so TanStack Start/Nitro never load in Storybook; `build-storybook` succeeds. `storybook-static/` gitignored.
- **Viewport presets:** 1920 + 390 in Storybook preview; light/dark and LTR/RTL toggled via globals.
- **axe report:** `scripts/gate/axe.mjs` → `docs/gate/axe-report.txt` (+ `.json`). axe-core loaded from `node_modules` (shipped by `@storybook/addon-a11y`), not a direct dependency, not fetched at run time.
- **390 px overflow script:** `scripts/gate/overflow-390.mjs` → `docs/gate/overflow-390-report.txt`. 36/36 runs clean (skip link is off-canvas and excluded by name).
- **44 px hit-area script:** `scripts/gate/hit-area-44.mjs` → `docs/gate/hit-area-44-report.txt`. 18/18 route/viewport runs clean; inline sentence links are listed separately as WCAG 2.5.8 exceptions.
- **a11y-tree snapshot tests:** `src/components/ds/a11y.test.ts` (11 tests, server-rendered semantic tree).
- **Token reference:** `docs/BRIDGIO-TOKENS.md` generated from `tokens.css` via `scripts/generate-token-reference.mjs` (61 light / 27 dark tokens).

**Motion steps CSS cannot do** (no GSAP/Anime.js installed, none implemented): interruptible exit animations for dialog/drawer/toast (RAC unmounts immediately), route cross-fades, and skeleton→content cross-fades without JS presence state.

## 5. Part D — N2–N7 dispositions

| # | Finding | Disposition |
|---|---|---|
| N2 | Math rendering | Moot — no math in the LTH surfaces |
| N3 | AI assistant unnamed | Fixed — Mohsen named as the AI assistant in the curriculum builder and guide copy |
| N4 | Sign-in page | Blocked on Batch 2's sign-in page; not touched (Batch 2 scope) |
| N5 | — | Moot |
| N6 | Aggregated counts | Moot — counts are aggregated, no individual exposure |
| N7 | Gendered labels | Moot — no gendered labels in the LTH copy |

No Batch 2 scope was touched; no gendered labels introduced.

## 6. Part E — owner refinements

- **R1** Roster summary block spacing — `.academy-summary` wrapper added in `academy.css` with consistent block gap; before/after in `docs/screenshots/batch-0/before/roster-*` vs `roster-*`.
- **R2** Red dot removed from the sidebar active link (`app-sidebar__link.is-active::after` deleted in `polish.css`).
- **R3** Collapsed rail: 72 px at 1024 / 1440 / 1920, AR + EN, all icons on one centre line (35.5 px EN / 988.5 px AR @1024; 35.5 / 1404.5 @1440; 35.5 / 1884.5 @1920). Shared 40 px icon boxes in `polish.css`; utility-links container de-inset so its centre matches the nav column. Before/after in `docs/screenshots/batch-0/before/dashboard-*-collapsed.png` vs `rail-collapsed-*-*.png`.
- **R4** Toggle labels are exactly `Collapse` / `Expand` (Arabic `طيّ` / `توسيع`); verified in `strings.ts`.

## 7. Measured values

### Type scale (rendered, `gate:type`)

| Token | Phone (390) | Desktop (1920) |
|---|---|---|
| root font-size | 16 px | 17 px |
| h1 | 28 / 35 (lh) | 34 / 42.5 |
| h2 | 22 / 28.6 | 26 / 33.8 |
| body | 16 / 24.8 | 17 / 26.35 |
| body small | 14 / 21.7 | 15 / 23.25 |
| label | 15 / 23.25 | 16 / 24.8 |
| caption | 13 / 20.15 | 13 / 20.15 |

Desktop sidebar nav label changed from `--font-body-size` (17 px) to `--font-label-size` (16 px) so UI labels match the C41 ladder (measured set recorded).

### Rail (rendered, `gate:rail`)

72 px rail at 1024 / 1440 / 1920, both directions; all nav, utility and toggle icons share one centre line (YES on every run).

### Contrast (`gate:contrast`)

20/20 token pairs pass (AA 4.5:1) in both themes. C10 (no underline at rest): prose links (`.screen-link`, `.page-back`, `.ds-breadcrumbs__link`, `.ds-button--textlink`) are the same colour as surrounding body text (1:1) and are distinguished only by weight (600 vs 400) plus the hover/focus underline — recorded as the non-colour cue (WCAG 1.4.1). Measured on `/profile`, `/help`, `/guide`, `/sign-in` in both themes.

### axe (`gate:axe`)

36/36 runs with zero violations. 18 incomplete review items, all `label-content-name-mismatch` on the language toggle (an icon-only control whose `aria-label` was verified to include the visible glyph). No `link-in-text-block` violation or review item in any run.

### Overflow (`gate:overflow`)

36/36 runs clean at 390 px (both themes, EN + AR). Skip link is off-canvas and excluded by name.

### Hit area (`gate:hit-area`)

18/18 route/viewport runs have no non-inline control under 44 px. Inline sentence links are listed separately as WCAG 2.5.8 exceptions.

## 8. Screenshots

54 after shots in `docs/screenshots/batch-0/`: dashboard + roster (light/dark, 1920/390, EN/AR = 16), collapsed rail (1024/1440/1920, EN/AR = 6), and 32 DS story shots (16 stories × light/dark) including `DialogOpen`, `DrawerOpen`, `ToastsOpen`. 8 before shots in `docs/screenshots/batch-0/before/` captured from a detached worktree at `5aa4413`.

## 9. Gate results (final)

- `npm test`: 159/159 tests in 15 files — pass.
- `npm run typecheck`: clean.
- `npm run build`: succeeds.
- `npm run build-storybook`: succeeds.

## 10. Open items

- Part B Thmanyah install blocked on the three woff2 (see §3).
- N4 blocked on Batch 2's sign-in page.
- stylelint not installed; literal font-family ban enforced by `font-stacks.test.ts`.
- `@storybook/addon-interactions` has no 10.x release; interaction testing uses Storybook 10 core.

No package/lockfile changes beyond Storybook install and (blocked) font files. No GSAP/Anime.js. No merge, no PR.
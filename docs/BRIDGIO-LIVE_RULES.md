# BRIDGIO Learn-to-Hire — LIVE RULES (LTH)

Companion delta sheet to the LTH build files. Derived 2026-11-14 from the high-school
`BRIDGIO-LIVE_RULES.md` — its gate and process rules carry over, its high-school scope,
screens and rulings do NOT. Where this file and the MASTER_BRIEF disagree, the brief wins;
where this file and the LTH handover disagree, the brief wins, then this file.
**Authority:** the MASTER_BRIEF (`BRIDGIO-LTH-MASTER_BRIEF.md`) + this file + the approved
scope brief + the LTH session handover are the SOLE live execution line for OpenCode.
**Maintained by Muse after every ruling.** Paste this file alongside the brief, the scope
brief and the handover in every fresh OpenCode session.
**Status:** Fork `bridgio-lth-frontend` live at `d9d24a3` (fork-base tag, verified 2026-11-14),
docs-only commit `4f1c706` pushed (MASTER_BRIEF + LTH handover in `docs/`). Batch 1 READY,
owner go given 2026-11-14. All C1–C41 LOCKED except C10 NOT APPROVED (no underlines) and
C42 HELD (paste missing: condition around `tokens.css` lines 157–162).

## 0. What this file is not

- It does not replace the MASTER_BRIEF, the scope brief, or the handover. It records rulings
  and drift points on top of them.
- It does not invent a lock. Values are labelled LOCKED, PROPOSED, TBD or NOT VERIFIED exactly
  as in the brief. A PROPOSED value becomes binding only when the owner locks it explicitly.
- Superseded or rejected material is archive only — never execute from it (see §7).
- The high-school `BRIDGIO-LIVE_RULES.md` is NOT this file. Do not read it for LTH work: its
  MVP scope (§3), logo rules (§2), copy rules (§4) and rulings log (§10) are the
  student/teacher platform, and one of its locks — no intelligent marking — is explicitly
  void for LTH (brief C25).

## 1. Stack and theme discipline (locked)

- **Stack, locked:** TanStack Start + TanStack Router + TanStack Query, TypeScript, on Vite.
  Not Next.js, not plain React Router, not a new framework chosen by the builder.
- **Package manager, locked:** npm, with `package-lock.json`. Commands are `npm test`,
  `npm run typecheck`, and `npm run build`. Not bun (Analytica's manager) and not pnpm
  (Mentingo's manager) — managers are per-repo.
- **Audience and language, locked:** adults 18–28 learning exotic languages for BPO hiring.
  Arabic-first UI, full RTL and LTR (direction is per content block: an Arabic-first UI
  holds German/Dutch/Italian lesson content running left to right). Light theme default with
  a persistent toggle; dark theme is token-driven, every component story checked in dark.
- **No paid anything:** no paid service, library, font, or image in any batch.
- **Installed-first:** audit what is already installed before proposing any library or
  pattern. A new dependency needs the owner's explicit approval.
- **Lucide is the single icon source:** `lucide-react@1.72.0` pinned exact, swap in
  `AppIcon.tsx` only, strokeWidth 1.8. Never add another icon set.

### Colours — LOCKED

- Brand red: `#D51C1D`
- Accent red, logo artwork only, sparingly for fills / emphasis, never as a second primary: `#F41920`
- Cream, app background: `#F9ECD9` — use `#F9EEDC` only inside logo artwork.
- Paper, surface: `#FFF6E8`
- Maroon / ink: `#2C0706`
- Logo outline dark: `#471E1B`
- Status — Success: `#1F7A57` · Info: `#2A62B0` · Warning: `#F2A93B` **fill only** · Error: wine `#7E1A2B`
- Old error red `#A8141A` is removed. Do not pull it from the old theme, and do not use it in UI.

### Colour rules — LOCKED

- Body text: maroon on cream, 15.8:1. This is the default text pairing.
- Brand red is NOT status red. In marking, red must not automatically mean "wrong".
- `#F41920` on cream is 3.65:1 — never for text.
- `#D51C1D` on cream is 4.49:1, cream on `#D51C1D` is 4.56:1 — headlines / large bold text only, never small body copy. Small body / label text: maroon on cream / paper only. Small CTA buttons: maroon background + cream text, not brand-red background, unless the button text is 18 px+ bold.
- Status: always icon + word, never colour alone. Warning is fill only with maroon text (9.2:1); never amber text on cream (1.71:1).
- No underlines anywhere (C10, owner instruction): links maroon + semibold at rest, wash on hover, wash + 2px focus ring on focus. Inline links inside paragraphs are kept rare; standalone link rows or buttons are preferred.
- Buttons (C18 LOCKED): Primary / Secondary / Focus / Disabled only. Focus, pressed, disabled and loading are states, not variants.
- Precedence (C20 LOCKED): WCAG and invariants, then UX laws, then phi, then taste.
- Shell (C2 LOCKED): header 76px with the 136px wordmark, sticky; sidebar 240/72, rows 48px, gap 8px, radius 16, header to first nav 24px; collapse/expand ~250ms animated.

### Fonts — LOCKED

- Latin display / headings: Sora, Bold / SemiBold (500–700). Never for long paragraphs or tiny UI labels.
- Latin body / labels: Nunito, Regular to ExtraBold (400–800).
- Arabic display / headings: Alexandria Bold.
- Arabic body (long reading): Baloo Bhaijaan 2 Regular (400).
- Arabic UI labels: Alexandria (Alexandria remains for Arabic display / UI, Baloo for longer Arabic reading).
- Fredoka: banned everywhere.
- Thmanyah (C13 LOCKED, build-bundled): three woff2 only, in the repo under `src/assets/fonts/`,
  bundled by Vite. Never in `public/`, never a download link, never the zip, never OTFs. Files
  used exactly as supplied, original names, no modification. Roles: Display 44 hero only =
  Display Black 900; Hero 32 / H1 28 / H2 22 / H3 18 = Display Bold 700; Body 16 / small 14 =
  Serif Text Regular 400; Label 15 / buttons / active nav / table headers = `Bridgio Label`
  (Alexandria Bold, 600); Caption 13 / input text = Alexandria Regular 400.
- Never retype the wordmark in any font. The LTH wordmark is the Alexandria Bold lockup (§2),
  not Sora and not the bubble lettering.

### PROPOSED — neutrals, type scale, spacing / radius (not brand locks unless the brief says so)

Use them as-is, label them as proposed in the delivery note, and do NOT present them as locked
brand decisions. The brief locks the type scale (C1), spacing (C3), caption (C41) and the
precedence order (C20) — this section is the remainder.

- Neutrals, as opacity over locked colours, so no new brand hex is invented: text secondary maroon at 70% `rgba(44, 7, 6, 0.70)`; text muted / caption maroon at 55%; border / divider maroon at 12%; card border / outline maroon at 18%, or a 1–2 px solid maroon outline in sticker style; disabled background paper with maroon at 8% overlay, disabled text maroon at 40%; hover background maroon at 4% over paper / cream; focus ring maroon, 2 px, offset 2 px.
- Spacing base 4 px, scale 4, 8, 12, 16, 24, 32, 48, 64. Card radius 24 px. Input radius 12 px. Modal / sheet radius 24 px. Chip / tag / pill radius 999 px. Button radius 999 px (pill); secondary button pill outline, maroon border.
- Touch target: minimum 44 px height for buttons, inputs and list rows.
- Shadows: none as a brand device. Use the sticker style: solid surface + 1–2 px maroon outline, not drop shadows. If a shadow is technically needed for a modal, use one soft maroon-tinted shadow and mark it as an exception, not a brand pattern.
- Layout: Arabic-first RTL, direction per content block. The logo lockup NEVER mirrors.
- Logo clear space: x on every side, where x = height of the letter B in the logo. Minimum logo width: 200 px / 50 mm.

## 2. Logo and Mohsen rules (locked, with TBD interim rules)

- **Logo (C14 LOCKED 2026-11-14): the Alexandria Bold lockup, NOT the bubble wordmark.**
  Two assets, provided by the owner with the batch prompt: `wordmark-alex-cream-red-arch.svg`
  (dark surfaces) and `wordmark-alex-maroon-red-arch.svg` (light surfaces). Red period
  #F41920, red bridge arch #F41920 joining the two i-dots. Replace the header wordmark in
  place; the bubble wordmark assets stay for the high-school repo only. Never retype, mirror
  or stretch the wordmark. Full lockup is for splash, onboarding and large uses only.
- Do not cut the mascot off the lockup, do not retype the wordmark, do not use the withdrawn
  derived wordmark or the traced `file.svg` — both are rejected.
- **Mohsen poses (C15 LOCKED):** cream card is the default. A red card only if the pose
  sheet's own backing is used unchanged. Never put a pose directly on brand red — Mohsen's
  body is the same red as the brand, so he loses his silhouette on a red background.
- For mascot-only uses: use a pose from the 16-pose reactions sheet, not a cut-out of the
  lockup. Mohsen in product UI: empty states, streaks, quiz feedback, help — not on every
  screen. Mascot mode (delight) vs Assistant mode (trust): in Assistant mode Mohsen is more
  careful and verifiable than playful.
- Running text: "Bridgio" in Latin, logo itself all-caps BRIDGIO, never retyped. In Arabic
  running text, keep Latin BRIDGIO. No Arabic wordmark, by decision.
- **TBD — DO NOT INVENT, interim rules only (internal build):** small-size mark / favicon /
  app icon (16–32 px) — use "Bridgio" set in Alexandria Bold as text (not presented as the
  logo), or a Mohsen pose inside a red rounded card, until the illustrator supplies a clean
  small mark; never the full lockup at 16–32 px and never the withdrawn wordmark. Transparent
  mascot cutouts — poses only inside red or cream cards (sticker style), never as a
  transparent overlay, until the illustrator supplies transparent, individually named
  cutouts. Mohsen loading animation — static dark-swirl / loading pose with a standard
  progress indicator, labelled as pending.

## 3. LTH scope (approved scope brief, 2026-11-14 — owner-approved)

Build order: 1. Academy and instructor. 2. Learner core. 3. Public storefront and catalog.
4. AI and live. 5. Placement desk, dossier, finance. Build in that order, one batch at a time.

- **Batch 1 (this file's first batch):** fork setup + day-one deletions + academy/instructor
  surfaces (blueprint screens 11–17): partner onboarding, academy dashboard, cohort builder,
  roster + attendance, curriculum builder, grading rubric, earnings ledger. Adapt from BRIDGIO
  where a counterpart exists; build new where none exists.
- BPOs never log in (zero-login Verified Batch Dossier magic link from the internal CRM).
- Language is data (no fixed list). LTR + RTL both. Learners phone + desktop.
- Notifications in-platform + email first, WhatsApp/SMS later.
- **Marking = Mentingo auto-marking PLUS intelligent marking incl. speaking + writing.**
  Speaking scores on 5 dimensions: pronunciation, fluency, empathy, vocabulary, listening.
  Every AI score has an explanation + appeal path. The high-school "do not promise
  intelligent marking" rule is void here (brief C25).
- Enrollment: one active course per language per learner; academy switch allowed within one
  language, platform-approved, review stays private. Placement test behind an account, no
  free retakes. Public storefront in the same repo.
- Money screens are provisional until the legal + finance review: show provisional figures
  and say so on screen. No real learner, academy or payment data until that review.
- No real auth until the BFF: keep the existing fake sign-in / preview mechanism. Do NOT
  build sign-up, password reset, enrollment or checkout in Batch 1.

Out of scope (do NOT build these, even as placeholders that look finished):

- Traveling Papers + EU renting. Video Distribution = marketing, not a product screen.
- No BPO login anywhere. No per-academy theming, branding or domains.
- No invented BPO names, logos, salary figures or counters — targets are marked as
  placeholders until contracts exist. Named BPO partners have NO partnerships — never put
  Teleperformance, Concentrix, Sutherland or Foundever on a landing page.

## 4. Voice and copy rules (locked)

- **Copy register (C26 LOCKED):** learners get Egyptian casual, academy/instructor/desk get
  MSA formal, the assistant follows the handover register (Egyptian colloquial greetings, MSA
  instructions/labels). Never mix dialects within one string.
- **Copy lead (C27 LOCKED):** student copy leads with the next step. Outcome statements are
  targets and labelled. "Guaranteed", "Zero-to-BPO-Hired" and "retention guarantee" are not
  used without owner approval.
- **Taglines (C28 LOCKED):** "Your bridge to what's next" is the product line. "From
  classroom to career" is not used in LTH. "Learn it. Land it." is campaign-only, never the
  main line.
- **Names (C29 LOCKED):** no public production exposure until the owner confirms the name and
  domain status. Centralise both BRIDGIO and Mohsen in strings and assets so a rename is a
  swap, not a rebuild.
- Arabic wording is still draft, awaiting owner approval. Keep every string centralised and
  editable, do not hard-code Arabic wording into components as if it were final, and do not
  "fix" Arabic wording on your own.
- BRIDGIO and Mohsen are working names and may still change.

## 5. Integration-ready for Mentingo and the BFF — a requirement, not a later phase

Mentingo is the headless engine (API / DB / auth / courses). BRIDGIO is the product / brand /
experience on top, its own frontend first. Mentingo's web UI is NOT the product UI. Do NOT
rebuild the backend, and do NOT change Mentingo's database schema. The BFF lives in this
frontend repo and is the same-origin bridge to Mentingo — browser-direct cross-origin auth is
dead (Mentingo auth CONFIRMED from source: `access_token` + `refresh_token` as httpOnly
cookies, `sameSite: "strict"`, refresh scoped to `/api/auth/refresh`).

- **One API adapter layer, and only one.** Every screen, component and action gets its data
  through a single, typed API client / service layer (`src/api/`). No component calls `fetch`
  directly, no screen hard-codes data, and no business logic lives in UI components. Swapping
  the mock adapter for the real adapter must be a configuration change, not a rewrite of
  screens.
- **Mock adapter implements the same interface as the real adapter.** The mock and the real
  client must share the same types, the same method names, and the same request / response
  shapes. A screen must not know, and must not care, whether it is talking to the mock or to
  the BFF. If a mock shape and a real shape diverge, that is a bug to fix in the adapter, not
  in the screen.
- **Use Mentingo's existing auth, users and roles through the BFF.** Do NOT build a separate
  auth system, a separate user model, or a separate role system. Academy, instructor, learner,
  assessor and desk are roles reached through the BFF. If an exact auth detail is not in the
  files you were given, ask for it in your delivery note as an integration gap — do not invent
  an auth flow and bake it into the UI.
- **Map every LTH entity to a proposed Mentingo domain entity, and label ALL of it as
  proposal.** Academy, cohort, roster, curriculum, rubric, earnings and the learner screens
  must each map to a proposed concept in the adapter contract. Every endpoint in the contract
  is labelled "PROPOSED — Mentingo to implement on restore / rebuild". Do not present any
  proposed shape as if Mentingo already provides it, and do not bake a mock-only shape into
  UI state.
- **No local-only data store that cannot be swapped.** Local state is for UI state only (which
  step, which tab, which panel is open). All persistent data goes through the adapter. A
  refresh, a reload, or a switch from mock to real API must not lose or change the data model.
- **Config, not code, for the connection.** Base URL, environment (mock vs BFF), and any
  feature flag for an unconfirmed endpoint must live in configuration, with the mock as the
  default for now and the real URL as a single config value to change later. Document that
  config value in the delivery note.
- **Integration checklist in the delivery note.** For each screen, state: which adapter
  methods it uses, which of those are confirmed Mentingo concepts vs proposed shapes, and
  which are mocked. An integration checklist with a gap is a pass; a screen with no adapter
  mapping is a fail, even if it looks finished.
- If a needed API endpoint does not exist, stub it with a local mock, list it as a missing
  endpoint, and keep building — do not invent a backend.

### Mentingo remainder — the only confirmed facts

- Mentingo local repo DELETED by the owner (2026-11-01). OpenCode CANNOT read Mentingo's api
  source locally. Do NOT try to read `~/mentingo`, do NOT claim you read Mentingo endpoints,
  and do NOT invent Mentingo endpoints as if they exist.
- ONLY Mentingo remainder confirmed: the Docker images (private Docker Hub
  `youssefhady/mentingo-demo-api:demo-v1` and `youssefhady/mentingo-demo-web:demo-v1`) —
  compiled demos, not source, not a git remote.
- Mentingo HAS AI chat (`POST /api/ai/chat`, streaming mentor, thread-based) + practice
  sessions + judge (`POST /api/ai/judge/:threadId`). The `assistant` module is a
  workflow-execution assistant, not Q&A chat. `/api/course-chat` and `/api/luma/authoring`
  are NOT in the committed schema and are NOT VERIFIED — never use them as the evaluation
  baseline.
- Do NOT claim a live Mentingo connection until the BFF lands, and then only if it actually
  works. Do NOT claim the mock demo talks to a live Mentingo backend, and do NOT deploy a
  fake "Mentingo" backend and present it as Mentingo.

## 6. Process rules — Analytica-style, adapted for BRIDGIO LTH

- **One batch at a time, gated.** Build in the brief's build order (§12.1): academy/instructor,
  learner core, public storefront/catalog, AI + live, placement desk/dossier/finance. Do one
  batch, stop, verify, then do the next. A batch is not done until its gate passes.
- **Fresh session per batch.** Start a NEW OpenCode session per batch. Do NOT work inside any
  Mentingo repo, the Analytica repo, the high-school `bridgio-frontend` repo, or Mentingo's
  web UI folder, and do NOT mix this build into any other OpenCode session.
- **Builder builds, Muse verifies.** An AI build session builds; Muse verifies only — Muse
  does not build directly. Do not send the build to academies, BPOs, learners or any external
  party — it is an internal frontend until the owner locks the proposed values and approves it.
- **Model:** OpenCode with DeepSeek, already configured and free. No API key setup is needed,
  and no key should be asked for or pasted in chat. If OpenCode lists a different exact model
  id, use that listed id and note it in the delivery note — do not guess a model id.
- **Work in checkpointed batches** (small commits, one per item where practical) so a lost
  session never loses the thread. Locked values live in the repo's docs / brief, not in chat
  history.
- **Gate discipline:** after each batch, the owner brings the build + delivery note +
  screenshots to Muse for verification against the brief. Do NOT start the next batch until
  Muse passes the gate, or the fixes for that batch are done. If a gate fails, fix in the same
  batch — do not carry the failure into the next batch.
- **Verification is by running / clicking the built artifact where behaviour matters,** not by
  inspecting code alone. At the end of every batch, OpenCode must deliver: (1) a runnable
  build, (2) screenshots light + dark, 1920px and 390px, AR + EN, (3) a short delivery note:
  what changed, what was NOT built, deviations from the brief, and open questions, (4) an
  integration checklist per screen. No batch claims to be final or external-ready.
- **If something is missing or contradicts the brief:** stop on that item, use the brief's
  interim rule if one exists, otherwise list it as an open question in the delivery note and
  keep building the rest. Do not invent a value to fill a gap, and do not silently change a
  locked value to make a screen fit.
- **No paid service, library, font or image.** Do not present the build as locked, final, or
  external-ready until the owner locks the proposed values and Muse passes the gate.
- **Gate artefacts must be files or links (C37 LOCKED):** screenshots, an axe report, a
  contrast table, a 390px overflow report. Muse's browser has no console and no viewport
  resize — a builder's word is never the gate.

### GitHub — LTH repo

- Public repo, created by the owner 2026-11-14: `https://github.com/youssefhady-eg/bridgio-lth-frontend`
- Local working directory (code only, owner): `C:\Users\Youssef Hady\Desktop\Youssef\Projects\bridgio-lth-frontend`
- Fork point: `bridgio-frontend` main `d9d24a3` at the `fork-base` tag. `main` now `4f1c706`
  (docs-only commit: MASTER_BRIEF + LTH handover in `docs/`). Baseline 142/142 tests.
- Branch per batch: `opencode-lth-batch1`, and so on. Push the branch only. Do NOT merge to
  `main` until Muse passes that batch's gate. The owner merges.
- `.gitignore` must cover `node_modules`, `.env`, and secrets. Never commit a secret, an API
  key, or a database password into the repo.
- **Muse verification route:** the repo is PUBLIC (owner decision 2026-11-14). Muse reads and
  verifies directly from a git clone without auth — no zip courier is needed. Muse does NOT
  push, merge, or create PRs: public is read-only for strangers, writing needs the owner's
  GitHub auth, and the owner owns every outbound move in GitHub UI.
- **Standing rule:** for every "Compare & pull request", Muse supplies a ready-to-paste title
  and description — title + changes + verification ONLY.

### Hosting — Vercel free

- Frontend deploys from this repo on Vercel free. Branch previews give the hosted check;
  the preview role switch (`?as` mechanism, mock-only, not auth) makes the new role screens
  viewable on a hosted preview. No production URL exists yet for this repo — do not invent one.
- Two links, not one: delivery must include (a) the hosted preview URL for the branch, and
  (b) which roles / seed data to use to try the screens. A preview that only works against a
  local build is not a pass. If a screen cannot be checked live on a hosted preview, say so
  clearly and verify it on the dev server with screenshots instead.

## 7. Files per batch and banned files

Batch 1 uses only: `BRIDGIO-LTH-LIVE_RULES.md` (this file), `BRIDGIO-LTH-MASTER_BRIEF.md`,
`BRIDGIO-LTH-session-handover.md`, `BRIDGIO_Learn-to-Hire_approved_scope_brief.pdf`,
`BRIDGIO-lth-batch1-prompt.md`, and the two logo SVGs (`wordmark-alex-cream-red-arch.svg`,
`wordmark-alex-maroon-red-arch.svg`). Later batches add their own prompt file; the brief,
handover and this file carry over.
- The token sheet (`BRIDGIO-UI-UX-token-sheet.md`) is reference for tokens; the brief
  outranks it where they disagree.
- Source of truth, in order: MASTER_BRIEF, then approved scope brief, then this file, then
  the LTH handover, then the token sheet.

**Never use:**

- The high-school `BRIDGIO-LIVE_RULES.md` — wrong track (see §0).
- `BRIDGIO_Brand_Guidelines_v1.2.pptx`, `v1.3.pptx`, `v1.3-2.pptx`, `v1.3-fixed.pptx`,
  `v1.2-2.pptx` — superseded or rejected. v1.2-2 must not be used at all.
- The old HTML visual guide (v1.4, Fredoka-era) — superseded by the v1.5 markdown guide.
- Any file named DO_NOT_USE, any derived wordmark, the traced `file.svg`, any Fredoka font
  file. Fredoka is banned everywhere.
- The bubble wordmark assets (`wordmark-cream.svg`, `wordmark-maroon.svg`) — high-school
  only, never in this repo.
- The Thmanyah zip, OTF files, or licence PDFs in the repo — three woff2 only, in
  `src/assets/fonts/` (§1).
- Do NOT copy the brand files into `bridgio-lth-frontend` as repo files, except for a short
  docs pointer if OpenCode needs one, and except for the runtime assets a batch actually
  needs to build / deploy (for example, the Batch 1 logo SVGs and fonts).

## 8. Batch gates (Muse verifies)

For every batch, the gate is:

- App runs, no errors. Console clean on every route checked.
- Data comes through the adapter / mock only, no hard-coded data in components, no `fetch` in components.
- Tokens match the brief exactly for LOCKED values; PROPOSED values used as-is and labelled proposed; no invented colours, fonts, spacing, or features.
- Copy, language, and status rules in §2–§4 hold; no out-of-scope creep — no Traveling Papers, no EU renting, no Video Distribution as a product screen, no BPO login, no invented BPO data, no real auth before the BFF, no high-school copy or seed people left in the batch's scope.
- Delivery note is complete: what changed, what was NOT built, deviations from the brief (with the exact C-row and what was used instead), any proposed value changed, any missing Mentingo endpoint mocked, and open questions.
- Screenshots light + dark, 1920px and 390px, AR + EN, of every new/changed screen. Layout measured at scroll 0 AND scrolled. A screen with no adapter mapping is a fail, even if it looks finished.
- Gate artefacts are files or links (C37): screenshots, an axe report, a contrast table, a 390px overflow report.

Batch-specific gates are in the batch prompt and are not repeated here to avoid drift. If a batch gate and this file ever disagree, stop and ask the owner — do not silently pick one.

## 9. Open items — do not let an agent fill these by assumption

- C42 HELD: the condition around `tokens.css` lines 157–162 (second size set) — the owner
  has not pasted it yet.
- Price / money: provisional until the legal + finance review. No real figures, no real
  learner, academy or payment data.
- Secondary / neutral colours, type scale / spacing / radius: PROPOSED values in the token
  sheet, pending owner lock where the brief has not locked them.
- Arabic final wording: draft, centralised, labelled draft, pending owner / Arabic reviewer pass.
- Small-size mark / favicon / app icon, transparent mascot cutouts, Mohsen loading animation:
  TBD, interim rules in §2 only.
- BRIDGIO name / domain / trademark: working name, not locked final. An unrelated US company
  uses Bridgio / bridgio.io — domain / trademark check still open. Do not print, buy domains,
  or ship externally on the assumption it is locked.
- Mohsen name: working name, may still change.
- Website / handle / company / price placeholders: keep `[website]`, `[@handle]`,
  `[company name]`, `[price]` as placeholders in UI copy.
- Mentingo database type, Mentingo auth method beyond §5, and every Mentingo endpoint:
  unconfirmed / proposed only. Ask in the delivery note as gaps; do not assume or invent.
- ui-skills install on the owner's machine: unverified. The Batch 1 prompt uses it if present
  and proceeds without it — do not stop a batch on it.
- Wave assignment of blueprint screens 2, 8, 9, 10, 17, 18 and the academy switch: PROPOSED.
  The owner approves it per screen.
- Baseline: the fork starts at 142/142 tests (Batch 3 gate, main `d9d24a3`). New tests extend
  the suite; the count must not drop.

## 10. Rulings log (owner decisions, in date order)

- **2026-11-14 — Fork created:** `bridgio-lth-frontend` (public, owner decision), forked from
  `bridgio-frontend` main `d9d24a3` at the `fork-base` tag. Verified from a fresh clone: main =
  `d9d24a3`, no Thmanyah files in history or tree. Local folder:
  `C:\Users\Youssef Hady\Desktop\Youssef\Projects\bridgio-lth-frontend`.
- **2026-11-14 — Approved scope:** full frontend prepared for a BFF, complete against a mock
  contract — NOT a v1 subset. Repo, brand, BPOs never log in, language as data, LTR + RTL,
  marking incl. intelligent marking with 5 speaking dimensions, enrollment and placement-test
  rules, storefront in the same repo, build order academy → learner → storefront → AI+live →
  desk/dossier/finance. Out of scope: Traveling Papers, EU renting, Video Distribution as
  marketing. Legal + finance review before any real data.
- **2026-11-14 — Thmanyah (C13 LOCKED):** use it, build-bundled. Three woff2 in the repo under
  `src/assets/fonts/`, bundled by Vite; never in `public/`, never a download link. Owner owns
  the decision; do not re-raise the licence question.
- **2026-11-14 — Logo (C14 LOCKED):** the image's font is Alexandria Bold (pixel-overlap IoU
  0.753 vs the PNG, best of 10 candidates); red bridge arch joining the two i-dots; two
  versions, cream for dark surfaces and maroon for light surfaces. The bubble wordmark is
  superseded for LTH.
- **2026-11-14 — All C-rows locked:** C1–C41 LOCKED except C10 NOT APPROVED (no underlines)
  and C42 HELD. §3.17 body text locked. Process confirmed to carry over. Owner go for
  Batch 1 given.
- **2026-11-14 — Docs commit:** `4f1c706` pushed to `main` (MASTER_BRIEF + LTH handover in
  `docs/`). Batch 1 prompt READY; this LTH LIVE_RULES replaces the high-school file for the
  LTH session.

# BRIDGIO Learn-to-Hire — Session Handover (LTH)

For every fresh OpenCode session working in `bridgio-lth-frontend`. Read this file first, then
`BRIDGIO-LTH-MASTER_BRIEF.md`. The brief outranks this handover; this handover outranks any skill.

## What this repo is

- `bridgio-lth-frontend`, a separate public repo forked from `bridgio-frontend` main `d9d24a3`
  at the `fork-base` tag. Verified live 2026-11-14: main = `d9d24a3`, no Thmanyah files in
  history or tree.
- The Learn-to-Hire version of BRIDGIO (owner term: "BPO frontend"): adults 18–28, exotic
  languages, hiring via BPO collabs/recruiting. Distinct from the high-school product.
- Full frontend prepared for a BFF, complete against a mock contract — NOT a v1 subset.
- Baseline: 142/142 tests at the fork point. The count must not drop.

## Stack (do not change)

- TanStack Start + Router + Query, TypeScript, Vite, **npm** (not bun, not pnpm).
- Commands: `npm test` / `npm run typecheck` / `npm run build`. All three must pass.
- React Aria Components ^1.22.1. shadcn NOT chosen.
- Lucide is the single icon source: `lucide-react@1.72.0` pinned exact, swap in `AppIcon.tsx`
  only, strokeWidth 1.8. Never add another icon set.
- Installed-first: audit what is already installed before proposing any library or pattern.
  A new dependency needs the owner's explicit approval.

## Process (locked)

- Fresh session per batch. Read the MASTER_BRIEF first in every session.
- Docs first: copy Muse's current files into the repo's `docs/` before starting (docs-only
  commit first). The owner copies them from Muse; the builder does not ask for attachments.
- Push the branch only. No merge, no PR. If a PR is opened, it has a title and a description.
- The owner merges. Muse verifies every gate (code gate + live gate). A builder's claim is
  never the gate: Muse checks the built artifact by clicking, never by inspecting HTML.
- Never re-litigate a locked decision. Locked stays locked, proposed stays proposed.

## Brand and design (locked — see MASTER_BRIEF C1–C41)

- Brand BRIDGIO everywhere, line "Your bridge to what's next". No per-academy branding/domains.
- Logo (C14 LOCKED 2026-11-14): the Alexandria Bold lockup, NOT the bubble wordmark.
  Two assets, provided by the owner with the batch prompt:
  `wordmark-alex-cream-red-arch.svg` (dark surfaces) and
  `wordmark-alex-maroon-red-arch.svg` (light surfaces). Red period #F41920, red bridge arch
  #F41920 joining the two i-dots. Replace the header wordmark in place; the bubble wordmark
  assets stay for the high-school repo only. Never retype, mirror or stretch the wordmark.
- Colours: cream #F9ECD9, paper #FFF6E8, maroon #2C0706, outline #471E1B, red #D51C1D,
  success #1F7A57, info #2A62B0, warning #F2A93B, error wine #7E1A2B. Accent red #F41920
  logo artwork only. Artwork cream #F9EEDC only inside logo artwork.
- Fonts: Latin display Sora Bold/SemiBold, Latin body Nunito; Arabic display Alexandria Bold,
  Arabic body Baloo Bhaijaan 2 Regular 400, Arabic UI labels Alexandria. Fredoka is banned.
- Thmanyah (C13 LOCKED, build-bundled): three woff2 only, in the repo under
  `src/assets/fonts/`, bundled by Vite. Never in `public/`, never a download link, never the
  zip, never OTFs. Files used exactly as supplied, original names, no modification.
- No underlines anywhere (C10, owner instruction): links maroon + semibold at rest, wash on
  hover, wash + 2px focus ring on focus.
- Buttons (C18 LOCKED): Primary / Secondary / Focus / Disabled only (code also has Tertiary
  TextLink, Danger, chips/pills as variants — do not invent new ones).
- Precedence (C20 LOCKED): WCAG and invariants, then UX laws, then phi, then taste.
- Shell: header 76px with the 136px wordmark, sticky; sidebar 240/72 (C2 unlock), rows 48px,
  gap 8px, radius 16, header to first nav 24px; collapse/expand ~250ms animated.
- Dark theme is token-driven; every component story is checked in dark. Gates demand dark
  screenshots.
- Copy register (C26 LOCKED): learners get Egyptian casual, academy/instructor/desk get MSA
  formal, the assistant follows the handover register (Egyptian colloquial greetings, MSA
  instructions/labels). Never mix dialects within one string. All Arabic is draft and
  centralised in strings.
- Taglines (C28 LOCKED): "Your bridge to what's next" is the product line. "From classroom
  to career" is not used in LTH. "Learn it. Land it." is campaign-only.
- No invented BPO names, logos, salary figures or counters. Targets are marked as
  placeholders until contracts exist. Named BPO partners have NO partnerships — never put
  Teleperformance, Concentrix, Sutherland or Foundever on a landing page.

## Scope (approved scope brief, 2026-11-14 — owner-approved)

- Build order: 1. Academy and instructor. 2. Learner core. 3. Public storefront and catalog.
  4. AI and live. 5. Placement desk, dossier, finance.
- BPOs never log in (zero-login Verified Batch Dossier magic link from the internal CRM).
- Language is data (no fixed list). LTR + RTL both. Learners phone + desktop.
- Notifications in-platform + email first, WhatsApp/SMS later.
- Marking = Mentingo auto-marking PLUS intelligent marking incl. speaking + writing.
  Speaking scores on 5 dimensions: pronunciation, fluency, empathy, vocabulary, listening.
  Every AI score has an explanation + appeal path.
- Enrollment: one active course per language per learner; academy switch allowed within one
  language, platform-approved, review stays private. Placement test behind an account, no
  free retakes. Public storefront in the same repo.
- Out of scope: Traveling Papers + EU renting; Video Distribution = marketing, not a product
  screen. Legal + finance review before any real data.
- Money screens are provisional until the legal + finance review: show provisional figures
  and say so on screen.
- No real auth until the BFF: keep the existing fake sign-in / preview mechanism. Do NOT
  build sign-up, password reset, enrollment or checkout in Batch 1.

## Mock contract (Batch 1 and later)

- One API adapter in `src/api/`. No component calls fetch directly, no screen hard-codes
  data, no business logic in UI components. The mock adapter implements the same interface
  as the real adapter (same types, method names, request/response shapes).
- Label EVERY new endpoint "PROPOSED — Mentingo to implement on restore/rebuild". Never
  present a proposed shape as if Mentingo already provides it.
- Do NOT build on the brief's unverified Mentingo claims: Stripe-only payments, shipped UI
  languages, voice over LiveKit, "no cohorts/attendance" as confirmed-absent, the
  tenant-provisioning API, five-dimension scoring coverage, groups-as-cohorts. The cohort
  model in the mock contract is a proposal.
- No local-only persistent store: local state is UI state only; all persistent data goes
  through the adapter.

## Inherited from the fork (do not fix unless the batch says so)

- Inactive test-builder stepper labels fail contrast (2.55:1 light / 2.95:1 dark vs 4.5:1).
  Fix in Batch 1: inactive steps use `--text-secondary` (6.90:1 light / 7.03:1 dark).
- Claude's review findings N2–N7 (math as plain text, Mohsen never introduced as the AI in
  copy, profile linking to disabled sign-in, logo alt leaking internal wording, dashboard
  showing one draft in two lists, role label vs persona) are Wave 0 scope, not Batch 1.
  N1 is no change: the header button opens the human message threads.
- Axe never ran, 390px overflow never checked, sub-44px readings unconfirmed. Sign-in stays
  a disabled fake until the BFF. Retake stays blocked.

## Gates (Muse verifies; the builder delivers the artefacts)

- Code gate: `npm test`, `npm run typecheck`, `npm run build` — all pass, test count not down.
- Live gate: screenshots of every new/changed screen, light + dark, 1920px and 390px, AR +
  EN; console clean on every route. Delivery note + an integration checklist per screen
  (which adapter methods it uses, confirmed vs proposed vs mocked). A screen with no
  adapter mapping is a fail, even if it looks finished.
- Gate artefacts must be files or links (C37 LOCKED): screenshots, an axe report, a contrast
  table, a 390px overflow report. Muse's browser has no console and no viewport resize.
- Measure layout at scroll 0 AND scrolled, on the screen named. A screenshot reading is a
  hypothesis; live measurement is the verdict.

## Files for a fresh session

- This handover, `BRIDGIO-LTH-MASTER_BRIEF.md`, the approved scope brief PDF
  (`BRIDGIO_Learn-to-Hire_approved_scope_brief.pdf`), the batch prompt, the two logo SVGs.
- `docs/` in the repo holds the MASTER_BRIEF, this handover, and the gate checklist
  (`BRIDGIO-LIVE_RULES.md` — its gate rules apply; its batch history is the high-school
  track). The owner refreshes these copies before each batch.

# BRIDGIO-LTH-MASTER_BRIEF.md

> Corrected draft for owner reading — 2026-11-14.
> Source: Claude v2 draft (Claude read all five files, could not open live site or Figma) + §3.17 (C38–C40) + owner locks.
> Status: **C1–C9, C11–C41 LOCKED** (owner-approved 2026-11-14, date not filled — do not invent), **C10 NOT APPROVED** (no underlines, owner instruction 2026-11-14), **C42 HELD**, **§3.17 body text LOCKED** (owner-approved 2026-11-14), **O1 = C1 to C41**.
> **2026-11-14 font update, applied as PROPOSED then superseded the same day:** C13 revised — Thmanyah roles defined; delivery was BLOCKED (no permission email), then the owner decided FINAL (2026-11-14 ~14:55) to USE IT, build-bundled: three woff2 in the repo under `src/assets/fonts/`, bundled by Vite, Vercel reads them from the build; never in `public/`, never a download link. C41 approved (Caption 13) — O1 is now C1 to C41. §3.6, O3 and Batch 0 updated accordingly.
> Muse fixes in this draft: C39 cross-ref corrected from (C36) to (§16) for dependency approval (C36 is Storybook); FILL FROM CODE items filled where the token sheet / handover / memory verify them, the rest remain marked FILL FROM CODE for Muse to confirm from code/live before OpenCode starts.
> Batch 1 is READY — owner go given 2026-11-14; C15–C17 and C21–C37 approved, process confirmed to carry over. Paste the Batch 1 prompt into a fresh OpenCode session with the approved scope brief PDF, the refreshed LTH handover, this corrected MASTER_BRIEF, and the two logo SVGs. Done 2026-11-14: fork-base tag on d9d24a3 (verified), `bridgio-lth-frontend` live at d9d24a3, no Thmanyah files in its history or tree. Still open (not Batch 1 blockers): C42 paste (tokens.css lines 157–162 condition), ui-skills install on the owner's machine (prompt uses it if present, proceeds without it).

Repo: bridgio-lth-frontend, forked from bridgio-frontend main d9d24a3. Read this file first in every fresh session, then the sources in §14.

Tags: LOCKED = owner decided. VERIFIED = confirmed fact. PROPOSED = recommendation, not binding until the owner approves. TBD = open, do not invent. NOT VERIFIED = unconfirmed claim, do not treat as fact.
"PROPOSED FOR UI" in the token sheet counts as PROPOSED here, even when shipped at d9d24a3, unless the owner has locked it.

You build to this brief. You do not decide anything tagged PROPOSED, TBD or NOT VERIFIED. If a task needs one, stop and ask one specific question with a recommended answer.

---

## Decision table (owner approves each row)

C1–C9, C11–C41 LOCKED. C10 NOT APPROVED (no underlines). C42 HELD.

| # | Conflict | Proposal | Reason |
|---|---|---|---|
| C1 | **LOCKED** — Type scale. Figma 16/18/24/32/44 vs app 32/28/22/18/16/14/15/12. | The app scale in the token sheet (PROPOSED FOR UI, shipped) wins. 14 is body-small and 15 is label/button, so there is no 14-vs-15 audit. Figma is re-based. Add one `display` 44 token for public hero only. | 44 and 24 look like the deck's presentation scale (120/72/44/32/24) leaking into Figma. The sheet says the deck scale is not an app scale. |
| C2 | **LOCKED** — Sidebar 272/88 (locked 2026-11-13) vs 240/72. | Approve an explicit unlock of the shell lock. Header stays 76, rows stay 48, collapse stays about 250ms. | A lock must be lifted by decision, not drift. 72 still holds a 44px hit area plus padding. |
| C3 | **LOCKED** — Spacing. The sheet uses a 4px base (4, 8, 12, 16, 24, 32, 48, 64). The owner says 8pt. Inner padding 20 is in neither. | Keep the sheet scale and add `20`. Outer gaps and gutters are multiples of 8. 4, 12 and 20 are for inner padding and icon gaps only. | 32:20 = 1.6, close to phi. 24:16 = 1.5 is the fully on-grid fallback. |
| C4 | **LOCKED** — 62/38 split vs spans 4/6/8/12. | Primary:secondary is 8:4 (66.7/33.3). 7:5 (58.3/41.7) is an alternative that needs one extra allowed pair. | Neither hits 62 exactly. 8:4 stays inside your span set. |
| C5 | **LOCKED** — "Max 1440 centred" with a sidebar present. | Centre the 1440 inside the main area, not the viewport. Column width is (1440 − 11×24)/12 = 98px. At 1920 with a 240 sidebar the main area is 1680, so 120px margins each side. | The ambiguity changes every layout. The arithmetic is whole-pixel. |
| C6 | **LOCKED** — Token sheet says "light only, do not invent dark". Code and the gates have dark (the handover measured dark contrast). | Dark values come from `tokens.css` as shipped. They are PROPOSED, not a brand lock. New dark steps use the same ladder method plus the contrast script. The owner locks dark in one approval. | The sheet is dated 2026-11-01, the code is later. Locks must not be implied. |
| C7 | **LOCKED** — The owner wants a rich phi colour table. The sheet says neutrals use opacity "so no new brand hex is invented". | Three tiers. Tier 1 is the locked anchors. Tier 2 is the opacity neutrals. Tier 3 is the phi ladders, an extended palette that is derived and not brand colours. The red ladder is never status and never a second primary. The error ladder comes from wine. The warning ladder is fill-only. | This keeps the brand lock intact and still gives the rich table. |
| C8 | **LOCKED** — The owner requires contrast ≥4.5 for text. The sheet says brand red on cream is 4.49:1 and allows red text at "18px+ bold". | Normal text is never brand red. Red text is allowed only at 24px or larger, or at 700 weight and 19px or larger, so WCAG large-text 3:1 applies. In the current scale that means 28 and 32 only. Cream on red is 4.56:1 (sheet), so button text passes. | WCAG large text is 18.66px bold or 24px. 18px bold is not large. 22px SemiBold is not large. |
| C9 | **LOCKED** — Brand red vs status red. | Error is wine, always with icon and word. "Not yet" and "needs work" are neutral or info, never error. Red never means "wrong". | Locked rule in the sheet. It is critical for scoring and gates. |
| C10 | **LOCKED** — Links. The handover lock says maroon, semibold at rest, underline and wash on hover/focus. The owner wants no underlines (2026-11-14). | No underlines anywhere: not at rest, not on hover, not on focus. Links stay maroon and semibold at rest. Hover adds the wash. Focus adds the wash and the 2px focus ring. Inline links inside paragraphs are kept rare; standalone link rows or buttons are preferred. Batch 0 tests whether semibold alone is visible enough against body text. | Owner instruction replaces the handover lock. Risk: WCAG 1.4.1 asks for a cue beyond colour, and weight alone is subtle. If Batch 0 shows it is too weak, the options are a small Lucide arrow beside inline links, or restructuring copy so links stand on their own line. |
| C11 | **LOCKED** — Touch target 44 vs dense 48px rows and small icon buttons. | Visual size may be smaller. The hit area is at least 44×44. | Your lock. WCAG 2.2 AA minimum is 24px, so this is stricter. |
| C12 | **LOCKED** — Icon stroke. The handover locks Figma icons at "22px, stroke 2". Code uses strokeWidth 1.8. | Keep code at 1.8 until the owner picks one. Wrap it in an `Icon` component with a single stroke token. | The two locked values disagree and I cannot confirm what the code renders. |
| C13 | **LOCKED** — The sheet has Alexandria and Baloo Bhaijaan 2 and no Thmanyah. The code requests three Thmanyah families (42 declarations, 32 of them `thmanyahsans` on labels and UI) and no files exist in the repo. The owner wants Thmanyah Display on headings, Serif Text on body, Alexandria on labels and UI. The Thmanyah licence (thmanyah Publishing and Distribution, 2026, Reserved Font Name "thmanyah") is proprietary: commercial use in websites/apps allowed, but hosting, redistribution, extractable web embedding and modification prohibited. | Use the owner's roles (see §3.6). Delivery is BUILD-BUNDLED (owner decision 2026-11-14, final): the three woff2 files live in the repo under `src/assets/fonts/`, imported by Vite so the build bundles them into hashed assets — Vercel reads them from the repo build. They are never in `public/` (no static font URL), never a download link, never the zip. No modification (no conversion, subsetting, renaming, merging, republishing); files used exactly as supplied, original names. Thmanyah ships; the fallbacks remain only as the font-display fallback chain if the files fail to load. Do not use the Thmanyah name/logo in branding or claim authorship. | Owner decision 2026-11-14 (final): use it, build-bundled, never downloadable from the site. This supersedes the earlier blocked/fallbacks decision from the same day. |
| C14 | **LOCKED** — Logo. The LTH logo is the Alexandria Bold lockup, not the bubble wordmark: two assets, `wordmark-alex-cream-red-arch.svg` (dark surfaces) and `wordmark-alex-maroon-red-arch.svg` (light surfaces). Red period #F41920, red bridge arch #F41920 joining the two i-dots. | Use only those two assets. Never retype, mirror or stretch. Full lockup is for splash, onboarding and large uses only. | Owner pick 2026-11-14 (red arch, two versions). |
| C15 | **LOCKED** — Mohsen poses. The sheet says "poses inside red or cream cards" and also "never directly on brand red". | Cream card is the default. A red card only if the pose sheet's own backing is used unchanged. | The sheet is internally in tension. The silhouette is lost on red. |
| C16 | **LOCKED** — Figma lacks inputs, dialog, avatar, toast, icons, breadcrumb, tabs. | Code and Storybook are the component source of truth. Figma catches up from Storybook. Components are built on React Aria Components. | One build, not two diverging ones. |
| C17 | **LOCKED** — The Figma Free plan publishes no variables. | `tokens.css` is authoritative. Generate a token reference doc. Figma mirrors manually through a mapping table. A paid plan or plugin sync is the owner's call. | The app cannot consume Figma. One-way flow avoids drift. |
| C18 | **LOCKED** — Figma buttons are Primary/Secondary/Focus/Disabled. | Variants: primary (maroon bg, cream text, pill), secondary (pill outline), tertiary (text), destructive (wine). Focus, pressed, disabled and loading are states. | The sheet fixes primary and secondary. The sheet says danger is wine. |
| C19 | **LOCKED** — Figma has dark screens but no dark components. | Dark is token-driven. Every component story is checked in dark. | Gates already demand dark screenshots. |
| C20 | **LOCKED** — Phi vs UX/WCAG laws. | Precedence: WCAG and invariants, then UX laws, then phi, then taste. | Your lock, written so it can't be argued. |
| C21 | **LOCKED** — "Skeleton under 100ms". | The skeleton appears within 100ms of navigation. Avoid a flash if data arrives instantly (minimum display time TBD). | Ambiguous as written. |
| C22 | **LOCKED** — Motion durations. Only about 250ms is observed. | Phi ladder around 250: about 100 / 155 / 250 / 405 / 655ms, rounded in tokens. | Derived from a shipped value, not invented. |
| C23 | **LOCKED** — Journey order. The blueprint puts exclusivity first (screen 1). The scope brief order is catalog, level, test, cohort, exclusivity, pay. | The scope brief wins. Screen 1 splits into onboarding/eligibility (early) and exclusivity (after cohort pick, before pay). | Owner-accepted order. |
| C24 | **LOCKED** — The journey crosses waves. | Screens are assigned to waves as in §12.2. The end-to-end journey is tested only after Wave 5. Routes that arrive later exist as designed "not available yet" states. | Keeps the approved build order. |
| C25 | **LOCKED** — The token sheet's "NOT in MVP UI" covers intelligent marking, Learn-to-Hire, installments and exotic languages. | The scope brief (2026-11-14) supersedes scope. The token sheet stays authoritative for tokens. The high-school "do not promise intelligent marking" rule is void here. | Different repo and different product. |
| C26 | **LOCKED** — Copy register. The sheet says never mix dialects in one message. The handover assistant register is "Egyptian colloquial greetings, MSA instructions/labels". | LOCKED 2026-11-14: learners get Egyptian casual, academy/instructor/desk get MSA formal, and the assistant follows the handover. All Arabic is draft and centralised. | Direct conflict between two sources. |
| C27 | **LOCKED** — Copy lead. The sheet leads with "time saved" (teachers) and "next small step" (students). LTH is hiring-centred. | Student copy leads with the next step. Outcome statements are targets and labelled. "Guaranteed", "Zero-to-BPO-Hired" and "retention guarantee" are not used without owner and legal approval. Use the scope brief's neutral name "career tracks directory". | Those phrases are claims. |
| C28 | **LOCKED** — Taglines. | "Your bridge to what's next" is the product line. "From classroom to career" is not used in LTH. "Learn it. Land it." is campaign-only, never the main line. | Sheet rule. |
| C29 | **LOCKED** — The sheet says BRIDGIO and Mohsen are working names, not trademark-cleared. The public storefront ships externally. | No public production exposure until the owner confirms the name and domain status. Centralise both names in strings and assets. | Sheet rule. |
| C30 | **LOCKED** — Blueprint public content: salary calculator, talent counter, partner logos, "Historical BPO Placement %", ratings. | Build the components against the contract with a visible TargetLabel. Ship them hidden by flag in production until the owner validates. No BPO names or logos. The partner-logo band is omitted. | Invented numbers and no partnerships. |
| C31 | **LOCKED** — The scope brief marks several Mentingo facts "Confirmed" from README/architecture docs with no code read. Your task says unverified. | Follow your task. Tag them NOT VERIFIED or DOC-ONLY (§6.3). | Never present unverified as confirmed. |
| C32 | **LOCKED** — Dossier. The blueprint says password/token-protected. The scope brief says magic link, token-protected. | The scope brief wins. A password step is TBD. | The scope brief is owner-approved. |
| C33 | **LOCKED** — The scope brief deletes the dev-chrome flag on day one. The handover says hosted builds are baked with one session, so other roles can't be checked. | Replace it with a mock-only scenario panel (role and state toggles) behind a build flag. It is removed from BFF builds. | Muse verifies by clicking and needs every role and state. |
| C34 | **LOCKED** — Baseline 142 tests vs day-one deletions of high-school content. | Tests on deleted content are ported to equivalent new content in the same batch. A real removal needs explicit owner approval and a baseline note. | The count must not drop. |
| C35 | **LOCKED** — The handover process says push the branch only, no PR. The scope brief says any PR gets title and description. | Follow the handover. If a PR is opened, it has a title and description. The owner confirms the process carries over. | The scope brief asks for this confirmation. |
| C36 | **LOCKED** — The gaps queue calls for a gallery plus axe. This brief proposes Storybook. | Storybook (new dependencies, owner approves) replaces the gallery idea. | Components need per-state, per-theme, per-direction stories. |
| C37 | **LOCKED** — Muse's browser has no console and no viewport resize. | Every gate artefact must be a file or link: screenshots, an axe report, a contrast table, a 390px overflow report. | This is why axe and the 390 check never ran. |
| C38 | **LOCKED** — The ten items get four different treatments. "Study only, never install" is true for seven of them (six design systems, plus Cult UI as patterns-only). GSAP, Anime.js and TanStack AI are evaluate-for-install. | C38 covers the seven study and pattern references. They are never installed, and their brand, colours, fonts, code, icons and copy are never copied. GSAP vs Anime.js goes to C39 and TanStack AI to C40. | Read literally, C38 would forbid the evaluations C39 and C40 ask for. Splitting the rows keeps each rule testable. |
| C39 | **LOCKED** — Motion tokens (C22) are defined as CSS values. A library may still be wanted for sequenced or celebratory motion, and installing two would split the motion code. | Default is CSS-only. Batch 0 names which journey steps CSS cannot do. A library is added only if at least one named step fails in CSS, within reduced-motion and performance limits. If so, pick ONE of GSAP or Anime.js, never both. The owner approves the install (§16). | A dependency should answer a demonstrated need. One library keeps reduced-motion, RTL and cleanup rules in one place. |
| C40 | **LOCKED** — Mohsen chat (curriculum Q&A, from LMS.md) needs a chat layer. The Mentingo AI endpoints `/api/course-chat` and `/api/luma/authoring` are not in the committed schema and are unverified, so there is no verified baseline to compare against yet. | Write an evaluation note only, with no install in Waves 1 to 3. The note compares TanStack AI against whatever O20 verifies in Mentingo. It is finished before Wave 4 (AI + live) starts, and the owner decides. | Installing before the baseline is known risks building the wrong contract. All AI calls go through the BFF, so the choice affects the mock contract (§6). |
| C41 | **LOCKED** — The sheet-derived scale has Caption 12. `tokens.css` line 64 has 13. | Keep 13. Correct §3.6 and the sheet reference. | `tokens.css` is authoritative (C17). It is already shipped, so there is no layout change. |

---

## §0 Corrections

Wrong assumptions a builder may carry. Each is corrected here.

1. This is the full frontend, complete against a mock contract and prepared for a BFF. It is NOT a v1 subset. LOCKED.
2. This is not the high-school product. The token sheet's "NOT in MVP UI" list (Learn-to-Hire matching, intelligent marking, installments, exotic-language courses) is void for this repo. The scope brief (2026-11-14) wins on scope. The token sheet still wins on tokens. Decision C25.
3. The token sheet says "light only, do not invent dark". Code and gates have dark. Dark values come from `tokens.css` and are PROPOSED until the owner locks them. Decision C6. Muse fill: dark as shipped — base #2C0706, surface #471E1B, ink #F9ECD9, red small accents only, dark status tints derived toward cream (success #76A88B, info #7D99C0, error #E08A90); dark-band cream secondary 75%, border 24%, hover 8%, cream focus ring.
4. Blueprint numbers are INVENTED until the owner validates them. This covers salaries, commissions, holdbacks, counters, attendance and retention percentages, "10 to 30 candidates", "85%" and "42 graduates". They are targets, not claims.
5. Named BPOs have NO partnerships. Never put names or logos in UI, fixtures, stories or docs shown to users. No "partner logo" band on any page.
6. The blueprint journey order is superseded. The journey is: browse catalog, Find your level (account), placement test, pick cohort, sign exclusivity, pay. LOCKED (scope brief). Decision C23.
7. Blueprint names such as "Guaranteed Career Tracks" and "Zero-to-BPO-Hired" are claims. The approved neutral name is "career tracks directory". Decision C27.
8. The scope brief lists several Mentingo facts as "Confirmed" from README/architecture docs, with no code read. Treat them as NOT VERIFIED (§6.3). Decision C31.
9. The handover gaps queue (F1 fix, E1 stylelint guard, pressed states, skeletons, motion tokens, woff2 + preload, row-card pattern, desktop grid, screenshot matrix, gallery + axe) is NOT done at d9d24a3. This fork inherits all of it. It is absorbed into Batch 0 (§12).
10. The golden ratio never overrides WCAG or UX laws. Spacing stays on the grid. Phi sets proportions and colour lightness steps only. LOCKED.
11. BRIDGIO and Mohsen are working names per the token sheet. The scope brief locks BRIDGIO as the brand. Public exposure waits for the owner's name and domain confirmation. Decision C29.
12. Mohsen is one persona (mascot plus AI assistant) across mentor, Speaking Gym and test authoring. In Assistant mode he is careful and verifiable, not playful. LOCKED.
13. Fredoka is banned. LOCKED.
14. Out of scope: Traveling Papers, EU renting. Video Distribution is marketing only. LOCKED.

Known and inherited. Do not re-report as discoveries:
- Sign-in is a disabled fake until the BFF exists. In this repo the mock adapter supplies a mock sign-in.
- Retake is blocked by a backend CONFLICT 409. The mock must model it.
- In the fork, `/teacher/tests` is the test builder, not a test list.
- Hosted builds are baked with one session. Decision C33.
- Inactive test-builder stepper labels fail contrast. The handover computes 2.55:1 light and 2.95:1 dark against 4.5. The fix is `--text-secondary`, computed at 6.90:1 light and 7.03:1 dark. Fix it in Batch 0.
- Axe never ran. The 390px overflow check was not done. Sub-44px readings are unconfirmed (code gives `.button` and stepper buttons a 44px min-height, but no rect was measured).

---

## §1 Product and boundary

### 1.1 Product
BRIDGIO Learn-to-Hire. Line: "Your bridge to what's next". LOCKED. Adult learners aged 18 to 28 take a language course, pass level-up gates, build a Hiring Passport and are placed through an exclusive placement model. BPOs are hiring partners in the abstract only.

### 1.2 Boundary (LOCKED unless noted)
- One brand, one AI persona. No per-academy theming. Academy profile pages exist, with no per-academy branding or domains.
- Public storefront lives in this repo.
- BPOs never log in. A BPO sees a magic-link, token-protected dossier run from an internal CRM. Contact details stay masked until "Request Interview".
- Learners use phone and desktop.
- Language is data. No hard-coded language list. Direction is per content block (Arabic UI can hold German, Dutch or Italian lesson content running LTR). LTR and RTL both ship.
- One active course per language per learner. Different languages may sit at different academies. The catalog and enrolment enforce this and explain it.
- Academy switch is allowed within one language, based on the learner's review, feedback and reasoning. It is approved on the platform side. The review stays private.
- Placement test is behind an account. The level is not given away free. No free retakes. The landing teaser shows no level.
- Marking is Mentingo auto-marking PLUS intelligent marking, including speaking and writing. Five dimensions: pronunciation, fluency, empathy, vocabulary, listening. One score format whichever engine produced it. Every AI score has an explanation and an appeal path.
- Notifications: in-platform and email first. WhatsApp and SMS later. Channel-agnostic types so they slot in.
- Money screens are provisional until the legal and finance review. No real data before the legal gate.
- Learner portal and storefront are mobile-first. Instructor and desk screens are desktop-first. PROPOSED (scope brief). The Speaking Gym needs microphone access on phones.

### 1.3 Surfaces (scope brief)
Six: public storefront (no login), learner portal, academy and instructor portal, neutral assessor portal, internal placement desk (the owner as Super Admin), and the dossier (magic link, no login).

### 1.4 Four subsystems (blueprint)
Public storefront; Mentingo multi-tenant LMS; live cohort and AI assessment engine; placement desk and finance core. The frontend talks to all of them only through the BFF contract (§6).

### 1.5 Out of scope
Traveling Papers, EU renting, Video Distribution (marketing). Backend, BFF and Mentingo changes. This repo is frontend only.

---

## §2 Non-negotiable invariants

Violating any of these fails review.

1. Never retype the wordmark. Use `wordmark-maroon.svg` or `wordmark-cream.svg` only. Never mirror, stretch, recolour or add effects. Full lockup only for splash, onboarding and large uses.
2. Colours come from tokens. No raw hex in components. Old error red #A8141A is banned. Accent red #F41920 appears only inside logo artwork.
3. Fredoka is banned.
4. No emojis anywhere: UI, docs, code comments, alt text, commit messages.
5. Icons are Lucide only (`lucide-react`, single source). No other icon library, no hand-drawn inline SVG icons.
6. No BPO names or logos. No invented academy names, prices, salaries, commissions, holdbacks, counters, retention or attendance figures, or dates. Prices use the `[price]` placeholder pattern. Dates are generated relative to now. No vendor names for speech or language models in UI.
7. No real personal data in fixtures, stories or screenshots (national ID, military status, voice recordings, phone numbers, emails).
8. No invented favicon, no transparent Mohsen cutouts, no final Mohsen animation.
9. Every AI score shows an explanation and an appeal path.
10. Every modal and drawer has a focus trap, closes on Esc, and returns focus to its trigger.
11. Text contrast is at least 4.5:1 for normal text. Large text and non-text UI need at least 3:1. The script in §3.5 enforces this. Touch targets have a hit area of at least 44px. WCAG 2.2 AA is the target.
12. Every control has a programmatic label. Placeholder is never the label.
13. Status is always icon plus word, never colour alone. Brand red never means "wrong".
14. Logical CSS properties only. No physical left or right in component CSS. The logo never mirrors.
15. No level or score component renders on a public (logged-out) route.
16. No heavy WebGL. Reduced motion is respected.
17. Auth is Mentingo httpOnly cookies, sameSite strict, through a same-origin BFF. The browser never holds tokens. VERIFIED.
18. Test count never drops below 142 (baseline at d9d24a3). New work adds tests. Decision C34.
19. Stack is fixed: TanStack Start + Router + Query, TypeScript, Vite, React Aria Components, npm only. New dependencies need owner approval.
20. One batch at a time. Each batch passes its gate (§12.3) and the owner approves before the next.
21. Any copy about jobs, pay, placement or outcomes is a target, never a claim. It carries a visible TargetLabel or is omitted.
22. No secrets in code, docs, fixtures or chat. Figma and Token Harbor keys were pasted in chat earlier and rotation is unconfirmed (owner-only).
23. All UI strings are centralised. Arabic copy is draft until the Arabic reviewer approves it. Names (BRIDGIO, Mohsen) live in strings and assets, so a rename is a swap.

---

## §3 Design system

### 3.1 Authority and precedence
- `tokens.css` is the source of truth. PROPOSED (C17). Storybook plus code is the component source of truth. PROPOSED (C16).
- Figma is a layout reference only (zero variables or styles on the Free plan). Flow: code to Storybook to generated token reference to Figma mirror, one way.
- Precedence: (1) WCAG 2.2 and invariants, (2) UX laws (§13), (3) phi proportion, (4) taste. If phi conflicts with 1 or 2, drop phi and note it in the delivery note. PROPOSED (C20).
- Do not rename existing tokens. Map new tokens to the existing naming convention. Muse fill from token sheet / handover: locked tokens in `tokens.css` are red #D51C1D, accent #F41920 logo-only, cream #F9ECD9, paper #FFF6E8, maroon #2C0706, outline #471E1B, success #1F7A57, info #2A62B0, warning fill #F2A93B, error wine #7E1A2B, artwork cream #F9EEDC. Exact variable names to be confirmed from code in Batch 0 — FILL FROM CODE.

### 3.2 Colour tiers
| Tier | Content | Status |
|---|---|---|
| 1 | Locked anchors (§3.3) | LOCKED |
| 2 | Opacity neutrals over the anchors (§3.4) | PROPOSED FOR UI |
| 3 | Phi ladders derived from the anchors (§3.5) | PROPOSED, derived, not brand colours |

### 3.3 Tier 1: anchors (LOCKED, token sheet)
| Role | Value | Notes |
|---|---|---|
| Brand red | #D51C1D | Large text and fills only. 4.49:1 on cream (sheet). |
| Accent red | #F41920 | Inside logo artwork only. 3.65:1 on cream, never text. |
| Cream | #F9ECD9 | App background. #F9EEDC only inside logo artwork. |
| Paper | #FFF6E8 | Surface. |
| Maroon / ink | #2C0706 | Default text. 15.8:1 on cream (sheet). |
| Outline | #471E1B | Logo outline. |
| Success | #1F7A57 | Icon plus word. |
| Info | #2A62B0 | Icon plus word. |
| Warning | #F2A93B | Fill only, with maroon text (9.2:1, sheet). Never amber text (1.71:1). |
| Error | #7E1A2B | Wine. Not brand red. |

### 3.4 Tier 2: neutrals (PROPOSED FOR UI, shipped)
Text primary maroon. Text secondary maroon at 70%. Text muted maroon at 55%. Border maroon at 12%. Border strong maroon at 18%. Disabled background is paper with an 8% maroon overlay, disabled text is maroon at 40%. Hover is a 4% maroon wash. Handover figures: muted passes (5.43:1 light, 6.87:1 dark); disabled text fails readability (2.55:1, 2.95:1) but is WCAG-exempt. Disabled text must never carry essential information alone. The contrast script composites alpha over the actual surface.

### 3.5 Tier 3: phi ladders (PROPOSED)
Method:
1. Convert each anchor to OKLCH. Hold hue. Hold chroma, reduced only to stay in gamut.
2. End stops: dark end is maroon. Light end is paper or white (TBD, O2).
3. Tint step n: `L_n = L_anchor + D × (1 − φ^−n)`, where D is the lightness distance to the end stop. Each step leaves 1/φ of the previous remaining gap, so steps shrink smoothly.
4. Shade steps work the same toward the dark end. Step count per side is TBD (build only what is used).
5. Name steps by role and index (for example `red-tint-1`). Anchors are unchanged and always present.

Rules:
- The red ladder is never used for status and never as a second primary. The error ladder is built from wine. The warning ladder is fill-only throughout.
- Brand red text follows C8: 28px and 32px tiers, or 700 weight at 19px or larger. Never small red text.
- Small CTA buttons: maroon background with cream text (sheet). Red background only when the label is large bold.

Contrast script (OpenCode builds it, Muse reads the output file, tests fail on regression):
- Every step against paper, cream, white and the dark surfaces.
- Thresholds: normal text 4.5:1, large text 3:1, non-text UI and focus 3:1.
- Output per step: `text-ok-light`, `text-ok-dark`, `ui-ok`, `fill-only`. Failing steps are tagged `fill-only`, not deleted.
- The table is committed in the tokens doc. Computed ratios are never hand-written.
- Semantic tokens (surface, surface-raised, text, text-muted, border, focus, success, info, warning, error, brand) map to ladder steps. Dark mapping: from `tokens.css` as shipped — base #2C0706, surface #471E1B, ink #F9ECD9, dark status tints success #76A88B, info #7D99C0, error #E08A90; otherwise derived by the same method. FILL FROM CODE for exact dark variable names.

### 3.6 Typography
Roles (LOCKED, token sheet):
| Use | Font |
|---|---|
| Latin display and headings | Sora, 500 to 700 |
| Latin body and labels | Nunito, 400 to 800 |
| Arabic display and headings | Alexandria Bold — ships until cleared (see Thmanyah table below) |
| Arabic UI labels | Alexandria 600 (Bold file; no SemiBold or Medium ships) |
| Arabic long reading | Baloo Bhaijaan 2 Regular (400) — ships until cleared |

Fredoka is banned. Fonts come through tokens only, never inline `font-family`. Other scripts (languages are data): TBD per language record, O3. Muse fill: as built, Alexandria Bold is declared as 600 (no SemiBold in pack), Nunito 700 max (no ExtraBold); font files in `public/fonts/` are Sora Bold/SemiBold, Alexandria Bold/Regular, Nunito Regular/SemiBold/Bold, Baloo Bhaijaan 2 Regular/Bold.

Scale (PROPOSED FOR UI, shipped; owner lock not confirmed):
| Tier | Size | Line height |
|---|---|---|
| Hero / page title | 32 | 1.2 |
| H1 | 28 | 1.25 |
| H2 | 22 (SemiBold) | 1.3 |
| H3 | 18 (SemiBold) | 1.35 |
| Body | 16 | 1.55 |
| Body small | 14 | 1.5 |
| Label / button | 15 (SemiBold) | 1.4 |
| Caption | 13 (C41 PROPOSED, was 12 in sheet) | 1.45 |
| Display (public hero only) | 44 | TBD, C1 |

Rules: test Arabic and English side by side on real screens. Bilingual headings must read as one system. Small body and label text is maroon on cream or paper only. Woff2 and preload are part of Batch 0. Delivery notes state which font set the screenshots used (Thmanyah once bundled; fallbacks only as the load-failure chain). `Bridgio Label` has no 400 face today (Alexandria Bold 600/700, Nunito 600/700 — anything asking 400 renders at 600); Batch 0 adds Alexandria 400 (`Alexandria-Regular.ttf`) and Nunito 400 (`Nunito-Regular.ttf`) faces. Latin stays Sora/Nunito via the Arabic-only `unicode-range` on Thmanyah faces; Thmanyah Latin coverage is only partly checked and matters only for Arabic-Indic digits (O9).

Thmanyah — intended roles, build-bundled delivery (LOCKED, C13/O3):
| Use | Stack token | Intended (family, file, weight) | Fallback if the files fail to load |
|---|---|---|---|
| Display 44, public hero only (C1) | display | `thmanyahserifdisplay`, `thmanyahserifdisplay-Black.woff2`, 900 | Alexandria Bold |
| Hero 32, H1 28, H2 22, H3 18 | display | `thmanyahserifdisplay`, `thmanyahserifdisplay-Bold.woff2`, 700 | Alexandria Bold |
| Body 16, small 14 | reading | `thmanyahseriftext`, `thmanyahseriftext-Regular.woff2`, 400 | Baloo 400 |
| Label 15, buttons, active nav, table headers | ui | `Bridgio Label` (Alexandria), `Alexandria-Bold.ttf`, 600 | same |
| Caption 13, input text | ui | `Bridgio Label` (Alexandria), `Alexandria-Regular.ttf` (new face), 400 | same |
Weights 900/700/400 come from file names only; Batch 0 confirms them against font metadata. H2/H3 at 18px is Claude's pick, not the owner's. Not used: `thmanyahsans`, Light, Medium. Stacks move into three tokens `--font-stack-display`, `--font-stack-reading`, `--font-stack-ui`, replacing the 42 literals; the UI token drops `thmanyahsans`. Three woff2 faces total 241,408 bytes combined (verified from the owner's zip). Never copy `__MACOSX`, `.DS_Store`, `._*`, OTF files or PDFs into the repo.

### 3.7 Spacing, radius, elevation, proportion
- Scale (PROPOSED FOR UI): 4, 8, 12, 16, 24, 32, 48, 64. Add 20 (PROPOSED, C3). Outer gaps and gutters use multiples of 8. 4, 12 and 20 are for inner padding and icon gaps.
- Radius: card 24 (LOCKED, deck), input 12, modal and sheet 24, chip and tag 999 (pill), button 999 (PROPOSED FOR UI).
- Elevation: no brand shadows. Use the sticker style: solid surface plus a 1 to 2px maroon outline. "Raised" means a heavier outline, not a shadow. A modal may use one soft maroon-tinted shadow as a documented exception.
- Phi sets the ratio between things: outer gap 32 to inner padding 20 (about 1.6), primary to secondary column 8:4. PROPOSED.
- Denser but clean: reduce padding by token. Never shrink type below the scale or hit areas below 44px.

### 3.8 Grid (desktop 1920) PROPOSED
- Max content width 1440, centred inside the main area (C5). Page padding sits outside the 1440.
- 12 columns, 24px gaps, derived column width 98px.
- Cards span 4, 6, 8 or 12 by importance. A row must sum to 12 (6+6, 4+4+4, 8+4, 4+8, 12). A lone half-width card is never allowed. This fixes the known row-card stranding at 1920.
- `BlockGrid` warns in dev and fails a test when a row does not sum to 12.
- Phone is 390px wide, a single column stack. Tablet and breakpoints are TBD (O4). Page padding on phone is 16 (from the scale).
- Blocks use container queries, so they respond to their own width.

### 3.9 Block (PROPOSED)
A Block is the one container for dashboard cards, page sections and lesson blocks.
- Props (names and types): `as`, `title`, `description`, `actions` (slot), `media` (slot), `span` (4, 6, 8, 12), `tone` (default, raised, emphasis, status), `status` (none, success, info, warning, error), `state` (ready, loading, empty, error), `padding` (default, compact), `headingLevel`.
- States: ready, loading (skeleton), empty (reason plus next action), error (what failed plus retry), focus-within, hover (only if clickable), pressed (only if clickable).
- A clickable Block has one primary link or button and no nested interactive hosts. A Block always has an accessible name.
- Every screen gets its own block layout. There is no single reference screen. LOCKED.

### 3.10 Shell (PROPOSED changes to locked values)
- Header 76px with the 136px clean wordmark: LOCKED (2026-11-13). Rows 48: kept.
- Sidebar 272/88 is LOCKED (2026-11-13). 240/72 is PROPOSED and needs an explicit unlock (C2).
- Collapse and expand animate about 250ms: LOCKED.
- Links: maroon, semibold at rest, NO underlines anywhere (rest, hover, focus): LOCKED (owner instruction 2026-11-14, C10). Hover adds the wash. Focus adds the wash and the 2px focus ring.
- Sticky header and focus: focused elements must never be hidden under the 76px header (WCAG 2.4.11). Use scroll padding.
- Shell types (PROPOSED): learner shell, academy shell (carried), desk shell (admin style), public shell (no sidebar, SEO), dossier shell (no navigation). Phone navigation pattern: TBD (O4). Muse fill: at 390px, overflow was never checked in the measured pass — stays open, do not claim it passes until the 390px overflow report exists.

### 3.11 Component inventory
- Existing components: Muse confirms from the live app and code before any new build. Muse fill from handover (VERIFIED, not from live click in this draft): AppHeader, AppSidebar, ChatPopup, AssistantView, teacher dashboard, classes, tests (builder), students, student tests/lessons/progress, Help, Guide, profile. FILL FROM CODE for the full component list at d9d24a3.
- To build on React Aria Components (missing in Figma): TextField, TextArea, Select, Checkbox, RadioGroup, Switch, Dialog, Drawer, Avatar, Toast, Breadcrumb, Tabs (desktop), Icon wrapper, Logo, Tooltip, DataTable.
- LTH components: Block, BlockGrid, ScoreCard, DimensionBar, AppealDialog, ProgressIndicator, StepIndicator, StatusBadge, LevelBadge (value from contract), CohortCard, Timeline (placement stages), AudioPlayer (with transcript slot), Recorder (mic states), FileUpload, Money (renders `[price]` for placeholders), TargetLabel, ContentBlock (sets `lang` and `dir` per block), MohsenPose, EmptyState, ErrorState, Skeleton, LanguageSwitcher, ThemeToggle.
- Doc page standard per component: purpose, anatomy, props table, variants, states, keyboard map, screen reader behaviour, RTL behaviour, dark behaviour, do and don't.

### 3.12 Variants, states, APIs (PROPOSED)
- Button variants: primary, secondary, tertiary, destructive. Sizes: default, compact (hit area still 44), icon-only (needs an accessible name). One primary per view region.
- States for all interactive components: rest, hover, focus-visible, pressed, disabled, loading, invalid, read-only where relevant. Pressed and skeletons are inherited gaps and must be built (§0.9).
- Disabled uses `aria-disabled` plus a visible reason where it matters (for example retake).
- Focus ring: maroon, 2px, offset 2px (PROPOSED FOR UI). Dark theme ring colour: derived, checked at 3:1 against its surface, PROPOSED. Muse fill: on the dark band the focus ring is cream (maroon ring is invisible on maroon).
- Inputs: 12px radius, maroon border on focus, label above, helper text below.

| Component | Key props | Notes |
|---|---|---|
| TextField | label, description, errorMessage, isRequired, isInvalid, inputMode, autoComplete | Visible label. Error linked with `aria-describedby`. Allow paste and autofill. |
| Select | label, items, selectedKey, onSelectionChange | Typeahead. RTL popover alignment. |
| Dialog | title, description, isDismissable, size, footerActions | Trap, Esc, focus return. Destructive dialogs focus the safe action first. |
| Drawer | side (inline-start, inline-end), title | Same rules as Dialog. Side follows direction. |
| Toast | tone, title, description, action, politeness | Never the only place for critical info. Errors persist. Duration TBD (O8). |
| ScoreCard | dimension, value, scale, explanation, evidence, source (auto, ai, human-reviewed), appealState, appealOwnerLabel | See §7. |
| AppealDialog | scoreId, reason, status | See §9.3. |
| ProgressIndicator | value, max, label, mode (determinate, indeterminate) | Progressbar or meter role as fitting. |
| Timeline | stages, currentStage, history | Placement tracker. Stage labels from the contract. |
| AudioPlayer | src, transcript, label | Keyboard operable. Transcript slot. Never autoplays. |
| Recorder | permissionState, isRecording, onStop | Text plus icon state. See §9.4. |
| Money | amount, currency, isPlaceholder | Renders `[price]` when placeholder. |
| TargetLabel | kind (target, illustrative, placeholder) | Visible text plus icon. Copy TBD. |
| ContentBlock | lang, dir | Isolates mixed direction content. |
| MohsenPose | pose, size | Static only. Cream card default (C15). |
| Logo | variant (wordmark-maroon, wordmark-cream, lockup) | Repo assets only. |

### 3.13 Motion tokens (PROPOSED)
- Durations: phi ladder around the shipped 250ms, rounded: instant about 100, fast about 155, base 250, slow about 405, celebrate about 655. Exact values await approval (C22).
- Easing by intent: enter (ease-out), exit (ease-in), move (ease-in-out). Curve values TBD.
- Animate opacity and transform only. No new animation library without approval.
- Skeleton appears within 100ms of navigation. Minimum display time TBD (C21, O8).
- `prefers-reduced-motion: reduce`: motion becomes instant or opacity-only, loops and autoplay stop, celebration becomes a static state plus a text announcement.
- No heavy WebGL.
- Mohsen loading animation is TBD. Interim: the static loading pose plus a standard progress indicator, labelled "animation pending" in docs.
- Celebration is rare and tied to real milestones. Never block the next action to finish an animation.

Journey map (every cell PROPOSED):
| Step | Entry | Progress | Feedback | Celebration |
|---|---|---|---|---|
| Browse catalog | staggered cards, fast | none | hover and focus wash | none |
| Find your level | step transition, base | step indicator | selected state | none |
| Placement test | calm, no flourish | progress indicator (timer only if the contract has one) | answer saved | none |
| Result and level | base reveal | none | explanation expands | one restrained moment, slow |
| Pick cohort | base | step indicator | selection confirmed | none |
| Sign exclusivity | dialog enter | read progress | signed confirmation | none (serious step) |
| Pay | page or dialog enter | payment state | persistent success or error | brief success state |
| Course player | lesson transition, fast | lesson and unit progress | marks on submit, ScoreCard reveal | unit complete, small |
| Live | join state | connection state | mic and camera state | none |
| Speaking Gym | static Mohsen pose | recording and analysing indicators | ScoreCard with explanation | practice milestone, small |
| Level-up gate | base | gate checklist | passed or not yet with reasons | main celebration, slow, single |
| Hiring Passport | section reveal | completeness meter | section completed | issued state, restrained |
| Placement tracker | timeline enter | stage progress | stage change toast and live region | placed, restrained |

### 3.14 WCAG 2.2 specifics
- 2.4.11 Focus Not Obscured: see §3.10.
- 2.5.7 Dragging Movements: no drag-only interaction. Question reordering in the test builder needs buttons or keyboard moves.
- 2.5.8 Target Size: 44px (owner lock, stricter than 24px).
- 3.2.6 Consistent Help: the Help entry sits in the same place on every screen.
- 3.3.7 Redundant Entry: do not ask twice for onboarding and checkout data in one journey.
- 3.3.8 Accessible Authentication: sign-in allows paste and password managers. Phone codes use `autocomplete="one-time-code"`. No cognitive tests.
- 2.2.1 Timing Adjustable: a timed placement test needs warnings. Whether time extensions exist is TBD (O14).
- Audio-only tasks (listen and repeat) and learners who cannot use them: accommodations TBD (O14).

### 3.15 Logo, mascot, icons
- Header wordmark is 136px (LOCKED). The token sheet's minimum for small header slots is 120px.
- Favicon and app icon: TBD, do not invent. Interim for internal builds only: "Bridgio" in Sora as text, or a Mohsen pose in a red rounded card.
- Mohsen appears in empty states, streaks, feedback and help, not on every screen. Poses come from the 16-pose sheet, never cut from the lockup. No transparent overlays.
- Icons: Lucide at `lucide-react@1.72.0` (VERIFIED from the handover; confirm against `package-lock.json`). Stroke: code 1.8 versus handover "Figma 22px stroke 2" (C12).

### 3.16 Storybook and documentation (PROPOSED, dependencies need approval)
- Storybook for React and Vite with docs, a11y and interaction add-ons.
- Toolbar controls: theme, direction, language.
- Every component has a story per variant and state, plus a long-text story and an RTL story.
- Component docs follow §3.11. A generated token reference and the contrast table are published with it.
- Published as a static Storybook link so Muse can click it.

### 3.17 Reference Systems (LOCKED — owner-approved 2026-11-14)

#### 3.17.1 Rule (LOCKED)
Reference systems are STUDIED, never INSTALLED as code. We never copy a reference system's brand, colours or fonts, and never paste its code, icons, tokens, illustrations or copy. We learn a pattern, then rebuild it on React Aria Components and our own tokens (§3, tokens.css).
Precedence (extends C20): WCAG and invariants, then this brief, then UX laws, then phi, then reference-system patterns, then taste. A reference system never overrides a locked value.

#### 3.17.2 Locked stack (LOCKED, restated, unchanged)
TanStack Start + Router + Query, TypeScript, Vite, React Aria Components, Lucide (lucide-react@1.72.0), npm. Nothing in this section changes it. Any new dependency needs owner approval (§16).

#### 3.17.3 Reference table (LOCKED)
| System | URL | Treatment | Study focus (LOCKED) |
|---|---|---|---|
| Spectrum | https://spectrum.adobe.com/ | Study only, never install | Best pattern reference per the owner. React Aria is Adobe's primitives, so use it for component behaviour, states and accessibility patterns. |
| MongoDB Design System | https://www.mongodb.design/ | Study only, never install | Owner gave no reason. Focus TBD. Interim: documentation structure and component states. |
| Dell Design System | https://www.delldesignsystem.com/ | Study only, never install | Owner gave no reason. Focus TBD. Interim: component anatomy and variant naming. |
| Atlassian Design System | https://atlassian.design/ | Study only, never install | Owner gave no reason. Focus TBD. Interim: foundations and tokens documentation, content guidance. |
| Fluent UI React Storybook | https://storybooks.fluentui.dev/react/ | Study only, never install | Story structure, state coverage per component, how stories are organised. Feeds the Storybook plan (§3, C36). |
| HeroUI | https://heroui.com/ | Study only, never install | Owner gave no reason. Focus TBD. Interim: component API shape and states. |
| Cult UI | https://www.cult-ui.com/ | Patterns only. Adapt to React Aria, do not install. | Copy-paste animated components. Rebuild the motion idea on React Aria and our motion tokens (C22). Do not paste its code or adopt its dependencies. |

Study-focus cells marked TBD or Interim are NOT VERIFIED. The author has not opened these sites. The owner or Muse confirms or replaces each focus.

#### 3.17.4 What a study produces (LOCKED)
Each study is a short reference note, not code. Location: TBD (proposed: a docs folder in the repo, owner to confirm). Each note records:
1. Component or pattern studied and the reference link.
2. The behaviour or pattern learned, in our own words.
3. How it maps to a React Aria Components primitive.
4. Which of our tokens it uses. No values from the reference.
5. States covered: default, hover, focus, pressed, disabled, loading, error.
6. RTL and dark behaviour.
7. A statement that nothing was copied.
A note is required before a new shared component is built from a studied pattern. The component PR links the note.

#### 3.17.5 Never (LOCKED)
- Install any of the seven study or pattern systems, or add their packages.
- Copy their colours, fonts, logos, wordmarks, icons, illustrations, tokens, spacing values, shadows or copy.
- Paste component code, including from copy-paste libraries.
- Commit screenshots of their products to the repo. Link only.
- Let a reference's look replace the BRIDGIO sticker style (solid surface, 1 to 2px maroon outline, no shadows) or the locked fonts and icons.
- Introduce a second icon source, a second component library or a second styling system because a reference uses one.

#### 3.17.6 Motion library decision (LOCKED, links C39 — LOCKED row)
Candidates: GSAP (https://gsap.com/) and Anime.js (https://animejs.com/). Pick ONE, or neither. Never both.
Default: CSS-only, driven by the motion tokens (C22). No heavy WebGL (locked owner rule).
Batch 0 proof step:
1. List each journey step (§3 motion map) whose entry, progress, feedback or celebration motion cannot be done in CSS.
2. For each, record why CSS fails: sequencing, scrubbing, path animation, orchestration across components, or other. Do not assume a failure.
3. If none fails, no library is added and C39 closes as CSS-only.
4. If at least one fails, run the evaluation below and bring ONE recommendation to the owner.
Evaluation criteria, each filled from the library's own docs and from our build, not from memory: licence and terms of use (NOT VERIFIED until owner confirms); bundle cost (measure from npm run build, before and after); prefers-reduced-motion (must be honoured through one central switch); RTL (direction-aware motion); SSR and hydration (safe under TanStack Start); React lifecycle (clean setup/cleanup); accessibility (never animates/hides focus ring); tree-shaking; maintenance.
The recommendation names one library, the steps that need it, the measured bundle delta and the reduced-motion plan. The owner approves before install. Motion tokens remain the single source of timing even if a library is added.

#### 3.17.7 AI chat evaluation (LOCKED, links C40 — LOCKED row)
Candidate: TanStack AI (https://tanstack.com/ai/latest). Evaluate, do not install blindly. Purpose: Mohsen chat (curriculum Q&A, from LMS.md).
Baseline problem: Mentingo's `/api/course-chat` and `/api/luma/authoring` are not in the committed schema and are NOT VERIFIED. The comparison baseline is whatever O20 verifies. Until then, the evaluation compares against the mock contract (§6), not against a claimed Mentingo capability.
Evaluation note covers: what the chat layer needs from the contract; whether TanStack AI fits the locked stack without a second state/data layer beside TanStack Query; streaming and failure behaviour with the mock contract; BFF fit (all AI calls through BFF, no provider key/secret in client, no vendor model names in UI); accessibility of chat UI; maintenance and maturity.
Outputs: one evaluation note and a recommendation. No install in Waves 1 to 3. Decision due before Wave 4 starts. The owner decides.

#### 3.17.8 Delivery: ui-skills (LOCKED)
Delivery mechanism: ui-skills (https://www.ui-skills.com/), installed by the owner via CLI. It is a curated directory of agent skills. It is NOT a bundle of the ten systems above. None of the reference systems arrive through it.
Routing: OpenCode uses ui-skills-root to route a task to at most 3 skills. Example skills: baseline-ui, fixing-accessibility, frontend-design. Muse confirms these names exist on ui-skills.com. OpenCode confirms what is actually installed on the machine (see §3.17.8 rules).
Rules:
1. A skill is guidance, not a dependency. It is never listed in package.json and never imported by product code.
2. At most 3 skills per task. The delivery note names which were used.
3. This brief outranks any skill. If a skill suggests a font, colour, icon set, library, emoji, shadow, or Fredoka, the brief wins and the suggestion is ignored.
4. A skill may not add a package. Any dependency still needs owner approval (§16).
5. Skill output is held to the same gates as any other work (§12): tests, typecheck, build, screenshots, artefacts.
6. Where the skill files live in the repo and whether they are committed is TBD. The owner confirms, and OpenCode reports the location.
7. Skills replace no process rule. Fresh session per batch, branch only, Muse verifies, the owner merges (§16).

#### 3.17.9 Gate additions (LOCKED)
Add to each delivery note:
- Reference notes written this batch (links), or "none".
- Skills used (max 3 per task), or "none".
- package.json diff: "no new dependency", or the approved dependency and the C-row or O-row that approved it.
- Statement: nothing copied from a reference system.

---

## §4 Information architecture

### 4.1 Roles and surfaces (scope brief)
| Role | Surface | Access | Device priority |
|---|---|---|---|
| Visitor | Public storefront | none | mobile-first |
| Learner | Learner portal | login | mobile-first |
| Academy owner / instructor | Academy and instructor portal | login | desktop-first |
| Neutral assessor (main native-level instructors, one set per language) | Assessor portal | login | desktop-first, PROPOSED |
| Super Admin (owner, alone today) | Internal desk | login | desktop-first |
| BPO talent lead | Dossier | magic link, no login | TBD |

Staff roles: one Super Admin today, others defined but empty. PROPOSED. Mentingo roles are admin, content creator and learner (DOC-ONLY, NOT VERIFIED). Do not invent further roles.

### 4.2 Route groups (PROPOSED; the owner approves names)
Public, `learn`, `academy`, `assessor`, `desk`, `dossier/$token`. The fork's `/teacher` routes are renamed. Teacher framing is deleted on day one (scope brief). Tests on renamed routes are ported (C34).

### 4.3 Route rules
- Role guard on every authenticated route. Forbidden is a designed screen.
- Every route sets a document title and moves focus to the main heading.
- No orphan routes. Every route is reachable from navigation or a flow.
- Public pages: server-rendered meta, one h1, canonical, alternate-language links, no sidebar. The blueprint wants SEO. Sitemap and robots depend on hosting (TBD).
- Dossier: outside the shell, read-only, `noindex`, no referrer leakage. Token expiry is TBD (O11). A password step is TBD (C32).

---

## §5 Global controls

| Control | Behaviour | Status |
|---|---|---|
| Language switcher | UI language. Direction comes from the language record. AR and EN verified by gate screenshots. Others TBD (O15). Default UI language TBD. | PROPOSED |
| Theme toggle | Light, dark, system. Storage choice TBD. | PROPOSED |
| Account menu | Profile, sign out (cookie auth via BFF). | PROPOSED |
| Help | One entry in the same place everywhere (WCAG 3.2.6). Help and Guide are role-scoped. | PROPOSED |
| Mohsen launcher | One persona, same entry everywhere. Placement TBD. | LOCKED persona, TBD placement |
| Academy switch | A request flow within one language, approved on the platform side. Not a free dropdown. | LOCKED rule, UI PROPOSED |
| Active course | One per language. The UI blocks a second and says why. | LOCKED |
| Notification centre | One inbox with channel-agnostic types. In-platform and email first. | Channels LOCKED, centre PROPOSED |
| Time zone | Live sessions show the learner's zone, with the label visible. | PROPOSED |
| Scenario panel | Mock-only role and state toggles. Removed in BFF builds. | PROPOSED (C33) |

All global controls are keyboard reachable, labelled, work in RTL and dark, and persist across navigation.

---

## §6 Mock contract

### 6.1 Principles
- One typed contract module. A mock adapter implements it. A BFF adapter replaces it later with no screen changes. The fork already has a contract: inspect it first and extend it, do not rewrite it. FILL FROM CODE — confirm the exact contract file in the fork at Batch 0.
- Calls go to a same-origin BFF path. Cookies only. VERIFIED.
- TanStack Query owns server state, with stable keys per resource.
- Common error shape. Loading, empty, error, forbidden and conflict states for every resource. CONFLICT (409) is already observed in the fork (retake) and is used for "second active course in a language".
- Dev-only latency and state toggles through the scenario panel.
- Fixtures are placeholders only (§2.6, §2.7). Money fields carry `amount: null` and `isPlaceholder: true`.
- Level and CEFR-style labels come from the contract, never hard-coded. Blueprint labels (A0 to B2) are examples. PROPOSED.
- Every contract change is logged with a version note and an integration checklist.
- Parts of the Mentingo schema are VERIFIED (committed `api-schema.json`, 494 paths and 575 operations per the handover). Mentingo has no parent/assistant concept, no curriculum model, no teacher dashboard aggregate, and only course-level publishing (VERIFIED). So aggregates and curriculum structure are BFF-composed or mock-only.

### 6.2 Resources (PROPOSED names, field names only)
| Resource | Fields | Owner per blueprint | Status |
|---|---|---|---|
| Session and user | id, role, displayName, uiLanguage | Mentingo auth via BFF | Auth VERIFIED |
| Language | code, label, direction, script, fontStack, numeralSystem, appealOwnerReady | BFF | PROPOSED |
| Academy | id, name, languageCodes, status | BFF | NOT VERIFIED (tenant provisioning API) |
| Course | id, languageCode, academyId, levels | Mentingo via BFF | PROPOSED |
| Enrolment | courseId, learnerId, active | BFF | PROPOSED, one active per language |
| Academy switch request | id, from, to, languageCode, reason, status | BFF, desk approval | PROPOSED, review private |
| Placement test | id, attemptState, result | BFF | PROPOSED, no free retakes, CONFLICT 409 |
| Cohort | id, courseId, label, schedule, capacity, seats | Custom core | NOT VERIFIED (groups as cohorts) |
| Roster and attendance | cohortId, learnerId, sessionId, status | LiveKit plus custom core | NOT VERIFIED |
| Exclusivity agreement | id, version, signedAt, status | Custom core | PROPOSED, legal text and binding moment TBD |
| Eligibility profile | graduationStatus, militaryStatus, shift, location | Custom core | PROPOSED, sensitive, legal gate |
| Payment | id, status, provider (neutral), installments | Custom core | NOT VERIFIED (Stripe-only) |
| Lesson and submission | id, type, state | Mentingo | VERIFIED marks on submit |
| Auto mark | submissionId, score, counts | Mentingo | VERIFIED |
| AI score | id, submissionId, dimension, value, scale, explanation, evidence, source | BFF | NOT VERIFIED (five-dimension coverage) |
| Appeal | id, scoreId, reason, status, outcome, reviewedByRole | BFF | PROPOSED; window and breakdown depth TBD |
| Live session | id, start, joinState | BFF | NOT VERIFIED (voice over LiveKit) |
| Speaking Gym session | id, scenarioId, recording, results | BFF | NOT VERIFIED |
| Level-up gate | id, criteria, state | BFF | PROPOSED |
| Hiring Passport | id, sections, completeness, audioIntro | Custom core | PROPOSED |
| Placement record | id, stage, history | Custom core | PROPOSED |
| Dossier | id, token, candidates, expiry | Internal CRM | PROPOSED; counts TBD |
| Notification | id, type, channelHints, readAt | BFF | PROPOSED |
| Finance record | id, type, status | Custom core | PROPOSED, all amounts placeholders |
| KPI funnel | stages, counts | Custom core | PROPOSED, counts placeholders |

### 6.3 Claim register
| Claim | Status |
|---|---|
| Mentingo auth: httpOnly cookies, sameSite strict, same-origin BFF required | VERIFIED |
| Mentingo marks on submit (evaluation-quiz returns score and counts) | VERIFIED |
| Mentingo is MIT licensed, source public | VERIFIED (handover) |
| No parent/assistant concept, no curriculum model, no teacher aggregate, course-level publishing only | VERIFIED (committed schema) |
| `/api/luma/authoring` and `/api/course-chat` exist | NOT VERIFIED (absent from committed schema) |
| Stripe-only payments | NOT VERIFIED |
| Shipped UI languages | NOT VERIFIED |
| Voice over LiveKit | NOT VERIFIED |
| "No cohorts or attendance" as confirmed absent | NOT VERIFIED |
| Tenant-provisioning API | NOT VERIFIED |
| Five-dimension scoring coverage | NOT VERIFIED |
| Groups as cohorts | NOT VERIFIED (README and architecture doc only, no code) |
| Row-Level Security tenancy, roles, AI mentor role-play | NOT VERIFIED (DOC-ONLY) |

UI built on a NOT VERIFIED claim sits behind an adapter or a flag and is named in the delivery note.

---

## §7 Learner and scoring experience

### 7.1 Principles
- Phone-first for lesson, speaking and tracker screens.
- Always show where I am, what is next and how I am doing.
- Scores are explained, never just numbers.
- Student copy leads with the next small step. Hiring and pay statements are targets (C27).

### 7.2 Scoring display
- Five dimensions: pronunciation, fluency, empathy, vocabulary, listening. LOCKED. One score format regardless of engine. LOCKED.
- ScoreCard renders any subset. A dimension not in the data shows "not assessed", with a reason if the contract gives one. Writing has no pronunciation, for example. Coverage is NOT VERIFIED.
- Each ScoreCard shows: dimension, value on the contract's scale, plain-language explanation, evidence pointer if provided, source label, appeal action.
- Source labels are text: auto-marked, AI-marked, human-reviewed (after appeal).
- Never colour alone. Value is number plus label plus a bar. Brand red is never used for low scores.
- Scale and thresholds come from the contract. No invented bands. Per-criterion breakdown beyond the five dimensions is TBD (O13). Confidence display is TBD.
- Mohsen explanations are labelled AI, in Assistant mode (careful, verifiable).

### 7.3 Journey states
Placement result, gate, passport completeness and placement stage each have designed states: not started, in progress, passed, not yet, blocked, error. "Not yet" is specific and encouraging, with next steps. It is not styled as an error.

### 7.4 Levels behind an account
A level or score is never rendered on a public route. The catalog may show a cohort's target level. It never pre-selects a level for a visitor. The "Find your level" teaser shows none.

### 7.5 No free retakes
Before the test starts, a confirmation states that this attempt counts. After completion, a retake control is absent or `aria-disabled` with a reason. A paid retake path is TBD (O10, no price assumed).

---

## §8 Screens and flows

### 8.1 Rules
Every screen serves on its own: own block layout on the 12-column grid, spans 4, 6, 8 or 12. LOCKED. Numbers on blueprint screens are placeholders (§0.4).

### 8.2 Public pages (blueprint 1 to 7; build in Wave 3)
| # | Page | Traps to respect |
|---|---|---|
| P1 | Learner landing | "Find your level" CTA to sign-up. The teaser reveals no level. Salary and ROI calculator and partner logos: C30. The "2-minute teaser" is an AI feature and NOT VERIFIED. |
| P2 | Enterprise BPO partnership landing | Talent counter is an invented number. The sample dossier preview uses placeholder data only. |
| P3 | Academy and instructor partner landing | Bonus and commission calculators: invented figures, hidden by flag. |
| P4 | Multi-academy cohort catalog | Axis: language, then level, then cohort, academy as attribute (PROPOSED). Says if the learner already has an active course in that language. "Rating" and "Historical placement %" have no data: empty states or omitted. |
| P5 | Academy profile | No per-academy branding or domain. Reviews, placement counts and speaking sample have no verified data. |
| P6 | Career tracks directory | Salary band is a target. Never show real company names. |
| P7 | Exclusivity, payment and legal | Provisional until the legal review. Voice biometric and national ID disclosures need legal. |

### 8.3 App screens (blueprint 1 to 25) and additions
| Wave | Screens (blueprint #) | Notes |
|---|---|---|
| 0 | Design-system foundation, day-one deletions, inherited gaps | See §12.1 |
| 1 | 11 Partner onboarding and calibration, 12 Academy dashboard, 13 Cohort builder and seat publisher, 14 Roster and attendance, 15 Curriculum and lesson builder, 16 Grading rubric; carried shell, profile, Help, Guide, test builder with Mohsen, question bank, material library, per-test results | 12 to 16 adapt from BRIDGIO. Pricing "within approved bands": bands TBD. Attendance NOT VERIFIED. |
| 2 | Account and access, 1 Onboarding and eligibility (split, C23), 3 Learner dashboard, 4 Course and module player, enrolment and checkout (cohort pick, exclusivity, pay), academy switch request, notification centre | Auto-mark display uses the final ScoreCard. Dashboard attendance, countdown and streak come from mock. |
| 3 | Public pages P1 to P7, public shell, SEO | Reuses CohortCard from Wave 2. |
| 4 | 2 Placement test, 5 Live classroom and replay, 6 Speaking Gym, 7 Level-up gate, learner appeals, 18 Assessor verification queue and appeal resolution, Mohsen mentor | Needs the media adapter. Assessor queue placement is PROPOSED. |
| 5 | 8 Hiring Passport, 9 Placement tracker, 10 Tuition wallet, 17 Earnings ledger, 19 Dossier, 20 Talent matching, 21 BPO CRM, 22 Tenant provisioning, 23 Rubric manager, 24 Escrow and billing ledger, 25 Telemetry, KPI funnel, in-flow consent, desk approval of academy switches | All money is provisional and placeholder. |

The wave assignment of 2, 8, 9, 10, 17, 18 and the academy switch is PROPOSED. The owner approves it per screen.

Blueprint screen list (Muse fill from blueprint file — VERIFIED from source):
Public P1–P7: Learner Landing, Enterprise BPO Partnership Landing, Academy & Instructor Partner Landing, Multi-Academy Cohort Catalog, Academy/Instructor Public Profile, Guaranteed Career Tracks Directory (neutral name in this brief: career tracks directory), Placement Exclusivity / Payment / Legal Pages.
Learner 1–10: Onboarding, Eligibility & Exclusivity Gate; Baseline AI Placement Test; Learner Command Dashboard; Course & Module Player; Live Classroom & Replay Archive; AI Speaking Gym; Level-Up & BPO Readiness Gate; Verified Hiring Passport; Placement Concierge & Interview Tracker; Tuition & Installment Wallet.
Academy 11–17: Partner Onboarding & Calibration; Academy Multi-Tenant Dashboard; Cohort Builder & Seat Publisher; Instructor Cohort Roster & Attendance; Curriculum & Lesson Builder; Structured CEFR Grading Rubric; Earnings, Escrow & Payout Ledger.
Assessor 18: Independent Verification Queue. Dossier 19: Verified Batch Dossier (Magic Link).
Internal 20–25: Internal Talent Matching & Batch Builder; BPO Account & MSA Pipeline CRM; Tenant Provisioning & Partner Ops; Master CEFR & AI Rubric Manager; Escrow, Split-Payout & B2B Billing Ledger; Anti-Circumvention & Telemetry Hub.

### 8.4 Screen spec template (required before building each screen)
Route; role and guard; purpose and primary task; block list with span per block at 1920 and stack order at 390; states (loading, empty, error, forbidden, partial, offline); contract resources and their tags; actions and confirmations; keyboard path; landmarks and headings; RTL notes; motion per §3.13; fixtures; open questions.

### 8.5 Flows
- Learner journey: P1 or P4, sign-up (email or phone only), placement test, cohort pick, exclusivity, pay, course player and live and Speaking Gym, level-up gate, Hiring Passport, placement tracker. Tested end to end only after Wave 5 (C24).
- Placement stages (blueprint labels, PROPOSED): Ready for Pool, Submitted to BPO, BPO Language Screen, Ops Interview, Offer Signed. The contract supplies the stage list.
- Appeal: see §9.3. Academy switch: learner request with review and reason, desk approval, private result.
- Dossier: link opens a read-only page. Contact stays masked until "Request Interview", which creates a logged request (attribution).

### 8.6 Required states on every screen
Loading skeleton, empty with next action, error with retry, forbidden, offline or slow, partial data, plus long-text and RTL stress.

---

## §9 Actions and AI

### 9.1 Action patterns
- Reversible: do it, then a toast with undo if supported.
- Consequential (start placement test, sign exclusivity, pay, academy switch request, submit appeal): a confirm dialog states the consequence in plain words. The safe action is focused first.
- Destructive: destructive variant plus confirmation.
- Pending state on the button. Double-submit prevented. Errors say what happened and what to do.

### 9.2 Mohsen
One persona across mentor, Speaking Gym and test authoring. LOCKED. In Assistant mode:
- Answers are grounded in the course material or fixed curriculum and show the grounding.
- If he does not know, he says so and does not guess.
- Answers are labelled as AI.
The authoring and chat endpoints are NOT VERIFIED (§6.3), so they sit behind an adapter. Final animation, favicon and cutouts are TBD (O7).

### 9.3 Intelligent marking and appeals
Flow: submission, auto mark (VERIFIED), AI mark (coverage NOT VERIFIED), ScoreCard, appeal.
- Appeal action sits on every AI score. A dialog shows the score, a reason field and what happens next. A visible status follows: submitted, in review, outcome.
- Appeal owners are native-level instructors, independent of academies, defined after the platform is finished. The UI uses a generic "assessor" label.
- One appeal per assessment within a window. The window is TBD (O13), so the UI renders it from the contract and never states a number.
- A language needs an appeal owner before it opens for enrolment (PROPOSED, `appealOwnerReady` on Language).
- Gate decisions that depend on an AI score link to the appeal path.

### 9.4 Speaking, recording and consent
Mic permission states: prompt, granted, denied (recovery steps), unavailable. The recording indicator is text plus icon. Transport is NOT VERIFIED, so keep it behind a media adapter. Voice biometric and national ID consent appears in-flow where collected (PROPOSED, needs legal). Retention copy is TBD (O12).

### 9.5 Live
Join, connection, mic and camera states. Time zone label. Captions are TBD.

---

## §10 RTL and Arabic

- Language is data. Direction, script, font stack and numeral system come from the language record. LOCKED.
- Direction is per content block: wrap lesson content in `ContentBlock`. UI language and course language are separate axes.
- Use logical properties and flow-relative layout.
- Mirror: sidebar, drawers, breadcrumb separators, chevrons, progress fill, step indicators, back and next.
- Do not mirror: the logo and wordmark (LOCKED, Mohsen stays on the same side), media play controls, checkmarks, clocks, numbers, time axes, waveforms. PROPOSED.
- Isolate mixed text: names, emails, URLs, codes, numbers. Transcript segments set direction per segment.
- Arabic typography: font roles per §3.6. No letter-spacing, no italics, no uppercase. Arabic line-heights beyond the sheet's are TBD. Test bilingual headings early.
- Numerals follow the language record. Default TBD (O9).
- Copy is centralised. No concatenated sentences. Plurals use Intl rules. Arabic is draft until the reviewer's pass. Register: C26.
- Every gate screenshot exists in AR and EN. An AR-only layout bug is a blocker.

---

## §11 Navigation and hygiene

### 11.1 Navigation
- Desktop: sidebar plus header, breadcrumbs beyond two levels, desktop tabs for in-page sections. Phone pattern TBD (O4).
- Skip link. Landmarks. One h1 per page, ordered headings. `aria-current` on the current page. Focus moves to the main heading on route change.

### 11.2 Hygiene
- Keep and extend the E1 stylelint guard. FILL FROM CODE for what it enforces — from handover, E1 is in the gaps queue, not done at d9d24a3; target rules: no raw hex, no physical left or right, no inline `font-family`. New lint dependencies need approval.
- No non-Lucide icons. No emojis. No hard-coded user strings.
- No console errors or warnings in gate runs.
- No dead links or orphan routes. 404 and forbidden screens are designed.
- Images have alt text or are explicitly decorative. No lorem ipsum that reads like claims.
- Do not edit bridgio-frontend.

---

## §12 Waves and gates

### 12.1 Build order (LOCKED)
1. Academy and instructor. 2. Learner core. 3. Public storefront and catalog. 4. AI and live. 5. Placement desk, dossier, finance.

Batch 0 (PROPOSED, Wave 0, before any screen):
- Design-system foundation: inputs, dialog, drawer, avatar, toast, breadcrumb, tabs, icon wrapper, logo, Block, BlockGrid, Skeleton, ScoreCard.
- Inherited gaps: F1 contrast fix, E1 guard, pressed states, skeletons, motion tokens, woff2 and preload, row-card pattern and desktop grid, screenshot matrix, axe and 390 overflow check.
- Day-one deletions (scope brief): high-school content, teacher framing and subscription language, seed people, the assistant role and messages link, the dev-chrome flag. Replace the flag with the scenario panel (C33). Port tests (C34).
- Contrast script and token reference doc. Storybook set-up if approved.
- Fonts (C13/C41, PROPOSED): add the three stack tokens and replace every literal `font-family` outside `tokens.css` and `fonts.css` (minimum: delete `'thmanyahsans',` from the 32 label/UI declarations); extend the E1 stylelint guard to ban new literals (E1 scope NOT VERIFIED, any new dependency needs approval, C36). Add Alexandria 400 and Nunito 400 faces to `Bridgio Label`. Audit `app.css` line 1529 (display stack at `--font-body-size`) and every element that gets the display face; decide each one. Measure at the sizes `tokens.css` actually resolves, including the second size set at lines 157–162 (condition TBD, C42 held). Check 14px on a 390px phone, joiner characters U+200C–U+200F, WCAG 1.4.12 and 1.4.4, fallback layout shift, and a "Typography AR" Storybook story. Copy the three woff2 files into `src/assets/fonts/` (original names, unmodified), imported by Vite so the build bundles them into hashed assets; Vercel reads them from the repo build. Never put any Thmanyah file under `public/`, `dist/` or `.output`, and never ship the zip or a download link. History check: no `*thmanyah*` files under `public/`, `dist/`, `.output` in the fork. Rewrite the `fonts.css` pending-block comment (files ship via the build bundle, C13/O3). Every delivery note states which font set the screenshots used (Thmanyah once bundled). Fork must not inherit `preview.log`, `preview-final.log`, `vercel-build.log`, `.vercel`, `.output` or `dist`.

### 12.2 One batch at a time
Each batch is a small named set of components or screens. The next starts only after the gate passes and the owner approves.

### 12.3 Gate (LOCKED list)
- `npm test` passes, with a count of at least 142.
- `npm run typecheck` passes.
- `npm run build` passes.
- Screenshots: light and dark, 1920px and 390px, AR and EN. That is 8 per screen.
- A delivery note with an integration checklist per screen.

Also required in each gate (PROPOSED): contrast script output, axe report, 390px overflow report, 44px target report. Each is a file or link (C37).

### 12.4 Delivery note template
Per screen: route, role guard, contract resources and tags, states covered, RTL checked, keyboard path walked, screen reader labels, reduced-motion behaviour, the 8 screenshots, tests added, tokens used, new components, deviations from this brief, open questions, and a click path Muse can follow.

### 12.5 Visual regression (PROPOSED)
Screenshot Storybook and key screens across light/dark, LTR/RTL and 1920/390. The owner approves baselines. A baseline update needs a reason in the commit. Tooling (self-run browser tests or a hosted service) is TBD (O6).

### 12.6 Muse's limits and what OpenCode produces
Muse verifies by clicking. It cannot open a console, resize the viewport or run a screen reader. So OpenCode builds:
- Static screenshots at 390 and 1920.
- A Storybook with viewport presets.
- An automated axe run (stories and key screens) saved as a report.
- A script that flags horizontal overflow at 390px.
- A script that measures hit areas.
- Accessibility-tree snapshot tests in the test suite.

### 12.7 Accessibility test plans
Keyboard, per pattern:
- Dialog and drawer: open, focus moves in, Tab and Shift+Tab cycle inside, Esc closes, focus returns to the trigger.
- Select, tabs, breadcrumb, toast actions, appeal: reachable and operable, arrow keys where expected.
- Skip link works. No keyboard traps. Focus ring at 3:1 or better. Focus never hidden under the header.
- Test builder: question reorder works without dragging.

Screen reader, per pattern: every control has a name, role and state. Errors are announced and linked. Live regions cover progress and status changes (placement stage, scoring done). ScoreCard reads dimension, value, explanation, then appeal. Manual runs (which tools and who) are TBD (O14).

Automated: axe, the contrast script, reduced-motion test, 44px target test, RTL snapshot, a test that no level or score component renders on public routes, and a `BlockGrid` row-sum test.

---

## §13 UX law and polish

These sit above phi.
- Fitts: 44px targets. Primary actions within thumb reach on phone.
- Hick: few choices per step. One primary per region.
- Miller and chunking: short lists, grouped blocks.
- Gestalt proximity: outer gap greater than inner padding groups content (about phi).
- Jakob: familiar patterns for forms, navigation and payment.
- Doherty: respond fast, and show progress when you cannot.
- Von Restorff: one emphasised element per view.
- Zeigarnik and goal-gradient: show progress and what is left.
- Peak-end: celebrate rare real milestones, end flows clearly.
- Postel: forgiving inputs, clear errors.

Polish checklist per screen: aligned to grid, radius and outline from tokens, empty and error states designed, no layout shift on load, short specific copy, dark checked, AR checked, icon weight consistent, no orphan words in headings where avoidable.

---

## §14 Documents

Read in this order each session:
1. BRIDGIO_Learn-to-Hire_approved_scope_brief.pdf (2026-11-14)
2. platform_product_screen_blueprint.md (numbers INVENTED)
3. LMS.md
4. BRIDGIO-UI-UX-token-sheet.md (working sheet, 2026-11-01)
5. BRIDGIO-session-handover.md (state at d9d24a3)

Keep them under `docs/sources/`, read-only. Path PROPOSED.

Referenced by the sources but not seen by the author of this brief:
- BRIDGIO-LIVE_RULES.md. Copy into `docs/` before each builder session and never edit it to claim a fix is verified.
- BRIDGIO-contract-vs-mentingo-diff.md and BRIDGIO-mentingo-integration-api-brief.md.
- BRIDGIO-page-catalogue.md (statuses stale) and BRIDGIO-measured-pass-report.md.
- The Figma file, `tokens.css` and the live site at https://bridgio-frontend.vercel.app/. Muse confirms existing components and states against the live site before any new build.

Documents to maintain (PROPOSED, under `docs/`): this brief, decisions log, token reference with contrast table, component docs, contract doc, accessibility test plan, visual regression policy, delivery notes per batch, open decisions register.

---

## §15 Open decisions

| # | Decision | Status |
|---|---|---|
| O1 | Owner approves or changes every C-row, C1 to C41. C1–C9, C11–C41 approved by owner 2026-11-14 (date not filled in the brief — do not invent). C10 not approved (no underlines). | LOCKED rows C1–C9, C11–C41; C42 HELD |
| O2 | Light end stop for ladders (paper or white) and step counts | TBD |
| O3 | Thmanyah integration. Owner decision 2026-11-14 (final): USE IT, build-bundled — the three woff2 files (Display Black 79,212 B, Display Bold 81,988 B, Serif Text Regular 80,208 B, original names, unmodified) live in the repo under `src/assets/fonts/`, imported by Vite into hashed build assets; Vercel reads them from the repo build. Never in `public/`, never a download link, never the zip. No written permission sought (permission path dropped earlier the same day, superseded by this decision). Licence (read from both PDFs in the owner's zip): proprietary, Reserved Font Name; commercial web/app use allowed; Arabic version prevails; ask@thmanyah.com is the contact in the licence. Also open: whether the licence requires any on-site notice/attribution (licence text as given is silent), whether Sans is ever used, removal of Baloo and `Sora-Variable.ttf`, other scripts, Arabic line-heights. | Decided 2026-11-14 (owner); open sub-items listed |
| O4 | Phone navigation pattern and tablet breakpoints | TBD |
| O5 | Figma sync approach | TBD |
| O6 | Visual regression tooling and cost | TBD |
| O7 | Mohsen animation, favicon, transparent cutouts | TBD, illustrator |
| O8 | Skeleton minimum time and toast durations | TBD |
| O9 | Numeral defaults per language | TBD |
| O10 | Paid or approved retake path (no price assumed) | TBD |
| O11 | Dossier token expiry, visible content, password step | TBD |
| O12 | Recording consent and retention copy | TBD, legal |
| O13 | Appeal window, per-criterion breakdown, confidence display | TBD, owner, before appeal screens |
| O14 | Timed-test extensions, audio accommodations, manual screen reader runs | TBD |
| O15 | UI languages beyond AR and EN, default UI language | TBD |
| O16 | Exclusivity text and when it binds | TBD, legal |
| O17 | Tuition on academy switch, escrow, split payouts, refund and clawback terms | TBD, legal and finance |
| O18 | Assessor pool and terms | TBD, after the platform is finished |
| O19 | Clients beyond BPOs, WhatsApp and SMS | TBD, later |
| O20 | Verification of NOT VERIFIED Mentingo claims | TBD, before the BFF build |
| O21 | Name, domain and trademark status before public exposure | TBD, owner |
| O22 | Owner-only from handover: Option A about 1.5px padding deviation, Crossroads 3/4/6 (scoring split, messages, Mohsen mentor test), support-contact channel, key rotation, preview protection, `VITE_SHOW_DEV_CHROME` | TBD |
| O23 | Shell lock changes, dark lock, icon stroke, tokens locks (C2, C6, C12). C2 approved 2026-11-14 (sidebar unlock 240/72) — the sidebar part is closed. C6 approved (dark values from tokens.css). C12 approved as 'keep 1.8 until owner picks' — the icon-stroke part stays open. | Partially closed; icon stroke open |

---

## §16 Process rules

1. Read this file and the sources first, every session.
2. Fresh session per batch. Branch off `origin/main`. Push the branch only, with no merge. If the owner opens a PR, it has a title and description (C35). Muse verifies the gate. The owner merges.
3. A merge does not make production live. Verify production after every merge.
4. npm only. No new dependency without approval.
5. Autonomy.
   - Without asking: helper naming, story and test files, refactors inside a batch that change no behaviour, bug fixes against the spec.
   - Must ask: any new dependency, token value or colour, number or claim in copy, contract change, new route, deviation from this brief, anything tagged PROPOSED, TBD or NOT VERIFIED.
6. If sources conflict, stop and report. Do not choose silently.
7. Never present a PROPOSED value as LOCKED, in code comments, docs or UI. Never present a NOT VERIFIED Mentingo claim as confirmed.
8. Do not invent numbers, prices, salaries, commissions, holdbacks, counters, dates, BPO names, logos, academy names, favicon, cutouts or final Mohsen animation.
9. No emojis anywhere, including commit messages. Lucide only. Commit messages are plain imperative text.
10. Tests never drop below 142. Add tests with new work.
11. Do not touch bridgio-frontend. Do not fork or deploy as part of a design task.
12. Every delivery note includes a click path for Muse.
13. When unsure, ask one specific question with a recommended answer and the reason.

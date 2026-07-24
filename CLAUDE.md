# Word Game Clone — Project Memory

Loaded every session — keep it lean. Deep docs live in `docs/` and are pulled **on demand**:
- `@docs/process.md` — how we work: spec lifecycle, session rhythm, completion ritual (read once)
- `@docs/architecture.md` — system design decisions + Known Constraints (read the section you need)
- `@docs/specs/INDEX.md` — the spec index + status (one row per spec)
- `@docs/specs/SPEC-XXX-*.md` — the spec you're implementing
- `@docs/component-inventory.md` — reusable modules/services/components already built
- `@docs/spec-delivery/SPEC-XXX-*.md` — what a past spec delivered (pull only when a dependency points to one)
- `@docs/best-practices/INDEX.md` — domain coding rulebooks (React, accessibility); route here, then load only the section(s) you need

---

## Project Overview

An accessible, browser-based clone of a popular six-letter word-guessing game. A player gets a fixed
number of guesses to find the day's word; each guess is scored letter-by-letter and rendered with a
Neobrutalism visual style. Accessibility is a first-class goal (the author is a 508 specialist), so the
game is fully keyboard- and screen-reader-operable. It ships as a static single-page app; a Supabase
Postgres backend holds the master word list for future server-driven play.

## Layout

- `src/features/` — feature modules (`game-board`, `guesses-view`, `past-words`, `virtual-keyboard`).
- `src/components/` — reusable UI primitives (`board-wrapper`, `buttons`, `keyboard-letter`, `letter-box`, `modal`).
- `src/hooks/` — shared React hooks (e.g. `Toggle`).
- `src/utils/` — pure game logic helpers (`GameHelpers`, `GameBoardHelpers`, `KeyboardHelpers`).
- `src/typing/` — shared types (`components/`) and enums (`enums/`). Types live here, not inline in features.
- `src/api/client/` — Supabase client wiring.
- `public/words.json` — the 100-word list loaded into localStorage at runtime.
- `supabase/` — DB `migrations/`, declarative `schemas/`, and `seeds/` (deployed by `.github/workflows/main.yml`).
- `cypress/e2e/` — end-to-end tests. `docs/` — spec-driven docs. `__mocks__/` — file/style mocks.

## Tech Stack

| Area | Choice |
|---|---|
| Language | TypeScript ~5.6 (strict) |
| UI | React 18.3 (function components + Hooks) |
| Build/dev | Vite 6 |
| Styling | Tailwind CSS 4 (via `@tailwindcss/vite`) |
| Backend | Supabase (`@supabase/supabase-js` 2), Postgres |
| UI libs | `react-toastify` (alerts), `react-focus-lock` (modal focus trap) |
| Tests | Cypress 13 (e2e). Vitest is installed but **not wired** — see `@docs/architecture.md` Known Constraints |
| Lint/format | ESLint 9 (flat config, `typescript-eslint`), Prettier 3 (+ tailwind plugin) |
| Hosting | Netlify (frontend); GitHub Actions deploys Supabase on push to `main` |

**Don't add dependencies without noting them here first.**

## Code Conventions

- **Strict TypeScript.** `strict`, `noUnusedLocals`, `noUnusedParameters`, `noFallthroughCasesInSwitch`
  are on — code must pass `npm run typecheck` clean. Prefer explicit shared types in `src/typing`.
- **Function components + Hooks only.** No class components.
- **Tailwind-first styling.** Use utility classes; extract a shared class only when a group repeats. Avoid bespoke CSS.
- **Accessibility is non-negotiable.** Every user-facing change must stay keyboard-operable and screen-reader-friendly (WCAG 2.2). Consult the accessibility rulebook.
- **Pure logic in `src/utils`**, presentation in components/features — keep game rules out of JSX.
- When writing/refactoring in a domain with a rulebook (see `@docs/best-practices/INDEX.md`), consult it first and load only the relevant section(s) — don't reinvent the rules.

## Common Commands

```bash
# build / run
npm run dev            # Vite dev server on :3000
npm run build          # tsc && vite build
npm run preview        # preview production build on :3001
# test
npm run e2e            # cypress run (headless e2e)
npm run cypress        # cypress open (interactive)
# lint / format / typecheck
npm run lint           # eslint .
npm run format         # prettier --check  (npm run format:auto to fix)
npm run typecheck      # tsc --noEmit
# spec-lint
sh scripts/spec-lint.sh
```

## Specs

Index + status: `@docs/specs/INDEX.md`. Each spec file's header carries its own `Status`.
**Current work:** none — spec-driven scaffolding just adopted; next work unplanned.

---

## Key Decisions (settled — don't re-litigate; detail in the linked spec/architecture)

- **Cypress e2e over unit tests** — chosen for this integration-heavy game; Vitest deps exist but are unconfigured. See `@docs/architecture.md` Known Constraints.
- **Words loaded from `public/words.json` into localStorage** at runtime; Supabase `all_words` table is the migration path, not yet the live source. See `@docs/architecture.md`.
- **Neobrutalism + accessibility-first** as the product's defining visual/UX stance. See Project Overview.

## Out of Scope (don't build)

The README sketches a full-stack future (user accounts/auth, per-user stats, blob-storage guess history,
date-picker for past words, reading the live word from Supabase). **None of that is built or in scope**
unless a spec explicitly calls for it — today the game is a static SPA over a local word list.

---

## Session Workflow

**Start:** (1) this file; (2) the spec you're implementing (`@docs/specs/SPEC-XXX`); (3) skim `@docs/component-inventory.md` for reuse and pull only the architecture.md section / dependency delivery-doc you need — don't read architecture.md or delivery docs in full. (4) Confirm CI is green on `main`; investigate failures before building. (5) Branch from fresh `main`. (6) Generate an implementation plan from the spec's phases, validate it against the spec (FRs + acceptance criteria covered, reuse used, nothing out of scope), and confirm it before writing code.

**During:** every file-changing task goes on its own branch and opens a PR — never commit to `main` directly. After a phase, stop and summarize what was built and how it maps to the plan. Specs carry no Open Questions — triage emergent issues by kind: **reversible/technical** ones you decide in-session (update the spec if scope changes); **product-changing or ambiguous** ones you stop and escalate to the human with options + a recommendation, never silently decide.

**Review:** code review and verification run in a **fresh context** (new session or subagent), never the session that wrote the code — check the diff against the spec's acceptance criteria, not just "looks fine."

**PRs & main:** before opening a PR, get the formatter, linter, and typecheck green locally. Watch every PR to completion and merge it as soon as CI is green — never open-and-abandon. `main` is always watched: after any merge confirm it went green, and if `main` fails, diagnose immediately and fix it with a new PR before anything else.

**On spec completion — keep the always-loaded files lean:**
1. Set the spec file's `Status: Completed`.
2. Update the one-line row in `@docs/specs/INDEX.md` (status only — don't add prose).
3. Write a short delivery doc at `docs/spec-delivery/SPEC-XXX-<name>.md` from the template.
4. If it added reusable modules/services/components, add a one-line row to `@docs/component-inventory.md`.
5. A *new architectural decision* gets one line in Key Decisions above (+ a pointer) — never a paragraph.

# Word Game Clone — Architecture

The design reference: *what* we're building and *why*, including decisions made along the way. Read the
**section you need**, not the whole file. It is intentionally allowed to be ahead of the code —
sections describe the target design, not necessarily what's implemented yet.

> **Keep it sectioned and skimmable.** Each numbered section owns one concept so a session can pull just
> that one. Reasoning that justifies a one-line entry in `CLAUDE.md` → Key Decisions lives here.

---

## 1. Purpose & scope

A single-page, accessibility-first clone of a six-letter word-guessing game. The app owns: rendering the
board, capturing guesses via a physical or on-screen keyboard, scoring each guess letter-by-letter,
validating guesses against a known word list, surfacing alerts, and letting a player review past words
and reset their cache.

It does **not** own (today): user accounts, authentication, per-user stats, or server-persisted guess
history. Those are sketched in §5 as the intended full-stack direction but are not built.

## 2. Runtime data flow (current implementation)

- On first load the app fetches `public/words.json` (100 six-letter words with their game properties)
  and writes it to `localStorage`. Subsequent loads read the stringified JSON from `localStorage`
  rather than re-fetching.
- The word list lives in React state. Submitting a guess updates state and mirrors it back to
  `localStorage`, giving persistence without a live database.
- A submitted guess is validated against the current in-memory word list; an invalid (unknown) word
  raises a `react-toastify` alert instead of being scored.
- "Past words" reads completed entries from the same cached list; "reset" clears the word cache for a
  clean slate.

## 3. Module boundaries

- **`src/utils/`** holds pure game logic (`GameHelpers`, `GameBoardHelpers`, `KeyboardHelpers`) — no JSX.
  Keep scoring/validation rules here so they stay unit-testable and out of components.
- **`src/features/`** are composed screens (`game-board`, `guesses-view`, `past-words`,
  `virtual-keyboard`); **`src/components/`** are reusable primitives they compose from.
- **`src/typing/`** is the single source of shared types and enums; features/components import from here.
- **`src/api/client/SupabaseClient.ts`** isolates Supabase wiring so the rest of the app doesn't depend
  on the backend directly.

## 4. Word data & Supabase

The master word list is modelled in Supabase Postgres (`supabase/schemas/all_words.sql`, migrations under
`supabase/migrations/`, seeded from `supabase/seeds/six_letter_words.sql`, with RLS applied). GitHub
Actions (`.github/workflows/main.yml`) links the project and runs `supabase db push --include-seed` on
every push to `main`. The **frontend does not yet read from this table** — it still loads
`public/words.json`. The table is the seam for moving word selection/validation server-side (§5).

## 5. Intended full-stack direction (NOT built — see CLAUDE.md → Out of Scope)

The README documents a target where: the word for a day is fetched from Supabase instead of a bundled
JSON; guess validation is a DB lookup; optional accounts unlock stats and multiple words per day; and
per-user state (`stats`, per-word guess history) lives in blob storage at `user-data/{username}/…`,
with logged-out users falling back to a localStorage shape that mirrors the current-day word only. This
is the reserved design, not a commitment — any of it must come in through a spec before it is built.

---

## Known Constraints

Hard constraints and non-obvious gotchas that shape every spec. New constraints get added here the
first time they bite.

- **Test tooling is inconsistent.** Cypress e2e is the real, wired test suite (`npm run e2e`). Vitest and
  Testing Library are installed as devDependencies but there is **no `test` script, no `test` block in
  `vite.config.ts`, and no `jest-setup.ts`** (though `tsconfig.json` `include` still lists one). Don't
  assume `npm test` exists. Wiring Vitest for unit tests is a deliberate, spec-worthy task, not a
  drive-by change.
- **No live backend read.** The word list is bundled (`public/words.json`) and cached in `localStorage`;
  the Supabase table exists but is not the runtime source (§4). Word data changes must update *both*
  until the frontend is migrated.
- **`localStorage` is the only persistence.** State survives reloads but is per-browser and clearable by
  the user via the reset action — no cross-device continuity.

## Deferred / Non-goals

- User accounts / auth, per-user stats, blob-storage guess history, and date-selectable past words —
  reserved in §5, seam is the Supabase `all_words` table and `SupabaseClient`.
- Vitest unit-test harness — infrastructure is installed but unconfigured (see Known Constraints).

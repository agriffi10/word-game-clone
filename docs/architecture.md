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

- On load the app fetches `public/words.json` once — a flat array of ~11.9k lowercase six-letter words
  that is **both** the answer pool **and** the guess-validation dictionary — and builds an in-memory
  `Set` for O(1) validation (`src/utils/WordSelection.ts`).
- A submitted guess is validated locally (`isValidGuess`: six letters + in the set); an unknown word
  raises a `react-toastify` alert instead of being scored. No network request is involved.
- Each round's target is a uniformly random word not yet played this session (`pickNextWord`); the game
  is endless — "Play Again" picks another unplayed word.
- Session state (the in-progress `GameState` + the list of played words) is persisted to `localStorage`
  under a versioned key (`wgc.session.v1`, `src/utils/SessionStorage.ts`) and restored on reload, so a
  game resumes where it left off. "Past Words" lists this session's played words; "Reset Session" clears
  the stored session and starts fresh.

## 3. Module boundaries

- **`src/utils/`** holds pure game logic (`GameHelpers`, `GameBoardHelpers`, `KeyboardHelpers`) — no JSX.
  Keep scoring/validation rules here so they stay unit-testable and out of components.
- **`src/features/`** are composed screens (`game-board`, `guesses-view`, `past-words`,
  `virtual-keyboard`); **`src/components/`** are reusable primitives they compose from.
- **`src/typing/`** is the single source of shared types and enums; features/components import from here.

## 4. Word data (static)

There is **no backend**. A single static asset, `public/words.json` (~11.9k lowercase six-letter words),
is the answer pool and the validation dictionary. It was generated once from the retired Supabase seed by
`scripts/generate-words.mjs` (kept as provenance); the generator's seed input was removed with the rest of
Supabase, so the committed `words.json` is the source of truth — regenerating would need the seed from git
history. Word delivery is a fetched `/words.json`, chosen so the SPEC-003 hosting migration needs no app
change.

## 5. Reserved future direction (NOT built — see CLAUDE.md → Out of Scope)

A future full-stack version could add accounts/auth, per-user stats, cross-device sync, and a
global-daily-word mode. None of that exists today, and there is no backend seam left in the code — any of
it would require introducing a backend and must come in through a spec before it is built.

---

## Known Constraints

Hard constraints and non-obvious gotchas that shape every spec. New constraints get added here the
first time they bite.

- **Two test layers; only unit tests gate CI.** Vitest 4 (`npm test` — jsdom + Testing Library, istanbul;
  setup `src/setupTests.ts`, `test` block in `vite.config.ts`) runs in CI and gates every PR. Cypress e2e
  (`npm run e2e`) is **not** in CI: it runs locally against the dev server on `:3000`. Specs control the
  word list by intercepting `/words.json` with a fixture and make selection deterministic by stubbing
  `Math.random` (`cy.startGame()`). (Vitest wired in SPEC-001.)
- **jsdom has no working `localStorage`** in this setup — `src/setupTests.ts` installs an in-memory
  polyfill so session-persistence unit tests run.
- **No backend — fully static.** The word list is a bundled asset (`public/words.json`, §4); validation
  and selection are entirely client-side. There is nothing to keep in sync server-side.
- **`localStorage` is the only persistence** (`wgc.session.v1`). State survives reloads but is
  per-browser and clearable via Reset Session — no cross-device continuity.

## Deferred / Non-goals

- User accounts / auth, per-user stats, cross-device sync, and a global-daily-word mode — reserved in §5;
  no code seam exists, so each would need a new backend introduced via a spec.

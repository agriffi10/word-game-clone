# Completed Spec — SPEC-002: De-Supabase & Static Random Word Source

## What was completed?

The game now runs entirely on a static word list with an endless, resumable session — **no backend**.

- **Static word list (FR-001).** `public/words.json` is a flat array of ~11.9k lowercase six-letter words,
  generated from the old Supabase seed by `scripts/generate-words.mjs` (both the answer pool and the
  validation dictionary).
- **Client-side load + validation (FR-002/003).** The list is fetched once, a `Set` validator is built,
  and guesses are validated locally (`src/utils/WordSelection.ts`) — no network. Fetch failure surfaces a
  toast without crashing.
- **Endless no-repeat play (FR-004).** Each round picks a random unplayed word; "Play Again" continues
  until the list is exhausted (graceful state).
- **Session persistence + resume (FR-005).** In-progress game + played words persist to `localStorage`
  under `wgc.session.v1` (`src/utils/SessionStorage.ts`) and restore on reload; the board repaints
  restored guesses. Legacy `"words"` key is cleared.
- **Past Words + Reset (FR-006/007).** "Past Words" lists this session's played words (solved/failed);
  "Clear Word Cache" became "Reset Session".
- **Supabase fully removed (FR-008).** Deleted `src/api/`, the `supabase/` directory, the
  `@supabase/supabase-js` dependency, and `VITE_SUPABASE_*` from `.env.template`.
- **Types:** `WordData` replaced by `GameState` / `PlayedWord` / `SessionState`.

## What changed from earlier specs?

Builds on SPEC-001's Vitest harness (added `WordSelection`/`SessionStorage` unit tests; `setupTests.ts`
gained an in-memory `localStorage` polyfill since jsdom provides none). Cypress e2e reworked for the
endless/random model (fixture word list + stubbed `Math.random`); the SPEC-001-era Supabase e2e stub was
removed.

## Verification

- `format`, `lint`, `typecheck`, `test` (19), `build` all green; Cypress e2e **13/13** (incl. new
  `session.cy.ts` for resume + played-words/reset). Fresh-context review verdict: SHIP.
- **Note:** deleting `supabase/` removed the generator's seed input — `words.json` is now the source of
  truth; regenerating would need the seed from git history.
- Known follow-ups (cosmetic, from review): on-screen keyboard hint tints aren't restored on reload
  (board tiles are); the fetch-error toast reuses the `notifyWordInvalid` helper.

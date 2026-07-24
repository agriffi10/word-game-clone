# Spec: De-Supabase & Static Random Word Source

**ID:** SPEC-002  
**Status:** Draft  
**Last Updated:** 2026-07-24  
**Depends On:** SPEC-001 (unit-test harness)

## Overview

Today the game mixes two word concepts — a bundled 100-word play list (`public/words.json`, each entry
carrying game state) and a 10,000-word Supabase table (`all_words`) queried on every guess to check the
word is real. This spec collapses them into a single static list of ~10,000 six-letter words, served as
`/words.json` and fetched at runtime, that acts as **both** the answer pool **and** the guess-validation
dictionary. The game becomes endless: each round picks a random word the player hasn't seen this
session, and an in-progress game plus the set of already-played words survive a page reload. All Supabase
code, dependencies, configuration, and the `supabase/` directory are removed, and the immutable word list
is cleanly separated from mutable game/session state. There is no backend — the site stays a static SPA.

## Scope

### In Scope

- Generate a static `public/words.json` (a flat JSON array of ~10k lowercase six-letter strings) from
  the existing `supabase/seeds/six_letter_words.sql`, with a repeatable generator script.
- Fetch the word list at runtime, cache it, and build an in-memory `Set` for O(1) guess validation.
- Replace the Supabase guess-validation query with synchronous client-side validation against that set.
- Endless random word selection that excludes words already played in the current session.
- Persist session state to `localStorage` — the in-progress game and the played-words list — and restore
  it on reload (**resume where you left off**); a Reset control clears it.
- Repurpose the "Past Words" view to list **this session's** played words with their solved/failed state.
- Remove Supabase entirely: delete `src/api/client/SupabaseClient.ts`, drop the `@supabase/supabase-js`
  dependency, delete the `supabase/` directory, and remove `VITE_SUPABASE_*` from `.env.template`.
- Introduce types that separate the word list (`string[]`) from game/session state (replacing the
  `WordData` conflation).
- Unit tests (on the SPEC-001 Vitest harness) for selection (no-repeat), validation, and session
  (de)serialization.

### Out of Scope

- Any backend, API, or database — the list is a static asset; validation and selection are client-side.
- Accounts, cross-device sync, streaks/stats panels, and NYT-style global-daily-word mode — reserved
  future seams, deliberately not built (see `docs/architecture.md` §5).
- The AWS/OpenTofu hosting migration (**SPEC-003**) — this spec continues to ship via the existing
  Netlify pipeline; word delivery as a fetched `/words.json` is chosen so SPEC-003 needs no app change.
- **Curating a friendlier answer subset** — the full ~10k list is the answer pool, so obscure words
  (e.g. `abatis`) can be answers. Narrowing the answer pool is explicitly deferred.
- Changing core game rules (six letters, six guesses), the board, the keyboard, or the visual style.

---

## Functional Requirements

### FR-001: Static word-list asset generated from the seed

#### Description:

`public/words.json` is produced from `supabase/seeds/six_letter_words.sql` as a flat array of lowercase
six-letter words, via a repeatable script (so provenance is documented and the file can be regenerated
before the `supabase/` directory is deleted).

#### Acceptance Criteria:

- [ ] `public/words.json` is a JSON array of strings; every entry is lowercase and exactly six letters.
- [ ] The array contains the distinct words from the seed with no duplicates.
- [ ] A committed script (e.g. `scripts/generate-words.mjs`) regenerates the file from the seed and is
      documented in the spec-delivery doc.
- [ ] The old object-shaped `public/words.json` (with `isSolved`/`guesses`/`currentWord`) no longer exists.

### FR-002: Word list loaded and cached at runtime

#### Description:

On startup the app fetches the list once, builds the answer pool and a validation `Set`, and tolerates
fetch failure.

#### Acceptance Criteria:

- [ ] On load the app fetches `/words.json` and builds an in-memory `Set<string>` for validation.
- [ ] A failed fetch surfaces a user-facing error (toast) and leaves the app non-crashing (no white screen).
- [ ] The list is fetched at most once per load (result reused for both selection and validation).

### FR-003: Client-side guess validation (Supabase removed)

#### Description:

Guess validation is synchronous and local — a guess is valid iff it is a six-letter word in the list.

#### Acceptance Criteria:

- [ ] A six-letter guess present in the list is accepted and recorded.
- [ ] A six-letter guess absent from the list raises the "Word not valid!" alert and is not recorded.
- [ ] A guess shorter than six letters cannot be submitted.
- [ ] Validation performs no network request and references no Supabase client.

### FR-004: Endless random selection without session repeats

#### Description:

Each new game picks a random list word not yet played this session.

#### Acceptance Criteria:

- [ ] Starting a game selects a uniformly random word from the list excluding the played-words set.
- [ ] When a game ends, its word is added to the played-words set.
- [ ] "Play Again" starts a new game whose word differs from every word already played this session.
- [ ] If the played set has exhausted the list, the app shows a graceful "all words played" state rather
      than erroring (defined behavior even though ~10k makes this practically unreachable).

### FR-005: Session persistence & resume on reload

#### Description:

The in-progress game and the played-words set persist to `localStorage` under a versioned key and restore
on reload.

#### Acceptance Criteria:

- [ ] The in-progress game (target word, submitted guesses, current row, `isFinished`, `isSolved`) and the
      played-words list are saved to `localStorage` under a versioned key as they change.
- [ ] Reloading restores the exact in-progress game and the played-words set.
- [ ] Absent or corrupt stored state falls back to a fresh session without crashing.
- [ ] The obsolete legacy `"words"` localStorage key is not read as game state (ignored/cleared on load).

### FR-006: "Past Words" shows this session's played words

#### Description:

The Past Words view lists the words completed this session and whether each was solved.

#### Acceptance Criteria:

- [ ] The view lists each played word with a solved/failed indicator.
- [ ] The list updates when a game completes.
- [ ] Before any game completes, the view shows an empty state (no words yet).

### FR-007: Reset session control

#### Description:

A control clears session state and starts a fresh random game.

#### Acceptance Criteria:

- [ ] Activating reset removes the versioned session key from `localStorage` and clears in-memory state.
- [ ] After reset a fresh random word starts and the played-words list is empty.
- [ ] After reset, previously played words are eligible for selection again.

### FR-008: Supabase fully removed

#### Description:

No Supabase code, dependency, config, or directory remains.

#### Acceptance Criteria:

- [ ] `@supabase/supabase-js` is absent from `package.json` (and the lockfile).
- [ ] `src/api/client/SupabaseClient.ts` and the `supabase/` directory are deleted.
- [ ] `VITE_SUPABASE_*` keys are removed from `.env.template`.
- [ ] `grep -ri supabase src/` returns nothing.
- [ ] `npm run build`, `npm run lint`, `npm run typecheck`, and `npm test` all exit 0.

---

## Data Model

```ts
// public/words.json — static dictionary AND answer pool (~10k entries)
type WordList = string[]; // lowercase, six letters each

// src/typing/components/BaseTypes.ts — runtime state (replaces WordData)
type GameState = {
  word: string;        // target word for the current game
  guesses: string[];   // submitted guesses, in order
  currentRow: number;  // 0..MAX_GUESSES (6)
  isFinished: boolean;
  isSolved: boolean;
};

type PlayedWord = {
  word: string;
  solved: boolean;
};

type SessionState = {
  version: number;         // schema version for the localStorage payload
  playedWords: PlayedWord[];
  current: GameState | null;
};
```

## API / Interface Contract

```ts
// src/utils/WordSelection.ts
buildValidator(words: string[]) -> Set<string>
isValidGuess(guess: string, validator: Set<string>) -> boolean          // length 6 AND in set
pickNextWord(words: string[], played: string[]) -> string | null        // random, excludes played; null if exhausted

// src/utils/SessionStorage.ts  (localStorage key: "wgc.session.v1")
loadSession() -> SessionState                                            // returns fresh session on absent/corrupt
saveSession(state: SessionState) -> void
resetSession() -> void
```

## Configuration / Environment

- Remove `VITE_SUPABASE_DATABASE_URL` and `VITE_SUPABASE_ANON_KEY` from `.env.template`.
- New `localStorage` key `wgc.session.v1`; the legacy `"words"` key is retired.

## File & Folder Structure

```
public/words.json                     # flat string[] of ~10k words (regenerated from seed)
scripts/generate-words.mjs            # seed -> words.json generator (new)
src/
├── utils/
│   ├── WordSelection.ts              # validation set + random no-repeat selection (new)
│   ├── WordSelection.test.ts         # (new)
│   ├── SessionStorage.ts             # versioned load/save/reset (new)
│   └── SessionStorage.test.ts        # (new)
├── typing/components/BaseTypes.ts    # WordData -> GameState/SessionState/PlayedWord
└── api/                              # SupabaseClient.ts removed
supabase/                             # DELETED (generate words.json first)
.env.template                         # VITE_SUPABASE_* removed
```

## Implementation Phases

### Phase 1: Data layer & pure logic

- Write `scripts/generate-words.mjs` to extract words from `supabase/seeds/six_letter_words.sql` and emit
  the flat `public/words.json`; run it and commit the file.
- Add the new types (`GameState`, `PlayedWord`, `SessionState`); introduce `WordSelection` and
  `SessionStorage` as pure modules.
- Unit-test selection (no-repeat, exhaustion), validation (length + membership), and session
  (de)serialization incl. corrupt-payload fallback.

### Phase 2: Wire into the app

- Replace the Supabase validation call in the guess flow with `isValidGuess`.
- Replace the `WordData[]`/`localStorage "words"` flow with `GameState` + `SessionState`; implement
  resume-on-reload and endless "Play Again".
- Repurpose `PastWords` to render this session's played words; rename the "Clear Word Cache" control to a
  session reset wired to `resetSession`.

### Phase 3: Remove Supabase & finalize

- Delete `src/api/client/SupabaseClient.ts`, drop `@supabase/supabase-js`, delete the `supabase/`
  directory, and clean `.env.template`.
- Confirm the full gate green (`format`, `lint`, `typecheck`, `test`, `build`) and Cypress e2e updated for
  the endless flow where guard specs assumed the fixed list.
- Completion ritual: update `docs/architecture.md` (§2 data flow, §4 Supabase, Known Constraints) and
  `CLAUDE.md` (Tech Stack drops Supabase; Key Decisions/Out of Scope) and write the delivery doc.

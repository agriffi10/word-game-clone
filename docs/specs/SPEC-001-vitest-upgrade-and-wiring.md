# Spec: Vitest v4 & Vite 8 Upgrade + Unit-Test Wiring

**ID:** SPEC-001  
**Status:** In Progress  
**Last Updated:** 2026-07-24  
**Depends On:** None

## Overview

The project ships with Vitest and Testing Library installed as dev dependencies, but the harness is
neither current nor wired: Vitest is a full major version behind (`^3.0.8` vs latest `4.1.10`), there is
no `test` script, no `test` block in `vite.config.ts`, and `tsconfig.json` still references a
`jest-setup.ts` file that does not exist. As a result `npm test` does not work and no unit tests run.
This spec brings Vitest to the current major version and wires it up so unit tests execute reliably —
locally and in CI — giving later specs (the Supabase removal and the random word-selection logic) a
working test harness to build on. It is deliberately tooling-only: no game behavior changes here.
Because the work already sits in the build-tooling layer, it also brings Vite current — from the v6 to
the v8 line, along with its React and Tailwind plugins — so the whole toolchain is modern before
SPEC-002/003 build on it. (Vitest v4 supports Vite 6, so the Vite jump is a chosen modernization, not a
forced one.)

## Scope

### In Scope

- Upgrade the Vite build toolchain from the v6 to the current v8 line, bumping `@vitejs/plugin-react`
  and `@tailwindcss/vite` to Vite-8-compatible versions, keeping the app building and the e2e suite green.
- Upgrade `vitest` and `@vitest/coverage-istanbul` from v3 to the current v4 line.
- Reconcile the co-installed test helpers (`vitest-axe`, `vitest-canvas-mock`, `vitest-fetch-mock`,
  `vitest-sonar-reporter`, `jsdom`, `@testing-library/*`) with Vitest v4 — upgrade each to a compatible
  version, or remove it if it is unused and blocks the upgrade.
- Add a `test` configuration block to `vite.config.ts` (jsdom environment, globals, `setupFiles`
  pointing at the real setup file, istanbul coverage provider).
- Add npm scripts: `test` (single run), `test:watch`, `test:coverage`.
- Resolve the dangling `jest-setup.ts` reference so `npm run typecheck` stays clean and a single setup
  file is the source of truth.
- Add one real unit-test suite that exercises `src/utils/GameHelpers.ts` `determineLetterStyle` across
  all branches, proving the harness runs and asserts correctly.
- Add `npm test` to the CI `node` job so unit tests gate every PR.
- Update the "test tooling is inconsistent" Known Constraint in `docs/architecture.md` and the Tests row
  in `CLAUDE.md` → Tech Stack to reflect that Vitest is now wired (part of the completion ritual).

### Out of Scope

- Backfilling unit tests for every module or hitting any coverage threshold — this spec proves the
  harness with one meaningful suite; broad coverage comes later.
- Removing, replacing, or porting the Cypress e2e suite — Cypress stays as-is.
- Any change to game logic, word data, Supabase, or hosting (those are SPEC-002 / SPEC-003).
- Cleaning up unrelated CRA-era leftovers (e.g. `src/react-app-env.d.ts`) unless the upgrade requires it.

---

## Functional Requirements

### FR-001: Vitest upgraded to the current major

#### Description:

`vitest` and `@vitest/coverage-istanbul` are upgraded from the v3 line to the current v4 line, and the
dependency tree installs cleanly.

#### Acceptance Criteria:

- [ ] `package.json` lists `vitest` and `@vitest/coverage-istanbul` at `^4.x`.
- [ ] `npm ci` completes with exit 0 and no unmet-peer-dependency errors.
- [ ] `package-lock.json` is updated and committed.

### FR-002: Vitest is configured to run in a jsdom environment with the shared setup file

#### Description:

A `test` block in `vite.config.ts` configures the environment, globals, and setup file so component and
DOM-based assertions work.

#### Acceptance Criteria:

- [ ] `vite.config.ts` defines `test` with `environment: "jsdom"`, `globals: true`, and `setupFiles`
      referencing the single canonical setup file.
- [ ] The setup file imports `@testing-library/jest-dom` so its matchers are available in tests.
- [ ] Running the test command discovers files matching the configured test glob and executes them.

### FR-003: Test scripts exist and run

#### Description:

npm scripts expose single-run, watch, and coverage modes.

#### Acceptance Criteria:

- [ ] `npm test` runs the suite once and exits non-interactively (exit 0 when tests pass).
- [ ] `npm run test:watch` starts Vitest in watch mode.
- [ ] `npm run test:coverage` produces an istanbul coverage report and exits 0.

### FR-004: The dangling setup-file reference is resolved

#### Description:

`tsconfig.json` no longer points at a non-existent `jest-setup.ts`; one setup file is authoritative.

#### Acceptance Criteria:

- [ ] `tsconfig.json` contains no reference to a file that does not exist on disk.
- [ ] `npm run typecheck` exits 0.
- [ ] Exactly one setup file is referenced by both `tsconfig.json` (if applicable) and the Vitest config.

### FR-005: A unit suite for `determineLetterStyle` passes and covers all branches

#### Description:

A unit test exercises the pure scoring helper so the harness is proven against real project code.

#### Acceptance Criteria:

- [ ] Test returns `IN_POSITION` when the letter matches the letter at that index.
- [ ] Test returns `IN_WORD` when the letter exists in the word but at a different index.
- [ ] Test returns `NOT_IN_WORD` when the letter is absent from the word.
- [ ] Test asserts the short-circuit: when `currentStyle` already includes `IN_POSITION`, that style is
      returned unchanged regardless of the letter.
- [ ] `npm test` reports this suite green.

### FR-006: CI runs unit tests on every PR

#### Description:

The CI `node` job runs the unit suite so a failing test blocks merge.

#### Acceptance Criteria:

- [ ] `.github/workflows/ci.yml` `node` job includes an `npm test` step after typecheck.
- [ ] The full local gate — `npm run format`, `npm run lint`, `npm run typecheck`, `npm test`,
      `sh scripts/spec-lint.sh` — all exit 0.
- [ ] The existing `npm run build` and Cypress `npm run e2e` commands still succeed (no regression).

### FR-007: Vite build toolchain upgraded to the current major

#### Description:

Vite and its React/Tailwind plugins are upgraded from the v6 line to the current v8 line, and the app
still builds and runs. (Delivered first, so the Vitest wiring lands on the modern toolchain.)

#### Acceptance Criteria:

- [ ] `package.json` lists `vite` at `^8.x` and `@vitejs/plugin-react` at a Vite-8-compatible version.
- [ ] `@tailwindcss/vite` resolves to a version whose peer range includes Vite 8.
- [ ] `npm ci` completes with exit 0 and no ERESOLVE / unmet-peer errors.
- [ ] `npm run build` (`tsc && vite build`) exits 0.
- [ ] `npm run e2e` (Cypress) passes against the Vite-8 build — no regression.

---

## Interface Contract

New/updated `package.json` scripts:

```jsonc
{
  "scripts": {
    "test": "vitest run",
    "test:watch": "vitest",
    "test:coverage": "vitest run --coverage"
  }
}
```

Target `vite.config.ts` shape (merged into the existing `defineConfig`):

```ts
test: {
  environment: "jsdom",
  globals: true,
  setupFiles: ["./src/setupTests.ts"],
  coverage: { provider: "istanbul" },
}
```

## File & Folder Structure

```
src/
├── setupTests.ts                 # single canonical setup (imports jest-dom)
└── utils/
    ├── GameHelpers.ts
    └── GameHelpers.test.ts        # new: determineLetterStyle unit suite
vite.config.ts                     # + test block
tsconfig.json                      # jest-setup.ts reference resolved
package.json                       # + test scripts, upgraded vitest deps
.github/workflows/ci.yml           # + npm test step
```

## Implementation Phases

### Phase 1: Vite build-toolchain upgrade (v6 → v8)

- Bump `vite` to `^8.x`, `@vitejs/plugin-react` to its Vite-8-compatible major, and `@tailwindcss/vite`
  to a version whose peer range includes Vite 8.
- Regenerate and commit `package-lock.json`.
- Confirm `npm run typecheck`, `npm run lint`, `npm run format`, `npm run build`, and Cypress
  `npm run e2e` all stay green on the new toolchain.
- Land this isolated from the Vitest work so a build/e2e regression is bisectable to the Vite jump.

### Phase 2: Vitest upgrade & configure

- Bump `vitest` + `@vitest/coverage-istanbul` to `^4.x`; reconcile the helper libs (upgrade compatible
  versions; remove any unused lib rather than dragging it through the major bump).
- Add the `test` block to `vite.config.ts`.
- Add the `test`, `test:watch`, `test:coverage` scripts.
- Resolve the `jest-setup.ts` reference and settle on one setup file.
- Confirm `npm run typecheck`, `npm run lint`, `npm run format`, and `npm run build` all stay green.

### Phase 3: First suite + CI wiring

- Write `src/utils/GameHelpers.test.ts` covering all four `determineLetterStyle` branches.
- Add `npm test` to the CI `node` job.
- Verify the full gate green locally and that Cypress `npm run e2e` still runs.
- Completion ritual: update the Known Constraint in `docs/architecture.md` and the Tests row in
  `CLAUDE.md` → Tech Stack; write the delivery doc.

# Completed Spec — SPEC-001: Vitest v4 & Vite 8 Upgrade + Unit-Test Wiring

## What was completed?

A working, CI-gated unit-test harness plus a modernized build toolchain. No game behavior changed.

- **Vitest wired (FR-001–006).** Upgraded `vitest` + `@vitest/coverage-istanbul` v3 → `^4.1.10`. Added a
  `test` block to `vite.config.ts` (jsdom, globals, `src/setupTests.ts`, istanbul) and `test` /
  `test:watch` / `test:coverage` scripts. `npm test` now runs in CI after typecheck.
- **First suite.** `src/utils/GameHelpers.test.ts` covers all four `determineLetterStyle` branches
  (IN_POSITION, IN_WORD, NOT_IN_WORD, and the IN_POSITION short-circuit) — 4/4 pass, 100% helper coverage.
- **Dangling setup ref fixed (FR-004).** Removed `./jest-setup.ts` from `tsconfig.json`; `src/setupTests.ts`
  (already under `"src"`) is the single canonical setup file.
- **Removed 4 dead helper libs.** `vitest-axe`, `vitest-canvas-mock`, `vitest-fetch-mock`,
  `vitest-sonar-reporter` — unused (no source imports), dropped rather than dragged through the major bump.
- **Vite 6 → 8 (FR-007, added scope).** Bumped `vite` `^8.1.5`, `@vitejs/plugin-react` `^6`, and
  `@tailwindcss/vite` + `tailwindcss` `^4.3.3`. Vitest 4 supports Vite 6, so this was a chosen
  modernization folded into the spec on request — landed as its own isolated PR (#20) so a build/e2e
  regression would bisect to the Vite jump.

## What changed from earlier specs?

Nothing prior was edited — this is the first implementation spec. CLAUDE.md (Tests + Build/dev rows, Key
Decisions, Common Commands) and `architecture.md` (Known Constraints, Deferred) were updated to match.

## Verification

- Local + CI green: `format`, `lint`, `typecheck`, `npm test` (4/4), `test:coverage` (istanbul, exit 0),
  `build`, `spec-lint`. Fresh-context subagent review verified FR-001–006 against a clean install (SHIP).
- Cypress e2e: **no regression** — identical 4-pass / 7-fail on Vite 6 (worktree baseline) and Vite 8.
  The 7 failures are pre-existing (win/lose end-state timeouts), unrelated to the toolchain; e2e is not in
  CI. Tracked as a separate follow-up task.
- Delivered across PRs #20 (Vite 8), #21 (Vitest wiring + suite + CI step), and this ritual PR.

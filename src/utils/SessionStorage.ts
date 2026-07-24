// Versioned session persistence for the endless game: the in-progress game and
// the set of words played this session, stored in localStorage. Corrupt or
// stale payloads fall back to a fresh session rather than crashing.
import { GameState, SessionState } from "../typing/components/BaseTypes";

export const SESSION_KEY = "wgc.session.v1";
export const SESSION_VERSION = 1;

// The pre-SPEC-002 game state lived here; it is no longer read as game state.
const LEGACY_KEY = "words";

export const freshSession = (): SessionState => ({
  version: SESSION_VERSION,
  playedWords: [],
  current: null,
});

const isGameState = (value: unknown): value is GameState => {
  if (typeof value !== "object" || value === null) return false;
  const game = value as Record<string, unknown>;
  return (
    typeof game.word === "string" &&
    Array.isArray(game.guesses) &&
    typeof game.currentRow === "number" &&
    typeof game.isFinished === "boolean" &&
    typeof game.isSolved === "boolean"
  );
};

const isSessionState = (value: unknown): value is SessionState => {
  if (typeof value !== "object" || value === null) return false;
  const state = value as Record<string, unknown>;
  return (
    state.version === SESSION_VERSION &&
    Array.isArray(state.playedWords) &&
    (state.current === null || isGameState(state.current))
  );
};

/** Load the saved session; returns a fresh session when absent, corrupt, or a stale version. */
export const loadSession = (): SessionState => {
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    if (!raw) return freshSession();
    const parsed: unknown = JSON.parse(raw);
    return isSessionState(parsed) ? parsed : freshSession();
  } catch {
    return freshSession();
  }
};

export const saveSession = (state: SessionState): void => {
  localStorage.setItem(SESSION_KEY, JSON.stringify(state));
};

export const resetSession = (): void => {
  localStorage.removeItem(SESSION_KEY);
};

/** Drop the obsolete pre-SPEC-002 localStorage key so it is never read as state. */
export const clearLegacyState = (): void => {
  localStorage.removeItem(LEGACY_KEY);
};

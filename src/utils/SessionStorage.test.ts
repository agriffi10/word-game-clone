import { beforeEach, describe, expect, it } from "vitest";

import { GameState, SessionState } from "../typing/components/BaseTypes";
import {
  clearLegacyState,
  freshSession,
  loadSession,
  resetSession,
  saveSession,
  SESSION_KEY,
} from "./SessionStorage";

const game: GameState = {
  word: "banana",
  guesses: ["orange"],
  currentRow: 1,
  isFinished: false,
  isSolved: false,
};

const session: SessionState = {
  version: 1,
  playedWords: [{ word: "puzzle", solved: true }],
  current: game,
};

beforeEach(() => {
  localStorage.clear();
});

describe("saveSession / loadSession", () => {
  it("round-trips a saved session", () => {
    saveSession(session);
    expect(loadSession()).toEqual(session);
  });

  it("returns a fresh session when nothing is stored", () => {
    expect(loadSession()).toEqual(freshSession());
  });

  it("returns a fresh session when the stored payload is corrupt JSON", () => {
    localStorage.setItem(SESSION_KEY, "{ not valid json");
    expect(loadSession()).toEqual(freshSession());
  });

  it("returns a fresh session when the stored version does not match", () => {
    localStorage.setItem(SESSION_KEY, JSON.stringify({ ...session, version: 99 }));
    expect(loadSession()).toEqual(freshSession());
  });

  it("returns a fresh session when the payload shape is wrong", () => {
    localStorage.setItem(SESSION_KEY, JSON.stringify({ version: 1, playedWords: "nope" }));
    expect(loadSession()).toEqual(freshSession());
  });
});

describe("resetSession", () => {
  it("removes the stored session so the next load is fresh", () => {
    saveSession(session);
    resetSession();
    expect(localStorage.getItem(SESSION_KEY)).toBeNull();
    expect(loadSession()).toEqual(freshSession());
  });
});

describe("clearLegacyState", () => {
  it("removes the obsolete legacy 'words' key", () => {
    localStorage.setItem("words", JSON.stringify([{ word: "banana" }]));
    clearLegacyState();
    expect(localStorage.getItem("words")).toBeNull();
  });
});

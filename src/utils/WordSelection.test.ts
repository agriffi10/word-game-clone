import { afterEach, describe, expect, it, vi } from "vitest";

import { buildValidator, isValidGuess, pickNextWord } from "./WordSelection";

const words = ["banana", "puzzle", "marble", "orange"];

describe("buildValidator", () => {
  it("builds a set containing every word in the list", () => {
    const validator = buildValidator(words);
    expect(validator.size).toBe(words.length);
    expect(validator.has("banana")).toBe(true);
  });
});

describe("isValidGuess", () => {
  const validator = buildValidator(words);

  it("accepts a six-letter guess present in the list", () => {
    expect(isValidGuess("banana", validator)).toBe(true);
  });

  it("rejects a six-letter guess absent from the list", () => {
    expect(isValidGuess("qwerty", validator)).toBe(false);
  });

  it("rejects a guess that is not exactly six letters", () => {
    expect(isValidGuess("puzz", validator)).toBe(false);
    expect(isValidGuess("bananas", validator)).toBe(false);
  });
});

describe("pickNextWord", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("returns a word from the list that has not been played", () => {
    const played = ["banana", "puzzle"];
    const picked = pickNextWord(words, played);
    expect(picked).not.toBeNull();
    expect(words).toContain(picked);
    expect(played).not.toContain(picked);
  });

  it("selects uniformly across the available words (index = random * length)", () => {
    // Math.random -> 0 picks the first available word (excluding played).
    vi.spyOn(Math, "random").mockReturnValue(0);
    expect(pickNextWord(words, ["banana"])).toBe("puzzle");
  });

  it("returns null when every word has already been played", () => {
    expect(pickNextWord(words, [...words])).toBeNull();
  });

  it("can select any word when nothing has been played", () => {
    vi.spyOn(Math, "random").mockReturnValue(0);
    expect(pickNextWord(words, [])).toBe("banana");
  });
});

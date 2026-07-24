import { describe, it, expect } from "vitest";

import { determineLetterStyle } from "./GameHelpers";
import { GameStyles } from "../typing/enums/GameStyles";

describe("determineLetterStyle", () => {
  const word = "banana";

  it("returns IN_POSITION when the letter matches the letter at that index", () => {
    expect(determineLetterStyle(word, "b", 0, "")).toBe(GameStyles.IN_POSITION);
  });

  it("returns IN_WORD when the letter is in the word but at a different index", () => {
    // 'a' is in "banana", but index 0 holds 'b', not 'a'.
    expect(determineLetterStyle(word, "a", 0, "")).toBe(GameStyles.IN_WORD);
  });

  it("returns NOT_IN_WORD when the letter is absent from the word", () => {
    expect(determineLetterStyle(word, "z", 0, "")).toBe(GameStyles.NOT_IN_WORD);
  });

  it("returns currentStyle unchanged when it already includes IN_POSITION", () => {
    const currentStyle = `${GameStyles.IN_POSITION} extra-class`;
    // 'z' is absent and index 3 is not a match, so without the short-circuit
    // this would score NOT_IN_WORD — the existing IN_POSITION must win instead.
    expect(determineLetterStyle(word, "z", 3, currentStyle)).toBe(currentStyle);
  });
});

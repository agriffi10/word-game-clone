import { LetterKeyType } from "../enums/KeyboardTypes";

export type WordData = {
  word: string;
  isSolved: boolean;
  guesses: string[];
  currentWord: boolean;
};

// SPEC-002 — static word source. The word list is a flat string[] (answer pool
// AND validation dictionary); game/session state is modelled separately below.

export type GameState = {
  word: string; // target word for the current game
  guesses: string[]; // submitted guesses, in order
  currentRow: number; // 0..MAX_GUESSES
  isFinished: boolean;
  isSolved: boolean;
};

export type PlayedWord = {
  word: string;
  solved: boolean;
};

export type SessionState = {
  version: number; // schema version for the localStorage payload
  playedWords: PlayedWord[];
  current: GameState | null;
};

export type LetterBoxBaseType = {
  key: string;
  style: string;
  location: number[];
};

export type KeyObjBase = {
  key: string;
  style: string;
  type: LetterKeyType;
  location: number[];
};

export type KeyDataArray = KeyObjBase[];

export type BoardRow = LetterBoxBaseType[];

export type Board = BoardRow[];

export type Keyboard = KeyDataArray[];

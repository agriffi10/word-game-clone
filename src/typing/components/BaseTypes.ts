import { LetterKeyType } from "../enums/KeyboardTypes";

export type WordData = {
  word: string;
  isSolved: boolean;
  guesses: string[];
  currentWord: boolean;
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

import { KeyObjBase } from "./KeyboardTypes";

export type LetterBoxBaseType = {
  key: string;
  style: string;
  location: number[];
};

export type BoardRow = LetterBoxBaseType[];
export type Board = BoardRow[];

export type GameBoardProps = {
  currentRowIdx: number;
  currentGuess: KeyObjBase[];
  currentWord: string;
  resetGuess: () => void;
};

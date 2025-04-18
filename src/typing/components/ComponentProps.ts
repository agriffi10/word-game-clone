/* eslint-disable @typescript-eslint/no-explicit-any */

import { KeyObjBase, WordData, LetterBoxBaseType, KeyDataArray } from "./BaseTypes";

export type BoardWrapperProps = {
  children: React.ReactNode | React.ReactNode[];
};

export type GameBoardProps = {
  currentRowIdx: number;
  currentGuess: KeyObjBase[];
  currentWord: WordData;
  resetGuess: () => void;
  endTheGame: () => void;
};

export type GuessesViewProps = {
  currentGuess: KeyDataArray;
  guessWord: string;
  currentWord: WordData;
};

export type VirtualKeyboardProps = {
  currentWord: string;
  enterLetter: (letter: KeyObjBase) => void;
  deleteLetter: () => void;
  enterGuess: () => void;
  currentGuess: KeyObjBase[];
};

export type KeyboardLetterProps = {
  keyObj: KeyObjBase;
  callback: (keyObj: KeyObjBase) => void;
};

export type LetterBoxBaseProps = {
  letter: LetterBoxBaseType;
};

export type PastWordsProps = {
  wordsList: WordData[];
  setShowFinishedWords: () => void;
};

export type PreviousBoardProps = {
  wordList: WordData[];
};

export type PreviousWordProps = {
  wordObject: WordData;
};
export type UserActionButtonProps = {
  callback: (arg: any) => void;
  arg?: any;
  children: React.ReactNode;
};

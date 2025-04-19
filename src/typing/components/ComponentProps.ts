/* eslint-disable @typescript-eslint/no-explicit-any */

import { KeyObjBase, WordData, LetterBoxBaseType, KeyDataArray } from "./BaseTypes";

export type BoardWrapperProps = {
  children: React.ReactNode | React.ReactNode[];
};

type BaseGameplayComponentProps = {
  currentGuess: KeyDataArray;
  currentWord: WordData;
};

export interface GameBoardProps extends BaseGameplayComponentProps {
  currentRowIdx: number;
  resetGuess: () => void;
  endTheGame: () => void;
}

export interface GuessesViewProps extends BaseGameplayComponentProps {
  guessWord: string;
}

export interface VirtualKeyboardProps {
  currentWord: WordData;
  enterLetter: (letter: KeyObjBase) => void;
  deleteLetter: () => void;
  enterGuess: () => void;
}

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

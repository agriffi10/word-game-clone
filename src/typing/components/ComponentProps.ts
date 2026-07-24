/* eslint-disable @typescript-eslint/no-explicit-any */

import { KeyObjBase, GameState, PlayedWord, LetterBoxBaseType, KeyDataArray } from "./BaseTypes";

export type BoardWrapperProps = {
  children: React.ReactNode | React.ReactNode[];
};

type BaseGameplayComponentProps = {
  currentGuess: KeyDataArray;
  currentWord: GameState;
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
  currentWord: GameState;
  enterLetter: (letter: KeyObjBase) => void;
  deleteLetter: () => void;
  notify: (message: string) => void;
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
  playedWords: PlayedWord[];
  setShowFinishedWords: () => void;
};

export type UserActionButtonProps = {
  callback: (arg: any) => void;
  arg?: any;
  children: React.ReactNode;
};

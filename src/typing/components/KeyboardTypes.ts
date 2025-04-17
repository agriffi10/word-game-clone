import { LetterKeyType } from "../enums/KeyboardTypes";

export type KeyObjBase = {
  key: string;
  style: string;
  type: LetterKeyType;
  location: number[];
};

export type KeyRow = Array<KeyObjBase>;

export type Keyboard = KeyRow[];

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

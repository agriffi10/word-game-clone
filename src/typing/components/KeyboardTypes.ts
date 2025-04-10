export enum KeyType {
  LETTER = "letter", // letter key
  ENTER = "enter",
  DELETE = "delete",
}

export type KeyObjBase = {
  key: string;
  style: string;
  type: KeyType;
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

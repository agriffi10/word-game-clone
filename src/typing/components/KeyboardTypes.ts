export enum KeyType {
  LETTER = "letter", // letter key
  ENTER = "enter",
  DELETE = "delete",
}

export type KeyObjBase = {
  key: string;
  style: string;
  type: KeyType;
  rowIdx?: number;
  keyIdx?: number;
};

export type KeyRow = Array<KeyObjBase>;
export type Keyboard = KeyRow[];

export type VirtualKeyboardProps = {
  currentWord: string;
  enterLetter: (letter: string) => void;
  deleteLetter: () => void;
  enterGuess: () => void;
  rowIdx: number;
};

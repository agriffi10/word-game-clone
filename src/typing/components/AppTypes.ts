import { KeyObjBase } from "./KeyboardTypes";

export type WordData = {
  word: string;
  isSolved: boolean;
  guesses: string[];
  currentWord: boolean;
};

export type Guess = KeyObjBase[];

export type BoardWrapperProps = {
  children: React.ReactNode | React.ReactNode[];
};

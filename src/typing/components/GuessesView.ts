import { Guess, WordData } from "./AppTypes";

export type GuessesViewProps = {
  currentGuess: Guess;
  guessWord: string;
  currentWord: WordData;
};

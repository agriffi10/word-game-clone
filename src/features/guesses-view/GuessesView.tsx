import { GuessesViewProps } from "../../typing/components/ComponentProps";
import { MAX_LETTER_INDEX } from "../../utils/GameBoardHelpers";

export default function GuessesView({ currentGuess, currentWord, guessWord }: GuessesViewProps) {
  const getMatchedLetters = (word: string, guesses: string[]) => {
    const defaultChar = "_";
    const letters = new Array(MAX_LETTER_INDEX + 1).fill(defaultChar);
    for (const guess in guesses) {
      for (let i = 0; i < guess.length; i++) {
        if (letters[i] != defaultChar) {
          continue;
        }
        const letter = guess[i];
        if (letter == word[i]) {
          letters[i] = letter;
          if (i == MAX_LETTER_INDEX) return letters;
        }
      }
    }
    return letters.join(" ");
  };
  return (
    <div className="my-2 w-full justify-evenly sm:flex">
      <div className="w-full text-left text-white sm:w-1/3 sm:px-2">
        <h4 className="font-bold">Current Guess</h4>
        <div
          aria-live="polite"
          aria-relevant="additions removals"
          className="min-h-[24px]">
          {currentGuess.length == 0 && <p>No guess yet!</p>}
          {currentGuess.length > 0 && <p>{guessWord.toUpperCase()}</p>}
        </div>
      </div>
      <div className="w-full text-left text-white sm:w-1/3 sm:px-2">
        <h4 className="font-bold">All Guesses</h4>
        <div
          aria-live="polite"
          aria-relevant="additions"
          className="min-h-[24px]">
          {currentWord.guesses.length > 0 && (
            <ul>
              {currentWord.guesses.map((x, index) => (
                <li key={x + index}>{x.toUpperCase()}</li>
              ))}
            </ul>
          )}
          {currentWord.guesses.length == 0 && <p>No guesses yet!</p>}
        </div>
      </div>
      <div className="w-full text-left text-white sm:w-1/3 sm:px-2">
        <h4 className="font-bold">Matched Letters</h4>
        <div
          aria-live="polite"
          aria-relevant="additions"
          className="min-h-[24px]">
          {currentWord.guesses.length > 0 && (
            <p>{getMatchedLetters(currentWord.word, currentWord.guesses)}</p>
          )}
          {currentWord.guesses.length == 0 && <p>No guesses yet!</p>}
        </div>
      </div>
    </div>
  );
}

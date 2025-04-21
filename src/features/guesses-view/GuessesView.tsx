import { GuessesViewProps } from "../../typing/components/ComponentProps";
import { MAX_LETTER_INDEX } from "../../utils/GameBoardHelpers";

export default function GuessesView({ currentGuess, currentWord, guessWord }: GuessesViewProps) {
  const getMatchedLetters = (word: string, guesses: string[]) => {
    const defaultChar = "_";
    const letters = new Array(MAX_LETTER_INDEX + 1).fill(defaultChar);
    for (const i in guesses) {
      const guess = guesses[i];
      for (let j = 0; j < guess.length; j++) {
        if (letters[j] != defaultChar) {
          continue;
        }
        const letter = guess[j];
        if (letter == word[j]) {
          letters[j] = letter.toUpperCase();
        }
      }
    }
    return letters.join(" ");
  };
  return (
    <div className="my-4 flex w-full justify-evenly text-center text-xs text-white sm:my-2 sm:text-base">
      <div
        className="px-2"
        aria-live="polite"
        aria-relevant="additions removals">
        <h4 className="font-bold">Current Guess</h4>
        <div className="min-h-[24px]">
          {currentGuess.length == 0 && <p>No guess yet!</p>}
          {currentGuess.length > 0 && <p>{guessWord.toUpperCase()}</p>}
        </div>
      </div>
      <div
        className="px-2"
        aria-live="polite"
        aria-relevant="additions">
        <h4 className="font-bold">All Guesses</h4>
        <div className="min-h-[24px]">
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
      <div
        className="px-2"
        aria-live="polite"
        aria-relevant="additions">
        <h4 className="font-bold">Matched Letters</h4>
        <div className="min-h-[24px]">
          <p>{getMatchedLetters(currentWord.word, currentWord.guesses)}</p>
        </div>
      </div>
    </div>
  );
}

import { GuessesViewProps } from "../../typing/components/GuessesView";

export default function GuessesView({ currentGuess, currentWord, guessWord }: GuessesViewProps) {
  return (
    <div className="my-2 w-full justify-evenly sm:flex">
      <div className="w-full text-left text-white sm:w-1/2 sm:px-2">
        <h4 className="font-bold">Current Guess</h4>
        <div className="min-h-[24px]">
          {currentGuess.length == 0 && <p>No letters in current guess.</p>}
          {currentGuess.length > 0 && <p>{guessWord.toUpperCase()}</p>}
        </div>
      </div>
      <div className="w-full text-left text-white sm:w-1/2 sm:px-2">
        <h4 className="font-bold">All Guesses</h4>
        <div className="min-h-[24px]">
          {currentWord.guesses.length > 0 && (
            <ul>
              {currentWord.guesses.map((x) => (
                <li>{x.toUpperCase()}</li>
              ))}
            </ul>
          )}
          {currentWord.guesses.length == 0 && <p>No guesses submitted for this word.</p>}
        </div>
      </div>
    </div>
  );
}

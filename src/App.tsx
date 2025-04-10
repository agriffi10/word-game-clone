import { useEffect, useState } from "react";
import "./App.css";
import GameBoard from "./components/game-board/GameBoard";
import VirtualKeyboard from "./components/virtual-keyboard/VirtualKeyboard";
import { MAX_ROW_INDEX } from "./utils/GameBoardHelpers";
import { KeyObjBase } from "./typing/components/KeyboardTypes";

function App() {
  const currentWord = "apples";
  const [hasFinished, setHasFinished] = useState(false);
  const [currentRow, setCurrentRow] = useState(0);
  const [currentGuess, setCurrentGuess] = useState<KeyObjBase[]>([]);

  const getCurrentGuessWord = () => {
    return currentGuess.map((x) => x.key).join("");
  };

  const enterLetter = (letter: KeyObjBase) => {
    if (currentGuess.length >= currentWord.length || hasFinished) {
      return;
    }
    const newArray = [...currentGuess, letter];
    setCurrentGuess(() => newArray);
  };

  const deleteLetter = () => {
    if (currentGuess.length == 0 || hasFinished) {
      setCurrentGuess(() => []);
      return;
    }
    const newArray = currentGuess.slice(0, -1);
    setCurrentGuess(() => newArray);
  };

  const enterGuess = () => {
    const guessWord = getCurrentGuessWord();
    if (hasFinished) {
      return;
    }
    const isValid = validateGuess();
    if (!isValid) {
      console.log("Guess word is not valid");
      return;
    }
    if (guessWord == currentWord) {
      setHasFinished(true);
    }
    setCurrentRow((prev) => prev + 1);
  };

  const validateGuess = () => {
    if (currentGuess.length < 6) {
      return false;
    }
    return true;
    // Check if word is a valid english word
  };

  const resetGuess = () => {
    setCurrentGuess(() => []);
  };

  useEffect(() => {
    if (currentRow > MAX_ROW_INDEX) {
      setHasFinished(true);
    }
  }, [currentRow]);

  return (
    <div className="letter-columns flex h-screen w-screen items-center justify-center p-5 text-center">
      <main className="mx-auto w-full max-w-[800px]">
        <div className="min-w-[300px] rounded-lg bg-gray-800 p-5 shadow-lg">
          <GameBoard
            currentRowIdx={currentRow}
            currentGuess={currentGuess}
            currentWord={currentWord}
            resetGuess={resetGuess}
          />
          <VirtualKeyboard
            enterGuess={enterGuess}
            enterLetter={enterLetter}
            deleteLetter={deleteLetter}
            currentWord={currentWord}
            currentGuess={currentGuess}
          />
        </div>
      </main>
    </div>
  );
}

export default App;

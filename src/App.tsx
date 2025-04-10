import { useState } from "react";
import "./App.css";
import GameBoard from "./components/game-board/GameBoard";
import VirtualKeyboard from "./components/virtual-keyboard/VirtualKeyboard";

import { KeyObjBase } from "./typing/components/KeyboardTypes";
import Modal from "./components/modal/Modal";

function App() {
  const [hasFinished, setHasFinished] = useState(false);
  const [currentRow, setCurrentRow] = useState(0);
  const [currentGuess, setCurrentGuess] = useState<KeyObjBase[]>([]);
  const [currentWord, setCurrentWord] = useState<string>("apples");

  const getCurrentGuessWord = () => {
    return currentGuess.map((x) => x.key).join("");
  };

  const hasWon = () => {
    return getCurrentGuessWord() == currentWord;
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
    if (hasFinished) {
      return;
    }
    const isValid = validateGuess();
    if (!isValid) {
      console.log("Guess word is not valid");
      return;
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

  const endTheGame = () => {
    setHasFinished(true);
  };

  const getGameOverText = () => {
    if (hasWon()) {
      return "You won!";
    }
    return `Not this time!`;
  };

  const resetGame = () => {
    setCurrentRow(0);
    setCurrentGuess(() => []);
    setHasFinished(false);
    setCurrentWord("popcor");
  };

  return (
    <div className="letter-columns flex h-screen w-screen items-center justify-center p-5 text-center">
      <main className="mx-auto w-full max-w-[800px]">
        <div className="mx-auto w-full max-w-[600px] rounded-lg bg-gray-800 p-5 shadow-lg">
          <>
            <GameBoard
              currentRowIdx={currentRow}
              currentGuess={currentGuess}
              currentWord={currentWord}
              resetGuess={resetGuess}
              endTheGame={endTheGame}
            />
            <VirtualKeyboard
              enterGuess={enterGuess}
              enterLetter={enterLetter}
              deleteLetter={deleteLetter}
              currentWord={currentWord}
              currentGuess={currentGuess}
            />
          </>
        </div>
        <Modal show={hasFinished}>
          <div>
            <h2 className="mb-3 text-3xl">{getGameOverText()}</h2>
            <h3 className="mb-3 text-2xl">The word was {currentWord.toUpperCase()}</h3>
            <p>
              You took {currentRow} guess{currentRow > 1 ? "es" : ""}
            </p>
            <div className="mt-5 flex justify-center">
              <button
                type="button"
                className="mx-2 w-32 rounded-md bg-blue-500 px-4 py-2 text-white shadow-lg transition-transform active:scale-x-75"
                onClick={() => resetGame()}>
                Reset Game
              </button>
            </div>
          </div>
        </Modal>
      </main>
    </div>
  );
}

export default App;

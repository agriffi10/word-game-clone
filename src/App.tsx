import { useEffect, useState } from "react";
import "./App.css";
import GameBoard from "./components/game-board/GameBoard";
import { Board } from "./typing/components/GameBoardTypes";
import VirtualKeyboard from "./components/virtual-keyboard/VirtualKeyboard";

function App() {
  const currentWord = "apples";
  const maxLetterIdx = 5;
  const maxRowIdx = 5;
  const defaultBoard: Board = new Array(6).fill(null).map(() => new Array(6).fill(""));
  const [hasFinished, setHasFinished] = useState(false);
  const [board, setBoard] = useState<Board>(defaultBoard);
  const [currentLetter, setCurrentLetter] = useState(0);
  const [currentRow, setCurrentRow] = useState(0);
  const getCurrentLetter = () => {
    return board[currentRow][currentLetter];
  };

  const setLetterOnBoard = (letter: string) => {
    const newData = board.map((row, rIndex) =>
      rIndex === currentRow
        ? row.map((col, cIndex) => (cIndex === currentLetter ? letter : col))
        : row,
    );
    setBoard(() => newData);
  };

  const getCurrentGuess = () => {
    return board[currentRow].join("");
  };

  const enterLetter = (letter: string) => {
    if (getCurrentLetter() != "" || hasFinished) {
      return;
    }
    setLetterOnBoard(letter);
    if (currentLetter < maxLetterIdx) {
      setCurrentLetter((prev) => prev + 1);
    }
  };

  const deleteLetter = () => {
    if (hasFinished) {
      return;
    }
    if (getCurrentLetter() == "") {
      setCurrentLetter((prev) => prev + 1);
    }
    setLetterOnBoard("");
    if (currentLetter < 0) {
      setCurrentLetter(() => 0);
    }
  };

  const enterGuess = () => {
    const guessWord = getCurrentGuess();
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
      return;
    }
    setCurrentRow((prev) => prev + 1);
    setCurrentLetter(() => 0);
  };

  const validateGuess = () => {
    // Check if the guessWord is valid
    const guessWord = getCurrentGuess();

    if (guessWord.length !== 6) {
      return false;
    }
    return true;
    // Check if word is a valid english word
  };

  useEffect(() => {
    if (currentRow > maxRowIdx) {
      setHasFinished(true);
    }
  }, [currentRow]);

  return (
    <>
      <GameBoard board={board} />
      <VirtualKeyboard
        enterGuess={enterGuess}
        enterLetter={enterLetter}
        deleteLetter={deleteLetter}
        currentWord={currentWord}
        rowIdx={currentRow}
      />
    </>
  );
}

export default App;

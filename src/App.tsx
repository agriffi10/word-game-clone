import "./App.css";
import GameBoard from "./components/game-board/GameBoard";
import { Board } from "./typing/components/GameBoardTypes";

function App() {
  const currentWord = "apples";
  let currentRow = 0;
  let currentLetter = 0;
  const maxLetterIdx = 5;
  const board: Board = new Array(6).fill(null).map(() => new Array(6).fill(""));
  console.log(board);
  const getCurrentLetter = () => {
    return board[currentRow][currentLetter];
  };

  const getBoardInTime = () => {
    return console.log(JSON.parse(JSON.stringify(board)));
  };

  const setCurrentLetter = (letter: string) => {
    board[currentRow][currentLetter] = letter;
  };

  const getCurrentGuessLength = () => {
    return board[currentRow].join("").length;
  };
  const enterLetter = (letter: string) => {
    if (getCurrentLetter() != "") {
      return;
    }
    setCurrentLetter(letter);
    if (currentLetter < maxLetterIdx) {
      currentLetter++;
    }
  };

  const deleteLetter = () => {
    console.log(currentLetter);
    if (getCurrentLetter() == "") {
      currentLetter--;
    }
    setCurrentLetter("");
    getBoardInTime();
    if (currentLetter < 0) {
      currentLetter = 0;
    }
  };

  const enterGuess = () => {
    const guessWord = board[currentRow].join("");
    // Check if the guessWord is valid
    const isValid = validateGuess();
    if (!isValid) {
      console.log("Guess word is not valid");
      return;
    }

    if (guessWord === currentWord) {
      console.log("Correct!");
      return;
    }
    currentRow++;
    currentLetter = 0;
  };
  const validateGuess = () => {
    // Check if the guessWord is valid
    if (getCurrentGuessLength() !== 6) {
      return false;
    }
    return true;
    // Check if word is a valid english word
  };
  enterGuess();
  enterLetter("a");
  enterLetter("p");
  enterLetter("p");
  enterLetter("l");
  enterLetter("e");
  enterLetter("s");
  enterLetter("s");
  enterLetter("e");
  enterLetter("s");
  enterLetter("l");
  enterLetter("l");
  enterLetter("l");
  deleteLetter();
  deleteLetter();
  deleteLetter();
  deleteLetter();
  // enterLetter("a");
  // enterLetter("a");
  // enterLetter("a");
  // console.log(board);
  // enterGuess();
  // console.log(board);
  // enterLetter("a");
  // enterLetter("p");
  // enterLetter("p");
  // enterLetter("l");
  // enterLetter("e");
  // enterLetter("s");
  // console.log(board);
  // enterGuess();
  return (
    <>
      <h1 className="text-3xl font-bold text-amber-400 underline">Hello world!</h1>
      <GameBoard board={board} />
    </>
  );
}

export default App;

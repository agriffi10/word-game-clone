/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import "./App.css";
import GameBoard from "./components/game-board/GameBoard";
import VirtualKeyboard from "./components/virtual-keyboard/VirtualKeyboard";

import { KeyObjBase } from "./typing/components/KeyboardTypes";
import Modal from "./components/modal/Modal";
import { Guess, WordData } from "./typing/components/AppTypes";
import { GameViewState } from "./typing/enums/ViewStates";
import PreviousBoard from "./components/previous/previous-board/PreviousBoard";
import UserActionButton from "./components/buttons/UserActionButton";

function App() {
  const [hasFinished, setHasFinished] = useState(false);
  const [currentRow, setCurrentRow] = useState(0);
  const [currentGuess, setCurrentGuess] = useState<Guess>([]);
  const [currentWord, setCurrentWord] = useState<WordData>({
    word: "",
    isSolved: false,
    guesses: [],
    currentWord: false,
  });
  const [wordsList, setWordsList] = useState<WordData[]>([]);
  const [viewState, setViewState] = useState<GameViewState>(GameViewState.GAME);
  const [showModal, setShowModal] = useState(false);
  const getCurrentGuessWord = () => {
    return currentGuess.map((x) => x.key).join("");
  };

  const hasWon = () => {
    return getCurrentGuessWord() == currentWord.word;
  };

  const enterLetter = (letter: KeyObjBase) => {
    if (currentGuess.length >= currentWord.word.length || hasFinished) {
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
    const updateWord = { ...currentWord };
    updateWord.guesses.push(getCurrentGuessWord());
    updateWordInMemory(null, updateWord);
    setCurrentWord(() => updateWord);
  };

  const validateGuess = () => {
    if (currentGuess.length < 6) {
      return false;
    }
    return wordsList.some((wordObj) => wordObj.word == getCurrentGuessWord());
  };

  const resetGuess = () => {
    setCurrentGuess(() => []);
  };

  const endTheGame = () => {
    setHasFinished(true);
    const newWord = { ...currentWord };
    newWord.isSolved = true;
    newWord.currentWord = false;
    updateWordInMemory(null, newWord);
    toggleModal();
  };

  const getGameOverText = () => {
    if (hasWon()) {
      return "You won!";
    }
    return `Not this time!`;
  };

  const resetGame = () => {
    setCurrentRow(0);
    resetGuess();
    setHasFinished(false);
    getNewWord();
  };

  const toggleModal = () => {
    setShowModal((prev) => !prev);
  };

  /**
   * Description placeholder
   *
   * @param {(WordData[] | null)} [data=null]
   */
  const getNewWord = (data: WordData[] | null = null) => {
    if (!data) {
      data = wordsList;
    }
    const currentWord = data.find((wordObj) => wordObj.currentWord == true);
    if (currentWord) {
      console.log("Word already used today: ", currentWord.word);
      setCurrentWord(currentWord);
      return;
    }
    const filteredList = data.filter((wordObj) => wordObj.isSolved == false);
    if (filteredList.length == 0) {
      console.error("No words available");
      return;
    }
    const wordIndex = Math.floor(Math.random() * filteredList.length);
    const randomWord = filteredList[wordIndex];
    randomWord.currentWord = true;
    updateWordInMemory(data, randomWord);
    setCurrentWord(randomWord);
  };

  const clearWordCache = () => {
    localStorage.removeItem("words");
  };

  const updateWordInMemory = (data: WordData[] | null = null, word: WordData) => {
    if (!data) {
      data = wordsList;
    }
    const newWordsList = [...data.filter((wordObj) => wordObj.word != word.word), word];
    localStorage.setItem("words", JSON.stringify(newWordsList));
    setWordsList(() => newWordsList);
  };

  const updateViewState = (state: GameViewState) => {
    setViewState(() => state);
  };

  const getGameBoardStyle = () => {
    return viewState == GameViewState.GAME ? "" : "move-right";
  };

  const getPreviousBoardStyle = () => {
    return viewState == GameViewState.PREVIOUS ? "" : "move-left";
  };

  useEffect(() => {
    const words = localStorage.getItem("words");
    if (words) {
      const data = JSON.parse(words) as WordData[];
      setWordsList(() => data);
      getNewWord(data);
    } else {
      fetch("/words.json")
        .then((response) => response.json())
        .then((data) => {
          setWordsList(() => data as WordData[]);
          localStorage.setItem("words", JSON.stringify(data));
          getNewWord(data as WordData[]);
        })
        .catch((error) => console.error("Error loading JSON:", error));
    }
  }, []);

  return (
    <div className="bg-accent flex h-screen w-screen items-center justify-center p-2 text-center sm:p-5">
      <main className="mx-auto w-full max-w-[800px]">
        <div className="bg-primary shadow-thin sm:shadow-thick mx-auto w-full max-w-[600px] overflow-hidden rounded-lg p-2 md:p-5">
          <div className="stage">
            <div className={`scene ${getGameBoardStyle()}`}>
              <div className="w-full text-right"></div>
              <GameBoard
                currentRowIdx={currentRow}
                currentGuess={currentGuess}
                currentWord={currentWord.word}
                resetGuess={resetGuess}
                endTheGame={endTheGame}
              />
              <VirtualKeyboard
                enterGuess={enterGuess}
                enterLetter={enterLetter}
                deleteLetter={deleteLetter}
                currentWord={currentWord.word}
                currentGuess={currentGuess}
              />
            </div>
            <div className={`scene ${getPreviousBoardStyle()}`}>
              <h2 className="mb-3 text-3xl">Previous Words</h2>
              <PreviousBoard wordList={wordsList} />
            </div>
          </div>
          {viewState == GameViewState.GAME && (
            <UserActionButton
              arg={GameViewState.PREVIOUS}
              callback={updateViewState}>
              View Finished Words
            </UserActionButton>
          )}
          {viewState == GameViewState.PREVIOUS && (
            <UserActionButton
              arg={GameViewState.GAME}
              callback={updateViewState}>
              Back To Game
            </UserActionButton>
          )}
          <UserActionButton callback={clearWordCache}>Clear Word Cache</UserActionButton>
          {hasFinished && <UserActionButton callback={resetGame}>Play Again</UserActionButton>}
        </div>
        <Modal show={showModal}>
          <div>
            <h2 className="mb-3 text-3xl">{getGameOverText()}</h2>
            <h3 className="mb-3 text-2xl">The word was {currentWord.word.toUpperCase()}</h3>
            <p>
              You took {currentRow} guess{currentRow > 1 ? "es" : ""}
            </p>
            <div className="mt-5 flex justify-center">
              <button
                type="button"
                className="mx-2 w-32 rounded-md bg-blue-500 px-4 py-2 text-white shadow-lg transition-transform active:scale-x-75"
                onClick={() => toggleModal()}>
                close
              </button>
            </div>
          </div>
        </Modal>
      </main>
    </div>
  );
}

export default App;

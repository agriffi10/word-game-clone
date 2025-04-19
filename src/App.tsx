/* eslint-disable react-hooks/exhaustive-deps */
import { useCallback, useEffect, useMemo, useState } from "react";
import "./App.css";
import GameBoard from "./features/game-board/GameBoard";
import VirtualKeyboard from "./features/virtual-keyboard/VirtualKeyboard";

import UserActionButton from "./components/buttons/UserActionButton";
import BoardWrapper from "./components/board-wrapper/BoardWrapper";
import useToggle from "./hooks/Toggle";
import GuessesView from "./features/guesses-view/GuessesView";
import PastWords from "./features/past-words/PastWords";
import { KeyDataArray, KeyObjBase, WordData } from "./typing/components/BaseTypes";
import Modal from "./components/modal/Modal";

function App() {
  const [hasFinished, setHasFinished] = useState(false);
  const [currentRow, setCurrentRow] = useState(0);
  const [currentGuess, setCurrentGuess] = useState<KeyDataArray>([]);
  const [currentWord, setCurrentWord] = useState<WordData>({
    word: "",
    isSolved: false,
    guesses: [],
    currentWord: false,
  });
  const [wordsList, setWordsList] = useState<WordData[]>([]);
  const [showEndModal, setShowEndModal] = useToggle();
  const [showDirections, setShowDirections] = useToggle(true);
  const [showFinishedWords, setShowFinishedWords] = useToggle(false);

  const currentGuessWord = useMemo(() => currentGuess.map((x) => x.key).join(""), [currentGuess]);

  const hasWon = () => {
    return currentGuessWord == currentWord.word;
  };

  const enterLetter = useCallback(
    (letter: KeyObjBase) => {
      if (currentGuess.length >= currentWord.word.length || hasFinished) return;
      setCurrentGuess((prev) => [...prev, letter]);
    },
    [currentGuess.length, currentWord.word.length, hasFinished],
  );

  const deleteLetter = useCallback(() => {
    if (currentGuess.length === 0 || hasFinished) {
      setCurrentGuess([]);
      return;
    }
    setCurrentGuess((prev) => prev.slice(0, -1));
  }, [currentGuess.length, hasFinished]);

  const enterGuess = useCallback(() => {
    if (hasFinished) return;
    if (!validateGuess()) {
      console.log("Guess word is not valid");
      return;
    }
    setCurrentRow((prev) => prev + 1);
    const updatedWord = {
      ...currentWord,
      guesses: [...currentWord.guesses, currentGuessWord],
    };
    updateWordInMemory(null, updatedWord);
    setCurrentWord(updatedWord);
  }, [currentWord, hasFinished, currentGuess, wordsList]);

  const resetGuess = useCallback(() => {
    setCurrentGuess([]);
  }, []);

  const validateGuess = () => {
    if (currentGuess.length < 6) {
      return false;
    }
    return wordsList.some((wordObj) => wordObj.word == currentGuessWord);
  };

  const endTheGame = () => {
    setHasFinished(true);
    const newWord = { ...currentWord };
    newWord.isSolved = true;
    newWord.currentWord = false;
    updateWordInMemory(null, newWord);
    setShowEndModal();
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

  /**
   * Description placeholder
   *
   * @param {(WordData[] | null)} [data=null]
   */
  const getNewWord = (data: WordData[] | null = null) => {
    if (!data) {
      data = JSON.parse(JSON.stringify(wordsList)) as WordData[];
    }
    const currentWord = data.find((wordObj) => wordObj.currentWord == true);
    if (currentWord) {
      const updatedWord = { ...currentWord, guesses: [] };
      console.log("Word already used today: ", updatedWord.word);
      setCurrentWord(updatedWord);
      return;
    }
    const filteredList = data.filter((wordObj) => wordObj.isSolved == false);
    if (filteredList.length == 0) {
      console.error("No words available");
      return;
    }
    const wordIndex = Math.floor(Math.random() * filteredList.length);
    const randomWord = JSON.parse(JSON.stringify(filteredList[wordIndex]));
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
    <div className="bg-accent flex h-screen w-screen items-center justify-center overflow-auto p-2 text-center sm:p-5">
      <main className="mx-auto w-full">
        <div className="flex w-full">
          <BoardWrapper>
            <h1 className="mb-2 text-4xl text-white">Word Game</h1>
            <section>
              <GameBoard
                currentRowIdx={currentRow}
                currentGuess={currentGuess}
                currentWord={currentWord}
                resetGuess={resetGuess}
                endTheGame={endTheGame}
              />
            </section>
            <section>
              <VirtualKeyboard
                enterGuess={enterGuess}
                enterLetter={enterLetter}
                deleteLetter={deleteLetter}
                currentWord={currentWord}
              />
            </section>
            <section>
              <GuessesView
                currentGuess={currentGuess}
                currentWord={currentWord}
                guessWord={currentGuessWord}
              />
            </section>

            <section aria-label="Game Options">
              <div className="w-full sm:my-4 sm:flex sm:justify-between">
                <div className="mb-2 w-full p-2">
                  <UserActionButton callback={setShowDirections}>View Directions</UserActionButton>
                </div>
                <div className="mb-2 w-full p-2">
                  <UserActionButton callback={setShowFinishedWords}>View Words</UserActionButton>
                </div>
                <div className="mb-2 w-full p-2">
                  <UserActionButton callback={clearWordCache}>Clear Word Cache</UserActionButton>
                </div>
              </div>
            </section>

            {hasFinished && <UserActionButton callback={resetGame}>Play Again</UserActionButton>}
          </BoardWrapper>
        </div>

        <Modal show={showEndModal}>
          <div className="text-left text-white">
            <h2 className="mb-3 text-3xl">{getGameOverText()}</h2>
            <h3 className="mb-3 text-2xl">The word was {currentWord.word.toUpperCase()}</h3>
            <p>
              You took {currentRow} guess{currentRow > 1 ? "es" : ""}
            </p>
            <div className="mx-auto mt-5 flex w-full max-w-[200px] justify-center">
              <UserActionButton callback={setShowEndModal}>Close Endgame Modal</UserActionButton>
            </div>
          </div>
        </Modal>
        <Modal show={showDirections}>
          <div className="text-left text-white">
            <h2 className="mb-3 text-3xl">Word Game Directions</h2>
            <p className="mb-2 w-full">
              Welcome to my word game! You have six tries to guess the word that has been randomly
              selected.
            </p>
            <p className="mb-2">
              You can use the on-screen keyboard to type in letters to form a guess. Every guess has
              to have six letters. Once you have six letters, click the "Enter Guess" button to see
              if you found the word.
            </p>
            <p className="mb-2">
              Every time you enter a guess, the boxes of the letters will change colors. Green means
              you got the right letter in the right spot, and yellow means you've found a letter but
              it wasn't in the right spot.
            </p>
            <p className="mb-2">
              The game ends when you've exhausted all six guesses or found the word!
            </p>
            <div className="mx-auto mt-5 flex w-full max-w-[200px] justify-center">
              <UserActionButton callback={setShowDirections}>Close Directions</UserActionButton>
            </div>
          </div>
        </Modal>
        <Modal show={showFinishedWords}>
          <PastWords
            wordsList={wordsList}
            setShowFinishedWords={setShowFinishedWords}
          />
        </Modal>
      </main>
    </div>
  );
}

export default App;

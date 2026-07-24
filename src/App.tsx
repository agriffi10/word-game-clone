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
import { GameState, KeyDataArray, KeyObjBase, PlayedWord } from "./typing/components/BaseTypes";
import Modal from "./components/modal/Modal";
import { ToastContainer, toast, Bounce } from "react-toastify";
import { buildValidator, isValidGuess, pickNextWord, WORD_LENGTH } from "./utils/WordSelection";
import {
  clearLegacyState,
  loadSession,
  resetSession,
  saveSession,
  SESSION_VERSION,
} from "./utils/SessionStorage";

const newGame = (word: string): GameState => ({
  word,
  guesses: [],
  currentRow: 0,
  isFinished: false,
  isSolved: false,
});

function App() {
  const [currentGuess, setCurrentGuess] = useState<KeyDataArray>([]);
  const [wordList, setWordList] = useState<string[]>([]);
  const [game, setGame] = useState<GameState | null>(null);
  const [playedWords, setPlayedWords] = useState<PlayedWord[]>([]);
  const [showEndModal, setShowEndModal] = useToggle();
  const [showDirections, setShowDirections] = useToggle(true);
  const [showFinishedWords, setShowFinishedWords] = useToggle(false);

  const validator = useMemo(() => buildValidator(wordList), [wordList]);
  const currentGuessWord = useMemo(() => currentGuess.map((x) => x.key).join(""), [currentGuess]);
  const toastLabel = "User Alert";

  const notifyWordInvalid = useCallback((message: string) => {
    toast.warn(message, {
      ariaLabel: toastLabel,
      onClose: () => {
        const enterGuess = document.getElementById("ENTER GUESS");
        if (enterGuess) {
          enterGuess.focus();
        }
      },
    });
  }, []);

  const enterLetter = useCallback(
    (letter: KeyObjBase) => {
      if (!game || game.isFinished) return;
      if (currentGuess.length >= WORD_LENGTH) return;
      setCurrentGuess((prev) => [...prev, letter]);
    },
    [game, currentGuess.length],
  );

  const deleteLetter = useCallback(() => {
    if (currentGuess.length === 0 || !game || game.isFinished) {
      setCurrentGuess([]);
      return;
    }
    setCurrentGuess((prev) => prev.slice(0, -1));
  }, [currentGuess.length, game]);

  const resetGuess = useCallback(() => {
    setCurrentGuess([]);
  }, []);

  // Synchronous, local guess validation — the guess is valid iff it is a
  // six-letter word in the fetched list. On acceptance the guess is recorded and
  // the row advances; GameBoard then detects win/exhaustion and calls endTheGame.
  const enterGuess = useCallback(() => {
    if (!game || game.isFinished) return;
    if (currentGuessWord.length < WORD_LENGTH) return;
    if (!isValidGuess(currentGuessWord, validator)) {
      notifyWordInvalid("Word not valid!");
      return;
    }
    setGame((prev) =>
      prev
        ? {
            ...prev,
            guesses: [...prev.guesses, currentGuessWord],
            currentRow: prev.currentRow + 1,
          }
        : prev,
    );
  }, [game, currentGuessWord, validator, notifyWordInvalid]);

  const endTheGame = () => {
    if (!game) return;
    const solved = game.guesses.includes(game.word);
    setGame({ ...game, isFinished: true, isSolved: solved });
    setPlayedWords((prev) =>
      prev.some((played) => played.word === game.word)
        ? prev
        : [...prev, { word: game.word, solved }],
    );
    setShowEndModal();
  };

  const getGameOverText = () => (game?.isSolved ? "You won!" : "Not this time!");

  // Endless play: the next word is any list word not yet played this session.
  const playAgain = () => {
    resetGuess();
    const played = playedWords.map((entry) => entry.word);
    const nextWord = pickNextWord(wordList, played);
    setGame(nextWord ? newGame(nextWord) : null);
  };

  // Reset control: clear the persisted session and start a fresh game with the
  // full list eligible again.
  const resetGameSession = () => {
    resetSession();
    setPlayedWords([]);
    resetGuess();
    const nextWord = pickNextWord(wordList, []);
    setGame(nextWord ? newGame(nextWord) : null);
  };

  // Load the static word list once, then resume a saved game or start a new one.
  useEffect(() => {
    clearLegacyState();
    const restored = loadSession();
    fetch("/words.json")
      .then((response) => response.json())
      .then((data: unknown) => {
        if (!Array.isArray(data)) throw new Error("Malformed word list");
        const words = data as string[];
        setWordList(words);
        setPlayedWords(restored.playedWords);
        if (restored.current) {
          setGame(restored.current);
        } else {
          const nextWord = pickNextWord(
            words,
            restored.playedWords.map((entry) => entry.word),
          );
          setGame(nextWord ? newGame(nextWord) : null);
        }
      })
      .catch(() => {
        notifyWordInvalid("Could not load the word list. Please refresh the page.");
      });
  }, []);

  // Persist the session as it changes. Guarded on a loaded list so a failed fetch
  // (empty list) never clobbers the saved session.
  useEffect(() => {
    if (wordList.length === 0) return;
    saveSession({ version: SESSION_VERSION, playedWords, current: game });
  }, [game, playedWords, wordList.length]);

  return (
    <div className="bg-accent flex h-screen w-screen items-center justify-center overflow-auto p-2 text-center sm:p-5">
      <main className="m-auto flex w-full flex-grow flex-col items-center justify-center">
        <div className="flex w-full">
          <BoardWrapper>
            <h1 className="mb-2 text-4xl text-white">Word Game</h1>
            {game ? (
              <>
                <section aria-label="Guesses">
                  <GameBoard
                    currentRowIdx={game.currentRow}
                    currentGuess={currentGuess}
                    currentWord={game}
                    resetGuess={resetGuess}
                    endTheGame={endTheGame}
                  />
                </section>
                <section aria-label="Keyboard Input">
                  <VirtualKeyboard
                    enterGuess={enterGuess}
                    enterLetter={enterLetter}
                    deleteLetter={deleteLetter}
                    notify={notifyWordInvalid}
                    currentWord={game}
                  />
                </section>
                <section aria-label="Guess Information">
                  <GuessesView
                    currentGuess={currentGuess}
                    currentWord={game}
                    guessWord={currentGuessWord}
                  />
                </section>
              </>
            ) : (
              <p
                data-cy="no-game"
                className="my-8 text-white">
                {wordList.length === 0
                  ? "Loading words…"
                  : "You've played every word this session! Reset to play again."}
              </p>
            )}

            <section aria-label="Game Options">
              <div className="w-full sm:my-4 sm:flex sm:justify-between">
                <div className="mb-2 w-full p-2">
                  <UserActionButton callback={setShowDirections}>View Directions</UserActionButton>
                </div>
                <div className="mb-2 w-full p-2">
                  <UserActionButton callback={setShowFinishedWords}>View Words</UserActionButton>
                </div>
                <div className="mb-2 w-full p-2">
                  <UserActionButton callback={resetGameSession}>Reset Session</UserActionButton>
                </div>
              </div>
            </section>

            {game?.isFinished && (
              <UserActionButton callback={playAgain}>Play Again</UserActionButton>
            )}
          </BoardWrapper>
        </div>
        {game && (
          <Modal show={showEndModal}>
            <div className="text-left text-white">
              <h2 className="mb-3 text-3xl">{getGameOverText()}</h2>
              <h3 className="mb-3 text-2xl">The word was {game.word.toUpperCase()}</h3>
              <p>
                You took {game.currentRow} guess{game.currentRow > 1 ? "es" : ""}
              </p>
              <div className="mx-auto mt-5 flex w-full max-w-[200px] justify-center">
                <UserActionButton callback={setShowEndModal}>Close Endgame Modal</UserActionButton>
              </div>
            </div>
          </Modal>
        )}
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
            playedWords={playedWords}
            setShowFinishedWords={setShowFinishedWords}
          />
        </Modal>
        <ToastContainer
          position="top-center"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick={true}
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="dark"
          transition={Bounce}
        />{" "}
      </main>
    </div>
  );
}

export default App;

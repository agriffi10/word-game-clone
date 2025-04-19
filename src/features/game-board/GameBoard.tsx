/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useMemo, useState } from "react";

import {
  cloneBoard,
  getNewGameBoard,
  MAX_LETTER_INDEX,
  MAX_ROW_INDEX,
} from "../../utils/GameBoardHelpers";
import LetterBoxBase from "../../components/letter-box/LetterBoxBase";
import { determineLetterStyle } from "../../utils/GameHelpers";
import { Board, LetterBoxBaseType } from "../../typing/components/BaseTypes";
import { GameBoardProps } from "../../typing/components/ComponentProps";

export default function GameBoard({
  currentRowIdx,
  currentGuess,
  currentWord,
  resetGuess,
  endTheGame,
}: GameBoardProps) {
  const [board, setBoard] = useState<Board>(getNewGameBoard());

  const setLetterOnBoard = () => {
    const defaultStyle = "bg-gray-300";
    const newBoard = cloneBoard(board);
    for (let i = 0; i < currentGuess.length; i++) {
      const currentLetterBox = {
        key: currentGuess[i].key,
        style: defaultStyle,
        location: [currentRowIdx, i],
      };
      newBoard[currentRowIdx][i] = currentLetterBox;
    }

    for (let i = currentGuess.length; i < MAX_LETTER_INDEX + 1; i++) {
      const currentLetterBox = {
        key: "",
        style: defaultStyle,
        location: [currentRowIdx, i],
      };
      newBoard[currentRowIdx][i] = currentLetterBox;
    }
    setBoard(newBoard);
  };

  const getUpdatedBoard = (newBoard: Board, coordinates: LetterBoxBaseType[]): Board => {
    for (let i = 0; i < coordinates.length; i++) {
      const letterObj = coordinates[i];
      const rowIdx = letterObj.location[0];
      const keyIdx = letterObj.location[1];
      const style = letterObj.style;
      newBoard[rowIdx][keyIdx].style = style;
    }
    return newBoard;
  };

  const updateBoard = () => {
    const newBoard = cloneBoard(board);
    const coordinates: LetterBoxBaseType[] = [];
    for (let i = 0; i < currentGuess.length; i++) {
      const letterObj = newBoard[currentRowIdx - 1][i];
      const letter = letterObj.key;
      letterObj.style = determineLetterStyle(currentWord.word, letter, i, letterObj.style);
      coordinates.push(letterObj);
    }
    const newKeyboard = getUpdatedBoard(newBoard, coordinates);
    setBoard(newKeyboard);
    if (
      currentRowIdx > MAX_ROW_INDEX ||
      currentGuess.map((x) => x.key).join("") == currentWord.word
    ) {
      endTheGame();
    } else {
      resetGuess();
    }
  };

  const getGuess = (rowIdx: number): string => {
    if (rowIdx > currentRowIdx) return "No guess yet!";
    if (rowIdx == currentRowIdx && currentGuess.length === 0) return "No guess yet!";
    return rowIdx == currentRowIdx
      ? currentGuess.map((x) => x.key).join("")
      : (currentWord.guesses[rowIdx] || "").toUpperCase();
  };

  useEffect(() => {
    setLetterOnBoard();
  }, [currentGuess]);

  useEffect(() => {
    if (currentGuess.length == 0 && currentRowIdx == 0) {
      return;
    }
    updateBoard();
  }, [currentRowIdx]);

  useEffect(() => {
    setBoard(getNewGameBoard());
  }, [currentWord.word]);

  const renderedBoard = useMemo(() => {
    return board.map((boardRow, rowIdx) => {
      const renderedRow = boardRow.map((letter, letterIdx) => (
        <LetterBoxBase
          key={`${rowIdx}-${letterIdx}`}
          letter={letter}
        />
      ));

      return (
        <section
          key={rowIdx}
          className="my-1 mb-2 flex w-full justify-around"
          aria-label={`Guess ${rowIdx + 1} - ${getGuess(rowIdx)}`}
          aria-live="polite"
          aria-relevant="additions">
          {renderedRow}
        </section>
      );
    });
  }, [board, currentGuess, currentRowIdx]);

  return <div className="mx-auto flex w-full flex-wrap">{renderedBoard}</div>;
}

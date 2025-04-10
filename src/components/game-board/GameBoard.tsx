/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import { Board, GameBoardProps, LetterBoxBaseType } from "../../typing/components/GameBoardTypes";
import { DEFAULT_GAME_BOARD, MAX_LETTER_INDEX } from "../../utils/GameBoardHelpers";
import { GameStyles } from "../../typing/enums/GameStyles";
import LetterBoxBase from "../letter-box/LetterBoxBase";
import { determineLetterStyle } from "../../utils/GameHelpers";

export default function GameBoard({
  currentRowIdx,
  currentGuess,
  currentWord,
  resetGuess,
}: GameBoardProps) {
  const [board, setBoard] = useState<Board>(DEFAULT_GAME_BOARD);
  const [currentLetterIdx, setCurrentLetterIdx] = useState(0);

  const setLetterOnBoard = () => {
    const newBoard = [...board];
    for (let i = 0; i < currentGuess.length; i++) {
      const currentLetterBox = {
        key: currentGuess[i].key,
        style: GameStyles.NOT_IN_WORD,
        location: [currentRowIdx, i],
      };
      newBoard[currentRowIdx][i] = currentLetterBox;
    }

    for (let i = currentGuess.length; i < MAX_LETTER_INDEX + 1; i++) {
      const currentLetterBox = {
        key: "",
        style: GameStyles.NOT_IN_WORD,
        location: [currentRowIdx, i],
      };
      newBoard[currentRowIdx][i] = currentLetterBox;
    }
    setBoard(() => newBoard);
  };

  const getUpdatedBoard = (coordinates: LetterBoxBaseType[]): Board => {
    const newBoard = [...board];
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
    const coordinates: LetterBoxBaseType[] = [];
    for (let i = 0; i < currentGuess.length; i++) {
      const letterObj = board[currentRowIdx - 1][i];
      const letter = letterObj.key;
      letterObj.style = determineLetterStyle(currentWord, letter, i, letterObj.style);
      coordinates.push(letterObj);
    }
    const newKeyboard = getUpdatedBoard(coordinates);
    setBoard(() => newKeyboard);
    resetGuess();
  };

  useEffect(() => {
    setLetterOnBoard();
  }, [currentLetterIdx]);

  useEffect(() => {
    setCurrentLetterIdx(currentGuess.length - 1);
  }, [currentGuess]);

  useEffect(() => {
    if (currentGuess.length == 0 && currentRowIdx == 0) {
      return;
    }
    updateBoard();
  }, [currentRowIdx]);

  return (
    <div className="mx-auto flex w-full max-w-[500px] flex-wrap">
      {board.map((boardRow, arrIndex) => (
        <div
          key={arrIndex}
          className="my-1 flex w-full justify-around">
          {boardRow.map((letter, letterIdx) => (
            <LetterBoxBase
              key={arrIndex.toString() + letterIdx}
              letter={letter}
            />
          ))}
        </div>
      ))}
    </div>
  );
}

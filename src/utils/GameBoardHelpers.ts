import { Board, LetterBoxBaseType } from "../typing/components/GameBoardTypes";

const getDefaultLetterBox = (row: number, col: number): LetterBoxBaseType => {
  return {
    key: "",
    style: "bg-gray-300",
    location: [row, col],
  };
};

export const MAX_ROW_INDEX = 5;

export const MAX_LETTER_INDEX = 5;

export const getNewGameBoard = (): Board => {
  return Array.from({ length: MAX_ROW_INDEX + 1 }, (_, rowIdx) =>
    Array.from({ length: MAX_LETTER_INDEX + 1 }, (_, letterIdx) =>
      getDefaultLetterBox(rowIdx, letterIdx),
    ),
  );
};

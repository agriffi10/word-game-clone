import { Board, LetterBoxBaseType } from "../typing/components/GameBoardTypes";
import { GameStyles } from "../typing/enums/GameStyles";

const getDefaultLetterBox = (row: number, col: number): LetterBoxBaseType => {
  return {
    key: "",
    style: GameStyles.NOT_IN_WORD,
    location: [row, col],
  };
};

export const MAX_ROW_INDEX = 5;

export const MAX_LETTER_INDEX = 5;

export const DEFAULT_GAME_BOARD: Board = Array.from({ length: MAX_ROW_INDEX + 1 }, (_, rowIdx) =>
  Array.from({ length: MAX_LETTER_INDEX + 1 }, (_, letterIdx) =>
    getDefaultLetterBox(rowIdx, letterIdx),
  ),
);

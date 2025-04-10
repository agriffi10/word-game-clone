import { Board, LetterBoxBase } from "../typing/components/GameBoardTypes";
import { GameStyles } from "../typing/enums/GameStyles";

const getDefaultLetterBox = (row: number, col: number): LetterBoxBase => {
  return {
    key: "",
    style: GameStyles.NOT_IN_WORD,
    location: [row, col],
  };
};

export const DEFAULT_GAME_BOARD: Board = Array.from({ length: 6 }, (_, rowIdx) =>
  Array.from({ length: 6 }, (_, letterIdx) => getDefaultLetterBox(rowIdx, letterIdx)),
);

export const MAX_ROW_INDEX = 5;

export const MAX_LETTER_INDEX = 5;

import { Board } from "../../typing/components/GameBoardTypes";
import LetterBoxBase from "../letter-box/LetterBoxBase";

type GameBoardProps = {
  board: Board;
};
export default function GameBoard({ board }: GameBoardProps) {
  // [
  //   ["a", "a", "a", "a", "a", "a"],
  //   ["a", "a", "a", "a", "a", "a"],
  //   ["a", "a", "a", "a", "a", "a"],
  //   ["a", "a", "a", "a", "a", "a"],
  //   ["a", "a", "a", "a", "a", "a"],
  //   ["a", "a", "a", "a", "a", "a"],
  // ];

  return (
    <div className="mx-auto flex w-full max-w-[800px] flex-wrap">
      {board.map((boardRow, arrIndex) => (
        <div
          key={arrIndex}
          className="my-1 flex w-full justify-around">
          {boardRow.map((letter, letterIdx) => (
            <LetterBoxBase
              key={arrIndex.toString() + letterIdx}
              letter={letter}
              classes=""
            />
          ))}
        </div>
      ))}
    </div>
  );
}

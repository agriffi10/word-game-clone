import { PreviousBoardProps } from "../../../typing/components/Previous";
import PreviousWord from "../previous-word/PreviousWord";

export default function PreviousBoard({ wordList }: PreviousBoardProps) {
  const filteredList = wordList.filter((x) => x.isSolved);
  return (
    <div className="flex flex-wrap items-center justify-center gap-2">
      {filteredList.map((wordObject, index) => (
        <PreviousWord
          key={index}
          wordObject={wordObject}
        />
      ))}
    </div>
  );
}

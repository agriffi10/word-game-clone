import UserActionButton from "../../components/buttons/UserActionButton";
import { PastWordsProps } from "../../typing/components/ComponentProps";

export default function PastWords({ wordsList, setShowFinishedWords }: PastWordsProps) {
  const filteredList = wordsList.filter((x) => x.isSolved);

  const solvedText = (word: string, guesses: string[]) => {
    let text = "";
    if (guesses.includes(word)) {
      text += "Solved in ";
    } else {
      text += "Unsolved, ";
    }
    text += `${guesses.length} guess${guesses.length == 1 ? "" : "es"}`;
    return `${word.toUpperCase()} - ${text}`;
  };
  return (
    <div className="text-left text-white">
      <h2 className="mb-3 text-3xl">Finished Words</h2>
      {filteredList.length == 0 && <p>No words completed yet!</p>}

      <ul className="sm:columns-2">
        {filteredList.map((x) => (
          <li key={x.word}>{solvedText(x.word, x.guesses)}</li>
        ))}
      </ul>
      <div className="mx-auto mt-5 flex w-full max-w-[200px] justify-center">
        <UserActionButton callback={setShowFinishedWords}>Close Finished Words</UserActionButton>
      </div>
    </div>
  );
}

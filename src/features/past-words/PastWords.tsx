import UserActionButton from "../../components/buttons/UserActionButton";
import { PastWordsProps } from "../../typing/components/PastWords";

export default function PastWords({ wordsList, setShowFinishedWords }: PastWordsProps) {
  return (
    <div className="text-left text-white">
      <h2 className="mb-3 text-3xl">Finished Words</h2>
      <ul>
        {wordsList
          .filter((x) => x.isSolved)
          .map((x) => (
            <li key={x.word}>
              {x.word.toUpperCase()} - {x.guesses.includes(x.word) ? "Solved" : "Unsolved"}
            </li>
          ))}
      </ul>
      <div className="mx-auto mt-5 flex w-full max-w-[200px] justify-center">
        <UserActionButton callback={setShowFinishedWords}>Close Finished Words</UserActionButton>
      </div>
    </div>
  );
}

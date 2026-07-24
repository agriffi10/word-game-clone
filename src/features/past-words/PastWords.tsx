import UserActionButton from "../../components/buttons/UserActionButton";
import { PastWordsProps } from "../../typing/components/ComponentProps";

export default function PastWords({ playedWords, setShowFinishedWords }: PastWordsProps) {
  return (
    <div className="text-left text-white">
      <h2 className="mb-3 text-3xl">Words This Session</h2>
      {playedWords.length === 0 && <p data-cy="no-played-words">No words completed yet!</p>}

      <ul className="sm:columns-2">
        {playedWords.map((played) => (
          <li
            data-cy="played-word"
            key={played.word}>
            {played.word.toUpperCase()} — {played.solved ? "Solved" : "Failed"}
          </li>
        ))}
      </ul>
      <div className="mx-auto mt-5 flex w-full max-w-[200px] justify-center">
        <UserActionButton callback={setShowFinishedWords}>Close Finished Words</UserActionButton>
      </div>
    </div>
  );
}

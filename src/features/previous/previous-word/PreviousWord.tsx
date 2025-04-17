import { PreviousWordProps } from "../../../typing/components/ComponentProps";

export default function PreviousWord({ wordObject }: PreviousWordProps) {
  return (
    <>
      <div className="mt-2 flex flex-col items-center justify-center">
        {wordObject.guesses.map((word, index) => (
          <div key={index}>{word}</div>
        ))}
        <div>Word: {wordObject.word}</div>
      </div>
    </>
  );
}

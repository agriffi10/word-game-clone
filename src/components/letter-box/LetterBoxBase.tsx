import { LetterBoxBaseProps } from "../../typing/components/LetterBoxTypes";

export default function LetterBoxBase({ letter = "", classes }: LetterBoxBaseProps) {
  return (
    <div className={`mx-1 aspect-square flex-auto bg-gray-600 p-3 ${classes.trim()}`}>
      <span className="text-white">{letter.toUpperCase()}</span>
    </div>
  );
}

import { LetterBoxBaseProps } from "../../typing/components/LetterBoxTypes";

export default function LetterBoxBase({ letter }: LetterBoxBaseProps) {
  return (
    <div
      className={`shadow-thick relative mx-1 mb-1 aspect-square flex-auto p-3 transition-colors duration-700 ${letter.style}`}>
      <div className="absolute top-0.5 right-0.5 bottom-0.5 left-0.5 text-white">
        <span className="text-[45px]">{letter.key.toUpperCase()}</span>
      </div>
    </div>
  );
}

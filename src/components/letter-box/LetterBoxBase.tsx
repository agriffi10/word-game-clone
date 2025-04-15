import { LetterBoxBaseProps } from "../../typing/components/LetterBoxTypes";

export default function LetterBoxBase({ letter }: LetterBoxBaseProps) {
  return (
    <div
      className={`shadow-thick relative mx-1.5 aspect-square flex-auto p-1 sm:p-3 transition-colors duration-700 overflow-hidden ${letter.style}`}>
      <div className="absolute top-1/2 left-1/2  text-white -translate-x-1/2 -translate-y-1/2">
        <span className="text-[25px] sm:text-[45px]">{letter.key.toUpperCase()}</span>
      </div>
    </div>
  );
}

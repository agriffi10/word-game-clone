import { LetterBoxBaseProps } from "../../typing/components/LetterBoxTypes";

export default function LetterBoxBase({ letter = "", classes }: LetterBoxBaseProps) {
  return (
    <div className={`${classes.trim()} flex-auto mx-1 aspect-square bg-amber-300 p-3`}>
      <span className="text-white">{letter.toUpperCase()}</span>
    </div>
  )
}
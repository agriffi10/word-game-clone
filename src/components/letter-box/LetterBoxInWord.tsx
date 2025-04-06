import { LetterBox } from "../../typing/components/LetterBoxTypes";
import LetterBoxBase from "./LetterBoxBase";

export default function LetterBoxInWord({ letter = "" }: LetterBox) {
  return <LetterBoxBase letter={letter} classes="" />
}
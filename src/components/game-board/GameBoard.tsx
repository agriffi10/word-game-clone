import LetterBoxBase from "../letter-box/LetterBoxBase"

type LetterArr = string[]
type Letters = LetterArr[]

export default function GameBoard() {
  const letters: Letters = [
    ["a", "a", "a", "a", "a", "a",],
    ["a", "a", "a", "a", "a", "a",],
    ["a", "a", "a", "a", "a", "a",],
    ["a", "a", "a", "a", "a", "a",],
    ["a", "a", "a", "a", "a", "a",],
    ["a", "a", "a", "a", "a", "a",],
  ]

  return (<div className="w-full flex flex-wrap max-w-[800px] mx-auto">{letters.map(letterArr => <div className="flex w-full justify-around my-1">{letterArr.map(letter => <LetterBoxBase letter={letter} classes="" />)}</div>)}</div>)
}

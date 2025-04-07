import { useMemo, useState } from "react";
import {
  VirtualKeyboardProps,
  Keyboard,
  KeyType,
  KeyObjBase,
} from "../../typing/components/KeyboardTypes";

export default function VirtualKeyboard({
  enterLetter,
  deleteLetter,
  enterGuess,
  currentWord,
  rowIdx,
}: VirtualKeyboardProps) {
  const defaultKeyboard: Keyboard = [
    [
      { key: "q", style: "", type: KeyType.LETTER },
      { key: "w", style: "", type: KeyType.LETTER },
      { key: "e", style: "", type: KeyType.LETTER },
      { key: "r", style: "", type: KeyType.LETTER },
      { key: "t", style: "", type: KeyType.LETTER },
      { key: "y", style: "", type: KeyType.LETTER },
      { key: "u", style: "", type: KeyType.LETTER },
      { key: "i", style: "", type: KeyType.LETTER },
      { key: "o", style: "", type: KeyType.LETTER },
      { key: "p", style: "", type: KeyType.LETTER },
    ],
    [
      { key: "a", style: "", type: KeyType.LETTER },
      { key: "s", style: "", type: KeyType.LETTER },
      { key: "d", style: "", type: KeyType.LETTER },
      { key: "f", style: "", type: KeyType.LETTER },
      { key: "g", style: "", type: KeyType.LETTER },
      { key: "h", style: "", type: KeyType.LETTER },
      { key: "j", style: "", type: KeyType.LETTER },
      { key: "k", style: "", type: KeyType.LETTER },
      { key: "l", style: "", type: KeyType.LETTER },
    ],
    [
      { key: "del", style: "w-12 bg-red-400 text-white", type: KeyType.DELETE },
      { key: "z", style: "", type: KeyType.LETTER },
      { key: "x", style: "", type: KeyType.LETTER },
      { key: "c", style: "", type: KeyType.LETTER },
      { key: "v", style: "", type: KeyType.LETTER },
      { key: "b", style: "", type: KeyType.LETTER },
      { key: "n", style: "", type: KeyType.LETTER },
      { key: "m", style: "", type: KeyType.LETTER },
      { key: "enter", style: "w-16 bg-sky-400", type: KeyType.ENTER },
    ],
  ];
  const [currentGuess, setCurrentGuess] = useState<KeyObjBase[]>([]);
  const [keyboard, setKeyBoard] = useState<Keyboard>(defaultKeyboard);

  const setLetterOnBoard = (newData: Keyboard, letterObj: KeyObjBase) => {
    console.log("Setting letter", letterObj.key);
    const currentRow = letterObj.rowIdx ?? 0;
    const currentLetter = letterObj.keyIdx ?? 0;
    return newData.map((row, rIndex) => {
      if (rIndex == currentRow) {
        return row.map((col, cIndex) => {
          if (cIndex == currentLetter) {
            return { ...col, style: letterObj.style };
          }
          return col;
        });
      }
      return row;
    });
  };
  const checkLetter = (keyPressed: KeyObjBase) => {
    console.log(keyPressed.key);
    enterLetter(keyPressed.key);
    setCurrentGuess((prev: KeyObjBase[]) => [...prev, keyPressed]);
  };

  const removeLetter = () => {
    deleteLetter();
    setCurrentGuess((prev: LetterKey[]) => prev.slice(0, -1));
  };

  const checkWord = () => {
    if (currentGuess.length !== currentWord.length) {
      console.log("not enough letters");
      return;
    }
    enterGuess();
    let newKeyboard = [...keyboard];
    for (let i = 0; i < currentGuess.length; i++) {
      const letterObj = currentGuess[i];
      const letter = letterObj.key;
      if (currentWord.includes(letter)) {
        if (currentWord[i] == letter) {
          letterObj.style = "bg-green-500";
        } else {
          letterObj.style = "bg-yellow-500";
        }
      } else {
        letterObj.style = "bg-gray-500";
      }
      newKeyboard = setLetterOnBoard(newKeyboard, letterObj);
    }
    setKeyBoard(newKeyboard);
  };

  const keyboardClick = (keyObj: KeyObjBase, rowIdx: number, keyIdx: number) => {
    if (keyObj.type === KeyType.LETTER) {
      checkLetter({ ...keyObj, rowIdx, keyIdx });
    } else if (keyObj.type === KeyType.DELETE) {
      removeLetter();
    } else if (keyObj.type === KeyType.ENTER) {
      checkWord();
    }
  };

  useMemo(() => {
    setCurrentGuess([]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rowIdx]);

  return (
    <div>
      {keyboard.map((keyboardRow, rowIdx) => (
        <div key={rowIdx}>
          {keyboardRow.map((keyObj, keyIdx) => (
            <button
              key={keyObj.key}
              type="button"
              className={`mx-1 my-1 h-10 w-10 rounded-md bg-gray-200 text-gray-900 ${keyObj.style}`}
              onClick={() => keyboardClick(keyObj, rowIdx, keyIdx)}>
              {keyObj.key.toUpperCase()}
            </button>
          ))}
        </div>
      ))}
    </div>
  );
}

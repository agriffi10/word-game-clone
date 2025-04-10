import { useState } from "react";
import {
  VirtualKeyboardProps,
  Keyboard,
  KeyType,
  KeyObjBase,
} from "../../typing/components/KeyboardTypes";
import { DEFAULT_KEYBOARD } from "../../utils/KeyboardHelpers";
import { determineLetterStyle } from "../../utils/GameHelpers";

export default function VirtualKeyboard({
  enterLetter,
  deleteLetter,
  enterGuess,
  currentWord,
  currentGuess,
}: VirtualKeyboardProps) {
  const [keyboard, setKeyBoard] = useState<Keyboard>(DEFAULT_KEYBOARD);

  const setLetterOnBoard = (coordinates: KeyObjBase[]): Keyboard => {
    const newKeyboard = [...keyboard];
    for (let i = 0; i < coordinates.length; i++) {
      const letterObj = coordinates[i];
      const rowIdx = letterObj.location[0];
      const keyIdx = letterObj.location[1];
      const style = letterObj.style;
      newKeyboard[rowIdx][keyIdx].style = style;
    }
    return newKeyboard;
  };

  const checkWord = () => {
    if (currentGuess.length !== currentWord.length) {
      return;
    }
    const coordinates: KeyObjBase[] = [];
    for (let i = 0; i < currentGuess.length; i++) {
      const letterObj = currentGuess[i];
      const letter = letterObj.key;
      letterObj.style = determineLetterStyle(currentWord, letter, i, letterObj.style);
      coordinates.push(letterObj);
    }
    const newKeyboard = setLetterOnBoard(coordinates);
    setKeyBoard(() => newKeyboard);
    enterGuess();
  };

  const keyboardClick = (keyObj: KeyObjBase) => {
    if (keyObj.type === KeyType.LETTER) {
      enterLetter(keyObj);
    } else if (keyObj.type === KeyType.DELETE) {
      deleteLetter();
    } else if (keyObj.type === KeyType.ENTER) {
      checkWord();
    }
  };

  return (
    <div>
      {keyboard.map((keyboardRow, rowIdx) => (
        <div key={rowIdx}>
          {keyboardRow.map((keyObj) => (
            <button
              key={keyObj.key}
              type="button"
              className={`mx-1 my-1 h-10 w-10 transform cursor-pointer rounded-md border-white bg-gray-200 text-gray-900 shadow-lg transition-transform outline-none focus:ring-4 active:scale-x-75 ${keyObj.style}`}
              onClick={() => keyboardClick(keyObj)}>
              {keyObj.key.toUpperCase()}
            </button>
          ))}
        </div>
      ))}
    </div>
  );
}

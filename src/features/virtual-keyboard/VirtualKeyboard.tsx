import { useEffect, useState } from "react";

import { getDefaultKeyboard } from "../../utils/KeyboardHelpers";
import { determineLetterStyle } from "../../utils/GameHelpers";
import KeyboardLetter from "../../components/keyboard-letter/KeyboardLetter";
import { LetterKeyType } from "../../typing/enums/KeyboardTypes";
import { Keyboard, KeyDataArray, KeyObjBase } from "../../typing/components/BaseTypes";
import { VirtualKeyboardProps } from "../../typing/components/ComponentProps";

export default function VirtualKeyboard({
  enterLetter,
  deleteLetter,
  enterGuess,
  currentWord,
  currentGuess,
}: VirtualKeyboardProps) {
  const [keyboard, setKeyBoard] = useState<Keyboard>(getDefaultKeyboard());

  const setLetterOnBoard = (coordinates: KeyDataArray): Keyboard => {
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
    const coordinates: KeyDataArray = [];
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
    const letterType = keyObj.type as LetterKeyType;
    if (letterType == LetterKeyType.LETTER) {
      enterLetter(keyObj);
    } else if (letterType == LetterKeyType.DELETE) {
      deleteLetter();
    } else if (letterType == LetterKeyType.ENTER) {
      checkWord();
    }
  };

  useEffect(() => {
    setKeyBoard(() => getDefaultKeyboard());
  }, [currentWord]);

  return (
    <div>
      {keyboard.map((keyboardRow, rowIdx) => (
        <div
          className="my-1.5"
          key={rowIdx}>
          {keyboardRow.map((keyObj) => (
            <KeyboardLetter
              keyObj={keyObj}
              callback={keyboardClick}
              key={keyObj.key}
            />
          ))}
        </div>
      ))}
    </div>
  );
}

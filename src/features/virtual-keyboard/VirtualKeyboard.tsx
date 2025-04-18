/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";

import { cloneKeyboard, getDefaultKeyboard } from "../../utils/KeyboardHelpers";
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
}: VirtualKeyboardProps) {
  const [keyboard, setKeyBoard] = useState<Keyboard>(getDefaultKeyboard());
  const [selectedLetters, setSelectedLetters] = useState<KeyDataArray>([]);

  const setLetterOnBoard = (coordinates: KeyDataArray): Keyboard => {
    const newKeyboard = cloneKeyboard(keyboard);
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
    const coordinates: KeyDataArray = [];
    const letters = selectedLetters.map((x) => x);
    for (let i = 0; i < letters.length; i++) {
      const letterObj = letters[i];
      const letter = letterObj.key;
      letterObj.style = determineLetterStyle(currentWord.word, letter, i, letterObj.style);
      coordinates.push(letterObj);
    }
    const newKeyboard = setLetterOnBoard(coordinates);
    setKeyBoard(newKeyboard);
    setSelectedLetters([]);
  };

  const addLetterGuess = (keyObj: KeyObjBase) => {
    if (selectedLetters.length >= 6) {
      return;
    }
    setSelectedLetters((prev) => [...prev, keyObj]);
  };

  const keyboardClick = (keyObj: KeyObjBase) => {
    const letterType = keyObj.type as LetterKeyType;
    if (letterType == LetterKeyType.LETTER) {
      addLetterGuess(keyObj);
      enterLetter(keyObj);
    } else if (letterType == LetterKeyType.DELETE) {
      deleteLetter();
    } else if (letterType == LetterKeyType.ENTER) {
      if (selectedLetters.length !== currentWord.word.length) {
        return;
      }
      enterGuess();
    }
  };

  useEffect(() => {
    setKeyBoard(getDefaultKeyboard());
  }, [currentWord.word]);

  useEffect(() => {
    checkWord();
  }, [currentWord.guesses]);

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

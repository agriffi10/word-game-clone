/* eslint-disable react-hooks/exhaustive-deps */
import { useCallback, useEffect, useMemo, useState } from "react";

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
  notify,
  currentWord,
}: VirtualKeyboardProps) {
  const [keyboard, setKeyBoard] = useState<Keyboard>(getDefaultKeyboard());
  const [selectedLetters, setSelectedLetters] = useState<KeyDataArray>([]);

  const setLetterOnBoard = useCallback((coordinates: KeyDataArray) => {
    setKeyBoard((prevKeyboard) => {
      const newKeyboard = cloneKeyboard(prevKeyboard);
      for (const letterObj of coordinates) {
        const [rowIdx, keyIdx] = letterObj.location;
        newKeyboard[rowIdx][keyIdx].style = letterObj.style;
      }
      return newKeyboard;
    });
  }, []);

  const checkWord = useCallback(() => {
    if (!selectedLetters.length) {
      return;
    }
    const coordinates: KeyDataArray = selectedLetters.map((letterObj, i) => {
      const updatedStyle = determineLetterStyle(
        currentWord.word,
        letterObj.key,
        i,
        letterObj.style,
      );
      return {
        ...letterObj,
        style: updatedStyle,
      };
    });
    setLetterOnBoard(coordinates);
    setSelectedLetters([]);
  }, [selectedLetters, currentWord.word, setLetterOnBoard]);

  const addLetterGuess = useCallback((keyObj: KeyObjBase) => {
    setSelectedLetters((prev) => {
      if (prev.length >= 6) return prev;
      return [...prev, keyObj];
    });
  }, []);
  const removeLetterGuess = useCallback(() => {
    setSelectedLetters((prev) => {
      if (prev.length == 0) return prev;
      return prev.slice(0, -1);
    });
  }, []);

  const keyboardClick = (keyObj: KeyObjBase) => {
    const letterType = keyObj.type as LetterKeyType;
    if (letterType == LetterKeyType.LETTER) {
      addLetterGuess(keyObj);
      enterLetter(keyObj);
    } else if (letterType == LetterKeyType.DELETE) {
      removeLetterGuess();
      deleteLetter();
    } else if (letterType == LetterKeyType.ENTER) {
      if (selectedLetters.length !== currentWord.word.length) {
        notify("Current guess is less than six letters!");
        return;
      }
      enterGuess();
    }
  };

  useEffect(() => {
    setSelectedLetters([]);
    setKeyBoard(getDefaultKeyboard());
  }, [currentWord.word]);

  useEffect(() => {
    checkWord();
  }, [currentWord.guesses]);

  const memoizedKeyboard = useMemo(() => {
    return keyboard.map((keyboardRow, rowIdx) => (
      <div
        className="my-1.5"
        key={rowIdx}>
        {keyboardRow.map((keyObj) => (
          <KeyboardLetter
            keyObj={keyObj}
            callback={keyboardClick}
            key={`${rowIdx}-${keyObj.key}`} // more unique key helps React diffing
          />
        ))}
      </div>
    ));
  }, [keyboard, keyboardClick]);

  return <div>{memoizedKeyboard}</div>;
}

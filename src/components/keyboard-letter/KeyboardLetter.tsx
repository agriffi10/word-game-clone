import React from "react";
import { KeyboardLetterProps } from "../../typing/components/ComponentProps";
import { GameStyles } from "../../typing/enums/GameStyles";
import { LetterKeyType } from "../../typing/enums/KeyboardTypes";

function KeyboardLetter({ keyObj, callback }: KeyboardLetterProps) {
  const letter = keyObj.key.toUpperCase();
  const getTitle = () => {
    if (keyObj.type == LetterKeyType.DELETE) {
      return "Delete letter from current guess.";
    }
    if (keyObj.type == LetterKeyType.ENTER) {
      return "Enter current guess.";
    }
    let base = `Add letter ${letter} to guess`;
    const style = keyObj.style;
    if (style.includes(GameStyles.IN_WORD) || style.includes(GameStyles.IN_POSITION)) {
      base += " - Letter in word!";
    }
    if (style.includes(GameStyles.NOT_IN_WORD)) {
      base += " - Letter not in word.";
    }

    return base;
  };
  return (
    <button
      key={letter}
      id={letter}
      type="button"
      data-cy="keyboard-button"
      className={`shadow-thin sm:shadow-thick btn-animate xs:h-10 xs:w-10 mx-1 my-1 h-6.5 w-6.5 transform cursor-pointer rounded-md bg-gray-200 text-black sm:mx-1.5 ${keyObj.style}`}
      onClick={() => callback(keyObj)}
      title={getTitle()}>
      {letter}
    </button>
  );
}

export default React.memo(KeyboardLetter);

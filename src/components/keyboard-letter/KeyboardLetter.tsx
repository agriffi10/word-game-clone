import React from "react";
import { KeyboardLetterProps } from "../../typing/components/ComponentProps";
import { GameStyles } from "../../typing/enums/GameStyles";

function KeyboardLetter({ keyObj, callback }: KeyboardLetterProps) {
  const letter = keyObj.key.toUpperCase();
  const getTitle = () => {
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
      type="button"
      data-cy="keyboard-button"
      className={`shadow-thin sm:shadow-thick btn-animate mx-1 my-1 h-6 w-6 transform cursor-pointer rounded-md bg-gray-200 text-black sm:mx-1.5 sm:h-10 sm:w-10 ${keyObj.style}`}
      onClick={() => callback(keyObj)}
      title={getTitle()}>
      {letter}
    </button>
  );
}

export default React.memo(KeyboardLetter);

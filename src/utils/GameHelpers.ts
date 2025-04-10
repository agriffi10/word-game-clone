import { GameStyles } from "../typing/enums/GameStyles";

export const determineLetterStyle = (
  currentWord: string,
  letter: string,
  letterIdx: number,
  currentStyle: string,
): GameStyles | string => {
  if (currentStyle.includes(GameStyles.IN_POSITION)) {
    return currentStyle;
  }
  if (currentWord.includes(letter)) {
    if (currentWord[letterIdx] == letter) {
      return GameStyles.IN_POSITION;
    } else {
      return GameStyles.IN_WORD;
    }
  }
  return GameStyles.NOT_IN_WORD;
};

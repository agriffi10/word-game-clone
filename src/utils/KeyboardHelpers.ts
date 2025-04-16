import { Keyboard, KeyObjBase, KeyType } from "../typing/components/KeyboardTypes";

const LETTERS: string[][] = [
  ["q", "w", "e", "r", "t", "y", "u", "i", "o", "p"],
  ["a", "s", "d", "f", "g", "h", "j", "k", "l"],
  ["z", "x", "c", "v", "b", "n", "m"],
];

const DEFAULT_ACTION_KEY_STYLE = "!w-1/3 !h-10 text-white";

const getDefaultLetter = (
  key: string,
  x: number,
  y: number,
  type: KeyType = KeyType.LETTER,
  style: string = "",
): KeyObjBase => {
  return {
    key,
    style,
    type,
    location: [x, y],
  };
};

export const getDefaultKeyboard = (): Keyboard => {
  const initialKeyboard: Keyboard = [];
  for (let i = 0; i < LETTERS.length; i++) {
    initialKeyboard.push([]);
    for (let j = 0; j < LETTERS[i].length; j++) {
      const letter = LETTERS[i][j];
      initialKeyboard[i].push(getDefaultLetter(letter, i, j));
    }
  }
  return [
    ...initialKeyboard,
    [
      getDefaultLetter(
        "delete letter",
        3,
        0,
        KeyType.DELETE,
        `${DEFAULT_ACTION_KEY_STYLE} bg-secondary`,
      ),
      getDefaultLetter(
        "enter guess",
        3,
        1,
        KeyType.ENTER,
        `${DEFAULT_ACTION_KEY_STYLE} bg-tertiary`,
      ),
    ],
  ];
};

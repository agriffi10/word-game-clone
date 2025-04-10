import { Keyboard, KeyType } from "../typing/components/KeyboardTypes";

export const DEFAULT_KEYBOARD: Keyboard = [
  [
    { key: "q", style: "", type: KeyType.LETTER, location: [0, 0] },
    { key: "w", style: "", type: KeyType.LETTER, location: [0, 1] },
    { key: "e", style: "", type: KeyType.LETTER, location: [0, 2] },
    { key: "r", style: "", type: KeyType.LETTER, location: [0, 3] },
    { key: "t", style: "", type: KeyType.LETTER, location: [0, 4] },
    { key: "y", style: "", type: KeyType.LETTER, location: [0, 5] },
    { key: "u", style: "", type: KeyType.LETTER, location: [0, 6] },
    { key: "i", style: "", type: KeyType.LETTER, location: [0, 7] },
    { key: "o", style: "", type: KeyType.LETTER, location: [0, 8] },
    { key: "p", style: "", type: KeyType.LETTER, location: [0, 9] },
  ],
  [
    { key: "a", style: "", type: KeyType.LETTER, location: [1, 0] },
    { key: "s", style: "", type: KeyType.LETTER, location: [1, 1] },
    { key: "d", style: "", type: KeyType.LETTER, location: [1, 2] },
    { key: "f", style: "", type: KeyType.LETTER, location: [1, 3] },
    { key: "g", style: "", type: KeyType.LETTER, location: [1, 4] },
    { key: "h", style: "", type: KeyType.LETTER, location: [1, 5] },
    { key: "j", style: "", type: KeyType.LETTER, location: [1, 6] },
    { key: "k", style: "", type: KeyType.LETTER, location: [1, 7] },
    { key: "l", style: "", type: KeyType.LETTER, location: [1, 8] },
  ],
  [
    { key: "del", style: "w-12 bg-red-400 text-white", type: KeyType.DELETE, location: [2, 0] },
    { key: "z", style: "", type: KeyType.LETTER, location: [2, 1] },
    { key: "x", style: "", type: KeyType.LETTER, location: [2, 2] },
    { key: "c", style: "", type: KeyType.LETTER, location: [2, 3] },
    { key: "v", style: "", type: KeyType.LETTER, location: [2, 4] },
    { key: "b", style: "", type: KeyType.LETTER, location: [2, 5] },
    { key: "n", style: "", type: KeyType.LETTER, location: [2, 6] },
    { key: "m", style: "", type: KeyType.LETTER, location: [2, 7] },
    { key: "enter", style: "w-16 bg-sky-400", type: KeyType.ENTER, location: [2, 8] },
  ],
];

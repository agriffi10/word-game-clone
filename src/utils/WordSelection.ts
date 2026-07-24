// Pure word-selection and validation logic over the static word list.
// The list is both the answer pool and the guess-validation dictionary.

export const WORD_LENGTH = 6;

/** Build an O(1)-lookup validation set from the word list. */
export const buildValidator = (words: string[]): Set<string> => new Set(words);

/** A guess is valid iff it is exactly six letters and present in the list. */
export const isValidGuess = (guess: string, validator: Set<string>): boolean =>
  guess.length === WORD_LENGTH && validator.has(guess);

/**
 * Pick a uniformly random word not yet played this session. Returns null when
 * every word has been played (practically unreachable with ~12k words).
 */
export const pickNextWord = (words: string[], played: string[]): string | null => {
  const playedSet = new Set(played);
  const available = words.filter((word) => !playedSet.has(word));
  if (available.length === 0) return null;
  const index = Math.floor(Math.random() * available.length);
  return available[index];
};

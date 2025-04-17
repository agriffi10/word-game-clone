import { KeyboardLetterProps } from "../../typing/components/ComponentProps";

export default function KeyboardLetter({ keyObj, callback }: KeyboardLetterProps) {
  return (
    <button
      key={keyObj.key}
      type="button"
      className={`shadow-thin sm:shadow-thick mx-1 my-1 h-6 w-6 transform cursor-pointer rounded-md bg-gray-200 text-gray-900 sm:mx-1.5 sm:h-10 sm:w-10 ${keyObj.style}`}
      onClick={() => callback(keyObj)}>
      {keyObj.key.toUpperCase()}
    </button>
  );
}

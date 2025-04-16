import { UserActionButtonProps } from "../../typing/components/UserActionButtonProps";

export default function UserActionButton({ callback, arg, children }: UserActionButtonProps) {
  return (
    <button
      type="button"
      className="shadow-thin sm:shadow-thick bg-accent mx-1 my-1 w-full transform cursor-pointer rounded-md text-white sm:mx-1.5 sm:h-10"
      onClick={() => callback(arg)}>
      {children}
    </button>
  );
}

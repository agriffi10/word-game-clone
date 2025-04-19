import { UserActionButtonProps } from "../../typing/components/ComponentProps";

export default function UserActionButton({ callback, arg, children }: UserActionButtonProps) {
  return (
    <button
      type="button"
      className="shadow-thin sm:shadow-thick bg-primary-button btn-animate m-0 w-full transform cursor-pointer rounded-md p-2 font-bold text-white sm:min-h-10"
      onClick={() => callback(arg)}>
      {children}
    </button>
  );
}

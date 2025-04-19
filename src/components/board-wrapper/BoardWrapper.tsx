import { BoardWrapperProps } from "../../typing/components/ComponentProps";

export default function BoardWrapper({ children }: BoardWrapperProps) {
  return (
    <div className="bg-primary shadow-thin sm:shadow-thick mx-auto w-full max-w-[600px] overflow-hidden rounded-lg p-2 md:p-5">
      {children}
    </div>
  );
}

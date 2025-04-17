import { ReactElement, useRef } from "react";
import FocusLock from "react-focus-lock";

type ModalProps = {
  show: boolean;
  children: ReactElement | ReactElement[];
};

export default function Modal({ show, children }: ModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);

  return !show ? null : (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed top-0 right-0 bottom-0 left-0 z-100 bg-black/50">
      <FocusLock>
        <div
          ref={modalRef}
          tabIndex={1}
          className={`inner shadow-thin sm:shadow-thick max-h bg-accent-2 absolute top-0 left-0 h-screen max-h-screen w-screen overflow-auto rounded-lg p-8 opacity-100 sm:top-1/2 sm:left-1/2 sm:h-auto sm:max-w-[500px] sm:-translate-x-1/2 sm:-translate-y-1/2`}>
          {children}
        </div>
      </FocusLock>
    </div>
  );
}

import { GameViewState } from "../../typing/enums/ViewStates";

type LinkButtonProps = {
  children: React.ReactNode;
  viewState: GameViewState;
  callback: (view: GameViewState) => void;
};

export default function LinkButton({ children, viewState, callback }: LinkButtonProps) {
  return (
    <button
      type="button"
      className="font-bold text-white underline"
      onClick={() => callback(viewState)}>
      {children}
    </button>
  );
}

import "./App.css";
import GameBoard from "./components/game-board/GameBoard";

function App() {
  const currentWord = "apples"

  return (
    <>
      <h1 className="text-3xl font-bold text-amber-400 underline">Hello world!</h1>
      <GameBoard />
    </>
  );
}

export default App;

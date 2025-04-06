import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";

import App from "./App";

describe("App", () => {
  test("It should render the app", () => {
    render(<App />);
    const item = screen.getByText("Home");
    expect(item).toBeInTheDocument();
  });
});

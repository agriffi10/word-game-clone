/// <reference types="cypress" />

describe("Enter guesses on the board.", () => {
  beforeEach(() => {
    cy.visit("/");
    cy.contains("Close Directions").click();
  });

  it("Should not allow moving to next guess row with invalid word", () => {
    const guess = "QWERTY";
    cy.enterWord(guess);
    const firstGuessRow = cy.getBySel("guess-row").first();
    firstGuessRow.should("have.text", guess);
    const enterButton = cy.contains("ENTER GUESS");
    enterButton.click();
    const newLetter = "P";
    const letterKey = cy.getKeyboardLetter(newLetter);
    letterKey.click();
    const secondGUessRow = cy.getBySel("guess-row").eq(1);
    secondGUessRow.should("not.have.text", newLetter);
  });
  it("Should allow moving to next guess row with a valid word", () => {
    const guess = "SADDLE";
    cy.enterWord(guess);
    const firstGuessRow = cy.getBySel("guess-row").first();
    firstGuessRow.should("have.text", guess);
    const enterButton = cy.contains("ENTER GUESS");
    enterButton.click();
    const newGuess = "MUSEUM";
    cy.enterWord(newGuess);
    const secondGUessRow = cy.getBySel("guess-row").eq(1);
    secondGUessRow.should("have.text", newGuess);
  });
});

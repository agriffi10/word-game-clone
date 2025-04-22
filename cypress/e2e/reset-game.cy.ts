/// <reference types="cypress" />

describe("Finishing the game.", () => {
  beforeEach(() => {
    cy.intercept("GET", "/words*", { fixture: "words.json" });

    cy.visit("/");
    cy.contains("Close Directions").click();
  });

  it("Should allow a user to Win the game, and reset.", () => {
    const guess = "BANANA";
    cy.getBySel("action-button").contains("Play Again").should("not.exist");
    cy.enterWord(guess);
    const enterButton = cy.contains("ENTER GUESS");
    enterButton.click();
    cy.contains("You won!").should("exist");
    cy.getBySel("action-button").contains("Close Endgame Modal").click();
    cy.getBySel("action-button").contains("Play Again").click();
    const firstGuessRow = cy.getBySel("guess-row").first();
    firstGuessRow.should("not.have.text", guess);
  });

  it("Should allow a user to lose the game, and reset.", () => {
    const guesses = ["PUZZLE", "MARBLE", "ORANGE", "GUITAR", "BREEZE", "SILENT"];
    cy.getBySel("action-button").contains("Play Again").should("not.exist");
    const enterButton = cy.contains("ENTER GUESS");

    for (let i = 0; i < guesses.length; i++) {
      const guess = guesses[i];
      cy.enterWord(guess);
      enterButton.click();
      cy.wait(50);
    }
    cy.contains("Not this time!").should("exist");
    cy.getBySel("action-button").contains("Close Endgame Modal").click();
    cy.getBySel("action-button").contains("Play Again").click();
    const firstGuessRow = cy.getBySel("guess-row").first();
    firstGuessRow.should("not.have.text", guesses[0]);
  });
});

/// <reference types="cypress" />

describe("Session persistence and reset", () => {
  beforeEach(() => {
    cy.startGame();
  });

  it("resumes an in-progress game after a page reload", () => {
    // Submit one valid, non-winning guess (the answer is banana).
    cy.enterWord("ORANGE");
    cy.contains("ENTER GUESS").click();
    cy.getBySel("guesses").should("contain.text", "ORANGE");

    cy.reload();
    cy.contains("Close Directions").click();

    // The submitted guess (and the whole game) is restored from localStorage.
    cy.getBySel("guesses").should("contain.text", "ORANGE");
    cy.getBySel("guess-row").first().should("have.text", "ORANGE");
  });

  it("lists played words and clears them on reset", () => {
    // Win the game so the word is recorded as played + solved.
    cy.enterWord("BANANA");
    cy.contains("ENTER GUESS").click();
    cy.contains("You won!").should("exist");
    cy.getBySel("action-button").contains("Close Endgame Modal").click();

    // Past Words lists the solved word.
    cy.getBySel("action-button").contains("View Words").click();
    cy.getBySel("played-word").should("contain.text", "BANANA").and("contain.text", "Solved");
    cy.getBySel("action-button").contains("Close Finished Words").click();

    // Reset clears the played list.
    cy.getBySel("action-button").contains("Reset Session").click();
    cy.getBySel("action-button").contains("View Words").click();
    cy.getBySel("no-played-words").should("exist");
  });
});

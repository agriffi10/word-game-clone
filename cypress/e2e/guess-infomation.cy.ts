/// <reference types="cypress" />

describe("Guess Information Display", () => {
  beforeEach(() => {
    cy.intercept("GET", "/words*", { fixture: "words.json" });

    cy.visit("/");
    cy.contains("Close Directions").click();
  });

  it("Should show current guess, and track guess after submit.", () => {
    const guess = "PUZZLE";
    cy.getBySel("current-guess").should("not.exist");
    cy.getBySel("guesses").should("not.exist");
    cy.enterWord(guess);
    cy.getBySel("current-guess").should("have.text", guess);
    const enterButton = cy.contains("ENTER GUESS");
    enterButton.click();
    cy.getBySel("current-guess").should("not.exist");
    cy.getBySel("guesses").should("have.text", guess);
    // currentGuess.should("not.have.text", guess);
    // cy.getBySel("guesses").eq(0).should("have.text", guess);
  });

  it("Should show a list of submitted words.", () => {
    const guesses = ["PUZZLE", "MARBLE", "ORANGE", "GUITAR", "BREEZE", "SILENT"];
    const enterButton = cy.contains("ENTER GUESS");
    for (let i = 0; i < guesses.length; i++) {
      const guess = guesses[i];
      cy.getBySel("current-guess").should("not.exist");
      cy.enterWord(guess);
      cy.getBySel("current-guess").should("have.text", guess);
      if (i == guesses.length - 1) {
        continue;
      }
      enterButton.click();
      cy.getBySel("current-guess").should("not.exist");
      cy.getBySel("guesses").eq(i).should("have.text", guess);
    }
  });

  it("Should show letters from entered guesses that match the word.", () => {
    const guesses = ["PUZZLE", "MARBLE", "ORANGE", "GUITAR", "BREEZE", "SILENT"];
    const enterButton = cy.contains("ENTER GUESS");
    cy.getBySel("matched-letters").should("have.text", "_ _ _ _ _ _");
    for (let i = 0; i < guesses.length; i++) {
      const guess = guesses[i];
      cy.enterWord(guess);
      if (i == guesses.length - 1) {
        continue;
      }
      enterButton.click();
    }
    cy.getBySel("matched-letters").should("have.text", "B A _ _ _ _");
  });
});

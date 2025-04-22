/// <reference types="cypress" />

describe("Add and Remove Letters from the game board.", () => {
  beforeEach(() => {
    cy.visit("/");
    cy.contains("Close Directions").click();
  });

  it("Should add letters to first guess row", () => {
    const letter = "Q";
    const letterKey = cy.getKeyboardLetter(letter);
    letterKey.click();
    const firstGuessRow = cy.getBySel("guess-row").first();
    firstGuessRow.should("have.text", letter);
    for (let i = 0; i < 7; i++) {
      letterKey.click();
      cy.wait(100);
    }
    const secondGUessRow = cy.getBySel("guess-row").eq(1);
    secondGUessRow.should("not.have.text", letter);
  });

  it("Should remove letters from the first guess row", () => {
    const letter = "Q";
    const letterKey = cy.getKeyboardLetter(letter);
    letterKey.click();
    const deleteButton = cy.contains("DELETE LETTER");
    deleteButton.click();
    const firstGuessRow = cy.getBySel("guess-row").first();
    firstGuessRow.should("not.have.text", letter);
  });
});

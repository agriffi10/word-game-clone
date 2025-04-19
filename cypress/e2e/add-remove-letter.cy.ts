/// <reference types="cypress" />

// Welcome to Cypress!
//
// This spec file contains a variety of sample tests
// for a todo list app that are designed to demonstrate
// the power of writing tests in Cypress.
//
// To learn more about how Cypress works and
// what makes it such an awesome testing tool,
// please read our getting started guide:
// https://on.cypress.io/introduction-to-cypress

describe("Add and Remove Letters from the game board.", () => {
  beforeEach(() => {
    cy.visit("/");
    cy.contains("Close Directions").click();
  });

  it("Should add letters to first guess row", () => {
    const letter = "Q";
    const letterKey = cy.contains("Q").first();
    letterKey.click();
    const firstGuessRow = cy.getBySel("guess-row").first();
    firstGuessRow.should("have.text", letter);
    for (let i = 0; i < 7; i++) {
      letterKey.click();
    }
    const secondGUessRow = cy.getBySel("guess-row").eq(1);
    secondGUessRow.should("not.have.value", letter);
  });
});

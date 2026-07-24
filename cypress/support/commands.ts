/// <reference types="cypress" />
// ***********************************************
// This example commands.ts shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })
//

export {};

declare global {
  namespace Cypress {
    interface Chainable {
      /**
       * Custom command to select DOM element by data-cy attribute.
       * @param selector - The data-cy attribute value.
       * @param args - Additional arguments for the cy.get command.
       */
      getBySel(selector: string): Chainable<JQuery<HTMLElement>>;
      getKeyboardLetter(letter: string): Chainable<JQuery<HTMLElement>>;
      enterWord(guess: string): void;
      getToastAlert(selector: string): Chainable<JQuery<HTMLElement>>;
      /**
       * Load the app with the deterministic fixture word list (both the answer
       * pool and the validation dictionary) and first-word selection, then close
       * the directions modal. Use in a spec's `beforeEach`.
       */
      startGame(): void;
    }
  }
}

Cypress.Commands.add("getBySel", (selector) => {
  return cy.get(`[data-cy=${selector}]`);
});

Cypress.Commands.add("getKeyboardLetter", (letter) => {
  return cy.getBySel("keyboard-button").contains(letter);
});

Cypress.Commands.add("enterWord", (guess) => {
  for (let i = 0; i < guess.length; i++) {
    const letter = guess[i];
    cy.getKeyboardLetter(letter).click();
    cy.wait(100);
  }
});

Cypress.Commands.add("getToastAlert", (selector) => {
  return cy.get(`[aria-label="${selector}"]`);
});

// Serve the fixture as the word list and make selection deterministic by
// stubbing Math.random to 0, so pickNextWord always returns the first unplayed
// word (fixture[0] = "banana"). The fixture is also the validation dictionary.
Cypress.Commands.add("startGame", () => {
  cy.intercept("GET", "/words.json", { fixture: "words.json" }).as("wordList");
  cy.visit("/", {
    onBeforeLoad(win) {
      cy.stub(win.Math, "random").returns(0);
    },
  });
  cy.contains("Close Directions").click();
});

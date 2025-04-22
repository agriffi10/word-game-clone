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

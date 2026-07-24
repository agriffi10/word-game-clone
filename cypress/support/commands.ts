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
       * Stub the Supabase guess-validation lookup so guess submission works
       * without a live backend. Call in a spec's `beforeEach` before visiting.
       */
      stubWordValidation(): void;
    }
  }
}

// Guesses the tests submit that should validate as real words. The app checks
// each guess against the Supabase `all_words` table, which is unreachable in
// e2e (dummy creds) — so we stub it: a real word returns one row, anything else
// (e.g. "qwerty", "qqqqqq") returns none, which the app surfaces as invalid.
const VALID_WORDS = [
  "banana",
  "puzzle",
  "marble",
  "orange",
  "guitar",
  "breeze",
  "silent",
  "saddle",
  "museum",
];

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

// Intercept GET {SUPABASE_URL}/rest/v1/all_words?word=eq.<word>&... and answer
// from VALID_WORDS, mirroring the real ".eq('word', guess').limit(1)" lookup.
Cypress.Commands.add("stubWordValidation", () => {
  cy.intercept("GET", "**/rest/v1/all_words*", (req) => {
    const word = new URL(req.url).searchParams.get("word")?.replace(/^eq\./, "").toLowerCase();
    const isValid = !!word && VALID_WORDS.includes(word);
    req.reply(isValid ? [{ word }] : []);
  }).as("validateWord");
});

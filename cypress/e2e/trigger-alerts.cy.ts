describe("Alerting on invalid guesses.", () => {
  beforeEach(() => {
    cy.visit("/");
    cy.contains("Close Directions").click();
  });

  it("Should display an alert when there is not enough characters.", () => {
    const guess = "Q";
    cy.enterWord(guess);
    const enterButton = cy.contains("ENTER GUESS");
    enterButton.click();
    cy.wait(100);
    cy.getToastAlert("User Alert")
      .should("exist")
      .should("contain.text", "Current guess is less than six letters!");
    cy.wait(5000);
    enterButton.should("have.focus");
  });
  it("Should display an alert when the word is invalid.", () => {
    const guess = "QQQQQQ";
    cy.enterWord(guess);
    const enterButton = cy.contains("ENTER GUESS");
    enterButton.click();
    cy.wait(100);
    cy.getToastAlert("User Alert")
      .should("exist")
      .should("contain.text", "Guess word is not in word list!");
  });
});

/// <reference types="cypress" />

Cypress.Commands.add('login', () => {
  cy.window().then((win) => {
    win.sessionStorage.setItem('user', JSON.stringify('emailmock@mail.com'));
  })
});


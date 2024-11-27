/// <reference types="cypress" />

Cypress.Commands.add('login', () => {
  cy.window().then((win) => {
    win.localStorage.setItem('user', JSON.stringify('emailmock@mail.com'));
  })
});


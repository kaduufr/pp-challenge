describe('Login Page', () => {

  const userResponse = {
    email: "teste@teste.com",
    password: "testpassword123",
    name: "Teste",
    id: 1,
  }

  beforeEach(() => {
    cy.visit('http://localhost:4200');
  });

  it('should load the login page correctly', () => {
    cy.get('.login-form__title').should('contain.text', 'PayDashboard');
    cy.get('.login-form__welcome-message').should('contain.text', 'Bem vindo de volta!');
    cy.get('button[type="submit"]').should('be.disabled');

  });

  it('should show an error message when form fields are invalid', () => {
    const inputEmail = cy.get('input[formControlName="email"]');
    inputEmail.type('invalid-email').blur()
    cy.get('#input-email-error').should('be.visible').and('contain.text', 'Email inválido');
    inputEmail.clear().blur()
    cy.get('#input-email-error').should('be.visible').and('contain.text', 'Este campo é obrigatório');

    cy.get('button[type="submit"]').should('be.disabled');

    const inputPassword = cy.get('input[formControlName="password"]');
    inputPassword.type('123').blur()
    cy.get('#input-password-error').should('be.visible').and('contain.text', 'A senha precisa ter no mínimo 6 caracteres.');
    inputPassword.clear().blur()
    cy.get('#input-password-error').should('be.visible').and('contain.text', 'Este campo é obrigatório');

    cy.get('button[type="submit"]').should('be.disabled');
  });

  it('should submit the form when the fields are valid', () => {
    cy.intercept('GET', '/account?email=teste@teste.com', {
      body: [userResponse],
      statusCode: 200,
    }).as('loginRequest');
    cy.get('input[formControlName="email"]').type('teste@teste.com');
    cy.get('input[formControlName="password"]').type('testpassword123');
    cy.get('button[type="submit"]').should('not.be.disabled');

    cy.get('button[type="submit"]').click();
    cy.wait('@loginRequest').its('response.statusCode').should('eq', 200);

    cy.url().should('include', '/dashboard')
  });

  it("should show error message if e-mail not found", () => {
    cy.intercept('GET', '/account?email=teste@gmail.com', {
      statusCode: 200,
      body: []
    }).as('loginRequest');
    cy.get('input[formControlName="email"]').type('teste@gmail.com');
    cy.get('input[formControlName="password"]').type('testelogin');
    cy.get('button[type="submit"]').should('not.be.disabled');

    cy.get('button[type="submit"]').click();

    cy.wait('@loginRequest').its('response.statusCode').should('eq', 200);

    cy.get('.alert-danger').should('be.visible').and('contain.text', 'Usuário não encontrado');
  });

  it("should show error message if wrong password", () => {
    cy.intercept('GET', '/account?email=teste@teste.com', {
      statusCode: 200,
      body: [userResponse]
    }).as('loginRequest');
    cy.get('input[formControlName="email"]').type('teste@teste.com');
    cy.get('input[formControlName="password"]').type('testelogin2');
    cy.get('button[type="submit"]').should('not.be.disabled');

    cy.get('button[type="submit"]').click();

    cy.wait('@loginRequest').its('response.statusCode').should('eq', 200);

    cy.get('.alert-danger').should('be.visible').and('contain.text', 'Senha inválida');
  });

  it('should show error 500 message if server request fail', () => {
    cy.intercept('GET', '/account?email=teste@teste.com', {
      statusCode: 500,
      body: {error: 'Bad Request'}
    }).as('loginRequest');
    cy.get('input[formControlName="email"]').type('teste@teste.com');
    cy.get('input[formControlName="password"]').type('testpassword123');
    cy.get('button[type="submit"]').should('not.be.disabled');

    cy.get('button[type="submit"]').click();

    cy.wait('@loginRequest').its('response.statusCode').should('eq', 500);

    cy.get('.alert-danger').should('be.visible').and('contain.text', 'Erro ao realizar login');
  });

  it('should toggle password visibility when the eye icon is clicked', () => {
    cy.get('input[formControlName="password"]').should('have.attr', 'type', 'password').type('password123');
    cy.get('button[aria-label="Mostrar ou ocultar senha"]').click();
    cy.get('input[formControlName="password"]').should('have.attr', 'type', 'text');
  });
});

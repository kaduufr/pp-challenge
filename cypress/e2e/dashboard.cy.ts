describe('Dashboard Component', () => {
  beforeEach(() => {
    cy.login();
    cy.intercept('GET', '/tasks?_page=1&_per_page=10', {fixture: 'paymentList.json'}).as('getPaymentList');
    cy.visit('/dashboard');
  });

  it('should render page', () => {
    cy.get('h2').contains('Meus Pagamentos').should('be.visible');
    cy.get('.dashboard__form-fieldset input[placeholder="Pesquisar usuário"]').should('be.visible');
    cy.get('.dashboard__btn-filter').should('contain', 'Filtrar').and('be.visible');
    cy.get('.dashboard__form-button-add').should('contain', 'Novo pagamento').and('be.visible');
    cy.get('.dashboard__table').should('be.visible');
  });


  it('should search payment and clear search', () => {
    cy.intercept('GET', '/tasks?username=user2', {fixture: 'payment.json'}).as('getPaymentList');

    cy.get('input[placeholder="Pesquisar usuário"]').type('user2');
    cy.get('.dashboard__btn-filter').click();

    cy.wait('@getPaymentList')

    cy.get('.dashboard__table tbody tr').should('have.length', 1);
    cy.get('#btnClearSearch').should('be.visible').click();
    cy.get('input[placeholder="Pesquisar usuário"]').should('have.value', '');
  });

  describe('add new payment', () => {
    it('should open modal to add new payment', () => {

      cy.intercept('POST', '/tasks', {fixture: 'payment.json'}).as('createPayment');

      cy.get('.dashboard__form-button-add').click();

      cy.get('app-payment-modal').should('be.visible');

      cy.get('input#username').type('teste3');
      cy.get('input#date').click().type('2024-11-07');
      cy.get('input#name').focus().type('Teste 3');
      cy.get('input#title').type('Pagamento de Teste');
      cy.get('input#value').type('150');
      cy.get('input#imageUrl').type('http://exemplo.com/imagem.jpg');

      cy.get('button.payment-modal__btn-save').click();

      cy.wait('@createPayment');

      cy.get('.alert.alert-success').should('contain', 'Pagamento adicionado com sucesso').and('be.visible');

      cy.wait(2500);

      cy.get('app-payment-modal').should('not.be.visible');

    });

    it('should show error message if add fail', () => {
      cy.intercept('POST', '/tasks', {statusCode: 500, body: {error: 'Erro ao criar pagamento'}}).as('createPayment');

      cy.get('.dashboard__form-button-add').click();

      cy.get('input#username').type('teste4');
      cy.get('input#name').focus().type('Teste 5');
      cy.get('input#date').click().type('2024-12-02');
      cy.get('input#title').type('Pagamento de Teste');
      cy.get('input#value').type('150');
      cy.get('input#imageUrl').type('http://exemplo.com/imagem.jpg');

      cy.get('button.payment-modal__btn-save').click();

      cy.wait('@createPayment');

      cy.get('.alert.alert-danger').should('contain', 'E500: Erro ao adicionar pagamento').and('be.visible');
    });
  })

  describe('edit payment', () => {
    it('show open modal and edit payment successfully', () => {
      cy.intercept('PUT', '/tasks/1', {fixture: 'paymentsAfterUpdate.json'}).as('editPayment');
      cy.intercept('GET', '/tasks?_page=1&_per_page=10', {fixture: 'paymentsAfterUpdate.json'}).as('getPaymentListUpdated');

      cy.get('.dashboard__table tbody tr:first-child .dashboard__table-btn-edit').click();
      cy.get('app-payment-modal').should('be.visible');

      cy.get('input#title').type('Title Changed');

      cy.get('button.payment-modal__btn-save').click();

      cy.wait('@editPayment');

      cy.get('.alert.alert-success').should('contain', 'Pagamento editado com sucesso').and('be.visible');

      cy.reload()

      cy.wait('@getPaymentListUpdated');

      cy.get('.dashboard__table tbody tr:first-child .dashboard__table-btn-edit').click();
      cy.get('input#title').should('have.value', 'Title Changed');

    });

    it('should show error message if update fail', () => {
      cy.intercept('PUT', '/tasks/1', {statusCode: 500, body: {error: 'Erro ao editar pagamento'}}).as('editPayment');

      cy.get('.dashboard__table tbody tr:first-child .dashboard__table-btn-edit').click();
      cy.get('app-payment-modal').should('be.visible');

      cy.get('input#title').type('Title Changed');
      cy.get('button.payment-modal__btn-save').click();

      cy.wait('@editPayment');

      cy.get('.alert.alert-danger').should('contain', 'E500: Erro ao editar pagamento').and('be.visible');

    });
  })

  describe('delete payment', () => {
    it('should open modal and delete payment', () => {

      cy.intercept('DELETE', '/tasks/2', {fixture: 'paymentListAfterDeleteOne.json'}).as('deletePayment');
      cy.intercept('GET', '/tasks?_page=1&_per_page=10', {fixture: 'paymentListAfterDeleteOne.json'}).as('getPaymentListUpdated');

      cy.get('.dashboard__table tbody tr:nth-child(2) .dashboard__table-btn-delete').click();

      cy.get('app-delete-payment-modal').should('be.visible');

      cy.get('button#btnDeletePayment').should('be.visible')

      cy.get('[aria-label="Nome do usuário"]').should('contain.text', 'Usuário:');
      cy.get('[aria-label="Data do pagamento"]').should('contain.text', 'Data:');
      cy.get('[aria-label="Valor do pagamento"]').should('contain.text', 'Valor:');

      cy.get('button#btnDeletePayment').click();

      cy.wait('@deletePayment');

      cy.reload();

      cy.wait('@getPaymentListUpdated');

    });

    it('should show error message if delete fail', () => {
      cy.intercept('DELETE', '/tasks/2', {
        statusCode: 500,
        body: {error: 'Erro ao deletar pagamento'}
      }).as('deletePayment');

      cy.get('.dashboard__table tbody tr:nth-child(2) .dashboard__table-btn-delete').click();

      cy.get('app-delete-payment-modal').should('be.visible');

      cy.get('button#btnDeletePayment').click();

      cy.wait('@deletePayment');

      cy.get('.alert.alert-danger').should('contain', 'Erro ao deletar pagamento').and('be.visible');
    });
  })

  it('should show error message if load payment failed', () => {
    cy.intercept('GET', '/tasks?_page=1&_per_page=10', {
      statusCode: 500,
      body: {error: 'Erro ao carregar pagamentos'}
    }).as('getPaymentListFail');

    cy.reload();

    cy.wait('@getPaymentListFail');

    cy.get('.alert.alert-danger').should('contain', 'Erro ao carregar pagamentos').and('be.visible');
  });

  it('should change itemsPerPage quantity', () => {
    cy.intercept('GET', '/tasks?_page=1&_per_page=20', {fixture: 'paymentListMoreItems.json'}).as('getPaymentListAfterUpdate');

    cy.get('select#totalItemsToShow').select('20');

    cy.wait('@getPaymentListAfterUpdate');

    cy.get('.dashboard__table tbody tr').should('have.length.lte', 20);
  });

  describe('pagination', () => {
    it('should navigate through pages', () => {
      cy.intercept('GET', '/tasks?_page=1&_per_page=10', {fixture: 'paymentList.json'}).as('getPaymentListFirst');

      cy.intercept('GET', '/tasks?_page=2&_per_page=10', {fixture: 'paymentListPage2.json'}).as('getPaymentListPage2');
      cy.get('#btnNextPage').click();
      cy.get('.pagination__item--active')
        .should('have.text', '2');
      cy.get('#btnNextPage').should('be.disabled');

      cy.get('#btnPreviousPage').click();
      cy.get('.pagination__item--active')
        .should('have.text', '1');
      cy.get('#btnPreviousPage').should('be.disabled');
    });

    it('should show error message if navigate through pages failed', () => {
      cy.intercept('GET', '/tasks?_page=1&_per_page=10', {
        statusCode: 500,
        body: {error: 'Erro ao carregar pagamentos'}
      }).as('getPaymentListFirst');

      cy.reload();

      cy.wait('@getPaymentListFirst');

      cy.get('.alert.alert-danger').should('contain', 'Erro ao carregar pagamentos').and('be.visible');
    })
  })
});

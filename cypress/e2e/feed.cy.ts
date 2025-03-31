import { API_URL } from '../support/config';

describe('Feed Page', () => {
  beforeEach(() => {
    // Mock orders data
    cy.fixture('orders.json').then((orders) => {
      cy.intercept(
        {
          method: 'GET',
          url: `${API_URL}/orders/all`
        },
        orders
      ).as('getOrders');
    });

    cy.visit('/feed');
    cy.wait('@getOrders');
  });

  it('should display orders list', () => {
    cy.get('[data-testid="feed_order"]').should('exist');
    cy.get('[data-testid="feed_order_number"]').contains('12345');
    cy.get('[data-testid="feed_order_status"]').contains('Выполнен');
  });

  it('should open order details modal', () => {
    cy.get('[data-testid="feed_order"]').first().click({ force: true });
    cy.get('[data-testid="order_modal"]').should('exist');
    cy.get('[data-testid="order_modal_number"]').contains('12345');
    cy.get('[data-testid="close_modal_btn"]').click({ force: true });
    cy.get('[data-testid="order_modal"]').should('not.exist');
  });
});

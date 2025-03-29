import { API_URL } from '../support/config';

Cypress.on('uncaught:exception', () => {
  return false;
});

beforeEach(() => {
  window.localStorage.setItem('refreshToken', 'testRefreshToken');
  cy.setCookie('accessToken', 'testAccessToken');

  // ingredients
  cy.fixture('ingredients.json').then((ingredients) => {
    cy.intercept(
      {
        method: 'GET',
        url: `${API_URL}/ingredients`
      },
      ingredients
    ).as('getIngredients');
  });

  // feed
  cy.fixture('orders.json').then((orders) => {
    cy.intercept(
      {
        method: 'GET',
        url: `${API_URL}/orders/all`
      },
      orders
    ).as('getOrders');
  });

  // auth
  cy.fixture('user.json').then((user) => {
    cy.intercept(
      {
        method: 'GET',
        url: `${API_URL}/auth/user`
      },
      user
    ).as('getUser');
  });

  cy.visit('/');
  cy.wait('@getIngredients');
});

afterEach(() => {
  cy.clearAllCookies();
  cy.clearAllLocalStorage();
});

describe('Burger Constructor', () => {
  const noBunSelector1 = `[data-testid="no_bun_text_1"]`;
  const noBunSelector2 = `[data-testid="no_bun_text_2"]`;
  const noIngredientsSelector = `[data-testid="no_ingredients_text"]`;
  const bunSelector = `[data-testid="bun_0"]`;
  const ingredientSelector = `[data-testid="ingredient_0"]`;

  it('should be available at localhost:3000', () => {
    cy.url().should('include', 'localhost:3000');
  });

  it('should allow adding bun and ingredients', () => {
    cy.get(noBunSelector1).as('noBunText1');
    cy.get(noBunSelector2).as('noBunText2');
    cy.get(noIngredientsSelector).as('noIngredientsText');
    cy.get(bunSelector + ` button`).as('bun');
    cy.get(ingredientSelector + ` button`).as('ingredient');

    // Check empty state before adding
    cy.get('@noBunText1').contains('Выберите булки');
    cy.get('@noBunText2').contains('Выберите булки');
    cy.get('@noIngredientsText').contains('Выберите начинку');

    // Add ingredients
    cy.get('@bun').click();
    cy.get('@ingredient').click({ multiple: true });

    // Verify ingredients were added
    cy.get(`[data-testid="constructor_section"]`).contains('булка');
    cy.get(`[data-testid="ingredient_element"]`);
  });

  it('should open and close ingredient modal', () => {
    const ingredient = cy.get(bunSelector);
    ingredient.click();

    // Check modal opens
    cy.get(`[data-testid="ingredient_modal"]`);

    // Close modal with close button
    cy.get(`[data-testid="close_modal_btn"]`).click();

    // Check modal closes
    cy.get(`[data-testid="ingredient_modal"]`).should('not.exist');

    // Open modal again and close with overlay
    ingredient.click();
    cy.get(`[data-testid="modal_overlay"]`).click();
    cy.get(`[data-testid="ingredient_modal"]`).should('not.exist');
  });

  it('should display correct ingredient data in modal', () => {
    // Get the first ingredient's data
    cy.get(bunSelector).then(($el) => {
      const name = $el.find('[data-testid="ingredient_name"]').text();
      const calories = $el.find('[data-testid="ingredient_calories"]').text();
      const proteins = $el.find('[data-testid="ingredient_proteins"]').text();
      const fat = $el.find('[data-testid="ingredient_fat"]').text();
      const carbs = $el.find('[data-testid="ingredient_carbs"]').text();

      // Click the ingredient to open modal
      cy.get(bunSelector).click();

      // Verify modal data matches
      cy.get(`[data-testid="ingredient_modal"]`).within(() => {
        cy.get('[data-testid="ingredient_name"]').should('contain', name);
        cy.get('[data-testid="ingredient_calories"]').should(
          'contain',
          calories
        );
        cy.get('[data-testid="ingredient_proteins"]').should(
          'contain',
          proteins
        );
        cy.get('[data-testid="ingredient_fat"]').should('contain', fat);
        cy.get('[data-testid="ingredient_carbs"]').should('contain', carbs);
      });
    });
  });

  it('should create new order', () => {
    // Add ingredients
    const bun = cy.get(bunSelector + ` button`);
    const ingredient = cy.get(ingredientSelector + ` button`);
    bun.click();
    ingredient.click({ multiple: true });

    // Click order button
    cy.get(`[data-testid="new_order_total"] button`).click();

    // Mock new order response
    cy.fixture('newOrder.json').then((newOrder) => {
      cy.intercept(
        {
          method: 'POST',
          url: `${API_URL}/orders`
        },
        newOrder
      ).as('newOrder');

      // Check order modal
      cy.get(`[data-testid="new_order_number"]`).contains(
        newOrder.order.number
      );

      // Close modal
      cy.get(`[data-testid="close_modal_btn"]`).click();

      // Check constructor is empty after order
      cy.get(noBunSelector1).as('noBunText1');
      cy.get(noBunSelector2).as('noBunText2');
      cy.get(noIngredientsSelector).as('noIngredientsText');

      cy.get('@noBunText1').contains('Выберите булки');
      cy.get('@noBunText2').contains('Выберите булки');
      cy.get('@noIngredientsText').contains('Выберите начинку');
    });
  });
});

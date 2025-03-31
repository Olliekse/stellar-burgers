export const API_URL = Cypress.env('BURGER_API_URL');

Cypress.on('uncaught:exception', () => {
  return false;
});

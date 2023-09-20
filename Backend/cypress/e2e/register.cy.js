/// <reference types="Cypress"/>

describe('Visits Registration Page', () => {
  beforeEach(() => {
    cy.visit('http://127.0.0.1:5500/Frontend/auth/register.html')
  })

  it('should load the registration page', () => {
    cy.get('h1').should('contain', 'Welcome to AnonyVerse');
    cy.get('p.lead').should('contain', 'SignUp or Login to Start sharing your hidden thoughts');
    cy.get('.container.py-4.rounded-2.col-md-6').should('exist');
  });

  it('should display the registration form', () => {
    cy.get('#registrationForm').should('exist');
    cy.get('input#exampleInputEmail1').should('exist');
    cy.get('input#username').should('exist');
    cy.get('input#passwd').should('exist');
    cy.get('button[type="submit"]').should('exist');
  });

  it('should show error messages for empty fields on form submission', () => {
    cy.get('button[type="submit"]').click();
    cy.get('#errorContainer').should('be.visible');
    cy.get('.alert.alert-danger').should('be.visible');
    cy.get('#errorContainer').should('contain', 'Please fill in all fields');
  });

  it('should show error message for invalid email', () => {
    cy.get('input#exampleInputEmail1').type('invalid-email');
    cy.get('button[type="submit"]').click();
  });
  it('should show error message for invalid username', () => {
    cy.get('button[type="submit"]').click();
    cy.get('#errorContainer').should('be.visible');
    cy.get('.alert.alert-danger').should('contain', 'Please fill in all fields');
  });
  it('should have a footer with social media links', () => {
    cy.get('a.fa.fa-facebook').should('have.attr', 'href', '#');
    cy.get('a.fa.fa-twitter').should('have.attr', 'href', '#');
    cy.get('a.fa.fa-instagram').should('have.attr', 'href', '#');
    cy.get('a.fa.fa-google').should('have.attr', 'href', '#');
    cy.get('a.fa.fa-youtube').should('have.attr', 'href', '#');
    cy.get('a.fa.fa-pinterest').should('have.attr', 'href', '#');
 });

})
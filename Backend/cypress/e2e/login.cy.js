/// <reference types="Cypress"/>

describe('Visits Login Page', () => {
    beforeEach(() => {
      cy.visit('http://127.0.0.1:5500/Frontend/auth/login.html')
    })
    
    it('should display a login form', () => {
        cy.get('form.loginform').should('exist');
        cy.get('input#email').should('exist');
        cy.get('input#passwd').should('exist');
        cy.get('button:contains("Log In")').should('exist');
      });
    
      it('should display a "Forgot Password?" link', () => {
        cy.contains('Forgot Password?').should('exist');
      });

      it('should navigate to the registration page when "Sign Up" link is clicked', () => {
        cy.contains('Sign Up').click();
        cy.url().should('include', 'register.html'); 
      });

      it('should successfully log in with valid credentials', () => {
        cy.get('input#email').type('valid@example.com');
        cy.get('input#passwd').type('correctpassword');
        cy.contains('Log In').click();
      });
})
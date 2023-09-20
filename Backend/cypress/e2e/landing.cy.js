/// <reference types="Cypress"/>

describe('Visits Landing page first', () => {
    beforeEach(() => {
      cy.visit('http://127.0.0.1:5500/Frontend/landingpage.html')
    })
    it('should display welcome message and content sections', () => {
      cy.get('h1').should('contain', 'Welcome Stranger');
      cy.get('p.lead').should('contain', 'Embrace the enchanting journey');
      cy.get('h2').should('contain', 'Explore the Unknown');
      cy.get('p.lead:eq(1)').should('contain', 'Embark on a special journey');
    });

    it('should have a "Start Journey" button', () => {
      cy.get('a.btn.btn-lg.btn-primary').should('have.attr', 'href', 'auth/register.html');
      cy.get('a.btn.btn-lg.btn-primary').should('contain', 'Start Journey');
    });

    it('should have a footer with social media links and copyright notice', () => {
      cy.get('footer p.font-weight-bold').should('contain', 'We believe that in this fast-paced');
      cy.get('a.fa.fa-facebook').should('have.attr', 'href', '#');
      cy.get('a.fa.fa-twitter').should('have.attr', 'href', '#');
      cy.get('a.fa.fa-instagram').should('have.attr', 'href', '#');
      cy.get('a.fa.fa-google').should('have.attr', 'href', '#');
      cy.get('a.fa.fa-youtube').should('have.attr', 'href', '#');
      cy.get('a.fa.fa-pinterest').should('have.attr', 'href', '#');
      cy.get('footer p').should('contain', 'All rights Reserved 2023');
    });

    it('should have a navigation bar with correct links', () => {
      cy.get('.navbar-brand').should('have.attr', 'href', 'landingpage.html');
      cy.get('.navbar-toggler').should('have.attr', 'data-bs-toggle', 'collapse');
      cy.get('.nav-item:eq(1) .btn.btn-primary').should('have.attr', 'href', 'auth/register.html');
    });
})
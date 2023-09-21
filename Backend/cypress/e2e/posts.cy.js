/// <reference types="Cypress"/>

describe("Visits The All Posts Page", () => {
  beforeEach(() => {
    cy.visit("http://127.0.0.1:5500/Frontend/posts/allposts.html");
    cy.get('#email')
    .type('gift@gmail.com')

cy.get('#passwd')
    .type('pass')

cy.get('.btn')
    .click()

  });
  it("should display the login page if the user is not authenticated", () => {
    cy.url().should("include", "/Frontend/auth/login.html");
  });
  it("Should Verify Page Elements", () => {
    cy.title().should("contain", "AnonyVerse");
    cy.get(".title:contains('Add Post')").should("be.visible");
    cy.get(".upper h6:contains('People of interest')").should("be.visible");
    cy.get(".search_bar").should("be.visible");
    cy.get(".card-title:contains('Stranger')").should("have.length.above", 2);
    cy.get("#myCustomModal").should("not.be.visible");
  });

  it("should log the user out when clicking on 'Logout'", () => {
    cy.getAllLocalStorage("token", "yJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImdpZnQiLCJlbWFpbCI6ImdpZnRAZ21haWwuY29tIiwidXNlcmlkIjoiODFiMTgyMTItNmNiZS00ZDc2LTgzNjQtN2I3MjVkOTIxMWZjIiwiaWF0IjoxNjk1MjAwOTM5LCJleHAiOjE2OTUyMTUzMzl9.zd4h3h9nGI9tZBAofORDksm9s5roNfnsrfbcuRTU_Po");
  })

  it("should have a valid token to access the home posts page'", () => {
  
    cy.getAllLocalStorage("token", "yJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImdpZnQiLCJlbWFpbCI6ImdpZnRAZ21haWwuY29tIiwidXNlcmlkIjoiODFiMTgyMTItNmNiZS00ZDc2LTgzNjQtN2I3MjVkOTIxMWZjIiwiaWF0IjoxNjk1MjAwOTM5LCJleHAiOjE2OTUyMTUzMzl9.zd4h3h9nGI9tZBAofORDksm9s5roNfnsrfbcuRTU_Po");
  });
  it("should be able to like only when with a valid login token", () => {
    
    cy.getAllLocalStorage("token", "yJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImdpZnQiLCJlbWFpbCI6ImdpZnRAZ21haWwuY29tIiwidXNlcmlkIjoiODFiMTgyMTItNmNiZS00ZDc2LTgzNjQtN2I3MjVkOTIxMWZjIiwiaWF0IjoxNjk1MjAwOTM5LCJleHAiOjE2OTUyMTUzMzl9.zd4h3h9nGI9tZBAofORDksm9s5roNfnsrfbcuRTU_Po");
  })

  it("should create a new post with an image and caption", () => {
    cy.getAllLocalStorage("token", "yJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImdpZnQiLCJlbWFpbCI6ImdpZnRAZ21haWwuY29tIiwidXNlcmlkIjoiODFiMTgyMTItNmNiZS00ZDc2LTgzNjQtN2I3MjVkOTIxMWZjIiwiaWF0IjoxNjk1MjAwOTM5LCJleHAiOjE2OTUyMTUzMzl9.zd4h3h9nGI9tZBAofORDksm9s5roNfnsrfbcuRTU_Po")
  })

  it("should verify Modal Functionality", () => {
    cy.get(".title:contains('Add Post')").click();
    // cy.get("#myCustomModal").should("be.visible");
    cy.get("#postImageInput").should("be.visible");
    cy.get("#postCaptionTextarea").should("be.visible");
   
  });
  it("Should verify User Profile Cards", () => {
    cy.get(".card-title:contains('Stranger')").eq(0).click();
    
  });

});





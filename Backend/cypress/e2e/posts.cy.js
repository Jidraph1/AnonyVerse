/// <reference types="Cypress"/>

describe("Visits The All Posts Page", () => {
  beforeEach(() => {
    cy.visit("http://127.0.0.1:5500/Frontend/posts/allposts.html");
  });
  it("should display the login page if the user is not authenticated", () => {
    cy.url().should("include", "/Frontend/auth/login.html");
  });

  it("should log the user out when clicking on 'Logout'", () => {
    cy.getAllLocalStorage("token", "yJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImdpZnQiLCJlbWFpbCI6ImdpZnRAZ21haWwuY29tIiwidXNlcmlkIjoiODFiMTgyMTItNmNiZS00ZDc2LTgzNjQtN2I3MjVkOTIxMWZjIiwiaWF0IjoxNjk1MjAwOTM5LCJleHAiOjE2OTUyMTUzMzl9.zd4h3h9nGI9tZBAofORDksm9s5roNfnsrfbcuRTU_Po");
    cy.url().should("include", "/Frontend/auth/login.html");
  })

  it("should have a valid token to access the home posts page'", () => {
    // Log in with a valid token
    cy.getAllLocalStorage("token", "yJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImdpZnQiLCJlbWFpbCI6ImdpZnRAZ21haWwuY29tIiwidXNlcmlkIjoiODFiMTgyMTItNmNiZS00ZDc2LTgzNjQtN2I3MjVkOTIxMWZjIiwiaWF0IjoxNjk1MjAwOTM5LCJleHAiOjE2OTUyMTUzMzl9.zd4h3h9nGI9tZBAofORDksm9s5roNfnsrfbcuRTU_Po");
  });

  it("should be able to like only when with a valid login token", () => {
    // Log in with a valid token
    cy.getAllLocalStorage("token", "yJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImdpZnQiLCJlbWFpbCI6ImdpZnRAZ21haWwuY29tIiwidXNlcmlkIjoiODFiMTgyMTItNmNiZS00ZDc2LTgzNjQtN2I3MjVkOTIxMWZjIiwiaWF0IjoxNjk1MjAwOTM5LCJleHAiOjE2OTUyMTUzMzl9.zd4h3h9nGI9tZBAofORDksm9s5roNfnsrfbcuRTU_Po");

  })

  it("should create a new post with an image and caption", () => {
    // Log in with a valid token
    cy.getAllLocalStorage("token", "yJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImdpZnQiLCJlbWFpbCI6ImdpZnRAZ21haWwuY29tIiwidXNlcmlkIjoiODFiMTgyMTItNmNiZS00ZDc2LTgzNjQtN2I3MjVkOTIxMWZjIiwiaWF0IjoxNjk1MjAwOTM5LCJleHAiOjE2OTUyMTUzMzl9.zd4h3h9nGI9tZBAofORDksm9s5roNfnsrfbcuRTU_Po");


    // Submit the form
    // cy.get("#shareButton").click();

    // Check if the post is displayed on the page
    cy.get(".card").should("have.length.at.least", 1);

  })
});





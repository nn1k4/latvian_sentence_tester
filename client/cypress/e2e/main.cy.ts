/// <reference types="cypress" />

// Основные E2E сценарии приложения

describe("📘 E2E тесты приложения latvian-sentence-tester-app", () => {
  const url = "http://localhost:5174";

  beforeEach(() => {
    cy.visit(url);
  });

  it("корректно обрабатывает даты", () => {
    const text = "Tikšanās notiks 15. janvārī. Būs jautri.";
    cy.get("textarea").clear().type(text);
    cy.get("div.max-h-48").children().should("have.length", 2);
    cy.contains("Tikšanās notiks 15. janvārī.").should("exist");
    cy.contains("Būs jautri.").should("exist");
  });
});

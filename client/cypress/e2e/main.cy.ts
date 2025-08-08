/// <reference types="cypress" />

// Основные E2E сценарии приложения

describe("📘 E2E тесты приложения latvian-sentence-tester-app", () => {
  const url = "http://localhost:5174";

  beforeEach(() => {
    cy.visit(url);
  });
});

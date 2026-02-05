import generatePerson from "../functions/generate-person";

describe("Fluxo 2: Login de Usuário", () => {
  let user;

  before(() => {
    user = generatePerson();
    cy.register(user);
  });

  it("efetua login com sucesso", () => {
    cy.clearCookies();
    cy.clearLocalStorage();
    cy.login(user);
  });
});

import generatePerson from "../functions/generate-person";

describe("Fluxo 1: Cadastro de Novo Usuário", () => {
  let user;
  let firstName;

  before(() => {
    user = generatePerson();
    firstName = user.name.split(" ")[0];
  });

  it("cadastra novo usuário com sucesso", () => {
    cy.register(user);
    cy.contains(firstName).should("be.visible");
  });
});

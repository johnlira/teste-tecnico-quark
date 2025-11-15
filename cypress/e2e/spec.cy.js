import generatePerson from "../functions/generate-person";

const userTest = generatePerson();
const map = {
  female: "FEMININO",
  male: "MASCULINO",
  undefined: "INDEFINIDO",
};
describe("Testes de fluxos da central de agendamento", () => {
  it("Fluxo 1: Cadastro de Novo Usuário", () => {
    cy.visit("https://agendamento.quarkclinic.com.br/index/363622206");
    cy.get('[data-cy="btn-cadastro"]').click();

    cy.intercept(
      "POST",
      "https://clinic-mol.quark.tec.br/api/social/usuarios",
    ).as("registerRequest");

    cy.get('[data-cy="campo-nome-input"]').type(userTest.name);
    cy.get('[data-cy="campo-telefone-input"]').type(userTest.phone);
    cy.get('[data-cy="campo-sexo-select"]').select(map[userTest.sex]);
    cy.get('[data-cy="campo-data-nascimento-input"]').type(userTest.birth);
    cy.get('input[placeholder="Email"]').type(userTest.email);
    cy.get('[data-cy="campo-numero-documento-input"]').type(userTest.CPF);
    cy.get("#senha").type(userTest.passwd);
    cy.get('[data-cy="campo-confirmar-senha-input"]').type(userTest.passwd);
    cy.get('[name="cb-cadastro"]').check({ force: true });
    cy.get('[data-cy="btn-criar-conta"]').click();

    cy.wait("@registerRequest").its("response.statusCode").should("eq", 200);

    // Validações para confirmar se o usuário está logado.
    cy.contains(userTest.name.split(" ")[0]).should("be.visible");
    cy.get('[data-cy="btn-cadastro"]').should("not.exist");
    cy.get('[data-cy="btn-login-home"]').should("not.exist");
  });

  it("Fluxo 2: Login de Usuário", () => {
    cy.visit("https://agendamento.quarkclinic.com.br/index/363622206");
    cy.get('[data-cy="btn-login"]').click();

    cy.intercept("POST", "https://clinic-mol.quark.tec.br/api/auth/login").as(
      "loginRequest",
    );

    cy.get('[data-cy="campo-usuario-input"]').type(userTest.email);
    cy.get('[name="password"]').type(userTest.passwd);
    cy.get('[name="cb-login"]').check({ force: true });
    cy.get('[data-cy="btn-submit-login"]').click();

    cy.wait("@loginRequest").its("response.statusCode").should("eq", 200);

    //Validações para confirmar se o usuário está logado.
    cy.contains(userTest.name.split(" ")[0]).should("be.visible");
    cy.get('[data-cy="btn-cadastro"]').should("not.exist");
    cy.get('[data-cy="btn-login-home"]').should("not.exist");
  });
});

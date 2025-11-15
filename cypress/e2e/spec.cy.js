import generatePerson from "../functions/generate-person";

const userTest = generatePerson();
// O user é gerado com nome completo, como usamos o primeiro nome diversas vezes, foi criado essa const
const firstName = userTest.name.split(" ")[0];
// !!! devido á pacote externo para criação de dados, utilizamos o genero em ingles para ser personalizado. Com isso usaremos esse MAP para "traduzir" a seleção na página
const map = {
  female: "FEMININO",
  male: "MASCULINO",
  undefined: "INDEFINIDO",
};

// Comando para evitar repetição no processo de login
Cypress.Commands.add("login", () => {
  cy.visit("https://agendamento.quarkclinic.com.br/index/363622206");
  cy.get('[data-cy="btn-login"]').click();

  cy.intercept("POST", "**/api/auth/login").as("loginRequest");

  cy.get('[data-cy="campo-usuario-input"]').type(userTest.email);
  cy.get('[name="password"]').type(userTest.passwd);
  cy.get('[name="cb-login"]').check({ force: true });
  cy.get('[data-cy="btn-submit-login"]').click();

  cy.wait("@loginRequest").its("response.statusCode").should("eq", 200);
  cy.contains(firstName).should("be.visible");
});

describe("Testes central de agendamento", () => {
  it("Fluxo 1: Cadastro de Novo Usuário", () => {
    cy.visit("https://agendamento.quarkclinic.com.br/index/363622206");
    cy.get('[data-cy="btn-cadastro"]').click();

    cy.intercept("POST", "**/api/social/usuarios").as("registerRequest");

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

    cy.contains(firstName).should("be.visible");
  });

  it("Fluxo 2: Login de Usuário", () => {
    cy.login();
  });

  describe("Fluxos com login", () => {
    beforeEach(() => cy.login());

    it("Fluxo 3 e 4: Agendar consulta e enviar comprovante", () => {
      // Lista de interceps que serão usados
      cy.intercept("GET", "**/agendamentos/convenios*").as("getConvenios");
      cy.intercept("GET", "**/agendamentos/agendas*").as("getAgendas");
      cy.intercept("GET", "**/protected/me/dependentes").as("getPacientes");
      cy.intercept("POST", "**/agendamentos/negociacao/*").as("getConfirmacao");
      cy.intercept("POST", "**/protected/me/agendamentos").as("getPagamento");
      cy.intercept("POST", "**/configs/sessao/passo").as("nextStep");

      // Página inicial
      cy.get('[data-cy="btn-consulta-presencial"]').click();
      cy.wait("@getConvenios");

      // Convenios
      cy.get('[data-cy="convenio-label-148"]').click();
      cy.get('[data-cy="convenio-radio-148"]').check();
      cy.wait("@getAgendas");

      // Agenda de horários
      const timeSelector = '[data-cy^="agenda-item-horario-texto-"]';

      // Antes de prosseguir para a página selecionando o horário, verificamos se o card possui horário disponivel e pegamos o primeiro deles.
      // Além disso, salvamos o horário, data e nome do profissional (que no site é o mesmo para todos mas pode ocorrer alterações)

      cy.get(`[data-cy="agendar-agendas-list"] .card`)
        .filter(`:has(${timeSelector})`)
        .first()
        .as("card");

      cy.get("@card")
        .find('[data-cy="agenda-profissional-nome"]')
        .invoke("text")
        .then((t) => t.trim())
        .as("prof");

      cy.get("@card")
        .find('[data-cy="agenda-main-header"]')
        .invoke("text")
        .then((t) => t.trim())
        .as("date");

      cy.get("@card")
        .find(timeSelector)
        .first()
        .invoke("text")
        .then((t) => t.trim())
        .as("time");

      cy.get("@card").find(timeSelector).first().click();
      cy.wait("@getPacientes");

      // Seletor de dependente
      cy.get('[data-cy="paciente-card-nome"]')
        .should("contain.text", firstName)
        .click();

      cy.wait("@getConfirmacao");

      // Tela de confirmação para validação
      cy.get("@prof").then((prof) => cy.contains(prof).should("be.visible"));
      cy.get('[data-cy="confirmacao-especialidade"]').should(
        "contain.text",
        "CARDIOLOGIA",
      );

      cy.get("@date").then((d) => {
        cy.get("@time").then((h) => {
          cy.get('[data-cy="confirmacao-datahora"]').should(
            "contain.text",
            `${d.match(/\d{2}\/\d{2}/)[0]} - ${h}`, // Regex para conferir a data e horário dd/mm - 00:00
          );
        });
      });

      cy.get('[data-cy="confirmacao-btn-confirmar"]').click();
      cy.wait("@getPagamento");
      // Tela de pagamento

      cy.get('[data-cy="finalizacao-btn-transferencia"]').click();

      // Tela para enviar o comprovante
      cy.get("#comprovante").selectFile(
        "cypress/fixtures/comprovante-teste.jpg",
        { force: true },
      );

      cy.get('[data-cy="pagamento-form-textarea-observacao"]').type(
        "Comprovante de Teste",
      );

      cy.wait("@nextStep");
      cy.get('[data-cy="pagamento-form-btn-enviar"]').click();

      // Tela para confirmar o envio do comprovante
      cy.get('[data-cy="pagamento-confirm-link"]').should(
        "contain.text",
        "Obrigado por enviar! Iremos analisar!",
      );
      // Final do teste
    });
  });
});

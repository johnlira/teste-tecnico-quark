import { BASE_URL, MAP_SEXO, SELECTORS } from "./constants";

Cypress.Commands.add("login", (userOrUndefined) => {
  const u = userOrUndefined ?? Cypress.env("user");
  if (!u)
    throw new Error(
      "cy.login() precisa de um objeto user ou Cypress.env('user')",
    );
  const firstName = u.name ? u.name.split(" ")[0] : u.firstName;

  cy.visit(BASE_URL);
  cy.get(SELECTORS.btnLogin).click();

  cy.intercept("POST", "**/api/auth/login").as("loginRequest");

  cy.get(SELECTORS.campoUsuarioInput).type(u.email);
  cy.get(SELECTORS.password).type(u.passwd);
  cy.get(SELECTORS.cbLogin).check({ force: true });
  cy.get(SELECTORS.btnSubmitLogin).click();

  cy.wait("@loginRequest").its("response.statusCode").should("eq", 200);
  cy.contains(firstName).should("be.visible");
});

Cypress.Commands.add("register", (user) => {
  if (!user) throw new Error("cy.register() precisa de um objeto user");
  const firstName = user.name.split(" ")[0];
  const sexLabel = MAP_SEXO[user.sex] ?? MAP_SEXO.undefined;

  cy.visit(BASE_URL);
  cy.get(SELECTORS.btnCadastro).click();

  cy.intercept("POST", "**/api/social/usuarios").as("registerRequest");

  cy.get(SELECTORS.campoNomeInput).type(user.name);
  cy.get(SELECTORS.campoTelefoneInput).type(user.phone);
  cy.get(SELECTORS.campoSexoSelect).select(sexLabel);
  cy.get(SELECTORS.campoDataNascimentoInput).type(user.birth);
  cy.get(SELECTORS.campoEmailPlaceholder).type(user.email);
  cy.get(SELECTORS.campoTipoDocumentoSelect).select("CPF");
  cy.get(SELECTORS.campoNumeroDocumentoInput).type(user.CPF);
  cy.get(SELECTORS.senha).type(user.passwd);
  cy.get(SELECTORS.campoConfirmarSenhaInput).type(user.passwd);
  cy.get(SELECTORS.cbCadastro).check({ force: true });
  cy.get(SELECTORS.btnCriarConta).click();

  cy.wait("@registerRequest").its("response.statusCode").should("eq", 200);
  cy.contains(firstName).should("be.visible");
});

// --- Comandos do fluxo de agendamento ---

Cypress.Commands.add("interceptAgendamento", () => {
  cy.intercept("GET", "**/agendamentos/convenios*").as("getConvenios");
  cy.intercept("GET", "**/agendamentos/agendas*").as("getAgendas");
  cy.intercept("GET", "**/protected/me/dependentes").as("getPacientes");
  cy.intercept("POST", "**/agendamentos/negociacao/*").as("getConfirmacao");
  cy.intercept("POST", "**/protected/me/agendamentos").as("getPagamento");
  cy.intercept("POST", "**/configs/sessao/passo").as("nextStep");
});

Cypress.Commands.add("selecionarConsultaPresencial", () => {
  cy.get(SELECTORS.btnConsultaPresencial).click();
  cy.wait("@getConvenios");
});

Cypress.Commands.add("selecionarConvenio", (convenioId = 148) => {
  cy.get(SELECTORS.convenioLabel(convenioId)).click();
  cy.get(SELECTORS.convenioRadio(convenioId)).check();
  cy.wait("@getAgendas");
});

Cypress.Commands.add("selecionarPrimeiroHorarioDisponivel", () => {
  const timeSelector = SELECTORS.agendaItemHorarioTexto;
  cy.get(SELECTORS.agendarAgendasList)
    .filter(`:has(${timeSelector})`)
    .first()
    .as("card");

  cy.get("@card")
    .find(SELECTORS.agendaProfissionalNome)
    .invoke("text")
    .then((t) => t.trim())
    .as("prof");

  cy.get("@card")
    .find(SELECTORS.agendaMainHeader)
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
});

Cypress.Commands.add("selecionarPaciente", (nomeOuPrimeiroNome) => {
  cy.get(SELECTORS.pacienteCardNome)
    .should("contain.text", nomeOuPrimeiroNome)
    .click();
  cy.wait("@getConfirmacao");
});

Cypress.Commands.add("confirmarDadosAgendamento", (user) => {
  cy.get("@prof").then((prof) => cy.contains(prof).should("be.visible"));
  cy.get(SELECTORS.confirmacaoEspecialidade).should(
    "contain.text",
    "CARDIOLOGIA",
  );
  cy.get(SELECTORS.confirmacaoPaciente).should("contain.text", user.name);

  cy.get("@date").then((d) => {
    cy.get("@time").then((h) => {
      cy.get(SELECTORS.confirmacaoDatahora).should(
        "contain.text",
        `${d.match(/\d{2}\/\d{2}/)[0]} - ${h}`,
      );
    });
  });

  cy.get(SELECTORS.confirmacaoBtnConfirmar).click();
  cy.wait("@getPagamento");
});

Cypress.Commands.add("escolherTransferencia", () => {
  cy.get(SELECTORS.finalizacaoBtnTransferencia).click();
});

Cypress.Commands.add(
  "enviarComprovante",
  (
    caminhoArquivo = "cypress/fixtures/comprovante-teste.jpg",
    observacao = "Comprovante de Teste",
  ) => {
    cy.get(SELECTORS.comprovante).selectFile(caminhoArquivo, { force: true });
    cy.get(SELECTORS.pagamentoFormTextareaObservacao).type(observacao);
    cy.wait("@nextStep");
    cy.get(SELECTORS.pagamentoFormBtnEnviar).click();
    cy.get(SELECTORS.pagamentoConfirmLink).should(
      "contain.text",
      "Obrigado por enviar! Iremos analisar!",
    );
  },
);

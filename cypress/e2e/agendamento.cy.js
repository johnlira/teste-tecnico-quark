import generatePerson from "../functions/generate-person";

describe("Fluxos 3 e 4: Agendar consulta e enviar comprovante", () => {
  let user;
  let firstName;

  beforeEach(() => {
    user = generatePerson();
    firstName = user.name.split(" ")[0];
    cy.register(user);
    // Após register o usuário já está logado; não é necessário cy.login()
  });

  it("agenda consulta presencial e envia comprovante com sucesso", () => {
    cy.interceptAgendamento();
    cy.selecionarConsultaPresencial();
    cy.selecionarConvenio(148);
    cy.selecionarPrimeiroHorarioDisponivel();
    cy.selecionarPaciente(firstName);
    cy.confirmarDadosAgendamento(user);
    cy.escolherTransferencia();
    cy.enviarComprovante(
      "cypress/fixtures/comprovante-teste.jpg",
      "Comprovante de Teste",
    );
  });
});

import generatePerson from "../functions/generate-person";

const userTest = generatePerson();
const map = {
  female: "FEMININO",
  male: "MASCULINO",
  undefined: "INDEFINIDO",
};
describe("Testes de fluxos da central de agendamento", () => {
  // it("Fluxo 1: Cadastro de Novo Usuário", () => {
  //   cy.visit("https://agendamento.quarkclinic.com.br/index/363622206");
  //   cy.get('[data-cy="btn-cadastro"]').click();

  //   cy.intercept(
  //     "POST",
  //     "https://clinic-mol.quark.tec.br/api/social/usuarios",
  //   ).as("registerRequest");

  //   cy.get('[data-cy="campo-nome-input"]').type(userTest.name);
  //   cy.get('[data-cy="campo-telefone-input"]').type(userTest.phone);
  //   cy.get('[data-cy="campo-sexo-select"]').select(map[userTest.sex]);
  //   cy.get('[data-cy="campo-data-nascimento-input"]').type(userTest.birth);
  //   cy.get('input[placeholder="Email"]').type(userTest.email);
  //   cy.get('[data-cy="campo-numero-documento-input"]').type(userTest.CPF);
  //   cy.get("#senha").type(userTest.passwd);
  //   cy.get('[data-cy="campo-confirmar-senha-input"]').type(userTest.passwd);
  //   cy.get('[name="cb-cadastro"]').check({ force: true });
  //   cy.get('[data-cy="btn-criar-conta"]').click();

  //   cy.wait("@registerRequest").its("response.statusCode").should("eq", 200);

  //   // Validações para confirmar se o usuário está logado.
  //   cy.contains(userTest.name.split(" ")[0]).should("be.visible");
  //   cy.get('[data-cy="btn-cadastro"]').should("not.exist");
  //   cy.get('[data-cy="btn-login-home"]').should("not.exist");
  // });

  // it("Fluxo 2: Login de Usuário", () => {
  //   cy.visit("https://agendamento.quarkclinic.com.br/index/363622206");
  //   cy.get('[data-cy="btn-login"]').click();

  //   cy.intercept("POST", "https://clinic-mol.quark.tec.br/api/auth/login").as(
  //     "loginRequest",
  //   );

  //   cy.get('[data-cy="campo-usuario-input"]').type(userTest.email);
  //   cy.get('[name="password"]').type(userTest.passwd);
  //   cy.get('[name="cb-login"]').check({ force: true });
  //   cy.get('[data-cy="btn-submit-login"]').click();

  //   cy.wait("@loginRequest").its("response.statusCode").should("eq", 200);

  //   //Validações para confirmar se o usuário está logado.
  //   cy.contains(userTest.name.split(" ")[0]).should("be.visible");
  //   cy.get('[data-cy="btn-cadastro"]').should("not.exist");
  //   cy.get('[data-cy="btn-login-home"]').should("not.exist");
  // });

  describe("fluxos com login", () => {
    beforeEach(() => {
      // Antes de fazer os próximos passos, será necessário logar na conta
      cy.visit("https://agendamento.quarkclinic.com.br/index/363622206");
      cy.get('[data-cy="btn-login"]').click();

      cy.intercept("POST", "https://clinic-mol.quark.tec.br/api/auth/login").as(
        "loginRequest",
      );

      cy.get('[data-cy="campo-usuario-input"]').type("teste@123.com");
      cy.get('[name="password"]').type("teste");
      cy.get('[name="cb-login"]').check({ force: true });
      cy.get('[data-cy="btn-submit-login"]').click();

      cy.wait("@loginRequest").its("response.statusCode").should("eq", 200);

      //Validações para confirmar se o usuário está logado.
      cy.contains("teste").should("be.visible");
      cy.get('[data-cy="btn-cadastro"]').should("not.exist");
      cy.get('[data-cy="btn-login-home"]').should("not.exist");
    });
    it("Fluxo 3 e 4: Agendar consulta e enviar comprovante de pagametno", () => {
      // seleciona o tipo de consulta e aguarda o GET dos convenios
      cy.intercept(
        "GET",
        "https://clinic-mol.quark.tec.br/api/agendamentos/convenios?telemedicina=false",
      ).as("getConvenios");
      cy.get('[data-cy="btn-consulta-presencial"]').click();
      cy.wait("@getConvenios");
      // seleciona o convenio e aguarda o GET da agenda disponivel
      cy.intercept(
        "GET",
        "https://clinic-mol.quark.tec.br/api/agendamentos/agendas?convenio_id=148&especialidade_id=60&clinica_id=363622231&telemedicina=false",
      ).as("getAgendas");
      cy.get('[data-cy="convenio-label-148"]').click();
      cy.get('[data-cy="convenio-radio-148"]').check();
      cy.wait("@getAgendas");
      // seleciona o primeiro horário disponivel, salva alias para verificações futuras e aguarda o GET dos dependentes
      cy.intercept(
        "GET",
        "https://clinic-mol.quark.tec.br/api/protected/me/dependentes",
      ).as("getPacientes");

      const timeSelector = '[data-cy^="agenda-item-horario-texto-"]';

      // busca pelo primeiro card que tenha o time selector (há casos que não terá horários para a data)
      cy.get(`[data-cy="agendar-agendas-list"] .card`)
        .filter(`:has(${timeSelector})`)
        .first() // vai pegar o primeiro elemento (horário)
        .as("firstCard");

      // Salva o nome do profissional para fazer uma validação posterior
      cy.get("@firstCard")
        .find('[data-cy="agenda-profissional-nome"]')
        .invoke("text")
        .then((t) => t.trim())
        .as("selectedProfissional");

      cy.get("@firstCard")
        .find('[data-cy="agenda-main-header"]')
        .invoke("text")
        .then((t) => t.trim())
        .as("selectedDate");

      cy.get("@firstCard")
        .find('[data-cy^="agenda-item-horario-texto-"]')
        .first()
        .invoke("text")
        .then((t) => t.trim())
        .as("selectedTime");

      cy.get("@firstCard").find(timeSelector).first().click();

      cy.wait("@getPacientes");

      // página de pacientes
      cy.intercept(
        "POST",
        "https://clinic-mol.quark.tec.br/api/agendamentos/negociacao/368098276?convenio_id=148&especialidade_id=60&clinica_id=363622231",
      ).as("getConfirmacao");

      cy.get('[data-cy="paciente-card-nome"]')
        .should("contain.text", "teste")
        .click();

      cy.wait("@getConfirmacao");

      // página de confirmação com validações e intercept para página de confirmação de pagamento
      cy.intercept(
        "POST",
        "https://clinic-mol.quark.tec.br/api/protected/me/agendamentos",
      ).as("getPagamento");
      // confirma o paciente
      cy.get('[data-cy="confirmacao-paciente"]').should(
        "contain.text",
        "teste",
      );
      // confirma o profissional
      cy.get("@selectedProfissional").then((prof) => {
        cy.contains(prof).should("be.visible");
      });
      // confirma a especialidade
      cy.get('[data-cy="confirmacao-especialidade"]').should(
        "contain.text",
        "CARDIOLOGIA",
      );
      // confirma a data/hora
      cy.get('[data-cy="confirmacao-datahora"]')
        .invoke("text")
        .then((t) => {
          const date = t.match(/\d{2}\/\d{2}/)[0];
          const time = t.match(/\d{2}:\d{2}/)[0];
          return `${date} - ${time}`;
        })
        .then((expected) => {
          cy.get('[data-cy="confirmacao-datahora"]').should(
            "contain.text",
            expected,
          );
        });

      cy.get('[data-cy="confirmacao-btn-confirmar"]').click();

      cy.wait("@getPagamento");

      // Processo de envio do comprovante de pagamento
      cy.intercept(
        "POST",
        "https://clinic-mol.quark.tec.br/api/configs/sessao/passo",
      ).as("getConfirmacaoPage");
      cy.get('[data-cy="finalizacao-btn-transferencia"]').click();

      // Anexa o comprovante de pagamento
      cy.get("#comprovante").selectFile(
        "cypress/fixtures/comprovante-teste.jpg",
        {
          force: true,
        },
      );
      cy.get('[data-cy="pagamento-form-textarea-observacao"]').type(
        "Comprovante de Teste",
      );
      cy.wait("@getConfirmacaoPage");

      cy.get('[data-cy="pagamento-form-btn-enviar"]').click();

      // Comprovante enviado
      cy.get('[data-cy="pagamento-confirm-link"]').should(
        "contain.text",
        "Obrigado por enviar! Iremos analisar!",
      );
    });
  });
});

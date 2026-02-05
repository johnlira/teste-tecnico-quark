const BASE_URL = "https://agendamento.quarkclinic.com.br/index/363622206";

const MAP_SEXO = {
  female: "FEMININO",
  male: "MASCULINO",
  undefined: "INDEFINIDO",
};

const SELECTORS = {
  // Login / Cadastro (home)
  btnLogin: '[data-cy="btn-login"]',
  btnCadastro: '[data-cy="btn-cadastro"]',
  campoUsuarioInput: '[data-cy="campo-usuario-input"]',
  password: '[name="password"]',
  cbLogin: '[name="cb-login"]',
  btnSubmitLogin: '[data-cy="btn-submit-login"]',

  // Cadastro
  campoNomeInput: '[data-cy="campo-nome-input"]',
  campoTelefoneInput: '[data-cy="campo-telefone-input"]',
  campoSexoSelect: '[data-cy="campo-sexo-select"]',
  campoDataNascimentoInput: '[data-cy="campo-data-nascimento-input"]',
  campoEmailPlaceholder: 'input[placeholder="Email"]',
  campoTipoDocumentoSelect: '[data-cy="campo-tipo-documento-select"]',
  campoNumeroDocumentoInput: '[data-cy="campo-numero-documento-input"]',
  senha: "#senha",
  campoConfirmarSenhaInput: '[data-cy="campo-confirmar-senha-input"]',
  cbCadastro: '[name="cb-cadastro"]',
  btnCriarConta: '[data-cy="btn-criar-conta"]',

  // Agendamento - inicial
  btnConsultaPresencial: '[data-cy="btn-consulta-presencial"]',
  convenioLabel: (id) => `[data-cy="convenio-label-${id}"]`,
  convenioRadio: (id) => `[data-cy="convenio-radio-${id}"]`,
  agendarAgendasList: '[data-cy="agendar-agendas-list"] .card',
  agendaItemHorarioTexto: '[data-cy^="agenda-item-horario-texto-"]',
  agendaProfissionalNome: '[data-cy="agenda-profissional-nome"]',
  agendaMainHeader: '[data-cy="agenda-main-header"]',

  // Paciente
  pacienteCardNome: '[data-cy="paciente-card-nome"]',

  // Confirmação
  confirmacaoEspecialidade: '[data-cy="confirmacao-especialidade"]',
  confirmacaoPaciente: '[data-cy="confirmacao-paciente"]',
  confirmacaoDatahora: '[data-cy="confirmacao-datahora"]',
  confirmacaoBtnConfirmar: '[data-cy="confirmacao-btn-confirmar"]',

  // Pagamento
  finalizacaoBtnTransferencia: '[data-cy="finalizacao-btn-transferencia"]',
  comprovante: "#comprovante",
  pagamentoFormTextareaObservacao:
    '[data-cy="pagamento-form-textarea-observacao"]',
  pagamentoFormBtnEnviar: '[data-cy="pagamento-form-btn-enviar"]',
  pagamentoConfirmLink: '[data-cy="pagamento-confirm-link"]',
};

export { BASE_URL, MAP_SEXO, SELECTORS };

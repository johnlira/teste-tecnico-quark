import { faker } from "@faker-js/faker/locale/pt_BR";
import generateCPF from "./generate-CPF";

export default function generatePerson() {
  // CPF
  const CPF = generateCPF();
  // Seletor de SEXO
  const n = Math.floor(Math.random() * 10) + 1;
  const sex = n <= 4 ? "female" : n <= 9 ? "male" : "undefined";
  // Nome completo
  const name = faker.person.fullName({
    sex: sex === "undefined" ? undefined : sex,
  });
  // Data de nascimento
  const birth = faker.date
    .birthdate()
    .toLocaleDateString("pt-BR", { timeZone: "UTC" })
    .toString();
  // Telefone
  const phone = faker.phone.number({ style: "international" });
  // O método da const clean é remover acentos, unir os nomes gerados pelo faker e remover prefixos. Há casos, como o nome núbia, que gera o e-mail com acento ou  gera nomes como Srta. Ana e isso não funcionaria na validação.
  const clean = name
    .replace(/\b(srta|sra|sr|jr)\.?/gi, "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z]/g, "")
    .toLowerCase();
  // Como não há uma validação específica para provedores de e-mail, coloquei um e-mail padrão para diminuir o uso de recursos.
  const email = `${clean}@example-test.com`;
  // Assim como no campo de e-mail, verifiquei que o site não possui validação de senha, então deixei padrão.
  const passwd = faker.internet.password();
  // obj user
  const user = { sex, name, birth, phone, email, passwd, CPF };
  return user;
}

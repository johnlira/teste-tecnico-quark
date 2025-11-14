import { faker } from "@faker-js/faker/locale/pt_BR";
import generateCPF from "./generate-CPF";

export default function generatePerson() {
  const CPF = generateCPF();
  const n = Math.floor(Math.random() * 10) + 1;
  const sex = n <= 4 ? "female" : n <= 9 ? "male" : "undefined";
  const name = faker.person.fullName({
    sex: sex === "undefined" ? undefined : sex,
  });
  const birth = faker.date
    .birthdate()
    .toLocaleDateString("pt-BR", { timeZone: "UTC" })
    .toString();
  const phone = faker.phone.number({ style: "international" });
  const clean = name
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, "")
    .toLowerCase();
  // O método da const clean é remover acentos e unir os nomes gerados pelo faker. Há casos, como o nome núbia, que gera o e-mail com acento e isso não funcionaria.
  const email = `${clean}@example-test.com`;
  // Como não há uma validação específica para provedores de e-mail, coloquei um e-mail padrão para diminuir o uso de recursos.
  const passwd = faker.internet.password();
  // Assim como no campo de e-mail, verifiquei que o site não possui validação de senha, então deixei padrão.
  const user = { sex, name, birth, phone, email, passwd, CPF };
  return user;
}

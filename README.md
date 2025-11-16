# Desafio Técnico - Estágio QA - Automação (Quark - ESIG Group)

Este repositório contém a minha solução para o desafio técnico de automação de testes  com Cypress do processo seletivo para Estágio QA.

O projeto automatiza testes para fluxos de: Cadastro, login, agendamento de consulta e envio de comprovante.

---
## Pré-requisitos

É necessário possuir o [Node.js](https://nodejs.org/en/) instalado. Utilizei a ultima versão LTS.

## Dependências 

* [Cypress](http://cypress.io/) para automação dos testes.
* [Faker.js](https://fakerjs.dev/) para criação de dados "fakes" para testes.
## Instalação

1.  Clone este repositório:

```bash
 git clone https://github.com/johnliradev/teste-tecnico-quark
```

2.  Navegue até o diretório do projeto:
```bash
    cd teste-tecnico-quark
```

3.  Instale as dependências necessárias (Cypress e Faker):
```bash
    npm install
```


---

## Executando os Testes

Você pode executar os testes de duas maneiras:

#### 1. Modo Interativo (Recomendado para visualizar)

Este comando abre o Test Runner do Cypress, permitindo que você veja o navegador executar cada passo:

No terminal: 
```bash
npx cypress open
```
Irá abrir a página do Cypress. 
1. Clique em E2E Testing
2. Selecione seu Browser favorito (utilizei o chrome para desenvolvimento)
3. Clique em "Start E2E Testing in Chrome"
4. No navegador que irá abrir, selecione a aba "Specs" e depois clique no arquivo **spec.cy.js**
5. Os testes irão rodar automaticamente. Você conseguira ver cada detalhe da automação 


#### 2. Modo automático via terminal
Este comando executa o teste automaticamente pelo seu terminal, ao final do teste é apresentado uma table com os resultados dos testes. 

No terminal: 
```bash
npx cypress run
```

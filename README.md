# PicPay - Frontend Challenge

# O desafio
O desafio consiste em desenvolver uma aplicação com um login, e um dashboard com um CRUD com paginação, filtro e ordenaçao de colunas (ASC/DESC).

## Setup do projeto

- Angular CLI: 19.0.0
- Node: 20.15.0
- Angular: 19.0.0

## Rodando o projeto

### Rodando o projeto localmente

Está sendo utilizado um mock de API para simular o backend da aplicação. Para rodar o projeto localmente, siga os passos abaixo:
#### Instalando o json-server

```bash
#Instalando o json-server para rodar a API
$ npm install -g json-server
```

#### Rodando o projeto

```bash
# Instalando dependências
$ npm install

# Rodando o API
$ npm run mock

# Rodando o projeto
$ npm start

# O projeto estará disponível em http://localhost:4200
# A API está disponível em http://localhost:3030
```

### Rodando o projeto com Docker

```bash
# Rodando o projeto
$ docker-compose up -D

# O projeto estará disponível em http://localhost:4200
# A API está disponível em http://localhost:3030
```

### Instalando Cypress

Caso seja necessario, consulte a documentação do cypress para instalação de pacotes necessarios para a execução do mesmo.

[Documentação de instalação do Cypress](https://docs.cypress.io/app/get-started/install-cypress)


### Rodando os testes

Todos os comandos de teste estão configurados para rodar em modo headless.

```bash
# Testes unitários
$ npm run test:headless

# Testes e2e
$ npm run cy:run
```

## Estrutura do projeto

```
src /
|-- app /
|   |-- core /
|   |   |-- guard /
|   |   |-- interceptors /
|   |   |-- DTO /
|   |-- pages /
|   |   |-- login /
|   |   |-- dashboard /
|   |-- shared /
|   |   |-- delete-payment-modal /
|   |   |-- interfaces /
|   |   |-- services /
|   |   |-- loading /
|   |   |-- paginator /
|   |   |-- task-modal /
|   |   |-- top-bar /
```

#### Bibliotecas utilizadas

- Bootstrap 5
- moment.js
- cypress
- json-server
- Angular 19.0.0
- Jasmine + Karma

#### Screenshots

[Clique para ir para pasta de imagens](https://github.com/kaduufr/pp-challenge/tree/main/screenshots)


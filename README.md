# 🧪 Testes de Back-End — Programador Full-Stack

<div align="center">

![Node.js](https://img.shields.io/badge/Node.js-18%2B-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Jest](https://img.shields.io/badge/Jest-Testing%20Framework-C21325?style=for-the-badge&logo=jest&logoColor=white)
![NestJS](https://img.shields.io/badge/NestJS-Framework-E0234E?style=for-the-badge&logo=nestjs&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-In--Memory-47A248?style=for-the-badge&logo=mongodb&logoColor=white)
![Supertest](https://img.shields.io/badge/Supertest-HTTP%20Testing-brightgreen?style=for-the-badge)

<p align="center">
  <b>Repositório prático de estudos e projetos da disciplina de Testes de Back-End.</b><br>
  Abrange desde os fundamentos de testes unitários até testes de integração e persistência de dados.
</p>

</div>

---

## 📑 Sumário (Índice Geral)

- [🎯 Visão Geral](#-visão-geral)
- [🏛️ A Pirâmide de Testes](#️-a-pirâmide-de-testes)
- [📂 Navegação Rápida pelas Pastas](#-navegação-rápida-pelas-pastas)
- [📖 Detalhamento dos Módulos](#-detalhamento-dos-módulos)
  - [1. Aula 02 — Fundamentos de Testes Unitários com Jest](#1-aula-02--fundamentos-de-testes-unitários-com-jest)
  - [2. Aula 02 (Parte 02) — Casos de Teste, IEEE 754 e Relato de Bugs](#2-aula-02-parte-02--casos-de-teste-ieee-754-e-relato-de-bugs)
  - [3. Aula 03 — Dublês de Teste (Mocks, Stubs e Spies)](#3-aula-03--dublês-de-teste-mocks-stubs-e-spies)
  - [4. Aula 04 — Testes de Integração com NestJS e Supertest](#4-aula-04--testes-de-integração-com-nestjs-e-supertest)
  - [5. Aula 05 — Testes de Persistência com Mongoose e Banco em Memória](#5-aula-05--testes-de-persistência-com-mongoose-e-banco-em-memória)
  - [6. Aula 06 — Testes de Middleware, Autenticação JWT e RBAC](#6-aula-06--testes-de-middleware-autenticação-jwt-e-rbac)
- [🛠️ Tecnologias e Bibliotecas](#️-tecnologias-e-bibliotecas)
- [🚀 Como Executar o Repositório](#-como-executar-o-repositório)
- [🧬 Conceitos Fundamentais](#-conceitos-fundamentais)
  - [Erro vs. Defeito vs. Falha](#erro-vs-defeito-vs-falha)
  - [Tipos de Dublês de Teste](#tipos-de-dublês-de-teste)
- [✨ Boas Práticas Adotadas](#-boas-práticas-adotadas)

---

## 🎯 Visão Geral

Este repositório reúne o conjunto de práticas desenvolvidas durante o módulo de **Testes de Back-End** do curso **Programador Full-Stack Petrobrás2026/27 (SENAI)**. O objetivo principal é capacitar o desenvolvedor a escrever código resiliente, seguro e de alta qualidade, dominando as diferentes camadas e estratégias de testes automatizados no ecossistema Node.js / TypeScript.

---

## 🏛️ A Pirâmide de Testes

Ao longo das aulas, o repositório caminha por todas as principais camadas da pirâmide de testes de software:

```text
               / \
              /   \        E2E / Ponta a Ponta (Fluxos completos do sistema)
             /-----\
            /       \      Integração & Segurança (Aula 04: HTTP/DTO, Aula 05: BD, Aula 06: Auth/RBAC)
           /---------\
          /           \    Unitários (Aula 02 e 03: Funções puras, Services, Mocks)
         /_____________\
```

---

## 📂 Navegação Rápida pelas Pastas

Clique nos links abaixo para navegar diretamente para a pasta de cada aula no repositório:

| Pasta | Descrição | Foco Principal |
| :--- | :--- | :--- |
| 📁 [**Aula02**](./Aula02) | Fundamentos de Testes Unitários | Sintaxe básica do Jest, asserções (`expect`), matchers e Babel. |
| 📁 [**Aula02Parte02**](./Aula02Parte02) | Matriz de Testes & Depuração | Casos de teste estruturados (CT-NN), IEEE 754 e relatório de defeitos. |
| 📁 [**Aula03**](./Aula03) | Mocks e Dublês de Teste | Isolamento de camadas (`jest.mock`, `jest.fn`, `mockResolvedValue`). |
| 📁 [**Aula04**](./Aula04) | Testes de Integração com NestJS | Testes de rotas HTTP com Supertest, validação de DTOs e Pipes. |
| 📁 [**Aula05**](./Aula05) | Persistência com Mongoose | Validação de Schemas, Hooks (pre-save) e `mongodb-memory-server`. |
| 📁 [**Aula06**](./Aula06) | Middlewares & Autenticação | Validação de Token JWT (`401`), Perfis de Acesso RBAC (`403`) e Sanitização. |

---

## 📖 Detalhamento dos Módulos

### 1. [Aula 02](./Aula02) — Fundamentos de Testes Unitários com Jest

Foco na introdução ao framework **Jest** e configuração de transpilador **Babel** para uso de módulos ES6 (`import`/`export`).

* **Estrutura interna:**
  * `src/calculadora/`: Operações aritméticas básicas e suíte de comparações.
  * `src/pedidos/`: Regras de cálculo de total de pedidos, descontos e frete.
  * `src/usuarios/`: Validação de idade e permissões de acesso.
* **Comandos rápidos:**
  ```bash
  cd Aula02
  npm install
  npm test
  ```

---

### 2. [Aula 02 (Parte 02)](./Aula02Parte02) — Casos de Teste, IEEE 754 e Relato de Bugs

Aborda o planejamento formal de testes, elaboração de matriz de casos de teste (**CT-NN**), identificação de bugs e resolução de problemas clássicos de ponto flutuante em computação.

* **Destaques:**
  * **Problema de Ponto Flutuante (IEEE 754):** Ajuste em testes com números decimais (`0.1 + 0.2`).
  * **Módulos Testados:**
    * `src/boletim/`: Cálculo de médias escolares e verificação de aprovação.
    * `src/frequencia/`: Cálculo de percentual de presença com resolução de defeito de borda (`< 75%`).
    * `src/permissoes/`: Regras de autorização de perfis de usuário.
  * Documentação detalhada em [Aula02Parte02/README.md](./Aula02Parte02/README.md).
* **Comandos rápidos:**
  ```bash
  cd Aula02Parte02
  npm install
  npm test
  ```

---

### 3. [Aula 03](./Aula03) — Dublês de Teste (Mocks, Stubs e Spies)

Ensina a testar a regra de negócio da aplicação (**Service layer**) sem depender de serviços externos reais, rede ou banco de dados MongoDB em execução.

* **Conceitos explorados:**
  * **Test Doubles:** Stub, Spy, Mock e Fake.
  * Funções utilitárias do Jest: `jest.mock()`, `jest.fn()`, `mockResolvedValue()`, `toHaveBeenCalledWith()`.
  * **O Ciclo de 4 Passos do Teste:** Mock $\rightarrow$ Stubbing $\rightarrow$ Execução $\rightarrow$ Verificação.
* **Arquivos-chave:**
  * `src/usuarios.repository.js`: Simulação da camada de persistência.
  * `src/usuarios.service.js`: Lógica de cadastro e busca com regras de negócio.
  * `src/usuarios.service.test.js`: Testes unitários isolados com mocks.
* **Documentação:** [Aula03/README.md](./Aula03/README.md).
* **Comandos rápidos:**
  ```bash
  cd Aula03
  npm install
  npm test
  npm run test:watch
  ```

---

### 4. [Aula 04](./Aula04) — Testes de Integração com NestJS e Supertest

Foco em testar como os componentes reais da aplicação conversam entre si (Controller + Service + Repository + Pipes de Validação), simulando requisições HTTP reais sem subir portas externas.

* **Conceitos explorados:**
  * Uso de `Test.createTestingModule` para compilar módulos completos em memória.
  * Requisições HTTP com **Supertest** (`POST`, `GET`).
  * Validações globais com `ValidationPipe` e `ParseIntPipe`.
  * Detecção de inconsistências de interface/contrato entre camadas.
* **Documentação:** [Aula04/README.md](./Aula04/README.md).
* **Comandos rápidos:**
  ```bash
  cd Aula04
  npm install
  npm run test:unit  # Executa testes unitários
  npm run test:int   # Executa testes de integração com Supertest
  npm test           # Executa toda a suíte
  ```

---

### 5. [Aula 05](./Aula05) — Testes de Persistência com Mongoose e Banco em Memória

Foco na validação da última linha de defesa da aplicação: o **Schema e Model do Mongoose** conectado a um banco MongoDB real em memória via `mongodb-memory-server`.

* **Regras validadas:**
  * Campos obrigatórios (`required: true`).
  * Validações numéricas mínimas (`min: 0`).
  * Restrições de domínio com listas enumeradas (`enum: [...]`).
  * Hooks/Middlewares de ciclo de vida (`pre('save')`).
  * Chaves únicas e índices (`unique: true` / erro `code: 11000`).
* **Ciclo de vida dos testes:**
  * `beforeAll()`: Sobe a instância do MongoDB em memória RAM.
  * `afterEach()`: Limpa a base (`deleteMany({})`) garantindo isolamento total entre os testes.
  * `afterAll()`: Desconecta e finaliza o servidor em memória.
* **Documentação:** [Aula05/README.md](./Aula05/README.md).
* **Comandos rápidos:**
  ```bash
  cd Aula05
  npm install
  npm test
  npm run test:watch
  ```

---

### 6. [Aula 06](./Aula06) — Testes de Middleware, Autenticação JWT e RBAC

Foco em testes de **segurança de APIs REST**, validação de middlewares no Express, autenticação via **JSON Web Token (JWT)** e autorização por perfil (**RBAC - Role-Based Access Control**).

* **Estrutura interna:**
  * `src/middlewares/auth.middleware.js`: Extração e validação do token Bearer, assinatura e expiração (`401 Unauthorized`).
  * `src/middlewares/role.middleware.js`: Controle de permissões por perfil de usuário (`403 Forbidden`).
  * `src/app.js`: Endpoints públicos (`/login`), protegidos (`/usuarios`, `/perfil`) e restritos a administradores (`DELETE /produtos/:id`).
  * `test/auth-middleware.spec.js`: Cobertura completa de fluxos sem token, token inválido, token expirado, perfil insuficiente (`USER` vs `ADMIN`) e não vazamento de senhas.
* **Documentação:** [Aula06/README.md](./Aula06/README.md).
* **Comandos rápidos:**
  ```bash
  cd Aula06
  npm install
  npm test
  npm run test:watch
  ```

---

## 🛠️ Tecnologias e Bibliotecas

| Categoria | Tecnologias Utilizadas |
| :--- | :--- |
| **Linguagens & Runtime** | Node.js (v18+), JavaScript (ES6+), TypeScript |
| **Frameworks de Teste** | Jest, Supertest |
| **Frameworks Web** | Express, NestJS (Common, Core, Testing, Platform-Express) |
| **Segurança & Autenticação** | JSON Web Token (`jsonwebtoken`), RBAC (Role-Based Access Control) |
| **Banco de Dados & ORM/ODM** | MongoDB, Mongoose, mongodb-memory-server |
| **Compilação & Tipagem** | Babel, TypeScript Compiler (`tsc`) |
| **Validação** | class-validator, class-transformer |

---

## 🚀 Como Executar o Repositório

### 1. Clonar o repositório
```bash
git clone https://github.com/EderRosso/Teste-de-Back-end.git
cd Teste-de-Back-end
```

### 2. Executar os testes por aula
Cada pasta de aula é um projeto Node.js independente contendo seu próprio `package.json`. Para executar:

```bash
# Para a Aula 02
cd Aula02 && npm install && npm test && cd ..

# Para a Aula 02 (Parte 02)
cd Aula02Parte02 && npm install && npm test && cd ..

# Para a Aula 03
cd Aula03 && npm install && npm test && cd ..

# Para a Aula 04 (NestJS + Integração)
cd Aula04 && npm install && npm test && cd ..

# Para a Aula 05 (Mongoose + Persistência)
cd Aula05 && npm install && npm test && cd ..

# Para a Aula 06 (Middlewares + JWT + RBAC)
cd Aula06 && npm install && npm test && cd ..
```

---

## 🧬 Conceitos Fundamentais

### Erro vs. Defeito vs. Falha
* **Erro (Engano Humano):** Ação humana incorreta do programador (ex.: esquecer de tratar uma conversão de tipos).
* **Defeito / Bug (No Código):** A anomalia estática presente no código-fonte em decorrência do erro.
* **Falha (Execução):** O comportamento incorreto manifestado dinamicamente durante a execução do software (ex.: status HTTP `404` em vez de `200`).

### Tipos de Dublês de Teste
| Dublê | Finalidade | Exemplo |
| :--- | :--- | :--- |
| **Dummy** | Objeto passado apenas para preencher parâmetros obrigatórios. | Objeto vazio `{}` |
| **Stub** | Retorna dados pré-programados estáticos para chamadas específicas. | `mockResolvedValue({ id: 1, nome: "Ana" })` |
| **Spy** | Espiona e registra chamadas, argumentos e retornos sem alterar comportamento. | `expect(repo.save).toHaveBeenCalledWith(...)` |
| **Mock** | Objeto programado com comportamento e expectativas estritas de validação. | `jest.mock('./repository')` |
| **Fake** | Implementação funcional simplificada para testes. | Banco de dados ou array em memória |

---

## ✨ Boas Práticas Adotadas

1. **Testes Independentes e Determinísticos:** Nenhum teste depende da execução ou do estado deixado por outro teste.
2. **Padrão AAA (Arrange, Act, Assert):**
   * **Arrange (Preparação):** Configuração de dados, mocks e estado inicial.
   * **Act (Ação):** Execução do método ou requisição sob teste.
   * **Assert (Verificação):** Validação dos resultados e das asserções de saída.
3. **Limpeza Adequada de Recursos:** Uso rigoroso de `afterEach` e `afterAll` (`app.close()`, `mongoose.disconnect()`) para evitar vazamentos de memória e conexões abertas no Jest.
4. **Isolamento de Camadas:** Testes unitários para regras puras e testes de integração/persistência para validação de fluxos reais e contratos.

---

<div align="center">

Desenvolvido para fins de estudo no curso **Programador Full-Stack — SENAI**.  
*Qualidade de software começa com testes bem planejados!*

</div>

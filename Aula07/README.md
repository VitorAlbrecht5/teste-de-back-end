# Aula 07 — Testes de Sistema (E2E) e Testes de Aceitação

Projeto didático desenvolvido para o curso de **Testes de Back-End (SENAI)**, demonstrando testes de ponta a ponta (**End-to-End / E2E**) utilizando **Node.js, Express, Jest e Supertest**.

---

## 🎯 Pergunta Central da Aula

> **"Se cada parte funciona separadamente (unitários/integração), o sistema inteiro funciona durante uma jornada real?"**

---

## 🧭 O Fluxo da Jornada (E2E)

```text
       [ 1. POST /login ]
              ↓ (Obtém o JWT)
   [ 2. GET /produtos/1 ] (com Bearer Token)
              ↓ (Verifica estoque inicial: 10)
      [ 3. POST /vendas ] (com Bearer Token)
              ↓ (Compra 1 unidade -> Status 201)
   [ 4. GET /produtos/1 ] (com Bearer Token)
              ↓ (Consulta o estoque atualizado)
   [ 5. expect(estoqueDepois).toBe(estoqueAntes - 1) ]
              ↓ (Confirma estoque final: 9)
           ✓ TESTE PASSOU
```

---

## 📁 Estrutura de Arquivos

```text
Aula07/
│
├── src/
│   ├── app.js               # Configuração do Express e definição das rotas
│   ├── dados.js             # Banco de dados em memória e função de reset
│   └── middleware/
│       └── auth.js          # Validação do cabeçalho Authorization: Bearer <token>
│
├── test/
│   └── sistema.e2e.test.js  # Jornada completa de testes E2E
│
├── package.json             # Dependências e script de teste
└── README.md                # Guia completo da aula
```

---

## 🚀 Como Executar

### 1. Instalar as dependências
```bash
npm install
```

### 2. Executar os testes
```bash
npm test
```

### 3. Executar em modo observador (Watch Mode)
```bash
npm run test:watch
```

---

## 📋 Critérios de Aceitação Validados

| Requisito | Critério de Aceite | Onde é testado no E2E? |
| :--- | :--- | :--- |
| Autenticação | Usuário deve possuir token válido | `POST /login` e `set('Authorization', ...)` |
| Consulta | Deve retornar o produto e seu estoque | `GET /produtos/1` -> status 200 |
| Realizar Venda | Deve registrar a compra e baixar estoque | `POST /vendas` -> status 201 |
| Consistência | O estoque final deve ser `estoqueAntes - 1` | `expect(depois.body.estoque).toBe(estoqueAntes - 1)` |
| Exceção | Não deve vender sem estoque suficiente | `POST /vendas` com qtd 99 -> status 400 |

# Testes de Back-End — Aula 09: Técnicas de Caixa Branca e Caixa Preta com Jest

Projeto didático e executável desenvolvido para a disciplina de **Testes de Back-End** no SENAI.

O objetivo principal desta aula é ensinar **como selecionar casos de teste de maneira sistemática e profissional**, utilizando as clássicas técnicas de **Caixa Preta** (*Partição de Equivalência*, *Análise de Valor Limite* e *Tabela de Decisão*) e de **Caixa Branca** (*Cobertura de Código/Branches* e *Testes de Mutação*), superando a prática ingênua de escrever testes aleatórios.

---

## Sumário

1. [Visão Geral e Tecnologias](#1-visão-geral-e-tecnologias)
2. [Estrutura do Projeto](#2-estrutura-do-projeto)
3. [Regra de Negócio e Código-Base](#3-regra-de-negócio-e-código-base)
4. [Parte 1 — Caixa Preta: Partição de Equivalência](#4-parte-1--caixa-preta-partição-de-equivalência)
5. [Parte 2 — Caixa Preta: Análise de Valor Limite (BVA)](#5-parte-2--caixa-preta-análise-de-valor-limite-bva)
6. [Parte 3 — Caixa Preta: Tabela de Decisão](#6-parte-3--caixa-preta-tabela-de-decisão)
7. [Parte 4 — Caixa Branca: Análise Estrutural do Código](#7-parte-4--caixa-branca-análise-estrutural-do-código)
8. [Parte 5 — Code Coverage com Jest](#8-parte-5--code-coverage-com-jest)
9. [Parte 6 — Introdução aos Testes de Mutação](#9-parte-6--introdução-aos-testes-de-mutação)
10. [Passo a Passo de Instalação e Execução](#10-passo-a-passo-de-instalação-e-execução)
11. [Atividade Prática para os Alunos](#11-atividade-prática-para-os-alunos)
12. [Gabarito da Atividade do Aluno](#12-gabarito-da-atividade-do-aluno)
13. [Explicação Linha por Linha de Conceitos Fundamentais](#13-explicação-linha-por-linha-de-conceitos-fundamentais)
14. [Solução de Dúvidas e Erros Comuns](#14-solução-de-dúvidas-e-erros-comuns)

---

## 1. Visão Geral e Tecnologias

Utilizamos intencionalmente uma stack direta, sem camadas complexas (como frameworks web ou bancos de dados), para que o foco total do aluno seja na lógica de testes:

- **Node.js** (Ambiente de execução JavaScript no servidor)
- **Jest** (Framework de testes e geração de relatórios de cobertura)
- **CommonJS** (`require` e `module.exports` nativos do Node)

---

## 2. Estrutura do Projeto

```text
Aula09/
├── src/
│   └── emprestimo.js          # Implementação da regra de negócio
├── tests/
│   └── emprestimo.test.js     # Suíte de testes (Caixa Preta + Caixa Branca)
├── .gitignore                 # Arquivos ignorados pelo Git (node_modules, coverage)
├── package.json               # Configuração do projeto e scripts Jest
├── package-lock.json          # Versões exatas das dependências instaladas
└── README.md                  # Documentação completa e guia da aula
```

---

## 3. Regra de Negócio e Código-Base

Implementamos o módulo de **Validação de Empréstimo Simples**. Trata-se de um exemplo puramente didático para estudo de testes e cobertura de código.

### Regras de Negócio:
1. A idade do solicitante deve ser **maior ou igual a 18 anos**.
2. A idade do solicitante deve ser **menor ou igual a 65 anos**.
3. O valor da parcela mensal deve ser **menor ou igual a 30%** do salário do solicitante.
4. Se **todas** as condições forem satisfeitas, a função retorna `true`.
5. Se **qualquer** condição falhar, a função retorna `false`.

### Arquivo: `src/emprestimo.js`

```javascript
function validarEmprestimo(salario, idade, valorParcela) {

    if (idade < 18 || idade > 65) {
        return false;
    }

    if (valorParcela > salario * 0.30) {
        return false;
    }

    return true;
}

module.exports = { validarEmprestimo };
```

---

## 4. Parte 1 — Caixa Preta: Partição de Equivalência

### O que é a técnica?
Na técnica de **Partição de Equivalência** (ou Classes de Equivalência), dividimos o domínio de dados de entrada em grupos (partições) em que todos os valores de um mesmo grupo são processados de forma similar pelo sistema.

### Por que usamos?
- Não é viável nem inteligente testar todas as idades possíveis (0, 1, 2, 3... 120 anos).
- Se a função se comporta corretamente para a idade `30`, supõe-se que ela se comportará de forma idêntica para `31`, `40` ou `50`.
- Escolhendo **um único representante** de cada classe (uma válida e duas inválidas), reduzimos drasticamente o número de testes sem perder eficácia.

### Mapeamento das Partições de Idade:

| Partição | Tipo | Representante Escolhido | Resultado Esperado | Justificativa |
|---|---|---|---|---|
| Menor que 18 | Inválida | **15** | `false` | Solicitante menor de idade |
| Entre 18 e 65 | Válida | **30** | `true` (com parcela válida) | Faixa etária permitida |
| Maior que 65 | Inválida | **70** | `false` | Solicitante acima da idade permitida |

### Testes Jest — Partição de Equivalência:

```javascript
describe('1. Partição de Equivalência (Idade)', () => {
    test('Partição Inválida (Menor de idade): deve rejeitar idade = 15', () => {
        const resultado = validarEmprestimo(3000, 15, 600);
        expect(resultado).toBe(false);
    });

    test('Partição Válida (Faixa permitida): deve aprovar idade = 30 com parcela válida', () => {
        const resultado = validarEmprestimo(3000, 30, 600);
        expect(resultado).toBe(true);
    });

    test('Partição Inválida (Acima da faixa): deve rejeitar idade = 70', () => {
        const resultado = validarEmprestimo(3000, 70, 600);
        expect(resultado).toBe(false);
    });
});
```

---

## 5. Parte 2 — Caixa Preta: Análise de Valor Limite (BVA)

### Por que as fronteiras são críticas?
Estatística e historicamente no desenvolvimento de software, a esmagadora maioria dos defeitos lógicos ocorre **nas bordas** (*off-by-one errors*):
- O programador confundiu `<` com `<=`?
- O sistema aceita o limite exato ou rejeita?

A técnica de **Análise de Valor Limite** (*Boundary Value Analysis*) testa exatamente a borda e seus vizinhos imediatos (Limite - 1, Limite Exato, Limite + 1).

### Fronteiras de Idade (Salário = R$ 3.000, Parcela = R$ 600):

| Idade | Posição no Limite | Resultado Esperado | O que valida |
|---|---|---|---|
| **17** | Limite Inferior - 1 (Externo) | `false` | Garante que menores imediatos não entram |
| **18** | Limite Inferior Exato | `true` | Garante que quem tem 18 anos completos é aceito |
| **19** | Limite Inferior + 1 (Interno) | `true` | Garante estabilidade logo acima do início |
| **64** | Limite Superior - 1 (Interno) | `true` | Garante estabilidade logo abaixo do teto |
| **65** | Limite Superior Exato | `true` | Garante que quem tem 65 anos completos é aceito |
| **66** | Limite Superior + 1 (Externo) | `false` | Garante que acima de 65 anos seja rejeitado |

### Fronteira Financeira (Salário = R$ 3.000, 30% = R$ 900):

| Parcela | Posição no Limite | Resultado Esperado | O que valida |
|---|---|---|---|
| **R$ 899** | Limite - 1 (Abaixo de 30%) | `true` | Parcela permitida |
| **R$ 900** | Limite Exato (Exatamente 30%) | `true` | **Valor no limite deve ser aceito** |
| **R$ 901** | Limite + 1 (Acima de 30%) | `false` | Parcela excede a margem permitida |

### Testes Jest — Análise de Valor Limite:

```javascript
describe('2. Análise de Valor Limite (Fronteiras de Idade)', () => {
    test('Fronteira inferior externa: deve rejeitar idade de 17 anos (18 - 1)', () => {
        expect(validarEmprestimo(3000, 17, 600)).toBe(false);
    });

    test('Fronteira inferior exata: deve aceitar idade de 18 anos (limite exato)', () => {
        expect(validarEmprestimo(3000, 18, 600)).toBe(true);
    });

    test('Fronteira inferior interna: deve aceitar idade de 19 anos (18 + 1)', () => {
        expect(validarEmprestimo(3000, 19, 600)).toBe(true);
    });

    test('Fronteira superior interna: deve aceitar idade de 64 anos (65 - 1)', () => {
        expect(validarEmprestimo(3000, 64, 600)).toBe(true);
    });

    test('Fronteira superior exata: deve aceitar idade de 65 anos (limite exato)', () => {
        expect(validarEmprestimo(3000, 65, 600)).toBe(true);
    });

    test('Fronteira superior externa: deve rejeitar idade de 66 anos (65 + 1)', () => {
        expect(validarEmprestimo(3000, 66, 600)).toBe(false);
    });
});

describe('2. Análise de Valor Limite (Fronteira Financeira - Parcela)', () => {
    const salario = 3000;

    test('Fronteira financeira interna: deve aprovar parcela de R$ 899 (abaixo de 30%)', () => {
        expect(validarEmprestimo(salario, 30, 899)).toBe(true);
    });

    test('Fronteira financeira exata: deve aprovar parcela de R$ 900 (exatamente 30%)', () => {
        expect(validarEmprestimo(salario, 30, 900)).toBe(true);
    });

    test('Fronteira financeira externa: deve rejeitar parcela de R$ 901 (acima de 30%)', () => {
        expect(validarEmprestimo(salario, 30, 901)).toBe(false);
    });
});
```

---

## 6. Parte 3 — Caixa Preta: Tabela de Decisão

### Por que utilizar a Tabela de Decisão?
Quando regras de negócio envolvem múltiplas condições combinadas, é muito fácil o desenvolvedor esquecer cenários cruzados (por exemplo: testar apenas se a idade é inválida e esquecer de testar o caso onde **ambas** as regras falham simultaneamente).

A **Tabela de Decisão** mapeia matematicamente todas as combinações booleanas possíveis ($2^n$ combinações, onde $n$ é o número de condições).

### Tabela com as 4 Combinações:

| Caso | Idade Válida? | Parcela Válida? | Cenário de Teste (Salário / Idade / Parcela) | Resultado Esperado |
|---|---|---|---|---|
| **C1** | Sim | Sim | Salário: R$ 3.000, Idade: 25, Parcela: R$ 500 | `true` |
| **C2** | Sim | Não | Salário: R$ 3.000, Idade: 25, Parcela: R$ 1.200 (40%) | `false` |
| **C3** | Não | Sim | Salário: R$ 3.000, Idade: 16, Parcela: R$ 500 | `false` |
| **C4** | Não | Não | Salário: R$ 3.000, Idade: 75, Parcela: R$ 1.500 (50%) | `false` |

### Testes Jest — Tabela de Decisão:

```javascript
describe('3. Tabela de Decisão (Combinação de Condições)', () => {
    test('Regra 1 [Idade Válida / Parcela Válida]: deve retornar true', () => {
        expect(validarEmprestimo(3000, 25, 500)).toBe(true);
    });

    test('Regra 2 [Idade Válida / Parcela Inválida]: deve retornar false', () => {
        expect(validarEmprestimo(3000, 25, 1200)).toBe(false);
    });

    test('Regra 3 [Idade Inválida / Parcela Válida]: deve retornar false', () => {
        expect(validarEmprestimo(3000, 16, 500)).toBe(false);
    });

    test('Regra 4 [Idade Inválida / Parcela Inválida]: deve retornar false', () => {
        expect(validarEmprestimo(3000, 75, 1500)).toBe(false);
    });
});
```

---

## 7. Parte 4 — Caixa Branca: Análise Estrutural do Código

Ao contrário da Caixa Preta (que olha apenas entradas e saídas segundo os requisitos), a **Caixa Branca** inspeciona a estrutura interna do código-fonte.

### Análise das Decisões no Código:

1. **Decisão 1:** `if (idade < 18 || idade > 65)`
   - Possui duas condições atômicas ligadas pelo operador lógico OU (`||`).
   - Se `idade < 18` for verdadeiro $\rightarrow$ executa o branch de retorno `false`.
   - Se `idade > 65` for verdadeiro $\rightarrow$ executa o branch de retorno `false`.
   - Se ambas forem falsas $\rightarrow$ o fluxo segue para a Decisão 2.

2. **Decisão 2:** `if (valorParcela > salario * 0.30)`
   - Avalia se o valor da parcela compromete mais de 30% da renda.
   - Se verdadeiro $\rightarrow$ executa o branch de retorno `false`.
   - Se falso $\rightarrow$ o fluxo alcança a linha final: `return true`.

### Fluxograma Estrutural:

```text
                     [ INÍCIO ]
                         |
                         v
           +---------------------------+
           | Idade < 18 OU Idade > 65? |
           +---------------------------+
                     /       \
              SIM  /           \  NÃO
                 v               v
           +-----------+   +-------------------------------+
           | Retornar  |   | Parcela > Salário * 30% (0.3)? |
           |  false    |   +-------------------------------+
           +-----------+             /            \
                              SIM  /                \  NÃO
                                 v                    v
                           +-----------+        +-----------+
                           | Retornar  |        | Retornar  |
                           |  false    |        |   true    |
                           +-----------+        +-----------+
```

### Conceitos Essenciais de Caixa Branca:

- **Instrução (*Statement*):** Cada linha ou comando executável (ex: `return false;`).
- **Decisão (*Decision*):** Uma estrutura condicional inteira (ex: `if (...)`).
- **Ramo (*Branch*):** Cada uma das bifurcações que uma decisão pode tomar (o caminho *Verdadeiro* e o caminho *Falso* de um `if`).
- **Caminho de Execução (*Path*):** A sequência completa de instruções percorridas desde o início da função até o seu encerramento.

> [!IMPORTANT]
> **Atenção:** Ter 100% de *Branch Coverage* não significa ter testado todos os *caminhos* possíveis nem todas as combinações lógicas de variáveis. Em sistemas complexos com múltiplos `if` encadeados e laços `for/while`, a quantidade de caminhos possíveis cresce exponencialmente.

---

## 8. Parte 5 — Code Coverage com Jest

### Como executar o relatório de cobertura:

```bash
npm run test:coverage
```

### O que significa cada métrica no Jest?

| Métrica | Nome | Significado |
|---|---|---|
| **% Stmts** | Statements | Percentual de instruções executáveis executadas ao menos uma vez. |
| **% Branch** | Branches | Percentual de ramificações (`if/else`, operador ternário, `||`, `&&`) exercitadas em ambos os sentidos (*true* e *false*). |
| **% Funcs** | Functions | Percentual de funções declaradas que foram invocadas. |
| **% Lines** | Lines | Percentual de linhas de código que foram executadas. |
| **Uncovered Line #s** | Linhas Não Cobertas | Indica os números das linhas que nunca foram executadas nos testes. |

---

### Demonstração Progressiva de Cobertura (Realizada no Terminal):

#### Etapa A — Executando apenas os 3 testes de Partição de Equivalência:

Comando:
```bash
npx jest -t "Partição de Equivalência" --coverage
```

Resultado obtido:
```text
---------------|---------|----------|---------|---------|-------------------
File           | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s 
---------------|---------|----------|---------|---------|-------------------
All files      |   83.33 |    83.33 |     100 |   83.33 |                   
 emprestimo.js |   83.33 |    83.33 |     100 |   83.33 | 22                
---------------|---------|----------|---------|---------|-------------------
```
*Diagnóstico da Etapa A:* A linha que rejeita parcela abusiva (`valorParcela > salario * 0.30`) não foi exercitada com valor inválido nesses 3 testes iniciais, deixando a cobertura de branches e linhas incompleta (83.33%).

---

#### Etapa B — Acrescentando a Bateria Completa (Valores Limite e Tabela de Decisão):

Comando:
```bash
npm run test:coverage
```

Resultado obtido:
```text
PASS tests/emprestimo.test.js
  Validação de Empréstimo - Técnicas de Caixa Preta e Caixa Branca
    1. Partição de Equivalência (Idade)
      √ Partição Inválida (Menor de idade): deve rejeitar idade = 15 (2 ms)
      √ Partição Válida (Faixa permitida): deve aprovar idade = 30 com parcela válida (1 ms)
      √ Partição Inválida (Acima da faixa): deve rejeitar idade = 70
    2. Análise de Valor Limite (Fronteiras de Idade)
      √ Fronteira inferior externa: deve rejeitar idade de 17 anos (18 - 1)
      √ Fronteira inferior exata: deve aceitar idade de 18 anos (limite exato)
      √ Fronteira inferior interna: deve aceitar idade de 19 anos (18 + 1)
      √ Fronteira superior interna: deve aceitar idade de 64 anos (65 - 1) (1 ms)
      √ Fronteira superior exata: deve aceitar idade de 65 anos (limite exato)
      √ Fronteira superior externa: deve rejeitar idade de 66 anos (65 + 1)
    2. Análise de Valor Limite (Fronteira Financeira - Parcela)
      √ Fronteira financeira interna: deve aprovar parcela de R$ 899 (abaixo de 30%) (1 ms)
      √ Fronteira financeira exata: deve aprovar parcela de R$ 900 (exatamente 30%)
      √ Fronteira financeira externa: deve rejeitar parcela de R$ 901 (acima de 30%)
    3. Tabela de Decisão (Combinação de Condições)
      √ Regra 1 [Idade Válida / Parcela Válida]: deve retornar true (1 ms)
      √ Regra 2 [Idade Válida / Parcela Inválida]: deve retornar false
      √ Regra 3 [Idade Inválida / Parcela Válida]: deve retornar false
      √ Regra 4 [Idade Inválida / Parcela Inválida]: deve retornar false

---------------|---------|----------|---------|---------|-------------------
File           | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s 
---------------|---------|----------|---------|---------|-------------------
All files      |     100 |      100 |     100 |     100 |                   
 emprestimo.js |     100 |      100 |     100 |     100 |                   
---------------|---------|----------|---------|---------|-------------------
Test Suites: 1 passed, 1 total
Tests:       16 passed, 16 total
Snapshots:   0 total
Time:        1.745 s
Ran all test suites.
```

> [!CAUTION]
> **Frase de Ouro da Engenharia de Software:**
> **"100% de cobertura de código NÃO significa ausência de bugs."**
> O *Coverage* apenas diz por quais linhas o teste passou; ele não garante que você testou todas as regras de negócio, dados corrompidos, concorrência ou valores de fronteira corretos.

---

## 9. Parte 6 — Introdução aos Testes de Mutação

O **Teste de Mutação** (*Mutation Testing*) avalia a **qualidade dos seus testes**. Ele insere pequenas alterações propositais (defeitos/mutações) no código-fonte e verifica se a sua suíte de testes é capaz de detectar o defeito ("matar o mutante").

### Demonstração Prática:

#### 1. Código Correto Original:
```javascript
if (idade < 18 || idade > 65) {
    return false;
}
```

#### 2. Código Mutado (Introduzindo defeito de operador `<=`):
```javascript
if (idade <= 18 || idade > 65) {
    return false;
}
```
*Efeito do defeito:* Agora, uma pessoa com **18 anos completos** será incorretamente rejeitada!

#### 3. Executando o teste com o mutante ativo:
Ao rodar `npm test`, o seguinte teste falha imediatamente:

```javascript
test('Fronteira inferior exata: deve aceitar idade de 18 anos (limite exato)', () => {
    expect(validarEmprestimo(3000, 18, 600)).toBe(true);
});
```

**Saída de erro capturada pelo Jest:**
```text
● Fronteira inferior exata: deve aceitar idade de 18 anos (limite exato)

  expect(received).toBe(expected) // Object.is equality

  Expected: true
  Received: false

    43 |         test('Fronteira inferior exata: deve aceitar idade de 18 anos (limite exato)', () => {
  > 44 |             expect(validarEmprestimo(3000, 18, 600)).toBe(true);
       |                                                      ^
    45 |         });
```

*Conclusão da Mutação:* O mutante foi **morto** com sucesso! Isso prova que nosso teste de valor limite para a idade 18 anos é robusto e eficaz. Se tivéssemos apenas o teste de partição de equivalência (com idade 30), esse bug passaria totalmente despercebido.

---

## 10. Passo a Passo de Instalação e Execução

### No Terminal do VS Code (PowerShell / Windows):

1. Acesse a pasta da aula:
   ```bash
   cd Aula09
   ```

2. Inicialize o projeto Node.js (caso esteja criando do zero):
   ```bash
   npm init -y
   ```

3. Instale o Jest como dependência de desenvolvimento:
   ```bash
   npm install --save-dev jest
   ```

4. Verifique os scripts configurados no `package.json`:
   ```json
   "scripts": {
     "test": "jest",
     "test:coverage": "jest --coverage"
   }
   ```

5. Execute todos os testes:
   ```bash
   npm test
   ```

6. Execute a análise completa de cobertura:
   ```bash
   npm run test:coverage
   ```

---

## 11. Atividade Prática para os Alunos

**Objetivo:** Praticar a seleção sistemática de casos de teste em uma nova regra de negócio.

### Cenário da Atividade:
Você foi encarregado de implementar e testar a função `validarDesconto(valorCompra, cupom, ehPrimeiraCompra)`.

**Regras:**
1. A compra mínima para ter desconto é de **R$ 100,00** (inclusive).
2. Se o cliente tiver o cupom `"PROMO10"` **OU** for sua `ehPrimeiraCompra === true`, ele recebe o desconto (retorna `true`).
3. Caso a compra seja inferior a R$ 100,00 ou não possua nenhum dos benefícios, não há desconto (retorna `false`).

### Tarefas do Aluno:
1. Identificar **3 partições de equivalência** para o valor da compra.
2. Criar **4 testes de valores limite** para o valor da compra (limite de R$ 100,00).
3. Criar uma **tabela de decisão** com as combinações de `cupom` e `ehPrimeiraCompra`.
4. Executar o relatório de **Coverage** e obter 100% nas métricas.
5. Introduzir um defeito proposital no código (ex: trocar `>= 100` por `> 100`).
6. Demonstrar qual teste falhou (pegou a mutação) e restaurar o código original.

---

## 12. Gabarito da Atividade do Aluno

### 1. Implementação do Código: `src/desconto.js`

```javascript
function validarDesconto(valorCompra, cupom, ehPrimeiraCompra) {
    // Regra 1: Valor mínimo
    if (valorCompra < 100) {
        return false;
    }

    // Regra 2: Benefício de cupom ou primeira compra
    if (cupom === 'PROMO10' || ehPrimeiraCompra === true) {
        return true;
    }

    return false;
}

module.exports = { validarDesconto };
```

### 2. Testes Completos: `tests/desconto.test.js`

```javascript
const { validarDesconto } = require('../src/desconto');

describe('Atividade Prática - Validação de Desconto', () => {

    // 1. Partições de Equivalência (Valor da Compra)
    describe('Partições de Equivalência', () => {
        test('Partição Inválida (Abaixo de 100): compra de R$ 50 deve retornar false', () => {
            expect(validarDesconto(50, 'PROMO10', false)).toBe(false);
        });

        test('Partição Válida (Acima de 100 com cupom): compra de R$ 250 deve retornar true', () => {
            expect(validarDesconto(250, 'PROMO10', false)).toBe(true);
        });
    });

    // 2. Análise de Valor Limite (Fronteira dos R$ 100,00)
    describe('Análise de Valor Limite (Borda de R$ 100,00)', () => {
        test('Limite - 1 centavo: R$ 99.99 deve retornar false', () => {
            expect(validarDesconto(99.99, 'PROMO10', false)).toBe(false);
        });

        test('Limite Exato: R$ 100.00 deve retornar true', () => {
            expect(validarDesconto(100.00, 'PROMO10', false)).toBe(true);
        });

        test('Limite + 1 centavo: R$ 100.01 deve retornar true', () => {
            expect(validarDesconto(100.01, 'PROMO10', false)).toBe(true);
        });

        test('Limite Zero: R$ 0.00 deve retornar false', () => {
            expect(validarDesconto(0.00, 'PROMO10', false)).toBe(false);
        });
    });

    // 3. Tabela de Decisão (Cupom vs Primeira Compra para compra de R$ 150)
    describe('Tabela de Decisão', () => {
        test('Cupom Válido + Primeira Compra Sim -> true', () => {
            expect(validarDesconto(150, 'PROMO10', true)).toBe(true);
        });

        test('Cupom Válido + Primeira Compra Não -> true', () => {
            expect(validarDesconto(150, 'PROMO10', false)).toBe(true);
        });

        test('Sem Cupom + Primeira Compra Sim -> true', () => {
            expect(validarDesconto(150, 'OUTRO', true)).toBe(true);
        });

        test('Sem Cupom + Primeira Compra Não -> false', () => {
            expect(validarDesconto(150, 'OUTRO', false)).toBe(false);
        });
    });
});
```

### 3. Simulação de Mutação:
- Altere `if (valorCompra < 100)` para `if (valorCompra <= 100)`.
- Ao rodar `npm test`, o teste `Limite Exato: R$ 100.00 deve retornar true` falhará, capturando o defeito.

---

## 13. Explicação Linha por Linha de Conceitos Fundamentais

Para alunos iniciantes em programação e testes:

- `function`: Palavra reservada do JavaScript usada para declarar uma função (um bloco de código reutilizável que executa uma tarefa).
- **Parâmetros (`salario, idade, valorParcela`)**: Variáveis de entrada que a função recebe ao ser chamada.
- `if`: Estrutura condicional ("SE"). Executa o bloco `{}` apenas se a condição entre parênteses for verdadeira (`true`).
- `||` (Operador Lógico OU): Retorna `true` se **pelo menos uma** das expressões for verdadeira. Ex: `idade < 18 || idade > 65`.
- Operadores de Comparação:
  - `<` (Menor que) e `>` (Maior que): Comparações estritas (excluem o número comparado).
  - `<=` (Menor ou igual) e `>=` (Maior ou igual): Comparações inclusivas (incluem o limite).
- `return`: Interrompe a execução da função imediatamente e envia um valor de volta para quem a chamou.
- `module.exports`: Padrão do Node.js (CommonJS) para exportar funções e objetos de um arquivo para que outros arquivos possam usá-los.
- `require('./caminho')`: Comando do Node.js usado para importar módulos exportados por outros arquivos.
- `describe('nome do grupo', () => { ... })`: Função do Jest usada para agrupar testes relacionados em blocos organizados.
- `test('descrição', () => { ... })`: Função do Jest que define um caso de teste individual.
- `expect(valorRecebido)`: Função de asserção do Jest que recebe o valor produzido pelo código sob teste.
- `.toBe(valorEsperado)`: Correspondente (*matcher*) do Jest que verifica se o valor recebido é estritamente igual ao esperado (`===`).

---

## 14. Solução de Dúvidas e Erros Comuns

### 1. `ReferenceError: require is not defined` ou erro de módulo ES
- **Causa:** O `package.json` está com `"type": "module"`.
- **Solução:** No `package.json`, remova a linha `"type": "module"` para utilizar o padrão nativo CommonJS com `require` e `module.exports`.

### 2. `jest: command not found` ou `O termo 'jest' não é reconhecido`
- **Causa:** O Jest foi instalado localmente na pasta, mas tentou-se rodar `jest` diretamente no terminal do Windows sem o npm.
- **Solução:** Use sempre os comandos via npm: `npm test` ou `npm run test:coverage` (ou `npx jest`).

### 3. Erro ao executar scripts no PowerShell (`ExecutionPolicy`)
- **Causa:** Política restritiva de execução de scripts no Windows.
- **Solução:** Execute no PowerShell como administrador:
  ```powershell
  Set-ExecutionPolicy -Scope CurrentUser -ExecutionPolicy RemoteSigned
  ```

### 4. `Cannot find module '../src/emprestimo'`
- **Causa:** Caminho relativo incorreto no `require`.
- **Solução:** Como o arquivo de teste está dentro da pasta `tests/`, deve-se subir um nível com `../` para acessar `../src/emprestimo`.

---

## Conclusão e Boas Práticas

| Técnica | Visão | Principal Vantagem | Quando Usar |
|---|---|---|---|
| **Partição de Equivalência** | Caixa Preta | Reduz drasticamente a quantidade de testes necessários | Em todas as entradas numéricas ou categorizadas |
| **Análise de Valor Limite** | Caixa Preta | Detecta erros clássicos de fronteira e operadores relacionais | Em campos com intervalos, idades, salários, tamanhos |
| **Tabela de Decisão** | Caixa Preta | Evita esquecer combinações complexas de regras de negócio | Em regras com múltiplos `if` e condições combinadas |
| **Code Coverage** | Caixa Branca | Identifica código morto e caminhos lógicos não testados | Como métrica de qualidade contínua no CI/CD |
| **Teste de Mutação** | Caixa Branca | Mede a verdadeira eficácia e assertividade dos testes | Para validar a força da sua suíte de testes |

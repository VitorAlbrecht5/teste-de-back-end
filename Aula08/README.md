# 🚀 Aula 08 — Automação de Testes de Back-End: Code Coverage, CI e GitHub Actions

Projeto didático e guia pedagógico passo a passo desenvolvido para o curso de **Testes de Back-End (SENAI)**.

Destinado a alunos iniciantes que já compreendem JavaScript, Node.js e Jest, e agora estão sendo apresentados aos pilares da **Integração Contínua (CI)**, **Cobertura de Código (Code Coverage)** e **Execução Automatizada via GitHub Actions**.

---

## 🎯 Pergunta Central da Aula

> **"Como garantir que nenhum código quebrado vá para produção sem depender da memória do desenvolvedor para rodar os testes?"**

---

## 🧭 O Ciclo de Vida da Automação

```text
[ 1. Código Local ] ──(npm test / coverage)──► [ 2. Git Commit & Push ]
                                                        │
                                                        ▼
                                            [ 3. GitHub Actions ]
                                            ├── Checkout do código
                                            ├── Setup do Node.js
                                            ├── npm ci (instalação limpa)
                                            └── npm test (execução remota)
                                                        │
                         ┌──────────────────────────────┴──────────────────────────────┐
                         ▼                                                             ▼
                🟢 Pipeline Verde (Pass)                                      🔴 Pipeline Vermelho (Fail)
              (Código seguro para merge)                                   (Deploy bloqueado / Bug detectado)
```

---

## 📁 Estrutura do Projeto

```text
aula08-automacao/
├── src/
│   └── calculadora.js          # Funções de negócio (soma, subtração, validação de idade)
├── tests/
│   └── calculadora.test.js     # Suíte de testes unitários com Jest
├── .github/
│   └── workflows/
│       └── testes.yml          # Workflow de Integração Contínua (GitHub Actions)
├── .gitignore                  # Arquivos ignorados pelo Git (node_modules, coverage)
├── package.json                # Configuração do projeto e scripts npm
└── README.md                   # Documentação completa da aula
```

---

## 🛠️ Tecnologias Utilizadas

- **Node.js** (Ambiente de execução)
- **JavaScript (CommonJS)** (`module.exports` e `require`)
- **Jest** (Framework de testes e gerador de relatórios de cobertura)
- **Git** (Controle de versão local)
- **GitHub & GitHub Actions** (Repositório remoto e esteira de CI/CD automatizada)

*(Sem dependências adicionais como Express, Babel ou TypeScript, focando 100% no fluxo de automação e cobertura).*

---

## 📦 1. Inicialização do Projeto do Zero

Se você estiver iniciando a aula a partir de uma pasta vazia no terminal:

```bash
# 1. Criar a pasta e entrar nela
mkdir aula08-automacao
cd aula08-automacao

# 2. Inicializar o package.json padrão
npm init -y

# 3. Instalar o Jest como dependência de desenvolvimento
npm install --save-dev jest

# 4. Criar a estrutura de diretórios
mkdir src tests .github .github/workflows
```

### Arquivo: `package.json`

Configuração simplificada contendo os scripts de execução:

```json
{
  "name": "aula08-automacao",
  "version": "1.0.0",
  "description": "Projeto didático de introdução a Code Coverage, CI e GitHub Actions",
  "main": "src/calculadora.js",
  "scripts": {
    "test": "jest",
    "test:coverage": "jest --coverage"
  },
  "devDependencies": {
    "jest": "^29.7.0"
  }
}
```

### Arquivo: `.gitignore`

```text
node_modules/
coverage/
.DS_Store
*.log
```

---

## 💻 2. Código Fonte da Aplicação

### Arquivo: `src/calculadora.js`

```javascript
function somar(a, b) {
    return a + b;
}

function subtrair(a, b) {
    return a - b;
}

function verificarIdade(idade) {
    if (idade >= 18) {
        return "Maior de idade";
    } else {
        return "Menor de idade";
    }
}

module.exports = {
    somar,
    subtrair,
    verificarIdade
};
```

---

## 🧪 3. Primeira Versão dos Testes (Cobertura Parcial Intencional)

Para demonstrar o funcionamento e a importância do Code Coverage, iniciamos testando apenas **metade** dos comportamentos da calculadora:

### Arquivo: `tests/calculadora.test.js` (Versão Inicial)

```javascript
const { somar, verificarIdade } = require('../src/calculadora');

describe('Testes da Calculadora (Versão Inicial - Cobertura Parcial)', () => {
    test('Deve somar 2 + 3 e retornar 5', () => {
        expect(somar(2, 3)).toBe(5);
    });

    test('Deve verificar que 20 anos é maior de idade', () => {
        expect(verificarIdade(20)).toBe('Maior de idade');
    });
});
```

---

## 📊 4. Executando e Interpretando o Code Coverage

Execute no terminal:

```bash
npm test -- --coverage
# ou: npm run test:coverage
```

### 📋 Resultado do Relatório no Terminal

```text
PASS tests/calculadora.test.js
  Testes da Calculadora (Versão Inicial - Cobertura Parcial)
    √ Deve somar 2 + 3 e retornar 5 (3 ms)
    √ Deve verificar que 20 anos é maior de idade (1 ms)

----------------|---------|----------|---------|---------|-------------------
File            | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s 
----------------|---------|----------|---------|---------|-------------------
All files       |   66.66 |       50 |   66.66 |   66.66 |                   
 calculadora.js |   66.66 |       50 |   66.66 |   66.66 | 6,13              
----------------|---------|----------|---------|---------|-------------------
Test Suites: 1 passed, 1 total
Tests:       2 passed, 2 total
Snapshots:   0 total
Time:        1.245 s
Ran all test suites.
```

---

### 🔍 O que cada coluna do relatório significa?

| Métrica | Significado Didático | Onde prestar atenção no exemplo? |
| :--- | :--- | :--- |
| **`% Stmts` (Statements)** | Porcentagem de declarações/comandos executados pelos testes. | Ficou em **66.66%** porque a linha dentro de `subtrair` e a linha do `else` não rodaram. |
| **`% Branch` (Ramificações)** | Porcentagem de caminhos lógicos testados em estruturas de decisão (`if/else`, `switch`, ternários). | Ficou em **50%** porque só exercitamos o `if (idade >= 18)` verdadeiro; o caminho `else` nunca foi executado. |
| **`% Funcs` (Functions)** | Porcentagem de funções declaradas que foram invocadas ao menos uma vez. | Ficou em **66.66%** porque `somar` e `verificarIdade` foram chamadas, mas `subtrair` foi ignorada. |
| **`% Lines` (Linhas)** | Porcentagem de linhas executáveis de código que foram visitadas. | Ficou em **66.66%**. |
| **`Uncovered Line #s`** | **Números exatos das linhas do arquivo que NUNCA foram executadas.** | Linhas **6** (`return a - b;`) e **13** (`return "Menor de idade";`). |

> 💡 **Alerta Pedagógico Essencial:**
> **100% de Coverage NÃO significa ausência de bugs!**
> O Coverage mede **código que foi exercitado**, e não se as asserções (`expect`) foram bem escritas ou se cobrem regras de negócio complexas.

---

## 🎯 5. Versão Completa dos Testes (100% de Cobertura)

Agora atualizamos o arquivo `tests/calculadora.test.js` para cobrir todos os fluxos e caminhos (`branches`):

```javascript
const { somar, subtrair, verificarIdade } = require('../src/calculadora');

describe('Testes da Calculadora (Versão Completa - 100% de Cobertura)', () => {
    test('Deve somar 2 + 3 e retornar 5', () => {
        expect(somar(2, 3)).toBe(5);
    });

    test('Deve subtrair 10 - 4 e retornar 6', () => {
        expect(subtrair(10, 4)).toBe(6);
    });

    test('Deve verificar que 20 anos é maior de idade (caminho if)', () => {
        expect(verificarIdade(20)).toBe('Maior de idade');
    });

    test('Deve verificar que 15 anos é menor de idade (caminho else)', () => {
        expect(verificarIdade(15)).toBe('Menor de idade');
    });
});
```

Ao executar `npm test -- --coverage` novamente:

```text
----------------|---------|----------|---------|---------|-------------------
File            | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s 
----------------|---------|----------|---------|---------|-------------------
All files       |     100 |      100 |     100 |     100 |                   
 calculadora.js |     100 |      100 |     100 |     100 |                   
----------------|---------|----------|---------|---------|-------------------
```

---

## ⚙️ 6. GitHub Actions — Automação na Nuvem (CI)

### Arquivo: `.github/workflows/testes.yml`

```yaml
name: Pipeline de Testes Automatizados

on:
  push:
    branches: [ "main", "master" ]
  pull_request:
    branches: [ "main", "master" ]

jobs:
  executar-testes:
    runs-on: ubuntu-latest

    steps:
      - name: 1. Baixar código do repositório (Checkout)
        uses: actions/checkout@v4

      - name: 2. Configurar ambiente Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'npm'

      - name: 3. Instalar dependências de forma limpa
        run: npm ci

      - name: 4. Executar bateria de testes com Jest
        run: npm test
```

---

### 📖 Explicação Linha por Linha do YAML

- **`name`**: Nome de exibição da esteira/pipeline na aba **Actions** do GitHub.
- **`on`**: Eventos que disparam o workflow automaticamente. Configurado para `push` (envio de commits) e `pull_request` (propostas de merge) nas branches `main` e `master`.
- **`jobs`**: Conjunto de tarefas que serão executadas. No nosso caso, o job `executar-testes`.
- **`runs-on: ubuntu-latest`**: Define a máquina virtual (Runner gerenciado pelo GitHub) onde o job rodará. Usamos a versão estável mais recente do Linux Ubuntu.
- **`steps`**: Lista sequencial de passos executados dentro da máquina virtual:
  - **`uses: actions/checkout@v4`**: Ação oficial do GitHub que clona o código do seu repositório para dentro da máquina virtual.
  - **`uses: actions/setup-node@v4`**: Instala e configura a versão 20 do Node.js na máquina virtual e habilita o cache do `npm` para acelerar execuções futuras.
  - **`run: npm ci`**: Comando do npm projetado para ambientes de CI (*Clean Install*). Instala exatamente as versões travadas no `package-lock.json`, de forma mais rápida, segura e determinística do que `npm install`.
  - **`run: npm test`**: Dispara o Jest dentro do servidor do GitHub. Se algum teste falhar, o Jest encerra com código de erro diferente de zero (`exit code 1`), fazendo o GitHub Actions marcar o pipeline como **vermelho (falha)**.

---

## 🌐 7. Publicando no GitHub e Visualizando o Pipeline

### Passo 1: Inicializar o Git Localmente
```bash
git init
git add .
git commit -m "feat: projeto inicial com testes e pipeline de CI"
```

### Passo 2: Criar o Repositório no GitHub e Enviar
```bash
# Vincular ao seu repositório remoto (exemplo com sua URL):
git remote add origin https://github.com/SEU_USUARIO/aula08-automacao.git
git branch -M main
git push -u origin main
```

### Passo 3: Onde visualizar no GitHub?
1. Abra seu repositório no navegador no GitHub.
2. Clique na aba **Actions** no menu superior.
3. Você verá o workflow `Pipeline de Testes Automatizados` em execução com um círculo amarelo (rodando) e em seguida um ícone **verde (✓ Passed)**.
4. Clique no workflow e depois no job `executar-testes` para inspecionar os logs de cada step em tempo real.

---

## 💥 8. Demonstração Prática de Falha (Simulando um Bug)

Para demonstrar o valor real do CI:

### 1. No arquivo `src/calculadora.js`, altere intencionalmente a soma para subtração:

```javascript
// BUG INTENCIONAL PARA AULA
function somar(a, b) {
    return a - b; // Era a + b
}
```

### 2. Sem rodar os testes localmente, comite e envie para o GitHub:

```bash
git add src/calculadora.js
git commit -m "refactor: alterando lógica da soma (bug intencional)"
git push
```

### 3. O que acontece no GitHub Actions?
1. O GitHub detecta o `push` e inicia um novo runner.
2. No passo **4. Executar bateria de testes com Jest**, o Jest falha com:
   ```text
   ● Testes da Calculadora › Deve somar 2 + 3 e retornar 5
     Expected: 5
     Received: -1
   ```
3. O step falha e a esteira é interrompida com um ícone **vermelho (❌ Failed)**.
4. Ninguém precisa adivinhar: o próprio GitHub notifica o desenvolvedor por e-mail e bloqueia a integração.

### 4. Corrigindo o Bug:
1. Volte em `src/calculadora.js` e restaure `return a + b;`.
2. Execute `git commit -am "fix: corrige calculo da soma"` e `git push`.
3. Veja a esteira voltar ao estado **verde (✓ Passed)**!

---

## 🐕 9. Complemento: Husky vs. GitHub Actions

| Critério | 🐕 Husky (Git Hooks Locais) | ☁️ GitHub Actions (CI Centralizado) |
| :--- | :--- | :--- |
| **Onde roda?** | Na máquina do desenvolvedor (local). | Nos servidores/runners do GitHub (nuvem). |
| **Quando roda?** | No momento do `git commit` ou `git push` local (`pre-commit` / `pre-push`). | Após o código ser enviado para o repositório remoto (`push`, `pull_request`). |
| **Objetivo** | *Feedback ultrarrápido*. Impede que o desenvolvedor crie um commit quebrado localmente. | *Garantia definitiva de qualidade*. Valida de forma neutra, segura e padronizada para todo o time. |
| **Pode ser burlado?** | Sim, com `git commit --no-verify`. | **Não.** Ninguém consegue burlar o runner do GitHub em um Pull Request protegido. |

### Configuração Moderna do Husky (Versão Atual):
```bash
# 1. Instalar husky
npm install --save-dev husky

# 2. Inicializar configuração (cria a pasta .husky/)
npx husky init

# 3. Adicionar o hook de pre-commit para rodar os testes
echo "npm test" > .husky/pre-commit
```


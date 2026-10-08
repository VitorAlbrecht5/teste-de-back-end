# 🧪 Aula 05: Testes de Persistência com Mongoose e Jest

> **Objetivo da Aula:**  
> *"Hoje vamos descobrir se o nosso Model realmente impede que dados errados cheguem ao MongoDB."*

---

## 🎯 Por que testar a camada de persistência?

Mesmo que Controllers e Services estejam funcionando e contenham lógica de negócio, a camada de persistência (**Model / Schema**) é a **última linha de defesa** da integridade dos dados no banco.

```text
Controller
    ↓
 Service
    ↓
Repository / Model (Mongoose Schema) 👈 HOJE
    ↓
 MongoDB (Banco de Dados)
```

---

## 📦 Estrutura do Projeto

```text
Aula05/
├── src/
│   └── produto.model.js        # Definição do Schema, validações e hooks (pre-save)
├── test/
│   └── produto.model.spec.js   # Suíte de testes com mongodb-memory-server
├── package.json                # Dependências e scripts de teste
└── README.md                   # Roteiro da aula e documentação
```

---

## 🚀 Como Rodar os Exemplos

1. **Instalar as dependências:**
   ```bash
   cd Aula05
   npm install
   ```

2. **Executar os testes com Jest:**
   ```bash
   npm test
   ```

3. **Executar em modo contínuo (Watch Mode):**
   ```bash
   npm run test:watch
   ```

---

## 🔬 O que cada teste valida?

| Cenário | Regra no Schema | Comportamento Esperado |
|---|---|---|
| **1. Sucesso (Happy Path)** | Todos os campos válidos | Salva com `_id`, `createdAt` e campos persistidos. |
| **2. Campo Obrigatório** | `nome: { required: true }` | Dispara `ValidationError` caso `nome` falte. |
| **3. Preço Negativo** | `preco: { min: [0, ...] }` | Rejeita `.save()` para valores menores que zero. |
| **4. Categoria Restrita** | `categoria: { enum: [...] }` | Rejeita valores fora de `['informatica', 'moveis', 'acessorios']`. |
| **5. Middleware (Hook)** | `produtoSchema.pre('save', ...)` | Converte o nome em caixa alta (`TECLADO`) antes de salvar. |
| **6. Unicidade (SKU)** | `sku: { unique: true }` | MongoDB rejeita duplicata com erro `code: 11000`. |

---

## 💡 Conceito-Chave: Ciclo de Vida dos Testes

```text
beforeAll()      ➜ Sobe o MongoDB em memória (RAM) e conecta o Mongoose
     ↓
  [TESTE 1]
     ↓
afterEach()      ➜ Limpa a collection (deleteMany({})) para isolar os testes
     ↓
  [TESTE 2]
     ↓
afterEach()      ➜ Limpa novamente
     ↓
afterAll()       ➜ Desconecta o Mongoose e desliga o MongoDB em memória
```

---

## ❓ Perguntas para Debate em Sala

1. **"Por que limpar o banco (`afterEach`) depois de cada teste?"**  
   *Resposta:* Para garantir isolamento e independência entre os testes.
2. **"Se o teste espera que o Mongoose rejeite um produto inválido e ele realmente rejeita, o teste passou ou falhou?"**  
   *Resposta:* O teste **passou**, pois o comportamento esperado do sistema era justamente barrar a operação.
3. **"Qual a diferença entre erro de validação do Mongoose (`ValidationError`) e erro de índice único (`code: 11000`)?"**  
   *Resposta:* O primeiro é verificado pela biblioteca em JavaScript antes do envio; o segundo é imposto pelo próprio mecanismo de indexação do MongoDB.

# 🧪 Aula 03: Mocks e Dublês de Teste no Back-End

> **Curso:** Programador Full-Stack — Firjan SENAI / SENAI CRTI  
> **Módulo:** Testes de Back-End  
> **Tecnologias:** Node.js, Jest

---

## 🎯 Objetivo da Aula
Aprender a testar regras de negócio no Back-End de forma **isolada**, **rápida** e **segura**, sem precisar de banco de dados (MongoDB) ou serviços externos rodando.

---

## 💡 Por que usamos Dublês de Teste (Test Doubles)?

Imagine que você está programando um sistema de pagamento via Pix:
* Você faria transferências com **dinheiro real** a cada teste?
* Se a internet cair ou o banco sair do ar, o seu código local está errado?

Assim como no cinema usamos **dublês** para cenas perigosas ou caras, no desenvolvimento de software usamos **Dublês de Teste** para substituir dependências pesadas (banco de dados, APIs externas, envio de e-mails) por substitutos controlados.

### 🎭 Os Tipos de Dublês
| Dublê | Para que serve? | Exemplo no dia a dia |
| :--- | :--- | :--- |
| **Stub** | Fornece respostas prontas e fixas. | *"Quando pedir o usuário X, devolva esses dados aqui."* |
| **Spy (Espião)** | Grava como a função foi chamada. | *"Quantas vezes foi chamado? Com quais argumentos?"* |
| **Mock** | Objeto pré-programado com regras e expectativas. | Simula um módulo ou serviço completo. |
| **Fake** | Implementação simplificada funcional. | Um array em memória fingindo ser o banco. |

---

## 🛠️ As 4 Ferramentas Principais do Jest

1. **`jest.mock('./caminho')`** $\rightarrow$ Intercepta e simula um arquivo/módulo inteiro.
2. **`jest.fn()`** $\rightarrow$ Cria uma função simulada (fantoche).
3. **`mockResolvedValue(valor)`** $\rightarrow$ Simula o retorno de uma `Promise` (operações assíncronas/banco de dados).
4. **`expect(...).toHaveBeenCalledWith(param)`** $\rightarrow$ Verifica se o código enviou os parâmetros certos para a dependência.

---

## 🚀 Como Rodar o Projeto

### 1. Clonar o repositório e entrar na pasta:
```bash
git clone <URL_DO_REPOSITORIO>
cd Aula03
```

### 2. Instalar as dependências:
```bash
npm install
```

### 3. Rodar os testes:
```bash
# Execução única detalhada
npm test

# Modo de observação (reexecuta automaticamente ao salvar o arquivo)
npm run test:watch
```

---

## 📁 Estrutura do Projeto

```text
Aula03/
├── package.json
├── .gitignore
├── README.md
└── src/
    ├── usuarios.repository.js   # Simula o acesso ao banco MongoDB (dependência externa)
    ├── usuarios.service.js      # Contém a regra de negócio real da aplicação
    └── usuarios.service.test.js # Testes unitários com Mocks e Stubs
```

---

## 🔄 O Fluxo dos 4 Passos de um Teste com Mock

Todo teste com dublê segue uma sequência fixa e previsível:

1. **Mock:** Substitui o repositório real (`jest.mock('./usuarios.repository')`).
2. **Stubbing:** Programa a resposta que o dublê deve dar (`findOne.mockResolvedValue(...)`).
3. **Execução:** Chama a função real do Service (`service.buscarPorEmail(...)`).
4. **Verificação:** Valida o resultado final e as chamadas (`expect(...)`).

---

## 🏆 Desafio Prático (Mão na Massa)

Agora é a sua vez! No arquivo `src/usuarios.service.js`, adicione o método:

```javascript
async cadastrar(usuario) {
  const existe = await UsuariosRepository.findOne(usuario.email);
  if (existe) {
    throw new Error('E-mail já cadastrado');
  }
  return { ...usuario, status: 'ativo' };
}
```

Em seguida, abra o arquivo `src/usuarios.service.test.js` e crie os testes unitários cobrindo:
* ✅ **Caso de Sucesso:** Repositório retorna `null` (usuário não existe) $\rightarrow$ Service retorna o usuário com `status: 'ativo'`.
* ❌ **Caso de Erro:** Repositório retorna um usuário existente $\rightarrow$ Service lança erro `'E-mail já cadastrado'`.

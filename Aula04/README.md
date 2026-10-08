# 🧪 Aula 04: Testes de Integração com NestJS e Supertest

> **Curso:** Programador Full-Stack — Firjan SENAI / SENAI CRTI  
> **Módulo:** Testes de Back-End  
> **Tecnologias:** NestJS, Supertest, Jest, TypeScript  

---

## 🎯 Pergunta Disparadora da Aula

> **"Se todos os testes unitários passam com 100% de cobertura, o sistema está garantido de funcionar?"**

Na **Aula 03**, nós isolamos tudo usando mocks: o *Service* foi testado com o *Repository* fingido.  
Mas e se o *Controller* chamar o *Service* passando um tipo incompatível? E se o middleware ou o `ValidationPipe` do framework não estiver validando o body da requisição HTTP?

👉 **Nenhum teste unitário pega esse tipo de problema**, porque os testes unitários avaliam cada peça trancada em uma redoma de vidro.  
👉 **O Teste de Integração tira os dublês e coloca as peças reais para conversar!**

---

## 🧱 A Pirâmide de Testes e o Nosso Lugar Nela

```
          / \
         /   \        E2E / Ponta a Ponta (Poucos, lentos, caros)
        /-----\
       /       \      Integração (Hoje! Rota + Controller + Service + Repository)
      /---------\
     /           \    Unitários (Aula 02 & 03: Rápidos, isolados, com mocks)
    /_____________\
```

### ⚖️ Comparativo Direto: Unitário × Integração

| Critério | Teste Unitário (Aula 03) | Teste de Integração (Aula 04) |
| :--- | :--- | :--- |
| **Escopo** | Uma única função/classe isolada | Múltiplas camadas juntas (Controller + Service + Repository) |
| **Dependências** | Todas mockadas (`jest.fn()`, `mockResolvedValue`) | Dependências reais montadas no módulo |
| **Comunicação** | Chamada direta de método TypeScript/JS | Requisição HTTP real via **Supertest** (`POST`, `GET`) |
| **Velocidade** | Milissegundos | Um pouco mais lento (sobe a aplicação em memória) |
| **O que detecta?** | Erro na lógica interna do método | **Defeitos nas interfaces e contratos entre camadas** |

---

## 🧬 O Vocabulário da Disciplina: Erro → Defeito → Falha

1. **Erro (Ato Humano):** O desenvolvedor esqueceu de converter o parâmetro de rota `@Param('id')` para número ou esqueceu o `ValidationPipe`.
2. **Defeito / Bug:** A interface entre Controller e Service/Pipe está incompatível no código.
3. **Falha (Manifestação Dinâmica):** O teste de integração faz um `POST /tarefas` com dado inválido e recebe `201 Created` em vez de `400 Bad Request`.

---

## 🛠️ Como o NestJS monta Testes de Integração

Diferente do teste unitário, usamos o `Test.createTestingModule` para instanciar o **módulo real**:

```typescript
import { Test } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { TarefasModule } from '../src/tarefas/tarefas.module';

describe('Tarefas (Integração)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    // 1. Monta o módulo completo de verdade (SEM MOCKS)
    const moduleRef = await Test.createTestingModule({
      imports: [TarefasModule],
    }).compile();

    app = moduleRef.createNestApplication();

    // 2. Registra os pipes e transformadores globais
    app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
    
    // 3. Inicializa o pipeline HTTP do NestJS
    await app.init();
  });

  // 4. CRÍTICO: fecha a instância do app no final para não prender a porta/Jest
  afterAll(async () => {
    await app.close();
  });

  it('POST /tarefas cria e GET /tarefas lista a tarefa', async () => {
    // Simula uma requisição HTTP real usando Supertest
    await request(app.getHttpServer())
      .post('/tarefas')
      .send({ titulo: 'Estudar Testes' })
      .expect(201);

    const res = await request(app.getHttpServer())
      .get('/tarefas')
      .expect(200);

    expect(res.body).toEqual([
      expect.objectContaining({ titulo: 'Estudar Testes' }),
    ]);
  });
});
```

---

## ⚠️ Armadilhas Clássicas de Testes de Integração

1. **Esquecer `afterAll(() => app.close())`:** O processo do Jest fica pendurado indefinidamente.
2. **Esquecer `await` antes de `request(...)`:** O teste passa falso-positivo antes da assincronia resolver.
3. **Esquecer `app.useGlobalPipes(...)` no teste:** Pipes configurados no `main.ts` **não** são carregados automaticamente nos testes de integração. Se omitidos, o teste aceita payloads inválidos.

---

## 🚀 Como Executar o Projeto

```bash
# 1. Instalar as dependências
npm install

# 2. Rodar apenas os testes unitários (Aula 03 style)
npm run test:unit

# 3. Rodar os testes de integração (Supertest + NestJS)
npm run test:int

# 4. Rodar todos os testes
npm test
```

---

## 📋 Atividade Prática em Dupla: Matriz de Casos de Teste (CT-NN)

Preencham a tabela abaixo executando a suíte de integração e anotando os resultados obtidos:

| ID | Método | Rota | Payload / Parâmetros | Status Esperado | Resposta Esperada | Status Obtido | Situação (Passou/Falhou) |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **CT-01** | `POST` | `/tarefas` | `{"titulo": "Aprender Integração"}` | `201 Created` | Objeto com `id`, `titulo` e `concluida: false` | | |
| **CT-02** | `GET` | `/tarefas` | Nenhum | `200 OK` | Array contendo as tarefas cadastradas | | |
| **CT-03** | `POST` | `/tarefas` | `{"titulo": "Oi"}` *(curto)* | `400 Bad Request` | Mensagem de erro de tamanho mínimo | | |
| **CT-04** | `POST` | `/tarefas` | `{}` *(vazio)* | `400 Bad Request` | Mensagem de campo obrigatório | | |
| **CT-05** | `GET` | `/tarefas/:id` | `id = 1` *(existente)* | `200 OK` | Dados da tarefa 1 | | |
| **CT-06** | `GET` | `/tarefas/:id` | `id = 999` *(inexistente)* | `404 Not Found` | Mensagem de recurso não encontrado | | |
| **CT-07** | `GET` | `/tarefas/:id` | `id = "abc"` *(inválido)* | `400 Bad Request` | Erro de validação numérica | | |

---

## 🕵️ Desafio Prático: O Defeito Escondido na Interface

### Cenário:
Imagine que no arquivo `src/tarefas/tarefas.controller.ts`, alguém altere a rota `GET :id` removendo o `ParseIntPipe` e passando o `id` como `string` para o service:

```typescript
// CONTROLLER (com defeito de integração)
@Get(':id')
async buscarPorId(@Param('id') id: string) {
  return this.tarefasService.buscarPorId(id as any);
}
```

E no `TarefasRepository`, a comparação seja estrita (`===`):
```typescript
async buscarPorId(id: number): Promise<Tarefa | null> {
  // id recebido é string ("1"), mas t.id é número (1) -> "1" === 1 é FALSE!
  return this.tarefas.find((t) => t.id === id) || null;
}
```

### Missão da Dupla:
1. Observe que **o teste unitário do Service continua passando** (porque no teste unitário você passou `1` manualmente).
2. Execute o **teste de integração** (`npm run test:int`) e veja a **falha** acontecer na rota `GET /tarefas/1` (retorna 404 em vez de 200).
3. Preencham o **Relatório de Bug Estruturado** abaixo:

```markdown
### 📝 Relatório de Defeito (Bug Report)
- **Título do Bug:** 
- **Severidade:** (Alta / Média / Baixa)
- **Camadas Envolvidas:** (Controller ↔ Service ↔ Repository)
- **Passos para Reproduzir:** 
  1. Realizar POST /tarefas com payload {"titulo": "Comprar pão"}
  2. Realizar GET /tarefas/1
- **Resultado Esperado:** Retornar Status 200 com os dados da tarefa criada.
- **Resultado Obtido:** Retornou Status 404 ("Tarefa com ID 1 não encontrada").
- **Causa Raiz:** Incompatibilidade de tipos na interface (string recebida na rota HTTP vs number esperado na busca).
- **Correção Proposta:** Aplicar `ParseIntPipe` no `@Param('id')` do Controller.
```

---

## 🔮 Gancho para a Aula 05

> *"Hoje nosso repositório foi um array em memória. O que acontece quando trocarmos esse array por um banco de dados real como o **MongoDB** e o **Mongoose**? Como testamos sem poluir o banco de produção?"*

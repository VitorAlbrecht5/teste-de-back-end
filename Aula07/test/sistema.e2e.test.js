/**
 * TESTES DE SISTEMA (E2E) E TESTES DE ACEITAÇÃO
 * 
 * Pergunta central: "Se cada parte funciona separadamente, o sistema inteiro
 * funciona durante uma jornada real?"
 * 
 * Aqui testamos a aplicação de ponta a ponta (End-to-End):
 * Supertest -> HTTP -> Rota -> Middleware (JWT) -> Regra de Negócio -> Dados -> Resposta HTTP
 */

const request = require("supertest");
const app = require("../src/app");
const { resetarDados } = require("../src/dados");

describe("Testes de Sistema E2E - Jornada de Vendas", () => {

    /**
     * ISOLAMENTO DOS TESTES:
     * Antes de cada teste ser executado, restauramos a base de dados em memória.
     * Isso impede que o resultado de um teste interfira no teste seguinte.
     * Cada teste deve ser 100% independente!
     */
    beforeEach(() => {
        resetarDados();
    });

    // =========================================================================
    // CENÁRIO 1: FLUXO PRINCIPAL (CAMINHO FELIZ)
    // =========================================================================
    it("deve realizar uma venda e diminuir o estoque", async () => {

        // -------------------------------------------------------------
        // PASSO 1 — LOGIN
        // Simula o usuário acessando o sistema com suas credenciais.
        // -------------------------------------------------------------
        const login = await request(app)
            .post("/login")
            .send({
                email: "ana@email.com",
                senha: "123456"
            })
            .expect(200);

        // Extrai o JWT retornado pela API para autenticar as próximas requisições
        const token = login.body.token;
        console.log('Token:', token);
        expect(token).toBeDefined();

        // -------------------------------------------------------------
        // PASSO 2 — CONSULTAR ESTOQUE ANTES DA VENDA
        // Envia o cabeçalho "Authorization: Bearer <token>" simulando o cliente.
        // Guardamos o valor atual para comparar após a operação.
        // -------------------------------------------------------------
        const antes = await request(app)
            .get("/produtos/1")
            .set("Authorization", `Bearer ${token}`)
            .expect(200);

        const estoqueAntes = antes.body.estoque;
        console.log('Estoque antes:', estoqueAntes);

        // -------------------------------------------------------------
        // PASSO 3 — REALIZAR A VENDA
        // Dispara a requisição POST /vendas enviando o JWT e os dados da compra.
        // -------------------------------------------------------------
        await request(app)
            .post("/vendas")
            .set("Authorization", `Bearer ${token}`)
            .send({
                produtoId: 1,
                quantidade: 1
            })
            .expect(201);

        // -------------------------------------------------------------
        // PASSO 4 — CONSULTAR O PRODUTO NOVAMENTE
        // Fazemos uma nova consulta HTTP para verificar o estado real do banco.
        // -------------------------------------------------------------
        const depois = await request(app)
            .get("/produtos/1")
            .set("Authorization", `Bearer ${token}`)
            .expect(200);

        // -------------------------------------------------------------
        // PASSO 5 — VALIDAR O RESULTADO (EFEITO COLATERAL)
        // Regra de Negócio: "Estoque depois = Estoque antes - Quantidade comprada"
        // -------------------------------------------------------------
        console.log('Estoque depois:', depois.body.estoque);
        expect(depois.body.estoque).toBe(estoqueAntes - 1);
    });

    // =========================================================================
    // CENÁRIO 2: CENÁRIO DE EXCEÇÃO (ESTOQUE INSUFICIENTE)
    // =========================================================================
    it("não deve realizar venda quando o estoque for insuficiente", async () => {

        // 1. Autenticação (Login)
        const login = await request(app)
            .post("/login")
            .send({
                email: "ana@email.com",
                senha: "123456"
            })
            .expect(200);

        const token = login.body.token;

        // 2. Consulta o estoque inicial (esperamos 10 unidades)
        const antes = await request(app)
            .get("/produtos/1")
            .set("Authorization", `Bearer ${token}`)
            .expect(200);
        const estoqueAntes = antes.body.estoque;

        // 3. Tenta comprar uma quantidade muito maior do que o estoque disponível (99 unidades)
        const respostaVenda = await request(app)
            .post("/vendas")
            .set("Authorization", `Bearer ${token}`)
            .send({
                produtoId: 1,
                quantidade: 99
            })
            .expect(400); // Espera Bad Request

        // 4. Confere se a mensagem de erro é clara e adequada
        expect(respostaVenda.body.erro).toBe("Estoque insuficiente");

        // 5. Consulta novamente o produto
        const depois = await request(app)
            .get("/produtos/1")
            .set("Authorization", `Bearer ${token}`)
            .expect(200);

        // 6. Confirma que o estoque NÃO foi alterado
        expect(depois.body.estoque).toBe(estoqueAntes);
    });

});

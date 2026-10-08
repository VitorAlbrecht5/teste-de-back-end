/**
 * APLICAÇÃO EXPRESS PRINCIPAL
 * 
 * Configura as rotas do sistema para demonstração da jornada completa:
 * 1. POST /login        -> Autentica e retorna o JWT
 * 2. GET  /produtos/:id -> Consulta o estoque do produto (Rota Protegida)
 * 3. POST /vendas       -> Realiza a compra e baixa o estoque (Rota Protegida)
 */

const express = require("express");
const jwt = require("jsonwebtoken");
const { usuarios, produtos, vendas } = require("./dados");
const { autenticarToken, CHAVE_SECRETA } = require("./middleware/auth");

const app = express();

// Middleware nativo do Express para interpretar JSON no corpo (body) da requisição
app.use(express.json());

// ==========================================
// ROTA 1: LOGIN (Pública)
// ==========================================
app.post("/login", (req, res) => {
    const { email, senha } = req.body;

    // Busca o usuário correspondente no array em memória
    const usuario = usuarios.find(u => u.email === email && u.senha === senha);

    // Se as credenciais estiverem incorretas, retorna erro 401
    if (!usuario) {
        return res.status(401).json({ erro: "Credenciais inválidas" });
    }

    // Gera o token JWT com validade de 1 hora
    const token = jwt.sign(
        {
            id: usuario.id,
            email: usuario.email,
            role: usuario.role
        },
        CHAVE_SECRETA,
        { expiresIn: "1h" }
    );

    // Retorna o token para o cliente autenticado
    return res.status(200).json({ token });
});

// ==========================================
// ROTA 2: CONSULTAR PRODUTO (Protegida)
// ==========================================
app.get("/produtos/:id", autenticarToken, (req, res) => {
    const id = parseInt(req.params.id, 10);

    // Localiza o produto pelo ID
    const produto = produtos.find(p => p.id === id);

    // Se o produto não existir, retorna 404 (Not Found)
    if (!produto) {
        return res.status(404).json({ erro: "Produto não encontrado" });
    }

    // Retorna os dados atuais do produto (incluindo o estoque)
    return res.status(200).json(produto);
});

// ==========================================
// ROTA 3: REALIZAR VENDA (Protegida)
// ==========================================
app.post("/vendas", autenticarToken, (req, res) => {
    const { produtoId, quantidade } = req.body;

    // 1. Localiza o produto desejado
    const produto = produtos.find(p => p.id === parseInt(produtoId, 10));

    // 2. Verifica se o produto existe
    if (!produto) {
        return res.status(404).json({ erro: "Produto não encontrado" });
    }

    // 3. Valida se a quantidade solicitada é válida e se há estoque suficiente
    const qtd = parseInt(quantidade, 10);
    if (!qtd || qtd <= 0 || produto.estoque < qtd) {
        return res.status(400).json({ erro: "Estoque insuficiente" });
    }

    // 4. Diminui o estoque do produto no banco/memória
    produto.estoque -= qtd;

    // 5. Registra o histórico da venda
    vendas.push({
        id: vendas.length + 1,
        usuarioId: req.user.id,
        produtoId: produto.id,
        quantidade: qtd,
        data: new Date()
    });

    // 6. Retorna status 201 (Created) com mensagem de sucesso
    return res.status(201).json({ mensagem: "Venda realizada com sucesso" });
});

module.exports = app;

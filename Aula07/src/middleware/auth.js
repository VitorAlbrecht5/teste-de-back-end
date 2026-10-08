/**
 * MIDDLEWARE DE AUTENTICAÇÃO JWT
 * 
 * Intercepta requisições para rotas protegidas e valida se o cliente
 * enviou um token JWT válido no cabeçalho `Authorization: Bearer <token>`.
 */

const jwt = require("jsonwebtoken");

// Chave secreta compartilhada para assinar e verificar o token
const CHAVE_SECRETA = "segredo_super_secreto_para_aula_e2e";

function autenticarToken(req, res, next) {
    // 1. Obtém o cabeçalho de autorização da requisição
    const authHeader = req.headers["authorization"] || req.headers["Authorization"];

    // 2. Se o cabeçalho não existir, barra a requisição com status 401 (Não Autorizado)
    if (!authHeader) {
        return res.status(401).json({ erro: "Token não fornecido" });
    }

    // 3. Separa o esquema "Bearer" do token propriamente dito
    const partes = authHeader.split(" ");

    if (partes.length !== 2 || partes[0] !== "Bearer") {
        return res.status(401).json({ erro: "Formato do token inválido. Use 'Bearer <token>'" });
    }

    const token = partes[1];

    // 4. Valida e decodifica o JWT usando a chave secreta
    jwt.verify(token, CHAVE_SECRETA, (erro, usuarioDecodificado) => {
        // Se a assinatura for inválida ou o token estiver expirado
        if (erro) {
            return res.status(401).json({ erro: "Token inválido ou expirado" });
        }

        // 5. Anexa os dados do usuário na requisição para uso posterior
        req.user = usuarioDecodificado;

        // 6. Libera a passagem para a próxima função/rota
        next();
    });
}

module.exports = {
    autenticarToken,
    CHAVE_SECRETA
};

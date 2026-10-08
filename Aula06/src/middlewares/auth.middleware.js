/**
 * ========================================================================================
 * 🛡️ MIDDLEWARE: AUTENTICAÇÃO JWT (JSON Web Token)
 * ========================================================================================
 * 
 * O que é um Middleware no Express?
 * É uma função intermediária na cadeia de processamento que tem acesso aos objetos:
 * - `req` (Requisição): dados enviados pelo cliente.
 * - `res` (Resposta): métodos para responder ao cliente.
 * - `next` (Próximo): função que passa o controle para o próximo middleware ou controller.
 * 
 * Papel deste Middleware:
 * 1. Interceptar a requisição antes que ela chegue aos controllers protegidos.
 * 2. Verificar a existência do cabeçalho HTTP `Authorization`.
 * 3. Validar a estrutura do cabeçalho no padrão `Bearer <token>`.
 * 4. Verificar a integridade e validade da assinatura do token JWT com a chave secreta.
 * 5. Em caso de sucesso: anexar o payload decodificado em `req.user` e chamar `next()`.
 * 6. Em caso de falha: interromper a requisição retornando status HTTP `401 Unauthorized`.
 * ========================================================================================
 */

const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../config/jwt');

/**
 * Middleware para validar o token JWT nas requisições HTTP
 * @param {import('express').Request} req Objeto de requisição do Express
 * @param {import('express').Response} res Objeto de resposta do Express
 * @param {import('express').NextFunction} next Função para avançar a cadeia de execução
 */
function autenticarToken(req, res, next) {
  // 1. Extrai o cabeçalho Authorization da requisição
  const authHeader = req.headers['authorization'];

  // Caso 1: O cliente não enviou nenhum cabeçalho de autorização
  if (!authHeader) {
    return res.status(401).json({
      erro: 'Token de autenticação não fornecido',
      detalhe: 'Envie o cabeçalho Authorization no formato Bearer <token>'
    });
  }

  // 2. Divide a string "Bearer <token>" pelo espaço em branco
  const partes = authHeader.split(' ');

  // Caso 2: O cabeçalho foi enviado, mas não segue a estrutura "Bearer <token>"
  if (partes.length !== 2 || partes[0] !== 'Bearer') {
    return res.status(401).json({
      erro: 'Formato do cabeçalho de autorização inválido',
      detalhe: 'O cabeçalho deve seguir a estrutura: Bearer <token>'
    });
  }

  // 3. Obtém apenas o token JWT (segunda parte da string)
  const token = partes[1];

  // 4. Valida a assinatura e a expiração do token usando a chave secreta
  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    // Caso 3: Token com assinatura inválida, forjada ou com tempo de vida expirado
    if (err) {
      return res.status(401).json({
        erro: 'Token inválido ou expirado',
        mensagem: err.message
      });
    }

    // 5. Sucesso: Injeta o payload decodificado na requisição para que os próximos
    // middlewares ou controllers possam saber quem é o usuário logado
    req.user = decoded;

    // 6. Passa a execução para o próximo elemento da cadeia
    return next();
  });
}

module.exports = {
  autenticarToken,
};

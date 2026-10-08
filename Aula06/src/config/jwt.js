/**
 * ========================================================================================
 * 🔑 CONFIGURAÇÃO E UTILITÁRIOS DE JSON WEB TOKEN (JWT)
 * ========================================================================================
 * 
 * Como o JWT é estruturado:
 * 1. Header: Algoritmo de hash utilizado (ex.: HS256).
 * 2. Payload: Dados públicos do usuário (ex.: id, nome, email, role).
 * 3. Signature: Assinatura criptográfica calculada com a chave secreta (JWT_SECRET).
 * 
 * ========================================================================================
 */

const jwt = require('jsonwebtoken');

// Chave secreta para assinatura dos tokens.
// Em ambiente de produção deve ser injetada via variável de ambiente (process.env.JWT_SECRET)
const JWT_SECRET = process.env.JWT_SECRET || 'chave-secreta-para-testes-senai-2026';

/**
 * Função utilitária para gerar tokens JWT assinados
 * @param {Object} payload Informações do usuário a serem encapsuladas no token
 * @param {Object} [options] Opções de configuração do token (tempo de expiração, etc.)
 * @returns {string} Token JWT serializado em formato string (Header.Payload.Signature)
 */
function gerarToken(payload, options = { expiresIn: '1h' }) {
  return jwt.sign(payload, JWT_SECRET, options);
}

module.exports = {
  JWT_SECRET,
  gerarToken,
};

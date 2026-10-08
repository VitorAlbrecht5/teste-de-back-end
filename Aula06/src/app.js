/**
 * ========================================================================================
 * 📦 APLICAÇÃO EXPRESS: ROTAS E CONFIGURAÇÃO DA API
 * ========================================================================================
 * 
 * Estrutura das Rotas:
 * 1. Pública: POST /login (Gera token JWT)
 * 2. Protegida Comum: GET /usuarios (Requer apenas Token Válido de qualquer role)
 * 3. Protegida Comum: GET /perfil (Retorna dados do payload JWT anexados em req.user)
 * 4. Protegida Restrita (RBAC): DELETE /produtos/:id (Requer Token Válido + role 'admin')
 * ========================================================================================
 */

const express = require('express');
const { gerarToken } = require('./config/jwt');
const { autenticarToken } = require('./middlewares/auth.middleware');
const { autorizarRole } = require('./middlewares/role.middleware');

const app = express();

// Middleware para habilitar parsing de requisições com corpo no formato JSON
app.use(express.json());

// ----------------------------------------------------------------------------------------
// 🗄️ Base de Dados em Memória Simulada para Fins Didáticos
// ----------------------------------------------------------------------------------------
const bancoUsuarios = [
  {
    id: 1,
    nome: 'Ana Silva',
    email: 'ana@empresa.com',
    senhaHash: '$2a$12$abcdef123456hashSecretoSeguro',
    role: 'admin',
  },
  {
    id: 2,
    nome: 'Carlos Souza',
    email: 'carlos@empresa.com',
    senhaHash: '$2a$12$xyz987654hashSecretoSeguro',
    role: 'user',
  },
];

let bancoProdutos = [
  { id: 1, nome: 'Notebook Dell G7', preco: 6500.00 },
  { id: 2, nome: 'Teclado Mecânico RGB', preco: 350.00 },
];

// ========================================================================================
// 1️⃣ ROTA PÚBLICA: POST /login
// ========================================================================================
/**
 * Rota para autenticação do usuário.
 * Recebe email e senha, valida credenciais e retorna um Token JWT assinado.
 */
app.post('/login', (req, res) => {
  const { email, senha } = req.body;

  // Validação de entrada
  if (!email || !senha) {
    return res.status(400).json({ erro: 'Email e senha são obrigatórios' });
  }

  // Busca o usuário pelo e-mail
  const usuario = bancoUsuarios.find(u => u.email === email);

  // Simulação didática de validação de senha (em produção usaria bcrypt.compare)
  if (!usuario || senha !== '123456') {
    return res.status(401).json({ erro: 'Credenciais inválidas' });
  }

  // Gera o token JWT com o payload contendo as informações essenciais do usuário
  const token = gerarToken({
    id: usuario.id,
    nome: usuario.nome,
    email: usuario.email,
    role: usuario.role,
  });

  // Resposta com token e objeto de usuário SANITIZADO (sem expor senhaHash)
  return res.status(200).json({
    token,
    usuario: {
      id: usuario.id,
      nome: usuario.nome,
      email: usuario.email,
      role: usuario.role,
    },
  });
});

// ========================================================================================
// 2️⃣ ROTA PROTEGIDA COMUM: GET /usuarios
// ========================================================================================
/**
 * Listagem de usuários cadastrados.
 * Exige apenas que o cliente esteja autenticado (`autenticarToken`).
 */
app.get('/usuarios', autenticarToken, (req, res) => {
  // 🛡️ Sanitização: Remove o campo senhaHash de todos os registros retornados
  const usuariosSanitizados = bancoUsuarios.map(({ senhaHash, ...resto }) => resto);

  return res.status(200).json(usuariosSanitizados);
});

// ========================================================================================
// 3️⃣ ROTA PROTEGIDA COMUM: GET /perfil
// ========================================================================================
/**
 * Consulta de perfil do usuário atualmente autenticado.
 * Utiliza o objeto `req.user` injetado pelo middleware `autenticarToken`.
 */
app.get('/perfil', autenticarToken, (req, res) => {
  return res.status(200).json({
    mensagem: 'Perfil autenticado com sucesso',
    usuario: {
      id: req.user.id,
      nome: req.user.nome,
      email: req.user.email,
      role: req.user.role,
    },
  });
});

// ========================================================================================
// 4️⃣ ROTA PROTEGIDA COM RBAC: DELETE /produtos/:id
// ========================================================================================
/**
 * Exclusão de produtos no catálogo.
 * Requer autenticação (`autenticarToken`) E perfil de administrador (`autorizarRole(['admin'])`).
 */
app.delete('/produtos/:id', autenticarToken, autorizarRole(['admin']), (req, res) => {
  const { id } = req.params;
  const index = bancoProdutos.findIndex(p => p.id === Number(id));

  // Se o produto não for encontrado
  if (index === -1) {
    return res.status(404).json({ erro: 'Produto não encontrado' });
  }

  // Remove o produto da lista
  const [produtoRemovido] = bancoProdutos.splice(index, 1);

  return res.status(200).json({
    mensagem: 'Produto removido com sucesso pelo administrador',
    produto: produtoRemovido,
  });
});

// Exporta o aplicativo para os testes do Supertest
module.exports = app;

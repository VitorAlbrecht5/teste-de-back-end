/**
 * ========================================================================================
 * 🚀 SERVIDOR HTTP (ENTRYPOINT STANDALONE)
 * ========================================================================================
 * 
 * Este arquivo é utilizado para subir o servidor HTTP localmente caso queira testar a API
 * manualmente via navegador, Postman, Insomnia ou Thunder Client.
 * 
 * Note a separação de responsabilidades:
 * - `app.js`: Apenas configura rotas e middlewares (usado nos testes com Supertest).
 * - `server.js`: Faz o `app.listen()` para escutar a porta de rede.
 * ========================================================================================
 */

const app = require('./app');

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`\n========================================================`);
  console.log(`🚀 Servidor da Aula 06 rodando na porta ${PORT}`);
  console.log(`👉 Rota Pública (Login):          POST   http://localhost:${PORT}/login`);
  console.log(`👉 Rota Protegida (Usuários):     GET    http://localhost:${PORT}/usuarios`);
  console.log(`👉 Rota Protegida (Perfil):       GET    http://localhost:${PORT}/perfil`);
  console.log(`👉 Rota Restrita ADMIN (Delete):  DELETE http://localhost:${PORT}/produtos/1`);
  console.log(`========================================================\n`);
});

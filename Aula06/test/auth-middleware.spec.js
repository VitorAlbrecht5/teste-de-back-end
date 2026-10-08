/**
 * ========================================================================================
 * 🧪 SUÍTE DE TESTES: AULA 06 — MIDDLEWARES, AUTENTICAÇÃO JWT E AUTORIZAÇÃO (RBAC)
 * ========================================================================================
 * 
 * 🎯 Objetivo Pedagógico:
 * Demonstrar de forma prática como testar a segurança de APIs REST no ecossistema Node.js.
 * 
 * 📚 Conceitos Fundamentais Abordados:
 * 1. Autenticação (401 Unauthorized): Quem é você? (Validação de credenciais e tokens).
 * 2. Autorização (403 Forbidden): O que você tem permissão de fazer? (Controle por papéis/roles).
 * 3. Sanitização de Dados Sensíveis: Nunca retornar hashes de senha ou segredos nas respostas.
 * 4. Padrão AAA: Arrange (Preparação), Act (Execução da requisição) e Assert (Verificação).
 * 
 * 🛠️ Ferramentas Utilizadas:
 * - Jest: Framework executor de testes, asserções (`expect`) e lifecycle hooks (`beforeAll`).
 * - Supertest: Biblioteca para simular chamadas HTTP reais na aplicação Express sem subir porta.
 * - jsonwebtoken: Biblioteca padrão para geração e verificação de tokens JWT.
 * ========================================================================================
 */

// Importa o Supertest para realizar requisições HTTP simuladas na aplicação Express
const request = require('supertest');

// Importa o jsonwebtoken para criar tokens de teste (válidos, adulterados ou expirados)
const jwt = require('jsonwebtoken');

// Importa a instância configurada do Express (sem iniciar o listen de portas)
const app = require('../src/app');

// Importa a função auxiliar de geração de tokens e a chave secreta de desenvolvimento
const { gerarToken, JWT_SECRET } = require('../src/config/jwt');

describe('🧪 Aula 06 — Testes de Middleware, Autenticação e Autorização (RBAC)', () => {
  // Variáveis para armazenar os tokens de teste compartilhados entre as asserções
  let tokenUser;
  let tokenAdmin;

  /**
   * --------------------------------------------------------------------------------------
   * 🏗️ FASE DE ARRANGE GLOBAL (beforeAll)
   * Executa uma única vez antes de todos os testes da suíte.
   * Cria tokens JWT válidos com perfis distintos para simular os diferentes atores da API:
   * - Usuário comum (role: 'user')
   * - Administrador (role: 'admin')
   * --------------------------------------------------------------------------------------
   */
  beforeAll(() => {
    // 1. Gera token com permissão padrão de usuário comum
    tokenUser = gerarToken({
      id: 2,
      nome: 'Carlos Souza',
      email: 'carlos@empresa.com',
      role: 'user',
    });

    // 2. Gera token com privilégios elevados de administrador
    tokenAdmin = gerarToken({
      id: 1,
      nome: 'Ana Silva',
      email: 'ana@empresa.com',
      role: 'admin',
    });
  });

  // ======================================================================================
  // 1️⃣ CENÁRIO 1: AUTENTICAÇÃO - BLOQUEIO SEM TOKEN OU CABEÇALHO INVÁLIDO (401)
  // ======================================================================================
  describe('1️⃣ Autenticação: Bloqueio de Acesso sem Token ou Header Inválido (401)', () => {
    
    /**
     * CT-01: Requisição em rota protegida sem nenhum cabeçalho de autorização.
     * Resultado Esperado: Status HTTP 401 Unauthorized e mensagem de erro explicativa.
     */
    test('deve bloquear acesso com status 401 quando nenhum token for informado', async () => {
      // ACT: Envia requisição GET para rota protegida sem o header Authorization
      const resposta = await request(app)
        .get('/usuarios')
        .expect(401); // Asserção de status HTTP pelo Supertest

      // ASSERT: Verifica se o corpo da resposta contém a propriedade de erro apropriada
      expect(resposta.body).toHaveProperty('erro');
      expect(resposta.body.erro).toMatch(/Token de autenticação não fornecido/i);
    });

    /**
     * CT-02: Requisição com cabeçalho presente, porém sem a estrutura "Bearer <token>".
     * Resultado Esperado: Status HTTP 401 Unauthorized informando erro de formato.
     */
    test('deve rejeitar requisição com formato de cabeçalho fora do padrão "Bearer <token>"', async () => {
      // ACT: Envia um formato inválido (ex.: sem o prefixo "Bearer")
      const resposta = await request(app)
        .get('/usuarios')
        .set('Authorization', 'TokenInvalidoSemBearer')
        .expect(401);

      // ASSERT: Garante que o middleware instrui o cliente sobre o formato correto
      expect(resposta.body).toHaveProperty('erro');
      expect(resposta.body.erro).toMatch(/Formato do cabeçalho/i);
    });
  });

  // ======================================================================================
  // 2️⃣ CENÁRIO 2: AUTENTICAÇÃO - TOKEN FORJADO OU EXPIRADO (401)
  // ======================================================================================
  describe('2️⃣ Autenticação: Token Inválido, Adulterado ou Expirado (401)', () => {

    /**
     * CT-03: Tentativa de forjar um token JWT assinado com outra chave secreta.
     * Resultado Esperado: Status HTTP 401 Unauthorized (falha na validação da assinatura criptográfica).
     */
    test('deve rejeitar com status 401 token assinado com segredo incorreto (token adulterado)', async () => {
      // ARRANGE: Cria um token assinado por chave não reconhecida pelo backend
      const tokenFalso = jwt.sign(
        { id: 99, nome: 'Hacker', role: 'admin' },
        'chave-secreta-errada-ou-forjada'
      );

      // ACT: Tenta consumir a rota com o token não confiável
      const resposta = await request(app)
        .get('/usuarios')
        .set('Authorization', `Bearer ${tokenFalso}`)
        .expect(401);

      // ASSERT: Verifica se a mensagem informa token inválido
      expect(resposta.body).toHaveProperty('erro');
      expect(resposta.body.erro).toMatch(/Token inválido ou expirado/i);
    });

    /**
     * CT-04: Envio de token cuja data de expiração (exp) já passou.
     * Resultado Esperado: Status HTTP 401 Unauthorized por expiração temporal do token.
     */
    test('deve rejeitar com status 401 quando o token JWT estiver expirado', async () => {
      // ARRANGE: Cria um token com tempo de vida de 0 segundos (expiração instantânea)
      const tokenExpirado = jwt.sign(
        { id: 2, nome: 'Carlos', role: 'user' },
        JWT_SECRET,
        { expiresIn: '0s' }
      );

      // Aguarda 50ms para garantir a virada do timestamp no sistema
      await new Promise(resolve => setTimeout(resolve, 50));

      // ACT: Tenta acessar a rota protegida com o token expirado
      const resposta = await request(app)
        .get('/usuarios')
        .set('Authorization', `Bearer ${tokenExpirado}`)
        .expect(401);

      // ASSERT: Valida a rejeição pelo middleware
      expect(resposta.body.erro).toMatch(/Token inválido ou expirado/i);
    });
  });

  // ======================================================================================
  // 3️⃣ CENÁRIO 3: AUTENTICAÇÃO - ACESSO PERMITIDO COM TOKEN VÁLIDO (200)
  // ======================================================================================
  describe('3️⃣ Autenticação: Acesso Permitido com Token Válido (200)', () => {

    /**
     * CT-05: Usuário autenticado acessando rota protegida comum.
     * Resultado Esperado: Status HTTP 200 OK e listagem de recursos.
     */
    test('deve permitir acesso à listagem de usuários com token válido de USER', async () => {
      // ACT: Faz requisição enviando o header Authorization com Bearer token válido
      const resposta = await request(app)
        .get('/usuarios')
        .set('Authorization', `Bearer ${tokenUser}`)
        .expect(200);

      // ASSERT: Valida que a resposta é um array com os itens esperados
      expect(Array.isArray(resposta.body)).toBe(true);
      expect(resposta.body.length).toBeGreaterThan(0);
    });

    /**
     * CT-06: Verificação de injeção de dados decodificados (`req.user`) na requisição.
     * Resultado Esperado: Status HTTP 200 OK com os dados do usuário contidos no payload.
     */
    test('deve retornar os dados do perfil decodificados a partir do token JWT', async () => {
      // ACT: Acessa a rota de perfil próprio
      const resposta = await request(app)
        .get('/perfil')
        .set('Authorization', `Bearer ${tokenUser}`)
        .expect(200);

      // ASSERT: Confirma que o middleware decodificou o payload e passou para o controller
      expect(resposta.body).toHaveProperty('usuario');
      expect(resposta.body.usuario).toMatchObject({
        id: 2,
        nome: 'Carlos Souza',
        email: 'carlos@empresa.com',
        role: 'user',
      });
    });
  });

  // ======================================================================================
  // 4️⃣ CENÁRIO 4: AUTORIZAÇÃO BASEADA EM PAPEL - RBAC (403 vs 200)
  // ======================================================================================
  describe('4️⃣ Autorização Baseada em Perfis (RBAC: 403 Forbidden vs 200 OK)', () => {

    /**
     * CT-07: Usuário comum autenticado tentando executar ação exclusiva de administrador.
     * Resultado Esperado: Status HTTP 403 Forbidden (Usuário reconhecido, mas sem permissão).
     */
    test('USER não pode acessar rota restrita de ADMIN (deve retornar 403 Forbidden)', async () => {
      // ACT: Usuário comum tenta deletar um produto no endpoint administrativo
      const resposta = await request(app)
        .delete('/produtos/1')
        .set('Authorization', `Bearer ${tokenUser}`)
        .expect(403);

      // ASSERT: Verifica mensagem clara de bloqueio por permissão insuficiente
      expect(resposta.body).toHaveProperty('erro');
      expect(resposta.body.erro).toMatch(/Acesso proibido: permissão insuficiente/i);
      expect(resposta.body.perfilAtual).toBe('user');
      expect(resposta.body.perfilNecessario).toContain('admin');
    });

    /**
     * CT-08: Administrador autenticado executando ação permitida ao seu perfil.
     * Resultado Esperado: Status HTTP 200 OK e confirmação da operação.
     */
    test('ADMIN pode acessar e executar a ação na rota restrita (deve retornar 200 OK)', async () => {
      // ACT: Administrador executa a deleção
      const resposta = await request(app)
        .delete('/produtos/1')
        .set('Authorization', `Bearer ${tokenAdmin}`)
        .expect(200);

      // ASSERT: Confirmação de sucesso da ação administrativa
      expect(resposta.body).toHaveProperty('mensagem');
      expect(resposta.body.mensagem).toMatch(/removido com sucesso pelo administrador/i);
      expect(resposta.body.produto).toHaveProperty('id', 1);
    });
  });

  // ======================================================================================
  // 5️⃣ CENÁRIO 5: SEGURANÇA E SANITIZAÇÃO DE DADOS SENSÍVEIS
  // ======================================================================================
  describe('5️⃣ Segurança e Proteção de Dados: Não Vazamento de Dados Sensíveis', () => {

    /**
     * CT-09: Garantir que nenhuma rota de listagem retorne senhas em texto puro ou hashes.
     * Resultado Esperado: Todos os objetos de usuário devem omitir campos como senha/senhaHash.
     */
    test('não deve retornar senhaHash ou senhas em texto plano na rota de usuários', async () => {
      // ACT: Busca lista de usuários autenticado como admin
      const resposta = await request(app)
        .get('/usuarios')
        .set('Authorization', `Bearer ${tokenAdmin}`)
        .expect(200);

      // ASSERT: Itera sobre cada registro garantindo que campos sensíveis foram sanitizados
      resposta.body.forEach(usuario => {
        expect(usuario).not.toHaveProperty('senha');
        expect(usuario).not.toHaveProperty('senhaHash');
        expect(usuario).not.toHaveProperty('password');
      });
    });

    /**
     * CT-10: Garantir que a resposta do endpoint de login retorne apenas o token e dados públicos.
     * Resultado Esperado: Objeto de usuário na resposta de login sem dados confidenciais de credenciais.
     */
    test('o endpoint de login não deve expor a senhaHash no payload de resposta', async () => {
      // ACT: Realiza login válido
      const resposta = await request(app)
        .post('/login')
        .send({
          email: 'ana@empresa.com',
          senha: '123456',
        })
        .expect(200);

      // ASSERT: Verifica se o token foi emitido e se os dados do usuário estão limpos
      expect(resposta.body).toHaveProperty('token');
      expect(resposta.body.usuario).toBeDefined();
      expect(resposta.body.usuario).not.toHaveProperty('senhaHash');
      expect(resposta.body.usuario).not.toHaveProperty('senha');
    });
  });
});

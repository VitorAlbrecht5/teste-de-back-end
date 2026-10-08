const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const Produto = require('../src/produto.model');

/**
 * ============================================================================
 * TESTES DE PERSISTÊNCIA: MODEL DE PRODUTO
 * ============================================================================
 * Objetivo da Aula:
 * "Hoje vamos descobrir se o nosso Model realmente impede que dados errados
 * cheguem ao MongoDB."
 * 
 * Diferença de Teste Unitário vs Teste de Persistência:
 * - Teste Unitário: Testa funções puras em memória isolada (expect(somar(2, 3)).toBe(5)).
 * - Teste de Persistência: Testa a interação real da aplicação com o banco de dados
 *   (Jest -> Mongoose -> MongoDB).
 */
describe('Testes de Persistência - Model Produto', () => {
  let mongoServer;

  /**
   * --------------------------------------------------------------------------
   * 1. CICLO DE VIDA: beforeAll
   * --------------------------------------------------------------------------
   * Executa UMA ÚNICA VEZ antes de iniciar a suíte de testes.
   * - Cria uma instância temporária do MongoDB na memória RAM (MongoMemoryServer).
   * - Conecta o Mongoose a esse banco descartável.
   * - Garante a criação dos índices (fundamental para o teste de `unique: true`).
   */
  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();

    await mongoose.connect(uri);
    await Produto.init(); // Garante que os índices únicos do Schema foram criados no MongoDB
  });

  /**
   * --------------------------------------------------------------------------
   * 2. CICLO DE VIDA: afterEach
   * --------------------------------------------------------------------------
   * Executa AO FINAL DE CADA TESTE.
   * - Apaga todos os registros da collection.
   * - Garante o ISOLAMENTO: o Teste 2 não pode sofrer efeitos colaterais
   *   ou depender de dados inseridos pelo Teste 1.
   */
  afterEach(async () => {
    await Produto.deleteMany({});
  });

  /**
   * --------------------------------------------------------------------------
   * 3. CICLO DE VIDA: afterAll
   * --------------------------------------------------------------------------
   * Executa UMA ÚNICA VEZ ao final de todos os testes.
   * - Encerra a conexão do Mongoose com o banco.
   * - Desliga e destrói o MongoDB temporário em memória, liberando a porta e a RAM.
   */
  afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
  });

  // ==========================================================================
  // CENÁRIO 1: CASO DE SUCESSO (HAPPY PATH)
  // ==========================================================================
  test('Deve salvar um produto válido com sucesso no MongoDB', async () => {
    // [Arrange] Prepara os dados válidos de entrada
    const dadosProduto = {
      nome: 'Teclado Mecânico',
      preco: 250.0,
      categoria: 'informatica',
      sku: 'TEC-001'
    };
    

    // [Act] Executa a ação de persistência no banco
    const produtoSalvo = await Produto.create(dadosProduto);

    // [Assert] Verifica se o documento foi persistido com IDs e timestamps gerados
    expect(produtoSalvo._id).toBeDefined();
    expect(produtoSalvo.createdAt).toBeDefined();
    expect(produtoSalvo.updatedAt).toBeDefined();
    expect(produtoSalvo.preco).toBe(250.0);
    expect(produtoSalvo.categoria).toBe('informatica');
    expect(produtoSalvo.sku).toBe('TEC-001');
  });

  // ==========================================================================
  // CENÁRIO 2: VALIDAÇÃO DE CAMPO OBRIGATÓRIO (REQUIRED)
  // ==========================================================================
  test('Deve rejeitar o cadastro de um produto sem o campo obrigatório "nome"', async () => {
    // [Arrange] Objeto sem a propriedade obrigatória 'nome'
    const produtoInvalido = new Produto({
      preco: 120.0,
      categoria: 'informatica'
    });

    // [Act & Assert]
    // Esperamos que o Mongoose lance um erro do tipo ValidationError
    let erro;
    try {
      await produtoInvalido.save();
    } catch (err) {
      erro = err;
    }

    expect(erro).toBeDefined();
    expect(erro.name).toBe('ValidationError');
    expect(erro.errors.nome).toBeDefined();
    expect(erro.errors.nome.message).toBe('O nome do produto é obrigatório');
  });

  // ==========================================================================
  // CENÁRIO 3: VALIDAÇÃO NUMÉRICA COM MÍNIMO (PREÇO NEGATIVO)
  // ==========================================================================
  test('Não deve aceitar preço negativo (validação min: 0)', async () => {
    // [Arrange] Produto com preço inválido (-50)
    const produtoComPrecoNegativo = new Produto({
      nome: 'Mouse Gamer',
      preco: -50.0,
      categoria: 'informatica'
    });

    // [Act & Assert]
    // Usando a sintaxe fluente do Jest: expect(promise).rejects.toThrow()
    await expect(produtoComPrecoNegativo.save()).rejects.toThrow();

    // Verificação detalhada da mensagem customizada definida no Schema:
    try {
      await produtoComPrecoNegativo.save();
    } catch (err) {
      expect(err.errors.preco).toBeDefined();
      expect(err.errors.preco.message).toBe('O preço não pode ser negativo');
    }
  });

  // ==========================================================================
  // CENÁRIO 4: VALIDAÇÃO DE ENUMERAÇÃO (CATEGORIA NÃO PERMITIDA)
  // ==========================================================================
  test('Deve rejeitar categorias que não estejam na lista do enum', async () => {
    // [Arrange] 'comida' não faz parte de ['informatica', 'moveis', 'acessorios']
    const produtoCategoriaInvalida = new Produto({
      nome: 'Cadeira Ergonômica',
      preco: 800.0,
      categoria: 'comida'
    });

    // [Act & Assert]
    let erro;
    try {
      await produtoCategoriaInvalida.save();
    } catch (err) {
      erro = err;
    }

    expect(erro).toBeDefined();
    expect(erro.name).toBe('ValidationError');
    expect(erro.errors.categoria).toBeDefined();
    expect(erro.errors.categoria.message).toContain('A categoria "comida" não é permitida');
  });

  // ==========================================================================
  // CENÁRIO 5: TESTANDO HOOKS / MIDDLEWARES (PRE-SAVE TRANSFORM)
  // ==========================================================================
  test('Deve aplicar o hook pre-save e transformar o nome em letras MAIÚSCULAS', async () => {
    // [Arrange] Entrada com nome em letras minúsculas
    const dados = {
      nome: 'headset gamer usb',
      preco: 180.0,
      categoria: 'acessorios'
    };

    // [Act] Ao salvar, o hook pre-save deve ser disparado automaticamente
    const produtoCriado = await Produto.create(dados);

    // [Assert] O valor persistido no banco deve ser 'HEADSET GAMER USB'
    expect(produtoCriado.nome).toBe('HEADSET GAMER USB');
  });

  // ==========================================================================
  // CENÁRIO 6: RESTRIÇÃO DE UNICIDADE (UNIQUE INDEX NO MONGODB)
  // ==========================================================================
  test('Deve falhar ao tentar cadastrar dois produtos com o mesmo SKU (chave duplicada)', async () => {
    // [Arrange] Salva o primeiro produto com SKU 'MON-4K-01'
    await Produto.create({
      nome: 'Monitor 4K',
      preco: 1900.0,
      sku: 'MON-4K-01'
    });

    // [Act] Tenta salvar o segundo produto com o MESMO SKU
    const segundoProduto = new Produto({
      nome: 'Monitor 4K Recondicionado',
      preco: 1400.0,
      sku: 'MON-4K-01'
    });

    // [Assert]
    // O MongoDB rejeita a gravação com código de erro 11000 (Duplicate Key Error)
    let erro;
    try {
      await segundoProduto.save();
    } catch (err) {
      erro = err;
    }

    expect(erro).toBeDefined();
    expect(erro.code).toBe(11000); // Código oficial do MongoDB para erro de chave duplicada
  });
});

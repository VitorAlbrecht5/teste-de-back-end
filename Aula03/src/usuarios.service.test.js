const UsuariosService = require('./usuarios.service');
const UsuariosRepository = require('./usuarios.repository');

// =========================================================================
// [PASSO 1 - MOCK GLOBAL]
// Substitui todo o módulo do repositório por um Dublê de Teste (Mock)
// =========================================================================
jest.mock('./usuarios.repository');

describe('Aula 03 - Dublês de Teste com Jest (UsuariosService)', () => {
  let usuariosService;

  beforeEach(() => {
    usuariosService = new UsuariosService();
    jest.clearAllMocks(); // Limpa histórico e contadores entre cada teste
  });

  // =======================================================================
  // [LIVE CODING COM O PROFESSOR]
  // CASO 1: Repositório retorna usuário -> Service retorna dados formatados
  // =======================================================================
  it('Caso 1: Deve retornar o usuário com nome em MAIÚSCULAS quando encontrado', async () => {
    // ---------------------------------------------------------------------
    // ETAPA 2: STUBBING (Programar a resposta do dublê)
    // ---------------------------------------------------------------------
    const mockUsuario = {
      nome: 'ana silva',
      email: 'ana.silva@senai.br'
    };
    UsuariosRepository.findOne.mockResolvedValue(mockUsuario);

    // ---------------------------------------------------------------------
    // ETAPA 3: EXECUÇÃO (Chamar a regra de negócio real)
    // ---------------------------------------------------------------------
    const resultado = await usuariosService.buscarPorEmail('ana.silva@senai.br');

    // ---------------------------------------------------------------------
    // ETAPA 4: VERIFICAÇÃO (Validar resultado e chamadas)
    // ---------------------------------------------------------------------
    expect(resultado).toEqual({
      nomeCompleto: 'ANA SILVA',
      email: 'ana.silva@senai.br'
    });
    expect(UsuariosRepository.findOne).toHaveBeenCalledWith('ana.silva@senai.br');
  });

  // =======================================================================
  // [LIVE CODING / PRÁTICA GUIADA]
  // CASO 2: Repositório retorna null -> Service lança erro
  // =======================================================================
  it('Caso 2: Deve lançar erro "Usuário não encontrado" quando o repositório retornar null', async () => {
    // ---------------------------------------------------------------------
    // ETAPA 2: STUBBING (Simular que o banco retornou null)
    // ---------------------------------------------------------------------
    UsuariosRepository.findOne.mockResolvedValue(null);

    // ---------------------------------------------------------------------
    // ETAPA 3 e 4: EXECUÇÃO E VERIFICAÇÃO DO ERRO
    // ---------------------------------------------------------------------
    await expect(usuariosService.buscarPorEmail('inexistente@senai.br'))
      .rejects
      .toThrow('Usuário não encontrado');

    expect(UsuariosRepository.findOne).toHaveBeenCalledWith('inexistente@senai.br');
  });

  // =======================================================================
  // 🏆 [DESAFIO RESOLVIDO] - Testes do método cadastrar()
  // =======================================================================
  it('Desafio 1: Deve cadastrar novo usuário com status ativo quando o email não existir', async () => {
    // 1. STUBBING: Simula que o email NÃO existe no banco (retorna null)
    UsuariosRepository.findOne.mockResolvedValue(null);

    const novoUsuario = {
      nome: 'Carlos Souza',
      email: 'carlos.souza@senai.br'
    };

    // 2. EXECUÇÃO: Tenta cadastrar o novo usuário
    const resultado = await usuariosService.cadastrar(novoUsuario);

    // 3. VERIFICAÇÃO: Deve retornar o usuário com status 'ativo'
    expect(resultado).toEqual({
      nome: 'Carlos Souza',
      email: 'carlos.souza@senai.br',
      status: 'ativo'
    });
    expect(UsuariosRepository.findOne).toHaveBeenCalledWith('carlos.souza@senai.br');
  });

  it('Desafio 2: Deve lançar erro se o email já estiver cadastrado no repositório', async () => {
    // 1. STUBBING: Simula que o banco JÁ encontrou um usuário com esse email
    UsuariosRepository.findOne.mockResolvedValue({
      nome: 'Carlos Existente',
      email: 'carlos.souza@senai.br'
    });

    const novoUsuario = {
      nome: 'Carlos Tentando Cadastrar',
      email: 'carlos.souza@senai.br'
    };

    // 2 e 3. EXECUÇÃO E VERIFICAÇÃO: Deve rejeitar com a mensagem de erro
    await expect(usuariosService.cadastrar(novoUsuario))
      .rejects
      .toThrow('E-mail já cadastrado');

    expect(UsuariosRepository.findOne).toHaveBeenCalledWith('carlos.souza@senai.br');
  });
});

import { Test, TestingModule } from '@nestjs/testing';
import { TarefasService } from './tarefas.service';
import { TarefasRepository } from './tarefas.repository';
import { NotFoundException } from '@nestjs/common';

/**
 * ============================================================================
 * TESTES UNITÁRIOS COM MOCKS (CONCEITO DA AULA 03)
 * ============================================================================
 * Objetivo pedagógico: Mostrar o contraste com a Aula 04.
 * Aqui testamos apenas o TarefasService isolado.
 * O TarefasRepository real NÃO é executado: ele foi substituído por um objeto
 * simulado (Mock) usando jest.fn() e mockResolvedValue().
 */
describe('TarefasService (Unitário - Aula 03 Style)', () => {
  let service: TarefasService;
  let repository: TarefasRepository;

  // 1. Objeto Mock (Dublê de Teste) simulando as funções do repositório
  const mockTarefasRepository = {
    salvar: jest.fn(),
    listar: jest.fn(),
    buscarPorId: jest.fn(),
  };

  beforeEach(async () => {
    // 2. Monta o módulo de teste injetando o mock no lugar do repositório real
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TarefasService,
        {
          provide: TarefasRepository,
          useValue: mockTarefasRepository, // <-- Substituição por dublê
        },
      ],
    }).compile();

    service = module.get<TarefasService>(TarefasService);
    repository = module.get<TarefasRepository>(TarefasRepository);
    
    // Limpa o histórico de chamadas dos mocks entre os testes
    jest.clearAllMocks();
  });

  it('deve criar uma tarefa com sucesso quando repositório responde', async () => {
    // ARRANGE (Preparação): programa o retorno simulado do mock
    const dto = { titulo: 'Aprender NestJS' };
    const fakeTarefa = { id: 1, titulo: 'Aprender NestJS', concluida: false };
    mockTarefasRepository.salvar.mockResolvedValue(fakeTarefa);

    // ACT (Ação): executa o método do Service
    const resultado = await service.criar(dto);

    // ASSERT (Verificação): valida se retornou o esperado e se o mock foi chamado
    expect(resultado).toEqual(fakeTarefa);
    expect(mockTarefasRepository.salvar).toHaveBeenCalledWith({
      titulo: 'Aprender NestJS',
    });
  });

  it('deve lançar NotFoundException quando a tarefa não existir', async () => {
    // ARRANGE: programa o mock para retornar null (tarefa inexistente)
    mockTarefasRepository.buscarPorId.mockResolvedValue(null);

    // ACT & ASSERT: verifica se o Service lança a exceção esperada
    await expect(service.buscarPorId(999)).rejects.toThrow(NotFoundException);
    expect(mockTarefasRepository.buscarPorId).toHaveBeenCalledWith(999);
  });
});

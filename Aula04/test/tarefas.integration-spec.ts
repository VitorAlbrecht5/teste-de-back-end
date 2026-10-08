import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { TarefasModule } from '../src/tarefas/tarefas.module';
import { TarefasRepository } from '../src/tarefas/tarefas.repository';

/**
 * ============================================================================
 * TESTES DE INTEGRAÇÃO COM NESTJS E SUPERTEST (AULA 04)
 * ============================================================================
 * Diferenças fundamentais em relação ao teste unitário da Aula 03:
 * 1. NÃO usamos Mocks: importamos o TarefasModule REAL com todas as suas camadas.
 * 2. Criamos uma instância real da aplicação NestJS com createNestApplication().
 * 3. Fazemos requisições HTTP reais usando a biblioteca Supertest (request).
 * 4. Testamos o fluxo completo: Rota HTTP -> Pipes -> Controller -> Service -> Repository.
 */
describe('Módulo de Tarefas (Integração - Aula 04)', () => {
  let app: INestApplication;
  let repository: TarefasRepository;

  /**
   * BEFOREALL: Executado UMA ÚNICA VEZ antes de todos os testes da suíte iniciarem.
   * Responsável por inicializar o servidor NestJS em memória.
   */
  beforeAll(async () => {
    // 1. Cria o módulo de testes compilando o TarefasModule completo (sem mocks)
    const moduleRef: TestingModule = await Test.createTestingModule({
      imports: [TarefasModule],
    }).compile();

    // 2. Instancia a aplicação NestJS
    app = moduleRef.createNestApplication();

    // 3. IMPORTANTE: Registra o ValidationPipe global para habilitar as validações dos DTOs.
    // Dica para a aula: Pipes configurados no main.ts NÃO são herdados nos testes automaticamente!
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,            // Remove campos que não estão no DTO
        forbidNonWhitelisted: true, // Rejeita requisição se vier campo desconhecido
        transform: true,            // Converte tipos primitivos automaticamente
      }),
    );

    // 4. Inicializa o pipeline HTTP do NestJS
    await app.init();

    // 5. Obtém a instância do repositório para permitir a limpeza de estado entre os testes
    repository = moduleRef.get<TarefasRepository>(TarefasRepository);
  });

  /**
   * BEFOREEACH: Executado ANTES DE CADA teste individual.
   * Garante o princípio do ISOLAMENTO: nenhum teste sofre interferência do teste anterior.
   */
  beforeEach(async () => {
    await repository.limpar();
  });

  /**
   * AFTERALL: Executado UMA ÚNICA VEZ após todos os testes terminarem.
   * CRÍTICO: Fecha a aplicação NestJS. Se esquecer, o processo do Jest fica travado!
   */
  afterAll(async () => {
    await app.close();
  });

  // ==========================================================================
  // SUÍTE 1: Fluxo de Criação (POST) e Listagem (GET)
  // ==========================================================================
  describe('POST /tarefas e GET /tarefas (Fluxo Completo)', () => {
    
    /**
     * CT-01: Caminho Feliz - Criação de tarefa válida
     */
    it('CT-01: Deve criar uma tarefa com sucesso (201 Created)', async () => {
      // Faz uma requisição HTTP POST real para o servidor em memória
      const response = await request(app.getHttpServer())
        .post('/tarefas')
        .send({ titulo: 'Estudar Testes de Integração' })
        .expect(201); // Valida o Status Code HTTP

      // Valida o corpo da resposta devolvida pelo Controller
      expect(response.body).toEqual({
        id: 1,
        titulo: 'Estudar Testes de Integração',
        concluida: false,
      });
    });

    /**
     * CT-02: Caminho Feliz - Listagem com múltiplos registros
     */
    it('CT-02: Deve listar as tarefas criadas (200 OK)', async () => {
      // Cria duas tarefas no banco em memória via requisições POST
      await request(app.getHttpServer())
        .post('/tarefas')
        .send({ titulo: 'Tarefa A' });
      await request(app.getHttpServer())
        .post('/tarefas')
        .send({ titulo: 'Tarefa B' });

      // Realiza a requisição GET para listar
      const response = await request(app.getHttpServer())
        .get('/tarefas')
        .expect(200);

      // Valida o tamanho da lista e os objetos retornados
      expect(response.body).toHaveLength(2);
      expect(response.body).toEqual([
        expect.objectContaining({ id: 1, titulo: 'Tarefa A' }),
        expect.objectContaining({ id: 2, titulo: 'Tarefa B' }),
      ]);
    });

    /**
     * CT-03: Validação do DTO - Título com tamanho menor que o mínimo (3 caracteres)
     */
    it('CT-03: Deve rejeitar payload inválido com menos de 3 caracteres (400 Bad Request)', async () => {
      const response = await request(app.getHttpServer())
        .post('/tarefas')
        .send({ titulo: 'Oi' }) // 'Oi' tem apenas 2 caracteres
        .expect(400);

      // Valida se o ValidationPipe retornou a mensagem de erro esperada
      expect(response.body.message).toEqual(
        expect.arrayContaining([
          'O título deve ter no mínimo 3 caracteres',
        ]),
      );
    });

    /**
     * CT-04: Validação do DTO - Payload vazio
     */
    it('CT-04: Deve rejeitar payload vazio (400 Bad Request)', async () => {
      const response = await request(app.getHttpServer())
        .post('/tarefas')
        .send({}) // Corpo vazio
        .expect(400);

      expect(response.body.message).toEqual(
        expect.arrayContaining(['O título é obrigatório']),
      );
    });
  });

  // ==========================================================================
  // SUÍTE 2: Busca por ID (GET /tarefas/:id)
  // ==========================================================================
  describe('GET /tarefas/:id', () => {

    /**
     * CT-05: Busca de registro existente
     */
    it('CT-05: Deve buscar uma tarefa por ID existente (200 OK)', async () => {
      // Cria uma tarefa inicial
      await request(app.getHttpServer())
        .post('/tarefas')
        .send({ titulo: 'Tarefa Específica' });

      // Busca a tarefa com ID 1
      const response = await request(app.getHttpServer())
        .get('/tarefas/1')
        .expect(200);

      expect(response.body).toEqual({
        id: 1,
        titulo: 'Tarefa Específica',
        concluida: false,
      });
    });

    /**
     * CT-06: Tratamento de exceção (NotFoundException -> 404 Not Found)
     */
    it('CT-06: Deve retornar 404 quando o ID não for encontrado', async () => {
      const response = await request(app.getHttpServer())
        .get('/tarefas/999')
        .expect(404);

      expect(response.body.message).toContain(
        'Tarefa com ID 999 não encontrada',
      );
    });

    /**
     * CT-07: Validação de tipo de parâmetro via ParseIntPipe (400 Bad Request)
     */
    it('CT-07: Deve retornar 400 se o ID não for numérico (ParseIntPipe)', async () => {
      // Envia uma string que não pode ser convertida para número
      await request(app.getHttpServer())
        .get('/tarefas/abc')
        .expect(400);
    });
  });
});

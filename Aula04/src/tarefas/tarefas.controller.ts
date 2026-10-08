import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  ParseIntPipe,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { TarefasService } from './tarefas.service';
import { CriarTarefaDto } from './dto/criar-tarefa.dto';

/**
 * ============================================================================
 * CAMADA: CONTROLLER (Porta de Entrada HTTP / Endpoints REST)
 * ============================================================================
 * O Controller recebe as requisições do cliente (ex: Supertest, Postman, Front-end),
 * extrai parâmetros e corpo (body), delega a execução para o Service correspondente
 * e retorna a resposta com o código de status HTTP adequado.
 *
 * Prefixo de rota: @Controller('tarefas') -> /tarefas
 */
@Controller('tarefas')
export class TarefasController {
  // Injeta a instância do Service responsável pelas tarefas
  constructor(private readonly tarefasService: TarefasService) {}

  /**
   * Endpoint: POST /tarefas
   * Responsável por cadastrar uma nova tarefa.
   *
   * @HttpCode(HttpStatus.CREATED) -> Garante o retorno do Status 201 (Created)
   * @Body() dto: CriarTarefaDto -> Extrai o JSON enviado e submete à validação do Pipe
   */
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async criar(@Body() dto: CriarTarefaDto) {
    return this.tarefasService.criar(dto);
  }

  /**
   * Endpoint: GET /tarefas
   * Responsável por retornar a listagem de todas as tarefas.
   * Por padrão, endpoints GET no NestJS retornam Status 200 (OK).
   */
  @Get()
  async listar() {
    return this.tarefasService.listar();
  }

  /**
   * Endpoint: GET /tarefas/:id
   * Responsável por buscar uma única tarefa pelo seu ID.
   *
   * @Param('id', ParseIntPipe) -> Converte automaticamente o parâmetro da URL
   * de string para number. Se o cliente enviar '/tarefas/abc', o ParseIntPipe
   * intercepta e devolve automaticamente Status 400 (Bad Request).
   */
  @Get(':id')
  async buscarPorId(@Param('id', ParseIntPipe) id: number) {
    return this.tarefasService.buscarPorId(id);
  }
}

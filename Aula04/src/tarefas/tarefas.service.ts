import { Injectable, NotFoundException } from '@nestjs/common';
import { TarefasRepository, Tarefa } from './tarefas.repository';
import { CriarTarefaDto } from './dto/criar-tarefa.dto';

/**
 * ============================================================================
 * CAMADA: SERVICE (Regras de Negócio e Lógica da Aplicação)
 * ============================================================================
 * O Service é o "cérebro" do sistema. Ele não se preocupa com HTTP, rotas ou
 * formatação de JSON — ele apenas recebe dados validados e orquestra a lógica,
 * acionando o repositório e disparando exceções de negócio quando necessário.
 */
@Injectable()
export class TarefasService {
  /**
   * O repositório é injetado automaticamente pelo mecanismo de Injeção de Dependências do NestJS.
   */
  constructor(private readonly tarefasRepository: TarefasRepository) {}

  /**
   * Cria uma nova tarefa a partir do DTO recebido.
   * @param dto Dados validados enviados pelo Controller
   */
  async criar(dto: CriarTarefaDto): Promise<Tarefa> {
    return this.tarefasRepository.salvar({ titulo: dto.titulo });
  }

  /**
   * Lista todas as tarefas cadastradas.
   */
  async listar(): Promise<Tarefa[]> {
    return this.tarefasRepository.listar();
  }

  /**
   * Busca uma tarefa pelo ID. Caso não encontre, dispara uma exceção HTTP 404.
   * @param id Identificador numérico da tarefa
   * @throws NotFoundException se nenhuma tarefa for encontrada com este ID
   */
  async buscarPorId(id: number): Promise<Tarefa> {
    const tarefa = await this.tarefasRepository.buscarPorId(id);
    if (!tarefa) {
      // NotFoundException é convertida automaticamente pelo NestJS em HTTP Status 404
      throw new NotFoundException(`Tarefa com ID ${id} não encontrada`);
    }
    return tarefa;
  }
}

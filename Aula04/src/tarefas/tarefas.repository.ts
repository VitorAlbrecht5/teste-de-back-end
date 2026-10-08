import { Injectable } from '@nestjs/common';

/**
 * Interface que representa a estrutura de dados de uma Tarefa no sistema.
 */
export interface Tarefa {
  id: number;
  titulo: string;
  concluida: boolean;
}

/**
 * ============================================================================
 * CAMADA: REPOSITORY (Persistência em Memória)
 * ============================================================================
 * O Repository é responsável exclusivo por interagir com o armazenamento de dados.
 *
 * NOTA PEDAGÓGICA (Aula 04):
 * Para focar exclusivamente nos testes de integração do NestJS com Supertest,
 * usamos uma simulação em memória (array) com métodos assíncronos (Promises).
 * Na Aula 05, este arquivo será substituído por um modelo real do MongoDB (Mongoose).
 */
@Injectable()
export class TarefasRepository {
  // Array privado que guarda as tarefas em memória durante a execução
  private tarefas: Tarefa[] = [];
  
  // Contador para simular a geração automática de ID autoincremento
  private proximoId = 1;

  /**
   * Salva uma nova tarefa no array em memória.
   * @param dados Objeto contendo o título da tarefa
   * @returns Retorna a tarefa recém-criada com id gerado e status pendente
   */
  async salvar(dados: { titulo: string }): Promise<Tarefa> {
    const novaTarefa: Tarefa = {
      id: this.proximoId++,
      titulo: dados.titulo,
      concluida: false,
    };
    this.tarefas.push(novaTarefa);
    return novaTarefa;
  }

  /**
   * Retorna uma cópia de todas as tarefas cadastradas até o momento.
   */
  async listar(): Promise<Tarefa[]> {
    // Retornamos um novo array [...tarefas] para evitar mutações acidentais externas
    return [...this.tarefas];
  }

  /**
   * Busca uma tarefa específica pelo seu identificador numérico.
   * @param id Identificador numérico da tarefa
   * @returns A tarefa encontrada ou null caso não exista
   */
  async buscarPorId(id: number): Promise<Tarefa | null> {
    const tarefa = this.tarefas.find((t) => t.id === id);
    return tarefa || null;
  }

  /**
   * Método auxiliar para os testes: limpa o array e reseta o contador de ID.
   * É chamado no beforeEach dos testes de integração para garantir isolamento.
   */
  async limpar(): Promise<void> {
    this.tarefas = [];
    this.proximoId = 1;
  }
}

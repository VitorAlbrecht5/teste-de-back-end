import { Module } from '@nestjs/common';
import { TarefasController } from './tarefas.controller';
import { TarefasService } from './tarefas.service';
import { TarefasRepository } from './tarefas.repository';

/**
 * ============================================================================
 * MÓDULO: TAREFAS (Encapsulamento e Injeção de Dependências)
 * ============================================================================
 * No NestJS, os módulos organizam a aplicação em blocos coesos.
 *
 * - controllers: Declara os controladores que escutam as rotas HTTP.
 * - providers: Declara os serviços e repositórios gerenciados pelo NestJS DI.
 * - exports: Permite que outros módulos usem o Service ou Repository se necessário.
 *
 * É este módulo que é carregado diretamente no teste de integração via
 * Test.createTestingModule({ imports: [TarefasModule] }).
 */
@Module({
  controllers: [TarefasController],
  providers: [TarefasService, TarefasRepository],
  exports: [TarefasService, TarefasRepository],
})
export class TarefasModule {}

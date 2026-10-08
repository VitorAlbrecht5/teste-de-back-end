import { IsNotEmpty, IsString, MinLength } from 'class-validator';

/**
 * ============================================================================
 * DTO: Data Transfer Object (Objeto de Transferência de Dados)
 * ============================================================================
 * Esta classe define o formato e as regras de validação do corpo (body)
 * da requisição HTTP quando um cliente tenta criar uma nova tarefa.
 *
 * Decorators do class-validator:
 * - @IsString: Garante que o valor enviado seja do tipo texto.
 * - @IsNotEmpty: Impede o envio de campos vazios ou nulos.
 * - @MinLength(3): Exige um tamanho mínimo de 3 caracteres para o título.
 */
export class CriarTarefaDto {
  @IsString({ message: 'O título deve ser um texto' })
  @IsNotEmpty({ message: 'O título é obrigatório' })
  @MinLength(3, { message: 'O título deve ter no mínimo 3 caracteres' })
  titulo: string;
}

import {
  calcularMedia, situacao, estaAprovado, maiorNota, quantidadeAcimaDe,
} from './boletim';

describe('Boletim Escolar', () => {
  test('CT-01: deve calcular a média de [5, 6] como 5.5', () => {
    // Arrange
    const notas = [5, 6];
    // Act
    const resultado = calcularMedia(notas);
    // Assert
    expect(resultado).toBe(5.5);
  });

  test('CT-02: deve aprovar com média exatamente 7', () => {
    // Arrange
    const media = 7;
    // Act
    const resultado = situacao(media);
    // Assert
    expect(resultado).toBe('Aprovado');
  });

  test('CT-03: deve reprovar com média 4.9', () => {
    // Arrange
    const media = 4.9;
    // Act
    const resultado = situacao(media);
    // Assert
    expect(resultado).toBe('Reprovado');
  });

  test('CT-04: deve indicar que média 6 não está aprovada', () => {
    // Arrange
    const media = 6;
    // Act
    const resultado = estaAprovado(media);
    // Assert
    expect(resultado).toBe(false);
  });

  test('CT-05: deve contar 2 notas maiores ou iguais a 7', () => {
    // Arrange
    const notas = [4, 7, 8.5, 6.9];
    const corte = 7;
    // Act
    const resultado = quantidadeAcimaDe(notas, corte);
    // Assert
    expect(resultado).toBe(2);
  });

  test('CT-06: deve encontrar 9.5 como maior nota', () => {
    // Arrange
    const notas = [6, 9.5, 8];
    // Act
    const resultado = maiorNota(notas);
    // Assert
    expect(resultado).toBe(9.5);
  });

  test('CT-07: deve indicar que média 8 está aprovada', () => {
    // Arrange
    const media = 8;
    // Act
    const resultado = estaAprovado(media);
    // Assert
    expect(resultado).toBe(true);
  });
});

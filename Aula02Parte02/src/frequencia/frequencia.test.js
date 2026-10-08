import { percentualPresenca, reprovadoPorFalta } from './frequencia';

describe('Frequência', () => {
  test('CT-01: deve calcular 90% de presença com 4 faltas em 40 aulas', () => {
    // Arrange
    const aulasDadas = 40;
    const faltas = 4;
    // Act
    const resultado = percentualPresenca(aulasDadas, faltas);
    // Assert
    expect(resultado).toBe(90);
  });

  test('CT-02: deve calcular 100% de presença sem faltas', () => {
    // Arrange
    const aulasDadas = 40;
    const faltas = 0;
    // Act
    const resultado = percentualPresenca(aulasDadas, faltas);
    // Assert
    expect(resultado).toBe(100);
  });

  test('CT-03: não deve reprovar com 90% de presença', () => {
    // Arrange
    const aulasDadas = 40;
    const faltas = 4;
    // Act
    const resultado = reprovadoPorFalta(aulasDadas, faltas);
    // Assert
    expect(resultado).toBe(false);
  });

  test('CT-04: deve reprovar com 70% de presença', () => {
    // Arrange
    const aulasDadas = 40;
    const faltas = 12;
    // Act
    const resultado = reprovadoPorFalta(aulasDadas, faltas);
    // Assert
    expect(resultado).toBe(true);
  });

  test('CT-05: não deve reprovar com exatamente 75% de presença', () => {
    // Arrange
    const aulasDadas = 40;
    const faltas = 10;
    // Act
    const resultado = reprovadoPorFalta(aulasDadas, faltas);
    // Assert
    expect(resultado).toBe(false);
  });
});

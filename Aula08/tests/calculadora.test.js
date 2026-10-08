const { somar, verificarIdade } = require('../src/calculadora');

describe('Testes da Calculadora (Versão Inicial - Cobertura Parcial)', () => {
    test('Deve somar 2 + 3 e retornar 5', () => {
        expect(somar(2, 3)).toBe(5);
    });

    test('Deve verificar que 20 anos é maior de idade', () => {
        expect(verificarIdade(20)).toBe('Maior de idade');
    });
});

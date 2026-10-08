/**
 * Bateria de Testes Automatizados com Jest
 * 
 * Disciplina: Testes de Back-End - Aula 09 (SENAI)
 * Técnicas Abordadas:
 *  - Caixa Preta: Partição de Equivalência
 *  - Caixa Preta: Análise do Valor Limite (BVA)
 *  - Caixa Preta: Tabela de Decisão
 *  - Caixa Branca: Cobertura de Código e Teste de Mutação
 */

const { validarEmprestimo } = require('../src/emprestimo');

describe('Validação de Empréstimo - Técnicas de Caixa Preta e Caixa Branca', () => {

    // =========================================================================
    // PARTE 1: CAIXA PRETA — PARTIÇÃO DE EQUIVALÊNCIA
    // Selecionamos representantes de cada classe/partição (Menor que 18, Entre 18 e 65, Maior que 65)
    // =========================================================================
    describe('1. Partição de Equivalência (Idade)', () => {
        
        test('Partição Inválida (Menor de idade): deve rejeitar idade = 15', () => {
            // Salário: R$ 3.000 | Parcela: R$ 600 (válida, 20% do salário)
            const resultado = validarEmprestimo(3000, 15, 600);
            expect(resultado).toBe(false);
        });

        test('Partição Válida (Faixa permitida): deve aprovar idade = 30 com parcela válida', () => {
            // Salário: R$ 3.000 | Parcela: R$ 600 (válida, 20% do salário)
            const resultado = validarEmprestimo(3000, 30, 600);
            expect(resultado).toBe(true);
        });

        test('Partição Inválida (Acima da faixa): deve rejeitar idade = 70', () => {
            // Salário: R$ 3.000 | Parcela: R$ 600 (válida, 20% do salário)
            const resultado = validarEmprestimo(3000, 70, 600);
            expect(resultado).toBe(false);
        });
    });

    // =========================================================================
    // PARTE 2: CAIXA PRETA — ANÁLISE DE VALOR LIMITE (FRONTEIRAS)
    // Testamos os extremos exatos e seus vizinhos imediatos (off-by-one errors)
    // =========================================================================
    describe('2. Análise de Valor Limite (Fronteiras de Idade)', () => {
        
        // Limite inferior: 18 anos
        test('Fronteira inferior externa: deve rejeitar idade de 17 anos (18 - 1)', () => {
            expect(validarEmprestimo(3000, 17, 600)).toBe(false);
        });

        test('Fronteira inferior exata: deve aceitar idade de 18 anos (limite exato)', () => {
            expect(validarEmprestimo(3000, 18, 600)).toBe(true);
        });

        test('Fronteira inferior interna: deve aceitar idade de 19 anos (18 + 1)', () => {
            expect(validarEmprestimo(3000, 19, 600)).toBe(true);
        });

        // Limite superior: 65 anos
        test('Fronteira superior interna: deve aceitar idade de 64 anos (65 - 1)', () => {
            expect(validarEmprestimo(3000, 64, 600)).toBe(true);
        });

        test('Fronteira superior exata: deve aceitar idade de 65 anos (limite exato)', () => {
            expect(validarEmprestimo(3000, 65, 600)).toBe(true);
        });

        test('Fronteira superior externa: deve rejeitar idade de 66 anos (65 + 1)', () => {
            expect(validarEmprestimo(3000, 66, 600)).toBe(false);
        });
    });

    describe('2. Análise de Valor Limite (Fronteira Financeira - Parcela)', () => {
        // Salário = R$ 3.000 | Teto de 30% = R$ 900
        const salario = 3000;

        test('Fronteira financeira interna: deve aprovar parcela de R$ 899 (abaixo de 30%)', () => {
            expect(validarEmprestimo(salario, 30, 899)).toBe(true);
        });

        test('Fronteira financeira exata: deve aprovar parcela de R$ 900 (exatamente 30%)', () => {
            expect(validarEmprestimo(salario, 30, 900)).toBe(true);
        });

        test('Fronteira financeira externa: deve rejeitar parcela de R$ 901 (acima de 30%)', () => {
            expect(validarEmprestimo(salario, 30, 901)).toBe(false);
        });
    });

    // =========================================================================
    // PARTE 3: CAIXA PRETA — TABELA DE DECISÃO
    // Combinações sistemáticas de Idade e Parcela
    // =========================================================================
    describe('3. Tabela de Decisão (Combinação de Condições)', () => {
        
        test('Regra 1 [Idade Válida / Parcela Válida]: deve retornar true', () => {
            // Idade: 25 (Válida) | Parcela: R$ 500 em Salário R$ 3.000 (Válida)
            expect(validarEmprestimo(3000, 25, 500)).toBe(true);
        });

        test('Regra 2 [Idade Válida / Parcela Inválida]: deve retornar false', () => {
            // Idade: 25 (Válida) | Parcela: R$ 1.200 em Salário R$ 3.000 (40% - Inválida)
            expect(validarEmprestimo(3000, 25, 1200)).toBe(false);
        });

        test('Regra 3 [Idade Inválida / Parcela Válida]: deve retornar false', () => {
            // Idade: 16 (Inválida) | Parcela: R$ 500 em Salário R$ 3.000 (Válida)
            expect(validarEmprestimo(3000, 16, 500)).toBe(false);
        });

        test('Regra 4 [Idade Inválida / Parcela Inválida]: deve retornar false', () => {
            // Idade: 75 (Inválida) | Parcela: R$ 1.500 em Salário R$ 3.000 (50% - Inválida)
            expect(validarEmprestimo(3000, 75, 1500)).toBe(false);
        });
    });

});

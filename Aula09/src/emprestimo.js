/**
 * Módulo de Validação de Empréstimo
 * 
 * Regras de Negócio (Exemplo Didático):
 * 1. A idade do solicitante deve ser entre 18 e 65 anos (inclusive).
 * 2. O valor da parcela mensal não pode ultrapassar 30% do salário mensal.
 * 3. Se todas as condições forem atendidas, retorna true. Caso contrário, false.
 * 
 * @param {number} salario - Salário mensal do solicitante
 * @param {number} idade - Idade do solicitante em anos
 * @param {number} valorParcela - Valor da parcela mensal pretendida
 * @returns {boolean} true se o empréstimo for aprovado, false caso contrário
 */
function validarEmprestimo(salario, idade, valorParcela) {
    // Regra 1: Validação de Idade (Fronteiras: 18 a 65 anos)
    if (idade < 18 || idade > 65) {
        return false;
    }

    // Regra 2: Validação Financeira (Margem consignável: máximo 30% da renda)
    if (valorParcela > salario * 0.30) {
        return false;
    }

    // Se passou por todas as regras, o empréstimo é válido
    return true;
}

// Exporta a função no padrão CommonJS para que possa ser importada nos testes com require()
module.exports = { validarEmprestimo };

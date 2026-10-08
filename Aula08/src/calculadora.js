
function somar(a, b) {
    return a + b;
}

function subtrair(a, b) {
    return a - b;
}

function verificarIdade(idade) {
    if (idade >= 18) {
        return "Maior de idade";
    } else {
        return "Menor de idade";
    }
}

module.exports = {
    somar,
    subtrair,
    verificarIdade
};

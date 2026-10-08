/**
 * BANCO DE DADOS EM MEMÓRIA
 * 
 * Para focar exclusivamente no aprendizado de Testes de Sistema (E2E),
 * utilizamos estruturas simples em memória (Arrays de objetos).
 * 
 * Disponibilizamos a função `resetarDados()` para garantir que cada teste
 * execute com o estado limpo e previsível.
 */

// Estado inicial padrão
const USUARIOS_PADRAO = [
    {
        id: 1,
        nome: "Ana Silva",
        email: "ana@email.com",
        senha: "123456",
        role: "admin"
    }
];

const PRODUTOS_PADRAO = [
    {
        id: 1,
        nome: "Coca-Cola",
        preco: 6.00,
        estoque: 10
    }
];

// Arrays mantidos em memória
const usuarios = [];
const produtos = [];
const vendas = [];

/**
 * Restaura o estado inicial dos dados.
 * Modifica os arrays no local para manter as referências intactas.
 * Essencial para o isolamento entre testes (executado no beforeEach).
 */
function resetarDados() {
    usuarios.length = 0;
    usuarios.push(...JSON.parse(JSON.stringify(USUARIOS_PADRAO)));

    produtos.length = 0;
    produtos.push(...JSON.parse(JSON.stringify(PRODUTOS_PADRAO)));

    vendas.length = 0;
}

// Inicializa os dados na primeira carga
resetarDados();

module.exports = {
    usuarios,
    produtos,
    vendas,
    resetarDados
};

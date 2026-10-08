const mongoose = require('mongoose');

/**
 * ============================================================================
 * SCHEMA DO PRODUTO (A ÚLTIMA LINHA DE DEFESA DOS SEUS DADOS)
 * ============================================================================
 * O Schema define a estrutura, os tipos e as regras de integridade do documento.
 * Mesmo que a Controller ou Service falhem em validar, o Mongoose impede que
 * dados corrompidos ou inválidos sejam gravados no banco de dados.
 */
const produtoSchema = new mongoose.Schema(
  {
    // 1. Campo Obrigatório: impede salvar documento sem nome
    nome: {
      type: String,
      required: [true, 'O nome do produto é obrigatório'],
      trim: true
    },

    // 2. Validação Numérica com valor mínimo (não permite preço negativo)
    preco: {
      type: Number,
      required: [true, 'O preço do produto é obrigatório'],
      min: [0, 'O preço não pode ser negativo']
    },

    // 3. Enumeração: aceita apenas valores previamente autorizados
    categoria: {
      type: String,
      enum: {
        values: ['informatica', 'moveis', 'acessorios'],
        message: 'A categoria "{VALUE}" não é permitida'
      },
      default: 'informatica'
    },

    // 4. Restrição de Unicidade: cria um índice único no MongoDB
    sku: {
      type: String,
      unique: true,
      sparse: true, // Permite documentos sem SKU sem quebrar o índice
      uppercase: true,
      trim: true
    }
  },
  {
    // Adiciona automaticamente os campos createdAt e updatedAt
    timestamps: true
  }
);

/**
 * ============================================================================
 * MIDDLEWARE / HOOK: PRE-SAVE
 * ============================================================================
 * Executa automaticamente ANTES de cada documento ser persistido com .save()
 * ou .create().
 * 
 * Exemplo didático: Padroniza o nome do produto sempre em letras MAIÚSCULAS.
 * (Em casos reais, este mesmo hook é usado para fazer hash de senhas com bcrypt)
 */
produtoSchema.pre('save', function (next) {
  // 'this' referencia o documento atual que está prestes a ser salvo
  if (this.nome) {
    this.nome = this.nome.toUpperCase();
  }
  
  if (typeof next === 'function') {
    next();
  }
});

module.exports = mongoose.model('Produto', produtoSchema);

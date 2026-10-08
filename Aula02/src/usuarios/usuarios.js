const usuarios = [
  { id: 1, nome: 'Maria Silva', email: 'maria@empresa.com' },
  { id: 2, nome: 'João Souza', email: 'joao@empresa.com' },
];

function buscarUsuario(email) {
  return usuarios.find(u => u.email === email); // undefined se não achar
}

module.exports = { buscarUsuario };
const UsuariosRepository = require('./usuarios.repository');

class UsuariosService {
  /**
   * Busca um usuário pelo e-mail e formata seus dados.
   * Regra de negócio:
   * 1. Se encontrar: formata o nome para letras MAIÚSCULAS e retorna os dados.
   * 2. Se não encontrar (retornar null): lança um erro "Usuário não encontrado".
   * 
   * @param {string} email
   * @returns {Promise<{nomeCompleto: string, email: string}>}
   */
  async buscarPorEmail(email) {
    const usuario = await UsuariosRepository.findOne(email);

    if (!usuario) {
      throw new Error('Usuário não encontrado');
    }

    return {
      nomeCompleto: usuario.nome.toUpperCase(),
      email: usuario.email
    };
  }

  /**
   * Cadastra um novo usuário.
   * Regra de negócio:
   * 1. Verifica se já existe um usuário com o mesmo e-mail.
   * 2. Se já existir: lança erro "E-mail já cadastrado".
   * 3. Se não existir: retorna o usuário com status "ativo".
   * 
   * @param {{nome: string, email: string}} usuario
   * @returns {Promise<{nome: string, email: string, status: string}>}
   */
  async cadastrar(usuario) {
    const existe = await UsuariosRepository.findOne(usuario.email);

    if (existe) {
      throw new Error('E-mail já cadastrado');
    }

    return {
      ...usuario,
      status: 'ativo'
    };
  }
}

module.exports = UsuariosService;

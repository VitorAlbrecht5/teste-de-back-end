/**
 * ========================================================================================
 * 🔒 MIDDLEWARE: AUTORIZAÇÃO BASEADA EM PAPEL (RBAC - Role-Based Access Control)
 * ========================================================================================
 * 
 * Diferença essencial entre Autenticação e Autorização:
 * - Autenticação (401): O sistema verifica a IDENTIDADE (quem é o usuário).
 * - Autorização (403): O sistema verifica as PERMISSÕES (o que o usuário pode fazer).
 * 
 * Padrão Factory (Fábrica de Middlewares):
 * Esta função recebe os papéis permitidos como parâmetro e retorna uma função middleware
 * customizada para proteger rotas específicas (ex.: apenas 'admin', ou ['admin', 'gerente']).
 * ========================================================================================
 */

/**
 * Cria um middleware de autorização por papéis/perfis
 * @param {string|string[]} rolesPermitidas Papel ou lista de papéis com permissão de acesso
 * @returns {import('express').RequestHandler} Função middleware do Express
 */
function autorizarRole(rolesPermitidas) {
  // Normaliza o parâmetro para sempre lidar com um array de strings
  const roles = Array.isArray(rolesPermitidas) ? rolesPermitidas : [rolesPermitidas];

  return (req, res, next) => {
    // 1. Defesa preventiva: Verifica se o middleware de autenticação foi executado antes
    if (!req.user) {
      return res.status(401).json({
        erro: 'Usuário não autenticado',
        detalhe: 'Execute o middleware de autenticação antes do controle de perfil'
      });
    }

    // 2. Verifica se a role do usuário logado está inclusa na lista de permissões
    if (!roles.includes(req.user.role)) {
      // 403 Forbidden: O usuário é reconhecido (autenticado), mas NÃO tem privilégio para esta ação
      return res.status(403).json({
        erro: 'Acesso proibido: permissão insuficiente',
        perfilNecessario: roles,
        perfilAtual: req.user.role
      });
    }

    // 3. Permissão concedida: Prossegue para a execução do controller
    return next();
  };
}

module.exports = {
  autorizarRole,
};

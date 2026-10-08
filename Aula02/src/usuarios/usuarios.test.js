
import { buscarUsuario} from  './usuarios';

describe('buscarUsuario', () => {
  test('encontra o usuário pelo objeto completo', () => {
    const resultado = buscarUsuario('maria@empresa.com');

    // toEqual: compara CONTEÚDO, não referência
    expect(resultado).toEqual({ id: 1, nome: 'Maria Silva', email: 'maria@empresa.com' });
  });


  test('usuário encontrado é truthy', () => {
    const resultado = buscarUsuario('maria@empresa.com');
    console.log(resultado);
    expect(resultado).toBeTruthy();
  });


  test('e-mail inexistente é falsy', () => {
    const resultado = buscarUsuario('fantasma@empresa.com');
    // .find() não achou nada, retornou undefined — que é falsy
    expect(resultado).toBeFalsy();
  });
});
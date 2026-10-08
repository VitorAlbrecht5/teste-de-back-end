import { buscarPedidosPorId } from "./pedidos";

describe('Busca de pedidos', () =>{
    test('Deve encontra o usuário pelo objeto completo', ()=>{
        const resultado = buscarPedidosPorId(1);
        expect(resultado.nome).toEqual('pedido01');
    })

    test('Deve retornar o pedido para um ID existente', ()=>{
        const pedido = buscarPedidosPorId(1);
        console.log(pedido)
        expect(pedido.id).toBe(1)
        expect(pedido).toBeTruthy()
    })
    
    test('Deve retornar null para pedido não encontrado', ()=>{
        const pedido = buscarPedidosPorId(3);
        expect(pedido).toBeFalsy();

    })

})
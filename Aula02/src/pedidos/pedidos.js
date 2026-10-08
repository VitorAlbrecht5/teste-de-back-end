const pedidosAtivos = [
    {id : 1, nome : 'pedido01', valor : 100 },
    {id : 2, nome : 'pedido02', valor : 100 },
]

export const buscarPedidosPorId = (id) => {
    if(id <= 0) return undefined
    const pedido = pedidosAtivos.find(p => p.id === id);
    return pedido || null

}

describe('Diferenças entre comaparações', () => {
    test('toBe', () => {
        expect( 2 + 3 ).toBe(5)

        const nome = 'Joao'
        expect(nome.toLowerCase()).toBe('joao')
    })
    
    test('Trabalhando com objetos', () => {
       const obj1 ={nome:'Joao', idade: 30}
       const obj2 ={nome:'Joao', idade: 30}

       
       expect(obj1).toBe(obj1)
       expect(obj1).toEqual(obj2)

    })


})
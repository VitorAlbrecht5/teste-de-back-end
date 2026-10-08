// const somar = require('./calculadora');

import { somar } from "./calculadora";

describe('Operações matemáticas', () =>{
    //it
    test('Deve somar dois números', () =>{
        // Arrange
        const a = 2;
        const b = 3;
        const esperadoSoma = 5
        
        // Act 
        const resultado = somar(a, b);
        // console.log(resultado == 5);

        // Assert
        expect(resultado).toBe(esperadoSoma)

    }) 
});
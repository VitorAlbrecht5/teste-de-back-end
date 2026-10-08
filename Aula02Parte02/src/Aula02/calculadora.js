export const somar = (a, b) => a + b;
export const subtrair = (a, b) => a - b;
export const multiplicar = (a, b) => a * b;
export const dividir = (a, b) => {
  if (b === 0) return null;
  return a / b;
};
export const ehPar = (n) => n % 2 === 0;
export const potencia = (base, expoente) => base ** expoente;
export const porcentagem = (valor, percentual) => (valor * percentual) / 100;
export const mediaDeTres = (a, b, c) => (a + b + c) / 3;
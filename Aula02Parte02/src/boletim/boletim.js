export const calcularMedia = (notas) => {
  if (notas.length === 0) return 0;
  const soma = notas.reduce((total, nota) => total + nota, 0);
  return soma / notas.length;
};

export const situacao = (media) => {
  if (media >= 7) return 'Aprovado';
  if (media >= 5) return 'Recuperação';
  return 'Reprovado';
};

export const estaAprovado = (media) => media >= 7;

export const maiorNota = (notas) => Math.max(...notas);

export const quantidadeAcimaDe = (notas, corte) =>
  notas.filter((nota) => nota >= corte).length;

export const percentualPresenca = (aulasDadas, faltas) => {
  return ((aulasDadas - faltas) / aulasDadas) * 100;
};

export const reprovadoPorFalta = (aulasDadas, faltas) => {
  const presenca = percentualPresenca(aulasDadas, faltas);
  return presenca < 75;
};

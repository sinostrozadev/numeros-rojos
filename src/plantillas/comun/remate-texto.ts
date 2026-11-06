/** Texto del remate (módulo puro, lo usan los planes y Remate.tsx). */
/** Parte el remate en sus dos mitades simétricas (primer punto, punto y coma o dos puntos; si no, la coma). */
export const mitadesRemate = (texto: string): [string, string] => {
  const m = /^(.+?[.;:])\s+(.+)$/.exec(texto.trim());
  if (m) return [m[1], m[2]];
  const coma = texto.indexOf(', ');
  if (coma > 10) return [texto.slice(0, coma + 1), texto.slice(coma + 2)];
  return [texto, ''];
};


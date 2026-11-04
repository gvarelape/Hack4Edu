// Utilidades de texto propias del experimento de pH. Sin React.

// "a", "a y b", "a, b y c"
export function unirLista(textos) {
  if (textos.length <= 1) return textos.join('')
  return `${textos.slice(0, -1).join(', ')} y ${textos[textos.length - 1]}`
}

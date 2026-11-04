// PROVISIONAL: pedir al core. normalizarTexto y formatear están en CONTRATO.md (punto 1);
// cuando exista src/core, borrar estas dos e importarlas desde '../../core'.
export function normalizarTexto(texto) {
  return String(texto)
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

export function formatear(numero, decimales) {
  return numero.toFixed(decimales).replace('.', ',')
}

// "a", "a y b", "a, b y c"
export function unirLista(textos) {
  if (textos.length <= 1) return textos.join('')
  return `${textos.slice(0, -1).join(', ')} y ${textos[textos.length - 1]}`
}

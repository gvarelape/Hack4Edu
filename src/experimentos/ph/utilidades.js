// Utilidades propias del experimento de pH.

// "a", "a y b", "a, b y c"
export function unirLista(textos) {
  if (textos.length <= 1) return textos.join('')
  return `${textos.slice(0, -1).join(', ')} y ${textos[textos.length - 1]}`
}

// Devuelve una copia de la lista con el elemento i movido una posición (direccion: -1 sube, 1 baja).
export function moverElemento(lista, i, direccion) {
  const j = i + direccion
  if (j < 0 || j >= lista.length) return lista
  const copia = [...lista]
  ;[copia[i], copia[j]] = [copia[j], copia[i]]
  return copia
}

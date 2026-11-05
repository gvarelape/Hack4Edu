// Da el tiempo de cada fotograma con requestVideoFrameCallback.
// Safari en iPhone deja `mediaTime` siempre en 0 con la cámara en directo: entonces se cambia a otra
// fuente en los primeros fotogramas y se sigue con ella, para no mezclar escalas durante una medida.

const REPETICIONES_PARA_CAMBIAR = 2

export function crearRelojFotogramas(esDirecto) {
  const fuentes = esDirecto
    ? [
        { leer: (_ahora, datos) => datos.mediaTime, escala: 1 },
        { leer: (_ahora, datos) => datos.presentationTime, escala: 1000 },
        { leer: (ahora) => ahora, escala: 1000 },
      ]
    : [{ leer: (_ahora, datos) => datos.mediaTime, escala: 1 }]
  let indice = 0
  let anterior = null
  let repetidos = 0
  let tiempo = 0

  return (ahora, datos) => {
    let valor = fuentes[indice].leer(ahora, datos)
    const hayOtra = indice < fuentes.length - 1
    const sinAvanzar = !Number.isFinite(valor) || valor === anterior
    repetidos = sinAvanzar ? repetidos + 1 : 0

    if (hayOtra && (repetidos >= REPETICIONES_PARA_CAMBIAR || !Number.isFinite(valor))) {
      indice++
      repetidos = 0
      valor = fuentes[indice].leer(ahora, datos)
      // La nueva fuente empieza donde iba el tiempo: solo cuentan las diferencias.
      anterior = Number.isFinite(valor) ? valor : null
      return tiempo
    }
    if (Number.isFinite(valor)) {
      if (anterior !== null) tiempo += (valor - anterior) / fuentes[indice].escala
      anterior = valor
    }
    return indice === 0 && Number.isFinite(valor) ? valor : tiempo
  }
}

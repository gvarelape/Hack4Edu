// Compara el vector de la pregunta del alumno con los del banco. Sin React ni modelo.

export const DIMENSIONES = 384
// Con `e5`, hasta lo que no tiene relación da un coseno alto: lo útil está entre 0,80 y 1.
const COSENO_MINIMO = 0.8
const ESCALA_ENTERO = 127

export const reajustarCoseno = (coseno) =>
  Math.max(0, Math.min(1, (coseno - COSENO_MINIMO) / (1 - COSENO_MINIMO)))

// Los vectores se guardan como enteros de 8 bits en base64: ocupan la cuarta parte.
export function codificarVectores(vectores) {
  const bytes = new Int8Array(vectores.length * DIMENSIONES)
  vectores.forEach((vector, fila) => {
    vector.forEach((valor, columna) => {
      bytes[fila * DIMENSIONES + columna] = Math.round(valor * ESCALA_ENTERO)
    })
  })
  let binario = ''
  const sinSigno = new Uint8Array(bytes.buffer)
  for (const byte of sinSigno) binario += String.fromCharCode(byte)
  return btoa(binario)
}

export function decodificarVectores(base64) {
  const binario = atob(base64)
  const bytes = new Int8Array(binario.length)
  for (let i = 0; i < binario.length; i++) bytes[i] = (binario.charCodeAt(i) << 24) >> 24
  return bytes
}

// La similitud con una pregunta es la de su frase más parecida.
export function similitudConVectores(vectorAlumno, bytes) {
  let mejor = -1
  for (let inicio = 0; inicio < bytes.length; inicio += DIMENSIONES) {
    let producto = 0
    for (let i = 0; i < DIMENSIONES; i++) producto += vectorAlumno[i] * bytes[inicio + i]
    mejor = Math.max(mejor, producto / ESCALA_ENTERO)
  }
  return reajustarCoseno(mejor)
}

// Devuelve [[id, similitud]…]. Una pregunta sin vector se queda fuera y solo cuenta su nivel 1;
// si no hay ninguno, devuelve null.
export function puntuarPreguntas(vectorAlumno, preguntas, vectoresPorHuella) {
  const puntos = []
  for (const [id, huella] of preguntas) {
    const bytes = vectoresPorHuella.get(huella)
    if (bytes) puntos.push([id, similitudConVectores(vectorAlumno, bytes)])
  }
  return puntos.length > 0 ? puntos : null
}

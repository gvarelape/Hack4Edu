// Pasa el banco de pruebas por buscarRespuesta y cuenta aciertos y fallos. Sin React.
import { buscarRespuesta } from './buscarRespuesta.js'

/**
 * Devuelve { total, aciertos, porcentaje, equivocadas, casi, msPorBusqueda, fallos }.
 * - acierto: responde la pregunta esperada, o no responde si se esperaba null.
 * - equivocada: responde directamente con otra pregunta (lo más grave).
 * - casi: no responde, pero la esperada está entre las opciones de "¿Quieres decir…?".
 */
export async function evaluarPruebas(pruebas, preguntas) {
  const fallos = []
  let aciertos = 0
  let equivocadas = 0
  let casi = 0
  const inicio = performance.now()

  for (const prueba of pruebas) {
    const { mejor, sugerencias, confianza } = await buscarRespuesta(prueba.texto, preguntas)
    const obtenido = mejor?.id ?? null
    if (obtenido === prueba.esperado) {
      aciertos++
      continue
    }
    const tipo = obtenido
      ? 'equivocada'
      : sugerencias.some((s) => s.id === prueba.esperado)
        ? 'casi'
        : 'sin-respuesta'
    if (tipo === 'equivocada') equivocadas++
    if (tipo === 'casi') casi++
    fallos.push({ ...prueba, obtenido, confianza, tipo })
  }

  const total = pruebas.length
  return {
    total,
    aciertos,
    porcentaje: total ? aciertos / total : 0,
    equivocadas,
    casi,
    msPorBusqueda: total ? (performance.now() - inicio) / total : 0,
    fallos,
  }
}

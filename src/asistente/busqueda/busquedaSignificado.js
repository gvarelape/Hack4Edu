// PROVISIONAL: el nivel 2 (búsqueda por significado) está aparcado. Ver ASISTENTE.md.
// Si se retoma, Gabriel sustituye este archivo sin cambiar lo que exporta.

/**
 * Similitud por significado de cada pregunta del banco con el texto del alumno.
 * Devolverá Promise<Map<id, similitud 0–1>>. Mientras esté aparcado, siempre null:
 * buscarRespuesta usa entonces solo el nivel 1.
 */
export async function puntuarPorSignificado() {
  return null
}

// Sin modelo no hay nada que descargar: la app está lista para usar sin internet.
export function estadoModeloAsistente() {
  return 'listo'
}

export async function descargarModeloAsistente(onProgreso) {
  onProgreso?.(1)
}

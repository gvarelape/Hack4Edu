// Funciones puras para mostrar los registros del cuaderno. Sin React.

const CIENCIAS = {
  Química: { clase: 'quimica' },
  Física: { clase: 'fisica' },
  Sonido: { clase: 'sonido' },
}

const CIENCIA_DESCONOCIDA = { clase: 'otra' }

/** Clase CSS del color de una ciencia ('Química' | 'Física' | 'Sonido'). */
export function datosCiencia(ciencia) {
  return CIENCIAS[ciencia] ?? CIENCIA_DESCONOCIDA
}

const formatoFecha = new Intl.DateTimeFormat('es-ES', {
  day: 'numeric',
  month: 'short',
  year: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
})

/** "2026-11-03T10:24:00.000Z" → "3 nov 2026, 11:24" (en la hora del móvil). */
export function formatearFecha(fechaIso) {
  const fecha = new Date(fechaIso)
  if (Number.isNaN(fecha.getTime())) return ''
  // Algunos navegadores ponen "nov." o "3 de nov de 2026": se deja todo como "3 nov 2026".
  return formatoFecha.format(fecha).replace(/\./g, '').replace(/ de /g, ' ')
}

const formatoMes = new Intl.DateTimeFormat('es-ES', { month: 'short' })
const formatoHora = new Intl.DateTimeFormat('es-ES', { hour: '2-digit', minute: '2-digit' })

/**
 * Trozos de la fecha para escribirla en el margen del cuaderno:
 * { dia: '3', mes: 'nov', hora: '11:24', anio: '2026' }. anio es '' si es el año actual.
 */
export function partesFecha(fechaIso, ahora = new Date()) {
  const fecha = new Date(fechaIso)
  if (Number.isNaN(fecha.getTime())) return null
  const anio = fecha.getFullYear()
  return {
    dia: String(fecha.getDate()),
    mes: formatoMes.format(fecha).replace(/\./g, ''),
    hora: formatoHora.format(fecha),
    anio: anio === ahora.getFullYear() ? '' : String(anio),
  }
}

/** El primer elemento de resultado.valores, o null si no hay. */
export function valorDestacado(registro) {
  const primero = registro?.resultado?.valores?.[0]
  return primero && typeof primero.valor === 'number' ? primero : null
}

/** "Tienes 1 experimento guardado" / "Tienes 3 experimentos guardados". */
export function textoCantidad(cantidad) {
  return cantidad === 1
    ? 'Tienes 1 experimento guardado.'
    : `Tienes ${cantidad} experimentos guardados.`
}

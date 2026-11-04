// Funciones puras para mostrar los registros del cuaderno. Sin React.

const CIENCIAS = {
  Química: { clase: 'quimica', icono: 'matraz' },
  Física: { clase: 'fisica', icono: 'rampa' },
  Sonido: { clase: 'sonido', icono: 'onda' },
}

const CIENCIA_DESCONOCIDA = { clase: 'otra', icono: 'matraz' }

/** Clase CSS e icono de una ciencia ('Química' | 'Física' | 'Sonido'). */
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

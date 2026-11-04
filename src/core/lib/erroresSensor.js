const NOMBRES = { camara: 'la cámara', microfono: 'el micrófono' }

// Traduce los errores del navegador a un mensaje que le diga al alumno qué hacer.
export function mensajeErrorSensor(error, sensor) {
  const nombre = NOMBRES[sensor]
  switch (error?.name) {
    case 'NotAllowedError':
    case 'SecurityError':
      return `No podemos usar ${nombre}. Revisa que le has dado permiso en los ajustes del navegador.`
    case 'NotFoundError':
    case 'OverconstrainedError':
      return `No encontramos ${nombre} en este dispositivo.`
    case 'NotReadableError':
    case 'AbortError':
      return `Parece que otra app está usando ${nombre}. Ciérrala y vuelve a intentarlo.`
    default:
      return `No hemos podido abrir ${nombre}. Vuelve a intentarlo.`
  }
}

export const mensajeNavegadorNoCompatible = (sensor) =>
  `Este navegador no deja usar ${NOMBRES[sensor]}. Prueba con Chrome o Safari actualizados.`

export const mensajeSensorCortado = (sensor) =>
  `Se ha cortado ${NOMBRES[sensor]}. Vuelve a intentarlo.`

export const mensajeArchivoNoValido = (tipo) =>
  `No hemos podido leer el archivo de ${tipo}. Prueba con otro.`

// Qué decirle al alumno cuando lo que ha tocado no puede ser la pelota.
const MENSAJES_ELECCION = {
  'no-encontrada': 'No la encuentro. Toca justo en el centro de la pelota.',
  'color-comun': 'Ese color está por toda la imagen. Toca la pelota o busca un fondo más liso.',
  'otro-objeto': 'Hay algo más grande de ese color. Quítalo de la imagen o usa otra pelota.',
}

export const mensajeEleccion = (problema) => MENSAJES_ELECCION[problema]

// Títulos y ayuda del paso de la pelota, según quién la haya encontrado.
export function textosPelota(color, origenColor) {
  if (color && origenColor === 'ia') {
    return {
      titulo: '¡He encontrado la pelota!',
      ayuda:
        'Comprueba que el círculo está sobre la pelota. Si no es esa, tócala en la imagen. Luego pulsa "Grabar" y suéltala sin empujar.',
    }
  }
  if (color) {
    return {
      titulo: '¡Ya la sigo!',
      ayuda:
        'Comprueba que el círculo está sobre la pelota. Luego pulsa "Grabar" y suéltala sin empujar.',
    }
  }
  return {
    titulo: 'Toca la pelota',
    ayuda: 'Pon la pelota arriba de la rampa, quieta, y tócala en la imagen.',
  }
}

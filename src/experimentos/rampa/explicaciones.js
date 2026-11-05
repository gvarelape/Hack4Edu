// Explicaciones automáticas según lo medido.
import { formatear } from '../../core/utilidades.js'

const MAXIMO_EXPLICACIONES = 3
const MINIMO_PUNTOS_CLAROS = 20
const DIFERENCIA_PREDICCION = 0.3

// Recibe { gSinRodadura, errorPorcentaje, puntosValidos, tiempoBajada, prediccion }.
// Devuelve entre 1 y 3 explicaciones, de la más importante a la menos.
export function generarExplicaciones({
  gSinRodadura,
  errorPorcentaje,
  puntosValidos,
  tiempoBajada,
  prediccion,
}) {
  const explicaciones = []

  if (gSinRodadura >= 5 && gSinRodadura <= 8.5) {
    explicaciones.push({
      titulo: '¿Por qué sin contar la rodadura sale menos de 9,8?',
      texto: `Sin contar que la bola rueda te sale ${formatear(gSinRodadura, 1)} m/s². La bola, además de bajar, gira. Parte de su energía se gasta en girar, así que baja más despacio. Por eso hay que tenerlo en cuenta en el cálculo.`,
      preguntaId: 'rampa-rodadura',
    })
  }

  if (errorPorcentaje > 20) {
    explicaciones.push({
      titulo: '¿Por qué me ha salido tan lejos de 9,8?',
      texto:
        'La gravedad siempre es la misma, unos 9,8 m/s². Lo que cambia es lo que mides en cada rampa: la inclinación, el rozamiento, la superficie y la propia pelota influyen, así que no tiene por qué salir exacto. Para acercarte más, prueba una rampa más lisa e inclinada y revisa bien las cintas y las medidas.',
      preguntaId: 'rampa-error-grande',
    })
  } else if (errorPorcentaje <= 10) {
    explicaciones.push({
      titulo: '¡Muy buena medida! ¿Qué la ha hecho tan precisa?',
      texto: `Te has quedado a un ${formatear(errorPorcentaje, 1)} % del valor real. Una rampa recta, un móvil bien quieto y unas marcas bien tocadas ayudan mucho. ¡Buen trabajo!`,
      preguntaId: 'rampa-buena-medida',
    })
  }

  if (puntosValidos < MINIMO_PUNTOS_CLAROS) {
    explicaciones.push({
      titulo: '¿Por qué hay tan pocos puntos?',
      texto: `Solo hemos podido usar ${puntosValidos} puntos. Puede que la rampa sea corta, que el móvil vaya lento o que la cámara esté lejos. Con una rampa más larga y menos inclinada tendrás más puntos.`,
      preguntaId: 'rampa-pocos-puntos',
    })
  }

  if (prediccion && Number.isFinite(prediccion.valor)) {
    const diferencia = Math.abs(prediccion.valor - tiempoBajada) / tiempoBajada
    if (diferencia > DIFERENCIA_PREDICCION) {
      explicaciones.push({
        titulo: '¿Por qué tardó distinto de lo que predije?',
        texto: `Predijiste ${formatear(prediccion.valor)} s y ha tardado ${formatear(tiempoBajada, 2)} s. No pasa nada: comparar lo que esperabas con lo que pasa es justo hacer ciencia. Piensa qué puede haber cambiado.`,
        preguntaId: 'general-hipotesis-falsa',
      })
    }
  }

  // El contrato pide al menos una: puede quedar vacío con un error medio y una g sin rodadura rara.
  if (explicaciones.length === 0) {
    explicaciones.push({
      titulo: '¿Por qué no sale exactamente 9,8?',
      texto: `Te has quedado a un ${formatear(errorPorcentaje, 1)} % del valor real. Ninguna medida es perfecta: siempre hay pequeños errores al marcar las cintas o al medir la rampa. Repetir la medida ayuda a afinar.`,
      preguntaId: 'general-error-medida',
    })
  }

  return explicaciones.slice(0, MAXIMO_EXPLICACIONES)
}

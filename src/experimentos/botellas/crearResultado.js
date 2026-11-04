// Monta el objeto Resultado de CONTRATO.md a partir de las medidas del alumno.

import { crearExplicaciones } from './explicaciones.js'
import {
  VELOCIDAD_REFERENCIA,
  frecuenciaTeorica,
  tendenciaAlLlenar,
  velocidadSonido,
} from './modelo.js'

const PUNTOS_CURVA = 50

const redondear = (valor, decimales = 0) => Number(valor.toFixed(decimales))

// medidas: [{ alturaCm, frecuencia }], al menos una. prediccion: { texto, valor } o null.
export function crearResultado(medidas, prediccion) {
  const ordenadas = [...medidas].sort((a, b) => a.alturaCm - b.alturaCm)
  const velocidad = velocidadSonido(ordenadas)
  const tendencia = tendenciaAlLlenar(ordenadas)
  const predicho = leerPrediccion(prediccion)
  const prediccionAcertada = predicho && tendencia ? predicho === tendencia : null

  return {
    resumen: crearResumen(velocidad, tendencia),
    valores: crearValores(velocidad, ordenadas.length),
    comparacion: crearComparacion(prediccion, predicho, tendencia),
    explicaciones: crearExplicaciones({ medidas: ordenadas, velocidad, prediccionAcertada }),
    tabla: crearTabla(ordenadas),
    grafica: crearGrafica(ordenadas),
  }
}

// La Simulacion guarda la predicción como texto, por ejemplo 'Predijo: más agudo'.
function leerPrediccion(prediccion) {
  const texto = prediccion?.texto ?? ''
  if (texto.includes('agudo')) return 'más agudo'
  if (texto.includes('grave')) return 'más grave'
  if (texto.includes('igual')) return 'igual'
  return null
}

function crearValores(velocidad, numeroMedidas) {
  const medidas = { etiqueta: 'Medidas', valor: numeroMedidas, unidad: '' }
  if (velocidad === null) return [medidas]

  const error = (Math.abs(velocidad - VELOCIDAD_REFERENCIA) / VELOCIDAD_REFERENCIA) * 100
  return [
    { etiqueta: 'Velocidad del sonido estimada', valor: redondear(velocidad), unidad: 'm/s' },
    {
      etiqueta: `Error respecto a ${VELOCIDAD_REFERENCIA} m/s`,
      valor: redondear(error, 1),
      unidad: '%',
    },
    medidas,
  ]
}

function crearResumen(velocidad, tendencia) {
  const lineas = []
  if (tendencia === 'más agudo') lineas.push('Con más aire, el sonido ha sido más grave.')
  if (tendencia === 'más grave') {
    lineas.push('Con más aire, el sonido ha sido más agudo: es lo contrario de lo esperado.')
  }
  if (tendencia === 'igual') lineas.push('El tono casi no ha cambiado entre tus medidas.')

  if (velocidad === null) {
    lineas.push(
      'Con estas medidas no se puede calcular la velocidad del sonido. Prueba con alturas de aire bien distintas, soplando de forma continua.',
    )
    return lineas.join('\n')
  }

  lineas.push(
    `Según tus medidas, el sonido viaja a unos ${redondear(velocidad)} m/s. El valor de referencia es de unos ${VELOCIDAD_REFERENCIA} m/s.`,
  )
  lineas.push('No sale exacto porque una botella real no es un tubo perfecto.')
  return lineas.join('\n')
}

function crearComparacion(prediccion, predicho, tendencia) {
  if (!prediccion) return null
  const inicio = predicho
    ? `Predijiste que al llenar la botella sonaría ${predicho}`
    : `Tu predicción era: ${prediccion.texto}`
  if (!tendencia) {
    return `${inicio}. No se puede comprobar: necesitas medir con alturas de aire distintas.`
  }
  if (predicho === tendencia) return `${inicio}, y así ha sido. ¡Bien visto!`
  if (!predicho) return `${inicio}. Al llenar la botella, ha sonado ${tendencia}.`
  return `${inicio}, pero ha sonado ${tendencia}.`
}

function crearTabla(medidas) {
  return {
    columnas: [
      'Altura del aire (cm)',
      'Frecuencia medida (Hz)',
      'Frecuencia teórica (Hz)',
      'Diferencia (%)',
    ],
    filas: medidas.map(({ alturaCm, frecuencia }) => {
      const teorica = frecuenciaTeorica(alturaCm)
      return [
        redondear(alturaCm, 1),
        redondear(frecuencia),
        redondear(teorica),
        redondear(((frecuencia - teorica) / teorica) * 100, 1),
      ]
    }),
  }
}

function crearGrafica(medidas) {
  return {
    ejeX: 'Altura del aire (cm)',
    ejeY: 'Frecuencia (Hz)',
    series: [
      {
        nombre: 'Medido',
        tipo: 'puntos',
        rol: 'medido',
        puntos: medidas.map(({ alturaCm, frecuencia }) => ({ x: alturaCm, y: frecuencia })),
      },
      { nombre: 'Teórica', tipo: 'linea', rol: 'teorico', puntos: crearCurvaTeorica(medidas) },
    ],
  }
}

function crearCurvaTeorica(medidas) {
  const minima = medidas[0].alturaCm
  const paso = (medidas[medidas.length - 1].alturaCm - minima) / (PUNTOS_CURVA - 1)
  return Array.from({ length: PUNTOS_CURVA }, (_, i) => {
    const x = minima + i * paso
    return { x, y: frecuenciaTeorica(x) }
  })
}

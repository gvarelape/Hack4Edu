// Monta el objeto resultado.
// muestras: [{ sustancia, r, g, b, ph }] · prediccion: lo que devolvió Simulacion, o null
// calibrado: true si el alumno usó "Calibrar"
import { tipoPh } from './estimarPh.js'
import { generarExplicaciones } from './explicaciones.js'
import { agruparPorSustancia, compararOrden, leerOrdenPredicho } from './ordenSustancias.js'
import { unirLista } from './utilidades.js'

const redondear = (ph) => Math.round(ph * 10) / 10
const conMayuscula = (texto) => texto.charAt(0).toUpperCase() + texto.slice(1)
const plural = (n, palabra) => `${n} ${palabra}${n === 1 ? '' : 's'}`

function crearResumen(sustancias) {
  const cuenta = { ácida: 0, neutra: 0, básica: 0 }
  for (const s of sustancias) cuenta[tipoPh(s.ph)] += 1
  const partes = Object.entries(cuenta)
    .filter(([, n]) => n > 0)
    .map(([tipo, n]) => plural(n, tipo))
  return (
    `Has medido ${plural(sustancias.length, 'sustancia')}: ${unirLista(partes)}.\n` +
    'Recuerda que es una estimación por el color: la luz y la cámara pueden cambiarla un poco.'
  )
}

function crearComparacion(prediccion, ordenPredicho, comparacion) {
  if (!prediccion) return null
  if (!ordenPredicho) return `Tu predicción: ${prediccion.texto}`
  if (!comparacion.comparable) {
    return (
      `Predijiste este orden: ${unirLista(ordenPredicho)}. ` +
      'No has medido al menos dos de esas sustancias con el mismo nombre, así que no se puede comparar.'
    )
  }
  if (comparacion.coincide) {
    return `Predijiste este orden, de más ácida a más básica: ${unirLista(comparacion.predicho)}. ¡Las medidas te dan la razón!`
  }
  return (
    `Predijiste: ${unirLista(comparacion.predicho)}. ` +
    `Medido: ${unirLista(comparacion.medido)}. ` +
    `Han cambiado de sitio: ${unirLista(comparacion.cambiadas)}.`
  )
}

export function crearResultado({ muestras, prediccion = null, calibrado = false }) {
  const sustancias = agruparPorSustancia(muestras)
  const ordenPredicho = leerOrdenPredicho(prediccion)
  const comparacion = ordenPredicho ? compararOrden(sustancias, ordenPredicho) : null

  const valores = []
  if (sustancias.length > 0) {
    const masAcida = sustancias[0]
    const masBasica = sustancias[sustancias.length - 1]
    valores.push(
      { etiqueta: `Más ácida: ${masAcida.nombre}`, valor: redondear(masAcida.ph), unidad: 'pH' },
      { etiqueta: `Más básica: ${masBasica.nombre}`, valor: redondear(masBasica.ph), unidad: 'pH' },
    )
  }
  valores.push({ etiqueta: 'Muestras medidas', valor: muestras.length, unidad: '' })

  return {
    resumen: sustancias.length > 0 ? crearResumen(sustancias) : 'No has guardado ninguna muestra.',
    valores,
    comparacion: crearComparacion(prediccion, ordenPredicho, comparacion),
    explicaciones: generarExplicaciones({ sustancias, comparacion, calibrado }),
    tabla: {
      columnas: ['Sustancia', 'Color', 'pH', 'Tipo'],
      filas: muestras.map((m) => [
        m.sustancia,
        { color: `rgb(${m.r}, ${m.g}, ${m.b})` },
        redondear(m.ph),
        conMayuscula(tipoPh(m.ph)),
      ]),
    },
    grafica: {
      titulo: 'pH de cada muestra',
      ejeX: 'Número de muestra',
      ejeY: 'pH',
      series: [
        {
          nombre: 'Medido',
          tipo: 'puntos',
          rol: 'medido',
          puntos: muestras.map((m, i) => ({ x: i + 1, y: redondear(m.ph) })),
        },
      ],
    },
  }
}

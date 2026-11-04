// Explicaciones automáticas según lo medido (PH.md, "Asistente"). Sin React.
import { tipoPh } from './estimarPh.js'
import { formatear, normalizarTexto } from '../../core/utilidades.js'
import { unirLista } from './utilidades.js'

const MAXIMO_EXPLICACIONES = 3
const DIFERENCIA_CASI_IGUAL = 0.5
const NOMBRES_AGUA = [
  'agua',
  'agua del grifo',
  'agua mineral',
  'agua embotellada',
  'agua destilada',
]

export function esAgua(nombre) {
  return NOMBRES_AGUA.includes(normalizarTexto(nombre))
}

// sustancias va ordenada por pH, así que basta con mirar las vecinas.
function parCasiIgual(sustancias) {
  for (let i = 0; i < sustancias.length - 1; i++) {
    const diferencia = sustancias[i + 1].ph - sustancias[i].ph
    if (diferencia < DIFERENCIA_CASI_IGUAL) return [sustancias[i], sustancias[i + 1], diferencia]
  }
  return null
}

function explicacionHipotesis(comparacion) {
  if (!comparacion?.comparable || comparacion.coincide) return null
  return {
    titulo: '¿Me equivoqué en la hipótesis?',
    texto:
      `Tu predicción no ha coincidido del todo: ${unirLista(comparacion.cambiadas)} han cambiado de sitio. ` +
      '¡No pasa nada! Comprobar una idea y descubrir que no era así es justo como trabaja la ciencia. ' +
      'Piensa qué te hizo esperar ese orden.',
    preguntaId: 'general-hipotesis-falsa',
  }
}

function explicacionAgua(sustancias) {
  const agua = sustancias.find((s) => esAgua(s.nombre))
  if (!agua || tipoPh(agua.ph) === 'neutra') return null
  return {
    titulo: '¿Por qué el agua no ha salido neutra?',
    texto:
      `El agua pura tiene pH 7, pero a ti te ha salido ${formatear(agua.ph, 1)}. ` +
      'El agua del grifo lleva minerales disueltos que pueden cambiar un poco su pH. ' +
      'También influyen la luz y lo concentrada que esté el agua de lombarda.',
    preguntaId: 'ph-agua-no-neutra',
  }
}

function explicacionCasiIguales(sustancias) {
  const par = parCasiIgual(sustancias)
  if (!par) return null
  const [a, b, diferencia] = par
  return {
    titulo: '¿Por qué salen casi iguales?',
    texto:
      `«${a.nombre}» y «${b.nombre}» solo se diferencian en ${formatear(diferencia, 1)} de pH. ` +
      'Con colores tan parecidos, un pequeño cambio de luz pesa más que la diferencia real. ' +
      'Si calibras con sustancias de pH conocido, la medida será más fina.',
    preguntaId: 'ph-color-engana',
  }
}

function explicacionAcido(sustancias) {
  const acidas = sustancias.filter((s) => tipoPh(s.ph) === 'ácida')
  if (acidas.length === 0) return null
  const nombres = unirLista(acidas.map((s) => s.nombre))
  return {
    titulo: '¿Qué hace que algo sea ácido?',
    texto:
      `${acidas.length === 1 ? 'Ha salido ácida' : 'Han salido ácidas'}: ${nombres}. ` +
      'Los ácidos sueltan en el agua unas partículas diminutas llamadas iones de hidrógeno. ' +
      'Cuantas más sueltan, más bajo es el pH y más rojo se vuelve el agua de lombarda.',
    preguntaId: 'ph-acido',
  }
}

function explicacionCalibrar(calibrado) {
  if (calibrado) return null
  return {
    titulo: '¿Cómo puedo medir con más precisión?',
    texto:
      'Esta vez la app ha usado una tabla de colores general. ' +
      'Si pulsas «Calibrar» y mides sustancias de pH conocido, como agua o vinagre, ' +
      'la app aprende con la luz y la cámara de tu clase.',
    preguntaId: 'ph-calibrar',
  }
}

// De la más importante a la menos; se quedan como mucho 3.
export function generarExplicaciones({ sustancias, comparacion, calibrado }) {
  return [
    explicacionHipotesis(comparacion),
    explicacionAgua(sustancias),
    explicacionCasiIguales(sustancias),
    explicacionAcido(sustancias),
    explicacionCalibrar(calibrado),
  ]
    .filter(Boolean)
    .slice(0, MAXIMO_EXPLICACIONES)
}

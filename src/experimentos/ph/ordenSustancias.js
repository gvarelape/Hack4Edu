// Agrupar muestras por sustancia y comparar el orden medido con el predicho.
import { normalizarTexto } from '../../core/utilidades.js'

// Simulacion escribe la predicción con este formato y aquí se lee.
const PREFIJO_PREDICCION = 'Orden predicho: '

export function textoPrediccion(orden) {
  return PREFIJO_PREDICCION + orden.join(', ')
}

export function leerOrdenPredicho(prediccion) {
  const texto = prediccion?.texto
  if (typeof texto !== 'string' || !texto.startsWith(PREFIJO_PREDICCION)) return null
  const orden = texto
    .slice(PREFIJO_PREDICCION.length)
    .split(',')
    .map((nombre) => nombre.trim())
    .filter(Boolean)
  return orden.length > 0 ? orden : null
}

// Une las muestras con el mismo nombre (sin importar mayúsculas ni tildes)
// y hace la media de su pH. Devuelve la lista de más ácida a más básica.
export function agruparPorSustancia(muestras) {
  const grupos = new Map()
  for (const m of muestras) {
    const clave = normalizarTexto(m.sustancia)
    const grupo = grupos.get(clave) ?? { nombre: m.sustancia.trim(), clave, suma: 0, muestras: 0 }
    grupo.suma += m.ph
    grupo.muestras += 1
    grupos.set(clave, grupo)
  }
  return [...grupos.values()]
    .map(({ nombre, clave, suma, muestras: n }) => ({ nombre, clave, ph: suma / n, muestras: n }))
    .sort((a, b) => a.ph - b.ph)
}

// Solo compara las sustancias que están en la predicción y se han medido con el mismo nombre.
export function compararOrden(sustancias, ordenPredicho) {
  const medidas = new Map(sustancias.map((s) => [s.clave, s]))
  const vistas = new Set()
  const predicho = ordenPredicho.filter((nombre) => {
    const clave = normalizarTexto(nombre)
    if (!medidas.has(clave) || vistas.has(clave)) return false
    vistas.add(clave)
    return true
  })

  if (predicho.length < 2) {
    return { comparable: false, coincide: false, predicho, medido: [], cambiadas: [] }
  }

  const phDe = (nombre) => medidas.get(normalizarTexto(nombre)).ph
  const medido = [...predicho].sort((a, b) => phDe(a) - phDe(b))
  const cambiadas = predicho.filter((nombre, i) => medido[i] !== nombre)
  return { comparable: true, coincide: cambiadas.length === 0, predicho, medido, cambiadas }
}

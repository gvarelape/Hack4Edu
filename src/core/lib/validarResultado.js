// Comprueba que un experimento entrega un resultado con la forma que espera el core.
const CAMPOS_RESULTADO = ['resumen', 'valores', 'comparacion', 'explicaciones', 'tabla', 'grafica']
const TIPOS_SERIE = ['puntos', 'linea']
const ROLES_SERIE = ['medido', 'teorico', 'simulado']
const MAX_PUNTOS = 300
const PATRON_COLOR = /^rgb\(\s*\d{1,3}\s*,\s*\d{1,3}\s*,\s*\d{1,3}\s*\)$/

const esObjeto = (valor) => typeof valor === 'object' && valor !== null && !Array.isArray(valor)
const esTexto = (valor) => typeof valor === 'string'
const esTextoLleno = (valor) => esTexto(valor) && valor.trim() !== ''
const esNumero = (valor) => Number.isFinite(valor)

function validarValores(valores, errores) {
  if (!Array.isArray(valores) || valores.length === 0) {
    errores.push('`valores` tiene que ser una lista con al menos 1 elemento.')
    return
  }
  valores.forEach((valor, i) => {
    const sitio = `valores[${i}]`
    if (!esObjeto(valor)) {
      errores.push(`${sitio} tiene que ser un objeto.`)
      return
    }
    if (!esTextoLleno(valor.etiqueta)) errores.push(`${sitio}.etiqueta tiene que ser un texto.`)
    if (!esNumero(valor.valor)) {
      errores.push(`${sitio}.valor tiene que ser un número, sin formatear (no NaN ni texto).`)
    }
    if (!esTexto(valor.unidad)) {
      errores.push(`${sitio}.unidad tiene que ser un texto ('' si no tiene).`)
    }
  })
}

function validarExplicaciones(explicaciones, preguntas, errores, avisos) {
  if (!Array.isArray(explicaciones)) {
    errores.push('`explicaciones` tiene que ser una lista (puede estar vacía).')
    return
  }
  if (explicaciones.length > 3) avisos.push('`explicaciones` debería tener como mucho 3 elementos.')
  const ids = new Set(preguntas?.map((pregunta) => pregunta.id))
  explicaciones.forEach((explicacion, i) => {
    const sitio = `explicaciones[${i}]`
    if (!esObjeto(explicacion)) {
      errores.push(`${sitio} tiene que ser un objeto.`)
      return
    }
    if (!esTextoLleno(explicacion.titulo)) errores.push(`${sitio}.titulo tiene que ser un texto.`)
    if (!esTextoLleno(explicacion.texto)) errores.push(`${sitio}.texto tiene que ser un texto.`)
    const { preguntaId } = explicacion
    if (preguntaId === undefined || preguntaId === null) return
    if (!esTexto(preguntaId)) {
      errores.push(`${sitio}.preguntaId tiene que ser un texto.`)
      return
    }
    // Las preguntas generales están en el banco del asistente, no en el del experimento.
    if (preguntas && !preguntaId.startsWith('general-') && !ids.has(preguntaId)) {
      avisos.push(`${sitio}.preguntaId "${preguntaId}" no está en el banco de preguntas.`)
    }
  })
}

function esCeldaValida(celda) {
  if (esTexto(celda) || esNumero(celda)) return true
  return esObjeto(celda) && esTexto(celda.color) && PATRON_COLOR.test(celda.color)
}

function validarTabla(tabla, errores) {
  if (tabla === null) return
  if (tabla === undefined) {
    errores.push('Falta `tabla` (usa null si no hay).')
    return
  }
  if (!esObjeto(tabla)) {
    errores.push('`tabla` tiene que ser un objeto o null.')
    return
  }
  const columnasValidas =
    Array.isArray(tabla.columnas) && tabla.columnas.length > 0 && tabla.columnas.every(esTexto)
  if (!columnasValidas) errores.push('`tabla.columnas` tiene que ser una lista de textos.')
  if (!Array.isArray(tabla.filas)) {
    errores.push('`tabla.filas` tiene que ser una lista.')
    return
  }
  tabla.filas.forEach((fila, f) => {
    if (!Array.isArray(fila)) {
      errores.push(`tabla.filas[${f}] tiene que ser una lista.`)
      return
    }
    if (columnasValidas && fila.length !== tabla.columnas.length) {
      errores.push(
        `tabla.filas[${f}] tiene ${fila.length} celdas y hay ${tabla.columnas.length} columnas.`,
      )
    }
    fila.forEach((celda, c) => {
      if (!esCeldaValida(celda)) {
        errores.push(
          `tabla.filas[${f}][${c}] tiene que ser un texto, un número o { color: 'rgb(r, g, b)' }.`,
        )
      }
    })
  })
}

function validarSerie(serie, i, nombres, errores) {
  const sitio = `grafica.series[${i}]`
  if (!esObjeto(serie)) {
    errores.push(`${sitio} tiene que ser un objeto.`)
    return
  }
  if (!esTextoLleno(serie.nombre)) errores.push(`${sitio}.nombre tiene que ser un texto.`)
  else if (nombres.has(serie.nombre))
    errores.push(`${sitio}.nombre "${serie.nombre}" está repetido.`)
  nombres.add(serie.nombre)
  if (!TIPOS_SERIE.includes(serie.tipo)) {
    errores.push(`${sitio}.tipo tiene que ser 'puntos' o 'linea'.`)
  }
  if (!ROLES_SERIE.includes(serie.rol)) {
    errores.push(`${sitio}.rol tiene que ser 'medido', 'teorico' o 'simulado'.`)
  }
  if (!Array.isArray(serie.puntos)) {
    errores.push(`${sitio}.puntos tiene que ser una lista.`)
    return
  }
  if (serie.puntos.length > MAX_PUNTOS) {
    errores.push(`${sitio} tiene ${serie.puntos.length} puntos: el máximo es ${MAX_PUNTOS}.`)
  }
  const malo = serie.puntos.findIndex((punto) => !esNumero(punto?.x) || !esNumero(punto?.y))
  if (malo !== -1) errores.push(`${sitio}.puntos[${malo}] tiene que ser { x: número, y: número }.`)
}

function validarGrafica(grafica, errores) {
  if (grafica === null) return
  if (grafica === undefined) {
    errores.push('Falta `grafica` (usa null si no hay).')
    return
  }
  if (!esObjeto(grafica)) {
    errores.push('`grafica` tiene que ser un objeto o null.')
    return
  }
  if (grafica.titulo !== undefined && !esTexto(grafica.titulo)) {
    errores.push('`grafica.titulo` tiene que ser un texto.')
  }
  if (!esTextoLleno(grafica.ejeX)) errores.push('`grafica.ejeX` tiene que ser un texto.')
  if (!esTextoLleno(grafica.ejeY)) errores.push('`grafica.ejeY` tiene que ser un texto.')
  if (!Array.isArray(grafica.series) || grafica.series.length === 0) {
    errores.push('`grafica.series` tiene que ser una lista con al menos 1 serie.')
    return
  }
  const nombres = new Set()
  grafica.series.forEach((serie, i) => validarSerie(serie, i, nombres, errores))
}

// `prediccion` y `preguntas` son opcionales y afinan la revisión.
export function validarResultado(resultado, { prediccion, preguntas } = {}) {
  const errores = []
  const avisos = []
  if (!esObjeto(resultado)) {
    return { errores: ['El resultado tiene que ser un objeto.'], avisos }
  }

  if (!esTextoLleno(resultado.resumen)) {
    errores.push('`resumen` tiene que ser un texto con contenido.')
  }
  validarValores(resultado.valores, errores)
  if (resultado.comparacion !== null && !esTexto(resultado.comparacion)) {
    errores.push('`comparacion` tiene que ser un texto, o null si no había predicción.')
  }
  if (prediccion && !esTextoLleno(resultado.comparacion)) {
    errores.push('Había predicción: `comparacion` tiene que compararla con lo medido.')
  }
  validarExplicaciones(resultado.explicaciones, preguntas, errores, avisos)
  validarTabla(resultado.tabla, errores)
  validarGrafica(resultado.grafica, errores)

  Object.keys(resultado)
    .filter((campo) => !CAMPOS_RESULTADO.includes(campo))
    .forEach((campo) => avisos.push(`\`${campo}\` no está en el contrato: el core lo ignorará.`))

  return { errores, avisos }
}

// Lo que entrega Simulacion a onContinuar.
export function validarPrediccion(prediccion) {
  const errores = []
  if (!esObjeto(prediccion)) {
    return { errores: ['La predicción tiene que ser un objeto { texto, valor }.'], avisos: [] }
  }
  if (!esTextoLleno(prediccion.texto)) errores.push('`texto` tiene que ser un texto con contenido.')
  if (prediccion.valor !== null && !esNumero(prediccion.valor)) {
    errores.push('`valor` tiene que ser un número o null.')
  }
  return { errores, avisos: [] }
}

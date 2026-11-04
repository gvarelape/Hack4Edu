// Cálculos de la gráfica, sin React: escalas con números redondos y paso de datos a píxeles.
const ANCHO_CARACTER = 9
const MARGEN_DATOS = 0.05
const SEPARACION_MARCAS_X = 50
const SEPARACION_MARCAS_Y = 36
const MARGEN_SUPERIOR = 10
const MARGEN_INFERIOR = 28

const esPuntoValido = (punto) => Number.isFinite(punto?.x) && Number.isFinite(punto?.y)
const limitar = (valor, minimo, maximo) => Math.min(Math.max(valor, minimo), maximo)

// Elige el paso redondo (1, 2 o 5 por una potencia de 10) más cercano al ideal.
function pasoRedondo(rango, maxMarcas, soloEnteros) {
  const bruto = rango / Math.max(maxMarcas - 1, 1)
  const magnitud = 10 ** Math.floor(Math.log10(bruto))
  const relativo = bruto / magnitud
  const redondo =
    relativo < Math.SQRT2 ? 1 : relativo < Math.sqrt(10) ? 2 : relativo < Math.sqrt(50) ? 5 : 10
  const paso = redondo * magnitud
  return soloEnteros ? Math.max(paso, 1) : paso
}

function contarDecimales(paso) {
  let decimales = 0
  while (
    decimales < 12 &&
    Math.abs(paso * 10 ** decimales - Math.round(paso * 10 ** decimales)) > 1e-9
  ) {
    decimales++
  }
  return decimales
}

// Si todos los valores son iguales, abre el rango para que el dato no quede pegado a un borde.
function abrirRango(minimo, maximo, soloEnteros) {
  if (minimo !== maximo) return [minimo, maximo]
  const margen = soloEnteros || minimo === 0 ? 1 : Math.abs(minimo) * 0.1
  return [minimo - margen, maximo + margen]
}

function marcasEnRango(minimo, maximo, paso) {
  const decimales = contarDecimales(paso)
  const primera = Math.ceil(minimo / paso - 1e-9)
  const ultima = Math.floor(maximo / paso + 1e-9)
  const marcas = []
  for (let i = primera; i <= ultima; i++) marcas.push(Number((i * paso).toFixed(decimales)))
  return { marcas, decimales }
}

// El eje se ajusta a los datos, con un pequeño margen, y las marcas caen en números redondos.
export function calcularEscala(valores, maxMarcas) {
  const soloEnteros = valores.every(Number.isInteger)
  const [bajo, alto] = abrirRango(Math.min(...valores), Math.max(...valores), soloEnteros)
  const margen = (alto - bajo) * MARGEN_DATOS
  const minimo = bajo >= 0 ? Math.max(bajo - margen, 0) : bajo - margen
  const maximo = alto + margen

  let paso = pasoRedondo(alto - bajo, maxMarcas, soloEnteros)
  let escala = marcasEnRango(minimo, maximo, paso)
  while (escala.marcas.length < 2) {
    paso /= 2
    escala = marcasEnRango(minimo, maximo, paso)
  }
  return { minimo, maximo, ...escala }
}

// Devuelve lo necesario para dibujar, o null si no hay ningún punto válido.
export function prepararGrafica(grafica, ancho, formatearMarca) {
  const series = (grafica?.series ?? [])
    .map((serie) => ({ ...serie, puntos: (serie.puntos ?? []).filter(esPuntoValido) }))
    .filter((serie) => serie.puntos.length > 0)
  if (series.length === 0 || !(ancho > 0)) return null

  const puntos = series.flatMap((serie) => serie.puntos)
  const alto = Math.round(limitar(ancho * 0.65, 220, 320))

  const zonaAlta = alto - MARGEN_SUPERIOR - MARGEN_INFERIOR
  const escalaY = calcularEscala(
    puntos.map((punto) => punto.y),
    limitar(Math.floor(zonaAlta / SEPARACION_MARCAS_Y), 3, 6),
  )
  const textosY = escalaY.marcas.map((marca) => formatearMarca(marca, escalaY.decimales))
  const izquierda = Math.max(...textosY.map((texto) => texto.length)) * ANCHO_CARACTER + 10

  const valoresX = puntos.map((punto) => punto.x)
  const anchoDisponible = ancho - izquierda
  let maxMarcasX = limitar(Math.floor(anchoDisponible / SEPARACION_MARCAS_X), 2, 7)
  let escalaX = calcularEscala(valoresX, maxMarcasX)
  let textosX = escalaX.marcas.map((marca) => formatearMarca(marca, escalaX.decimales))
  // Con números largos caben menos marcas: se reducen hasta que no se pisen.
  while (maxMarcasX > 2 && !caben(textosX, anchoDisponible)) {
    maxMarcasX--
    escalaX = calcularEscala(valoresX, maxMarcasX)
    textosX = escalaX.marcas.map((marca) => formatearMarca(marca, escalaX.decimales))
  }
  // El último número del eje X va centrado en su marca: necesita sitio a la derecha.
  const derecha = (textosX[textosX.length - 1].length * ANCHO_CARACTER) / 2 + 4

  const zonaAncha = ancho - izquierda - derecha
  const aPixelX = (x) =>
    izquierda + ((x - escalaX.minimo) / (escalaX.maximo - escalaX.minimo)) * zonaAncha
  const aPixelY = (y) =>
    MARGEN_SUPERIOR + (1 - (y - escalaY.minimo) / (escalaY.maximo - escalaY.minimo)) * zonaAlta

  return {
    ancho,
    alto,
    zona: {
      izquierda,
      derecha: ancho - derecha,
      arriba: MARGEN_SUPERIOR,
      abajo: alto - MARGEN_INFERIOR,
    },
    marcasX: escalaX.marcas.map((marca, i) => ({ pixel: aPixelX(marca), texto: textosX[i] })),
    marcasY: escalaY.marcas.map((marca, i) => ({ pixel: aPixelY(marca), texto: textosY[i] })),
    series: series.map((serie) => ({
      ...serie,
      puntos: serie.puntos.map((punto) => ({
        ...punto,
        pixelX: aPixelX(punto.x),
        pixelY: aPixelY(punto.y),
      })),
    })),
  }
}

function caben(textos, ancho) {
  const masLargo = Math.max(...textos.map((texto) => texto.length))
  return textos.length * (masLargo * ANCHO_CARACTER + 8) <= ancho
}

// Para la lectura al tocar: el punto de cada serie más cercano al dedo, en horizontal.
export function puntoMasCercano(puntos, pixelX) {
  return puntos.reduce((mejor, punto) =>
    Math.abs(punto.pixelX - pixelX) < Math.abs(mejor.pixelX - pixelX) ? punto : mejor,
  )
}

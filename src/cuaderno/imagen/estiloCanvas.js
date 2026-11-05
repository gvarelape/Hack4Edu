// Colores y fuentes para dibujar en el canvas. En un canvas no se pueden usar variables CSS:
// se usan los valores RGB de tokens.css. Si cambian allí, hay que cambiarlos aquí.

export const COLORES = {
  fondo: 'rgb(246, 240, 226)',
  superficie: 'rgb(253, 250, 242)',
  texto: 'rgb(28, 24, 18)',
  textoSuave: 'rgb(84, 76, 62)',
  borde: 'rgb(205, 195, 172)',
  cuadricula: 'rgb(232, 224, 205)',
  acento: 'rgb(178, 40, 18)',
  infoSuave: 'rgb(250, 236, 186)',
}

export const COLOR_CIENCIA = {
  Química: 'rgb(112, 28, 128)',
  Física: 'rgb(160, 66, 8)',
  Sonido: 'rgb(12, 96, 88)',
}

export const COLOR_SERIE = {
  medido: 'rgb(28, 24, 18)',
  teorico: 'rgb(178, 40, 18)',
  simulado: 'rgb(107, 98, 84)',
}

export const FUENTE_TITULOS = "Gloock, Georgia, 'Times New Roman', serif"
export const FUENTE_TEXTO = "system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif"

/** "700 32px system-ui…" */
export const fuente = (tamano, { titulos = false, peso = 400 } = {}) =>
  `${peso} ${tamano}px ${titulos ? FUENTE_TITULOS : FUENTE_TEXTO}`

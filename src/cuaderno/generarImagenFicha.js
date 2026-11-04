// Dibuja la ficha de un experimento en un canvas de 1080 × 1350 y devuelve un Blob PNG
// (CUADERNO.md, "Compartir"). Formato vertical, que se ve bien en WhatsApp.
import { formatear } from '../core/utilidades.js'
import { formatearFecha } from './formatoCuaderno.js'
import { COLORES, COLOR_CIENCIA, fuente } from './imagen/estiloCanvas.js'
import { dibujarGrafica } from './imagen/graficaCanvas.js'
import { repartirEnLineas } from './imagen/textoCanvas.js'

const ANCHO = 1080
const ALTO = 1350
const MARGEN = 72
const ANCHO_UTIL = ANCHO - MARGEN * 2
const LIMITE_ABAJO = ALTO - 110
const ANCHO_EXPLICACION = ANCHO_UTIL - 56

/** "kanga-rampa-2026-11-03.png" */
export function nombreArchivoFicha(registro) {
  const dia = String(registro?.fecha ?? '').slice(0, 10) || 'ficha'
  return `kanga-${registro?.experimentoId ?? 'experimento'}-${dia}.png`
}

// Escribe líneas de texto y devuelve la y siguiente.
function escribir(ctx, texto, x, y, { tamano, ancho = ANCHO_UTIL, lineas = 2, alto, ...estilo }) {
  ctx.font = fuente(tamano, estilo)
  ctx.textAlign = 'left'
  ctx.textBaseline = 'alphabetic'
  const altoLinea = alto ?? Math.round(tamano * 1.3)
  const partes = repartirEnLineas(texto, ancho, (t) => ctx.measureText(t).width, lineas)
  partes.forEach((linea, i) => ctx.fillText(linea, x, y + i * altoLinea))
  return y + partes.length * altoLinea
}

function dibujarPapel(ctx) {
  ctx.fillStyle = COLORES.fondo
  ctx.fillRect(0, 0, ANCHO, ALTO)
  ctx.strokeStyle = COLORES.cuadricula
  ctx.lineWidth = 2
  for (let p = 40; p < Math.max(ANCHO, ALTO); p += 40) {
    ctx.beginPath()
    ctx.moveTo(p, 0)
    ctx.lineTo(p, ALTO)
    ctx.moveTo(0, p)
    ctx.lineTo(ANCHO, p)
    ctx.stroke()
  }
}

function dibujarCabecera(ctx, registro, colorCiencia) {
  ctx.textBaseline = 'alphabetic'
  ctx.textAlign = 'left'
  ctx.fillStyle = COLORES.texto
  ctx.font = fuente(72, { titulos: true })
  ctx.fillText('Kanga', MARGEN, 112)
  // Subrayado ondulado en el color de acento, como en el inicio.
  const anchoLogo = ctx.measureText('Kanga').width
  ctx.strokeStyle = COLORES.acento
  ctx.lineWidth = 6
  ctx.beginPath()
  ctx.moveTo(MARGEN, 134)
  for (let x = MARGEN; x < MARGEN + anchoLogo; x += 24) {
    ctx.quadraticCurveTo(x + 6, 126, x + 12, 134)
    ctx.quadraticCurveTo(x + 18, 142, x + 24, 134)
  }
  ctx.stroke()

  // Sello de la ciencia, un poco girado.
  const texto = String(registro.ciencia ?? '').toUpperCase()
  ctx.font = fuente(30, { peso: 700 })
  const anchoSello = ctx.measureText(texto).width + 40
  ctx.save()
  ctx.translate(ANCHO - MARGEN - anchoSello / 2, 96)
  ctx.rotate(-0.03)
  ctx.strokeStyle = colorCiencia
  ctx.lineWidth = 4
  ctx.strokeRect(-anchoSello / 2, -30, anchoSello, 56)
  ctx.fillStyle = colorCiencia
  ctx.textAlign = 'center'
  ctx.fillText(texto, 0, 10)
  ctx.restore()
}

function dibujarTitulo(ctx, registro, nombre, colorCiencia, y) {
  ctx.textAlign = 'left'
  ctx.fillStyle = COLORES.textoSuave
  const fecha = formatearFecha(registro.fecha)
  y = escribir(ctx, `${nombre || 'Alumno/a'} · ${fecha}`, MARGEN, y, { tamano: 30, lineas: 1 })

  y += 56
  ctx.font = fuente(60, { titulos: true })
  const lineas = repartirEnLineas(registro.titulo, ANCHO_UTIL, (t) => ctx.measureText(t).width, 2)
  for (const linea of lineas) {
    ctx.fillStyle = COLORES.texto
    ctx.fillText(linea, MARGEN, y)
    ctx.fillStyle = colorCiencia
    ctx.fillRect(MARGEN, y + 14, ctx.measureText(linea).width, 6)
    y += 76
  }
  return y
}

function dibujarNota(ctx, titulo, texto, colorCiencia, y, lineas = 3) {
  if (!texto) return y
  ctx.fillStyle = COLORES.textoSuave
  y = escribir(ctx, titulo.toUpperCase(), MARGEN, y, { tamano: 24, peso: 700, lineas: 1 })
  const inicio = y - 22
  ctx.fillStyle = COLORES.texto
  y = escribir(ctx, texto, MARGEN + 28, y + 12, { tamano: 34, ancho: ANCHO_UTIL - 28, lineas })
  ctx.fillStyle = colorCiencia
  ctx.fillRect(MARGEN, inicio + 12, 6, y - inicio - 30)
  return y + 12
}

// El valor destacado en grande a la izquierda y hasta 3 valores más en una columna a la derecha.
function dibujarValores(ctx, valores, y) {
  const [destacado, ...resto] = valores
  if (!destacado) return y
  ctx.fillStyle = COLORES.textoSuave
  const anchoIzquierda = 500
  let yIzquierda = escribir(ctx, destacado.etiqueta, MARGEN, y, {
    tamano: 30,
    ancho: anchoIzquierda,
    lineas: 1,
  })
  const numero = formatear(destacado.valor)
  ctx.font = fuente(110, { titulos: true })
  const anchoNumero = ctx.measureText(numero).width
  ctx.fillStyle = COLORES.texto
  ctx.fillText(numero, MARGEN, yIzquierda + 86)
  ctx.font = fuente(44)
  ctx.fillStyle = COLORES.textoSuave
  ctx.fillText(destacado.unidad ?? '', MARGEN + anchoNumero + 14, yIzquierda + 86)
  yIzquierda += 118

  const x = MARGEN + anchoIzquierda + 40
  const ancho = ANCHO_UTIL - anchoIzquierda - 40
  let yDerecha = y
  for (const valor of resto.slice(0, 3)) {
    ctx.fillStyle = COLORES.textoSuave
    yDerecha = escribir(ctx, valor.etiqueta, x, yDerecha, { tamano: 24, ancho, lineas: 1 })
    ctx.fillStyle = COLORES.texto
    const texto = `${formatear(valor.valor)} ${valor.unidad ?? ''}`.trim()
    yDerecha = escribir(ctx, texto, x, yDerecha + 6, {
      tamano: 34,
      titulos: true,
      ancho,
      lineas: 1,
    })
    yDerecha += 6
  }
  return Math.max(yIzquierda, yDerecha)
}

// Alto del recuadro de la explicación: título de 1 línea y texto de hasta 3.
function altoExplicacion(ctx, explicacion) {
  if (!explicacion) return 0
  ctx.font = fuente(28)
  const medir = (t) => ctx.measureText(t).width
  return 90 + repartirEnLineas(explicacion.texto, ANCHO_EXPLICACION, medir, 3).length * 36
}

function dibujarExplicacion(ctx, explicacion, y) {
  const alto = altoExplicacion(ctx, explicacion)
  if (!explicacion || y + alto > LIMITE_ABAJO) return y
  ctx.fillStyle = COLORES.infoSuave
  ctx.fillRect(MARGEN, y, ANCHO_UTIL, alto)
  ctx.strokeStyle = COLORES.texto
  ctx.lineWidth = 3
  ctx.setLineDash([14, 10])
  ctx.strokeRect(MARGEN, y, ANCHO_UTIL, alto)
  ctx.setLineDash([])
  ctx.fillStyle = COLORES.texto
  const ancho = ANCHO_EXPLICACION
  const yTexto = escribir(ctx, explicacion.titulo, MARGEN + 28, y + 52, {
    tamano: 30,
    peso: 700,
    ancho,
    lineas: 1,
  })
  escribir(ctx, explicacion.texto, MARGEN + 28, yTexto + 8, { tamano: 28, ancho, lineas: 3 })
  return y + alto + 40
}

function dibujarReflexion(ctx, respuestas, colorCiencia, y) {
  for (const { pregunta, respuesta } of respuestas ?? []) {
    if (!respuesta || y + 150 > LIMITE_ABAJO) continue
    y = dibujarNota(ctx, pregunta, respuesta, colorCiencia, y, 2)
    y += 8
  }
  return y
}

function dibujarPie(ctx) {
  ctx.strokeStyle = COLORES.borde
  ctx.lineWidth = 3
  ctx.setLineDash([14, 10])
  ctx.beginPath()
  ctx.moveTo(MARGEN, ALTO - 96)
  ctx.lineTo(ANCHO - MARGEN, ALTO - 96)
  ctx.stroke()
  ctx.setLineDash([])
  ctx.fillStyle = COLORES.textoSuave
  ctx.font = fuente(28)
  ctx.textAlign = 'center'
  ctx.fillText('Hecho con Kanga', ANCHO / 2, ALTO - 48)
  ctx.textAlign = 'left'
}

async function esperarFuentes() {
  try {
    await document.fonts?.load(fuente(60, { titulos: true }))
  } catch {
    // Sin Gloock se dibuja con Georgia o la serif del móvil.
  }
}

const aBlob = (canvas) =>
  new Promise((resolver, rechazar) =>
    canvas.toBlob(
      (blob) => (blob ? resolver(blob) : rechazar(new Error('Sin imagen'))),
      'image/png',
    ),
  )

/** Dibuja la ficha y devuelve una Promise con el Blob PNG. `nombre` puede ser ''. */
export async function generarImagenFicha(registro, { nombre = '' } = {}) {
  await esperarFuentes()
  const canvas = document.createElement('canvas')
  canvas.width = ANCHO
  canvas.height = ALTO
  const ctx = canvas.getContext('2d')
  const colorCiencia = COLOR_CIENCIA[registro.ciencia] ?? COLORES.texto

  dibujarPapel(ctx)
  dibujarCabecera(ctx, registro, colorCiencia)
  let y = dibujarTitulo(ctx, registro, nombre, colorCiencia, 210)
  y = dibujarNota(ctx, 'Mi hipótesis', registro.hipotesis, colorCiencia, y + 8)
  y = dibujarValores(ctx, registro.resultado?.valores ?? [], y + 16)

  // La gráfica ocupa el hueco que deja libre la explicación, entre 200 y 300 px de alto.
  const grafica = registro.resultado?.grafica
  const explicacion = registro.resultado?.explicaciones?.[0]
  const reservado = explicacion ? altoExplicacion(ctx, explicacion) + 40 : 0
  const libre = LIMITE_ABAJO - y - reservado - 24
  if (grafica?.series?.length && libre >= 200) {
    const alto = Math.min(300, libre)
    dibujarGrafica(ctx, grafica, { x: MARGEN, y: y + 8, ancho: ANCHO_UTIL, alto })
    y += alto + 24
  }
  y = dibujarExplicacion(ctx, explicacion, y + 16)
  dibujarReflexion(ctx, registro.respuestas, colorCiencia, y)
  dibujarPie(ctx)

  return aBlob(canvas)
}

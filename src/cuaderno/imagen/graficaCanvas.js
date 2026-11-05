// Dibuja una gráfica sencilla de puntos y líneas en el canvas, con los colores por rol.
// No se convierte el SVG del core porque usa variables CSS y se perderían los colores.
import { formatear } from '../../core/utilidades.js'
import { COLORES, COLOR_SERIE, fuente } from './estiloCanvas.js'

/** Mínimo y máximo de x e y de todas las series, con un poco de margen. */
export function limitesGrafica(series) {
  const puntos = series.flatMap((serie) => serie.puntos ?? [])
  const valido = (n) => Number.isFinite(n)
  const xs = puntos.map((p) => p.x).filter(valido)
  const ys = puntos.map((p) => p.y).filter(valido)
  if (xs.length === 0 || ys.length === 0) return null
  // Un poco de margen a cada lado, sin bajar de 0 si todos los valores son positivos.
  const ampliar = (min, max) => {
    if (min === max) return [Math.max(0, min - 1), max + 1]
    const margen = (max - min) * 0.05
    return [min >= 0 ? Math.max(0, min - margen) : min - margen, max + margen]
  }
  const [xMin, xMax] = ampliar(Math.min(...xs), Math.max(...xs))
  const [yMin, yMax] = ampliar(Math.min(0, ...ys), Math.max(...ys))
  return { xMin, xMax, yMin, yMax }
}

export function dibujarGrafica(ctx, grafica, caja) {
  const limites = limitesGrafica(grafica.series ?? [])
  if (!limites) return
  const margenIzq = 124
  const margenAbajo = 72
  const area = {
    x: caja.x + margenIzq,
    y: caja.y + 16,
    ancho: caja.ancho - margenIzq - 16,
    alto: caja.alto - margenAbajo - 16,
  }
  const aX = (x) => area.x + ((x - limites.xMin) / (limites.xMax - limites.xMin)) * area.ancho
  const aY = (y) =>
    area.y + area.alto - ((y - limites.yMin) / (limites.yMax - limites.yMin)) * area.alto

  // Ejes
  ctx.strokeStyle = COLORES.texto
  ctx.lineWidth = 3
  ctx.beginPath()
  ctx.moveTo(area.x, area.y)
  ctx.lineTo(area.x, area.y + area.alto)
  ctx.lineTo(area.x + area.ancho, area.y + area.alto)
  ctx.stroke()

  // Valores mínimo y máximo de cada eje, y el nombre de cada eje
  ctx.fillStyle = COLORES.textoSuave
  ctx.font = fuente(24)
  ctx.textAlign = 'right'
  ctx.textBaseline = 'middle'
  ctx.fillText(formatear(limites.yMax, 1), area.x - 12, area.y)
  ctx.fillText(formatear(limites.yMin, 1), area.x - 12, area.y + area.alto)
  ctx.textAlign = 'center'
  ctx.textBaseline = 'top'
  ctx.fillText(formatear(limites.xMin, 1), area.x, area.y + area.alto + 10)
  ctx.fillText(formatear(limites.xMax, 1), area.x + area.ancho, area.y + area.alto + 10)
  ctx.fillText(grafica.ejeX ?? '', area.x + area.ancho / 2, area.y + area.alto + 38)
  ctx.save()
  ctx.translate(caja.x + 24, area.y + area.alto / 2)
  ctx.rotate(-Math.PI / 2)
  ctx.fillText(grafica.ejeY ?? '', 0, -12)
  ctx.restore()

  // Series: primero las líneas, encima los puntos
  const ordenadas = [
    ...grafica.series.filter((serie) => serie.tipo === 'linea'),
    ...grafica.series.filter((serie) => serie.tipo !== 'linea'),
  ]
  for (const serie of ordenadas) {
    const color = COLOR_SERIE[serie.rol] ?? COLOR_SERIE.medido
    const puntos = (serie.puntos ?? []).filter((p) => Number.isFinite(p.x) && Number.isFinite(p.y))
    ctx.strokeStyle = color
    ctx.fillStyle = color
    if (serie.tipo === 'linea') {
      ctx.lineWidth = 5
      ctx.setLineDash(serie.rol === 'simulado' ? [16, 12] : [])
      ctx.beginPath()
      puntos.forEach((p, i) =>
        i === 0 ? ctx.moveTo(aX(p.x), aY(p.y)) : ctx.lineTo(aX(p.x), aY(p.y)),
      )
      ctx.stroke()
      ctx.setLineDash([])
    } else {
      const radio = puntos.length > 60 ? 5 : 9
      for (const p of puntos) {
        ctx.beginPath()
        ctx.arc(aX(p.x), aY(p.y), radio, 0, Math.PI * 2)
        ctx.fill()
      }
    }
  }
}

// Monta el objeto resultado de CONTRATO.md, puntos 3 y 4. Función pura.
import { formatear } from '../../core/utilidades.js'
import { G_REFERENCIA, gEstimada, senoInclinacion } from './fisica.js'
import { generarExplicaciones } from './explicaciones.js'

const PUNTOS_CURVA = 40
const MAXIMO_PUNTOS_SERIE = 300

// Deja como mucho `maximo` puntos repartidos por igual, conservando el último.
function reducirPuntos(puntos, maximo) {
  if (puntos.length <= maximo) return puntos
  const paso = (puntos.length - 1) / (maximo - 1)
  return Array.from({ length: maximo }, (_, i) => puntos[Math.round(i * paso)])
}

function crearGrafica({ tramo, ajuste }) {
  const medidos = tramo.map(({ t, s }) => ({ x: t, y: s }))
  const tiempoFinal = tramo[tramo.length - 1].t
  const curva = Array.from({ length: PUNTOS_CURVA }, (_, i) => {
    const t = (tiempoFinal * i) / (PUNTOS_CURVA - 1)
    return { x: t, y: ajuste.s0 + ajuste.v0 * t + 0.5 * ajuste.a * t * t }
  })

  return {
    titulo: 'Distancia recorrida',
    ejeX: 'Tiempo (s)',
    ejeY: 'Distancia (cm)',
    series: [
      {
        nombre: 'Medido',
        tipo: 'puntos',
        rol: 'medido',
        puntos: reducirPuntos(medidos, MAXIMO_PUNTOS_SERIE),
      },
      { nombre: 'Ajuste', tipo: 'linea', rol: 'teorico', puntos: curva },
    ],
  }
}

function crearComparacion(prediccion, tiempoBajada) {
  if (!prediccion) return null
  const tiempo = `${formatear(tiempoBajada, 2)} s`
  if (Number.isFinite(prediccion.valor)) {
    return `Predijiste ${formatear(prediccion.valor)} s y ha tardado ${tiempo}.`
  }
  return `${prediccion.texto} Ha tardado ${tiempo}.`
}

// analisis: lo que devuelve analizarMovimiento, ya válido.
// montaje: { altura, largo, tipoBola }, con altura y largo que formen una rampa posible.
// prediccion: lo que devolvió Simulacion, o null.
export function crearResultado(analisis, { altura, largo, tipoBola }, prediccion) {
  const seno = senoInclinacion(altura, largo)
  const g = gEstimada(analisis.aceleracion, seno, tipoBola)
  const gSinRodadura = gEstimada(analisis.aceleracion, seno, 'sinRozamiento')
  const errorPorcentaje = (Math.abs(g - G_REFERENCIA) / G_REFERENCIA) * 100

  return {
    resumen:
      `Has medido una gravedad de ${formatear(g, 2)} m/s². ` +
      `El valor real es ${formatear(G_REFERENCIA, 2)} m/s², así que te has quedado a un ${formatear(errorPorcentaje, 1)} %.\n` +
      `Sin contar que la bola rueda saldría ${formatear(gSinRodadura, 2)} m/s²: girar le quita aceleración.`,
    valores: [
      { etiqueta: 'g estimada', valor: g, unidad: 'm/s²' },
      { etiqueta: 'Aceleración', valor: analisis.aceleracion, unidad: 'm/s²' },
      { etiqueta: 'g sin contar la rodadura', valor: gSinRodadura, unidad: 'm/s²' },
      { etiqueta: 'Error respecto a 9,81', valor: errorPorcentaje, unidad: '%' },
      { etiqueta: 'Tiempo de bajada', valor: analisis.tiempoBajada, unidad: 's' },
    ],
    comparacion: crearComparacion(prediccion, analisis.tiempoBajada),
    explicaciones: generarExplicaciones({
      gSinRodadura,
      errorPorcentaje,
      puntosValidos: analisis.puntosValidos,
      tiempoBajada: analisis.tiempoBajada,
      prediccion,
    }),
    tabla: null,
    grafica: crearGrafica(analisis),
  }
}

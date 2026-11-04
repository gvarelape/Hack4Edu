// Física y geometría de la rampa virtual. Funciones puras: distancias en cm, tiempos en segundos.
import { formatear } from '../../core/utilidades.js'
import { aceleracionTeorica, senoInclinacion, tiempoBajada } from './fisica.js'

export const LIMITES = {
  angulo: { minimo: 5, maximo: 30 }, // grados
  largo: { minimo: 30, maximo: 150 }, // cm
}

// Medidas del dibujo, en unidades del viewBox del SVG.
export const DIBUJO = { ancho: 320, alto: 190, radioBola: 9 }
const MARGEN_IZQUIERDO = 25
const SUELO = 175
const ESCALA = 1.75 // unidades de dibujo por cm: 150 cm caben a lo ancho

const enRadianes = (grados) => (grados * Math.PI) / 180
const limitar = (valor, { minimo, maximo }) => Math.min(maximo, Math.max(minimo, valor))

export function alturaDeRampa(angulo, largo) {
  return largo * Math.sin(enRadianes(angulo))
}

// Aceleración (m/s²) y duración (s) de la bajada desde el reposo.
export function crearBajada({ angulo, largo, tipoBola }) {
  const aceleracion = aceleracionTeorica(Math.sin(enRadianes(angulo)), tipoBola)
  return { largo, aceleracion, duracion: tiempoBajada(largo / 100, aceleracion) }
}

// Distancia recorrida en el instante t: s = ½·a·t², hasta llegar al final de la rampa.
export function distanciaEn(t, { aceleracion, largo }) {
  return Math.min(largo, 0.5 * aceleracion * 100 * t * t)
}

// La curva entera, para quien prefiere no ver animaciones.
export function curvaCompleta(bajada, cantidad = 40) {
  return Array.from({ length: cantidad }, (_, i) => {
    const t = (bajada.duracion * i) / (cantidad - 1)
    return { x: t, y: distanciaEn(t, bajada) }
  })
}

export function crearGraficaSimulada(puntos) {
  return {
    titulo: 'Distancia recorrida',
    ejeX: 'Tiempo (s)',
    ejeY: 'Distancia (cm)',
    series: [{ nombre: 'Simulado', tipo: 'linea', rol: 'simulado', puntos }],
  }
}

// Extremos de la rampa en el dibujo: sale arriba a la izquierda y llega al suelo.
export function geometriaRampa({ angulo, largo }) {
  const largoDibujo = largo * ESCALA
  const inicio = {
    x: MARGEN_IZQUIERDO,
    y: SUELO - largoDibujo * Math.sin(enRadianes(angulo)),
  }
  const fin = { x: MARGEN_IZQUIERDO + largoDibujo * Math.cos(enRadianes(angulo)), y: SUELO }
  return { inicio, fin }
}

// Centro y giro de la bola, apoyada sobre la rampa. Sin rozamiento resbala y no gira.
export function posicionBola({ angulo, largo, tipoBola }, distancia) {
  const { inicio } = geometriaRampa({ angulo, largo })
  const radianes = enRadianes(angulo)
  const avance = Math.min(distancia, largo) * ESCALA
  const { radioBola } = DIBUJO
  return {
    x: inicio.x + avance * Math.cos(radianes) + radioBola * Math.sin(radianes),
    y: inicio.y + avance * Math.sin(radianes) - radioBola * Math.cos(radianes),
    giro: tipoBola === 'sinRozamiento' ? 0 : ((avance / radioBola) * 180) / Math.PI,
  }
}

// Convierte las medidas del alumno a lo que admite la simulación.
// Devuelve { angulo, largo, recortada }, o null si la rampa no es posible.
export function rampaDesdeMedidas(altura, largo) {
  const seno = senoInclinacion(altura, largo)
  if (seno === null) return null
  const anguloReal = (Math.asin(seno) * 180) / Math.PI
  // Sin redondear: la simulación tiene que tardar lo mismo que la rampa del alumno.
  const angulo = limitar(anguloReal, LIMITES.angulo)
  const largoAjustado = limitar(largo, LIMITES.largo)
  const recortada =
    anguloReal < LIMITES.angulo.minimo - 0.5 ||
    anguloReal > LIMITES.angulo.maximo + 0.5 ||
    largo < LIMITES.largo.minimo ||
    largo > LIMITES.largo.maximo
  return { angulo, largo: largoAjustado, recortada }
}

export function crearPrediccion(segundos) {
  return { texto: `Predijo que tardaría ${formatear(segundos)} s`, valor: segundos }
}

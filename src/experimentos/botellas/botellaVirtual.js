// Lógica de la botella virtual.

export const ALTURA_BOTELLA_CM = 30
export const AGUA_MAXIMA_CM = 26 // casi llena: siempre queda aire que pueda vibrar
export const OPCIONES_PREDICCION = ['más agudo', 'más grave', 'igual']

export function alturaAire(aguaCm) {
  return ALTURA_BOTELLA_CM - aguaCm
}

// Añade un punto a la gráfica. Si ya se había probado esa altura, no lo repite.
export function anadirPunto(puntos, x, y) {
  if (puntos.some((punto) => punto.x === x)) return puntos
  return [...puntos, { x, y }].sort((a, b) => a.x - b.x)
}

export function crearGraficaSimulada(puntos) {
  return {
    ejeX: 'Altura del aire (cm)',
    ejeY: 'Frecuencia (Hz)',
    series: [{ nombre: 'Simulación', tipo: 'puntos', rol: 'simulado', puntos }],
  }
}

// crearResultado reconoce estas palabras para compararlas con lo medido.
export function crearPrediccion(opcion) {
  return { texto: `Predijo: ${opcion}`, valor: null }
}

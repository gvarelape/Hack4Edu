// Animaciones en tres niveles, con la API de animación del navegador.
// Todo lo animado tiene también un estado estático.
export const NIVELES = ['auto', 'basico', 'normal', 'reducido']
export const DURACION = { rapida: 120, media: 240, lenta: 450 }
export const CURVA = {
  salida: 'cubic-bezier(0.22, 1, 0.36, 1)',
  // Esta curva es exactamente t²: la misma ley que s = ½ a t².
  cuadratica: 'cubic-bezier(0.3333, 0, 0.6667, 0.3333)',
}

const MEMORIA_MINIMA_GB = 2
const NUCLEOS_MINIMOS = 4
const FOTOGRAMA_MAXIMO_MS = 28
const MUESTRAS = 24

let degradado = false
let fotogramasBuenos = null
const oyentes = new Set()

// Vive en memoria mientras la app está abierta: solo el cuaderno guarda datos.
let preferencia = 'auto'

const quiereMenosMovimiento = () =>
  window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false

// Si falta alguna señal se queda en básico.
export function dispositivoCapaz(navegador = navigator) {
  if (navegador.connection?.saveData) return false
  const { deviceMemory: memoria, hardwareConcurrency: nucleos } = navegador
  return memoria >= MEMORIA_MINIMA_GB && nucleos >= NUCLEOS_MINIMOS
}

export function calcularNivel({ preferida, reducido, capaz, fotogramas, bajado }) {
  if (preferida === 'reducido' || reducido) return 'reducido'
  if (preferida === 'basico') return 'basico'
  if (bajado) return 'basico'
  if (preferida === 'normal') return 'normal'
  // Si tiene capacidad empieza en normal, y baja si la medición de fotogramas sale mal.
  return capaz && fotogramas !== false ? 'normal' : 'basico'
}

export function nivelActual() {
  return calcularNivel({
    preferida: preferencia,
    reducido: quiereMenosMovimiento(),
    capaz: dispositivoCapaz(),
    fotogramas: fotogramasBuenos,
    bajado: degradado,
  })
}

function avisar() {
  document.documentElement.dataset.movimiento = nivelActual()
  oyentes.forEach((oyente) => oyente())
}

export const leerPreferenciaMovimiento = () => preferencia

export function cambiarPreferencia(nueva) {
  preferencia = nueva
  degradado = false
  avisar()
}

export function suscribirseMovimiento(oyente) {
  oyentes.add(oyente)
  return () => oyentes.delete(oyente)
}

// Medición breve, una sola vez: no deja ningún bucle en reposo.
function medirFotogramas() {
  return new Promise((resolver) => {
    let anterior = null
    let cuenta = 0
    let total = 0
    const paso = (ahora) => {
      if (anterior !== null) {
        total += ahora - anterior
        cuenta++
      }
      anterior = ahora
      if (cuenta < MUESTRAS) requestAnimationFrame(paso)
      else resolver(total / cuenta <= FOTOGRAMA_MAXIMO_MS)
    }
    requestAnimationFrame(paso)
  })
}

export async function iniciarMovimiento() {
  avisar()
  window.matchMedia?.('(prefers-reduced-motion: reduce)').addEventListener?.('change', avisar)
  // Con la app oculta no se anima nada, para no gastar batería.
  document.addEventListener('visibilitychange', () => {
    document.getAnimations?.().forEach((animacion) => {
      if (document.hidden && animacion.playState === 'running') animacion.pause()
      else if (!document.hidden && animacion.playState === 'paused') animacion.play()
    })
  })
  if (!dispositivoCapaz() || document.hidden) return
  fotogramasBuenos = await medirFotogramas()
  avisar()
}

// Devuelve la animación, o null si no toca animar o el navegador no puede: el llamador sigue igual.
export function animar(elemento, fotogramas, opciones) {
  if (nivelActual() !== 'normal' || !elemento?.animate) return null
  try {
    return elemento.animate(fotogramas, opciones)
  } catch {
    return null
  }
}

// Si una animación va a tirones, baja de nivel durante el resto de la sesión.
export function vigilarRendimiento(duracion) {
  let anterior = performance.now()
  let lentos = 0
  let id
  const fin = anterior + duracion * 1000
  const paso = (ahora) => {
    if (ahora - anterior > 50) lentos++
    anterior = ahora
    if (ahora < fin) id = requestAnimationFrame(paso)
    else if (lentos >= 3 && nivelActual() === 'normal') {
      degradado = true
      avisar()
    }
  }
  id = requestAnimationFrame(paso)
  return () => cancelAnimationFrame(id)
}

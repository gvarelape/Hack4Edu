// Cálculos de las animaciones de los experimentos.
const GRAVEDAD = 9.81
const ANGULO_RAMPA = (20 * Math.PI) / 180
const LARGO_RAMPA_M = 1
const LARGO_BOTELLA_M = 0.33
const VELOCIDAD_SONIDO = 343

// Una bola maciza que rueda: a = 5/7 · g · sen θ, igual que en el experimento de la rampa.
export const aceleracionRampa = () => (5 / 7) * GRAVEDAD * Math.sin(ANGULO_RAMPA)

// s = ½ a t² → t = √(2s / a).
export const duracionRampa = () => Math.sqrt((2 * LARGO_RAMPA_M) / aceleracionRampa())

// Marcas a tiempos iguales: la distancia crece como 1, 4, 9, 16. Fracción del recorrido.
export const marcasRampa = (intervalos = 4) =>
  Array.from({ length: intervalos }, (_, i) => ((i + 1) / intervalos) ** 2)

// Tubo cerrado por un extremo: f = v / 4L. Es la nota que da la botella al soplar.
export const frecuenciaBotella = () => VELOCIDAD_SONIDO / (4 * LARGO_BOTELLA_M)

let contextoAudio = null

function sonar(frecuencia, duracion) {
  const Contexto = window.AudioContext ?? window.webkitAudioContext
  if (!Contexto) return
  // Crear el contexto tarda más de 100 ms: se hace una sola vez y se reutiliza.
  contextoAudio ??= new Contexto()
  contextoAudio.resume().catch(() => {})
  const ahora = contextoAudio.currentTime
  const oscilador = contextoAudio.createOscillator()
  const volumen = contextoAudio.createGain()
  oscilador.frequency.value = frecuencia
  volumen.gain.setValueAtTime(0.15, ahora)
  volumen.gain.exponentialRampToValueAtTime(0.001, ahora + duracion)
  oscilador.connect(volumen)
  volumen.connect(contextoAudio.destination)
  oscilador.start()
  oscilador.stop(ahora + duracion)
}

// Se llama siempre desde un toque. iOS exige arrancar el audio dentro del propio toque;
// en el resto, se deja pintar antes la respuesta para que el toque se note al instante.
export function tocarTono(frecuencia, duracion = 0.5) {
  if (navigator.vendor?.includes('Apple')) sonar(frecuencia, duracion)
  else requestAnimationFrame(() => requestAnimationFrame(() => sonar(frecuencia, duracion)))
}

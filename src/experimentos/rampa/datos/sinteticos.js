// Datos de prueba: una bola que baja con ruido, como los daría el seguimiento. Solo para desarrollar.

// Generador con semilla (mulberry32), para que las pruebas salgan siempre igual.
function crearAleatorio(semilla) {
  let estado = semilla >>> 0
  return () => {
    estado = (estado + 0x6d2b79f5) >>> 0
    let z = estado
    z = Math.imul(z ^ (z >>> 15), z | 1)
    z ^= z + Math.imul(z ^ (z >>> 7), z | 61)
    return ((z ^ (z >>> 14)) >>> 0) / 4294967296
  }
}

// Ruido normal de media 0 y desviación 1 (Box-Muller).
function ruidoNormal(aleatorio) {
  return Math.sqrt(-2 * Math.log(1 - aleatorio())) * Math.cos(2 * Math.PI * aleatorio())
}

// Devuelve puntos { t, x, y } en segundos y píxeles.
export function generarDatosSinteticos({
  aceleracion = 1.72, // m/s²
  longitud = 100, // cm recorridos hasta parar
  escala = 0.1, // cm por píxel
  anguloImagen = 10, // grados de la rampa en la imagen
  fps = 30,
  reposo = 0.5, // s quieta antes de soltarla
  espera = 0.5, // s parada abajo antes de pulsar "Parar"
  ruido = 1, // desviación en píxeles
  saltos = 0, // fotogramas en los que el seguimiento se va a otro sitio
  tiempoInicial = 0, // s del vídeo en el que empieza la grabación
  semilla = 1,
} = {}) {
  const aleatorio = crearAleatorio(semilla)
  const aceleracionCm = aceleracion * 100
  const angulo = (anguloImagen * Math.PI) / 180
  const total = reposo + Math.sqrt((2 * longitud) / aceleracionCm) + espera
  const cantidad = Math.floor(total * fps)

  const puntos = []
  for (let i = 0; i < cantidad; i++) {
    const t = i / fps
    const enMarcha = Math.max(0, t - reposo)
    const s = Math.min(longitud, 0.5 * aceleracionCm * enMarcha * enMarcha) / escala
    puntos.push({
      t: tiempoInicial + t,
      x: 100 + s * Math.cos(angulo) + ruido * ruidoNormal(aleatorio),
      y: 200 + s * Math.sin(angulo) + ruido * ruidoNormal(aleatorio),
    })
  }

  // Repartidos a la misma distancia para que sean saltos sueltos, no una racha.
  for (let k = 1; k <= saltos; k++) {
    const punto = puntos[Math.floor((cantidad * k) / (saltos + 1))]
    punto.x += 400
    punto.y -= 300
  }
  return puntos
}

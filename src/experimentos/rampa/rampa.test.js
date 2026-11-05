// Ejecutar con: node --test src/experimentos/rampa/
import { test } from 'node:test'
import assert from 'node:assert/strict'
import {
  FACTOR_BOLA,
  G_REFERENCIA,
  aceleracionTeorica,
  gEstimada,
  senoInclinacion,
  tiempoBajada,
} from './fisica.js'
import {
  ajusteCuadratico,
  analizarMovimiento,
  calcularEscala,
  recortar,
  velocidades,
} from './analisisMovimiento.js'
import { generarDatosSinteticos } from './datos/sinteticos.js'

const ACELERACION = 1.72
const LONGITUD = 100
const ESCALA = 0.1
const SEMILLAS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

function cerca(real, esperado, margen, mensaje) {
  assert.ok(Math.abs(real - esperado) <= margen, `${mensaje ?? ''} ${real} frente a ${esperado}`)
}

function aceleracionMedida(opciones) {
  const analisis = analizarMovimiento(generarDatosSinteticos(opciones), ESCALA)
  assert.equal(analisis.valido, true)
  return analisis.aceleracion
}

test('fisica: senoInclinacion rechaza rampas imposibles', () => {
  assert.equal(senoInclinacion(25, 100), 0.25)
  assert.equal(senoInclinacion(0, 100), null)
  assert.equal(senoInclinacion(120, 100), null)
  assert.equal(senoInclinacion(null, 100), null)
})

test('fisica: gEstimada deshace aceleracionTeorica para cada bola', () => {
  for (const tipo of Object.keys(FACTOR_BOLA)) {
    const a = aceleracionTeorica(0.25, tipo)
    cerca(gEstimada(a, 0.25, tipo), G_REFERENCIA, 1e-9, tipo)
  }
})

test('fisica: sin contar la rodadura, la bola maciza da unos 7 m/s²', () => {
  const a = aceleracionTeorica(0.25, 'maciza')
  cerca(gEstimada(a, 0.25, 'sinRozamiento'), 7.0, 0.05)
})

test('fisica: tiempoBajada cumple s = ½·a·t²', () => {
  const t = tiempoBajada(1, 2)
  cerca(0.5 * 2 * t * t, 1, 1e-9)
})

test('ajuste: recupera los coeficientes exactos sin ruido', () => {
  const puntos = []
  for (let i = 0; i < 20; i++) {
    const t = i / 10
    puntos.push({ t, s: 3 + 2 * t + 0.5 * 86 * t * t })
  }
  const ajuste = ajusteCuadratico(puntos)
  cerca(ajuste.s0, 3, 1e-8)
  cerca(ajuste.v0, 2, 1e-8)
  cerca(ajuste.a, 86, 1e-8)
})

test('ajuste: devuelve null si no se puede resolver', () => {
  assert.equal(
    ajusteCuadratico([
      { t: 0, s: 0 },
      { t: 1, s: 1 },
    ]),
    null,
  )
  const mismoInstante = [1, 2, 3, 4].map((s) => ({ t: 1, s }))
  assert.equal(ajusteCuadratico(mismoInstante), null)
})

test('analisis: encuentra la aceleración con ruido (error < 3 %)', () => {
  for (const semilla of SEMILLAS) {
    const a = aceleracionMedida({ aceleracion: ACELERACION, semilla })
    cerca(a, ACELERACION, ACELERACION * 0.03, `semilla ${semilla}:`)
  }
})

test('analisis: sirve para aceleraciones y encuadres distintos (error < 5 %)', () => {
  for (const aceleracion of [0.8, 1.72, 3.5]) {
    for (const anguloImagen of [0, 10, -20, 180]) {
      const a = aceleracionMedida({ aceleracion, anguloImagen, ruido: 2 })
      cerca(a, aceleracion, aceleracion * 0.05, `${aceleracion} a ${anguloImagen}°:`)
    }
  }
})

test('analisis: la parada larga abajo no falsea la aceleración', () => {
  for (const semilla of SEMILLAS) {
    const a = aceleracionMedida({ espera: 3, ruido: 2, semilla })
    cerca(a, ACELERACION, ACELERACION * 0.05, `semilla ${semilla}:`)
  }
})

test('analisis: el temblor de la bola quieta no adelanta la salida', () => {
  for (let semilla = 1; semilla <= 200; semilla++) {
    const a = aceleracionMedida({ ruido: 3, semilla })
    cerca(a, ACELERACION, ACELERACION * 0.05, `semilla ${semilla}:`)
  }
})

test('analisis: los saltos sueltos del seguimiento no falsean la medida', () => {
  for (const semilla of SEMILLAS) {
    const a = aceleracionMedida({ saltos: 4, semilla })
    cerca(a, ACELERACION, ACELERACION * 0.03, `semilla ${semilla}:`)
  }
})

test('analisis: funciona si empieza a grabar con la bola casi soltada', () => {
  cerca(aceleracionMedida({ reposo: 0.1 }), ACELERACION, ACELERACION * 0.05)
})

test('analisis: el tiempo del vídeo no afecta al resultado', () => {
  const base = { semilla: 3 }
  const a = aceleracionMedida(base)
  cerca(aceleracionMedida({ ...base, tiempoInicial: 1000 }), a, 1e-6)
})

test('analisis: el tiempo de bajada incluye el arranque desde el reposo', () => {
  const esperado = tiempoBajada(LONGITUD / 100, ACELERACION)
  for (const semilla of SEMILLAS) {
    const analisis = analizarMovimiento(generarDatosSinteticos({ semilla }), ESCALA)
    cerca(analisis.tiempoBajada, esperado, 0.05, `semilla ${semilla}:`)
  }
})

test('analisis: de punta a punta sale la g de una bola maciza', () => {
  const seno = 0.25
  const aceleracion = aceleracionTeorica(seno, 'maciza')
  for (const semilla of SEMILLAS) {
    const analisis = analizarMovimiento(generarDatosSinteticos({ aceleracion, semilla }), ESCALA)
    const g = gEstimada(analisis.aceleracion, seno, 'maciza')
    cerca(g, G_REFERENCIA, G_REFERENCIA * 0.03, `semilla ${semilla}:`)
  }
})

test('analisis: pide repetir si hay pocos puntos', () => {
  const analisis = analizarMovimiento(
    generarDatosSinteticos({ fps: 5, espera: 0, reposo: 0 }),
    ESCALA,
  )
  assert.equal(analisis.valido, false)
  assert.equal(analisis.motivo, 'pocos-puntos')
  assert.equal(analizarMovimiento([], ESCALA).valido, false)
})

test('analisis: una bola que no se mueve no da medida', () => {
  const quieta = generarDatosSinteticos({ longitud: 0.2, ruido: 0.5 })
  const analisis = analizarMovimiento(quieta, ESCALA)
  assert.equal(analisis.valido, false)
  assert.equal(analisis.motivo, 'pocos-puntos')
})

test('analisis: una bola frenando no da una aceleración positiva', () => {
  const puntos = []
  for (let i = 0; i < 40; i++) {
    const t = i / 30
    puntos.push({ t, x: 100 + (150 * t - 0.5 * 100 * t * t) / ESCALA, y: 200 })
  }
  const analisis = analizarMovimiento(puntos, ESCALA)
  assert.equal(analisis.valido, false)
  assert.equal(analisis.motivo, 'sin-aceleracion')
})

test('recortar: quita el reposo y lo que va después de llegar abajo', () => {
  const tramo = recortar(generarDatosSinteticos({ ruido: 0 }), ESCALA)
  assert.equal(tramo[0].t, 0)
  assert.ok(tramo[0].s < 3, 'empieza donde reposaba')
  // La bajada dura √(2·100/172) = 1,08 s: los 0,5 s de reposo no cuentan.
  cerca(tramo.at(-1).t, 1.08, 0.2, 'duración')
  assert.ok(tramo.at(-1).s < LONGITUD - 1)
  assert.ok(tramo.at(-1).s > LONGITUD - 10)
})

test('velocidades: crecen en línea recta con pendiente igual a la aceleración', () => {
  const tramo = recortar(generarDatosSinteticos({ ruido: 0 }), ESCALA)
  const lista = velocidades(tramo)
  const centrales = lista.slice(3, -3)
  for (const { t, v } of centrales) {
    const v0 = lista[3].v - ACELERACION * 100 * lista[3].t
    cerca(v, v0 + ACELERACION * 100 * t, 0.5, `t=${t}:`)
  }
})

test('calcularEscala: da los cm por píxel y rechaza marcas no válidas', () => {
  assert.equal(calcularEscala({ x: 10, y: 10 }, { x: 40, y: 50 }, 25), 0.5)
  assert.equal(calcularEscala({ x: 10, y: 10 }, { x: 12, y: 10 }, 25), null)
  assert.equal(calcularEscala({ x: 10, y: 10 }, { x: 40, y: 50 }, 0), null)
  assert.equal(calcularEscala({ x: 10, y: 10 }, { x: 40, y: 50 }, null), null)
})

test('analisis: distingue el tiempo parado de una mala medida', () => {
  const parado = generarDatosSinteticos().map((p) => ({ ...p, t: 3 }))
  const analisis = analizarMovimiento(parado, ESCALA)
  assert.equal(analisis.valido, false)
  assert.equal(analisis.motivo, 'tiempo-parado')
})

// Como la medida real de un iPhone: 3,6 s quieta, y los primeros puntos movidos respecto al reposo.
function medidaConReposoLargo(desplazamiento, aceleracionCm = 117) {
  const puntos = []
  for (let i = 0; i < 145; i++) {
    const t = i / 30
    const tBajando = Math.max(0, t - 3.6)
    const avance = Math.min(0.5 * aceleracionCm * tBajando * tBajando, 56)
    const inicial = i < 4 ? desplazamiento : { x: 0, y: 0 }
    const temblor = (i % 3) * 0.2 // píxeles
    puntos.push({ t, x: (avance + inicial.x) / 0.5 + temblor, y: inicial.y / 0.5 + temblor })
  }
  return puntos
}

for (const desplazamiento of [
  { x: 0, y: 0 },
  { x: -2, y: 0 },
  { x: 0, y: 2 },
  { x: -4, y: 0 },
]) {
  test(`analizarMovimiento: no cuenta el reposo aunque el inicio esté movido (${desplazamiento.x}, ${desplazamiento.y})`, () => {
    const analisis = analizarMovimiento(medidaConReposoLargo(desplazamiento), 0.5)
    assert.equal(analisis.valido, true)
    cerca(analisis.aceleracion, 1.17, 0.1, 'aceleración')
    cerca(analisis.tiempoBajada, 0.95, 0.1, 'tiempo')
  })
}

test('recortar: si mueve la pelota con la mano antes de soltarla, empieza al soltarla', () => {
  const puntos = medidaConReposoLargo({ x: 0, y: 0 }).map((p) =>
    p.t < 2 ? { ...p, x: (p.t * 10) / 0.5 + 40 } : p,
  )
  const analisis = analizarMovimiento(puntos, 0.5)
  assert.equal(analisis.valido, true)
  cerca(analisis.aceleracion, 1.17, 0.1, 'aceleración')
})

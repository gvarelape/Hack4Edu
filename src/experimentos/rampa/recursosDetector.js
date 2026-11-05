// Rutas de los archivos del detector. Aparte de detectorIA.js para que index.js no cargue MediaPipe.

export const CARPETA_WASM = '/modelos/rampa/wasm'
export const RUTA_MODELO = '/modelos/rampa/efficientdet_lite0.tflite'

// Módulo mínimo de WebAssembly con SIMD: MediaPipe elige su motor según lo admita el móvil o no.
const MODULO_SIMD = new Uint8Array([
  0, 97, 115, 109, 1, 0, 0, 0, 1, 5, 1, 96, 0, 1, 123, 3, 2, 1, 0, 10, 10, 1, 8, 0, 65, 0, 253, 15,
  253, 98, 11,
])

const MOTOR = WebAssembly.validate(MODULO_SIMD)
  ? 'vision_wasm_internal'
  : 'vision_wasm_nosimd_internal'

// Para el campo `recursos` del experimento: lo que este móvil necesita para usarlo sin internet.
export const RECURSOS_DETECTOR = [
  RUTA_MODELO,
  `${CARPETA_WASM}/${MOTOR}.js`,
  `${CARPETA_WASM}/${MOTOR}.wasm`,
]

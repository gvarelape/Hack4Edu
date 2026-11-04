import { normalizarTexto } from './texto'

// 'Química' → 'quimica': da la clase de color de cada ciencia.
export const claveCiencia = (ciencia) => normalizarTexto(ciencia)

// Huella de lo que se compara de una pregunta: si cambia un texto, hay que regenerar los vectores.
// FNV-1a de 32 bits: basta para notar un cambio y es igual en Node y en el navegador.
export function huellaPregunta({ id, pregunta, variantes = [] }) {
  const texto = [id, pregunta, ...variantes].join('\n')
  let huella = 0x811c9dc5
  for (let i = 0; i < texto.length; i++) {
    huella ^= texto.charCodeAt(i)
    huella = Math.imul(huella, 0x01000193)
  }
  return (huella >>> 0).toString(36)
}

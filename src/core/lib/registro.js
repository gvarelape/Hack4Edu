// Monta el registro que se guarda en el cuaderno.
export function crearIdRegistro() {
  if (crypto.randomUUID) return crypto.randomUUID()
  // iOS anterior a 15.4 no tiene randomUUID.
  const bytes = crypto.getRandomValues(new Uint8Array(16))
  return Array.from(bytes, (byte) => byte.toString(16).padStart(2, '0')).join('')
}

export function crearRegistro({
  experimento,
  hipotesis,
  prediccion,
  resultado,
  respuestas,
  id,
  fecha,
}) {
  return {
    id,
    experimentoId: experimento.id,
    titulo: experimento.titulo,
    ciencia: experimento.ciencia,
    fecha,
    hipotesis: hipotesis.trim(),
    prediccion,
    resultado,
    respuestas: experimento.reflexion.map((pregunta, i) => ({
      pregunta,
      respuesta: (respuestas[i] ?? '').trim(),
    })),
  }
}

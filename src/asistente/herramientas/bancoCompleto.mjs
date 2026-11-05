// Todas las preguntas de la app, en los tres idiomas. Fuera de la app se puede leer cada banco.
const importar = (ruta) => import(new URL(`../../${ruta}`, import.meta.url))

export async function bancoCompleto() {
  const bancos = await Promise.all(
    ['ph', 'rampa', 'botellas'].map((parte) => importar(`experimentos/${parte}/preguntas.js`)),
  )
  const { preguntasGenerales } = await importar('asistente/preguntasGenerales.js')
  const espanol = [...bancos.flatMap((banco) => banco.preguntas), ...preguntasGenerales]

  const traducidas = []
  for (const idioma of ['en', 'fr']) {
    const { preguntas } = await importar(`core/traducciones/preguntas-${idioma}.js`)
    for (const original of espanol) {
      const fila = preguntas[original.id]
      if (fila) traducidas.push({ id: original.id, pregunta: fila[0], variantes: fila[1] })
    }
  }
  return [...espanol, ...traducidas]
}

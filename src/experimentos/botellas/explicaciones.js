// Explicaciones automáticas según lo medido. Máximo 3, de la más importante a la menos.

const MAXIMO_EXPLICACIONES = 3
const VELOCIDAD_BAJA = 320 // m/s
const VELOCIDAD_ALTA = 370 // m/s
const RANGO_MINIMO_CM = 5

const VELOCIDAD_MENOR = {
  titulo: '¿Por qué me sale menos de 343 m/s?',
  texto:
    'Seguramente tu botella tiene cuello estrecho. Entonces el aire no vibra como en un tubo recto y la fórmula deja de encajar. Además, el aire vibra un poco por encima de la boca, y eso tampoco lo mide tu regla. Prueba con una botella lo más recta posible.',
  preguntaId: 'botellas-correccion-extremo',
}

const VELOCIDAD_MAYOR = {
  titulo: '¿Por qué me sale más de 343 m/s?',
  texto:
    'Revisa cómo has medido la altura del aire: un error pequeño cambia mucho el resultado. También influye la forma de la botella: si se estrecha en los hombros, el aire no vibra como en un tubo recto.',
  preguntaId: 'botellas-v-alta',
}

const MEDIDA_RARA = {
  titulo: '¿Por qué una medida no sigue el patrón?',
  texto:
    'Con más aire debería sonar más grave, pero alguna medida ha salido al revés. Puede que la botella saltara a un armónico, un tono más agudo que aparece al soplar fuerte. Repite esa medida soplando más suave.',
  preguntaId: 'botellas-medida-rara',
}

const MEJORAR_MEDIDA = {
  titulo: '¿Cómo mejoro la medida?',
  texto:
    'Tus alturas de aire están muy juntas, y así un error pequeño cambia mucho el resultado. Haz más medidas, con niveles de agua bien separados: mejor si hay más de 5 cm entre la altura mayor y la menor.',
  preguntaId: 'botellas-mejorar',
}

const HIPOTESIS_FALLIDA = {
  titulo: '¿Me equivoqué en la hipótesis?',
  texto:
    'Lo que predijiste no coincide con lo que has medido, y eso no es un fracaso. Los científicos también se equivocan: comprobar una idea y cambiarla es justo lo que hace avanzar la ciencia.',
  preguntaId: 'general-hipotesis-falsa',
}

// Se usa cuando todo ha salido bien.
const MODELO_APROXIMADO = {
  titulo: '¿Por qué no sale exactamente 343 m/s?',
  texto:
    'Porque la fórmula es un modelo: describe una botella ideal, y la tuya es real. Además, 343 m/s es la velocidad a unos 20 °C, y cambia con la temperatura del aire. Aun así, ¡has medido la velocidad del sonido con una botella!',
  preguntaId: 'botellas-modelo-aproximado',
}

// ¿Hay alguna medida con más aire que la anterior y un sonido más agudo?
export function hayMedidaRara(medidas) {
  const ordenadas = [...medidas].sort((a, b) => a.alturaCm - b.alturaCm)
  return ordenadas.some((medida, i) => {
    const anterior = ordenadas[i - 1]
    if (!anterior) return false
    return medida.alturaCm > anterior.alturaCm && medida.frecuencia > anterior.frecuencia
  })
}

function rangoAlturas(medidas) {
  const alturas = medidas.map(({ alturaCm }) => alturaCm)
  return Math.max(...alturas) - Math.min(...alturas)
}

// velocidad: número o null. prediccionAcertada: true, false, o null si no se puede comparar.
export function crearExplicaciones({ medidas, velocidad, prediccionAcertada }) {
  const explicaciones = []
  if (velocidad !== null && velocidad < VELOCIDAD_BAJA) explicaciones.push(VELOCIDAD_MENOR)
  if (velocidad !== null && velocidad > VELOCIDAD_ALTA) explicaciones.push(VELOCIDAD_MAYOR)
  if (hayMedidaRara(medidas)) explicaciones.push(MEDIDA_RARA)
  if (rangoAlturas(medidas) < RANGO_MINIMO_CM) explicaciones.push(MEJORAR_MEDIDA)
  if (prediccionAcertada === false) explicaciones.push(HIPOTESIS_FALLIDA)

  if (explicaciones.length === 0) return [MODELO_APROXIMADO]
  return explicaciones.slice(0, MAXIMO_EXPLICACIONES)
}

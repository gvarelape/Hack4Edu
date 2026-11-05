// Tres registros de ejemplo (uno por experimento).
// Sirven para desarrollar y probar el cuaderno en #/prueba/cuaderno sin hacer los experimentos.
// Los ids son fijos para que cargarlos varias veces no cree duplicados.

const redondear = (numero, decimales = 1) => {
  const factor = 10 ** decimales
  return Math.round(numero * factor) / factor
}

// Ruido pequeño y siempre igual (sin Math.random), para que los datos parezcan medidos.
const ruido = (i, amplitud) => (((i * 37) % 11) - 5) * (amplitud / 5)

// ---------- Rampa ----------
// a = 1,72 m/s² = 172 cm/s². La bola tarda 1,05 s en recorrer unos 95 cm.
const ACELERACION_CM = 172
const TIEMPO_BAJADA = 1.05

const puntosRampaMedidos = Array.from({ length: 32 }, (_, i) => {
  const t = i / 30
  const distancia = 0.5 * ACELERACION_CM * t * t
  return { x: redondear(t, 3), y: redondear(Math.max(0, distancia + ruido(i, 0.6))) }
})

const puntosRampaAjuste = Array.from({ length: 40 }, (_, i) => {
  const t = (TIEMPO_BAJADA * i) / 39
  return { x: redondear(t, 3), y: redondear(0.5 * ACELERACION_CM * t * t) }
})

const registroRampa = {
  id: 'ejemplo-rampa',
  experimentoId: 'rampa',
  titulo: 'Pelota en una rampa',
  ciencia: 'Física',
  fecha: '2026-11-03T10:24:00.000Z',
  hipotesis:
    'Creo que la pelota irá cada vez más rápido, porque la gravedad la empuja todo el rato mientras baja.',
  prediccion: { texto: 'Tardará 1,2 segundos en bajar la rampa.', valor: 1.2 },
  resultado: {
    resumen:
      'La pelota ha bajado acelerando: cada segundo recorre más distancia que el anterior.\n' +
      'Con tu rampa, la gravedad estimada es 9,62 m/s², muy cerca de 9,81 m/s².',
    valores: [
      { etiqueta: 'g estimada', valor: 9.62, unidad: 'm/s²' },
      { etiqueta: 'Aceleración', valor: 1.72, unidad: 'm/s²' },
      { etiqueta: 'g sin contar la rodadura', valor: 6.87, unidad: 'm/s²' },
      { etiqueta: 'Error respecto a 9,81', valor: 1.9, unidad: '%' },
      { etiqueta: 'Tiempo de bajada', valor: 1.05, unidad: 's' },
    ],
    comparacion: 'Predijiste 1,2 s y ha tardado 1,05 s.',
    explicaciones: [
      {
        titulo: '¿Por qué sin contar la rodadura sale menos de 9,8?',
        texto:
          'La pelota no solo baja: también gira. Parte de la energía se usa en hacerla girar. ' +
          'Por eso baja más despacio que un objeto que resbalara sin rodar.',
        preguntaId: 'rampa-rodadura',
      },
      {
        titulo: '¡Muy buena medida! ¿Qué la ha hecho tan precisa?',
        texto:
          'Te has equivocado menos de un 2 %. El móvil estaba quieto, la escala bien marcada ' +
          'y había buena luz. ¡Así trabajan los científicos!',
        preguntaId: 'rampa-buena-medida',
      },
    ],
    tabla: null,
    grafica: {
      titulo: 'Distancia recorrida',
      ejeX: 'Tiempo (s)',
      ejeY: 'Distancia (cm)',
      series: [
        { nombre: 'Medido', tipo: 'puntos', rol: 'medido', puntos: puntosRampaMedidos },
        { nombre: 'Ajuste', tipo: 'linea', rol: 'teorico', puntos: puntosRampaAjuste },
      ],
    },
  },
  respuestas: [
    {
      pregunta:
        '¿La pelota recorre la misma distancia en cada segundo? ¿Qué te dice la forma de la gráfica?',
      respuesta: 'No, cada vez recorre más. La gráfica es una curva hacia arriba, así que acelera.',
    },
    {
      pregunta:
        '¿Te sale una gravedad menor que 9,8 si no tienes en cuenta que la bola rueda? ¿Por qué rodar "roba" aceleración?',
      respuesta: 'Sí, sale 6,87. Porque parte de la energía se gasta en hacer girar la pelota.',
    },
    {
      pregunta: '¿Qué crees que pasaría con más inclinación o con una pelota hueca?',
      respuesta: 'Con más inclinación bajaría más rápido. Con una hueca creo que más lenta.',
    },
  ],
}

// ---------- Botellas ----------
// Alturas del aire en cm y frecuencias medidas en Hz. Salen un poco por debajo de la teoría.
const VELOCIDAD_TEORICA = 343
const frecuenciaTeorica = (alturaCm) => VELOCIDAD_TEORICA / (4 * (alturaCm / 100))

const medidasBotella = [
  { altura: 10, frecuencia: 792 },
  { altura: 14, frecuencia: 561 },
  { altura: 18, frecuencia: 440 },
  { altura: 22, frecuencia: 357 },
]

const puntosBotellaTeoricos = Array.from({ length: 30 }, (_, i) => {
  const altura = 8 + (16 * i) / 29
  return { x: redondear(altura), y: redondear(frecuenciaTeorica(altura), 0) }
})

const registroBotellas = {
  id: 'ejemplo-botellas',
  experimentoId: 'botellas',
  titulo: 'La música de las botellas',
  ciencia: 'Sonido',
  fecha: '2026-10-30T12:40:00.000Z',
  hipotesis:
    'Creo que cuanta más agua eche, más grave sonará, porque la botella pesa más y vibra más lento.',
  prediccion: { texto: 'Si lleno más la botella, el sonido será más grave.', valor: null },
  resultado: {
    resumen:
      'Cuanto menos aire queda en la botella, más agudo suena: la frecuencia sube.\n' +
      'Con tus medidas, el sonido viaja a unos 316 m/s.',
    valores: [
      { etiqueta: 'Velocidad del sonido estimada', valor: 316, unidad: 'm/s' },
      { etiqueta: 'Error respecto a 343 m/s', valor: 7.9, unidad: '%' },
      { etiqueta: 'Medidas', valor: 4, unidad: '' },
    ],
    comparacion: 'Predijiste que al llenar la botella sonaría más grave, pero ha sonado más agudo.',
    explicaciones: [
      {
        titulo: '¿Por qué me sale menos de 343 m/s?',
        texto:
          'El aire que vibra no acaba justo en la boca de la botella: sobresale un poco. ' +
          'Además, el cuello estrecho cambia el sonido. Por eso la fórmula sencilla da menos.',
        preguntaId: 'botellas-correccion-extremo',
      },
      {
        titulo: '¿Me equivoqué en la hipótesis?',
        texto:
          'Pensabas que sonaría más grave y ha sonado más agudo. ¡Eso también es ciencia! ' +
          'Lo que vibra no es el agua, sino el aire de dentro. Menos aire, sonido más agudo.',
        preguntaId: 'general-hipotesis-falsa',
      },
    ],
    tabla: {
      columnas: [
        'Altura del aire (cm)',
        'Frecuencia medida (Hz)',
        'Frecuencia teórica (Hz)',
        'Diferencia (%)',
      ],
      filas: medidasBotella.map(({ altura, frecuencia }) => {
        const teorica = frecuenciaTeorica(altura)
        return [
          altura,
          frecuencia,
          redondear(teorica, 0),
          redondear(((frecuencia - teorica) / teorica) * 100),
        ]
      }),
    },
    grafica: {
      titulo: 'Frecuencia según el aire',
      ejeX: 'Altura del aire (cm)',
      ejeY: 'Frecuencia (Hz)',
      series: [
        {
          nombre: 'Medido',
          tipo: 'puntos',
          rol: 'medido',
          puntos: medidasBotella.map(({ altura, frecuencia }) => ({ x: altura, y: frecuencia })),
        },
        { nombre: 'Teoría', tipo: 'linea', rol: 'teorico', puntos: puntosBotellaTeoricos },
      ],
    },
  },
  respuestas: [
    {
      pregunta: '¿Con más aire el sonido es más grave o más agudo? ¿Se cumplió tu hipótesis?',
      respuesta: 'Más grave. No se cumplió: yo pensaba que el agua era lo que sonaba.',
    },
    {
      pregunta:
        '¿Por qué crees que la velocidad del sonido que has medido no da exactamente 343 m/s?',
      respuesta: 'Porque mi botella tiene cuello y a lo mejor medí mal la altura del aire.',
    },
    {
      pregunta:
        'Si en vez de soplar golpeas la botella con una cuchara, ¿qué crees que pasará al añadir agua?',
      respuesta: 'Creo que pasará al revés, porque entonces vibra el cristal y el agua.',
    },
  ],
}

// ---------- pH ----------
const muestrasPh = [
  { sustancia: 'Zumo de limón', color: 'rgb(214, 32, 78)', ph: 2.4, tipo: 'Ácida' },
  { sustancia: 'Vinagre', color: 'rgb(222, 46, 104)', ph: 2.8, tipo: 'Ácida' },
  { sustancia: 'Agua del grifo', color: 'rgb(118, 72, 160)', ph: 7.1, tipo: 'Neutra' },
  { sustancia: 'Bicarbonato', color: 'rgb(64, 96, 186)', ph: 8.4, tipo: 'Básica' },
  { sustancia: 'Jabón de manos', color: 'rgb(40, 140, 150)', ph: 9.6, tipo: 'Básica' },
]

const registroPh = {
  id: 'ejemplo-ph',
  experimentoId: 'ph',
  titulo: 'Indicador de pH con lombarda',
  ciencia: 'Química',
  fecha: '2026-10-28T09:15:00.000Z',
  hipotesis:
    'Creo que el vinagre será lo más ácido, porque sabe muy fuerte, y que el jabón será básico.',
  prediccion: {
    texto: 'De más ácida a más básica: vinagre, agua del grifo, bicarbonato',
    valor: null,
  },
  resultado: {
    resumen:
      'Has medido 5 sustancias: 2 ácidas, 1 neutra y 2 básicas.\n' +
      'Recuerda que es una estimación por el color: la luz y la cámara pueden cambiarla un poco.',
    valores: [
      { etiqueta: 'Más ácida: Zumo de limón', valor: 2.4, unidad: 'pH' },
      { etiqueta: 'Más básica: Jabón de manos', valor: 9.6, unidad: 'pH' },
      { etiqueta: 'Muestras medidas', valor: 5, unidad: '' },
    ],
    comparacion:
      'Predijiste este orden, de más ácida a más básica: vinagre, agua del grifo y bicarbonato. ¡Las medidas te dan la razón!',
    explicaciones: [
      {
        titulo: '¿Por qué salen casi iguales?',
        texto:
          '«Zumo de limón» y «Vinagre» solo se diferencian en 0,4 de pH. ' +
          'Con colores tan parecidos, un pequeño cambio de luz pesa más que la diferencia real. ' +
          'Si calibras con sustancias de pH conocido, la medida será más fina.',
        preguntaId: 'ph-color-engana',
      },
      {
        titulo: '¿Qué hace que algo sea ácido?',
        texto:
          'Han salido ácidas: Zumo de limón y Vinagre. ' +
          'Los ácidos sueltan en el agua unas partículas diminutas llamadas iones de hidrógeno. ' +
          'Cuantas más sueltan, más bajo es el pH y más rojo se vuelve el agua de lombarda.',
        preguntaId: 'ph-acido',
      },
      {
        titulo: '¿Cómo puedo medir con más precisión?',
        texto:
          'Esta vez la app ha usado una tabla de colores general. ' +
          'Si pulsas «Calibrar» y mides sustancias de pH conocido, como agua o vinagre, ' +
          'la app aprende con la luz y la cámara de tu clase.',
        preguntaId: 'ph-calibrar',
      },
    ],
    tabla: {
      columnas: ['Sustancia', 'Color', 'pH', 'Tipo'],
      filas: muestrasPh.map((m) => [m.sustancia, { color: m.color }, m.ph, m.tipo]),
    },
    grafica: {
      titulo: 'pH de cada muestra',
      ejeX: 'Número de muestra',
      ejeY: 'pH',
      series: [
        {
          nombre: 'Medido',
          tipo: 'puntos',
          rol: 'medido',
          puntos: muestrasPh.map((m, i) => ({ x: i + 1, y: m.ph })),
        },
      ],
    },
  },
  respuestas: [
    {
      pregunta: '¿Se cumplió tu hipótesis? ¿Qué sustancia te sorprendió más?',
      respuesta: 'Casi. Me sorprendió que el limón fuera todavía más ácido que el vinagre.',
    },
    {
      pregunta: '¿Qué tienen en común las sustancias ácidas?',
      respuesta: 'Que saben agrias y vuelven el agua de lombarda roja o rosa.',
    },
    {
      pregunta: '¿Por qué crees que el color no es exactamente igual en todas las fotos?',
      respuesta: 'Porque la luz de la clase cambia y la cámara no ve igual los colores.',
    },
  ],
}

export const registrosEjemplo = [registroRampa, registroBotellas, registroPh]

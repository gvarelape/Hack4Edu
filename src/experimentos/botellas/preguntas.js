// Banco de preguntas del asistente para el experimento de las botellas (CONTRATO.md, punto 5).
// Las respuestas las revisa el equipo: el asistente nunca genera texto.

export const preguntas = [
  // --- Ciencia ---
  {
    id: 'botellas-que-es-sonido',
    pregunta: '¿Qué es el sonido?',
    variantes: [
      'qué es el sonido',
      'de qué está hecho el sonido',
      'cómo se produce un sonido',
      'cómo llega el sonido a mis oídos',
    ],
    respuesta:
      'El sonido es una vibración que viaja, normalmente por el aire. Algo vibra y empuja al aire que tiene al lado, que empuja al siguiente, y así hasta llegar a tu oído. El aire no viaja contigo: lo que avanza es la vibración, como una ola en un estadio.',
    momento: 'siempre',
    relacionadas: ['botellas-frecuencia', 'botellas-velocidad-sonido'],
  },
  {
    id: 'botellas-frecuencia',
    pregunta: '¿Qué es la frecuencia?',
    variantes: [
      'qué es la frecuencia',
      'qué significa frecuencia',
      'qué mide la frecuencia',
      'qué es el número que sale en la pantalla',
    ],
    respuesta:
      'La frecuencia es cuántas veces vibra algo en un segundo. Si el aire de la botella vibra 400 veces por segundo, su frecuencia es de 400 hercios. Cuanto más alta es la frecuencia, más agudo suena.',
    momento: 'siempre',
    relacionadas: ['botellas-hercio', 'botellas-grave-agudo'],
  },
  {
    id: 'botellas-hercio',
    pregunta: '¿Qué es un hercio?',
    variantes: [
      'qué es un hercio',
      'qué significa hz',
      'qué son los hz',
      'qué quiere decir 400 hz',
    ],
    respuesta:
      'El hercio (Hz) es la unidad de la frecuencia. Un hercio es una vibración por segundo, así que 400 Hz son 400 vibraciones cada segundo. Se llama así por el científico Heinrich Hertz.',
    momento: 'siempre',
    relacionadas: ['botellas-frecuencia'],
  },
  {
    id: 'botellas-grave-agudo',
    pregunta: '¿Qué diferencia hay entre un sonido grave y uno agudo?',
    variantes: [
      'qué es grave y agudo',
      'qué significa grave',
      'qué significa agudo',
      'es lo mismo agudo que fuerte',
      'cómo sé si suena más grave',
    ],
    respuesta:
      'Un sonido grave tiene una frecuencia baja, como un tambor o una voz profunda. Uno agudo tiene una frecuencia alta, como un silbato. No tiene nada que ver con el volumen: un sonido agudo puede ser muy flojo y uno grave, muy fuerte.',
    momento: 'siempre',
    relacionadas: ['botellas-frecuencia', 'botellas-mas-aire-grave'],
  },
  {
    id: 'botellas-resonancia',
    pregunta: '¿Qué es la resonancia?',
    variantes: [
      'qué es la resonancia',
      'qué significa resonar',
      'qué es resonar',
      'por qué resuena la botella',
    ],
    respuesta:
      'La resonancia ocurre cuando algo vibra con mucha fuerza porque lo empujan justo a su ritmo natural. Es como un columpio: si empujas en el momento justo, sube cada vez más. El aire de la botella tiene su propio ritmo, y al soplar vibra sobre todo a ese ritmo.',
    momento: 'siempre',
    relacionadas: ['botellas-por-que-suena'],
  },
  {
    id: 'botellas-por-que-suena',
    pregunta: '¿Por qué suena una botella al soplar?',
    variantes: [
      'por qué suena la botella',
      'de dónde sale el sonido de la botella',
      'qué vibra al soplar',
      'cómo hace ruido la botella si solo soplo',
    ],
    respuesta:
      'Al soplar de lado, el chorro de aire choca con el borde de la boca y empieza a temblar. Ese temblor pone a vibrar el aire de dentro, que refuerza su propio tono por resonancia. Por eso lo que suena no es el vidrio, sino el aire.',
    momento: 'antes',
    relacionadas: ['botellas-resonancia', 'botellas-mas-aire-grave'],
  },
  {
    id: 'botellas-mas-aire-grave',
    pregunta: '¿Por qué con más aire suena más grave?',
    variantes: [
      'por qué con más aire suena más grave',
      'por qué con más agua suena más agudo',
      'por qué cambia el sonido al llenar la botella',
      'por qué al echar agua cambia el tono',
    ],
    respuesta:
      'Dentro de la botella cabe una onda de sonido más larga cuanto más aire hay. Las ondas largas tardan más en ir y venir, así que hay menos vibraciones por segundo y suena más grave. Al echar agua, dejas menos aire y el sonido se vuelve más agudo.',
    momento: 'siempre',
    relacionadas: ['botellas-formula', 'botellas-golpear'],
  },
  {
    id: 'botellas-formula',
    pregunta: '¿Qué significa la fórmula f = v / (4 · L)?',
    variantes: [
      'qué significa la fórmula',
      'de dónde sale la fórmula',
      'por qué se divide entre 4',
      'qué es la L de la fórmula',
      'qué es el modelo del tubo',
    ],
    respuesta:
      'La f es la frecuencia, la v es la velocidad del sonido y la L es la altura del aire en metros. Se divide entre 4 porque en un tubo cerrado por abajo cabe justo un cuarto de la onda. Si L se hace el doble, la frecuencia se queda en la mitad: eso es una proporcionalidad inversa.',
    momento: 'siempre',
    relacionadas: ['botellas-mas-aire-grave', 'botellas-calculo-velocidad'],
  },
  {
    id: 'botellas-velocidad-sonido',
    pregunta: '¿A qué velocidad viaja el sonido?',
    variantes: [
      'qué es la velocidad del sonido',
      'a qué velocidad va el sonido',
      'cuánto corre el sonido',
      'por qué 343 m/s',
      'por qué primero veo el rayo y luego oigo el trueno',
    ],
    respuesta:
      'En el aire, a unos 20 °C, el sonido viaja a unos 343 metros por segundo. Es muy rápido, pero mucho menos que la luz. Por eso en una tormenta ves antes el rayo y oyes después el trueno.',
    momento: 'siempre',
    relacionadas: ['botellas-temperatura', 'botellas-agua-vacio'],
  },
  {
    id: 'botellas-temperatura',
    pregunta: '¿De qué depende la velocidad del sonido?',
    variantes: [
      'de qué depende la velocidad del sonido',
      'influye la temperatura',
      'el sonido va más rápido con calor',
      'el sonido va igual en invierno y en verano',
    ],
    respuesta:
      'Sobre todo del material por el que viaja y de su temperatura. En el aire, cuanto más calor hace, más rápido va: unos 331 m/s a 0 °C y unos 343 m/s a 20 °C. Es decir, sube más o menos 0,6 m/s por cada grado.',
    momento: 'resultados',
    relacionadas: ['botellas-velocidad-sonido', 'botellas-modelo-aproximado'],
  },
  {
    id: 'botellas-agua-vacio',
    pregunta: '¿El sonido viaja por el agua y por el vacío?',
    variantes: [
      'el sonido viaja por el agua',
      'se oye debajo del agua',
      'hay sonido en el espacio',
      'el sonido viaja por el vacío',
    ],
    respuesta:
      'Por el agua viaja muy bien: a unos 1500 m/s, más de cuatro veces más rápido que por el aire. En el vacío no puede viajar, porque no hay nada que vibre. Por eso en el espacio reina el silencio, aunque en las películas se oigan explosiones.',
    momento: 'siempre',
    relacionadas: ['botellas-velocidad-sonido'],
  },
  {
    id: 'botellas-instrumentos',
    pregunta: '¿Qué tiene que ver esto con los instrumentos de viento?',
    variantes: [
      'tiene que ver con la flauta',
      'cómo funciona una flauta',
      'cómo funciona un órgano',
      'la botella es un instrumento',
      'por qué los tubos del órgano son de distinto tamaño',
    ],
    respuesta:
      'Funcionan con la misma idea: hacen vibrar una columna de aire. En una flauta, al tapar y destapar agujeros cambias el largo de esa columna y, con él, la nota. En un órgano, cada tubo da una nota: los largos suenan graves y los cortos, agudos.',
    momento: 'siempre',
    relacionadas: ['botellas-mas-aire-grave'],
  },

  // --- Montaje ---
  {
    id: 'botellas-que-botella',
    pregunta: '¿Qué botella uso?',
    variantes: [
      'qué botella uso',
      'cuál es la mejor botella',
      'sirve una botella de plástico',
      'sirve una botella de vino',
      'importa la forma de la botella',
    ],
    respuesta:
      'Usa una botella o un tarro lo más recto posible, mejor de vidrio. Las de plástico blando también pueden servir si no se deforman. Evita las de cuello largo y estrecho, porque no se comportan como un tubo y la velocidad te saldrá muy mal.',
    momento: 'antes',
    relacionadas: ['botellas-correccion-extremo', 'botellas-como-soplar'],
  },
  {
    id: 'botellas-medir-altura',
    pregunta: '¿Cómo mido la altura del aire?',
    variantes: [
      'cómo mido la altura del aire',
      'desde dónde mido',
      'qué altura tengo que poner',
      'mido el agua o el aire',
      'dónde pongo la regla',
    ],
    respuesta:
      'Mide la parte vacía: desde la superficie del agua hasta la boca de la botella. No midas el agua ni la botella entera. Pon la botella en una mesa y apoya la regla por fuera para que sea más fácil. Escribe el resultado en centímetros.',
    momento: 'durante',
    relacionadas: ['botellas-mejorar', 'botellas-v-alta'],
  },
  {
    id: 'botellas-como-soplar',
    pregunta: '¿Cómo tengo que soplar?',
    variantes: [
      'cómo soplo',
      'no me suena la botella',
      'no consigo que suene',
      'solo sale aire al soplar',
      'cómo hago que suene',
    ],
    respuesta:
      'Apoya la boca de la botella en tu labio inferior y sopla suave por encima, de lado, no hacia dentro. Es como decir "fu" sin fuerza. Si solo oyes aire, cambia un poco el ángulo hasta que aparezca un tono continuo. ¡Suele costar un par de intentos!',
    momento: 'durante',
    relacionadas: ['botellas-no-detecta', 'botellas-por-que-suena'],
  },

  // --- Problemas al medir ---
  {
    id: 'botellas-no-detecta',
    pregunta: '¿Qué hago si la app no detecta el tono?',
    variantes: [
      'no detecta el tono',
      'no me deja registrar',
      'sale que no detecto un tono claro',
      'la barrita no sube',
      'no marca ninguna frecuencia',
    ],
    respuesta:
      'Comprueba primero que oyes un tono continuo y no solo aire. Acerca el móvil a la botella, pero de lado, para que no le dé el soplido en el micrófono. Sopla sin parar y pulsa Registrar mientras suena.',
    momento: 'durante',
    relacionadas: ['botellas-como-soplar', 'botellas-frecuencia-salta'],
  },
  {
    id: 'botellas-frecuencia-salta',
    pregunta: '¿Por qué la frecuencia salta todo el rato?',
    variantes: [
      'la frecuencia salta',
      'el número no para de cambiar',
      'la frecuencia cambia sola',
      'no se queda quieto el número',
      'el tono no es estable',
    ],
    respuesta:
      'Normalmente es porque el soplido cambia o porque el móvil oye solo aire, sin un tono claro. Sopla más suave y sin parar, manteniendo la botella quieta. Cuando el tono sea estable, la barrita se llenará y podrás registrar.',
    momento: 'durante',
    relacionadas: ['botellas-ruido', 'botellas-sale-doble'],
  },
  {
    id: 'botellas-ruido',
    pregunta: '¿Qué hago si hay mucho ruido en clase?',
    variantes: [
      'hay mucho ruido',
      'hay ruido en clase',
      'mis compañeros hablan y falla',
      'el ruido afecta a la medida',
      'detecta las voces',
    ],
    respuesta:
      'El móvil oye todo, así que las voces y los golpes pueden molestar. Busca un rincón tranquilo o pide un momento de silencio mientras soplas. Pon también el móvil cerca de la botella, para que su sonido destaque sobre el resto.',
    momento: 'durante',
    relacionadas: ['botellas-no-detecta'],
  },
  {
    id: 'botellas-sale-doble',
    pregunta: '¿Por qué me sale mucho más alto de lo esperado, como el doble?',
    variantes: [
      'me sale el doble',
      'me sale el triple',
      'la frecuencia es demasiado alta',
      'qué es un armónico',
      'sale mucho más agudo de lo normal',
    ],
    respuesta:
      'Puede ser un armónico: una vibración extra, más rápida, que aparece junto al tono principal. Si soplas fuerte, la botella puede saltar a él. En un tubo como este suele ser unas 3 veces el tono principal, aunque también pueden salir otros valores. Sopla más suave y vuelve a medir.',
    momento: 'durante',
    relacionadas: ['botellas-medida-rara', 'botellas-frecuencia-salta'],
  },

  // --- Entender el resultado ---
  {
    id: 'botellas-correccion-extremo',
    pregunta: '¿Por qué me sale menos de 343 m/s?',
    variantes: [
      'por qué me sale menos de 343',
      'me sale muy poca velocidad',
      'por qué sale tan baja la velocidad',
      'qué es la corrección de extremo',
      'influye el cuello de la botella',
    ],
    respuesta:
      'Lo más probable es que tu botella tenga cuello estrecho. Entonces el aire del cuello rebota como sobre un muelle (se llama resonador de Helmholtz) y la fórmula del tubo deja de encajar. Además, el aire vibra un poco por encima de la boca: es la corrección de extremo. Prueba con una botella más recta.',
    momento: 'resultados',
    relacionadas: ['botellas-que-botella', 'botellas-modelo-aproximado'],
  },
  {
    id: 'botellas-v-alta',
    pregunta: '¿Por qué me sale más de 343 m/s?',
    variantes: [
      'por qué me sale más de 343',
      'me sale demasiada velocidad',
      'por qué sale tan alta la velocidad',
      'el sonido no puede ir tan rápido',
    ],
    respuesta:
      'Suele deberse a la altura del aire: un error de poco más de un centímetro cambia bastante el resultado. También influye la forma de la botella, si se estrecha en los hombros. Repasa cómo has medido y vuelve a probar con niveles bien separados.',
    momento: 'resultados',
    relacionadas: ['botellas-medir-altura', 'botellas-mejorar'],
  },
  {
    id: 'botellas-medida-rara',
    pregunta: '¿Por qué una medida no sigue el patrón?',
    variantes: [
      'una medida no sigue el patrón',
      'hay un punto raro en la gráfica',
      'con más aire me sale más agudo',
      'una medida está mal',
      'por qué un punto se sale de la curva',
    ],
    respuesta:
      'Puede que la botella saltara a un armónico, un tono más agudo que aparece al soplar fuerte. También puede que soplaras distinto o que midieras mal esa altura. Borra esa medida y repítela soplando más suave.',
    momento: 'resultados',
    relacionadas: ['botellas-sale-doble', 'botellas-medir-altura'],
  },
  {
    id: 'botellas-mejorar',
    pregunta: '¿Cómo mejoro la medida?',
    variantes: [
      'cómo mejoro la medida',
      'cómo consigo que salga mejor',
      'cuántas medidas tengo que hacer',
      'cómo hago para que salga más exacto',
      'cuánta agua echo en cada medida',
    ],
    respuesta:
      'Haz al menos 4 medidas, con niveles de agua bien separados: mejor si hay más de 5 cm entre la altura mayor y la menor. Mide la altura con cuidado y sopla igual en todas. Cuanto más distintas sean las alturas, menos influye un error pequeño.',
    momento: 'resultados',
    relacionadas: ['botellas-medir-altura', 'botellas-modelo-aproximado'],
  },
  {
    id: 'botellas-modelo-aproximado',
    pregunta: '¿Por qué no sale exactamente 343 m/s?',
    variantes: [
      'por qué no sale exacto',
      'por qué no me da 343 exacto',
      'he hecho algo mal si no sale 343',
      'qué es un modelo',
      'la fórmula está mal',
    ],
    respuesta:
      'Porque la fórmula es un modelo: una descripción sencilla de la realidad, no la realidad entera. Describe una botella ideal, y la tuya es real, con su forma y sus pequeños errores de medida. Además, 343 m/s es el valor a unos 20 °C. Si te sale algo cercano, ¡lo has hecho muy bien!',
    momento: 'resultados',
    relacionadas: ['botellas-temperatura', 'botellas-mejorar'],
  },

  // --- Cómo funciona la app ---
  {
    id: 'botellas-fft',
    pregunta: '¿Cómo sabe el móvil la frecuencia del sonido?',
    variantes: [
      'cómo sabe el móvil la frecuencia',
      'cómo funciona la app',
      'qué es la fft',
      'cómo mide el móvil el sonido',
      'el móvil usa inteligencia artificial',
    ],
    respuesta:
      'Usa una operación matemática llamada FFT, que separa un sonido en todas sus frecuencias, igual que un prisma separa la luz en colores. Después, la app se queda con la más fuerte entre 80 y 2000 Hz. No hace falta inteligencia artificial: son matemáticas.',
    momento: 'siempre',
    relacionadas: ['botellas-frecuencia', 'botellas-sin-internet'],
  },
  {
    id: 'botellas-sin-internet',
    pregunta: '¿Por qué no necesita internet?',
    variantes: [
      'por qué no necesita internet',
      'funciona sin internet',
      'funciona sin wifi',
      'se envía mi sonido a algún sitio',
      'graba lo que digo',
    ],
    respuesta:
      'Porque todos los cálculos los hace tu móvil, sin enviar nada a ningún sitio. El micrófono solo se usa para calcular la frecuencia en ese momento. No se guarda ningún audio: solo se guardan los números de tu experimento.',
    momento: 'siempre',
    relacionadas: ['botellas-fft'],
  },
  {
    id: 'botellas-calculo-velocidad',
    pregunta: '¿Cómo calcula la app la velocidad del sonido?',
    variantes: [
      'cómo calcula la velocidad',
      'de dónde sale la velocidad',
      'cómo sale la velocidad con una botella',
      'por qué hacen falta varias medidas',
      'qué cálculo hace la app',
    ],
    respuesta:
      'Con cada medida tiene una altura de aire y una frecuencia. Con todas ellas busca la recta que mejor encaja y, de su inclinación, saca la velocidad del sonido. Por eso hacen falta varias medidas: con una sola no se puede dibujar una recta.',
    momento: 'resultados',
    relacionadas: ['botellas-formula', 'botellas-mejorar'],
  },

  // --- Curiosidades ---
  {
    id: 'botellas-golpear',
    pregunta: '¿Qué pasa si golpeo la botella en vez de soplar?',
    variantes: [
      'qué pasa si golpeo la botella',
      'por qué al golpear pasa lo contrario',
      'qué pasa si le doy con una cuchara',
      'golpear la botella con agua',
    ],
    respuesta:
      'Pasa justo lo contrario: al añadir agua, el sonido se vuelve más grave. Al golpear, lo que vibra es el vidrio junto con el agua, no el aire. Cuanta más agua, más peso tiene que mover y más despacio vibra.',
    momento: 'resultados',
    relacionadas: ['botellas-mas-aire-grave'],
  },
  {
    id: 'botellas-helio',
    pregunta: '¿Por qué el helio cambia la voz?',
    variantes: [
      'por qué el helio cambia la voz',
      'qué pasa con la voz de los globos',
      'por qué se pone voz de pito',
      'voz de helio',
    ],
    respuesta:
      'Porque el sonido viaja casi tres veces más rápido por el helio que por el aire. Al cambiar esa velocidad, cambia cómo resuena el aire dentro de tu boca y tu garganta, y la voz parece más aguda. Es la misma idea que en la botella. No lo pruebes: respirar helio puede ser peligroso.',
    momento: 'siempre',
    relacionadas: ['botellas-velocidad-sonido', 'botellas-resonancia'],
  },
  {
    id: 'botellas-oido',
    pregunta: '¿Qué frecuencias puede oír una persona?',
    variantes: [
      'qué frecuencias oímos',
      'cuánto oye el oído humano',
      'qué frecuencia no se puede oír',
      'hasta cuántos hercios oímos',
      'por qué los mayores oyen menos los agudos',
    ],
    respuesta:
      'Una persona joven oye más o menos de 20 Hz a 20 000 Hz. Con la edad se van perdiendo sobre todo los agudos. Por debajo de ese rango están los infrasonidos y por encima, los ultrasonidos.',
    momento: 'siempre',
    relacionadas: ['botellas-frecuencia', 'botellas-grave-agudo'],
  },
]

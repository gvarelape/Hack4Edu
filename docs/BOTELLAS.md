# Experimento botellas · Alejandro

> **Para la IA:** estás ayudando a **Alejandro**. Solo puedes tocar `src/experimentos/botellas/`. Lee también `REGLAS.md` y `CONTRATO.md`.

## Objetivo

El alumno sopla por la boca de una botella con distintas cantidades de agua y el micrófono del móvil mide **la frecuencia del sonido**. Descubre la relación entre el aire de dentro y el tono, y al final **estima la velocidad del sonido** con una botella.

**Qué aprende:** qué es la frecuencia, la resonancia, la relación de proporcionalidad inversa y que un modelo matemático es una aproximación de la realidad.

**Papel en la demo:** el remate. "Con una botella hemos medido la velocidad del sonido". Además, enseña que la app sirve para más de una asignatura.

## Datos del objeto experimento

> Los textos los escribe Alejandro siguiendo la guía de tono de `DISENO.md`, y Nicolás los revisa.

- **id:** `'botellas'` · **ciencia:** `'Sonido'`
- **titulo:** La música de las botellas
- **descripcion:** Mide la velocidad del sonido soplando una botella
- **pregunta:** ¿Cómo cambia el sonido de una botella al llenarla de agua?
- **materiales:**
  - Una botella, mejor de vidrio y lo más recta posible.
  - Agua.
  - Una regla.
  - Un sitio sin mucho ruido.
- **instrucciones:**
  1. Echa algo de agua en la botella.
  2. Mide con la regla la **altura del aire**: desde la superficie del agua hasta la boca de la botella.
  3. Sopla por encima de la boca, de lado, hasta que suene un tono continuo.
  4. Repite con al menos 4 niveles de agua distintos.
- **seguridad:** `[]`
- **reflexion:**
  - ¿Con más aire el sonido es más grave o más agudo? ¿Se cumplió tu hipótesis?
  - ¿Por qué crees que la velocidad del sonido que has medido no da exactamente 343 m/s?
  - Si en vez de soplar golpeas la botella con una cuchara, ¿qué crees que pasará al añadir agua?
- **preguntas:** el banco de `preguntas.js` (ver "Asistente").
- **recursos:** `[]`

## La ciencia

- Al soplar, **el aire de dentro vibra** como el aire de un tubo cerrado por abajo (el agua) y abierto por arriba (la boca).
- **Modelo sencillo (tubo cerrado):** el tubo resuena con un cuarto de onda, así que **f = v / (4 · L)**, donde L es la altura del aire y v es la velocidad del sonido (unos 343 m/s a 20 °C).
  - Más aire (L mayor) da un sonido **más grave** (f menor).
  - Si se dibuja **f frente a 1/L**, sale **una recta** de pendiente v/4. **Con la pendiente se calcula la velocidad del sonido**: v = 4 · pendiente. Es el dato estrella del experimento.
- **Por qué no sale exacto:**
  - El aire vibra un poco por encima de la boca: es la *corrección de extremo*, más o menos 0,6 veces el radio de la boca.
  - Las botellas con cuello estrecho se comportan más como un **resonador de Helmholtz** que como un tubo.

  Por eso funciona mejor con botellas rectas, y esto da pie a la segunda pregunta de reflexión.
- **Extra para la reflexión:** al **golpear** la botella lo que vibra es el vidrio y el agua, no el aire. Al añadir agua el sonido se vuelve **más grave**, justo al revés que al soplar.

## Cómo funciona por dentro

No usa IA: con matemáticas normales (la FFT) basta, y así se explica en el pitch.

1. **Micrófono:** `useMicrofono` del core, con un analizador de `fftSize = 8192`.
2. **Frecuencia dominante**, en cada fotograma:
   - Se lee el espectro con `getFloatFrequencyData`.
   - Se busca el pico entre **80 y 2000 Hz**.
   - Si el pico está por debajo de unos −70 dB, no hay tono: se devuelve `null`.
   - **Interpolación parabólica** con los dos valores de al lado, para afinar más que la resolución de la FFT, que es de unos 6 Hz.
3. **Estabilidad:** se guardan las frecuencias válidas del **último segundo** con su instante. Una lectura solo se acepta si hay al menos 5 valores y su dispersión es pequeña, por debajo del 3 %. El valor final es la **mediana**.
4. **Análisis final:**
   - Regresión lineal de f frente a 1/L (L en metros). La velocidad estimada es v = 4 · pendiente.
   - Error respecto a 343 m/s.
   - Frecuencia teórica de cada medida con f = 343 / (4·L), para compararla.

## Pantallas

### Simulación (`Simulacion`)

- Una **botella virtual** con un deslizador para el nivel de agua, de vacía a casi llena.
- Al pulsar "Soplar", **suena el tono teórico** con un `OscillatorNode` de Web Audio durante 1 segundo, y se muestra la frecuencia.
- Una gráfica que se va construyendo: frecuencia frente a altura del aire, con rol `'simulado'`.
- **Predicción:** "Si llenas más la botella, el sonido será… más agudo / más grave / igual".
- `onContinuar({ texto: 'Predijo: más agudo', valor: null })`.

### Medición (`Medicion`)

1. "Activar micrófono".
2. **Lectura en directo:** la frecuencia en grande ("612 Hz") y una barrita que indica si el tono es estable.
3. Campo "Altura del aire (cm)" con `CampoNumero`.
4. Botón **"Registrar"**. El alumno sopla y pulsa mientras suena. Si no hay un tono estable, sale el aviso "No detecto un tono claro: sopla de forma continua".
5. Tabla con las medidas guardadas (altura y frecuencia), con la opción de borrar cada una.
6. Botón **"Terminar"**, que se activa con al menos 3 medidas.

## Resultado (según `CONTRATO.md`)

- **valores:**
  1. `{ etiqueta: 'Velocidad del sonido estimada', valor: 330, unidad: 'm/s' }`
  2. `{ etiqueta: 'Error respecto a 343 m/s', valor: 3.8, unidad: '%' }`
  3. `{ etiqueta: 'Medidas', valor: 4, unidad: '' }`
- **resumen:** si con más aire suena más grave, la velocidad estimada y una frase sobre por qué no es exacta.
- **comparacion:** si la predicción (más agudo / más grave / igual al añadir agua) coincide con lo medido.
- **explicaciones:** según las reglas de abajo.
- **tabla:** columnas `Altura del aire (cm)`, `Frecuencia medida (Hz)`, `Frecuencia teórica (Hz)` y `Diferencia (%)`.
- **grafica:** frecuencia (Hz) frente a altura del aire (cm), con los puntos medidos (rol `'medido'`) y la curva teórica f = 343 / (4·L) (rol `'teorico'`).

## Asistente: explicaciones y preguntas

### Explicaciones automáticas (`explicaciones.js`)

| Si pasa esto… | …título de la explicación | `preguntaId` |
|---|---|---|
| v estimada < 320 m/s | ¿Por qué me sale menos de 343 m/s? (corrección de extremo, cuello) | `botellas-correccion-extremo` |
| v estimada > 370 m/s | ¿Por qué me sale más de 343 m/s? (altura mal medida, botella con hombros) | `botellas-v-alta` |
| Alguna medida rompe la tendencia (más aire y más agudo) | ¿Por qué una medida no sigue el patrón? (armónico, soplido distinto) | `botellas-medida-rara` |
| Medidas en un rango de alturas pequeño (< 5 cm entre la mayor y la menor) | ¿Cómo mejoro la medida? (más niveles, más separados) | `botellas-mejorar` |
| La predicción no coincide | ¿Me equivoqué en la hipótesis? | `general-hipotesis-falsa` |

Máximo 3, de la más importante a la menos.

### Banco de preguntas (`preguntas.js`, 20–30)

Temas que tiene que cubrir (con `id` que empiecen por `botellas-`):
- **Ciencia:** qué es el sonido, qué es la frecuencia, qué es un hercio, grave y agudo, qué es la resonancia, por qué suena una botella al soplar, por qué más aire suena más grave, qué es la velocidad del sonido y de qué depende (temperatura), sonido en el agua y en el vacío, instrumentos de viento (flauta, órgano).
- **Montaje:** qué botella usar, cómo medir la altura del aire, cómo soplar para que suene.
- **Problemas al medir:** no detecta el tono, la frecuencia salta, hay ruido en clase, sale el doble de lo esperado (armónicos).
- **Cómo funciona la app:** cómo sabe el móvil la frecuencia (la FFT explicada sencilla), por qué no necesita internet.
- **Curiosidades:** por qué al golpear la botella pasa lo contrario, la voz de helio, el oído humano (20 Hz – 20.000 Hz).

Cada pregunta con 3–6 `variantes` escritas como lo diría un alumno, y respuesta de 2–5 frases.

## Archivos

```
src/experimentos/botellas/
├── index.js
├── Simulacion.jsx
├── Medicion.jsx
├── analisisAudio.js        (frecuenciaDominante, lecturaEstable)
├── modelo.js               (frecuenciaTeorica, regresionLineal, velocidadSonido)
├── crearResultado.js
├── explicaciones.js
├── preguntas.js
├── botellas.css
└── datos/                  (grabaciones de prueba, solo para desarrollar)
```

## Datos que tiene que llevar Alejandro

- [ ] Probar 2 o 3 botellas y quedarse con la que suene más clara y sea más recta.
- [ ] **Grabaciones** con el móvil, de unos 3 segundos soplando cada una, con 4 o 5 niveles de agua. Apuntar la altura del aire en el nombre del archivo, por ejemplo `botella_aire12cm.m4a`.
- [ ] Una grabación con ruido de fondo de clase, para probar que no da lecturas falsas.

## Prompts en orden

1. "Crea `analisisAudio.js` con `frecuenciaDominante(analizador, frecuenciaMuestreo)` y `lecturaEstable(historial, ahora)`, según BOTELLAS.md. Funciones puras salvo la lectura del analizador."
2. "Crea `modelo.js` con `frecuenciaTeorica(alturaCm)`, `regresionLineal(xs, ys)` y `velocidadSonido(medidas)`. Añade un ejemplo con datos inventados para comprobar que la v estimada sale cerca de 343."
3. "Crea `explicaciones.js` con las reglas de BOTELLAS.md y `crearResultado.js`, que monte el `resultado` exactamente como dice CONTRATO.md."
4. "Crea `Medicion.jsx` con `useMicrofono` del core: lectura en directo, campo de altura, Registrar, tabla de medidas y Terminar." (*Probar en `#/prueba/botellas` con las grabaciones de `datos/`.*)
5. "Crea `Simulacion.jsx` con la botella virtual, el tono con `OscillatorNode`, la gráfica simulada y la predicción."
6. "Ayúdame a escribir `preguntas.js` con 20–30 preguntas sobre los temas de BOTELLAS.md, en el formato de CONTRATO.md, punto 5. Yo reviso que las respuestas sean correctas."
7. "Crea `index.js` con el objeto experimento completo según BOTELLAS.md."

## Criterios de aceptación

- [ ] Soplando de forma continua, la frecuencia en directo varía menos de un 3 %.
- [ ] Con 4 niveles de agua en una botella recta, **la v estimada sale entre 290 y 400 m/s**.
- [ ] Con más aire, la frecuencia medida es siempre más baja.
- [ ] Con ruido de fondo y sin soplar, no registra lecturas falsas.
- [ ] Las explicaciones cambian según lo medido y cada `preguntaId` existe en el banco.
- [ ] Funciona en `#/prueba/botellas` con una grabación de prueba y el validador no da errores.

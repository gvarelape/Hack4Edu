# Experimento rampa · Adrián

> **Para la IA:** estás ayudando a **Adrián**. Solo puedes tocar `src/experimentos/rampa/` y `public/modelos/rampa/`. Lee también `REGLAS.md` y `CONTRATO.md`.

## Objetivo

El alumno graba con el móvil, **apoyado y quieto**, una pelota que baja por una rampa. La app sigue la pelota fotograma a fotograma, saca la gráfica posición–tiempo y **calcula la aceleración y la gravedad**.

> El móvil **nunca** se mueve ni se tira: observa. Se descartó la idea de dejar caer el móvil o colgarlo, porque nadie quiere hacer eso con su teléfono.

**Qué aprende:** movimiento uniformemente acelerado, que la distancia crece con el tiempo al cuadrado, el plano inclinado y por qué una bola que rueda baja más despacio que una que desliza.

**Papel en la demo:** es el momento técnico. La IA encuentra la pelota sola, dentro del móvil y sin internet.

## Datos del objeto experimento

> Los textos los escribe Adrián siguiendo la guía de tono de `DISENO.md`, y Nicolás los revisa.

- **id:** `'rampa'` · **ciencia:** `'Física'`
- **titulo:** Pelota en una rampa
- **descripcion:** Mide la gravedad con una pelota y un libro
- **pregunta:** ¿Cómo cambia la velocidad de una pelota mientras baja por una rampa?
- **materiales:**
  - Una pelota de color llamativo (mejor maciza: de goma o una canica grande).
  - Una tabla o un libro grande para hacer la rampa.
  - Una regla o cinta métrica.
  - Cinta adhesiva de color para marcar dos puntos.
  - Algo para apoyar el móvil.
- **instrucciones:**
  1. Haz una rampa poco inclinada, más o menos un palmo de altura en un metro de largo.
  2. Mide la altura y el largo de la rampa.
  3. Pega dos trozos de cinta en la rampa a una distancia que conozcas, por ejemplo 30 cm.
  4. Apoya el móvil de lado, a 1 o 2 metros, de forma que se vea la rampa entera.
  5. Busca un fondo liso y buena luz.
- **seguridad:** `[]`
- **reflexion:**
  - ¿La pelota recorre la misma distancia en cada segundo? ¿Qué te dice la forma de la gráfica?
  - ¿Te sale una gravedad menor que 9,8 si no tienes en cuenta que la bola rueda? ¿Por qué rodar "roba" aceleración?
  - ¿Qué crees que pasaría con más inclinación o con una pelota hueca?
- **preguntas:** el banco de `preguntas.js` (ver "Asistente").
- **recursos:** las rutas de los archivos de `public/modelos/rampa/` (modelo y wasm).

## La ciencia

- **Movimiento:** la pelota parte del reposo con aceleración constante, así que la distancia recorrida sigue **s = ½ · a · t²**.
- **Plano inclinado:** sinθ = altura / largo. Así no hace falta transportador.
- **Aceleración según cómo baja:**
  - Desliza sin rozamiento: **a = g · sinθ**.
  - Bola maciza que rueda: **a = (5/7) · g · sinθ**.
  - Bola hueca que rueda, como una de ping-pong: **a = (3/5) · g · sinθ**.

  Parte de la energía se gasta en hacer girar la bola. Este es **el momento "¡ajá!" del experimento**: sin el factor de rodadura sale una g de unos 7 m/s², y con el factor sale cerca de 9,8.
- **Gravedad estimada:** g = a / (factor · sinθ). El factor es 1, 5/7 o 3/5 según el tipo de bola que elija el alumno.

## Cómo funciona por dentro

### 1. Escala (píxeles → centímetros)

El alumno **toca en la imagen las dos marcas de cinta** e introduce la distancia real entre ellas. Escala = distancia real (cm) / distancia en píxeles.

### 2. Encontrar la pelota (aquí está la IA)

Sistema **híbrido**, para que vaya fluido en móviles baratos:

1. **La IA encuentra la pelota:** se usa el detector de objetos de **MediaPipe** (`@mediapipe/tasks-vision`, `ObjectDetector`), con un modelo ligero tipo **EfficientDet-Lite0**, que ya viene entrenado y sabe reconocer pelotas (categoría `sports ball`). **No hay que entrenar nada.** Se ejecuta en modo `VIDEO` con `scoreThreshold` de 0,3, más o menos.
2. **La IA aprende el color:** cuando detecta la pelota, toma el color medio del centro de su recuadro y se lo muestra al alumno: "He encontrado la pelota". Así el alumno no tiene que elegirlo.
3. **Seguimiento rápido por color:** durante la grabación se sigue la pelota por su color, que es mucho más rápido que pasar la IA en cada fotograma:
   - Se reduce cada fotograma a unos 160 px de ancho.
   - Se marcan los píxeles cuyo color está cerca del de la pelota, con una tolerancia ajustable.
   - El centro de la pelota es la media de esos píxeles. Si hay menos de unos 8, no se cuenta como detección.
   - Opcional: cada 15 fotogramas, la IA vuelve a comprobar que sigue siendo la pelota.
4. **Plan B sin IA:** si el modelo no ha cargado o no encuentra la pelota en 3 segundos, el alumno **toca la pelota en la imagen** para elegir su color.

**Limitaciones del detector** (para saberlas y contarlas si preguntan): solo reconoce las ~80 categorías con las que viene entrenado, no entiende nada más, y con pelotas raras, poca luz o mucho desorden de fondo puede fallar. Para eso está el plan B.

**Tamaño y descarga:**
- El modelo pesa **unos 4–7 MB** según la versión, y el motor de MediaPipe (los archivos `wasm`) añade **unos cuantos MB más**. Comprobad el total real al montarlo.
- Todo va **dentro del proyecto**, en `public/modelos/rampa/`. No se descarga de ningún CDN: en `FilesetResolver.forVisionTasks()` se pasa la ruta local de los `wasm`, y en `modelAssetPath` la ruta local del modelo.
- Se carga **solo al entrar en la medición** (o desde Ajustes), y mientras carga se muestra `Cargando` con su progreso. Después queda en la caché y funciona sin internet.

### 3. Grabar

- Se usa `useBucleFotogramas` del core: el tiempo de cada fotograma sale del propio vídeo, que es más preciso.
- Cada punto guarda `{ t, x, y }` en píxeles.
- Se dibuja un punto encima del vídeo en la posición detectada, para que el alumno vea que la sigue.

### 4. Analizar

1. **Recortar el principio:** se quitan los puntos en que la pelota aún no se ha movido más de 1 cm.
2. **Recortar el final:** se corta en el punto de distancia máxima, cuando la pelota llega abajo o se para.
3. **Distancia:** s = distancia en línea recta desde el primer punto, multiplicada por la escala.
4. **Ajuste por mínimos cuadrados:** s = s₀ + v₀·t + ½·a·t², un polinomio de grado 2 que se resuelve con las ecuaciones normales, sin librerías. a = 2 × el coeficiente de t².
5. **Velocidad:** derivada numérica suavizada, con una media móvil de 5 puntos, para una segunda gráfica (opcional).
6. Si hay menos de 10 puntos válidos, se avisa y se pide repetir.

## Pantallas

### Simulación (`Simulacion`)

- Una **rampa virtual** con dos deslizadores: el ángulo (de 5 a 30°) y el largo (de 30 a 150 cm).
- Un selector de bola: maciza, hueca o "sin rozamiento".
- Botón "Soltar": la bola baja animada con la física real y a la vez se dibuja la gráfica distancia–tiempo con rol `'simulado'`.
- **Predicción:** "Con TU rampa, ¿cuánto tardará en bajar?". El alumno introduce sus medidas reales y escribe su predicción en segundos.
- `onContinuar({ texto: 'Predijo que tardaría 1,2 s', valor: 1.2 })`.

### Medición (`Medicion`)

1. Campos para la altura y el largo de la rampa (cm), y selector del tipo de bola.
2. "Abrir cámara". La imagen se ve a todo el ancho y encima va un canvas transparente para los puntos.
3. "Marca las dos cintas": dos toques en la imagen y el campo con la distancia real.
4. "Buscando la pelota…" con la IA, o el plan B de tocar la pelota.
5. **"Grabar"**: el alumno suelta la pelota. **"Parar"** cuando llega abajo, mostrando cuántos puntos lleva.
6. Si sale mal, un botón para repetir sin volver a configurar nada.

## Resultado (según `CONTRATO.md`)

- **valores:**
  1. `{ etiqueta: 'g estimada', valor: 9.62, unidad: 'm/s²' }`
  2. `{ etiqueta: 'Aceleración', valor: 1.72, unidad: 'm/s²' }`
  3. `{ etiqueta: 'g sin contar la rodadura', valor: 6.87, unidad: 'm/s²' }`
  4. `{ etiqueta: 'Error respecto a 9,81', valor: 1.9, unidad: '%' }`
  5. `{ etiqueta: 'Tiempo de bajada', valor: 1.05, unidad: 's' }`
- **resumen:** qué ha medido, comparado con 9,81 m/s², y una frase sobre la rodadura.
- **comparacion:** el tiempo predicho frente al tiempo real.
- **explicaciones:** según las reglas de abajo.
- **tabla:** `null`. Son demasiados puntos para una tabla.
- **grafica:** distancia (cm) frente a tiempo (s), con los puntos medidos (rol `'medido'`) y la curva del ajuste (rol `'teorico'`, unos 40 puntos).

## Asistente: explicaciones y preguntas

### Explicaciones automáticas (`explicaciones.js`)

| Si pasa esto… | …título de la explicación | `preguntaId` |
|---|---|---|
| g sin rodadura entre 5 y 8,5 | ¿Por qué sin contar la rodadura sale menos de 9,8? | `rampa-rodadura` |
| Error > 20 % | ¿Por qué me ha salido tan lejos de 9,8? (escala mal marcada, móvil movido, rampa que se dobla, poca luz) | `rampa-error-grande` |
| Error ≤ 10 % | ¡Muy buena medida! ¿Qué la ha hecho tan precisa? | `rampa-buena-medida` |
| Menos de 20 puntos | ¿Por qué hay tan pocos puntos? (rampa corta, móvil lento, cámara lejos) | `rampa-pocos-puntos` |
| Hay predicción y la diferencia es > 30 % | ¿Por qué tardó distinto de lo que predije? | `general-hipotesis-falsa` |

Máximo 3, de la más importante a la menos.

### Banco de preguntas (`preguntas.js`, 20–30)

Temas que tiene que cubrir (con `id` que empiecen por `rampa-`):
- **Ciencia:** qué es la gravedad, qué es la aceleración, por qué la distancia crece con el tiempo al cuadrado, por qué la gráfica es una curva, qué es el plano inclinado, qué es el seno de un ángulo, por qué rodar roba aceleración, bola maciza frente a hueca, rozamiento, por qué la masa no importa (Galileo), g en la Luna y en otros planetas.
- **Montaje:** qué pelota usar, qué inclinación, por qué las marcas de cinta, dónde poner el móvil.
- **Problemas al medir:** no encuentra la pelota, el punto salta a otro sitio, sale una g rarísima, la pelota se desvía de la rampa.
- **Cómo funciona la app:** cómo sigue la pelota la cámara, qué hace la IA, por qué no hace falta internet.

Cada pregunta con 3–6 `variantes` escritas como lo diría un alumno, y respuesta de 2–5 frases.

## Archivos

```
src/experimentos/rampa/
├── index.js
├── Simulacion.jsx
├── Medicion.jsx
├── fisica.js               (aceleracionTeorica, gEstimada, tiempoBajada)
├── analisisMovimiento.js   (recortar, ajusteCuadratico, velocidades)
├── seguimientoColor.js     (colorMedio, encontrarPorColor)
├── detectorIA.js           (cargarDetector, detectarPelota)
├── crearResultado.js
├── explicaciones.js
├── preguntas.js
├── rampa.css
└── datos/                  (vídeos de prueba, solo para desarrollar)
public/modelos/rampa/       (modelo .tflite y carpeta wasm de @mediapipe/tasks-vision)
```

## Datos que tiene que llevar Adrián

- [ ] Rampa probada con 2 o 3 inclinaciones, con la altura y el largo apuntados.
- [ ] Dos o tres **vídeos** de la pelota bajando, grabados con el móvil apoyado y quieto, con las marcas de cinta visibles. Apuntar en el nombre del archivo las medidas, por ejemplo `rampa_alto12_largo100_marcas30.mp4`.
- [ ] Probar qué pelota se ve mejor en cámara: color vivo y que contraste con el fondo.

## Prompts en orden

1. "Crea `fisica.js` y `analisisMovimiento.js` según RAMPA.md, con funciones puras. Añade una función que genere datos sintéticos de una bola bajando con ruido, para probar que el ajuste da la aceleración correcta."
2. "Crea `seguimientoColor.js`: dado un `ImageData` y un color objetivo con tolerancia, devuelve el centro de la pelota o `null`."
3. "Crea `explicaciones.js` con las reglas de RAMPA.md y `crearResultado.js`, que monte el `resultado` exactamente como dice CONTRATO.md."
4. "Crea `Medicion.jsx` con el plan B: cámara, marcas de escala, tocar la pelota para elegir el color, grabar, parar y crear el resultado." (*Probar en `#/prueba/rampa` con los vídeos de `datos/`.*)
5. "Crea `detectorIA.js` con MediaPipe `ObjectDetector`, cargado desde `public/modelos/rampa/`, que busque `sports ball` y devuelva su recuadro. Explícame qué archivos tengo que copiar a esa carpeta, de dónde y cuánto ocupan."
6. "Integra el detector en `Medicion.jsx`: la IA busca la pelota, aprende su color y se pasa al seguimiento por color. Si falla en 3 segundos, se usa el plan B."
7. "Crea `Simulacion.jsx` con la rampa virtual animada, la gráfica simulada y la predicción del tiempo."
8. "Ayúdame a escribir `preguntas.js` con 20–30 preguntas sobre los temas de RAMPA.md, en el formato de CONTRATO.md, punto 5. Yo reviso que las respuestas sean correctas."
9. "Crea `index.js` con el objeto experimento completo, incluido `recursos`."

## Criterios de aceptación

- [ ] Con una bola maciza, una rampa de 10 a 20° y buena luz, **g sale entre 8 y 11,5 m/s²**.
- [ ] El punto sobre el vídeo sigue a la pelota en al menos el 80 % de los fotogramas.
- [ ] La IA encuentra la pelota en menos de 3 segundos en un móvil de gama media.
- [ ] Si el modelo no carga, el plan B funciona sin que el alumno note un error.
- [ ] Funciona sin internet después de "Preparar para usar sin internet".
- [ ] Las explicaciones cambian según lo medido y cada `preguntaId` existe en el banco.
- [ ] Funciona en `#/prueba/rampa` con un vídeo de prueba y el validador no da errores.

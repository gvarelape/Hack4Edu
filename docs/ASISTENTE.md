# Asistente "Pregunta a Kanga" · Nicolás

> **Para la IA:** estás ayudando a **Nicolás**. Solo puedes tocar `src/asistente/` y `public/modelos/asistente/`. Lee también `REGLAS.md` y `CONTRATO.md`. **Este asistente nunca genera texto:** solo elige la mejor respuesta entre las que ha escrito el equipo.

## Objetivo

Que el alumno pueda **preguntar con sus propias palabras** sobre el experimento ("¿por qué no me sale 9,8?", "¿qué es el pH?", "no me va la cámara") y reciba **una respuesta correcta, escrita y revisada por el equipo**, sin internet y en cualquier móvil.

Además, la app da **información automática** según lo que ha salido en cada experimento (las `explicaciones` del resultado, que generan los propios experimentos y muestra el core). El asistente se encarga de las preguntas; las explicaciones son de cada experimento.

**Por qué así y no un chatbot:**
- Un modelo de lenguaje que genere respuestas ocupa cientos de MB o varios GB, va lento en móviles baratos y **se inventa cosas**. En una app para niños eso es inaceptable.
- Este asistente **entiende la pregunta, pero responde solo con contenido validado**. Si no está seguro, lo dice y manda al alumno a su profe, y eso también es educativo.
- Mensaje para el jurado: *"IA que entiende al alumno, con contenido validado por el equipo, que funciona sin internet y que nunca se inventa nada."*

## Cómo funciona: búsqueda en dos niveles

### Nivel 1: búsqueda por palabras (siempre disponible, 0 MB)

Funciona desde el primer momento en cualquier móvil, sin descargar nada.

1. **Normalizar** la pregunta del alumno y todas las del banco (`pregunta` + `variantes`): minúsculas, sin tildes, sin signos (`normalizarTexto` del core).
2. **Quitar palabras vacías** en español (el, la, de, que, por, es, un, me, mi…), salvo las interrogativas que cambian el sentido (**por qué, cómo, cuándo, cuánto, qué es**), que se conservan como una sola palabra (`porque`, `como`, `que_es`…).
3. **Raíz sencilla:** recortar plurales y terminaciones comunes (`-s`, `-es`, `-mente`, `-cion`/`-ciones`…), para que "botellas" y "botella" coincidan.
4. **Sinónimos:** un diccionario pequeño que lleva varias palabras a la misma (`g` / `gravedad`; `pelota` / `bola` / `canica`; `rapido` / `velocidad`; `agudo` / `alto` en tono; `lombarda` / `col morada`…). Lo amplía cada dueño con su tema.
5. **Puntuación** de cada pregunta del banco con **BM25** (o TF-IDF si es más sencillo), tomando la mejor puntuación entre la `pregunta` y sus `variantes`. Se normaliza a 0–1.
6. **Tolerancia a faltas de ortografía:** si una palabra del alumno no está en el vocabulario, se busca la más parecida con distancia de edición ≤ 1 (≤ 2 en palabras de más de 7 letras).

### Nivel 2: búsqueda por significado (opcional, se descarga una vez)

Entiende preguntas aunque no compartan palabras con el banco ("¿por qué va más lenta?" ↔ "¿por qué la g sale menor?").

- **Cómo:** un modelo de *embeddings* convierte cada frase en un vector que representa su significado. Las frases que significan lo mismo tienen vectores parecidos (similitud del coseno).
- **Modelo:** uno **multilingüe** (tiene que entender español), ejecutado con **Transformers.js** (`@huggingface/transformers`). Candidatos: `paraphrase-multilingual-MiniLM-L12-v2` o `multilingual-e5-small`, en su versión **cuantizada** (la más pequeña que dé buenos resultados).
- **Tamaño:** ⚠️ los modelos multilingües son más grandes que los que solo saben inglés, sobre todo por el vocabulario. Contad con **del orden de 100 MB** en la versión cuantizada. **Hay que comprobar el tamaño real el primer día**, y si es demasiado, el nivel 2 queda como opción de Ajustes para los móviles que puedan.
  - Ajustes muestra de momento "unos 100 MB". **Cuando se sepa el tamaño real, hay que decírselo a Gabriel.**
  - **Si se decide no usar modelo:** `estadoModeloAsistente()` devuelve siempre `'listo'` y `descargarModeloAsistente()` termina al momento. Si no, la app nunca aparecerá como preparada para usar sin internet.
- **Archivos locales:** el modelo, el tokenizador y los `wasm` de ONNX Runtime van en `public/modelos/asistente/`. Hay que configurar Transformers.js para que **no descargue nada de fuera**:
  - `env.allowRemoteModels = false`
  - `env.localModelPath = '/modelos/asistente/'`
  - `env.backends.onnx.wasm.wasmPaths = '/modelos/asistente/wasm/'`
- **Se carga en segundo plano** (un *Web Worker*), para que la pantalla no se congele.
- **Embeddings del banco precalculados:** un script de Node (`herramientas/generarEmbeddings.mjs`) calcula los vectores de todas las preguntas y variantes **en el ordenador** y los guarda en `public/modelos/asistente/embeddings.json`, junto con una **huella** del banco. Así el móvil solo tiene que calcular el vector de la pregunta del alumno.
  - El script lee directamente los `preguntas.js` de cada experimento y `preguntasGenerales.js`. Es la única excepción a la regla de importar solo desde `index.js`, porque se ejecuta fuera de la app.
  - **Hay que volver a ejecutarlo cada vez que cambie cualquier pregunta.** Si la huella no coincide, el asistente usa solo el nivel 1 y `#/prueba/asistente` lo avisa en rojo.

### Combinar los niveles y decidir

- Con nivel 2 listo: `puntuación = 0,7 × similitud del coseno + 0,3 × puntuación del nivel 1`. Sin nivel 2: solo el nivel 1.
- Las preguntas del `momento` actual reciben un pequeño empujón (+0,05).
- **Umbrales** (valores iniciales, hay que calibrarlos con el banco de pruebas):

  | Confianza | Qué hace |
  |---|---|
  | ≥ 0,60 | Responde directamente con la mejor pregunta. |
  | 0,40 – 0,60 | "¿Quieres decir…?" con las 3 mejores, para que el alumno elija. |
  | < 0,40 | "No tengo una respuesta para eso. Pregúntale a tu profe 🙂", y debajo, preguntas sugeridas del momento actual. |

## Pantallas

### `BotonAsistente`

- Botón flotante redondo abajo a la derecha, con el texto **"Pregunta a Kanga"** o un icono de bocadillo. No debe tapar los botones principales de la pantalla.
- Al pulsarlo abre `PanelAsistente`.

### `PanelAsistente`

Un panel que sube desde abajo (ocupa unos dos tercios de la pantalla):
1. **Preguntas sugeridas:** 3–4 "chips" con preguntas del `momento` actual. Tocar una muestra su respuesta directamente.
2. **Campo de texto** "Escribe tu pregunta…" y botón de enviar.
3. **Respuesta:** la pregunta que ha entendido (en pequeño, para que el alumno vea si ha acertado) y la respuesta. Debajo, las preguntas `relacionadas` como chips.
4. Si está en "¿Quieres decir…?", la lista de opciones.
5. Botón para cerrar. El historial de la conversación se pierde al cerrar: **no se guarda nada**.

- Si el nivel 2 se está cargando, funciona con el nivel 1 sin decir nada al alumno.
- **No hay entrada por voz:** el reconocimiento de voz del navegador necesita internet en muchos móviles.

## Preguntas generales (las escribe Nicolás)

En `src/asistente/preguntasGenerales.js`, con el mismo formato que `CONTRATO.md`, punto 5, e `id` que empiecen por `general-`. Unas 20–25, sobre:
- **Método científico:** qué es una hipótesis, diferencia entre hipótesis y predicción, qué es una variable, por qué hay que repetir las medidas, qué es el error de medida, qué hago si mi hipótesis era falsa (¡no pasa nada, así se aprende!).
- **La app:** cómo se instala, cómo se usa sin internet, dónde se guardan mis experimentos, cómo se los mando a mi profe, quién ve mis datos (nadie).
- **Problemas:** no funciona la cámara, no funciona el micrófono, la app va lenta, he borrado un experimento sin querer.
- **Obligatorias, porque las usan las explicaciones de los experimentos:** `general-hipotesis-falsa` (¿me equivoqué en la hipótesis?), `general-error-medida` (¿por qué no sale exacto?) y `general-repetir-medidas` (¿por qué repetir?).
- **Fuera de tema:** si la pregunta no tiene nada que ver con la ciencia o la app, o el alumno necesita ayuda personal, la respuesta es amable y le anima a hablar con su profe o con un adulto de confianza.

Los bancos de cada experimento los escriben sus dueños (Karlos, Adrián y Alejandro). Nicolás los **revisa** para que el tono sea el mismo en todos (guía de tono en `DISENO.md`).

## Banco de pruebas de la búsqueda

`src/asistente/datos/pruebasBusqueda.js`: una lista de **al menos 60 preguntas escritas como las haría un alumno**, cada una con el `id` de la respuesta correcta (o `null` si la respuesta correcta es "no lo sé").

- **Que no las escriba solo el equipo:** pedid a hermanos, primos o amigos que pregunten lo que se les ocurra sobre cada experimento. Así se parecen a las preguntas reales.
- `#/prueba/asistente` las pasa todas y muestra el **porcentaje de aciertos** con el nivel 1 y con el nivel 2, y la lista de fallos. Con esto se ajustan los sinónimos, las variantes y los umbrales.

## Archivos

```
src/asistente/
├── index.js                  (exports de CONTRATO.md, punto 9)
├── BotonAsistente.jsx
├── PanelAsistente.jsx
├── asistente.css
├── preguntasGenerales.js
├── busqueda/
│   ├── normalizar.js         (palabras vacías, raíces, sinónimos)
│   ├── sinonimos.js
│   ├── busquedaPalabras.js   (nivel 1: BM25 y faltas de ortografía)
│   ├── busquedaSignificado.js(nivel 2: habla con el worker)
│   ├── workerEmbeddings.js   (Web Worker con Transformers.js)
│   └── buscarRespuesta.js    (combina los niveles y aplica los umbrales)
├── herramientas/
│   └── generarEmbeddings.mjs (script de Node, se ejecuta en el ordenador)
└── datos/
    └── pruebasBusqueda.js
public/modelos/asistente/     (modelo, tokenizador, wasm y embeddings.json)
```

## Prompts en orden

1. "Crea `preguntasGenerales.js` con 20–25 preguntas según ASISTENTE.md y el formato de CONTRATO.md, punto 5. Tono para alumnos de 12 a 16 años."
2. "Crea `busqueda/normalizar.js`, `sinonimos.js` y `busquedaPalabras.js` (nivel 1) según ASISTENTE.md, con funciones puras."
3. "Crea `buscarRespuesta.js` solo con el nivel 1 y los umbrales de ASISTENTE.md, y el banco `datos/pruebasBusqueda.js` con 20 preguntas de ejemplo." (*Probar ya en `#/prueba/asistente`.*)
4. "Crea `BotonAsistente.jsx` y `PanelAsistente.jsx` según ASISTENTE.md y `index.js` con los exports de CONTRATO.md, punto 9 (con `estadoModeloAsistente` devolviendo `'no-descargado'` de momento)."
5. "Explícame paso a paso cómo descargar el modelo multilingüe de embeddings cuantizado y los wasm de ONNX Runtime para dejarlos en `public/modelos/asistente/`, y cuánto ocupa cada archivo." (*Decidir aquí si el tamaño compensa.*)
6. "Crea `workerEmbeddings.js` y `busquedaSignificado.js` con Transformers.js configurado para cargar solo desde `public/modelos/asistente/`, y `descargarModeloAsistente` y `estadoModeloAsistente`."
7. "Crea `herramientas/generarEmbeddings.mjs`, que lea todos los bancos de preguntas y genere `embeddings.json` con su huella."
8. "Integra el nivel 2 en `buscarRespuesta.js` con la fórmula de ASISTENTE.md y la comprobación de la huella."

## Criterios de aceptación

- [ ] Con solo el nivel 1, acierta **al menos el 70 %** del banco de pruebas. Con el nivel 2, **al menos el 85 %**.
- [ ] **Nunca** responde directamente con confianza < 0,60.
- [ ] Responde en menos de 300 ms con el nivel 1 y en menos de 1 s con el nivel 2, en un móvil de gama media.
- [ ] Funciona en modo avión: el nivel 1 siempre, y el nivel 2 después de "Preparar para usar sin internet".
- [ ] Si el modelo no carga, sigue funcionando con el nivel 1 sin mostrar errores al alumno.
- [ ] En la pestaña Network no aparece ninguna descarga de fuera (ni de Hugging Face ni de CDNs).
- [ ] No se guarda ninguna pregunta del alumno.

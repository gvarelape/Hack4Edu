# Contrato entre partes

> **Para la IA:** este documento define cómo se conectan las partes del proyecto. Es obligatorio cumplirlo al pie de la letra: nombres, propiedades y formatos exactos. Si algo de lo que te piden obliga a cambiar el contrato, **no lo cambies**: avisa al usuario para que lo hable con Gabriel.

El objetivo es que cada parte se pueda desarrollar por separado y que al juntarlas encajen sin tocar nada.

```
                 ┌──────────────────── CORE (Gabriel) ────────────────────┐
                 │  rutas · flujo · componentes · hooks · estilos · ajustes │
                 └────┬──────────────────────────┬──────────────────┬──────┘
   usa el objeto      │        le pasa cada      │   le pasa las    │
   "experimento"      ▼        registro          ▼   preguntas      ▼
 ┌──────────┐ ┌──────────┐ ┌──────────┐   ┌─────────────┐   ┌─────────────┐
 │    pH    │ │  Rampa   │ │ Botellas │   │  Cuaderno   │   │  Asistente  │
 │ (Karlos) │ │ (Adrián) │ │(Alejandro│   │  (Nicolás)  │   │  (Nicolás)  │
 └──────────┘ └──────────┘ └──────────┘   └─────────────┘   └─────────────┘
```

**Regla de oro:** las partes solo se hablan a través de lo que define este documento. Nadie importa archivos internos de otra parte.

---

## 1. Lo que ofrece el core

Todo se importa desde `src/core/index.js`:

```js
import { Boton, Aviso, useCamara } from '../../core'
```

### Componentes

| Componente | Props | Para qué |
|---|---|---|
| `Boton` | `variante` (`'principal'` \| `'secundario'` \| `'peligro'`), `onClick`, `disabled`, `children` | Botón a todo el ancho, de 48 px como mínimo. |
| `Tarjeta` | `children` | Caja blanca con borde y esquinas redondeadas. |
| `Aviso` | `tipo` (`'error'` \| `'info'` \| `'exito'`), `children` | Mensajes al alumno. |
| `Cargando` | `texto`, `progreso` (0–1, opcional) | Indicador de carga, con barra si se pasa `progreso`. |
| `Grafica` | `grafica` (objeto **Gráfica**, ver punto 4) | Gráfica de puntos y líneas en SVG. |
| `Tabla` | `tabla` (objeto **Tabla**, ver punto 4) | Tabla de datos. |
| `MuestraColor` | `color` (`'rgb(r, g, b)'`), `tamano` (`'pequeno'` \| `'grande'`) | Cuadradito de color. |
| `CampoNumero` | `etiqueta`, `valor`, `onCambio(numero)`, `unidad` | Campo numérico que acepta coma decimal. |
| `EtiquetaCiencia` | `ciencia` (`'Química'` \| `'Física'` \| `'Sonido'`) | Sello de texto en el color de la ciencia. |
| `ValorDestacado` | `valor` (objeto de `valores`, punto 3), `grande` (bool) | Número con su etiqueta y unidad, ya formateado. |
| `Confirmacion` | `abierta`, `texto`, `textoAceptar`, `onAceptar`, `onCancelar` | Ventana de confirmación dentro de la app. **Nunca** se usa `window.confirm` ni `alert`. |

### Hooks

**`useCamara()`** devuelve `{ videoRef, activa, error, iniciar, parar }`.
- Se pone `<video ref={videoRef} playsInline muted />` en la pantalla.
- `iniciar()` abre la cámara trasera. Se llama siempre desde un botón.
- `iniciar({ archivo })` usa un archivo de vídeo (`File` o URL) en lugar de la cámara. Es para el modo prueba.
- `error` es un texto en español, o `null` si no hay error.
- Libera la cámara sola al desmontar el componente.

**`useMicrofono()`** devuelve `{ analizador, frecuenciaMuestreo, activo, error, iniciar, parar }`.
- `analizador` es un `AnalyserNode` con `fftSize = 8192`.
- El micrófono se abre sin cancelación de eco, sin supresión de ruido y sin control automático de ganancia.
- `iniciar({ archivo })` analiza un archivo de audio en lugar del micrófono. Es para el modo prueba.
- Libera el micrófono solo al desmontar el componente.

**`useBucleFotogramas(callback, activo, videoRef)`** llama a `callback({ tiempo })` en cada fotograma mientras `activo` sea `true`. `tiempo` va en segundos.
- `videoRef` es opcional. Si se pasa, `tiempo` es el tiempo del propio vídeo: `metadata.mediaTime` con `requestVideoFrameCallback` si está disponible, y `video.currentTime` con `requestAnimationFrame` si no.
- Sin `videoRef`, usa `requestAnimationFrame` y `tiempo` son los segundos desde el primer fotograma.

### Utilidades

- `leerNumero(texto)`: convierte `"3,5"` o `"3.5"` en el número `3.5`. Devuelve `null` si no es un número.
- `formatear(numero, decimales)`: devuelve el número como texto con coma decimal, por ejemplo `"9,81"`.
- `normalizarTexto(texto)`: minúsculas, sin tildes ni signos de puntuación. Lo usa el asistente y lo puede usar cualquiera.

Los archivos de lógica pura que se prueban con `node --test` no pueden importar `src/core/index.js`, porque carga los componentes de React. Las utilidades se importan entonces desde `src/core/utilidades.js`, que no los necesita:

```js
import { formatear } from '../../core/utilidades.js'
```

Ese archivo también ofrece `validarResultado(resultado, { prediccion, preguntas })` y `validarPrediccion(prediccion)`, el mismo validador que usa el modo prueba, para comprobar el contrato en las pruebas. Ambas devuelven `{ errores: [], avisos: [] }`.

---

## 2. El objeto experimento

Cada experimento exporta **por defecto** desde su `index.js` un objeto con **exactamente** esta forma:

```js
export default {
  id: 'ph',                       // 'ph' | 'rampa' | 'botellas'
  titulo: 'Indicador de pH con lombarda',
  ciencia: 'Química',             // 'Química' | 'Física' | 'Sonido'
  descripcion: 'Descubre qué sustancias de tu casa son ácidas', // frase corta para la tarjeta de inicio
  pregunta: '¿Qué sustancias de tu casa son ácidas y cuáles son básicas?',
  materiales: ['…', '…'],         // lista de textos
  instrucciones: ['…', '…'],      // pasos del montaje, en orden
  seguridad: ['…'],               // avisos de seguridad (puede ser [])
  reflexion: ['¿…?', '¿…?'],      // 2 o 3 preguntas para pensar al final
  preguntas,                      // banco de preguntas del asistente (punto 5)
  recursos: [],                   // rutas de archivos pesados para usar sin internet; [] si no hay
  Simulacion,                     // componente React
  Medicion                        // componente React
}
```

- `recursos` sirve para que el botón del core **"Preparar para usar sin internet"** descargue esos archivos por adelantado. Solo la rampa lo usa, para su modelo de IA.
- `preguntas` se define en `preguntas.js` dentro de la carpeta del experimento y se importa en `index.js`.

### Componente `Simulacion`

Recibe `{ onContinuar }`.

Muestra un modelo virtual del experimento en el que el alumno puede tocar parámetros y ver qué pasaría. Al final, el alumno hace una predicción y pulsa continuar, y se llama a:

```js
onContinuar(prediccion)
```

`prediccion` tiene la forma `{ texto: string, valor: number | null }`. `texto` es lo que ha predicho el alumno, dicho con palabras, y `valor` es el número que se va a comparar con lo medido, si lo hay. Si el alumno se salta la simulación, el core pasa `null`.

### Componente `Medicion`

Recibe `{ prediccion, modoPrueba, onTerminar, onCancelar }`.

- Abre el sensor, guía al alumno durante la medida y calcula los resultados.
- `prediccion` es lo que devolvió `Simulacion`, o `null`. Si hay predicción, el resultado tiene que compararla con lo medido.
- Si `modoPrueba` es `true`, muestra además un botón **"Usar archivo de prueba"** que llama a `iniciar({ archivo })` del hook del sensor.
- Al terminar llama a `onTerminar(resultado)` con un objeto **Resultado** (punto 3).
- `onCancelar()` vuelve atrás sin guardar nada.

Los experimentos **no** muestran la pantalla final de resultados, **no** guardan nada y **no** navegan. De eso se encarga el core.

---

## 3. El objeto resultado

```js
{
  resumen: 'Texto con las conclusiones.\nPuede tener varias líneas.',
  valores: [                                   // obligatorio, al menos 1
    { etiqueta: 'g estimada', valor: 9.62, unidad: 'm/s²' }, // el primero es el valor destacado
    { etiqueta: 'Error respecto a 9,81', valor: 1.9, unidad: '%' }
  ],
  comparacion: 'Predijiste 1,2 s y ha tardado 1,05 s.', // texto, o null si no había predicción
  explicaciones: [                             // obligatorio, puede ser []
    { titulo: '¿Por qué sale menos de 9,8?', texto: 'Porque la bola rueda…', preguntaId: 'rampa-rodadura' }
  ],
  tabla: Tabla | null,
  grafica: Grafica | null
}
```

- **El primer elemento de `valores` es el dato destacado**, el que el cuaderno muestra en la lista.
- Los números van como `number`, sin formatear. El core los formatea al mostrarlos.
- **`explicaciones`** son las explicaciones automáticas que dependen de lo que ha salido (punto 6). El core las muestra en la pantalla de resultados bajo el título **"¿Por qué ha salido así?"**. `preguntaId` es opcional: si se pone, enlaza con una pregunta del banco del asistente para que el alumno pueda "Saber más".

---

## 4. Tablas y gráficas

**Tabla:**
```js
{
  columnas: ['Sustancia', 'Color', 'pH'],
  filas: [
    ['Vinagre', { color: 'rgb(220, 40, 90)' }, 2.8],
    ['Agua',    { color: 'rgb(120, 70, 160)' }, 7.1]
  ]
}
```
Cada celda puede ser un texto, un número o `{ color: 'rgb(r, g, b)' }`. En ese caso se pinta un cuadradito de color.

**Gráfica:**
```js
{
  titulo: 'Distancia recorrida',      // opcional
  ejeX: 'Tiempo (s)',
  ejeY: 'Distancia (cm)',
  series: [
    { nombre: 'Medido',  tipo: 'puntos', rol: 'medido',  puntos: [{ x: 0, y: 0 }, …] },
    { nombre: 'Ajuste',  tipo: 'linea',  rol: 'teorico', puntos: [{ x: 0, y: 0 }, …] }
  ]
}
```
- `tipo`: `'puntos'` o `'linea'`.
- `rol`: decide el color con el que se pinta la serie, para que todas las gráficas de la app sean coherentes:
  - `'medido'`: datos reales.
  - `'teorico'`: fórmula o ajuste.
  - `'simulado'`: lo que dio la simulación.
- Máximo **300 puntos por serie**. Si hay más, se reducen antes de entregar el resultado.

---

## 5. El banco de preguntas del asistente

Cada experimento entrega en `preguntas` una lista con este formato:

```js
export const preguntas = [
  {
    id: 'rampa-rodadura',                       // '<experimento>-<tema>', único en toda la app
    pregunta: '¿Por qué la bola baja más despacio de lo que dice la fórmula?',
    variantes: [                                // 3–6 formas distintas de preguntar lo mismo, como lo diría un alumno
      'por qué no me sale 9,8',
      'por qué la g me sale más pequeña',
      'por qué va más lenta la pelota',
      'qué pasa con el rozamiento'
    ],
    respuesta: 'Porque la bola, además de bajar, gira. Parte de la energía…', // 2–5 frases, para 12–16 años
    momento: 'resultados',                      // 'antes' | 'durante' | 'resultados' | 'siempre'
    relacionadas: ['rampa-energia']             // ids de otras preguntas (opcional)
  }
]
```

- **Entre 20 y 30 preguntas por experimento.** Tienen que cubrir: la ciencia del tema, el montaje, los problemas típicos al medir y curiosidades.
- `momento` sirve para sugerir preguntas según el paso del flujo: antes del experimento, durante la medición o al ver los resultados.
- **Las respuestas las escribe y revisa el equipo.** El asistente nunca genera texto: solo elige entre estas respuestas.
- Las preguntas generales (qué es una hipótesis, cómo se usa la app, qué hago si no funciona la cámara…) están en `src/asistente/preguntasGenerales.js` y son de Nicolás.

---

## 6. Explicaciones automáticas

Cada `Medicion` genera las `explicaciones` del resultado con **reglas sencillas** sobre lo medido. Ejemplos:

| Experimento | Si pasa esto… | …se explica esto |
|---|---|---|
| Rampa | g sin rodadura entre 6 y 8 | Por qué rodar "roba" aceleración. |
| Rampa | error > 20 % | Posibles fallos: mala escala, móvil movido, poca luz. |
| Botellas | v estimada < 320 m/s | La corrección de extremo y el cuello de la botella. |
| pH | dos sustancias con pH casi igual | Por qué el color puede engañar y cómo afinar la medida. |

- Entre **1 y 3 explicaciones** por resultado, de la más importante a la menos.
- Las funciones que las generan van en un archivo propio de cada experimento (`explicaciones.js`), puras y sin React.

---

## 7. El registro del cuaderno

Cuando el alumno termina un experimento, el **core** monta este objeto y se lo pasa al cuaderno:

```js
{
  id: 'a1b2c3…',                 // crypto.randomUUID()
  experimentoId: 'rampa',
  titulo: 'Pelota en una rampa',
  ciencia: 'Física',
  fecha: '2026-11-03T10:24:00.000Z',
  hipotesis: 'Creo que irá cada vez más rápido porque…',
  prediccion: { texto: '…', valor: 1.2 } | null,
  resultado: { …Resultado… },
  respuestas: [{ pregunta: '¿…?', respuesta: '…' }]   // respuestas a la reflexión
}
```

## 8. Lo que exporta el cuaderno

Desde `src/cuaderno/index.js`:

| Export | Qué hace |
|---|---|
| `guardarRegistro(registro)` | Guarda el registro. Devuelve una `Promise` con `true` si se ha guardado y `false` si ha fallado. No lanza errores. |
| `obtenerRegistros()` | Devuelve una `Promise` con la lista de registros, del más reciente al más antiguo. |
| `obtenerRegistro(id)` | Devuelve una `Promise` con un registro, o `null` si no existe. |
| `borrarRegistro(id)` | Borra un registro. Devuelve una `Promise`. |
| `cargarRegistrosEjemplo()` | Guarda registros de ejemplo para el modo prueba. Devuelve una `Promise` con `true` si se han guardado y `false` si ha fallado. No lanza errores. |
| `esAlmacenTemporal()` | Devuelve una `Promise` con `true` si el navegador no deja guardar y los datos se perderán al cerrar. |
| `PantallaCuaderno` | Componente. Props: `{ onAbrir(id), onVolver }`. Muestra la lista de registros. |
| `PantallaFicha` | Componente. Props: `{ id, onVolver }`. Muestra el detalle de un registro y el botón de compartir. |

## 9. Lo que exporta el asistente

Desde `src/asistente/index.js`:

| Export | Qué hace |
|---|---|
| `BotonAsistente` | Botón flotante **"Pregunta a Kanga"**. Props: `{ preguntas, momento }`. Al pulsarlo abre el panel. El core lo pone en todas las pantallas del flujo. |
| `PanelAsistente` | El panel de preguntas y respuestas. Props: `{ preguntas, momento, preguntaInicialId, onCerrar }`. Lo usa el core para el botón "Saber más" de las explicaciones. |
| `buscarRespuesta(texto, preguntas)` | Devuelve una `Promise` con `{ mejor: Pregunta \| null, sugerencias: Pregunta[], confianza: number }`. `confianza` va de 0 a 1. |
| `estadoModeloAsistente()` | Devuelve `'no-descargado'` \| `'descargando'` \| `'listo'` \| `'error'`. |
| `descargarModeloAsistente(onProgreso)` | Descarga el modelo de búsqueda inteligente. Llama a `onProgreso` con un número de 0 a 1. Devuelve una `Promise`. Lo usa la pantalla Ajustes. |
| `PantallaPruebasBusqueda` | Componente opcional, sin props. Pasa el banco de pruebas del asistente y muestra el % de aciertos con el nivel 1 y con el nivel 2, y la lista de fallos. El core lo muestra en `#/prueba/asistente`, debajo del panel, si existe. |

- El core le pasa a `BotonAsistente` las `preguntas` del experimento en curso. El asistente añade siempre las preguntas generales.
- En la pantalla de inicio, el core le pasa la unión de las preguntas de todos los experimentos.

---

## 10. Rutas (las gestiona el core)

| Ruta | Pantalla |
|---|---|
| `#/` | Inicio con las tarjetas de los experimentos, el acceso al cuaderno y el botón del asistente. |
| `#/experimento/<id>` | Flujo completo del experimento. |
| `#/cuaderno` | `PantallaCuaderno`. |
| `#/cuaderno/<id>` | `PantallaFicha`. |
| `#/ajustes` | Ajustes: preparar para usar sin internet y estado de los modelos. |
| `#/prueba/<id>` | **Modo prueba:** abre `Simulacion` y `Medicion` de ese experimento sin pasar por el flujo, con `modoPrueba = true`, y muestra el `resultado` en formato JSON y dibujado (valores, explicaciones, tabla y gráfica). |
| `#/prueba/cuaderno` | Llama a `cargarRegistrosEjemplo()` y abre el cuaderno con esos registros. |
| `#/prueba/asistente` | Abre `PanelAsistente` con todas las preguntas de la app, y muestra la `confianza` de cada búsqueda. |

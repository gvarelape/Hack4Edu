# Cuaderno de laboratorio · Nicolás

> **Para la IA:** estás ayudando a **Nicolás**. En esta conversación trabajas solo en `src/cuaderno/` (el asistente tiene su propio documento, `ASISTENTE.md`). Lee también `REGLAS.md` y `CONTRATO.md`.

## Objetivo

Guardar todos los experimentos del alumno en su móvil, sin servidor, y permitirle **compartir una ficha del experimento con su profe** como imagen, por WhatsApp, correo o lo que tenga. Así el docente recibe los resultados **sin necesidad de panel, cuentas ni internet** en el momento de hacer el experimento.

> **Por qué no hay panel para el profe:** se descartó porque era como hacer otra aplicación entera (servidor, cuentas, base de datos). El cuaderno con "Compartir con mi profe" cubre la necesidad sin nada de eso, y además respeta la privacidad.

## Lo que exporta (`src/cuaderno/index.js`)

Exactamente lo de `CONTRATO.md`, punto 8:

| Export | Qué hace |
|---|---|
| `guardarRegistro(registro)` | Guarda el registro. |
| `obtenerRegistros()` | Lista del más reciente al más antiguo. |
| `obtenerRegistro(id)` | Un registro, o `null`. |
| `borrarRegistro(id)` | Lo borra. |
| `cargarRegistrosEjemplo()` | Guarda los registros de ejemplo de `datos/registrosEjemplo.js`. Lo usa el core en `#/prueba/cuaderno`. |
| `PantallaCuaderno` | Props: `{ onAbrir(id), onVolver }`. |
| `PantallaFicha` | Props: `{ id, onVolver }`. |

## Cómo guarda los datos

- Con **IndexedDB** a través de la librería `idb-keyval`, en un almacén propio llamado `lab-bolsillo`.
- Cada registro se guarda con la clave `registro:<id>`.
- El nombre del alumno, que es opcional, se guarda con la clave `perfil`.
- Si IndexedDB no está disponible, por ejemplo en modo incógnito, se guarda en memoria y se muestra un `Aviso`: "Este navegador no permite guardar: tus experimentos se perderán al cerrar".
- Todas las funciones devuelven `Promise` y **nunca lanzan errores sin capturar**.

## Pantallas

### `PantallaCuaderno` (lista)

- Título "Mi cuaderno de laboratorio".
- Una tarjeta por registro, de la más reciente a la más antigua:
  - Icono y etiqueta de la ciencia, en su color (`DISENO.md`).
  - Título del experimento y fecha en formato español, por ejemplo "3 nov 2026, 10:24".
  - **Valor destacado:** el primer elemento de `resultado.valores`, con su etiqueta y su unidad.
- Si no hay registros, un mensaje amable: "Aún no has hecho ningún experimento", con un botón para volver al inicio.
- Al tocar una tarjeta se llama a `onAbrir(id)`.

### `PantallaFicha` (detalle)

En este orden:
1. Título, ciencia y fecha.
2. **Hipótesis** del alumno.
3. **Predicción**, si la hay.
4. **Resultados:** los `valores` (el primero en grande con `ValorDestacado`), el `resumen` y la `comparacion`. La `Tabla` y la `Grafica` se muestran con los componentes del core.
5. **¿Por qué ha salido así?:** las `explicaciones` del resultado, con título y texto.
6. **Reflexión:** cada pregunta con la respuesta del alumno.
7. Botones:
   - **"Compartir con mi profe"**: genera la imagen y la comparte (ver abajo).
   - **"Borrar"**: pide confirmación con el componente `Confirmacion` del core, nunca con `window.confirm`.
   - "Volver".

## Compartir: la ficha como imagen

1. La primera vez se pide el nombre del alumno, que es opcional, y se guarda en `perfil`.
2. Se dibuja la ficha en un **canvas de 1080 × 1350** (formato vertical, que se ve bien en WhatsApp):
   - Cabecera con el logo de la app y el color de la ciencia.
   - Nombre del alumno, si lo ha puesto, y la fecha.
   - Pregunta, hipótesis y valor destacado en grande.
   - **Gráfica dibujada directamente en el canvas**, una versión simple de puntos y línea con los mismos colores por `rol` que define `DISENO.md`. No sirve convertir el SVG del core, porque sus colores usan variables CSS y al pasarlo a imagen se pierden.
   - Hasta 3 valores más, la primera explicación y las respuestas de la reflexión, recortadas si son muy largas.
   - Pie: "Hecho con Kanga".
3. Se convierte en un PNG y:
   - Si el navegador lo permite (`navigator.canShare({ files })`), se abre el menú de compartir del móvil con `navigator.share`.
   - Si no, se descarga el archivo.
4. El texto se dibuja con la fuente del sistema y con saltos de línea automáticos.

## Privacidad (importante para el pitch)

- Los datos **nunca salen del móvil**, salvo que el alumno decida compartir su ficha.
- No se guardan fotos, vídeos ni audio, solo números y textos.
- El nombre es opcional. Sin nombre, la ficha pone "Alumno/a".

## Archivos

```
src/cuaderno/
├── index.js
├── almacen.js               (guardarRegistro, obtenerRegistros… con idb-keyval)
├── PantallaCuaderno.jsx
├── PantallaFicha.jsx
├── generarImagenFicha.js    (dibuja la ficha en el canvas y devuelve un Blob PNG)
├── compartir.js             (Web Share API o descarga)
├── cuaderno.css
└── datos/
    └── registrosEjemplo.js  (3 registros de ejemplo, uno por experimento, que cumplen CONTRATO.md)
```

## Prompts en orden

1. "Crea `datos/registrosEjemplo.js` con 3 registros realistas, uno de pH, otro de rampa y otro de botellas, que cumplan exactamente CONTRATO.md, punto 7, con sus valores, explicaciones, tabla y gráfica." (*Con esto se puede desarrollar sin esperar a los experimentos.*)
2. "Crea `almacen.js` con `idb-keyval` según CUADERNO.md, incluida la alternativa en memoria."
3. "Crea `PantallaCuaderno.jsx` según CUADERNO.md."
4. "Crea `PantallaFicha.jsx` con los componentes del core, la sección de explicaciones y la confirmación de borrado con `Confirmacion`."
5. "Crea `generarImagenFicha.js` que dibuje la ficha de 1080 × 1350 en un canvas y devuelva un Blob PNG."
6. "Crea `compartir.js` y conecta el botón 'Compartir con mi profe'."
7. "Crea `index.js` con todos los exports de CUADERNO.md."

## Criterios de aceptación

- [ ] Un registro guardado sigue ahí después de cerrar y volver a abrir la app.
- [ ] En Android, "Compartir con mi profe" abre el menú del móvil y se puede mandar por WhatsApp.
- [ ] La imagen se lee bien en la pantalla de un móvil, sin textos cortados a mitad de palabra.
- [ ] Funciona en `#/prueba/cuaderno` con los registros de ejemplo.
- [ ] Funciona en modo avión.

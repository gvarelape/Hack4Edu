# Arquitectura y app base · Gabriel

> **Para la IA:** estás ayudando a **Gabriel**, dueño del core. Puedes tocar `src/core/`, `src/registro.js`, `src/main.jsx`, `index.html`, `public/` (salvo `public/modelos/`), `scripts/` y los archivos de configuración de la raíz. Las carpetas de los experimentos, del cuaderno y del asistente no son tuyas. La única excepción es el primer día: puedes crear en ellas el `index.js` provisional que se describe abajo, y a partir de ahí ya son de sus dueños.

## Responsabilidades

1. Montar el proyecto, la PWA y la publicación en internet.
2. Construir lo común que usan todos: componentes, hooks, estilos y utilidades (ver `CONTRATO.md`).
3. Construir el flujo del experimento, las rutas, la pantalla de inicio y Ajustes.
4. Construir el modo prueba, para que cada uno pruebe su parte por separado.
5. Revisar e integrar los Pull Requests y mantener `main` funcionando **siempre**.
6. Ser el punto de contacto si alguien necesita un cambio en el contrato o en lo común.

## Repositorio

- **GitHub:** `gvarelape/Hack4Edu` (público, porque el proyecto se tiene que publicar con licencia libre).
- **Colaboradores invitados:** Adrián (`Adrian25-inf`), Nicolás (`NicolasTroyano`), Karlos (`karlosvicent`) y Alejandro (invitado por correo; tiene que crearse la cuenta con `asevillejalo.inf@upsa.es`).
- **Contenido antes del hackatón:** solo documentación y configuración, **nada de código de la app** (así seguimos en la modalidad innovadora).

```
Hack4Edu/
├── CLAUDE.md                 (carga REGLAS.md y CONTRATO.md en Claude Code)
├── README.md
├── LICENSE                   (MIT)
├── .gitignore
├── .claude/settings.json     (desactiva la firma de Claude Code)
├── .githooks/commit-msg      (borra cualquier firma de IA de los commits)
└── docs/                     (todos los .md)
```

### Configuración anti-IA en Git (obligatoria)

En ningún commit ni Pull Request puede aparecer Claude ni otra IA como coautor. Está blindado de tres formas: `.claude/settings.json`, el hook `.githooks/commit-msg` y la orden en `CLAUDE.md`. **Cada uno, después de clonar:**
```bash
git config core.hooksPath .githooks
```
Para comprobar que el historial está limpio:
```bash
git log --format=%B | grep -iE "co-authored|claude|generated with"
```
Si no sale nada, está limpio.

## Stack

| Pieza | Elección | Por qué |
|---|---|---|
| Interfaz | **React** (librería de JavaScript para interfaces) | Pantallas por componentes que se repintan solas cuando cambian los datos. |
| Herramienta | **Vite** | Crea el proyecto, lo sirve en local con recarga instantánea y lo empaqueta para publicar. Traduce el JSX a JavaScript normal. |
| Lenguaje | **JavaScript** | Sin TypeScript, para ir más rápido. |
| PWA | `vite-plugin-pwa` (`generateSW`, `registerType: 'autoUpdate'`) | Instalable y funciona sin internet. |
| HTTPS en desarrollo | `@vitejs/plugin-basic-ssl` y `server.host: true` | Sin HTTPS, el móvil no deja usar la cámara ni el micrófono. |
| Publicación | **Vercel**, conectado al repositorio | Cada push a `main` se publica solo, con HTTPS. |
| Formato | Prettier (`semi: false`, `singleQuote: true`, `printWidth: 100`) y el ESLint que trae Vite | Mismo estilo aunque el código salga de cinco conversaciones distintas. |
| Licencia | MIT | Lo exige el hackatón. |

## Estructura de carpetas de la app

```
Hack4Edu/
├── index.html
├── vite.config.js
├── .prettierrc
├── docs/                           ← estos .md
├── public/
│   ├── iconos/                     (icon-192.png, icon-512.png, logo.svg, de Nicolás)
│   └── modelos/
│       ├── rampa/                  ← Adrián (modelo de detección y wasm de MediaPipe)
│       └── asistente/              ← Nicolás (modelo de embeddings, wasm y embeddings precalculados)
└── src/
    ├── main.jsx                    ← Gabriel
    ├── registro.js                 ← Gabriel: lista de experimentos
    ├── core/                       ← Gabriel
    │   ├── index.js                (exporta todo lo público)
    │   ├── App.jsx                 (rutas por hash)
    │   ├── pantallas/              (Inicio, FlujoExperimento, Ajustes, Prueba)
    │   ├── componentes/            (Boton, Tarjeta, Aviso, Cargando, Grafica, Tabla, MuestraColor,
    │   │                            CampoNumero, ValorDestacado, Confirmacion)
    │   ├── hooks/                  (useCamara, useMicrofono, useBucleFotogramas)
    │   ├── lib/                    (numeros.js, texto.js)
    │   └── estilos/                (tokens.css, base.css)
    ├── experimentos/
    │   ├── ph/                     ← Karlos
    │   ├── rampa/                  ← Adrián
    │   └── botellas/               ← Alejandro
    ├── cuaderno/                   ← Nicolás
    └── asistente/                  ← Nicolás
```

`src/registro.js`:
```js
import ph from './experimentos/ph'
import rampa from './experimentos/rampa'
import botellas from './experimentos/botellas'

export const experimentos = [ph, rampa, botellas]
```

## Pantalla de inicio

- Logo y nombre de la app.
- Una tarjeta por experimento (ciencia, título, descripción), en el estilo de `DISENO.md`.
- Botón **"Mi cuaderno"**.
- Acceso a **Ajustes** (icono discreto arriba).
- `BotonAsistente` con las preguntas de todos los experimentos y `momento = 'siempre'`.
- Si la app **no** está lista para usar sin internet, un `Aviso` de tipo info con un enlace a Ajustes.

## Flujo del experimento (`FlujoExperimento`)

Es una sola pantalla con una barra de progreso arriba, que avanza por estos pasos:

1. **Presentación:** título, pregunta, materiales y avisos de seguridad.
2. **Hipótesis:** campo de texto obligatorio, con el texto de ayuda "Creo que… porque…".
3. **Simulación:** se monta el componente `Simulacion` del experimento y se guarda la `prediccion`. Tiene un botón para saltar el paso.
4. **Montaje:** las instrucciones numeradas.
5. **Medición:** se monta el componente `Medicion` del experimento con la `prediccion`, y se recibe el `resultado`.
6. **Resultados:** el primer valor en grande con `ValorDestacado`, el resto de `valores`, el `resumen`, la `comparacion`, la sección **"¿Por qué ha salido así?"** con las `explicaciones` (cada una con un botón "Saber más" si tiene `preguntaId`, que abre `PanelAsistente` en esa pregunta), la `Tabla` y la `Grafica`.
7. **Reflexión:** las preguntas de `reflexion`, cada una con su campo de texto.
8. **Guardar:** se monta el registro (ver `CONTRATO.md`, punto 7), se llama a `guardarRegistro` y se muestran los botones "Ver en el cuaderno" y "Volver al inicio".

- En **todos los pasos** se muestra `BotonAsistente` con las `preguntas` del experimento y el `momento` que toque: `'antes'` en los pasos 1–4, `'durante'` en el 5 y `'resultados'` en los pasos 6–8.
- Si el alumno sale a mitad del flujo, se le pregunta con `Confirmacion`. Nunca con `window.confirm`.
- Si `guardarRegistro` falla, se muestra un `Aviso` y el botón para reintentar. El alumno no pierde lo que ha hecho.

## Sin internet

- **El esqueleto de la app se descarga por adelantado:** el `globPatterns` de workbox incluye `js, css, html, svg, png, ico, woff2, json`.
- **Los modelos se descargan cuando hacen falta:** con `globIgnores: ['modelos/**']` y una regla de `runtimeCaching` para `/modelos/` con estrategia `CacheFirst`, caché `modelos` y `cacheableResponse: { statuses: [0, 200] }`. Así la app pesa poco y cada modelo solo se descarga a quien lo usa.
- **Pantalla Ajustes:**
  - Botón **"Preparar para usar sin internet"**: descarga los `recursos` de todos los experimentos (fetch de cada ruta, para que entren en la caché) y llama a `descargarModeloAsistente()`. Muestra el progreso de cada uno y cuánto ocupan aproximadamente.
  - Indicador de si la app ya está lista para funcionar sin conexión, y del `estadoModeloAsistente()`.
  - Aviso de que conviene hacerlo **con wifi**, en clase o en casa.

## Modo prueba (`#/prueba/<id>`)

Es una pantalla mínima para que cada uno pruebe su parte sin pasar por el flujo completo:
- Un selector para abrir `Simulacion` o `Medicion` del experimento.
- La `Medicion` se monta con `modoPrueba = true` y `prediccion = null`, con la opción de pasar una predicción de ejemplo.
- Cuando termina, se muestra el `resultado` en formato JSON y además dibujado como en el paso 6 del flujo, para comprobar que cumple el contrato.
- Un **validador** que avisa si al `resultado` le falta algún campo del contrato o tiene un tipo incorrecto. Así cada uno sabe que su parte va a encajar.
- `#/prueba/cuaderno` y `#/prueba/asistente`, según `CONTRATO.md`, punto 10.

## Git

1. ✅ Repositorio creado y colaboradores invitados.
2. Subir `docs/`, `CLAUDE.md`, `README.md`, `LICENSE`, `.gitignore`, `.claude/settings.json` y `.githooks/commit-msg`.
3. Proteger `main` (**Settings → Branches → Add rule**: "Require a pull request before merging").
4. Crear las ramas `parte/core`, `parte/ph`, `parte/rampa`, `parte/botellas` y `parte/cuaderno`.
5. Cada vez que integres algo en `main`, avisa por el grupo para que todos hagan `git pull origin main` en su rama.

## Publicación en Vercel

1. Entrar en vercel.com con la cuenta de GitHub.
2. **Add New → Project**, importar `Hack4Edu`. Vercel detecta Vite solo (comando `npm run build`, carpeta `dist`).
3. Rama de producción: `main`. Cada push a `main` se publica solo.
4. Con el enlace, generar un **QR** para que el equipo, la mentora y el jurado la abran en el móvil.

## Plan del día 1 (lunes 3)

**Objetivo: en 3 horas como mucho, `main` tiene la base y todos pueden enchufar su parte.**

Mientras tanto, los demás programan la **lógica pura** de su parte: cálculos con sus datos de prueba, sin pantallas, y escriben su banco de preguntas. Para eso no necesitan el core.

| Hora | Gabriel |
|---|---|
| 0:00–1:00 | Proyecto Vite, PWA, HTTPS, Prettier y publicación en Vercel. Comprobar que el enlace se abre en el móvil de todos. |
| 1:00–1:15 | Crear `index.js` provisionales en cada carpeta de experimento, en el cuaderno y en el asistente, que cumplan el contrato con componentes vacíos. Así la app compila desde el primer minuto. |
| 1:15–3:00 | `tokens.css` (sale de `DISENO.md`), componentes, hooks, `numeros.js`, `texto.js` y modo prueba con validador. Integrar en `main` y avisar. |
| Tarde | Pantalla de inicio, `FlujoExperimento` y Ajustes. Revisar los primeros Pull Requests. |

**Día 2:** integración de los tres experimentos, del cuaderno y del asistente en el flujo. Al final del día, todo en el enlace público.
**Día 3:** congelar el código a media mañana. Solo arreglar fallos.

## Prompts en orden

1. "Crea un proyecto React con Vite en JavaScript para una PWA llamada Lab de Bolsillo. Configura `vite-plugin-pwa` según la sección 'Sin internet' de ARQUITECTURA.md, `@vitejs/plugin-basic-ssl` con `server.host: true` y Prettier. Dame todos los archivos de configuración y los comandos de instalación."
2. "Crea la estructura de carpetas de ARQUITECTURA.md con un `index.js` provisional en cada experimento, en el cuaderno y en el asistente que cumpla CONTRATO.md con componentes que solo muestren 'En construcción' y funciones que devuelvan datos vacíos. Crea `src/registro.js`."
3. "Crea `src/core/estilos/tokens.css` y `base.css` a partir de este DISENO.md: [pegar DISENO.md]."
4. "Crea los componentes `Boton`, `Tarjeta`, `Aviso`, `Cargando`, `MuestraColor`, `CampoNumero`, `ValorDestacado` y `Confirmacion` según CONTRATO.md, y `src/core/lib/numeros.js` y `texto.js`."
5. "Crea el componente `Grafica` en SVG, sin librerías, y el componente `Tabla`, según CONTRATO.md, punto 4. La gráfica tiene que adaptarse al ancho, mostrar ejes con valores y leyenda, y usar el color de cada `rol`."
6. "Crea los hooks `useCamara`, `useMicrofono` y `useBucleFotogramas` según CONTRATO.md, incluida la opción `iniciar({ archivo })` y los mensajes de error en español."
7. "Crea `App.jsx` con las rutas por hash de CONTRATO.md, punto 10, y la pantalla de modo prueba con el validador del resultado."
8. "Crea la pantalla `Inicio` según ARQUITECTURA.md."
9. "Crea `FlujoExperimento` con los 8 pasos de ARQUITECTURA.md, incluidas las explicaciones con 'Saber más' y el `BotonAsistente` en cada paso."
10. "Crea la pantalla `Ajustes` con 'Preparar para usar sin internet', según ARQUITECTURA.md."

## Criterios de aceptación

- [ ] El enlace público se abre en Android y en iPhone, y se puede instalar con "Añadir a pantalla de inicio".
- [ ] Una vez instalada y preparada desde Ajustes, la app funciona entera en **modo avión**, también la rampa y el asistente.
- [ ] `#/prueba/<id>` funciona con los tres experimentos, el cuaderno y el asistente, y el validador no da errores.
- [ ] El flujo completo guarda el registro y aparece en el cuaderno.
- [ ] Ninguna pantalla se sale del ancho en un móvil de 360 px.
- [ ] Ningún archivo se carga desde internet en tiempo de ejecución. Para comprobarlo, en la pestaña Network de las DevTools no debe aparecer ningún dominio externo.
- [ ] La primera carga de la app (sin modelos) pesa **menos de 1 MB**.

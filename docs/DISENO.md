# Diseño visual · Nicolás

> **Diseño de cuaderno de laboratorio** (revisado el 4 de noviembre). Gabriel lo convierte en `src/core/estilos/tokens.css`. A partir de ahí, nadie usa colores ni tamaños que no estén aquí.

## Nombre

- **App:** Kanga
- **Equipo:** Kanga

## Principios

- **Para alumnos de 12 a 16 años, en móviles baratos:** letra grande, botones grandes, una cosa por pantalla.
- **Funciona a pleno sol y en aulas con poca luz:** alto contraste. Todo texto tiene un contraste de al menos 4,5:1 con su fondo (WCAG AA), y las líneas de las gráficas al menos 3:1.
- **Cada ciencia tiene su color**, para reconocerla de un vistazo.
- **Sin imágenes pesadas:** dibujos en SVG y nada de fotos de fondo. La cuadrícula del papel es solo CSS.
- **Una sola fuente propia, dentro de la app:** Gloock para los títulos (26 KB, licencia OFL). Nunca se descarga de fuera. El texto usa la fuente del sistema.
- **Sin modo oscuro.** Duplica el trabajo de diseño y no aporta nada al reto.

## Colores

| Token | Uso | RGB |
|---|---|---|
| `--color-primario` | Botones principales, enlaces, progreso | `rgb(28, 24, 18)` |
| `--color-acento` | Subrayados, barra de progreso y goma del cuaderno | `rgb(178, 40, 18)` |
| `--color-primario-oscuro` | Texto sobre `--color-primario-suave` (chips, etiquetas) | `rgb(150, 36, 16)` |
| `--color-primario-suave` | Fondos de etiquetas y resaltados | `rgb(250, 232, 170)` |
| `--color-fondo` | Fondo de la app | `rgb(246, 240, 226)` |
| `--color-superficie` | Tarjetas y paneles | `rgb(253, 250, 242)` |
| `--color-texto` | Texto principal | `rgb(28, 24, 18)` |
| `--color-texto-suave` | Texto secundario | `rgb(84, 76, 62)` |
| `--color-texto-invertido` | Texto sobre fondos de color (botones) | `rgb(253, 250, 242)` |
| `--color-borde` | Bordes y líneas | `rgb(205, 195, 172)` |
| `--color-cuadricula` | Cuadrícula del papel de fondo | `rgb(232, 224, 205)` |
| `--color-error` | Errores, botón de peligro | `rgb(168, 32, 20)` |
| `--color-error-suave` | Fondo de avisos de error | `rgb(250, 222, 210)` |
| `--color-exito` | Mensajes de éxito | `rgb(22, 96, 50)` |
| `--color-exito-suave` | Fondo de avisos de éxito | `rgb(222, 238, 205)` |
| `--color-info-suave` | Fondo de avisos informativos | `rgb(250, 236, 186)` |
| `--color-sombra` | Sombra del botón flotante y de los paneles | `rgb(28, 24, 18)` |
| `--color-velo` | Fondo oscurecido detrás de paneles y confirmaciones | `rgba(28, 24, 18, 0.6)` |

### Color por ciencia

| Token | Ciencia | RGB |
|---|---|---|
| `--color-quimica` | pH | `rgb(112, 28, 128)` |
| `--color-quimica-suave` | Fondo de la etiqueta de Química | `rgb(240, 225, 240)` |
| `--color-fisica` | Rampa | `rgb(160, 66, 8)` |
| `--color-fisica-suave` | Fondo de la etiqueta de Física | `rgb(250, 228, 205)` |
| `--color-sonido` | Botellas | `rgb(12, 96, 88)` |
| `--color-sonido-suave` | Fondo de la etiqueta de Sonido | `rgb(214, 236, 228)` |
| `--color-lombarda-acido` | Líquido del dibujo de pH, en ácido | `rgb(206, 44, 112)` |
| `--color-lombarda-neutro` | Líquido del dibujo de pH, neutro | `rgb(112, 28, 128)` |
| `--color-lombarda-base` | Líquido del dibujo de pH, en base | `rgb(24, 128, 92)` |

> Éxito y Sonido comparten verde a propósito: nunca aparecen juntos.

### Colores de las gráficas (por `rol`)

| Token | Rol | RGB | Trazo |
|---|---|---|---|
| `--color-serie-medido` | Datos reales | `rgb(28, 24, 18)` | Puntos o línea continua |
| `--color-serie-teorico` | Fórmula o ajuste | `rgb(178, 40, 18)` | Línea continua |
| `--color-serie-simulado` | Simulación | `rgb(107, 98, 84)` | Línea **discontinua** |

> En los `canvas` (ficha para compartir, simulaciones) no se pueden usar variables CSS: se usan directamente estos valores RGB.

### Contraste comprobado (sobre el papel)

Texto 15,6 · Texto suave 7,5 · Botón principal 16,9 · Primario oscuro 7,2 · Acento 5,8 · Error sobre su fondo 5,7 · Éxito sobre su fondo 6,3 · Química 8,5 · Física 5,6 · Sonido 6,5 · Serie simulado 5,8.

## Tipografía

- **Texto:** fuente del sistema, `system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif` (`--fuente`).
- **Títulos y datos:** Gloock (`--fuente-titulos`), alojada en `public/fuentes/`, con `font-display: swap`.

| Token | Uso | Tamaño |
|---|---|---|
| `--texto-pequeno` | Notas y leyendas | 14 px |
| `--texto-normal` | Texto general | 16 px |
| `--texto-grande` | Preguntas y subtítulos | 20 px |
| `--texto-titulo` | Títulos de pantalla | 26 px |
| `--texto-dato` | Valor destacado (pH ≈ 3,2 · 9,62 m/s²) | 40 px, negrita |

## Espaciado y formas

| Token | Valor |
|---|---|
| `--espacio-1` | 4 px |
| `--espacio-2` | 8 px |
| `--espacio-3` | 16 px |
| `--espacio-4` | 24 px |
| `--espacio-5` | 40 px |
| `--radio` | 6 px |
| `--radio-pequeno` | 3 px (campos y etiquetas) |
| `--radio-dibujado` | Esquina irregular, para tarjetas y botones |
| `--trazo` | 2 px (bordes de tinta) |
| `--radio-chip` | 999 px (chips y botón flotante) |
| `--alto-boton` | 52 px |
| `--ancho-maximo` | 560 px (en pantallas grandes el contenido se centra) |

## Componentes

- **Botón principal:** fondo de tinta, texto `--color-texto-invertido`, todo el ancho, `--alto-boton` de alto, esquinas `--radio-dibujado` y un canto duro que se hunde al pulsar.
- **Botón secundario:** fondo de papel, borde de tinta y texto oscuro.
- **Etiqueta de ciencia:** un sello de texto en `--color-<ciencia>`, con borde del mismo color, sin icono y un poco girado.
- **Entrada de experimento** (en el inicio): etiqueta de ciencia, título subrayado en su color, descripción y un dibujo propio que se puede tocar. Cada entrada tiene otra composición: no son tarjetas iguales.
- **Mi cuaderno** (en el inicio): un objeto, con lomo cosido y goma, no un botón.
- **Barra de progreso del flujo:** ocho segmentos. Los hechos van en `--color-acento` y los pendientes en `--color-borde`.
- **Valor destacado:** número en `--texto-dato` con la unidad al lado, más pequeña.
- **Explicaciones ("¿Por qué ha salido así?"):** notas con fondo `--color-info-suave` y borde discontinuo, título en negrita y el enlace "Saber más" en `--color-primario-oscuro`.
- **Confirmación:** ventana centrada sobre `--color-velo`, con el texto y dos botones (aceptar y cancelar).
- **Asistente:**
  - **Botón flotante "Pregunta a Kanga":** abajo a la derecha, a 16 px de los bordes, fondo primario, texto blanco, `--radio-chip` y sombra. No debe tapar el botón principal de la pantalla (dejar espacio debajo del contenido).
  - **Panel:** sube desde abajo, fondo `--color-superficie`, esquinas superiores redondeadas, sobre `--color-velo`.
  - **Chips de preguntas sugeridas:** fondo `--color-primario-suave`, texto `--color-primario-oscuro`, `--radio-chip`.
  - **Respuesta:** la pregunta entendida en `--texto-pequeno` y `--color-texto-suave`, y la respuesta en `--texto-normal`.

## Iconos y logo

- Logo de la app en SVG y dos iconos PNG para instalarla: `icon-192.png` (192×192) y `icon-512.png` (512×512). Van en `public/iconos/` (los coloca Gabriel).
- Dibujos de los experimentos en `src/core/componentes/DibujoExperimento.jsx`: lombarda, rampa con pelota y botella, con pocos nodos.
- Sin iconos genéricos: se usa texto cuando el significado no es obvio.

## Movimiento

Tres niveles, sin ninguna librería (API de animación del navegador):

- **Básico:** el nivel por defecto. Solo la respuesta al pulsar y los cambios de estado.
- **Normal:** añade los momentos de los dibujos, el trazo del logo y las transiciones, si el móvil puede.
- **Reducido:** con `prefers-reduced-motion` o desde Ajustes. Estados estáticos, sin perder información.

Duraciones: 120, 240 y 450 ms. Solo se anima `transform` y `opacity`, salvo el trazo del logo.

## Guía de tono de los textos

Para todos los textos de la app: experimentos, explicaciones, preguntas del asistente y avisos.

- **Tuteo** y tono cercano, como un profe joven que explica bien.
- **Frases cortas.** Una idea por frase.
- **Sin tecnicismos sin explicar.** Si sale "frecuencia", se explica la primera vez ("cuántas veces vibra por segundo").
- **Ejemplos de la vida diaria** siempre que se pueda.
- **Los errores no son fracasos:** "Tu hipótesis no se ha cumplido, ¡y eso también es ciencia!".
- **Avisos que dicen qué hacer:** no "Error de cámara", sino "No podemos usar la cámara. Revisa que le has dado permiso".
- **Números con coma decimal** y unidades siempre (9,81 m/s²).
- Emojis: con moderación, como mucho uno en mensajes de ánimo.

## Decisiones

- [x] Nombre de la app y del equipo: **Kanga**.
- [x] Modo oscuro: **no**.
- [x] Colores revisados con contraste WCAG AA.
- [x] Etiquetas de ciencia como sellos de texto, sin iconos.
- [x] Fuente Gloock solo para títulos, dentro de la app (sin descargas de fuera).
- [ ] Rediseño "cuaderno de laboratorio" aprobado por Nicolás.
- [ ] Logo definitivo (Nicolás).

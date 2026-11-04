# Diseño visual · Nicolás

> **Cerrado por Nicolás.** Gabriel lo convierte en `src/core/estilos/tokens.css`. A partir de ahí, nadie usa colores ni tamaños que no estén aquí.

## Nombre

- **App:** Kanga
- **Equipo:** Kanga

## Principios

- **Para alumnos de 12 a 16 años, en móviles baratos:** letra grande, botones grandes, una cosa por pantalla.
- **Funciona a pleno sol y en aulas con poca luz:** alto contraste. Todo texto tiene un contraste de al menos 4,5:1 con su fondo (WCAG AA), y las líneas de las gráficas al menos 3:1.
- **Cada ciencia tiene su color**, para reconocerla de un vistazo.
- **Sin imágenes pesadas:** iconos en SVG y nada de fotos de fondo.
- **Sin fuentes descargadas:** la del sistema, para que funcione sin internet y no pese nada.
- **Sin modo oscuro.** Duplica el trabajo de diseño y no aporta nada al reto.

## Colores

| Token | Uso | RGB |
|---|---|---|
| `--color-primario` | Botones principales, enlaces, progreso | `rgb(37, 99, 235)` |
| `--color-primario-oscuro` | Texto sobre `--color-primario-suave` (chips, etiquetas) | `rgb(29, 78, 216)` |
| `--color-primario-suave` | Fondos de etiquetas y resaltados | `rgb(219, 234, 254)` |
| `--color-fondo` | Fondo de la app | `rgb(248, 250, 252)` |
| `--color-superficie` | Tarjetas y paneles | `rgb(255, 255, 255)` |
| `--color-texto` | Texto principal | `rgb(17, 24, 39)` |
| `--color-texto-suave` | Texto secundario | `rgb(75, 85, 99)` |
| `--color-texto-invertido` | Texto sobre fondos de color (botones) | `rgb(255, 255, 255)` |
| `--color-borde` | Bordes y líneas | `rgb(229, 231, 235)` |
| `--color-error` | Errores, botón de peligro | `rgb(220, 38, 38)` |
| `--color-error-suave` | Fondo de avisos de error | `rgb(254, 226, 226)` |
| `--color-exito` | Mensajes de éxito | `rgb(21, 128, 61)` |
| `--color-exito-suave` | Fondo de avisos de éxito | `rgb(220, 252, 231)` |
| `--color-info-suave` | Fondo de avisos informativos | `rgb(219, 234, 254)` |
| `--color-sombra` | Sombra del botón flotante y de los paneles | `rgba(17, 24, 39, 0.18)` |
| `--color-velo` | Fondo oscurecido detrás de paneles y confirmaciones | `rgba(17, 24, 39, 0.45)` |

### Color por ciencia

| Token | Ciencia | RGB |
|---|---|---|
| `--color-quimica` | pH | `rgb(126, 34, 206)` |
| `--color-quimica-suave` | Fondo de la etiqueta de Química | `rgb(243, 232, 255)` |
| `--color-fisica` | Rampa | `rgb(194, 65, 12)` |
| `--color-fisica-suave` | Fondo de la etiqueta de Física | `rgb(255, 237, 213)` |
| `--color-sonido` | Botellas | `rgb(21, 128, 61)` |
| `--color-sonido-suave` | Fondo de la etiqueta de Sonido | `rgb(220, 252, 231)` |

> Éxito y Sonido comparten verde a propósito: nunca aparecen juntos.

### Colores de las gráficas (por `rol`)

| Token | Rol | RGB | Trazo |
|---|---|---|---|
| `--color-serie-medido` | Datos reales | `rgb(37, 99, 235)` | Puntos o línea continua |
| `--color-serie-teorico` | Fórmula o ajuste | `rgb(220, 38, 38)` | Línea continua |
| `--color-serie-simulado` | Simulación | `rgb(107, 114, 128)` | Línea **discontinua** |

> En los `canvas` (ficha para compartir, simulaciones) no se pueden usar variables CSS: se usan directamente estos valores RGB.

### Contraste comprobado (sobre blanco)

Primario 5,2 · Primario oscuro sobre primario suave 5,8 · Texto suave 7,6 · Error 4,8 · Éxito 5,0 · Química 7,0 · Física 5,2 · Sonido 5,0 · Serie simulado 4,8.

## Tipografía

- **Fuente del sistema:** `system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif`. No se descarga ninguna fuente: funciona sin internet y pesa 0 KB.

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
| `--radio` | 14 px (tarjetas y botones) |
| `--radio-pequeno` | 8 px (campos y etiquetas) |
| `--radio-chip` | 999 px (chips y botón flotante) |
| `--alto-boton` | 52 px |
| `--ancho-maximo` | 560 px (en pantallas grandes el contenido se centra) |

## Componentes

- **Botón principal:** fondo primario, texto `--color-texto-invertido`, ocupa todo el ancho, `--alto-boton` de alto y esquinas `--radio`.
- **Botón secundario:** fondo blanco, borde gris y texto oscuro.
- **Etiqueta de ciencia:** fondo `--color-<ciencia>-suave`, texto e icono en `--color-<ciencia>`, `--radio-pequeno`.
- **Tarjeta de experimento** (en el inicio):
  - Etiqueta de ciencia.
  - Título y descripción corta.
  - Borde izquierdo de 6 px en el color de la ciencia.
- **Barra de progreso del flujo:** ocho segmentos. Los hechos van en primario y los pendientes en gris.
- **Valor destacado:** número en `--texto-dato` con la unidad al lado, más pequeña.
- **Explicaciones ("¿Por qué ha salido así?"):** tarjetas con fondo `--color-info-suave`, título en negrita y el enlace "Saber más" en primario.
- **Confirmación:** ventana centrada sobre `--color-velo`, con el texto y dos botones (aceptar y cancelar).
- **Asistente:**
  - **Botón flotante "Pregunta a Kanga":** abajo a la derecha, a 16 px de los bordes, fondo primario, texto blanco, `--radio-chip` y sombra. No debe tapar el botón principal de la pantalla (dejar espacio debajo del contenido).
  - **Panel:** sube desde abajo, fondo `--color-superficie`, esquinas superiores redondeadas, sobre `--color-velo`.
  - **Chips de preguntas sugeridas:** fondo `--color-primario-suave`, texto `--color-primario-oscuro`, `--radio-chip`.
  - **Respuesta:** la pregunta entendida en `--texto-pequeno` y `--color-texto-suave`, y la respuesta en `--texto-normal`.

## Iconos y logo

- Logo de la app en SVG y dos iconos PNG para instalarla: `icon-192.png` (192×192) y `icon-512.png` (512×512). Van en `public/iconos/` (los coloca Gabriel).
- Iconos de 24×24, trazo de 2 px y `currentColor`, para que tomen el color de la ciencia:

```svg
<!-- icono-quimica.svg · matraz -->
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 3h6M10 3v6l-5 9a2 2 0 0 0 1.7 3h10.6a2 2 0 0 0 1.7-3l-5-9V3M7.5 15h9"/></svg>
```

```svg
<!-- icono-fisica.svg · pelota en rampa -->
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"><path d="M3 8v12h18z"/><circle cx="11.4" cy="10.6" r="2.5"/></svg>
```

```svg
<!-- icono-sonido.svg · onda de sonido -->
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12h3l2-5 3 10 3-14 3 18 2-9h4"/></svg>
```

```svg
<!-- icono-asistente.svg · bocadillo con interrogación -->
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16a1 1 0 0 1 1 1v11a1 1 0 0 1-1 1h-9l-5 4v-4H4a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1z"/><path d="M10 9a2 2 0 1 1 3 1.7c-.6.4-1 .8-1 1.6"/><circle cx="12" cy="14.6" r=".4" fill="currentColor"/></svg>
```

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
- [x] Iconos de ciencia y del asistente.
- [ ] Logo.

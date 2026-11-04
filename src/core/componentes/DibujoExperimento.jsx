import { useEffect, useRef, useState } from 'react'
import { duracionRampa, frecuenciaBotella, marcasRampa, tocarTono } from '../lib/momentos'
import { animar, CURVA, DURACION, vigilarRendimiento } from '../lib/movimiento'

const TARRO = 'M26 52h68v62q0 8-8 8H34q-8 0-8-8z'
const LIQUIDO = 'M30 76h60v38q0 4-4 4H34q-4 0-4-4z'

// Rampa de 20°: la pendiente sube 61 por cada 168 de largo, y la pelota rueda 150 sobre ella.
const RECORRIDO = { x: 150, y: 54.6 }
const MARCAS = marcasRampa()
  .map((fraccion) => {
    const x = 22 + fraccion * RECORRIDO.x
    const y = 32 + fraccion * RECORRIDO.y
    return `M${x.toFixed(1)} ${y.toFixed(1)}l-2.4 6.6`
  })
  .join('')

const ACCIONES = {
  ph: 'cambiar el color del líquido',
  rampa: 'soltar la pelota',
  botellas: 'hacer sonar la botella',
}

function Lombarda() {
  return (
    <svg viewBox="0 0 120 130" aria-hidden="true">
      <path
        className="core-dibujo-fondo"
        d="M12 40C20 8 60-4 92 10s34 62 18 92-68 34-90 12S4 72 12 40z"
      />
      <path
        className="core-hoja"
        d="M60 44c-16 0-26-10-24-24 8-10 26-14 40-8 12 6 14 22 6 30-5 3-13 2-22 2z"
      />
      <path className="core-trazo-claro" d="M60 44c-4-12 0-22 8-30M60 44C52 36 46 28 46 18" />
      <path className="core-capa core-capa-neutro" d={LIQUIDO} />
      <path className="core-capa core-capa-acido" d={LIQUIDO} />
      <path className="core-capa core-capa-base" d={LIQUIDO} />
      <path className="core-trazo" d={TARRO} />
    </svg>
  )
}

function Rampa() {
  return (
    <svg viewBox="0 0 200 110" aria-hidden="true">
      <path
        className="core-dibujo-fondo"
        d="M0 58C4 14 60-2 112 2s88 32 88 66-52 44-104 42S-4 98 0 58z"
      />
      <path className="core-libro" d="M16 58h52v33H16z" />
      <path className="core-trazo-fino" d="M16 69h52M16 80h52" />
      <path className="core-trazo" d="M16 91h168L16 30z" />
      <path className="core-trazo" d={MARCAS} />
      <circle className="core-pelota" cx="22" cy="20" r="11" />
    </svg>
  )
}

function Botella() {
  return (
    <svg viewBox="0 0 110 160" aria-hidden="true">
      <path
        className="core-dibujo-fondo"
        d="M10 50C14 16 50 2 78 12s32 50 26 86-30 58-62 54S6 90 10 50z"
      />
      <g className="core-botella">
        <path className="core-agua" d="M20 92h40v48q0 8-8 8H28q-8 0-8-8z" />
        <path
          className="core-trazo"
          d="M32 8h16v28q0 8 6 14t6 16v74q0 8-8 8H28q-8 0-8-8V66q0-10 6-16t6-14z"
        />
      </g>
      <path
        className="core-onda"
        d="M74 62c8 6 8 18 0 24M86 52c14 11 14 33 0 44M98 42c20 16 20 48 0 64"
      />
    </svg>
  )
}

const DIBUJOS = { ph: Lombarda, rampa: Rampa, botellas: Botella }

const CAPAS = ['.core-capa-neutro', '.core-capa-acido', '.core-capa-base']

export default function DibujoExperimento({ id, titulo, pista = false }) {
  const Dibujo = DIBUJOS[id]
  const raizRef = useRef(null)
  const animacionesRef = useRef([])
  const temporizadorRef = useRef(null)
  const [estado, setEstado] = useState(0)

  useEffect(
    () => () => {
      animacionesRef.current.forEach((animacion) => animacion?.cancel())
      clearTimeout(temporizadorRef.current)
    },
    [],
  )

  if (!Dibujo) return null

  const parar = () => {
    animacionesRef.current.forEach((animacion) => animacion?.cancel())
    animacionesRef.current = []
  }
  const parte = (selector) => raizRef.current?.querySelector(selector)

  // El estado cambia al instante; la animación solo acompaña, y se puede interrumpir.
  const momentoPh = () => {
    parar()
    const siguiente = (estado + 1) % 3
    setEstado(siguiente)
    const animacion =
      siguiente === 0
        ? animar(parte(CAPAS[estado]), [{ opacity: 1 }, { opacity: 0 }], {
            duration: DURACION.lenta,
          })
        : animar(parte(CAPAS[siguiente]), [{ opacity: 0 }, { opacity: 1 }], {
            duration: DURACION.lenta,
          })
    animacionesRef.current = [animacion]
  }

  const momentoRampa = () => {
    parar()
    if (estado === 1) {
      setEstado(0)
      return
    }
    const duracion = duracionRampa()
    const animacion = animar(
      parte('.core-pelota'),
      [
        { transform: 'translate(0, 0)' },
        { transform: `translate(${RECORRIDO.x}px, ${RECORRIDO.y}px)` },
      ],
      { duration: duracion * 1000, easing: CURVA.cuadratica },
    )
    if (!animacion) {
      setEstado(1)
      return
    }
    vigilarRendimiento(duracion)
    animacion.onfinish = () => setEstado(1)
    animacionesRef.current = [animacion]
  }

  const momentoSonido = () => {
    parar()
    tocarTono(frecuenciaBotella())
    setEstado(1)
    clearTimeout(temporizadorRef.current)
    temporizadorRef.current = setTimeout(() => setEstado(0), 500)
    animacionesRef.current = [
      animar(
        parte('.core-botella'),
        [{ transform: 'translateX(-1.5px)' }, { transform: 'translateX(1.5px)' }],
        { duration: 50, iterations: 8, direction: 'alternate' },
      ),
      animar(parte('.core-onda'), [{ transform: 'scale(0.85)' }, { transform: 'none' }], {
        duration: DURACION.lenta,
        easing: CURVA.salida,
      }),
    ]
  }

  const MOMENTOS = { ph: momentoPh, rampa: momentoRampa, botellas: momentoSonido }

  return (
    <button
      ref={raizRef}
      type="button"
      className={`core-dibujo core-dibujo-${id}`}
      data-estado={estado}
      aria-label={`${titulo}: toca para ${ACCIONES[id]}`}
      onClick={MOMENTOS[id]}
    >
      <Dibujo />
      {pista && <span className="core-dibujo-pista">¡Tócalo!</span>}
    </button>
  )
}

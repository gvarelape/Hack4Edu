import { useEffect, useRef, useState } from 'react'
import { prepararGrafica, puntoMasCercano } from '../lib/escalaGrafica'
import { t } from '../lib/idioma'
import { formatear } from '../lib/numeros'

// Dibuja a tamaño real, sin escalar el SVG, para que el texto no encoja en móviles estrechos.
export default function Grafica({ grafica }) {
  const contenedorRef = useRef(null)
  const [ancho, setAncho] = useState(0)
  const [lecturaX, setLecturaX] = useState(null)
  const hayGrafica = Boolean(grafica)

  // Se mide la figura, que existe aunque la gráfica empiece sin datos y se vaya llenando.
  useEffect(() => {
    const contenedor = contenedorRef.current
    if (!contenedor) return undefined
    const observador = new ResizeObserver(([entrada]) => {
      setAncho(Math.round(entrada.contentRect.width))
    })
    observador.observe(contenedor)
    return () => observador.disconnect()
  }, [hayGrafica])

  if (!grafica) return null

  const datos = prepararGrafica(grafica, ancho, formatear)
  const sinDatos = !grafica.series?.some((serie) => serie.puntos?.length > 0)

  const leerToque = (evento) => {
    if (!datos) return
    const { left } = evento.currentTarget.getBoundingClientRect()
    setLecturaX(evento.clientX - left)
  }

  const lecturas =
    datos && lecturaX !== null
      ? datos.series.map((serie) => ({ serie, punto: puntoMasCercano(serie.puntos, lecturaX) }))
      : []

  return (
    <figure ref={contenedorRef} className="core-grafica">
      {grafica.titulo && <figcaption className="core-grafica-titulo">{grafica.titulo}</figcaption>}
      {sinDatos ? (
        <p className="core-grafica-nota">Todavía no hay datos para dibujar.</p>
      ) : (
        <>
          <p className="core-grafica-eje">{grafica.ejeY}</p>
          <div className="core-grafica-lienzo">
            {datos && (
              <svg
                width={datos.ancho}
                height={datos.alto}
                role="img"
                aria-label={describir(grafica, datos)}
                onPointerDown={leerToque}
                onPointerMove={leerToque}
                onPointerLeave={(evento) => {
                  if (evento.pointerType === 'mouse') setLecturaX(null)
                }}
              >
                <Ejes datos={datos} />
                {datos.series
                  .filter((serie) => serie.tipo === 'linea')
                  .map((serie) => (
                    <SerieLinea key={serie.nombre} serie={serie} />
                  ))}
                {datos.series
                  .filter((serie) => serie.tipo !== 'linea')
                  .map((serie) => (
                    <SeriePuntos key={serie.nombre} serie={serie} />
                  ))}
                {lecturas.length > 0 && <MarcaLectura datos={datos} lecturas={lecturas} />}
              </svg>
            )}
          </div>
          <p className="core-grafica-eje core-grafica-eje-x">{grafica.ejeX}</p>
          {datos && <Leyenda series={datos.series} />}
          {datos && <Lectura grafica={grafica} lecturas={lecturas} />}
        </>
      )}
    </figure>
  )
}

function Ejes({ datos }) {
  const { zona, marcasX, marcasY } = datos
  return (
    <g>
      {marcasY.map((marca) => (
        <g key={marca.texto}>
          <line
            className="core-grafica-rejilla"
            x1={zona.izquierda}
            x2={zona.derecha}
            y1={marca.pixel}
            y2={marca.pixel}
          />
          <text
            className="core-grafica-marca"
            x={zona.izquierda - 8}
            y={marca.pixel}
            textAnchor="end"
            dominantBaseline="middle"
          >
            {marca.texto}
          </text>
        </g>
      ))}
      {marcasX.map((marca) => (
        <text
          key={marca.texto}
          className="core-grafica-marca"
          x={marca.pixel}
          y={zona.abajo + 20}
          textAnchor="middle"
        >
          {marca.texto}
        </text>
      ))}
    </g>
  )
}

function SerieLinea({ serie }) {
  const puntos = serie.puntos.map((punto) => `${punto.pixelX},${punto.pixelY}`).join(' ')
  return <polyline className={`core-grafica-linea core-serie-${serie.rol}`} points={puntos} />
}

function SeriePuntos({ serie }) {
  return (
    <g className={`core-serie-${serie.rol}`}>
      {serie.puntos.map((punto, i) => (
        <circle key={i} className="core-grafica-punto" cx={punto.pixelX} cy={punto.pixelY} r={5} />
      ))}
    </g>
  )
}

function MarcaLectura({ datos, lecturas }) {
  const pixelX = lecturas[0].punto.pixelX
  return (
    <g>
      <line
        className="core-grafica-guia"
        x1={pixelX}
        x2={pixelX}
        y1={datos.zona.arriba}
        y2={datos.zona.abajo}
      />
      {lecturas.map(({ serie, punto }) => (
        <circle
          key={serie.nombre}
          className={`core-grafica-punto core-serie-${serie.rol}`}
          cx={punto.pixelX}
          cy={punto.pixelY}
          r={6}
        />
      ))}
    </g>
  )
}

function Clave({ serie }) {
  return (
    <span
      className={`core-grafica-clave core-grafica-clave-${serie.tipo === 'linea' ? 'linea' : 'punto'} core-serie-${serie.rol}`}
      aria-hidden="true"
    />
  )
}

function Leyenda({ series }) {
  return (
    <ul className="core-grafica-leyenda">
      {series.map((serie) => (
        <li key={serie.nombre}>
          <Clave serie={serie} />
          {serie.nombre}
        </li>
      ))}
    </ul>
  )
}

function Lectura({ grafica, lecturas }) {
  if (lecturas.length === 0) {
    return <p className="core-grafica-nota">Toca la gráfica para ver los valores.</p>
  }
  return (
    <div className="core-grafica-lectura">
      {lecturas.map(({ serie, punto }) => (
        <p key={serie.nombre}>
          <Clave serie={serie} />
          <strong>{formatear(punto.y)}</strong> {serie.nombre} · {grafica.ejeX}:{' '}
          {formatear(punto.x)}
        </p>
      ))}
    </div>
  )
}

function describir(grafica, datos) {
  const nombres = datos.series.map((serie) => t(serie.nombre)).join(', ')
  return `${grafica.titulo ?? 'Gráfica'}. ${grafica.ejeY} frente a ${grafica.ejeX}. Series: ${nombres}.`
}

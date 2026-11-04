import { useId, useState } from 'react'
import { Aviso, Boton, Grafica, Tarjeta, ValorDestacado } from '../../core'
import { frecuenciaTeorica } from './modelo'
import {
  AGUA_MAXIMA_CM,
  ALTURA_BOTELLA_CM,
  OPCIONES_PREDICCION,
  alturaAire,
  anadirPunto,
  crearGraficaSimulada,
  crearPrediccion,
} from './botellaVirtual'
import { useTonoBotella } from './useTonoBotella'
import './botellas.css'

export default function Simulacion({ onContinuar }) {
  const idDeslizador = useId()
  const { sonar, sonando, error } = useTonoBotella()
  const [agua, setAgua] = useState(5)
  const [frecuencia, setFrecuencia] = useState(null)
  const [puntos, setPuntos] = useState([])
  const [opcion, setOpcion] = useState(null)

  const aire = alturaAire(agua)

  const cambiarAgua = (evento) => {
    setAgua(Number(evento.target.value))
    setFrecuencia(null) // la frecuencia anterior ya no vale para este nivel
  }

  const soplar = () => {
    const nueva = Math.round(frecuenciaTeorica(aire))
    sonar(nueva)
    setFrecuencia(nueva)
    setPuntos((anteriores) => anadirPunto(anteriores, aire, nueva))
  }

  return (
    <div className="botellas-simulacion">
      <h2>Prueba con una botella virtual</h2>
      <p>Cambia el nivel de agua y sopla. Escucha cómo cambia el sonido.</p>

      <Tarjeta>
        <DibujoBotella agua={agua} sonando={sonando} />
        <label className="botellas-etiqueta" htmlFor={idDeslizador}>
          {`Agua: ${agua} cm · Aire: ${aire} cm`}
        </label>
        <input
          id={idDeslizador}
          className="botellas-deslizador"
          type="range"
          min={0}
          max={AGUA_MAXIMA_CM}
          step={1}
          value={agua}
          onChange={cambiarAgua}
        />
        <Boton onClick={soplar}>Soplar</Boton>
      </Tarjeta>

      {error && <Aviso tipo="info">{error}</Aviso>}

      <Tarjeta>
        <ValorDestacado
          grande
          valor={{ etiqueta: 'Frecuencia', valor: frecuencia, unidad: 'Hz' }}
        />
        <p className="botellas-ayuda">La frecuencia es cuántas veces vibra el aire por segundo.</p>
      </Tarjeta>

      <Tarjeta>
        <Grafica grafica={crearGraficaSimulada(puntos)} />
      </Tarjeta>

      <Tarjeta>
        <fieldset className="botellas-prediccion">
          <legend className="botellas-etiqueta">Si llenas más la botella, el sonido será…</legend>
          {OPCIONES_PREDICCION.map((texto) => (
            <label key={texto} className="botellas-opcion">
              <input
                type="radio"
                name="prediccion"
                checked={opcion === texto}
                onChange={() => setOpcion(texto)}
              />
              {texto}
            </label>
          ))}
        </fieldset>
      </Tarjeta>

      <Boton disabled={!opcion} onClick={() => onContinuar(crearPrediccion(opcion))}>
        Continuar
      </Boton>
    </div>
  )
}

const ANCHO = 100
const ALTO = 200
const MARGEN = 4

function DibujoBotella({ agua, sonando }) {
  const altoInterior = ALTO - 2 * MARGEN
  const altoAgua = (agua / ALTURA_BOTELLA_CM) * altoInterior
  const anchoInterior = ANCHO - 2 * MARGEN

  return (
    <svg
      className="botellas-dibujo"
      viewBox={`0 0 ${ANCHO} ${ALTO}`}
      role="img"
      aria-label={`Botella recta con ${agua} centímetros de agua`}
    >
      <rect
        className={sonando ? 'botellas-dibujo-sonando' : 'botellas-dibujo-aire'}
        x={MARGEN}
        y={MARGEN}
        width={anchoInterior}
        height={altoInterior - altoAgua}
      />
      <rect
        className="botellas-dibujo-agua"
        x={MARGEN}
        y={ALTO - MARGEN - altoAgua}
        width={anchoInterior}
        height={altoAgua}
      />
      {/* Abierta por arriba: el aire vibra como en un tubo cerrado solo por abajo. */}
      <path
        className="botellas-dibujo-vidrio"
        d={`M ${MARGEN} ${MARGEN} V ${ALTO - MARGEN} H ${ANCHO - MARGEN} V ${MARGEN}`}
      />
    </svg>
  )
}

import { useState } from 'react'
import { Aviso, Boton, CampoNumero, MuestraColor, formatear, normalizarTexto } from '../../core'
import { MUESTRAS_MINIMAS_KNN } from './estimarPh.js'

// Sustancias de pH conocido que hay en casi cualquier cocina.
const REFERENCIAS = [
  { sustancia: 'Agua', ph: 7 },
  { sustancia: 'Vinagre', ph: 3 },
  { sustancia: 'Bicarbonato', ph: 8.5 },
]

const colorCss = (m) => `rgb(${m.r}, ${m.g}, ${m.b})`

// Mide sustancias de pH conocido para que el k-NN aprenda con la luz y la cámara de esta clase.
// calibracion: [{ sustancia, r, g, b, ph }]. No se guarda: solo vive mientras dura la medición.
export default function PanelCalibracion({ lectura, calibracion, onCambio, onCerrar }) {
  const [otraNombre, setOtraNombre] = useState('')
  const [otraPh, setOtraPh] = useState(null)
  const [aviso, setAviso] = useState(null)

  const medida = (nombre) =>
    calibracion.find((m) => normalizarTexto(m.sustancia) === normalizarTexto(nombre))

  function medir(sustancia, ph) {
    if (!lectura?.valida) {
      setAviso('Ahora no veo bien el color. Apunta al vaso y espera a que salga el pH.')
      return false
    }
    const sinRepetir = calibracion.filter(
      (m) => normalizarTexto(m.sustancia) !== normalizarTexto(sustancia),
    )
    onCambio([...sinRepetir, { sustancia, ...lectura.rgb, ph }])
    setAviso(null)
    return true
  }

  function medirOtra() {
    const nombre = otraNombre.trim()
    if (!nombre || otraPh === null || otraPh < 1 || otraPh > 14) {
      setAviso('Escribe el nombre de la sustancia y su pH (de 1 a 14).')
      return
    }
    if (medir(nombre, otraPh)) {
      setOtraNombre('')
      setOtraPh(null)
    }
  }

  const otras = calibracion.filter((m) => !REFERENCIAS.some((r) => r.sustancia === m.sustancia))
  const faltan = Math.max(0, MUESTRAS_MINIMAS_KNN - calibracion.length)

  return (
    <div className="ph-seccion">
      <h2>Calibrar</h2>
      <p>
        Mide sustancias de las que ya sabes el pH. Así Kanga aprende cómo se ven los colores con
        esta luz y esta cámara.
      </p>

      <ul className="ph-muestras">
        {REFERENCIAS.map(({ sustancia, ph }) => {
          const hecha = medida(sustancia)
          return (
            <li key={sustancia} className="ph-calibracion-fila">
              <span className="ph-muestra">
                {hecha ? <MuestraColor color={colorCss(hecha)} /> : <span className="ph-hueco" />}
                <span className="ph-muestra-texto">
                  <strong>{sustancia}</strong>
                  <span className="ph-muestra-dato">
                    pH {formatear(ph)} · {hecha ? 'medida ✓' : 'sin medir'}
                  </span>
                </span>
              </span>
              <Boton variante="secundario" onClick={() => medir(sustancia, ph)}>
                {hecha ? `Repetir ${sustancia.toLowerCase()}` : `Medir ${sustancia.toLowerCase()}`}
              </Boton>
            </li>
          )
        })}
        {otras.map((m) => (
          <li key={m.sustancia} className="ph-muestra">
            <MuestraColor color={colorCss(m)} />
            <span className="ph-muestra-texto">
              <strong>{m.sustancia}</strong>
              <span className="ph-muestra-dato">
                pH {formatear(m.ph)} · {'medida ✓'}
              </span>
            </span>
            <button
              type="button"
              className="ph-boton-icono"
              onClick={() => onCambio(calibracion.filter((c) => c !== m))}
              aria-label={`Quitar ${m.sustancia}`}
            >
              ✕
            </button>
          </li>
        ))}
      </ul>

      <details className="ph-calibracion-otra">
        <summary>Añadir otra sustancia de pH conocido</summary>
        <div className="ph-seccion">
          <label className="ph-lista-etiqueta" htmlFor="ph-otra-nombre">
            Sustancia
          </label>
          <input
            id="ph-otra-nombre"
            className="ph-campo-texto"
            type="text"
            value={otraNombre}
            placeholder="Por ejemplo: limón"
            maxLength={30}
            onChange={(e) => setOtraNombre(e.target.value)}
          />
          <CampoNumero etiqueta="pH conocido" valor={otraPh} onCambio={setOtraPh} />
          <Boton variante="secundario" onClick={medirOtra}>
            Medir esta sustancia
          </Boton>
        </div>
      </details>

      {aviso && <Aviso tipo="error">{aviso}</Aviso>}
      {faltan > 0 ? (
        <Aviso tipo="info">
          Mide {faltan === 1 ? '1 sustancia más' : `${faltan} sustancias más`} para que Kanga use tu
          calibración.
        </Aviso>
      ) : (
        <Aviso tipo="exito">¡Listo! Kanga ya mide con tu calibración.</Aviso>
      )}
      <Boton onClick={onCerrar}>Volver a medir</Boton>
    </div>
  )
}

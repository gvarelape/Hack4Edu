import { useMemo, useRef, useState } from 'react'
import {
  Aviso,
  Boton,
  Cargando,
  Confirmacion,
  MuestraColor,
  Tarjeta,
  ValorDestacado,
  useCamara,
} from '../../core'
import EscalaPh from './EscalaPh.jsx'
import ListaMuestras from './ListaMuestras.jsx'
import PanelCalibracion from './PanelCalibracion.jsx'
import { crearResultado } from './crearResultado.js'
import { MUESTRAS_MINIMAS_KNN, estimarPh, tipoPh } from './estimarPh.js'
import { leerOrdenPredicho } from './ordenSustancias.js'
import useLecturaColor from './useLecturaColor.js'
import './ph.css'

const MUESTRAS_MINIMAS = 2
const SUSTANCIAS_SUGERIDAS = ['Vinagre', 'Agua', 'Bicarbonato']
const MUESTRAS_BASE = []

export default function Medicion({ prediccion, modoPrueba, onTerminar, onCancelar }) {
  const { videoRef, activa, error, iniciar, parar } = useCamara()
  const [calibracion, setCalibracion] = useState([])
  const [calibrando, setCalibrando] = useState(false)
  const muestrasKnn = useMemo(() => [...MUESTRAS_BASE, ...calibracion], [calibracion])
  const lectura = useLecturaColor(videoRef, activa, muestrasKnn)
  const [abriendo, setAbriendo] = useState(false)
  const [sustancia, setSustancia] = useState('')
  const [muestras, setMuestras] = useState([])
  const [aviso, setAviso] = useState(null)
  const [confirmarSalida, setConfirmarSalida] = useState(false)
  const selectorArchivoRef = useRef(null)
  const siguienteIdRef = useRef(1)

  const calibrado = calibracion.length >= MUESTRAS_MINIMAS_KNN
  // El pH se recalcula con las muestras actuales: si calibras después, también mejoran las ya guardadas.
  const muestrasConPh = useMemo(
    () => muestras.map((m) => ({ ...m, ph: estimarPh(m, muestrasKnn).ph })),
    [muestras, muestrasKnn],
  )

  // Si hay predicción, se proponen sus nombres: así luego se puede comparar el orden.
  const sugeridas = leerOrdenPredicho(prediccion) ?? SUSTANCIAS_SUGERIDAS

  async function abrir(opciones) {
    setAviso(null)
    setAbriendo(true)
    await iniciar(opciones)
    setAbriendo(false)
  }

  function elegirArchivo(evento) {
    const archivo = evento.target.files[0]
    evento.target.value = '' // para poder elegir otra vez el mismo archivo
    if (archivo) abrir({ archivo })
  }

  function guardar() {
    const nombre = sustancia.trim()
    if (!nombre) {
      setAviso('Escribe qué sustancia estás midiendo.')
      return
    }
    if (!lectura?.valida) {
      setAviso('Ahora no veo bien el color. Espera a que salga el pH.')
      return
    }
    const id = siguienteIdRef.current++
    setMuestras((anteriores) => [...anteriores, { id, sustancia: nombre, ...lectura.rgb }])
    setSustancia('')
    setAviso(null)
  }

  function terminar() {
    parar()
    onTerminar(crearResultado({ muestras: muestrasConPh, prediccion, calibrado }))
  }

  function cancelar() {
    if (muestras.length > 0) setConfirmarSalida(true)
    else onCancelar()
  }

  const libre = !activa && !abriendo

  return (
    <div className="ph-pantalla">
      <h1>Mide el color</h1>
      <p>
        Pon el folio blanco detrás del vaso y apunta para que el recuadro quede dentro del líquido.
      </p>

      {error && <Aviso tipo="error">{error}</Aviso>}
      {abriendo && <Cargando texto="Abriendo la cámara…" />}
      {libre && <Boton onClick={() => abrir()}>Abrir cámara</Boton>}
      {libre && modoPrueba && (
        <>
          <input
            ref={selectorArchivoRef}
            type="file"
            accept="video/*"
            hidden
            onChange={elegirArchivo}
          />
          <Boton variante="secundario" onClick={() => selectorArchivoRef.current?.click()}>
            Usar archivo de prueba
          </Boton>
        </>
      )}

      {activa && (
        <>
          <div className="ph-camara">
            <video ref={videoRef} className="ph-video" playsInline muted />
            <div className="ph-recuadro" aria-hidden="true" />
          </div>

          {calibrando ? (
            <Tarjeta>
              <PanelCalibracion
                lectura={lectura}
                calibracion={calibracion}
                onCambio={setCalibracion}
                onCerrar={() => setCalibrando(false)}
              />
            </Tarjeta>
          ) : (
            <>
              <Tarjeta>
                <div className="ph-seccion" aria-live="polite">
                  {lectura?.valida ? (
                    <>
                      <div className="ph-lectura">
                        <MuestraColor
                          color={`rgb(${lectura.rgb.r}, ${lectura.rgb.g}, ${lectura.rgb.b})`}
                          tamano="grande"
                        />
                        <div>
                          <ValorDestacado
                            valor={{
                              etiqueta: 'pH estimado',
                              valor: Math.round(lectura.ph * 10) / 10,
                              unidad: '',
                            }}
                            grande
                          />
                          <p className="ph-lectura-tipo">{tipoPh(lectura.ph)}</p>
                        </div>
                      </div>
                      <EscalaPh ph={lectura.ph} />
                      <p className="ph-nota">
                        {lectura.metodo === 'knn'
                          ? 'Midiendo con tu calibración.'
                          : 'Midiendo con la tabla general.'}
                      </p>
                    </>
                  ) : (
                    <Aviso tipo="info">{lectura?.mensaje ?? 'Buscando el color…'}</Aviso>
                  )}
                </div>
              </Tarjeta>

              <Tarjeta>
                <div className="ph-seccion">
                  <label className="ph-lista-etiqueta" htmlFor="ph-sustancia">
                    Sustancia
                  </label>
                  <input
                    id="ph-sustancia"
                    className="ph-campo-texto"
                    type="text"
                    value={sustancia}
                    placeholder="Por ejemplo: vinagre"
                    maxLength={30}
                    onChange={(e) => setSustancia(e.target.value)}
                  />
                  <div className="ph-chips">
                    {sugeridas.map((nombre) => (
                      <button
                        key={nombre}
                        type="button"
                        className="ph-chip"
                        onClick={() => setSustancia(nombre)}
                      >
                        {nombre}
                      </button>
                    ))}
                  </div>
                  {aviso && <Aviso tipo="error">{aviso}</Aviso>}
                  <Boton onClick={guardar} disabled={!lectura?.valida}>
                    Guardar muestra
                  </Boton>
                </div>
              </Tarjeta>

              <Boton variante="secundario" onClick={() => setCalibrando(true)}>
                {calibrado ? 'Revisar la calibración' : 'Calibrar'}
              </Boton>
            </>
          )}
        </>
      )}

      <Tarjeta>
        <div className="ph-seccion">
          <h2>Tus muestras</h2>
          <ListaMuestras
            muestras={muestrasConPh}
            onBorrar={(id) => setMuestras((anteriores) => anteriores.filter((m) => m.id !== id))}
          />
        </div>
      </Tarjeta>

      {muestras.length < MUESTRAS_MINIMAS && (
        <p className="ph-nota">Guarda al menos {MUESTRAS_MINIMAS} muestras para terminar.</p>
      )}
      <Boton onClick={terminar} disabled={muestras.length < MUESTRAS_MINIMAS}>
        Terminar
      </Boton>
      <Boton variante="secundario" onClick={cancelar}>
        Cancelar
      </Boton>

      <Confirmacion
        abierta={confirmarSalida}
        texto="Si sales ahora, perderás las muestras que has guardado."
        textoAceptar="Salir sin guardar"
        onAceptar={onCancelar}
        onCancelar={() => setConfirmarSalida(false)}
      />
    </div>
  )
}

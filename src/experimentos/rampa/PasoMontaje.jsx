import { useRef, useState } from 'react'
import { Aviso, Boton, CampoNumero, Cargando } from '../../core'
import { senoInclinacion } from './fisica'

const TIPOS_BOLA = [
  { id: 'maciza', texto: 'Maciza (de goma o una canica grande)' },
  { id: 'hueca', texto: 'Hueca (como una de ping-pong)' },
]

// Primer paso: las medidas de la rampa y abrir la cámara.
export default function PasoMontaje({
  montaje,
  onCambiar,
  abriendo,
  error,
  modoPrueba,
  onAbrir,
  onCancelar,
}) {
  const [intentado, setIntentado] = useState(false)
  const selectorArchivoRef = useRef(null)

  const medidasValidas = senoInclinacion(montaje.altura, montaje.largo) !== null

  const comprobarYAbrir = (opciones) => {
    setIntentado(true)
    if (medidasValidas) onAbrir(opciones)
  }

  const elegirArchivo = (evento) => {
    const archivo = evento.target.files[0]
    evento.target.value = '' // para poder elegir otra vez el mismo archivo
    if (archivo) comprobarYAbrir({ archivo })
  }

  return (
    <div className="rampa-medicion">
      <h1>Prepara la medida</h1>
      <p>Mide tu rampa y escribe aquí los números.</p>

      <CampoNumero
        etiqueta="Altura de la rampa"
        valor={montaje.altura}
        onCambio={(altura) => onCambiar({ altura })}
        unidad="cm"
      />
      <CampoNumero
        etiqueta="Largo de la rampa"
        valor={montaje.largo}
        onCambio={(largo) => onCambiar({ largo })}
        unidad="cm"
      />

      <fieldset className="rampa-opciones">
        <legend>¿Cómo es tu bola?</legend>
        {TIPOS_BOLA.map(({ id, texto }) => (
          <label key={id} className="rampa-opcion">
            <input
              type="radio"
              name="rampa-tipo-bola"
              checked={montaje.tipoBola === id}
              onChange={() => onCambiar({ tipoBola: id })}
            />
            {texto}
          </label>
        ))}
      </fieldset>

      {intentado && !medidasValidas && (
        <Aviso tipo="error">
          Revisa las medidas: la altura tiene que ser mayor que 0 y menor que el largo.
        </Aviso>
      )}
      {error && <Aviso tipo="error">{error}</Aviso>}
      {abriendo && <Cargando texto="Abriendo la cámara…" />}

      <Boton disabled={abriendo} onClick={() => comprobarYAbrir()}>
        Abrir cámara
      </Boton>
      {modoPrueba && (
        <>
          <input
            ref={selectorArchivoRef}
            type="file"
            accept="video/*"
            hidden
            onChange={elegirArchivo}
          />
          <Boton variante="secundario" onClick={() => selectorArchivoRef.current.click()}>
            Usar archivo de prueba
          </Boton>
        </>
      )}
      <Boton variante="secundario" onClick={onCancelar}>
        Cancelar
      </Boton>
    </div>
  )
}

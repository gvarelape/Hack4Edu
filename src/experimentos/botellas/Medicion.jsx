import { useRef, useState } from 'react'
import {
  Aviso,
  Boton,
  CampoNumero,
  Cargando,
  Tabla,
  Tarjeta,
  ValorDestacado,
  useMicrofono,
} from '../../core'
import { DISPERSION_MAXIMA, MUESTRAS_MINIMAS, nivelEstabilidad } from './analisisAudio'
import { crearResultado } from './crearResultado'
import { velocidadSonido } from './modelo'
import { useLecturaTono } from './useLecturaTono'
import './botellas.css'

const MEDIDAS_MINIMAS = 3

export default function Medicion({ prediccion, modoPrueba, onTerminar, onCancelar }) {
  const microfono = useMicrofono()
  const { lectura, leerAhora, reiniciar } = useLecturaTono(microfono)
  const [abriendo, setAbriendo] = useState(false)
  const [altura, setAltura] = useState(null)
  const [medidas, setMedidas] = useState([])
  const [aviso, setAviso] = useState(null)
  const selectorArchivoRef = useRef(null)

  const arrancar = async (opciones) => {
    reiniciar()
    setAviso(null)
    setAbriendo(true)
    await microfono.iniciar(opciones)
    setAbriendo(false)
  }

  const elegirArchivo = (evento) => {
    const archivo = evento.target.files[0]
    evento.target.value = '' // para poder elegir otra vez el mismo archivo
    if (archivo) arrancar({ archivo })
  }

  const registrar = () => {
    if (!(altura > 0)) {
      setAviso('Escribe la altura del aire en centímetros.')
      return
    }
    const { estable, frecuencia } = leerAhora()
    if (!estable) {
      setAviso('No detecto un tono claro: sopla de forma continua.')
      return
    }
    setMedidas((anteriores) => [...anteriores, { alturaCm: altura, frecuencia }])
    setAltura(null)
    setAviso(null)
  }

  const borrar = (posicion) => {
    setMedidas((anteriores) => anteriores.filter((_, i) => i !== posicion))
  }

  const faltanMedidas = medidas.length < MEDIDAS_MINIMAS
  const sinVelocidad = !faltanMedidas && velocidadSonido(medidas) === null

  return (
    <div className="botellas-medicion">
      <h1>Mide el sonido</h1>

      {microfono.error && <Aviso tipo="error">{microfono.error}</Aviso>}
      {abriendo && <Cargando texto="Preparando el micrófono…" />}

      {!microfono.activo && !abriendo && (
        <Boton onClick={() => arrancar()}>Activar micrófono</Boton>
      )}

      {modoPrueba && (
        <>
          <input
            ref={selectorArchivoRef}
            type="file"
            accept="audio/*"
            hidden
            onChange={elegirArchivo}
          />
          <Boton variante="secundario" onClick={() => selectorArchivoRef.current.click()}>
            Usar archivo de prueba
          </Boton>
        </>
      )}

      {microfono.activo && (
        <>
          <LecturaEnDirecto lectura={lectura} />
          <Tarjeta>
            <CampoNumero
              etiqueta="Altura del aire"
              valor={altura}
              onCambio={setAltura}
              unidad="cm"
            />
            <p className="botellas-ayuda">Sopla de forma continua y pulsa mientras suena.</p>
            <Boton onClick={registrar}>Registrar</Boton>
          </Tarjeta>
        </>
      )}

      {aviso && <Aviso tipo="error">{aviso}</Aviso>}

      <ListaMedidas medidas={medidas} onBorrar={borrar} />

      {sinVelocidad && (
        <Aviso tipo="info">
          Con estas medidas no se puede calcular la velocidad del sonido. Prueba con alturas de aire
          bien distintas.
        </Aviso>
      )}

      {faltanMedidas && (
        <p className="botellas-ayuda">
          {`Necesitas al menos ${MEDIDAS_MINIMAS} medidas. Llevas ${medidas.length}.`}
        </p>
      )}
      <Boton
        disabled={faltanMedidas}
        onClick={() => onTerminar(crearResultado(medidas, prediccion))}
      >
        Terminar
      </Boton>
      <Boton variante="secundario" onClick={onCancelar}>
        Cancelar
      </Boton>
    </div>
  )
}

function LecturaEnDirecto({ lectura }) {
  const { estable, frecuencia, dispersion, muestras } = lectura
  const hayRuido = muestras >= MUESTRAS_MINIMAS && dispersion >= DISPERSION_MAXIMA
  const nivel = nivelEstabilidad(lectura)

  return (
    <Tarjeta>
      <ValorDestacado
        grande
        valor={{
          etiqueta: 'Frecuencia',
          valor: frecuencia === null ? null : Math.round(frecuencia),
          unidad: 'Hz',
        }}
      />
      <div
        className="botellas-barra"
        role="progressbar"
        aria-label="Estabilidad del tono"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(nivel * 100)}
      >
        <div
          className={`botellas-barra-relleno ${estable ? 'botellas-barra-estable' : ''}`}
          style={{ width: `${nivel * 100}%` }}
        />
      </div>
      <p className="botellas-ayuda">
        {estable ? 'Tono estable: pulsa Registrar.' : 'Sopla por encima de la boca, de lado.'}
      </p>
      {hayRuido && (
        <Aviso tipo="info">El tono cambia mucho. Busca un sitio sin ruido y sopla más suave.</Aviso>
      )}
    </Tarjeta>
  )
}

// La tabla de la pantalla lleva botones; la del resultado no, porque se guarda en el cuaderno.
function ListaMedidas({ medidas, onBorrar }) {
  if (medidas.length === 0) return null
  const tabla = {
    columnas: ['Aire (cm)', 'Hz', ''],
    filas: medidas.map(({ alturaCm, frecuencia }, i) => [
      alturaCm,
      Math.round(frecuencia),
      { boton: 'Borrar', onClick: () => onBorrar(i), peligro: true },
    ]),
  }
  return (
    <Tarjeta>
      <h2>Tus medidas</h2>
      <Tabla tabla={tabla} />
    </Tarjeta>
  )
}

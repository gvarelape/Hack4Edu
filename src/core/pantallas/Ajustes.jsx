import { useState } from 'react'
import Aviso from '../componentes/Aviso'
import Boton from '../componentes/Boton'
import BotonAtras from '../componentes/BotonAtras'
import Cargando from '../componentes/Cargando'
import Tarjeta from '../componentes/Tarjeta'
import useMovimiento from '../hooks/useMovimiento'
import usePreparacionSinInternet from '../hooks/usePreparacionSinInternet'
import { cambiarIdioma, idiomaActual, IDIOMAS } from '../lib/idioma'
import { cambiarPreferencia, leerPreferenciaMovimiento } from '../lib/movimiento'
import { navegar } from '../lib/rutas'
import { formatearTamano, haySoporteSinInternet } from '../lib/sinInternet'

// Para retirar el nivel 2 del asistente, a false: nadie podrá activarlo y seguirá el nivel 1.
const MOSTRAR_MODELO_ASISTENTE = true

// El modelo gasta unos 550 MB de memoria: no se ofrece si el móvil dice que tiene poca.
// Safari no lo dice: allí, si la app se cierra al cargarlo, no se vuelve a intentar.
const MEMORIA_MINIMA_GB = 4
const hayMemoriaParaModelo = () => !(navigator.deviceMemory < MEMORIA_MINIMA_GB)

const TAMANO_ASISTENTE = '52 MB'

const TEXTOS_ASISTENTE = {
  'no-descargado': 'Sin descargar',
  descargando: 'Descargando…',
  listo: 'Listo',
  error: 'No se ha podido activar. Puedes seguir preguntando: buscará por palabras.',
}

const TEXTOS_NIVEL = { basico: 'básico', normal: 'normal', reducido: 'reducido' }

function FilaDescarga({ titulo, tamano, texto, tipoAviso, descargando, progreso }) {
  return (
    <Tarjeta>
      <div className="core-pantalla">
        <h2>{titulo}</h2>
        {tamano && <p className="core-pantalla-nota">{`Ocupa ${tamano}`}</p>}
        {descargando ? (
          <Cargando texto="Descargando…" progreso={progreso ?? undefined} />
        ) : tipoAviso ? (
          <Aviso tipo={tipoAviso}>{texto}</Aviso>
        ) : (
          <p>{texto}</p>
        )}
      </div>
    </Tarjeta>
  )
}

export default function Ajustes() {
  const {
    activarAsistente,
    grupos,
    estadoAsistente,
    estadoDescargaAsistente,
    lista,
    preparando,
    preparar,
    tamanoPendiente,
  } = usePreparacionSinInternet()
  const nivel = useMovimiento()
  const [preferencia, setPreferencia] = useState(leerPreferenciaMovimiento)
  const compatible = haySoporteSinInternet()
  const hayFallos = grupos.some((grupo) => grupo.estado === 'error')
  const asistenteError = estadoAsistente === 'error' || estadoDescargaAsistente?.fallo === true
  const asistenteDescargando = estadoAsistente === 'descargando'

  return (
    <div className="core-pantalla">
      <BotonAtras onClick={() => navegar('/')} />
      <h1>Ajustes</h1>

      <h2>Usar sin internet</h2>
      {!compatible ? (
        <Aviso tipo="error">
          Este navegador no permite usar Kanga sin internet. Prueba con Chrome o Safari
          actualizados.
        </Aviso>
      ) : lista ? (
        <Aviso tipo="exito">Kanga ya está lista para usarse sin internet.</Aviso>
      ) : (
        <Aviso tipo="info">
          Todavía no está lista para usarse sin internet. Prepárala con wifi, en clase o en casa.
        </Aviso>
      )}

      {grupos.map((grupo) => (
        <FilaDescarga
          key={grupo.id}
          titulo={grupo.titulo}
          tamano={formatearTamano(grupo.tamano)}
          descargando={grupo.estado === 'descargando'}
          progreso={grupo.progreso}
          tipoAviso={grupo.estado === 'error' ? 'error' : null}
          texto={
            grupo.estado === 'error'
              ? grupo.mensaje
              : grupo.estado === 'listo'
                ? 'Listo'
                : 'Sin descargar'
          }
        />
      ))}

      {compatible && !lista && tamanoPendiente !== null && (
        <p>{`La descarga ocupa ${formatearTamano(tamanoPendiente)}.`}</p>
      )}

      {compatible && !lista && (
        <Boton onClick={preparar} disabled={preparando}>
          {hayFallos ? 'Volver a intentarlo' : 'Preparar para usar sin internet'}
        </Boton>
      )}

      {compatible && MOSTRAR_MODELO_ASISTENTE && hayMemoriaParaModelo() && (
        <>
          <h2>Pregunta a Kanga</h2>
          <FilaDescarga
            titulo="Búsqueda inteligente del asistente"
            tamano={TAMANO_ASISTENTE}
            descargando={asistenteDescargando}
            progreso={estadoDescargaAsistente?.progreso}
            tipoAviso={asistenteError ? 'error' : null}
            texto={asistenteError ? TEXTOS_ASISTENTE.error : TEXTOS_ASISTENTE[estadoAsistente]}
          />
          {estadoAsistente !== 'listo' && (
            <>
              <p className="core-pantalla-nota">
                Es opcional. Ayuda a Kanga a entender preguntas dichas con otras palabras.
                Descárgalo con wifi.
              </p>
              <Boton
                variante="secundario"
                onClick={activarAsistente}
                disabled={asistenteDescargando}
              >
                Activar búsqueda inteligente
              </Boton>
            </>
          )}
        </>
      )}

      <h2>Idioma</h2>
      <label className="core-campo">
        <span className="core-campo-etiqueta">Idioma de la app</span>
        <select
          className="core-campo-entrada"
          value={idiomaActual()}
          translate="no"
          onChange={(evento) => cambiarIdioma(evento.target.value)}
        >
          {Object.entries(IDIOMAS).map(([codigo, nombre]) => (
            <option key={codigo} value={codigo}>
              {nombre}
            </option>
          ))}
        </select>
      </label>

      <h2>Movimiento</h2>
      <label className="core-campo">
        <span className="core-campo-etiqueta">Animaciones de la app</span>
        <select
          className="core-campo-entrada"
          value={preferencia}
          onChange={(evento) => {
            setPreferencia(evento.target.value)
            cambiarPreferencia(evento.target.value)
          }}
        >
          <option value="auto">Automático, según tu móvil</option>
          <option value="basico">Básico: solo lo esencial</option>
          <option value="normal">Normal: con animaciones</option>
          <option value="reducido">Reducido: sin animaciones</option>
        </select>
      </label>
      <p className="core-pantalla-nota">{`Ahora mismo: ${TEXTOS_NIVEL[nivel]}.`}</p>
    </div>
  )
}

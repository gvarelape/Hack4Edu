import Aviso from '../componentes/Aviso'
import Boton from '../componentes/Boton'
import Cargando from '../componentes/Cargando'
import Tarjeta from '../componentes/Tarjeta'
import usePreparacionSinInternet from '../hooks/usePreparacionSinInternet'
import { navegar } from '../lib/rutas'
import { formatearTamano, haySoporteSinInternet } from '../lib/sinInternet'

// ASISTENTE.md: orden de magnitud del modelo. Nicolás confirma el tamaño real al montarlo.
const TAMANO_ASISTENTE = 'unos 100 MB'

const TEXTOS_ASISTENTE = {
  'no-descargado': 'Sin descargar',
  descargando: 'Descargando…',
  listo: 'Listo',
  error: 'No se ha podido descargar. Puedes seguir preguntando: buscará por palabras.',
}

function FilaDescarga({ titulo, tamano, texto, tipoAviso, descargando, progreso }) {
  return (
    <Tarjeta>
      <div className="core-pantalla">
        <h2>{titulo}</h2>
        {tamano && <p className="core-pantalla-nota">Ocupa {tamano}</p>}
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
  const { grupos, estadoAsistente, estadoDescargaAsistente, lista, preparando, preparar } =
    usePreparacionSinInternet()
  const compatible = haySoporteSinInternet()
  const hayFallos =
    grupos.some((grupo) => grupo.estado === 'error') || estadoDescargaAsistente?.fallo === true
  const asistenteError = estadoAsistente === 'error' || estadoDescargaAsistente?.fallo === true
  const asistenteDescargando = preparando && estadoDescargaAsistente && !asistenteError

  return (
    <div className="core-pantalla">
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

      <FilaDescarga
        titulo="Búsqueda inteligente del asistente"
        tamano={TAMANO_ASISTENTE}
        descargando={asistenteDescargando}
        progreso={estadoDescargaAsistente?.progreso}
        tipoAviso={asistenteError ? 'error' : null}
        texto={asistenteError ? TEXTOS_ASISTENTE.error : TEXTOS_ASISTENTE[estadoAsistente]}
      />

      {compatible && !lista && (
        <Boton onClick={preparar} disabled={preparando}>
          {hayFallos ? 'Volver a intentarlo' : 'Preparar para usar sin internet'}
        </Boton>
      )}

      <Boton variante="secundario" onClick={() => navegar('/')}>
        Volver al inicio
      </Boton>
    </div>
  )
}

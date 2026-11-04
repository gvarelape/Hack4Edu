// "Compartir con mi profe": pide el nombre la primera vez, prepara la imagen y la comparte.
// Va en dos toques porque iOS solo abre el menú de compartir justo después de tocar un botón,
// y preparar la imagen tarda un momento.
import { useEffect, useState } from 'react'
import { Aviso, Boton, Cargando } from '../core'
import { guardarPerfil, obtenerPerfil } from './almacen.js'
import { compartirImagen } from './compartir.js'
import { generarImagenFicha, nombreArchivoFicha } from './generarImagenFicha.js'

const MENSAJES = {
  compartido: {
    tipo: 'exito',
    texto: '¡Listo! Ya puedes ver la imagen en la conversación con tu profe.',
  },
  descargado: {
    tipo: 'info',
    texto: 'Hemos guardado la imagen en tu móvil. Mándasela a tu profe por WhatsApp o por correo.',
  },
  error: { tipo: 'error', texto: 'No hemos podido compartir la imagen. Vuelve a intentarlo.' },
  fallo: { tipo: 'error', texto: 'No hemos podido crear la imagen. Vuelve a intentarlo.' },
}

export default function CompartirFicha({ registro }) {
  // inicio · nombre · generando · lista
  const [fase, setFase] = useState('inicio')
  const [perfil, setPerfil] = useState(null)
  const [nombre, setNombre] = useState('')
  const [imagen, setImagen] = useState(null)
  const [mensaje, setMensaje] = useState(null)

  useEffect(() => {
    obtenerPerfil().then((leido) => {
      setPerfil(leido)
      setNombre(leido.nombre)
    })
  }, [])

  // Libera la vista previa al cambiarla o al salir de la pantalla.
  useEffect(() => () => imagen && URL.revokeObjectURL(imagen.url), [imagen])

  const preparar = async (nombreAlumno) => {
    setFase('generando')
    setMensaje(null)
    try {
      const blob = await generarImagenFicha(registro, { nombre: nombreAlumno })
      setImagen({ blob, url: URL.createObjectURL(blob) })
      setFase('lista')
    } catch {
      setMensaje('fallo')
      setFase('inicio')
    }
  }

  const empezar = () => {
    if (perfil?.existe) preparar(perfil.nombre)
    else setFase('nombre')
  }

  const confirmarNombre = async (nombreElegido) => {
    await guardarPerfil({ nombre: nombreElegido })
    const guardado = { nombre: nombreElegido.trim(), existe: true }
    setPerfil(guardado)
    preparar(guardado.nombre)
  }

  const enviar = async () => {
    const resultado = await compartirImagen(
      imagen.blob,
      nombreArchivoFicha(registro),
      registro.titulo,
    )
    setMensaje(resultado === 'cancelado' ? null : resultado)
  }

  return (
    <div className="cuaderno-compartir">
      {mensaje && <Aviso tipo={MENSAJES[mensaje].tipo}>{MENSAJES[mensaje].texto}</Aviso>}

      {fase === 'inicio' && (
        <Boton onClick={empezar} disabled={!perfil}>
          Compartir con mi profe
        </Boton>
      )}

      {fase === 'nombre' && (
        <form
          className="cuaderno-compartir-nombre"
          onSubmit={(evento) => {
            evento.preventDefault()
            confirmarNombre(nombre)
          }}
        >
          <label className="core-campo">
            <span className="core-campo-etiqueta">¿Cómo te llamas? (opcional)</span>
            <input
              className="core-campo-entrada"
              type="text"
              value={nombre}
              maxLength={40}
              autoComplete="given-name"
              onChange={(evento) => setNombre(evento.target.value)}
            />
          </label>
          <p className="core-pantalla-nota">
            Saldrá en la imagen para que tu profe sepa que es tuya. Solo se guarda en tu móvil.
          </p>
          <Boton onClick={() => confirmarNombre(nombre)}>Continuar</Boton>
          <Boton variante="secundario" onClick={() => confirmarNombre('')}>
            Seguir sin nombre
          </Boton>
        </form>
      )}

      {fase === 'generando' && <Cargando texto="Preparando la imagen…" />}

      {fase === 'lista' && imagen && (
        <>
          <p className="cuaderno-compartir-titulo">Así la verá tu profe:</p>
          <img
            className="cuaderno-vista-previa"
            src={imagen.url}
            alt={`Ficha de «${registro.titulo}» para compartir`}
          />
          <Boton onClick={enviar}>Enviar a mi profe</Boton>
          <Boton variante="secundario" onClick={() => setFase('nombre')}>
            Cambiar mi nombre
          </Boton>
        </>
      )}
    </div>
  )
}

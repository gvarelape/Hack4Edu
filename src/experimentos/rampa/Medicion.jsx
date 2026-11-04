import { useCallback, useEffect, useRef, useState } from 'react'
import { Aviso, Boton, useCamara } from '../../core'
import { analizarMovimiento, calcularEscala } from './analisisMovimiento'
import { crearResultado } from './crearResultado'
import { cargarDetector, centroEnImagen } from './detectorIA'
import { dibujarEscena } from './dibujoCamara'
import PanelGrabando from './PanelGrabando'
import PanelMarcas from './PanelMarcas'
import PanelPelota from './PanelPelota'
import PruebaSeguimiento from './PruebaSeguimiento'
import PanelRevision from './PanelRevision'
import PasoMontaje from './PasoMontaje'
import { mensajeEleccion } from './textosPelota'
import {
  comprobarEleccion,
  encontrarPorColor,
  tamanoReducido,
  TOLERANCIA_INICIAL,
} from './seguimientoColor'
import { useBuscarPelota } from './useBuscarPelota'
import { useSeguimiento } from './useSeguimiento'
import VistaCamara from './VistaCamara'
import './rampa.css'

const proporcion = (video) => video.videoWidth / video.videoHeight

export default function Medicion({ prediccion, modoPrueba, onTerminar, onCancelar }) {
  const camara = useCamara()
  const { videoRef } = camara
  const lienzoRef = useRef(null)
  const proporcionRef = useRef(null)

  const [montaje, setMontaje] = useState({ altura: null, largo: null, tipoBola: 'maciza' })
  const [abriendo, setAbriendo] = useState(false)
  const [conArchivo, setConArchivo] = useState(false)
  const [paso, setPaso] = useState('marcas') // 'marcas' | 'pelota' | 'grabando' | 'revision'
  const [marcas, setMarcas] = useState([])
  const [distancia, setDistancia] = useState(null)
  const [color, setColor] = useState(null)
  const [origenColor, setOrigenColor] = useState(null) // 'ia' | 'toque'
  const [haTocado, setHaTocado] = useState(false)
  const [tolerancia, setTolerancia] = useState(TOLERANCIA_INICIAL)
  const [avisoToque, setAvisoToque] = useState(null)
  const [pocaLuz, setPocaLuz] = useState(false)
  const [revision, setRevision] = useState(null)

  const escala = marcas.length === 2 ? calcularEscala(marcas[0], marcas[1], distancia) : null

  const dibujar = (pelota) => {
    const video = videoRef.current
    if (!lienzoRef.current || !video?.videoWidth) return
    const { ancho, alto } = tamanoReducido(video.videoWidth, video.videoHeight)
    dibujarEscena(lienzoRef.current, { marcas, pelota, ancho, alto })
  }

  const seguimiento = useSeguimiento({
    videoRef,
    activo: camara.activa,
    color,
    tolerancia,
    alFotograma: dibujar,
  })
  const { leerImagen } = seguimiento

  // Con el vídeo en pausa no llegan fotogramas: repinta cuando cambia lo que se ve.
  const redibujar = useCallback(() => {
    const video = videoRef.current
    const imagen = leerImagen()
    if (!lienzoRef.current || !imagen) return
    const pelota = color ? encontrarPorColor(imagen, color, tolerancia) : null
    const { ancho, alto } = tamanoReducido(video.videoWidth, video.videoHeight)
    dibujarEscena(lienzoRef.current, { marcas, pelota, ancho, alto })
  }, [videoRef, leerImagen, marcas, color, tolerancia])

  useEffect(redibujar, [redibujar])

  // Devuelve true si lo que ha visto la IA sirve: pasa las mismas comprobaciones que un toque.
  const aprenderDeLaIA = (deteccion) => {
    const imagen = leerImagen()
    if (!imagen) return false
    const { x, y } = centroEnImagen(deteccion, videoRef.current.videoWidth, imagen.width)
    const eleccion = comprobarEleccion(imagen, x, y, tolerancia)
    if (eleccion.problema) return false
    proporcionRef.current = proporcion(videoRef.current)
    setColor(eleccion.color)
    setOrigenColor('ia')
    setPocaLuz(eleccion.pocaLuz)
    return true
  }

  const { planB } = useBuscarPelota({
    videoRef,
    activo: camara.activa && paso === 'pelota' && color === null && !haTocado,
    alEncontrar: aprenderDeLaIA,
  })

  const abrir = async (opciones) => {
    setMarcas([])
    setColor(null)
    setHaTocado(false)
    setDistancia(null)
    setAvisoToque(null)
    setPocaLuz(false)
    setRevision(null)
    setPaso('marcas')
    proporcionRef.current = null
    setConArchivo(Boolean(opciones?.archivo))
    setAbriendo(true)
    const abierta = await camara.iniciar(opciones)
    // Se carga ya, sin esperar: así la búsqueda de 3 s empieza con el modelo listo. Si falla, plan B.
    if (abierta) cargarDetector().catch(() => {})
    setAbriendo(false)
  }

  const alCargarVideo = () => {
    // El vídeo de prueba espera en su primer fotograma hasta pulsar "Grabar".
    if (conArchivo) {
      videoRef.current.pause()
      videoRef.current.currentTime = 0
    }
    redibujar()
  }

  // Al girar el móvil, las marcas ya no están donde se tocaron: se piden otra vez.
  const alCambiarTamano = () => {
    const video = videoRef.current
    if (proporcionRef.current === null) return
    if (Math.abs(proporcion(video) - proporcionRef.current) < 0.05) return
    if (paso === 'grabando') seguimiento.terminar()
    proporcionRef.current = null
    setMarcas([])
    setColor(null)
    setHaTocado(false)
    setRevision(null)
    setPaso('marcas')
    setAvisoToque('Has girado el móvil: marca otra vez las cintas y déjalo quieto.')
  }

  const tocar = (evento) => {
    if (paso !== 'marcas' && paso !== 'pelota') return
    const imagen = leerImagen()
    if (!imagen) return
    const caja = videoRef.current.getBoundingClientRect()
    const x = ((evento.clientX - caja.left) / caja.width) * imagen.width
    const y = ((evento.clientY - caja.top) / caja.height) * imagen.height
    proporcionRef.current = proporcion(videoRef.current)
    setAvisoToque(null)

    if (paso === 'marcas') {
      setMarcas((anteriores) => (anteriores.length === 2 ? [{ x, y }] : [...anteriores, { x, y }]))
      return
    }
    const eleccion = comprobarEleccion(imagen, x, y, tolerancia)
    setHaTocado(true)
    setOrigenColor('toque')
    setPocaLuz(eleccion.pocaLuz)
    if (eleccion.problema) {
      setColor(null)
      setAvisoToque(mensajeEleccion(eleccion.problema))
    } else {
      setColor(eleccion.color)
    }
  }

  const grabar = () => {
    seguimiento.empezar()
    setRevision(null)
    setPaso('grabando')
    if (conArchivo) {
      videoRef.current.currentTime = 0
      videoRef.current.play().catch(() => {})
    }
  }

  const detener = () => {
    if (paso !== 'grabando') return
    if (conArchivo) videoRef.current.pause()
    const analisis = analizarMovimiento(seguimiento.terminar(), escala)
    setRevision({
      motivo: analisis.valido ? null : analisis.motivo,
      resultado: analisis.valido ? crearResultado(analisis, montaje, prediccion) : null,
    })
    setPaso('revision')
  }

  const repetir = () => {
    setRevision(null)
    setPaso('pelota')
    if (conArchivo) videoRef.current.currentTime = 0
  }

  if (!camara.activa) {
    return (
      <PasoMontaje
        montaje={montaje}
        onCambiar={(cambios) => setMontaje((actual) => ({ ...actual, ...cambios }))}
        abriendo={abriendo}
        error={camara.error}
        modoPrueba={modoPrueba}
        onAbrir={abrir}
        onCancelar={onCancelar}
      />
    )
  }

  return (
    <div className="rampa-medicion">
      <VistaCamara
        videoRef={videoRef}
        lienzoRef={lienzoRef}
        onToque={tocar}
        onEnded={detener}
        onResize={alCambiarTamano}
        onSeeked={redibujar}
        onLoadedData={alCargarVideo}
      />

      {avisoToque && <Aviso tipo="error">{avisoToque}</Aviso>}
      {pocaLuz && paso === 'pelota' && (
        <Aviso tipo="info">
          Hay poca luz. Si puedes, enciende una lámpara o acércate a una ventana.
        </Aviso>
      )}

      {paso === 'marcas' && (
        <PanelMarcas
          distancia={distancia}
          onDistancia={setDistancia}
          marcasCompletas={marcas.length === 2}
          escala={escala}
          onContinuar={() => setPaso('pelota')}
        />
      )}
      {paso === 'pelota' && (
        <PanelPelota
          color={color}
          origenColor={origenColor}
          buscando={color === null && !haTocado && !planB}
          noEncontrada={color === null && !haTocado && planB}
          tolerancia={tolerancia}
          onTolerancia={setTolerancia}
          onGrabar={grabar}
          onVolver={() => setPaso('marcas')}
        />
      )}
      {paso === 'grabando' && (
        <PanelGrabando puntos={seguimiento.estado.puntos} onParar={detener} />
      )}
      {paso === 'revision' && revision && (
        <PanelRevision revision={revision} onTerminar={onTerminar} onRepetir={repetir} />
      )}

      {modoPrueba && (paso === 'grabando' || paso === 'revision') && (
        <PruebaSeguimiento estado={seguimiento.estado} />
      )}

      <Boton variante="secundario" onClick={onCancelar}>
        Cancelar
      </Boton>
    </div>
  )
}

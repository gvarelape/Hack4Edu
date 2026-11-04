import { useCallback, useEffect, useMemo, useState } from 'react'
import { descargarModeloAsistente, estadoModeloAsistente } from '../../asistente'
import { experimentos } from '../../registro'
import {
  consultarTamano,
  descargarRecurso,
  estaListaSinInternet,
  estanEnCache,
  mensajeErrorDescarga,
} from '../lib/sinInternet'

const conRecursos = experimentos.filter((experimento) => experimento.recursos.length > 0)
const todosLosRecursos = conRecursos.flatMap((experimento) => experimento.recursos)

// Prepara un experimento y el modelo del asistente, cada uno con su estado y su progreso.
export default function usePreparacionSinInternet() {
  const [estados, setEstados] = useState({})
  const [tamanos, setTamanos] = useState({})
  const [estadoAsistente, setEstadoAsistente] = useState(estadoModeloAsistente)
  const [estadoDescargaAsistente, setEstadoDescargaAsistente] = useState(null)
  const [lista, setLista] = useState(false)
  const [preparando, setPreparando] = useState(false)

  const actualizarGrupo = useCallback((id, cambios) => {
    setEstados((actuales) => ({ ...actuales, [id]: { ...actuales[id], ...cambios } }))
  }, [])

  const comprobar = useCallback(async () => {
    const estado = estadoModeloAsistente()
    setEstadoAsistente(estado)
    setLista(await estaListaSinInternet(todosLosRecursos, estado))
  }, [])

  useEffect(() => {
    estaListaSinInternet(todosLosRecursos, estadoModeloAsistente()).then(setLista)
    conRecursos.forEach(async ({ id, recursos }) => {
      const [yaEsta, medidas] = await Promise.all([
        estanEnCache(recursos),
        Promise.all(recursos.map(consultarTamano)),
      ])
      if (yaEsta) actualizarGrupo(id, { estado: 'listo', progreso: 1 })
      // Si no se sabe el tamaño de algún archivo, no se da un total engañoso.
      const total = medidas.every(Number.isFinite) ? medidas.reduce((a, b) => a + b, 0) : null
      setTamanos((actuales) => ({ ...actuales, [id]: total }))
    })
  }, [actualizarGrupo])

  const prepararGrupo = useCallback(
    async ({ id, recursos }) => {
      actualizarGrupo(id, { estado: 'descargando', progreso: 0, mensaje: null })
      try {
        for (const [i, ruta] of recursos.entries()) {
          await descargarRecurso(ruta, (fraccion) => {
            const progreso = fraccion === null ? null : (i + fraccion) / recursos.length
            actualizarGrupo(id, { progreso })
          })
        }
        actualizarGrupo(id, { estado: 'listo', progreso: 1 })
      } catch (fallo) {
        actualizarGrupo(id, { estado: 'error', mensaje: mensajeErrorDescarga(fallo) })
      }
    },
    [actualizarGrupo],
  )

  const prepararAsistente = useCallback(async () => {
    setEstadoAsistente('descargando')
    setEstadoDescargaAsistente({ progreso: 0, fallo: false })
    try {
      await descargarModeloAsistente((progreso) => {
        setEstadoDescargaAsistente({ progreso: Number.isFinite(progreso) ? progreso : null })
      })
      setEstadoDescargaAsistente(null)
    } catch {
      setEstadoDescargaAsistente({ progreso: null, fallo: true })
    }
  }, [])

  const preparar = useCallback(async () => {
    setPreparando(true)
    // Pide al navegador que no borre lo descargado si le falta espacio. Si no puede, sigue igual.
    await navigator.storage?.persist?.().catch(() => {})
    for (const grupo of conRecursos) {
      // Lo que ya está en caché no se vuelve a descargar: reintentar solo baja lo que falta.
      await prepararGrupo(grupo)
    }
    if (estadoModeloAsistente() !== 'listo') await prepararAsistente()
    await comprobar()
    setPreparando(false)
  }, [comprobar, prepararAsistente, prepararGrupo])

  const grupos = useMemo(
    () =>
      conRecursos.map((experimento) => ({
        id: experimento.id,
        titulo: experimento.titulo,
        tamano: tamanos[experimento.id] ?? null,
        ...estados[experimento.id],
      })),
    [estados, tamanos],
  )

  // Lo que falta por bajar, para decirlo antes de empezar. null si no se sabe.
  const pendientes = grupos.filter((grupo) => grupo.estado !== 'listo')
  const tamanoPendiente =
    pendientes.length > 0 && pendientes.every((grupo) => Number.isFinite(grupo.tamano))
      ? pendientes.reduce((suma, grupo) => suma + grupo.tamano, 0)
      : null

  return {
    grupos,
    estadoAsistente,
    estadoDescargaAsistente,
    lista,
    preparando,
    preparar,
    tamanoPendiente,
  }
}

import { useEffect, useRef, useState } from 'react'
import { cargarRegistrosEjemplo } from '../../cuaderno'
import Aviso from '../componentes/Aviso'
import Cargando from '../componentes/Cargando'

export default function PruebaCuaderno() {
  const [error, setError] = useState(null)
  // StrictMode ejecuta dos veces el efecto: evita guardar los ejemplos por duplicado.
  const yaCargadoRef = useRef(false)

  useEffect(() => {
    if (yaCargadoRef.current) return
    yaCargadoRef.current = true
    cargarRegistrosEjemplo()
      .then(() => window.location.replace('#/cuaderno'))
      .catch((fallo) => setError(fallo?.message ?? 'Error desconocido'))
  }, [])

  if (error) return <Aviso tipo="error">No se han podido cargar los ejemplos: {error}</Aviso>
  return <Cargando texto="Cargando los registros de ejemplo…" />
}

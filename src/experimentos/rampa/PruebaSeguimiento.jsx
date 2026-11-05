import { formatear } from '../../core'

// Solo en el modo prueba: para comprobar en cada móvil que el tiempo avanza y la pelota se sigue.
export default function PruebaSeguimiento({ estado }) {
  const { puntos, fotogramas, tiempo } = estado
  const textoTiempo = tiempo === null ? '–' : `${formatear(tiempo, 2)} s`
  return (
    <p className="rampa-prueba" data-prueba="seguimiento">
      {`Prueba: tiempo del vídeo ${textoTiempo} · pelota en ${puntos} de ${fotogramas} fotogramas`}
    </p>
  )
}

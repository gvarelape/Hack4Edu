import { lazy, Suspense } from 'react'

// El asistente pesa y no hace falta para pintar la pantalla: se descarga justo después.
const BotonReal = lazy(() =>
  import('../../asistente').then((modulo) => ({ default: modulo.BotonAsistente })),
)
const PanelReal = lazy(() =>
  import('../../asistente').then((modulo) => ({ default: modulo.PanelAsistente })),
)

export function BotonAsistente(props) {
  return (
    <Suspense fallback={null}>
      <BotonReal {...props} />
    </Suspense>
  )
}

export function PanelAsistente(props) {
  return (
    <Suspense fallback={null}>
      <PanelReal {...props} />
    </Suspense>
  )
}

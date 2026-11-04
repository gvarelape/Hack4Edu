import LogoKanga from './LogoKanga'

export default function Cargando({ texto = 'Cargando…', progreso }) {
  const hayProgreso = Number.isFinite(progreso)
  const porcentaje = hayProgreso ? Math.round(Math.min(Math.max(progreso, 0), 1) * 100) : 0

  return (
    <div className="core-cargando" role="status">
      {!hayProgreso && (
        <span className="core-cargando-canguro">
          <LogoKanga />
        </span>
      )}
      <p>{texto}</p>
      {hayProgreso && (
        <div
          className="core-cargando-barra"
          role="progressbar"
          aria-label={texto}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={porcentaje}
        >
          <div className="core-cargando-relleno" style={{ width: `${porcentaje}%` }} />
        </div>
      )}
    </div>
  )
}

export default function BotonAtras({ onClick, etiqueta = 'Volver al inicio' }) {
  return (
    <button type="button" className="core-atras" onClick={onClick} aria-label={etiqueta}>
      <svg
        viewBox="0 0 24 24"
        aria-hidden="true"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
      >
        <path d="M20 12H5M11 5l-7 7 7 7" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </button>
  )
}

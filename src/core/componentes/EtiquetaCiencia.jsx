import { claveCiencia } from '../lib/ciencias'

// Iconos de DISENO.md: 24×24, trazo de 2 px y currentColor.
const ICONOS = {
  quimica: <path d="M9 3h6M10 3v6l-5 9a2 2 0 0 0 1.7 3h10.6a2 2 0 0 0 1.7-3l-5-9V3M7.5 15h9" />,
  fisica: (
    <>
      <path d="M3 8v12h18z" />
      <circle cx="11.4" cy="10.6" r="2.5" />
    </>
  ),
  sonido: <path d="M2 12h3l2-5 3 10 3-14 3 18 2-9h4" />,
}

export default function EtiquetaCiencia({ ciencia }) {
  const clave = claveCiencia(ciencia)
  return (
    <span className={`core-etiqueta-ciencia core-ciencia-${clave}`}>
      {ICONOS[clave] && (
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          {ICONOS[clave]}
        </svg>
      )}
      {ciencia}
    </span>
  )
}

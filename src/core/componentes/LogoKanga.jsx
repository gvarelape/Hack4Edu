// Una K de tinta con la bolsa del canguro. `trazoRef` permite dibujarla al abrir la app.
export default function LogoKanga({ trazoRef }) {
  return (
    <svg viewBox="0 0 56 56" aria-hidden="true">
      <path
        ref={trazoRef}
        d="M13 7c1 13-1 27 0 42M41 7C33 17 23 24 13 30c10 4 22 9 31 19M20 38c3 10 12 13 19 7"
        pathLength="1"
        fill="none"
        stroke="currentColor"
        strokeWidth="5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

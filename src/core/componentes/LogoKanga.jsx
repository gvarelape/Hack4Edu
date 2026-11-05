const SILUETA =
  'M42 1c0 5 0 8 1 11 1-4 3-7 6-10 0 4 0 8-1 11 5 1 10 4 13 9 1 2 0 3-2 3l-8 1c-3 1-4 4-4 7 1 6-1 11-3 15 3 3 4 6 4 9l11 3c2 1 2 4-1 4H32c-3 0-3-3-1-4l3-2-2-5c-9 3-19 6-29 11-2 1-3-1-2-2C9 56 15 50 17 41c2-12 10-21 22-24 1-5 2-11 3-16z'

export default function LogoKanga({ trazoRef }) {
  return (
    <svg viewBox="0 0 64 64" aria-hidden="true">
      <path ref={trazoRef} d={SILUETA} pathLength="1" fill="currentColor" stroke="currentColor" />
      <path d="M30 39c3 8 10 11 16 6l-1-9c-5 3-10 4-15 3z" className="core-logo-bolsa" />
    </svg>
  )
}

export default function Boton({ variante = 'principal', onClick, disabled = false, children }) {
  return (
    <button
      type="button"
      className={`core-boton core-boton-${variante}`}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  )
}

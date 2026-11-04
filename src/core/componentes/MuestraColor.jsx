export default function MuestraColor({ color, tamano = 'pequeno' }) {
  return (
    <span
      className={`core-muestra core-muestra-${tamano}`}
      style={{ backgroundColor: color }}
      role="img"
      aria-label={`Color ${color}`}
    />
  )
}

import { formatear } from '../lib/numeros'

export default function ValorDestacado({ valor, grande = false }) {
  const clase = grande ? 'core-valor core-valor-grande' : 'core-valor'

  return (
    <div className={clase}>
      <span className="core-valor-etiqueta">{valor.etiqueta}</span>
      <span className="core-valor-dato">
        <span className="core-valor-numero">{formatear(valor.valor)}</span>
        {valor.unidad && <span className="core-valor-unidad"> {valor.unidad}</span>}
      </span>
    </div>
  )
}

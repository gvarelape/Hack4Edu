import { formatear } from '../lib/numeros'
import MuestraColor from './MuestraColor'

export default function Tabla({ tabla }) {
  if (!tabla) return null
  const { columnas = [], filas = [] } = tabla
  const numericas = columnas.map(
    (_, i) => filas.length > 0 && filas.every((fila) => typeof fila[i] === 'number'),
  )
  const claseDe = (i) => (numericas[i] ? 'core-tabla-numero' : undefined)

  // Solo se desplaza la tabla, nunca la pantalla entera.
  return (
    <div className="core-tabla-marco" tabIndex={0}>
      <table className="core-tabla">
        <thead>
          <tr>
            {columnas.map((columna, i) => (
              <th key={i} scope="col" className={claseDe(i)}>
                {columna}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {filas.map((fila, f) => (
            <tr key={f}>
              {columnas.map((_, c) => (
                <td key={c} className={claseDe(c)}>
                  <Celda valor={fila[c]} />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function Celda({ valor }) {
  if (valor?.color) return <MuestraColor color={valor.color} />
  if (typeof valor === 'number') return formatear(valor)
  return valor ?? '–'
}

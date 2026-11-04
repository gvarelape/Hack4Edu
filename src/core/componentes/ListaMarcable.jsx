import { useId, useState } from 'react'

// Una lista que se va tachando mientras se prepara el experimento, con las manos ocupadas.
export default function ListaMarcable({ elementos, numerada = false }) {
  const id = useId()
  const [marcados, setMarcados] = useState(() => new Set())

  const cambiar = (indice) => {
    setMarcados((actuales) => {
      const siguientes = new Set(actuales)
      if (!siguientes.delete(indice)) siguientes.add(indice)
      return siguientes
    })
  }

  return (
    <ul className="core-marcable">
      {elementos.map((texto, i) => (
        <li key={i}>
          <label className="core-marcable-fila" htmlFor={`${id}-${i}`}>
            <input
              id={`${id}-${i}`}
              type="checkbox"
              checked={marcados.has(i)}
              onChange={() => cambiar(i)}
            />
            <span className="core-marcable-casilla" aria-hidden="true">
              {numerada && !marcados.has(i) && i + 1}
            </span>
            <span className="core-marcable-texto">{texto}</span>
          </label>
        </li>
      ))}
    </ul>
  )
}

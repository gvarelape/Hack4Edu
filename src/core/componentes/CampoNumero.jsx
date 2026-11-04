import { useId, useState } from 'react'
import { leerNumero } from '../lib/numeros'

// Guarda lo que escribe el alumno para no borrarle "3," a medias mientras llega a "3,5".
export default function CampoNumero({ etiqueta, valor, onCambio, unidad }) {
  const id = useId()
  const [texto, setTexto] = useState('')
  const valorActual = valor ?? null
  const coincide = leerNumero(texto) === valorActual
  const mostrado = coincide
    ? texto
    : valorActual === null
      ? ''
      : String(valorActual).replace('.', ',')
  const invalido = mostrado.trim() !== '' && leerNumero(mostrado) === null

  const cambiar = (evento) => {
    setTexto(evento.target.value)
    onCambio?.(leerNumero(evento.target.value))
  }

  return (
    <div className="core-campo">
      <label className="core-campo-etiqueta" htmlFor={id}>
        {etiqueta}
      </label>
      <div className="core-campo-fila">
        <input
          id={id}
          className="core-campo-entrada"
          type="text"
          inputMode="decimal"
          autoComplete="off"
          value={mostrado}
          onChange={cambiar}
          aria-invalid={invalido}
        />
        {unidad && <span className="core-campo-unidad">{unidad}</span>}
      </div>
      {invalido && <p className="core-campo-error">Escribe solo un número, por ejemplo 3,5.</p>}
    </div>
  )
}

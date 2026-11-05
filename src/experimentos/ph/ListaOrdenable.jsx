import { useRef, useState } from 'react'
import { Boton, normalizarTexto } from '../../core'
import { moverElemento } from './utilidades.js'

const MAXIMO_SUSTANCIAS = 8

// Lista que se reordena con botones de subir y bajar (en móvil funcionan mejor que arrastrar).
// Botón de icono propio: Boton ocupa todo el ancho.
export default function ListaOrdenable({ elementos, onCambio }) {
  const [nueva, setNueva] = useState('')
  const campoRef = useRef(null)

  const nombreNuevo = nueva.trim()
  const repetida = elementos.some((e) => normalizarTexto(e) === normalizarTexto(nombreNuevo))
  const puedeAnadir = nombreNuevo !== '' && !repetida && elementos.length < MAXIMO_SUSTANCIAS

  function anadir() {
    if (!puedeAnadir) return
    onCambio([...elementos, nombreNuevo])
    setNueva('')
    // Con ratón se sigue escribiendo. En el móvil no: el teclado taparía la lista recién cambiada.
    if (window.matchMedia('(pointer: fine)').matches) campoRef.current?.focus()
  }

  return (
    <div className="ph-lista">
      <ol className="ph-lista-elementos">
        {elementos.map((nombre, i) => (
          <li key={nombre} className="ph-lista-elemento">
            <span className="ph-lista-nombre">{nombre}</span>
            <button
              type="button"
              className="ph-boton-icono"
              onClick={() => onCambio(moverElemento(elementos, i, -1))}
              disabled={i === 0}
              aria-label={`Subir ${nombre}`}
            >
              ↑
            </button>
            <button
              type="button"
              className="ph-boton-icono"
              onClick={() => onCambio(moverElemento(elementos, i, 1))}
              disabled={i === elementos.length - 1}
              aria-label={`Bajar ${nombre}`}
            >
              ↓
            </button>
            <button
              type="button"
              className="ph-boton-icono"
              onClick={() => onCambio(elementos.filter((_, j) => j !== i))}
              aria-label={`Quitar ${nombre}`}
            >
              ✕
            </button>
          </li>
        ))}
      </ol>

      {elementos.length < MAXIMO_SUSTANCIAS && (
        <div className="ph-lista-anadir">
          <label className="ph-lista-etiqueta" htmlFor="ph-nueva-sustancia">
            Añadir otra sustancia
          </label>
          <input
            ref={campoRef}
            id="ph-nueva-sustancia"
            className="ph-campo-texto"
            type="text"
            value={nueva}
            placeholder="Por ejemplo: limón"
            maxLength={30}
            onChange={(e) => setNueva(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && anadir()}
          />
          {repetida && <p className="ph-lista-aviso">Esa sustancia ya está en la lista.</p>}
          <Boton variante="secundario" onClick={anadir} disabled={!puedeAnadir}>
            Añadir
          </Boton>
        </div>
      )}
    </div>
  )
}

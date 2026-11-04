import { useState } from 'react'
import { Boton, Tarjeta, formatear } from '../../core'
import EscalaPh from './EscalaPh.jsx'
import ListaOrdenable from './ListaOrdenable.jsx'
import { tipoPh } from './estimarPh.js'
import { textoPrediccion } from './ordenSustancias.js'
import { PH_INICIAL, colorPorPh, echarGota } from './vasoVirtual.js'
import './ph.css'

const ORDEN_POR_DEFECTO = ['Vinagre', 'Agua', 'Bicarbonato']

export default function Simulacion({ onContinuar }) {
  const [ph, setPh] = useState(PH_INICIAL)
  const [gotas, setGotas] = useState(0)
  const [orden, setOrden] = useState(ORDEN_POR_DEFECTO)

  function gota(sustancia) {
    setPh((actual) => echarGota(actual, sustancia))
    setGotas((n) => n + 1)
  }

  function vaciar() {
    setPh(PH_INICIAL)
    setGotas(0)
  }

  return (
    <div className="ph-pantalla">
      <Tarjeta>
        <div className="ph-seccion">
          <h2>Prueba con un vaso virtual</h2>
          <p>Echa gotas al agua de lombarda y mira cómo cambia de color.</p>

          <div className="ph-vaso" aria-hidden="true">
            <div className="ph-vaso-liquido" style={{ backgroundColor: colorPorPh(ph) }} />
          </div>

          <p className="ph-lectura-sim" aria-live="polite">
            pH {formatear(ph, 1)} · <strong>{tipoPh(ph)}</strong>
          </p>

          <EscalaPh ph={ph} />

          <div className="ph-botones">
            <Boton variante="secundario" onClick={() => gota('vinagre')}>
              Añadir una gota de vinagre
            </Boton>
            <Boton variante="secundario" onClick={() => gota('bicarbonato')}>
              Añadir una gota de bicarbonato
            </Boton>
            {gotas > 0 && (
              <Boton variante="secundario" onClick={vaciar}>
                Vaciar el vaso
              </Boton>
            )}
          </div>
        </div>
      </Tarjeta>

      <Tarjeta>
        <div className="ph-seccion">
          <h2>Tu predicción</h2>
          <p>
            Ordena las sustancias que vas a medir: arriba la <strong>más ácida</strong> y abajo la{' '}
            <strong>más básica</strong>.
          </p>
          <ListaOrdenable elementos={orden} onCambio={setOrden} />
        </div>
      </Tarjeta>

      {orden.length < 2 && <p className="ph-nota">Pon al menos dos sustancias para continuar.</p>}
      <Boton
        onClick={() => onContinuar({ texto: textoPrediccion(orden), valor: null })}
        disabled={orden.length < 2}
      >
        Continuar
      </Boton>
    </div>
  )
}

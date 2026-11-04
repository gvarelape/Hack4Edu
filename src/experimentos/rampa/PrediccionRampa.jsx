import { useState } from 'react'
import { Aviso, Boton, CampoNumero, Tarjeta } from '../../core'
import { crearPrediccion, rampaDesdeMedidas } from './simulacionRampa'

// Las medidas reales ponen la rampa virtual igual que la del alumno; él escribe su predicción.
export default function PrediccionRampa({ onPonerRampa, onContinuar }) {
  const [altura, setAltura] = useState(null)
  const [largo, setLargo] = useState(null)
  const [segundos, setSegundos] = useState(null)
  const [aviso, setAviso] = useState(null)

  const ponerRampa = () => {
    const rampa = rampaDesdeMedidas(altura, largo)
    if (!rampa) {
      setAviso('Revisa las medidas: la altura tiene que ser mayor que 0 y menor que el largo.')
      return
    }
    setAviso(
      rampa.recortada
        ? 'Tu rampa se sale de lo que admite la simulación: hemos puesto la más parecida.'
        : null,
    )
    onPonerRampa(rampa)
  }

  return (
    <Tarjeta>
      <div className="rampa-simulacion-bloque">
        <h2>Con TU rampa, ¿cuánto tardará en bajar?</h2>
        <p>Escribe las medidas de tu rampa y ponla en la simulación.</p>
        <CampoNumero
          etiqueta="Altura de la rampa"
          valor={altura}
          onCambio={setAltura}
          unidad="cm"
        />
        <CampoNumero etiqueta="Largo de la rampa" valor={largo} onCambio={setLargo} unidad="cm" />
        {aviso && <Aviso tipo="info">{aviso}</Aviso>}
        <Boton variante="secundario" onClick={ponerRampa}>
          Poner mi rampa en la simulación
        </Boton>
        <CampoNumero
          etiqueta="Creo que tardará"
          valor={segundos}
          onCambio={setSegundos}
          unidad="s"
        />
        <Boton disabled={!(segundos > 0)} onClick={() => onContinuar(crearPrediccion(segundos))}>
          Continuar
        </Boton>
      </div>
    </Tarjeta>
  )
}
